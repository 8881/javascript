/**
 * Created by gaojian08 on 16/8/28.
 */

var regexp1 = new RegExp('abc', 'ig');   //   /abc/i

var regexp2 = new RegExp(/abc/i);  // /abc/i

// es6新增
var regexp3 = new RegExp(/abc/ig, 'i');   // /abc/i  第二个参数修饰符会覆盖前边的修饰符

console.log(regexp3.flags);   // i   返回修饰符
console.log(regexp3.source);   // abc   返回正文


/*
 *  字符串的四个方法match(),replace(),search(),split(),es6在语言内部全部调用RegExp的实例方法,
 *  所以所有与正则相关的方法都定义在RegExp对象上.
 */


