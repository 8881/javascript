'use strict';

import Koa from "koa";

const app = new Koa();

app.use(async(ctx, next) => {
  ctx.body = `hello koa2. (es6)`;
});

app.listen(3000, () => {
  console.log(`[server] http://localhost:3000`);
});

// npm run es6
// npm run node
