'use strict';

const server = require('koa-server-module').server;

server.get(`/test`,{
  "code":200,
  "msg":"success",
  "data":"test ok."
});

server.listen(4000,()=>{
  console.log(`[server] http://localhost:4000`);
});

// node index.js
