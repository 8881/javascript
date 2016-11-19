/**
 * Created by G.J on 15/8/26.
 */
var express = require('express');
var bodyParse = require('body-parser');
var db = require('./dbconfig');

var app = express();
var router = express.Router();

/** 允许跨域配置 **/
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json());


app.use('/webapi', router);

router.get('/test', function (req, res) {
    db.getConnection(function (err, connect) {
        connect.query('select * from test limit 10', function (err, rows) {
            res.json({
                data: rows,
                code: 200,
                message: 'success'
            });
        });
    });
});

app.listen(1091);