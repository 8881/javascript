'use strict';

/*
 *  ES6中,有四类数据结构原生具备Iterator接口: 数组,类数组,Set,Map
 *  原生就具有遍历器接口,部署在Symbol.iterator属性上
 */

let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next();   // { value: 'a', done: false }
iter.next();   // { value: 'b', done: false }
iter.next();   // { value: 'c', done: false }
iter.next();   // { value: undefined, done: true }

// 对于类数组对象(存在数值键名和length属性),部署Iterator接口,Symbol.iterator直接引用数组的Iterator接口

function xxx() {
    console.log(arguments);
    arguments[Symbol.iterator] = [][Symbol.iterator];
    for (let item of arguments) {
        console.log(item);
    }
}

xxx(1, 2, 3, 4, 5, 6);

/* 只要某个数据结构部署了Iteratot接口,就可以对它使用扩展运算符,将其转为数组
 * let arr = [...iterable];
 */

var a = ['b', 'c', 'd', 'e'];

for (let item of a.entries()) {
    console.log(item);
}

