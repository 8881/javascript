/**
 * Created by G.J on 16/1/28.
 */

for(var i=0,len=10;i<len;i++){
  (function(xxx){
    setTimeout(function(){
      console.log(xxx);
    },1000);
  })(i)
}