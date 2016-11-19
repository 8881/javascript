'use strict';

const http = require('http');

const server = http.createServer(function (req, res) {
  res.end('hello koa.');
});

server.listen(3003, function () {
  console.log('[server] http://localhost:3003');
});
