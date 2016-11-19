(function($){
    // 动画暂停继续插件
        var $ = jQuery,
            pauseId = 'jQuery.pause',
            uuid = 1,
            oldAnimate = $.fn.animate,
            anims = {};

        function now() { return new Date().getTime(); }

        $.fn.animate = function(prop, speed, easing, callback) {
            var optall = $.speed(speed, easing, callback);
            optall.complete = optall.old; // unwrap callback
            return this.each(function() {
                // check pauseId
                if (! this[pauseId])
                    this[pauseId] = uuid++;
                // start animation
                var opt = $.extend({}, optall);
                oldAnimate.apply($(this), [prop, $.extend({}, opt)]);
                // store data
                anims[this[pauseId]] = {
                    run: true,
                    prop: prop,
                    opt: opt,
                    start: now(),
                    done: 0
                };
            });
        };

        $.fn.pause = function() {
            return this.each(function() {
                // check pauseId
                if (! this[pauseId])
                    this[pauseId] = uuid++;
                // fetch data
                var data = anims[this[pauseId]];
                if (data && data.run) {
                    data.done += now() - data.start;
                    if (data.done > data.opt.duration) {
                        // remove stale entry
                        delete anims[this[pauseId]];
                    } else {
                        // pause animation
                        $(this).stop();
                        data.run = false;
                    }
                }
            });
        };

        $.fn.resume = function() {
            return this.each(function() {
                // check pauseId
                if (! this[pauseId])
                    this[pauseId] = uuid++;
                // fetch data
                var data = anims[this[pauseId]];
                if (data && ! data.run) {
                    // resume animation
                    data.opt.duration -= data.done;
                    data.done = 0;
                    data.run = true;
                    data.start = now();
                    oldAnimate.apply($(this), [data.prop, $.extend({}, data.opt)]);
                }
            });
        };
    function Scroll(opt){
        this.ele = opt.ele;
        this.count = opt.count;
        this.width = opt.width;
        this.num = opt.num;
        this.container = opt.container;
        this.box = opt.box;
        this.leftFlag = 0;
        this.rightFlag = 0;
    }
    // 动态计算轮播容器的宽度
    Scroll.prototype.breadth = function(){
        var _this = this;
        _this.ele.css('width',''+(_this.count * _this.width)+'');
    };
    // 向左滚动
    Scroll.prototype.left = function(){
        var _this = this;
        _this.ele.animate({left: -( _this.count - _this.num ) * _this.width},(_this.count - 4)*2500,function(){
            _this.leftFlag = 1;
        });
    };
    // 向右滚动
    Scroll.prototype.right = function(callback){
        var _this = this;
        _this.ele.animate({left: 0},(_this.count - 4)*2500,function(data){
            _this.rightFlag = 1;
            callback(_this.rightFlag);
        });
    };
    // 暂停 - 继续
    Scroll.prototype.pauseResume = function(){
        var _this = this;
        _this.box.hover(function(){
            _this.ele.pause();
        },function(){
            _this.ele.resume();
        });
    };
    // 第一个轮播实例
    var slide1_opt = {
        ele : $('.P_slide_img'),   // 滑动体
        count : $('.P_slide_img li').length,    // 滑动块个数
        width : 245,   // 滑动块宽度
        num : 4,   //单屏显示滑动块个数
        container : $('.P_slide_container'),   // 滑动块容器
        box : $('.P_slide')   // 页面滑动体容器
    };
    var slide1 = new Scroll(slide1_opt);
        slide1.breadth();

    // 第二个轮播实例
    var slide2_opt = {
        ele : $('.Q_slide_img'),
        count : $('.Q_slide_img li').length,
        width : 183,
        num : 5,
        container : $('.Q_slide_container'),
        box : $('.Q_slide')
    };
    var slide2 = new Scroll(slide2_opt);
        slide2.breadth();

    // 轮播控制
    var manager = (function f(){
            var s1 = s2 = 0;
            // 初始向左滑动，延迟2秒
            setTimeout(function(){
                slide1.left();slide1.pauseResume();
                slide2.left();slide2.pauseResume();
            },2000);
            // 等待两个混动都滑动到左侧时，触发向右滑动
            setTimeout(function(){
                slide1.right(function(data){
                    s1 = data;
                    if(s1 == 1 && s2 ==1){
                        f();
                    }
                });
                slide1.pauseResume();

                slide2.right(function(data){
                    s2 = data;
                    if(s1 == 1 && s2 ==1){
                        f();
                    }
                });
                slide2.pauseResume();
            },(Math.max(slide1_opt.count , slide2_opt.count) -4)*2500+2000);
    })();
})($);
