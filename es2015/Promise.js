'use strict';

let promise = new Promise((resolve, reject) => {
    console.log('Promise');
    resolve();
});

promise.then(() => {
    console.log('then');
});

console.log('foo');

// Promise
// foo
// then

/***************************************************************/

var p = Promise.resolve();

p.then(() => {
    setTimeout((foo) => {
        console.log(foo);
    }, 2000, 1);
}).then(() => {
    console.log(2);
});

