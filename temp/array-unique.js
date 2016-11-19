/**
 * Created by G.J on 16/1/18.
 */
var arr = [1,3,4,5,2,2,3];

var foo1 = function(arr){
  console.time('foo1');
  var temp = [];
  for(var i=0,len=arr.length;i<len;i++){
    !~temp.indexOf(arr[i]) ? temp.push(arr[i]) : '';
  }
  console.timeEnd('foo1');
  return temp.sort();
};

console.log(foo1(arr));

var foo2= function(arr){
  console.time('foo2');
  var flag={},temp=[];
  for(var i=0,len=arr.length;i<len;i++){
    if(!flag[arr[i]]){
      temp.push(arr[i]);
      flag[arr[i]] = true;
    }
  }
  console.timeEnd('foo2');
  return temp.sort();
};

console.log(foo2(arr));


