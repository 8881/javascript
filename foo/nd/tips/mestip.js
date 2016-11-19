(function($){
    $.MesTips = function(msg,close){
        msg = msg?msg:'';
        close = close?close:false;

        //如果页面已经存在则返回
        if($('.mes-tip').length > 0){
            return;
        }

        var htmlStr = '<div class="mes-tip">\
                            <div class="mes-tip-body">\
                                <div class="mes-tip-msg" onselectstart="return false;">'+msg+'</div>\
                            </div>\
                            <div class="mes-tip-close">\
                                <div class="times">&times;</div>\
                            </div>\
                       </div>';
        $(document.body).append(htmlStr);
        setStyle();

        //设置样式
        function setStyle(){
            if($('.mes-tip-style').length == 0){
                var css = '<style class="mes-tip-style">.mes-tip{position:absolute;left:0;top:0;z-index:8888;height:100%;width:100%;background:#000;background:rgba(0, 0, 0, .3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr="#60000000", endColorstr="#60000000") alpha(opacity=50)}.mes-tip-body{padding:0 50px;overflow:hidden}.mes-tip-msg{background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.8);margin-top:250px;float:left;display:inline-block;font-family:"microsoft yahei";font-size:30px;color:#fff;padding:50px 50px;border-radius:8px;cursor:default}.mes-tip .mes-tip-close{position:absolute;right:-60px;top:-60px;width:120px;height:120px;background:rgba(0,0,0,.6);border-radius:50%;cursor:pointer}.mes-tip .mes-tip-close:hover{background:rgba(0,0,0,.4)}.mes-tip .mes-tip-close .times{position:absolute;left:25px;bottom:15px;color:#999;font:40px/50px "microsoft yahei"}.mes-tip .mes-tip-close:hover .times{color:#fff}</style>';
                $(document.body).append(css);
            }
            setsize();
        }

        //设置位置
        function setsize(){
            var mes_tip = $('.mes-tip-msg'),
                w = mes_tip.outerWidth(),
                window_w = $(window).width();
            if(w+100 <= window_w){
                mes_tip.css('margin-left',(window_w-w-100)/2+'px');
            }
        }

        //关闭事件
        if(close){
            $('.mes-tip-close').off('click').on('click',function(){
               $('.mes-tip').remove();
            });
        }else{
            $('.mes-tip-close').hide();
        }

        //窗口变化自适应
        $(window).resize(function(){
           setsize();
        });
    };
})(jQuery);