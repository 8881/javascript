'use strict';

function* helloWorldGenerator() {
  const hello = yield 'hello';
  const world = yield 'world';
  return `${hello} ${world}`;
}

const hw = helloWorldGenerator();


/** sample-1 **/
// console.log(hw.next());
// console.log(hw.next('hello'));
// console.log(hw.next('world'));


/** sample-2 **/
/**
 * 自动执行器
 * @param gen
 */
// function run(gen, callback) {
//   const g = gen();
//
//   function next(data) {
//     const res = g.next(data);
//     if (res.done) {
//       callback(res);
//       return res;
//     }
//     next(res.value);
//   }
//
//   next();
//
// }
// run(helloWorldGenerator, function (data) {
//   console.log(data);
// });

/** sample-3 co.js **/

// run generator.js
