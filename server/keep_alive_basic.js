var http = require('http');
var port = 5000;

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(port);