/**
 * Created by g.j on 16/4/4.
 */
$(function(){
    "use strict";
    var login = $('.login'),
        pwd = $('.pwd'),
        dialog = $('.dialog'),
        submit = $('.submit'),
        times = 0;

    login.on('click','.submit',function(){
        if(times > 5){
            submit.attr('disabled',true);
        }
       if(!pwd.val().trim()){
           log('不输入怎么行');
           times++;
           return;
       }else{
           $.ajax({
               type:'POST',
               url:config.baseUrl + '/login',
               data:{
                 pwd:pwd.val().trim()  
               },
               success: function(res){
                   if(res.code == 200){
                       localStorage.setItem('check',Date.now());
                       window.location.href = './index.html';
                   }else{
                       log(res.msg);
                       times++;
                   }
               },
               error: function(){
                   log('再想想.');
                   times++;
               }
           });
       }
    }); 
});