/*
 *   【调用方式】
 *   ------------------------
 *   -------------------------------------------------------------------------------------------------------------------------------------
 *           【警示框】    无回调
 *           ---------
 *                      简写模式    $.msgbox.alert('xxxx');
 *                      正常模式    $.msgbox.alert({title:'系统提示', info:'xxxx'});
 *           ------------------------------------------------------------------------
 *
 *           【确认框】
 *           ---------
 *                      简写模式    $.msgbox.confirm('xxxx',function(data){
 *                                       //确认返回true，取消和关闭返回false
 *                                  });
 *                      正常模式    $.msgbox.confirm({title:'系统提示', info:'xxxx'},function(){
 *                                       //确认返回true，取消和关闭返回false
 *                                  });
 *           ------------------------------------------------------------------------
 *
 *           【输入框】
 *           ---------
 *                       $.msgbox.prompt({infoLeft:'生成',infoRight:'份试卷',validate:'自定义的验证规则的名称'},function(data){
 *                            //有输入时返回输入值，取消和关闭时返回false
 *                       });
 *   -------------------------------------------------------------------------------------------------------------------------------------
 */
(function($){
    $.msgbox = {
        foo : function(options ){
            var self = this;
            if(options instanceof Object || typeof options == 'undefined'){
                options = $.extend({}, $.msgbox.defaults, options);

                //判断是否已经存在弹框，若存在则不再添加
                if($('.mes-dialog').length > 0){
                    return;
                }

                var temp = '<div class="mes-dialog">\
                                <div class="mes-dialog-mask"></div>\
                                <div class="mes-dialog-container">\
                                    <div class="mes-dialog-header">\
                                        <div class="mes-dialog-title clearfix">'+options.title+'<span><a href="javascript:void(0);" class="mes-dialog-close">&times;</a></span></div>\
                                    </div>\
                                    <div class="mes-dialog-body">\
                                        <p class="text-center">'+options.info+'</p>\
                                    </div>\
                                    <div class="mes-dialog-btn">\
                                        <a href="javascript:void(0);" class="submitBtn">'+options.confirmBtn+'</a>\
                                        <a href="javascript:void(0);" class="cancelBtn" style="display:'+options.cancelVisible+'">'+options.cancelBtn+'</a>\
                                    </div>\
                                </div>\
                            </div>';
                $(document.body).append(temp);
                self.setStyle();
                self.resize();
                $(window).resize(function(){
                    self.resize();
                });
            }
        },
        setStyle : function(){
            if($('.msgbox-style').length == 0){
                var boxStyle ='<style class="msgbox-style">.mes-dialog-mask{position:absolute;left:0;top:0;width:100%;height:100%;background:#000;filter:alpha(opacity=30);opacity:.3;z-index:8888}.mes-dialog-container{position:fixed;top:50%;left:50%;background:#fff;box-shadow:1px 1px 7px -3px;z-index:9999;text-align:center;font-size:14px;width:402px;margin-left:-201px;margin-top:-117px;color:#666}.mes-dialog-container .mes-dialog-header{height:30px;padding:10px 0;text-align:left;border-bottom:1px solid #e1e4e6}.mes-dialog-container .mes-dialog-header .mes-dialog-title{border-left:5px solid #10aeb8;padding-left:10px;font:18px/30px "microsoft yahei"}.mes-dialog-container .mes-dialog-header .mes-dialog-title span{float:right;margin-right:20px;display:inline}.mes-dialog-container .mes-dialog-header .mes-dialog-title span a:hover{text-decoration:none}.mes-dialog-container .mes-dialog-body{padding:50px;border-bottom:1px solid #e1e4e6;text-align:center;overflow:hidden;font:14px/20px "simsun";position:relative}.mes-dialog-container .mes-dialog-body .info-left{margin:0 5px}.mes-dialog-container .mes-dialog-body .info-right{margin:0 5px}.mes-dialog-container .mes-dialog-body input{width:80px;height:35px;line-height:35px;text-align:center;font-size:16px;border:1px solid #bdbdbd}.mes-dialog-container .mes-dialog-body input:focus{border:1px solid #7ed3d9;color:#10aeb8;box-shadow:none;-webkit-box-shadow:none}.mes-dialog-container .mes-dialog-body .mes-input-error{position:absolute;left:155px;top:100px;color:#f00}.mes-dialog-container .mes-dialog-btn{text-align:center;padding:10px 0}.mes-dialog-container .mes-dialog-btn a{height:32px;font:14px/32px "simsun";text-decoration:none;display:inline-block;color:#fff;padding:0 40px;margin:0 10px;border-radius:3px;background:#10aeb8;cursor:pointer}</style>';
                $(document.body).append(boxStyle);
            }
        },
        resize : function(){
            $('.mes-dialog-mask').height(Math.max($(window).height(),$(document.body).height()));
        },
        destroy : function(){
            $('.mes-dialog').remove();
        }
    };

    //默认配置
    $.msgbox.defaults = {
        title : '系统提示',        //头部标题
        mask : true,               //是否需要遮罩
        info : '...',              //提示信息
        infoLeft : '',          //prompt时配置输入框左侧的文案
        infoRight : '',         //prompt时配置输入框右侧的文案
        validate : null,          //prompt时输入框的校验规则
        confirmBtn : '确定',         //确定按钮
        cancelBtn : '取消',          //取消按钮
        cancelVisible : '',           //取消按钮是否显示
        draggable: false          // todo
    };
    var _helpers = {
        alert : function(options){
            if(typeof options == 'object'){
                options.cancelVisible = 'none';
                options = $.extend({}, $.msgbox.defaults,options);
            }else if(typeof options == 'string'){
                options = $.extend({}, $.msgbox.defaults,{info:options,cancelVisible:'none'});
            }else{
                return;
            }

            $.msgbox.foo(options);
            $('.mes-dialog-close,.submitBtn').off('click').on('click',function(){
                $.msgbox.destroy();
            });
        },
        confirm : function(options,callback){
            if(typeof options == 'object'){
                options = $.extend({}, $.msgbox.defaults,options);
            }else if(typeof options == 'string'){
                options = $.extend({}, $.msgbox.defaults,{info:options});
            }else{
                return;
            }

            $.msgbox.foo(options);
            $('.mes-dialog-close,.cancelBtn').off('click').on('click',function(){
                $.msgbox.destroy();
                callback(false);
            });
            $('.submitBtn').off('click').on('click',function(){
                $.msgbox.destroy();
                callback(true);
            });
        },
        prompt : function(options,callback){
            options = $.extend({}, $.msgbox.defaults,options);
            $.msgbox.foo(options);
            var htmlStr = '<form name="vali" id="vali" method="post">\
                                <span class="info-left">'+options.infoLeft+'</span>\
                                <input type="text" class="prompt-text '+options.validate+' required" />\
                                <span class="info-right">'+options.infoRight+'</span>\
                            </form>\
                            <div class="mes-input-error"></div>';
            $('.mes-dialog-body').empty().append(htmlStr);
            jQuery.extend(jQuery.validator.messages,{ required:"不能为空." });
            $('#vali').validate({
                errorPlacement : function(error,element){
                    $('.mes-input-error').empty().append(error);
                }
            });
            $('.submitBtn').off('click').on('click',function(){
                var val = $('.prompt-text').val();
                if(!$('#vali').valid()){
                    return;
                }else{
                    $.msgbox.destroy();
                    callback(parseInt(val,10));
                }
            });
            $('.mes-dialog-close,.cancelBtn').off('click').on('click',function(){
                $.msgbox.destroy();
            });
        }
    };
    $.extend(true, $.msgbox, _helpers);
})(jQuery);
