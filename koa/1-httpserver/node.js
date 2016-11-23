'use strict';

const http = require('http');

const server = http.createServer(function (req, res) {
  res.end('Hello World.');
});

server.listen(3000, () => {
  console.log('[server] http://localhost:3000');
});

// node node.js