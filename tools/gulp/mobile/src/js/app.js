/**
 * Created by G.J on 15/12/29.
 */
$(function(){
  $(document).on('touchmove',function(e){
    e.preventDefault();
  });

  var len = $('.page').length,
      slider = $('.slider');

  $(document).on('swipeUp','.page',function(){
    if($(this).attr('data-id') == len){
      return;
    }
    $(this).next('.page').addClass('in'+(+$(this).attr('data-id') +1));
  })
  .on('swipeDown','.page',function(){
    if($(this).attr('data-id') == 1){
      return;
    }
    $(this).removeClass('in'+$(this).attr('data-id'));
  })
  .on('swipeLeft',function(){
    slider.addClass('show');
  })
  .on('swipeRight',function(){
    slider.removeClass('show');
  });
});