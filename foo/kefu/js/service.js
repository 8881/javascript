;(function($){
    var service = {
        jqSideSlider : $('#SideSlider'),
        init : function(opt){
            this.getTmpl(opt);
            this.addEvent();
        },
        // 添加模板到页面
        getTmpl : function(opt){
            var _this = this;
            var htmlStr = "";
            htmlStr += '<ul>';
            htmlStr += '	<li><img src="./images/kf.jpg" width="68" height="64" /><a class="entry">客服电话</a>';
            htmlStr += '		<div class="support-tip">';
            htmlStr += '		<div class="support-box">';
            htmlStr += '		<div class="suppbox-tit"><span>客服电话</span></div>';
            htmlStr += '		<div class="suppbox-list"><p>'+opt.tel+'</p></div>';
            htmlStr += '		</div>';
            htmlStr += '		</div>';
            htmlStr += '	</li>';
            htmlStr += '	<li><a class="entry" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin='+opt.qq+'&site=qq&menu=yes">QQ客服</a></li>';
            if(opt.link != ''){
                htmlStr += '	<li><a class="entry" href="'+opt.link+'">使用帮助</a></li>';
            }
            htmlStr += '</ul>';
            htmlStr += '<b class="close" title="关闭"></b>';
            _this.jqSideSlider.append(htmlStr).css({'top':opt.top,'left':opt.left});
        },
        // 添加事件
        addEvent: function(){
            var _this = this;
            _this.jqSideSlider.find("li").hover(function(){
                $(this).addClass('hover');
            },function(){
                $(this).removeClass('hover');
            });
            _this.jqSideSlider.find('.close').click(function(){
                _this.jqSideSlider.remove();
            });
        }
    };
    // 默认参数值
	var defaults = {
		top:0,     // 距离页面顶部的高度
		left:0,    //  距离屏幕中间的长度
		tel: "",   //  电话号码
        qq :"",    //  qq客服
        link:""    //  使用帮助  不配置此项页面不显示
	};
    $.fn.R_service = $.fn.R_service || function(opt){
        opt = $.extend({},defaults,opt);
        service.init(opt);
    };
})(jQuery);