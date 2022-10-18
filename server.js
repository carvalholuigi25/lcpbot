const express = require('express')
const path = require('path')
const nfetch = require('node-fetch')
const xml2js = require('xml2js')
const jsonServer = require('json-server')
const http = require('http')
const fs = require('fs')
const funcs = require(path.join(__dirname, 'functions.js'))
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const port = 3001

server.use(middlewares)

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.get("/api/feeds", (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8');
  var obj;
  
  fs.readFile(path.join(__dirname + '/feeds.json'), 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var id = req.query.id ? req.query.id : -1;
    var name = req.query.name ? req.query.name : "";
    var url = req.query.url ? req.query.url : "";
    var limit = req.query._limit ? req.query._limit : -1;
    var page = req.query._page ? req.query._page : 1;

    if(id != -1) {
      obj = obj.feeds.filter(x => x.id == id);
    }

    if(name != "") {
      obj = obj.feeds.filter(x => x.name == name);
    }

    if(url != "") {
      obj = obj.feeds.filter(x => x.url == url);
    }

    if(limit != -1 && page != -1) {
      obj = obj.feeds.slice((page - 1) * limit, page * limit);
     } else {
      obj = obj.feeds.slice(0, limit);
     }

    res.jsonp(obj);
  });
})

server.get("/api/news", (req, res) => {
  var links_rss = require(path.join(__dirname + '/feeds.json'));
  var id = req.query.id ? req.query.id : 1;
  var title = req.query.title ? req.query.title : "";
  var str = ""; var srch = "";

  res.setHeader('Content-Type', 'application/json; charset=utf8');
  srch = links_rss.feeds;

  if(id >= 1) {
    srch = links_rss.feeds.filter(x => x.id == id);
  }

  if(title != "") {
    srch = links_rss.feeds.filter(x => x.name.includes(title));
  }

  funcs.getData(srch[0].url, "xml").then(x => {
    xml2js.parseString(x, { mergeAttrs: true }, (err, result) => {
      if(err) throw err;
      res.write(JSON.stringify(result, null, 2));
      res.end();
    });
  }).catch(err => console.log(err));
});

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/api/feeds\\?id=:id': '/feeds/:id',
  '/api/news\\?id=:id': '/news/:id'
}))

server.use(router)
http.createServer({}, server).listen(port, () => {
  console.log(`LCPMusicBot Api Server is running at the url: http://localhost:${port}/`)
})