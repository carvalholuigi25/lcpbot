const http = require('http');
const { createHttpTerminator } = require('http-terminator');

async function startServer(port = 5003, server) {
  const myserver = http.createServer(function(req, res) {
    res.write("I'm alive");
    res.end();
  }, server).listen(port);
  
  if (myserver != null) {
    await stopServer(myserver);
  }
}

async function stopServer(server) {
  const httpTerminator = createHttpTerminator({
    server,
  });
  
  await httpTerminator.terminate(); 
}

async function keepServerAlive(port = 5003, server = null, hour = 24, modetype = "normal") {
  server = server != null ? server : {};
  
  if (modetype == "timeout") {
    clearTimeout();
    setTimeout(async () => {
      await startServer(port, server);
    }, 60 * 60 * hour);
  } else if (modetype == "interval") {
    clearInterval();
    setInterval(async () => {
      await startServer(port, server);
    }, 60 * 60 * hour);
  } else {
    await startServer(port, server);
  }
}

module.exports = { startServer, stopServer, keepServerAlive };