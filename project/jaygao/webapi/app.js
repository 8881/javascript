/**
 * Created by G.J on 15/8/26.
 */
var express = require('express'),
    bodyParse = require('body-parser'),
    app = express(),
    router = express.Router();

var gxx = require('./gxx');

/** 允许跨域配置 **/
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParse.urlencoded({ extended:true }));
app.use(bodyParse.json());

app.use('/webapi',gxx);

app.use(function(req,res,next){
    res.status(404).json({
        "code":400,
        "msg":"not found"
    });
});

app.use(function(req,res,next){
    res.status(500).json({
        "code":500,
        "msg":"服务器错误"
    });
});

app.listen(9207);
