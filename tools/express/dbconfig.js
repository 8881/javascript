/**
 * Created by G.J on 15/9/7.
 */
var mysql = require('mysql');

var dbconfig = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test',
    port: 3306
});

module.exports = dbconfig;