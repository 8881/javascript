/**
 * Created by G.J on 15/12/29.
 */
$(function(){
  
  var doc = $(document),
      slider = $('.slider');

  doc.on('touchmove',function(e){
    e.preventDefault();
  });

  doc.on('swipeRight',function(){
    slider.addClass('show');
  })
  .on('swipeLeft',function(){
    slider.removeClass('show');
  });

  //想去的地方
  var form = $('.form'),
      place = $('.place')
      added = $('.added ul');
  
  $.get(config.baseUrl + '/place',function(res){
    if(res.code == 200){
      var temp = '';
      res.data.forEach(function(item){
        temp += '<li>'+item.name+'</li>';
      });

      added.append(temp);
    }
  });

  //及时添加地名
  var add_place = function(place){
    added.prepend('<li>'+place+'</li>');
  };

  doc.on('click','.add-place',function(){
    if(!place.val()){
      log('不输入怎么行');
      return;
    }
    $.ajax({
      type:'POST',
      url:config.baseUrl + '/place/add',
      data:{
        place:place.val().trim()
      },
      success: function(res){
        if(res.code == 200){
          add_place(place.val().trim());
          place.val('');
        }else{
          log(res.msg);
        }
      },
      error: function(){
        log('服务器心情不好.');
      }
    });
  });


});