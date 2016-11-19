'use strict';

class Test {
    constructor() {
        this.xx = '11';
    }

    foo() {
        console.log(this.xx);
    }
}

let test = new Test();

test.foo();  // 11
console.log(typeof Test);   // function
console.log(Test === Test.prototype.constructor);   // true
console.log(Object.keys(Test));  // 类内部定义的方法是不可枚举的,这一点与ES5不一致
console.log(Object.getOwnPropertyNames(Test));  // ["constructor", "foo"]



