/**
 * Created by g.j on 16/4/4.
 */
var config = {
    baseUrl : 'http://23.88.58.151:9207/webapi'
};

var check = localStorage.getItem('check');
(function(){
    if(!check || check && (Date.now() - check > 43200000)){
        if(!/login/.test(location.href)){
            window.location.href = './login.html';
        }
        return;
    }else{
        if(/login/.test(location.href)){
            window.location.href = './index.html';
        }
    }
})();

var t;
var log = function(msg){
    var dialog = $('.dialog');
    dialog.empty().append('<p>'+msg+'</p>');
    if(t){
        clearTimeout(t);
    }
    t = setTimeout(function(){
        dialog.empty();
    },3000);
};