/**
 * Created by G.J on 16/1/22.
 */
var myModule = (function(){

  var xxx = {};

  xxx.privateFunc = function(arg){
    console.log('I\'m private function,'+arg);
  };

  xxx.privateFunc2 = function(arg){
    console.log('I\'m private function2,'+arg);
  };

  return xxx;
})();

myModule.privateFunc2('xxx');

console.log(myModule);