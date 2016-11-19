(function($){

    //构建数据
    (function(){
        var ul = $('.slider-container'), num= 8, temp='';
        for(var i=0;i<num;i++){
            temp += '<li><a href="javascript:void(0);">'+(i+1)+'</a></li>';
        }
        ul.append(temp);
    })();

    /******************************************************************/

    var slider = $('.slider-container'),
        slider_left = 0,
        prev = $('.slider-prev'),  //前一个
        next = $('.slider-next');  //后一个

    prev.off('click').on('click',function(){
        slider.children('li:last').insertBefore(slider.children('li:first')).css('margin-left','-230px').animate({'margin-left':0},200);
    });

    next.off('click').on('click',function(){
        slider.append(slider.children('li:first')).css('margin-left','230px').animate({'margin-left':0},200)
    });

})(jQuery);