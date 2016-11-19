/**
 * Created by G.J on 15/8/26.
 */
var express = require('express');
var bodyParse = require('body-parser');
var mysql = require('mysql');
var qiniu = require('qiniu');


qiniu.conf.ACCESS_KEY = 'oKjJCHepg17nTZUx3XUu6aELf5jPgSDBNmQj5K7x';
qiniu.conf.SECRET_KEY = 'sBfa_iyJa72ca3VAbxcgVTtX1NULN7bXRKPfbyvx';


/*var connect = mysql.createConnection({
 host: '127.0.0.1',
 user: 'root',
 password: '',
 database: 'node',
 port:3306
 });
 connect.connect();*/

var app = express();

/** 允许跨域配置 **/
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,If-Modified-Since");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.use(bodyParse.urlencoded({ extended:true }));
app.use(bodyParse.json());

var router = express.Router();

function PutPolicy(scope, callbackUrl, callbackBody, returnUrl, returnBody,
                   asyncOps, endUser, expires) {
  this.scope = scope || null;
  this.callbackUrl = callbackUrl || null;
  this.callbackBody = callbackBody || null;
  this.returnUrl = returnUrl || null;
  this.returnBody = returnBody || null;
  this.asyncOps = asyncOps || null;
  this.endUser = endUser || null;
  this.expires = expires || 3600;
}

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;

  return putPolicy.token();
}

router.get('/token',function(req,res,next){
  res.json({
    "uptoken":uptoken('countsheep')
  });
});

app.use('/webapi',router);

app.listen(8881);