'use strict';

const co = require('co');

function* helloWorldGenerator() {
  const hello = yield Promise.resolve('hello');
  const world = yield Promise.resolve('world');
  return `${hello} ${world}`;
}

const hw = helloWorldGenerator();

co(helloWorldGenerator).then(function(res){
  console.log(res);
});


