(function($){

    //构建数据
    (function(){
        var ul = $('.slider-container'), num= 9, temp='';
        for(var i=0;i<num;i++){
            temp += '<li><a href="javascript:void(0);">'+i+'</a></li>';
        }
        ul.append(temp);
    })();

    /******************************************************************/

    var slider = $('.slider-container'),
        slider_left = 0,
        prev = $('.slider-prev'),  //前一个
        next = $('.slider-next'),  //后一个
        cell_w = 230,  //滑块的宽度，slider的宽度+右边距
        slider_window = 920,  //滑动区域可视宽度
        slider_w = cell_w*slider.find('li').length;   //滑动区域的实际宽度

    prev.off('click').on('click',function(){
        doSlide(1);
    });

    next.off('click').on('click',function(){
        doSlide(-1);
    });

    function doSlide(arrow){
        var slider_left = parseInt(slider.css('left'),10);
        if(slider_left===0 && arrow === 1 || (Math.abs(slider_left)+slider_window === slider_w && arrow === -1) || slider.filter(':animated').length > 0){
            return;
        }
        slider.animate({left:slider_left + arrow*cell_w + 'px'},150);
    }

})(jQuery);