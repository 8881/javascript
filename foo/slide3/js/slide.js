(function($){
      var slide = {
           mode : {
               box : $('.S-box'),
               item : $('.S-item'),
               bar : $('.S-bar'),
               tip : $('.S-bar .item-title p'),
               nav : $('.S-bar .item-num'),
               total : $('.S-item').length,
               t : 0,
               m : 0
           },
           init : function(){
               var _this = this;
               _this.mode.item.first().show();
               // 滑动图导航小方块
               for(var i=0; i<_this.mode.total; i++){
                   _this.mode.nav.append('<a href="javascript:void(0);"><em>'+i+'</em></a>');
               }
               // 图片文字
               _this.mode.tip.text(_this.mode.item.first().attr('title'));
               _this.mode.nav.children('a').first().addClass('active');
           },
           // 手动选择切换
           manual : function(){
               var _this = this;
               _this.mode.nav.children('a').bind('mouseover',function(){
                   var index = parseInt($(this).children('em').text());
                   _this.loop(index);
               });
           },
           //自动播放
           auto : function(){
                 var _this = this;
                 _this.mode.t  = setInterval(function(){
                     _this.mode.m =  _this.mode.m >= (_this.mode.total-1) ? 0 : ++_this.mode.m;
                     _this.loop(_this.mode.m);
                 },5000);
           },
           //暂停
           pause : function(){
                 var _this = this;
                 _this.mode.box.bind('mouseover',function(){
                     clearInterval(_this.mode.t);
                 }).bind('mouseleave',function(){
                     _this.auto();
                 });
           },
           //切换函数
           loop : function(n){
                var _this = this;
                n = n >= (_this.mode.total) ? 0 : n;
                _this.mode.item.filter(':visible').fadeOut();
                _this.mode.item.eq(n).fadeIn();
                _this.mode.tip.text(_this.mode.item.eq(n).attr('title'));
               _this.mode.nav.children('a').eq(n).addClass('active').siblings().removeClass('active');
           },
           go : function(){
               this.init();
               this.manual();
               this.auto();
               this.pause();
           }
      };
      slide.go();
})(jQuery);