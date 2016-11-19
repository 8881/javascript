/**
 * Created by G.J on 15/12/29.
 */
$(function(){
  $(document).on('mousewheel', '.page', function(e){
    if(e.originalEvent.deltaY>0){
      $(e.currentTarget).next('.page').addClass('in');
    }else{
      $(e.currentTarget).removeClass('in');
    }
  });

});