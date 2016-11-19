'use strict';

var container = document.querySelector('.container');

var router = new Router();

router.init();

router.route('/home',function(){
    container.innerHTML = '首页';
});

router.route('/product',function(){
    container.innerHTML = '产品展示';
});

router.route('/about',function(){
    container.innerHTML = '关于我们';
});
