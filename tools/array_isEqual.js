'use strict';

var a = [1, 2, 3];
var b = [1, 2, 3];

Array.prototype.isEqual = function (arr) {

  function check(arr1, arr2) {
    for (var i = 0, len = arr1.length; i < len; i++) {
      var bool = arr2.some(function (item) {
        return Object.is(arr1[i], item);
      });
      if (!bool) return false;
    }
    return true;
  }

  return check(this, arr) && check(arr, this);
};


console.log(a.isEqual(b));
