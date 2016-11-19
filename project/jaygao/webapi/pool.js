/**
 * Created by G.J on 15/9/7.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'gxx',
    port:3306
});

module.exports = pool;