'use strict';
const server = require('koa-server-module').server;

server.get('/test',{
  code: 200
});

server.listen(9001);
