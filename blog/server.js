/**
 * Created by G.J on 15/8/26.
 */

'use strict';

var http = require('http');
var koa = require('koa');
var cors = require('kcors');
var api = require('./api');

var app = koa();

// API延迟时间配置
var DELAY = 0;

app.use(delay);
app.use(cors());
app.use(api.routes());

// 延迟响应中间件
function *delay(next) {
    yield new Promise(function (resolve, reject) {
        setTimeout(resolve, DELAY);
    });
    yield next;
}

app.use(function *(next) {
    this.body = '404';
});

var server = http.createServer(app.callback());
server.listen(8887, function () {
    var port = server.address().port;
    console.log('[server]: http://localhost:' + port);
});
