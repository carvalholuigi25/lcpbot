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

server.get("/feeds", (req, res) => {
  res.jsonp(require(path.join(__dirname + '/feeds.json')));
})

server.get("/news", (req, res) => {
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
  '/api/*': '/$1'
}))

server.use(router)
http.createServer({}, server).listen(port, () => {
  console.log(`LCPMusicBot Api Server is running at the url: http://localhost:${port}/`)
})