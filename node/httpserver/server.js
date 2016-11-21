'use strict';

const http = require('http');

const server = http.createServer(function (req, res) {
  res.end('hello node.');
});

server.listen(3000);
