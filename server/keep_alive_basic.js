const http = require('http');
const port = 5000;

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(port);