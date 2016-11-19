/**
 * Created by G.J on 15/9/7.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    pool = require('./pool'),
    router = express.Router(),
    marked = require( "marked" ),
    _ = require('lodash'),
    moment = require('moment'),
    md5 = require('md5');


marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

router.post('/login',function(req,res,next){
    pool.getConnection(function(error,connect){
        connect.query('select * from permission where pwd="'+md5(md5(req.body.pwd))+'"',function(err,rows){
            if(rows.length){
                // res.header('Set-Cookie','COFFEE='+Date.now()+',path=/;domain=localhost;max-age=360000');
                res.header('Set-Cookie','COFFEE='+Date.now());
                res.json({
                    code:200,
                    msg:'',
                    data:''
                });
            }else{
                res.json({
                    code:403,
                    msg:'再想想',
                    data:''
                });
            };
        });
    });
});

router.get('/place',function(req,res,next){
    pool.getConnection(function(error,connect){

        connect.query('select * from place order by id desc',function(err,rows){
                res.json({
                    "code":200,
                    "msg":"success",
                    "data": rows
                });

            connect.release();
        });
    })
});

router.post('/place/add',function(req,res,next){
    pool.getConnection(function(error,connect){
        connect.query('insert into place(name) values("'+req.body.place+'")',function(err,rows){
            
            if(rows.affectedRows){
                res.json({
                    code:200,
                    msg:'',
                    data:''
                });
            }else{
                res.json({
                    code:403,
                    msg:'再想想',
                    data:''
                });
            };
        });
    });
});


module.exports = router;