const express = require('express')
const path = require('path')
const jsonServer = require('json-server')
const http = require('http')
const fs = require('fs')
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

server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}))

server.use(router)
http.createServer({}, server).listen(port, () => {
  console.log(`LCPMusicBot Api Server is running at the url: http://localhost:${port}/`)
})