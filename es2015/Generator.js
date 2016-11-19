'use strict';

function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}

var a = foo(5);

console.log(a.next());  // x=5   5+1=6
console.log(a.next(3));  // y=2*3=6  6/3=2
console.log(a.next(2));  // x=5 y=2*3=6  z=2  5+6+2


function* gen() {
    yield 'start';
    yield* [1, 2, 3];
    yield 'end';
    return 'close';
}

var xx = gen();
console.log(xx.next());  // start
console.log(xx.next());  // 1
console.log(xx.next());  // 2
console.log(xx.next());  // 3
console.log(xx.next());  // end
console.log(xx.next());  // close
