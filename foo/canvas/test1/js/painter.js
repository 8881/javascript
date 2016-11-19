(function($){
    var painter = {
        canvas : '',   //画布容器
        canvas_w : '',   //画布的宽
        canvas_h : '',   //画布的高
        context : '',    //画布
        _mouseDown : false,   //鼠标是否按下
        _mouseX : '',   //鼠标横坐标
        _mouseY : '',   //鼠标纵坐标
        _clearBtn : '',   //清除按钮
        _revokeBtn : '',   //撤销按钮
        playback : '',   //回放
        data : [],   //绘画数据
        _textBtn : '',   //文字按钮
        _textField : '',   //添加文字
        _textInput : '',   //文字输入框
        _erasing : false,  //使用橡皮
        eraserRadius : 15,   //擦除半径值
        eraser : '',   //橡皮擦,
        touch : '',   //是否是手持设备
        startEvent : '',  //开始事件
        moveEvent : '',  //移动事件
        endEvent : '',  //结束事件
        pen : '',   //画笔

        init : function(){
            this.canvas = document.getElementById('canvas');
            this.canvas_h = canvas.height;
            this.canvas_w = canvas.width;
            if(!canvas.getContext){
                alert('不支持canvas绘画');
                return;
            }
            this.context = canvas.getContext('2d');
            this._clearBtn = document.getElementById('clearBtn');
            this._playBtn = document.getElementById('playBtn');
            this._textBtn = document.getElementById('textBtn');
            this._textField = document.querySelector('.text-field');
            this._textInput = document.querySelector('.text-input');
            this.eraser = document.querySelector('#eraser');
            this.pen = document.querySelector('#pen');
            this.touch =("createTouch" in document);//判定是否为手持设备
            this.startEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.moveEvent = this.touch ? "touchmove" : "mousemove";
            this.endEvent = this.touch ? "touchend" : "mouseup";
            this._btnEvent();
        },
        _btnEvent : function(){
            var _this = this;
            _this.canvas['on'+_this.startEvent] = function(e){
                _this._mouseDown = true;
                _this._mouseX = e.clientX - _this.canvas.parentNode.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
                _this._mouseY = e.clientY - _this.canvas.parentNode.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
            };
            _this.canvas['on'+_this.endEvent] = function(){
                _this._mouseDown = false;
                _this._mouseX = 0;
                _this._mouseY = 0;
            };
            _this.canvas['on'+_this.moveEvent] = function(e){
                var touch=_this.touch ? e.touches[0] : e;
                if(_this._mouseDown){
                    var mouseX = touch.clientX - _this.canvas.parentNode.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
                    var mouseY = touch.clientY - _this.canvas.parentNode.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
                    if(_this._erasing){
                        _this.resetEraser(mouseX,mouseY,touch);
                    }else{
                        _this.draw([_this._mouseX,_this._mouseY,mouseX,mouseY]);
                    }
                    //记录鼠标坐标，轨迹数据
                    _this.data.push([_this._mouseX,_this._mouseY,mouseX,mouseY,Date.now()]);
                    _this._mouseX = mouseX;
                    _this._mouseY = mouseY;
                }
            };
            //清除画布
            _this._clearBtn.onclick = function(){
                _this.clear();
            };
            //回放
            _this._playBtn.onclick  = function(){
                _this.context.clearRect(0,0,_this.canvas_w,_this.canvas_h);
                _this.context.beginPath();
                _this.redraw(_this.data, 0);
            };
            //橡皮
            _this.eraser.onclick = function(){
                _this._erasing = true;
            };
            //文字
            _this._textBtn.onclick = function(){
                _this._textField.style.display = 'block';
            };
            //文字确认
            _this._textInput.onblur = function(){
                _this.text(_this._textInput.value);
                _this._textField.style.display = 'none';
            };
            _this.pen.onclick = function(){
                _this._erasing = false;
            }
        },
        text : function(words){
            this.context.font = 'bold 16px microsoft yahei';
            this.context.fillText(words,700,700);
        },
        draw : function(arr){
            this.context.moveTo(arr[0],arr[1]);
            this.context.lineTo(arr[2],arr[3]);
            this.doDraw();
        },
        redraw : function(arr, index){
            var _this=this;
            setTimeout(function(){
                _this.time = arr[index+1][4] -arr[index][4];
                _this.context.moveTo(arr[index][0],arr[index][1]);
                _this.context.lineTo(arr[index][2],arr[index][3]);
                _this.doDraw();
                index++;
                if(index < arr.length - 1) {
                    _this.redraw(arr, index);
                }
            },_this.time);
        },
        doDraw : function(weight,color){
            weight?weight:weight=5;
            color?color:color='#333';
            this.context.lineWidth = weight;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.clearRect(0, 0, 2000, 2000);//它可以消除齿痕！
            this.context.strokeStyle = color;
            this.context.globalCompositeOperation = 'source-over';
            this.context.stroke();
        },
        clear : function(){
            this.context.clearRect(0,0,this.canvas_w,this.canvas_h);
            this.data = [];
            this.context.beginPath();
        },
        resetEraser:function(_x,_y,touch)
        {
            var _this=this;
            this.context.lineWidth = 30;
            /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
            _this.context.globalCompositeOperation = "destination-out";
            _this.context.beginPath();
            _this.context.arc(_x, _y, _this.eraserRadius, 0, Math.PI * 2);
            _this.context.fill();
            _this.context.globalCompositeOperation = "source-over";
        }
    };
    painter.init();


})(jQuery);
