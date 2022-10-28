var http = require('http');
var createHttpTerminator = require('http-terminator');

async function startServer(port, server) {
  http.createServer(function(req, res) {
    res.write("I'm alive");
    res.end();
  }, server).listen(port);

  if (server != null) {
    await stopServer(server);
  }
}

async function stopServer(server) {
  const httpTerminator = createHttpTerminator({
    server,
  });

  await httpTerminator.terminate();
}

async function keepServerAlive(port, server, hour = 24, modetype = "normal") {
  if (modetype == "timeout") {
    clearTimeout();
    setTimeout(() => {
      await startServer(port, server);
    }, 60 * 60 * hour);
  } else if (modetype == "interval") {
    clearInterval();
    setInterval(() => {
      await startServer(port, server);
    }, 60 * 60 * hour);
  } else {
    await startServer(port, server);
  }
}

module.exports = { startServer, stopServer, keepServerAlive };