const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const nfetch = require('node-fetch')
const xml2js = require('xml2js')
const jsonServer = require('json-server')
const fs = require('fs')
const conf = require(path.join(__dirname, 'config.js'))
const funcs = require(path.join(__dirname, 'functions.js'))
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(cors())
server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.use("/howler", express.static(path.join(__dirname, "/node_modules/howler/dist")));

server.get("/api/time", (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8');
  var id = req.query.id ? req.query.id : -1;
  var idv = 0;
  idv++;

  var obj = {
    time: [
      {
        id: idv,
        time: new Date().toUTCString(),
        timefrm: new Date().toISOString(),
        mytimezone: new Date().toLocaleDateString('pt-PT', { day: '2-digit', timeZoneName: 'long' }).slice(4),
        mytimezonename: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    ]
  };

  if (id != -1) {
    obj = obj.time.filter(x => x.id == id);
  }

  res.jsonp(obj);
})

server.get("/api/radio", (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8');
  var obj;

  fs.readFile(path.join(__dirname + '/data/radio.json'), 'utf8', function(err, data) {
    if (err) throw err;
    obj = JSON.parse(data).radio != null ? JSON.parse(data).radio : JSON.parse(data);
    var id = req.query.id ? req.query.id : -1;
    var title = req.query.title ? req.query.title : "";

    if (id != -1) {
      obj = obj.filter(x => x.id == id);
    }

    if (title != "") {
      obj = obj.filter(x => x.title == title);
    }

    res.jsonp(obj);
  });
});

server.get("/api/weather", (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8');
  var city = req.query.city ? req.query.city : "Braga";
  var country = req.query.country ? req.query.country : "pt";
  var state = req.query.state ? req.query.state : "";
  var units = req.query.units ? req.query.units : "metric";
  var lang = req.query.lang ? req.query.lang : "pt";
  var apiurl = ""; var params = ""; var saveToFile = false;

  state = country.indexOf("us") !== -1 ? `,${state},` : ",";
  params = `?q=${city}${state}${country}&appid=${conf.weatherToken}&units=${units}&lang=${lang}`;
  apiurl = `https://api.openweathermap.org/data/2.5/weather${params}`;

  funcs.getData(apiurl).then(x => {
    res.jsonp(x);

    if(saveToFile) {
      if (fs.existsSync(path.join(__dirname + '/data/weather.json'))) {
        fs.writeFile(path.join(__dirname + '/data/weather.json'), JSON.stringify(x, null, 2), 'utf8', function(err, data) {
          if (err) throw err;
          console.log("Written contents to file /data/weather.json!");
        });
      }
    }
  }).catch(err => console.log(err));
});

server.get("/api/feeds", (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8');
  var obj;

  fs.readFile(path.join(__dirname + '/data/feeds.json'), 'utf8', function(err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var id = req.query.id ? req.query.id : -1;
    var name = req.query.name ? req.query.name : "";
    var url = req.query.url ? req.query.url : "";
    var limit = req.query._limit ? req.query._limit : -1;
    var page = req.query._page ? req.query._page : 1;

    if (id != -1) {
      obj = obj.feeds.filter(x => x.id == id);
    }

    if (name != "") {
      obj = obj.feeds.filter(x => x.name == name);
    }

    if (url != "") {
      obj = obj.feeds.filter(x => x.url == url);
    }

    if (limit != -1 && page != -1) {
      obj = obj.feeds.slice((page - 1) * limit, page * limit);
    } else {
      if (limit != -1) {
        obj = obj.feeds.slice(0, limit);
      }
    }

    res.jsonp(obj);
  });
})

server.get("/api/news", (req, res) => {
  var links_rss = require(path.join(__dirname + '/data/feeds.json'));
  var id = req.query.id ? req.query.id : 1;
  var title = req.query.title ? req.query.title : "";
  var str = ""; var srch = "";

  res.setHeader('Content-Type', 'application/json; charset=utf8');
  srch = links_rss.feeds;

  if (id >= 1) {
    srch = links_rss.feeds.filter(x => x.id == id);
  }

  if (title != "") {
    srch = links_rss.feeds.filter(x => x.name.includes(title));
  }

  funcs.getData(srch[0].url, "xml").then(x => {
    xml2js.parseString(x, { mergeAttrs: true }, (err, result) => {
      if (err) throw err;
      res.write(JSON.stringify(result, null, 2));
      res.end();
    });
  }).catch(err => console.log(err));
});

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/api/feeds\\?id=:id': '/feeds/:id',
  '/api/news\\?id=:id': '/news/:id'
}));

server.use(router);
http.createServer({}, server).listen(5001);