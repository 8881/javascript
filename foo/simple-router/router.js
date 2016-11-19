'use strict';

var Router = function () {
    this.routes = {};
    this.curPath = '';
};

Router.constructor = Router;

var p = Router.prototype;

// 配置路由
p.route = function (path, callback) {
    this.routes[path] = callback || function () {
            console.log('请指定路由回调方法');
        };
};

// 页面刷新
p.flush = function () {
    var path = location.hash.slice(1) || '/';
    this.routes[path]();
};

// 页面初始化注册事件
p.init = function () {
    window.addEventListener('load', this.flush.bind(this), false);
    window.addEventListener('hashchange', this.flush.bind(this), false);
};
