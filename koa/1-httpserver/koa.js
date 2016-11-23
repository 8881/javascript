'use strict';

const koa = require('koa');
const app = koa();

app.use(function *() {
  this.body = 'Hello World.';
});

app.listen(3000, () => {
  console.log('[server] http://localhost:3000');
});

// node koa.js