/**
 * Created by gaojian08 on 16/8/29.
 */

'use strict';

var mysql = require('mysql2');

var pool = mysql.createPoolPromise({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blog'
});

/**
 * 数据库查询方法
 * @param sql  SQL语句
 * @param needsObj  是否需要返回对象,默认返回数组
 * @returns {*}
 */
var query = function (sql, needsObj) {
    return pool.getConnection().then(function (conn) {
        var res = conn.query(sql);
        conn.release();
        return res;
    }).then(function (res) {
        // console.log(res[0]);
        return {
            ok: true,
            res: needsObj ? res[0][0] : res[0]
        };
    }).catch(function (ex) {
        // console.log(ex);
        return {
            ok: false,
            res: ex.code
        };
    });
};

module.exports = query;
