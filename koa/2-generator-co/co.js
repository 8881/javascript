'use strict';

const co = require('co');

const gen = function*() {
  yield 'start';
  yield 'end';
  return 'close';
};

co(gen).then(function(res){
  console.log(res);
});

