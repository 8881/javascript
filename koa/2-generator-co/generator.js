'use strict';

function* gen() {
  yield 'start';
  yield 'end';
  return 'close';
}

const xx = gen();
console.log(xx.next());
console.log(xx.next());
console.log(xx.next());

// run generator.js
