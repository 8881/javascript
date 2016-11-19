/**
 * Created by gaojian on 15/11/7.
 */

//拍平数组 递归 闭包
var arr = [1,[2],[3,4,5],6];

var foo1 = function(){
  var newArr = [];

  var f = function(arr){
    arr.forEach(function(item){
      Array.isArray(item)?f(item):newArr.push(item);
    });
    return newArr;
  };

  return f(arr);
};

console.log(foo1(arr));

