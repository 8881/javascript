'use strict';

const Koa = require("koa");

const app = new Koa();

app.use(async(ctx, next) => {
  ctx.body = `hello koa2. (es5)`;
});

app.listen(3000, () => {
  console.log(`[server] http://localhost:3000`);
});

// npm run es5
