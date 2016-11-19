(function($){
    var viewModel = {

        touch : ("createTouch" in document), //判定是否为手持设备
        startEvent : this.touch ? "touchstart" : "mousedown", //支持触摸式使用相应的事件替代
        moveEvent : this.touch ? "touchmove" : "mousemove",
        endEvent : this.touch ? "touchend" : "mouseup",

        mode : {
            canvas : '',
            canvas_h : 600,
            canvas_w : 800,
            context : '',
            _lock : false,
            _mouseX : 0,
            _mouseY : 0,
            mouse_size : 5,
            pen_status : true,
            pen : '',
            pen_size: 10,
            pen_color: '#333333',
            eraser_status: false,
            eraser_size : 10,
            time : 0,
            data : [],
            erasing : false,
            bg_color: '#ffffff'
        },

        init : function(){
            var _this = this;
            _this.mode = ko.mapping.fromJS(_this.mode);
            _this.mode.canvas = document.querySelector('#canvas');
/*            _this.mode.canvas_h = _this.mode.canvas.height;
            _this.mode.canvas_w = _this.mode.canvas.width;*/
            if(!_this.mode.canvas.getContext){
                alert('不支持canvas绘画');
                return;
            }
            _this.mode.context = _this.mode.canvas.getContext('2d');
            ko.applyBindings(_this,$('.wrapper')[0]);
            _this.resize();
            _this._btnEvent();
        },
        resize : function(){
            this.mode.canvas_w($(window).width()-100);
            this.mode.canvas_h($(window).height()-280);
        },
        _btnEvent : function(){
            var _this = this;
            _this.mode.canvas['on'+_this.startEvent] = function(e){
                _this.mode._lock(true);
                _this.mode._mouseX = e.clientX - _this.mode.canvas.parentNode.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
                _this.mode._mouseY = e.clientY - _this.mode.canvas.parentNode.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
            };
            _this.mode.canvas['on'+_this.endEvent] = function(){
                _this.mode._lock(false);
                _this.mode._mouseX = 0;
                _this.mode._mouseY = 0;
            };
            _this.mode.canvas['on'+_this.moveEvent] = function(e){

                var touch=_this.touch ? e.touches[0] : e;
                var mouseX = touch.clientX - _this.mode.canvas.parentNode.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
                var mouseY = touch.clientY - _this.mode.canvas.parentNode.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);

                if(_this.mode._lock()){
                    if(_this.mode.eraser_status()){
                        _this.resetEraser(mouseX,mouseY,touch);
                        //记录鼠标坐标，轨迹数据
                        _this.mode.data.push([_this.mode._mouseX,_this.mode._mouseY,mouseX,mouseY,Date.now(),_this.mode.eraser_size(),'#ffffff']);
                    }else{
                        _this.draw([_this.mode._mouseX,_this.mode._mouseY,mouseX,mouseY]);
                        //记录鼠标坐标，轨迹数据
                        _this.mode.data.push([_this.mode._mouseX,_this.mode._mouseY,mouseX,mouseY,Date.now(),_this.mode.pen_size(),_this.mode.pen_color()]);
                    }
                    _this.mode._mouseX = mouseX;
                    _this.mode._mouseY = mouseY;
                }
                $('#pen').css({'left':mouseX,'top':mouseY});
                $('#eraser').css({'left':mouseX,'top':mouseY});
            };

            _this.mode.canvas.onmouseleave = function(){
                _this.mode._lock(false);
            };

            //画笔拖动条
            $('#pen-size-slider').slider({
                orientation:'horizental',
                range:'min',
                min:1,
                max:100,
                value:_this.mode.pen_size(),
                slide:function(event,ui){
                    _this.mode.pen_size(ui.value);
                }
            });
            _this.mode.pen_size($('#pen-size-slider').slider('value'));

            //画笔取色板
            $('#pen-color-picker').bigColorpicker(function(ele,color){
                _this.mode.pen_color(color);
            });

            //橡皮擦拖动条
            $('#eraser-size-slider').slider({
                orientation:'horizental',
                range:'min',
                min:0,
                max:100,
                value:20,
                step:10,
                slide:function(event,ui){
                    _this.mode.eraser_size(ui.value);
                }
            });
            _this.mode.eraser_size($('#eraser-size-slider').slider('value'));

            //背景取色板
            $('#bg-color-picker').bigColorpicker(function(ele,color){
                _this.mode.bg_color(color);
            });
        },
        //使用画笔
        activePen : function(){
            this.mode.pen_status(true);
            this.mode.eraser_status(false);
        },

        //使用画笔
        activeEraser : function(){
            this.mode.pen_status(false);
            this.mode.eraser_status(true);
        },



        //画布大小
        canvaswh : function(){
            $('.wh-list').slideToggle();
        },

        //确认画布大小
        confirmwh: function(){
            $('.wh-list').slideUp();
        },

        //保存
        savePic : function(){
            var image = new Image(),_this = this;
            _this.mode.canvas.globalCompositeOperation = 'destination-out';
            _this.mode.context.fillStyle = '#ff0000';
            _this.mode.context.fillRect(0,0,800,600);
        },
        //回放
        playback : function(){
            var _this = this;
            $('#canvas-bg').addClass('.playback');
            if(_this.mode.data.length < 0){
                return;
            }
            _this.mode.context.clearRect(0,0,_this.mode.canvas_w(),_this.mode.canvas_h());
            _this.redraw(_this.mode.data(), 0);
        },
        redraw : function(arr, index){
            var _this=this;
            setTimeout(function(){
                _this.mode.context.beginPath();
                _this.mode.time = arr[index+1][4] -arr[index][4];

                //如果两笔之间的间隔时间太长，则修正为200ms
                if(_this.mode.time > 2000){
                    _this.mode.time = 500;
                }
                _this.mode.context.moveTo(arr[index][0],arr[index][1]);
                _this.mode.context.lineTo(arr[index][2],arr[index][3]);
                _this.mode.context.lineWidth = arr[index][5];
                _this.mode.context.strokeStyle = arr[index][6];
                _this.mode.context.closePath();
                _this.mode.context.stroke();
                index++;
                if(index < arr.length - 1) {
                    _this.redraw(arr, index);
                }
            },_this.mode.time);
        },

        //绘画
        draw : function(arr){
            var _this = this;
            _this.mode.context.beginPath();
            _this.mode.context.moveTo(arr[0]+_this.mode.pen_size()/2,arr[1]+_this.mode.pen_size()/2);
            _this.mode.context.lineTo(arr[2]+_this.mode.pen_size()/2,arr[3]+_this.mode.pen_size()/2);
            _this.mode.context.lineWidth = _this.mode.pen_size();
            _this.mode.context.lineJoin = 'round';
            _this.mode.context.lineCap = 'round';
            //_this.mode.context.clearRect(0, 0, 2000, 2000);//它可以消除齿痕！
            _this.mode.context.strokeStyle = _this.mode.pen_color();
            _this.mode.context.globalCompositeOperation = 'source-over';   //新的颜色覆盖之前的
            _this.mode.context.closePath();
            _this.mode.context.stroke();
        },

        //清除画布
        clear : function(){
            var _this = this;
            _this.mode.context.clearRect(0,0,_this.mode.canvas_w(),_this.mode.canvas_h());
            _this.mode.data([]);
        },

        //橡皮擦
        resetEraser:function(_x,_y,touch){
            /*使用橡皮擦-提醒*/
            var _this=this;
            _this.mode.context.globalCompositeOperation = "destination-out";   //新的颜色与之前颜色，重叠的部分消失
            _this.mode.context.beginPath();
            _this.mode.context.arc(_x+ _this.mode.eraser_size()/2, _y+ _this.mode.eraser_size()/2, _this.mode.eraser_size()/2, 0, Math.PI * 2);
            _this.mode.context.fillStyle = "#fff";
            _this.mode.context.closePath();
            _this.mode.context.fill();
        }
    };
    $(function(){
        viewModel.init();
        $(window).resize(function(){
            viewModel.resize();
        });
    });

})(jQuery);
