/**
 * Created by G.J on 15/12/29.
 */
$(function(){


  //tab切换
  var tabNav = $('.tab-content-nav'),
      tabContent = $('.tab-content-nav-content');
  tabNav.on('click','a',function(e){
    var id = $(e.currentTarget).attr('data-id');
    $(e.currentTarget).addClass('cur').siblings('a').removeClass('cur');
    tabContent.eq(id-1).show().siblings('.tab-content-nav-content').hide();
  });


});