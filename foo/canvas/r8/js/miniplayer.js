/*
 1 属性 layer_control
 2 方法名 名词在前 layAdd
 3 方法层次 只能高调用低
 4 空间
 5 方法第一个单词用相关的名词
 6 类定义第一个字母大写
 z = {
 COLOR: {}
 , PLAY: {}
 , DRAW: {}
 , LAYER: {}
 };
 */
$.FN({											//接收到数据后的处理		-> imgLoad / begin_10
    ALL: function (d, f) {
        if (!d)return;
        if (f == 'TL') {
            TL = d[0];
        }
        else if (f == 'MONGOFIND') {
        }
        else if (f == 'MONGOID') {
            var data = JSON.parse(d[0]);
            // var y = data[0].file;
            // var z = Mina.list[TL+y._id.$id];
            // var y = data[0];
            var y = data;
            var z = Mina.list[TL + y.id];
            y = y[0] || y;
            z.PLAY.pos_all = JSON.parse(z.uncompress(y.DATA));
            z.PLAY.step = z.PLAY.pos_all.length;
            z.PLAY.total_time = z.totalTimeCalc();

            z.BOARD.div.S({title: y.title + '  ' + y.nick});
            z.BOARD.img.H();

            z.BOARD.canvas_w = y.WIDTH;
            z.BOARD.canvas_h = y.HEIGHT;
            z.percent = 0;

            var bgarr = [];
            var imgarr = [];
            if (y.bg) {
                bgarr = JSON.parse(y.bg);
                for (var i = bgarr.length - 1; i >= 0; i--) {
                    var url = '';
                    z.imgLoad(url + bgarr[i][0], function (img) {
                        z.CACHE.cache[0][2] = img;
                        bgarr.shift();
                        if (!imgarr.length && !bgarr.length) {
                            z.begin_10();
                        }
                    })
                }
            }

            if (y.imgs) {
                if ($.F(y.imgs, '[')) {
                    imgarr = JSON.parse(y.imgs);
                } else {
                    imgarr = y.imgs.split(',');
                }
                var user_id;
                for (var i = imgarr.length - 1; i >= 0; i--) {
                    if (imgarr[i].split('.')[1]) {	//有后缀
                        user_id = imgarr[i].split('_')[1];
                        z.imgLoad('/product_img/' + user_id + '/' + imgarr[i], function (img) {
                            var a = img.src.split('.');
                            var b = a[a.length - 2].split('_');
                            var n = b[b.length - 1];
                            z.CACHE.cache[0][n] = img;
                            imgarr.shift();
                            if (!imgarr.length && !bgarr.length) {
                                z.begin_10();
                            }
                        })
                    } else {
                        imgarr.splice(i, 1);
                    }
                }
            }


            if (!imgarr.length && !bgarr.length) {
                z.begin_10();
            }
        }
        else if (f == 'MONGOFSSTORE') {
            var z = Mina.list[Mina.focus];
            z.TOOLS.pop.I('作品保存成功');

            //关闭弹出框

            setTimeout(function () {
                z.TOOLS.preview_main_div.H();
                z.TOOLS.pop.H();
            }, 1000);
        }
    }
});

function Mina(father_div, mongo_id, speed, autoplay) {
    var zid = father_div.ID_ + mongo_id;
    if (!Mina.list) {
        Mina.list = {};
    }
    var z = Mina.list[zid] = this;

    //命名空间
    z.BAR = {};
    z.CURSOR = {};

    z.BOARD = {
        canvas_w: 800
        , canvas_h: 600
        , color_r: 255
        , color_g: 255
        , color_b: 255
        , color_a: 1
        , scaling: 1
    };

    z.BRUSH = {
        is_rubber: 0
        , diameter: 5
        , speed_sens: 0.7
        , width_sens: 0.2
        , pos_smooth: 0.5
        , tail_extend: 0.3
        , circle_itv: 0.2
        , color_h: 0
        , color_s: 0
        , color_v: 0.3
        , color_a: 1
    };

    z.CACHE = {
        cache: [[]]
        , last_att: {}	//	记录此刻最新att，保存在CACHE的缓存里
        , his_att: {}	//	记录上一笔att，用于比较笔触的变化
    };

    z.PLAY = {
        playspeed: [1, 5, 30][$.B(0, 2, speed || 0)]
        , hua_inter: 2000
        , pos_inter: 50
        , pos_x: -1000			//circle_2 填充坐标横坐标
        , pos_y: -1			//circle_2 填充坐标纵坐标
        , pos_lw: 1				//circle_2 填充圆的半径
        , pos_p: 1				//circle_2 填充颜色，由压力转换
        , pos_all: []
        , I: 0
        , J: 0
        , now_process: 0
        , is_stop: 1
        , total_time: 0
    };

    z.LAYER = {
        layers: []
        , sequence: [0]
        , show_status: []
        , opacity: []
        , focus: 0
    };

    z.RECORD = {};
    //cbq begin
    if (mongo_id.indexOf('@-') > 0) {
        var MP3 = mongo_id.split('@-')[1];
        var mongo_id = mongo_id.split('@-')[0];
        if (MP3) {
            if ($.IS.I || $.IS.SF) {
                MP3 = MP3.replace(/.OGG/, '.mp3');
            }
            z.MP3 = $.c($.body, {src: '/teacherMp3/' + MP3}, 'audio');
        }
    }
    //cbq end
    z.SETTING = {
        zid: zid
        , mongo_id: mongo_id	//这里的mongo_id 去掉了@-后的音频文件
    };

    z.BOARD.div = $.C(father_div, {W: father_div.W_, H: father_div.H_, BG: '#ffffff'});

    //表示透明的黑白格
    z.BOARD.box_bg = $.C(z.BOARD.div, {BG: 'url(' + z.imgSource('bg.png') + ')'}).H();

    //首先加载全图
    z.BOARD.img = $.C(z.BOARD.div, {W: father_div.W_}, 'img');
    //游标
    z.CURSOR.div = $.C(z.BOARD.div, {Z: 39}, 'canvas').H();

    //播放进度层
    z.BAR.div = $.C(z.BOARD.div, {Z: 40, A: 0}).H();
    z.BAR.div_time = $.C(z.BAR.div, {F: 12, TA: 'right'});
    z.BAR.div_slide_bg = $.C(z.BAR.div, {L: 10, T: 7, H: 10, BG: '#8b9497', BR: '4px'});
    z.BAR.div_stop = $.C(z.BAR.div, {L: 0, W: 30, H: 25, G: z}, 'canvas');
    z.BAR.div_pause = $.C(z.BAR.div, {W: 30, H: 25, title: '暂停'}, 'canvas');
    z.BAR.div_play = $.C(z.BAR.div, {W: 30, H: 25, title: '播放'}, 'canvas');
    z.BAR.div_speed1 = $.C(z.BAR.div, {W: 30, H: 25, title: '半速', I: z.imgSet('slow.png')});
    z.BAR.div_speed2 = $.C(z.BAR.div, {W: 30, H: 25, title: '原速', I: z.imgSet('normal.png')});
    z.BAR.div_speed3 = $.C(z.BAR.div, {W: 30, H: 25, title: '高速', I: z.imgSet('fast.png')});
    z.BAR.div_fullscreen = $.C(z.BAR.div, {W: 30, H: 25, title: '全屏', I: z.imgSet('fullscreen.jpg')});
    z.BAR.div_slide = $.C(z.BAR.div_slide_bg, {T: -3, W: 16, H: 17, BG: 'url(' + z.imgSource('drag_icon.png') + ')'});

    z.BAR.div_stop.CTX.FS('#7f8789').FR(8, 5, 14, 14);
    z.BAR.div_pause.CTX.FS('#7f8789').FR(8, 5, 5, 14).FR(17, 5, 5, 14);
    z.BAR.div_play.CTX.M(8, 5).L(8, 19).L(20, 12).F('#7f8789');

    if (mongo_id) {
        if (autoplay == 'autoplay') {
            z.loadData();
        } else {
            var time_str = mongo_id.substring(0, 8);
            var timestamp = parseInt(time_str, 16) * 1000;
            var time = new Date(timestamp);
            var year = time.getYear() + 1900;
            var month = '0' + (time.getMonth() + 1);
            month = month.substring(month.length - 2);
            var date = '0' + time.getDate();
            date = date.substring(date.length - 2);

            var file = ['/drawboardIMG', year, month, date, 'p' + mongo_id].join('/');
            file += (father_div.W_ >= 600 ? '' : father_div.W_ <= 300 ? 's' : 'm');
            file += '.png';

            z.BOARD.img.S({src: file, G: z});

            if ($.VN(autoplay)) {
                z.on(z.BOARD.img, z.loadData);
            } else {
                setTimeout(function () {
                    z.loadData();
                }, autoplay);
            }
        }
    }
    ;

    setTimeout(function () {
        z.playerEvent_2();
        z.SETTING.mongo_id || z.beginDraw_6();
    }, 1);
}
Mina.prototype = {
    barFadeout: function (wait) {			//进度条即将隐藏
        var z = this;
        clearTimeout(z.BAR.timer1);
        clearTimeout(z.BAR.timer2);
        z.BAR.timer1 = setTimeout(function () {
            z.BAR.div.S({A: 0, TS: 1188});
        }, wait || 8888);
        z.BAR.timer2 = setTimeout(function () {
            z.BAR.div.H();
        }, (wait || 8888) + 1188);
    }
    , bgcSet: function () {				//设置画板背景色、笔触调试版背景色、调色板背景色
        var z = this;
        var y = z.BOARD;
        z.LAYER.layers[z.LAYER.focus].draw.CTX
            .CR()
            .FS('rgb(' + (y.color_r) + ',' + (y.color_g) + ',' + (y.color_b) + ')')
            .FR(0, 0, z.BOARD.canvas_w, z.BOARD.canvas_h);
    }
    , bgimgResize: function (n, img) {
        var z = this;
        var vw = z.BOARD.canvas_w;
        var vh = z.BOARD.canvas_h;
        var ww = img.naturalWidth;
        var hh = img.naturalHeight;
        var iwR = ww / vw;
        var ihR = hh / vh;
        var p = Math.max(iwR, ihR);
        var imgLeft = 0, imgTop = 0;

        if (ihR > iwR) {
            imgLeft = (vw - ww / p) / 2;
        }
        else {
            imgTop = (vh - hh / p) / 2;
        }

        z.LAYER.layers[n].draw.CTX
            .GC('source-over')
            .CR().DI(img, 0, 0, ww, hh, imgLeft, imgTop, ww / p, hh / p);
    }
    , cacheSave: function () {				//缓存当前各个层
        var z = this;
        var cache_order = Math.floor(z.PLAY.now_process / 10000);
        if (z.PLAY.J < 2 && cache_order && !z.CACHE.cache[cache_order]) {
            var canvas_img = [];
            z.temp2draw();
            var draw;
            for (var n in z.LAYER.layers) {
                if (z.LAYER.layers[n].changed == 1) {
                    draw = z.LAYER.layers[n].draw;
                    canvas_img[n] = $.C('', {W: draw.WIDTH_, H: draw.HEIGHT_}, 'canvas');
                    canvas_img[n].CTX.DI(draw.context, 0, 0);
                    z.LAYER.layers[n].changed = 0;
                }
            }
            z.CACHE.cache[cache_order] = {
                canvas_img: canvas_img
                , process: z.PLAY.now_process
                , att: JSON.stringify(z.CACHE.last_att)
                , i: z.PLAY.I
            }
        }
    }
    , call: function (obj, channel) {	//向后台请求数据
        $.FN('', '../php/call_ajax.php', '', '', channel);
        $.D(obj, channel);
    }
    , cursorMove: function (x, y, p) {			//移动笔尖 p<=1000
        var z = this;
        if (z.BOARD.type == 1 || z.CURSOR.type == 'm') {
            z.CURSOR.div.H();	//触屏手指画画及回放的时候/移动画布的时候，关闭光标
        } else {
            var w = z.CURSOR.div.W_ / 2 || 0;
            z.CURSOR.div.V().S({	//鼠标和笔画画及回放的时候，显示光标
                L: $.R(x - w)
                , T: $.R(y - w)
                , A: (p + 500) / 1500
            });
        }
    }
    , cursorSet: function (type) {			//设置笔尖周边光圈
        var z = this;
        type = type || z.CURSOR.type;
        if (type == 'z') {
            type = '-';
        }
        var d = type != 'b' && type != 'e'
            ? 40
            : $.B(0, 1000, z.BRUSH.diameter * z.BOARD.view_rate) + 6;			//调整后的直径

        if (z.CURSOR.last_d == d && z.CURSOR.type == type) return;

        z.CURSOR.type = type;

        var w = z.CURSOR.last_d || d;				//调整前的光圈直径
        z.CURSOR.last_d = d;						//调整后的光圈直径

        if (type == 'm') {
            z.DRAW.div.S({CS: z.TOOLS.sub_layer.isH() ? 'move' : 'cell'});
            return;
        } else {
            z.DRAW && z.DRAW.div.S({CS: 'none'});
        }

        var y = z.CURSOR.div;
        var r = d / 2;						//调整后的半径
        y.S({
            L: y.L_ + ((y.W_ || d) - d) / 2
            , T: y.T_ + ((y.H_ || d) - d) / 2
            , W: d
            , H: d
            , width: d
            , height: d
        });

        if (type == '+' || type == '-') {	//缩放状态显示放大镜
            var r = 7;
            y.CTX.CR()
                .SV().TL(13, 13)
                .B().LW(1).A(r, r, r - 1, 0, PI2).F('#ffffff').S('#000000')	//放大镜的圆
                .B().LW(2).M(r + 4, r + 4).L(r + 10, r + 10).S()
                .FS('#000000').FR(4, r - 1, r + r - 8, 2);

            if (type == '+') {
                y.CTX.FR(r - 1, 4, 2, r + r - 8);
            }
            y.CTX.RS();
        }
        else if (type == 'i') {	//吸色
            var l = 12;
            y.CTX.CR().LW(1).SV().TL(r + 1, r - 2).RT(-PI / 4.3)
                .B().A(0, 0, 1, 0, PI2)
                .SR(1.5, -1.5, l, 3)
                .SR(l + 1, -3.5, 3, 7)
                .SR(l + 5, -1.5, 4, 3)
                .LN(l + 5, 0.5, l + 8, 0.5)
                .S('#000000')
                .B().A(l + 2, 1.5, 2, 0, PI2).F('#000000')
                .RS();
        }
        else {	//type=='b' || type=='e'
            y.CTX.CR().LW(2)
                .B().A(r, r, r - 3, 0, PI2).S($.RGBA('#ffffff', 0.8))
                .B().A(r, r, r - 2, 0, PI2).S($.RGBA('#000000', 0.8));
            z.BRUSH.is_rubber = 0;
            if (type == 'e') {
                z.BRUSH.is_rubber = 1;
                var z = (r - 3) * 0.7;
                y.CTX
                    .B()
                    .M(r - z, r - z)
                    .L(r + z, r + z)
                    .M(r - z, r + z)
                    .L(r + z, r - z)
                    .S($.RGBA('#000000', 0.8));
            }
        }
    }
    , fillColor: function () {
        var z = this;
        var color = z.rgba(
            z.BOARD.color_r,
            z.BOARD.color_g,
            z.BOARD.color_b,
            z.BOARD.color_a
        );
        var hsv = z.rgb2hsv(z.BOARD.color_r, z.BOARD.color_g, z.BOARD.color_b);
        z.BOARD.color_h = hsv[0];
        z.BOARD.color_s = hsv[1];
        z.BOARD.color_v = hsv[2];
        if ($.VN(z.BOARD.focus)) {
            return;
        }
        z.LAYER.layers[z.BOARD.focus].draw.CTX
            .CR()
            .F(color)
            .FR(0, 0, z.BOARD.canvas_w, z.BOARD.canvas_h);
    }
    , focusSet: function () {
        var z = this;
        Mina.focus = z.SETTING.zid;
        y = this;
        return;
        $.EACH(Mina.list, function (a) {
            if (a.SETTING.zid == z.SETTING.zid) {
                a.BOARD.div.FATHER.S({BS: '0px 0px 20px yellow'});
            } else {
                a.BOARD.div.FATHER.S({BS: '0px 0px 20px #000000'});
            }
        });
    }
    , hsv2rgb: function (h, s, v) {		//hsv(360, 1, 1) 转化为 rgb [255, 255, 255]
        h = $.B(0, 360, h);
        s = $.B(0, 1, s);
        v = $.B(0, 1, v);

        var r = 0, g = 0, b = 0;
        h /= 60;
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
            default:
                break;
        }
        return [
            Math.floor(r * 255),
            Math.floor(g * 255),
            Math.floor(b * 255)
        ];
    }
    , imgLoad: function (url, callback) {	//加载图片，并执行会调
        var img = new Image();
        img.onload = function () {
            img.onload = null;
            callback(img);
        }
        img.src = url;
    }
    , imgSet: function (name, top) {		//格式化图标
        return "<img style='padding-left:6px; padding-top:6px; height: 14px' src='/i/miniplayer/" + name + "'>"
    }
    , imgSource: function (img) {
        return '/i/miniplayer/' + img;
    }
    , jiao: function (a) {				//让一个角处在 (-PI, PI) 之间
        return a < -PI ? a + PI2 :
            a > PI ? a - PI2 : a;
    }
    , layerAlphaSet: function (n, val) {			//图层透明度设置						-> layer_opacity.setPosInfo
        var z = this;
        val = $.VN(val) ? 1 : val;
        z.LAYER.opacity[n] = val;
        z.LAYER.layers[n].S({A: val});
        if (z.TOOLS) {
            z.TOOLS.layerControlArr[n].layer_opacity.setPosInfo(val * 100);
        }
    }
    , layerShowHide: function (n, v) {			//图层显示隐藏	1 强制开，-1 强制关，其它 切换
        var z = this;
        if (v == 1 || (v != -1 && z.LAYER.show_status[n] == 0)) {
            z.LAYER.layers[n].V();
            z.LAYER.show_status[n] = 1;
        } else {
            z.LAYER.layers[n].H();
            z.LAYER.show_status[n] = 0;
        }
    }
    , loadData: function (eobj) {			//点击请求绘画数据								-> call
        var z = eobj ? eobj.G_ : this;
        z.call({
            TL: z.BOARD.div.FATHER.ID_
            , MONGOID: z.SETTING.mongo_id
        }, z.SETTING.zid);
    }
    , minisec2SecMin: function (minisec) {		//毫秒转分秒
        var z = $.R(minisec / 1000);
        var sec = z % 60;
        var min = $.R((z - sec) / 60);
        return min + ':' + sec;
    }
    , num2arr: function (num) {			//'1,0,0,1' 或 9 转换成 [0,0,1]
        var z = this;
        var arr = [];
        var s = '' + num;
        if ($.F(s, ',')) {
            var y = s.split(',');
        } else {
            var y = num.toString(2).substring(1).split('');
        }
        for (var i = 0, l = y.length; i < l; i++) {
            arr[i] = +y[i];
        }
        return arr;
    }
    , num2seq: function (s) {
        var z = this;
        var arr = [];
        var s = '' + s;
        if ($.F(s, ',')) {
            var y = s.split(',');
        } else {
            var y = [];
            while (s.length > 0) {
                y.push(s.substring(0, 2));
                s = s.substring(2);
            }
        }
        for (var i = 0, l = y.length; i < l; i++) {
            arr[i] = +y[i];
        }
        return arr;
    }
    , on: function (eobj, event) {
        eobj.G_ = this;
        eobj.mousedown(event);
    }
    , preDraw: function () {				//单笔绘画的初始状态	原D.init
        $.E(this.PLAY, {
            pre_x: -1000
            , pos_x: -1000
            , speed: 0
            , pre_d: 0		//直径：记录上一个数值
            , smooth_d: 0			//直径：当前数值
            , p: 0
            , drawlist: []
            , pos_group: []
            , wait: -1000	//wait>0, circle_2不会移动光标
        });
    }
    , pressColorGet: function (p) {				//把压力转换成透明度，根据颜色参数得到颜色rgba值
        var z = this;
        p = $.VN(p) ? z.BRUSH.color_a : p * 0.001
        return z.rgba(
            z.BRUSH.color_r,
            z.BRUSH.color_g,
            z.BRUSH.color_b,
            p
        );
    }
    , quan: function (a, b, i) {		//加权
        return a * (1 - i) + b * i;
    }
    , rgb2hsv: function (r, g, b) {
        r = $.B(0, 255, r);
        g = $.B(0, 255, g);
        b = $.B(0, 255, b);

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        var v = max / 255;
        var delta = max - min;
        var s = max == 0 ? 0 : delta / max;

        var h = 0;
        if (delta == 0) {
            s = 0;
            h = 0;
        } else if (max == r && g >= b) {
            h = (g - b) * 60 / delta + 0;
        } else if (max == r && g < b) {
            h = (g - b) * 60 / delta + 360;
        } else if (max == g) {
            h = (b - r) * 60 / delta + 120;
        } else if (max == b) {
            h = (r - g) * 60 / delta + 240;
        }

        return [
            $.R(h),
            $.FX(s, 3),
            $.FX(v, 3)
        ];
    }
    , rgba: function (r, g, b, a) {
        return 'rgba(' +
            r + ',' +
            g + ',' +
            b + ',' +
            a + ')';
    }
    , setZ: function (n) {
        var z = this;
        return 20 + (z.PLAY && z.PLAY.version ? -n : -n);
    }
    , temp2draw: function () {				//temp_canvas贴到draw_canvas
        var z = this;
        //BOARD.canvas_temp.CTX 上画的颜色都是不透明的，temp_canvas 节点是有透明属性的
        //为了把透明效果DI到 BOARD.canvas_draw 上，直接DI不会有效果，所以
        //不得不用source-in状态，用透明色和原来的绘画内容叠加，在原来绘画着色区域用透明色代替
        z.BOARD.canvas_temp.CTX
            .GC('source-in')
            .FS(z.pressColorGet(z.BRUSH.color_a * 1000))
            .FR(0, 0, z.BOARD.canvas_temp.WIDTH_, z.BOARD.canvas_temp.HEIGHT_)
            .GC('source-over');

        //此时，DI 的内容就是透明色了
        //z.BOARD.canvas_draw.CTX.DI(z.BOARD.canvas_temp.context, -z.BOARD.canvas_draw.L_, -z.BOARD.canvas_draw.T_);
        z.BOARD.canvas_draw.CTX.DI(z.BOARD.canvas_temp.context, 0, 0);

        //把temp_canvas恢复source-over，并清空，准备下次的绘画
        z.BOARD.canvas_temp.CTX.CR();
    }
    , tempOpacitySet: function () {				//设置临时图层透明度
        var z = this;
        z.BOARD.canvas_temp.S({A: z.BRUSH.color_a});
    }
    , timestartSet: function (time) {			//何处才开始逐笔绘图
        var z = this;
        z.PLAY.time_sum = z.PLAY.now_process / z.PLAY.playspeed;			//变速播放时间统计
        z.PLAY.time_start = $.MS() - z.PLAY.time_sum;					//t_start决定了从何处才开始逐笔绘图
        z.PLAY.time_jump = time || 0;
    }
    , timetipSet: function () {				//设置进度条滑块位置
        var z = this;
        z.BAR.div_slide
            .animateStop()
            .S({L: z.PLAY.total_time == 0 ? 0 : (z.BAR.div_slide_bg.W_) * (z.PLAY.now_process / z.PLAY.total_time) - 5});
        z.BAR.div_time.I(z.minisec2SecMin(z.PLAY.now_process) + ' / ' + z.minisec2SecMin(z.PLAY.total_time));
    }
    , totalTimeCalc: function () {				//计算绘画总时间
        var z = this;
        var sum = 0;
        var posa = z.PLAY.pos_all;
        var begin;
        for (var i = 0; i < z.PLAY.step; i++) {
            if (typeof posa[i][0] == 'object') {
                begin = 3;
            } else {
                begin = 2;
            }
            for (var j = begin, l = posa[i].length; j < l; j += 4) {
                if (i == 0 && j < 4) {
                    continue;
                }
                sum += $.B(0, j < 4 ? z.PLAY.hua_inter : z.PLAY.pos_inter, +posa[i][j]);
            }
        }
        return sum;
    }
    , uncompress: function (s) {				//compress的解压
        //var s = JSON.stringify(pos);
        var s2 = s;

        s2 = s2.replace(/A/g, ',-1');
        s2 = s2.replace(/B/g, ',-2');
        s2 = s2.replace(/C/g, ',-3');
        s2 = s2.replace(/D/g, ',-4');
        s2 = s2.replace(/E/g, ',-5');
        s2 = s2.replace(/F/g, ',-6');
        s2 = s2.replace(/G/g, ',-7');
        s2 = s2.replace(/H/g, ',-8');
        s2 = s2.replace(/I/g, ',-9');

        s2 = s2.replace(/J/g, ',0,0,0');

        s2 = s2.replace(/a/g, ',1');
        s2 = s2.replace(/b/g, ',2');
        s2 = s2.replace(/c/g, ',3');
        s2 = s2.replace(/d/g, ',4');
        s2 = s2.replace(/e/g, ',5');
        s2 = s2.replace(/f/g, ',6');
        s2 = s2.replace(/g/g, ',7');
        s2 = s2.replace(/h/g, ',8');
        s2 = s2.replace(/i/g, ',9');
        s2 = s2.replace(/,\./g, ',0.');
        s2 = s2.replace(/,\./g, ',0.');
        s2 = s2.replace(/,,/g, ',0,');
        s2 = s2.replace(/,,/g, ',0,');
        s2 = s2.replace(/,,/g, ',0,');
        s2 = s2.replace(/,]/g, ',0]');

        s2 = s2.replace(/j/g, '\"0\":');
        s2 = s2.replace(/k/g, '\"1\":');
        s2 = s2.replace(/l/g, '\"2\":');
        s2 = s2.replace(/m/g, '\"3\":');
        s2 = s2.replace(/n/g, '\"4\":');
        s2 = s2.replace(/o/g, '\"5\":');
        s2 = s2.replace(/p/g, '\"6\":');
        s2 = s2.replace(/q/g, '\"7\":');
        s2 = s2.replace(/r/g, '\"8\":');
        s2 = s2.replace(/s/g, '\"9\":');
        s2 = s2.replace(/t/g, '\"10\":');
        s2 = s2.replace(/u/g, '\"11\":');
        s2 = s2.replace(/v/g, '\"12\":');
        s2 = s2.replace(/w/g, '\"13\":');
        s2 = s2.replace(/x/g, '\"14\":');
        s2 = s2.replace(/y/g, '\"15\":');
        s2 = s2.replace(/z/g, '\"16\":');

        s2 = s2.replace(/K/g, '\"17\":');
        s2 = s2.replace(/L/g, '\"18\":');
        s2 = s2.replace(/M/g, '\"19\":');
        s2 = s2.replace(/N/g, '\"20\":');
        s2 = s2.replace(/O/g, '\"21\":');
        s2 = s2.replace(/P/g, '\"22\":');
        s2 = s2.replace(/Q/g, '\"23\":');
        s2 = s2.replace(/R/g, '\"24\":');
        s2 = s2.replace(/S/g, '\"25\":');
        s2 = s2.replace(/T/g, '\"26\":');
        s2 = s2.replace(/U/g, '\"27\":');
        s2 = s2.replace(/V/g, '\"28\":');
        s2 = s2.replace(/W/g, '\"29\":');
        s2 = s2.replace(/X/g, '\"30\":');
        s2 = s2.replace(/Y/g, '\"31\":');
        s2 = s2.replace(/Z/g, '\"32\":');

        return s2;
    }

    , barFadein_2: function () {				//显示进度条，然后隐藏					-> barFadeout
        var z = this;
        z.BAR.div.V().S({A: 1});
        z.barFadeout();
    }
    , circle_2: function (x, y, w, p, c) {	//第四步，每个图案的具体绘制			-> pressColorGet
        var z = this;
        if (z.PLAY.pos_lw > 0.01) {
            var r = $.B(0.01, 1000, w / 2);
            if (z.BRUSH.type == 2) {
                r *= 2;
            }
            z.PLAY.ctx.B().A(
                x
                , y
                , r
                , 0, PI2, false
            )
                .F(c || z.pressColorGet(p));	//毛笔颜色一致，宽度变化；蜡笔宽度一致，颜色变化
        }
    }
    , layerSel_2: function (n) {				//选择层								-> layerAlphaSet / tempOpacitySet
        var z = this;
        z.BOARD.canvas_draw = z.LAYER.layers[n].draw;
        z.BOARD.canvas_temp = z.LAYER.layers[n].temp;

        if (z.TOOLS) {
            z.TOOLS.layerControlArr[z.LAYER.focus] && z.TOOLS.layerControlArr[z.LAYER.focus].S({BG: '#e4e4e4'});
            z.TOOLS.layerControlArr[n].S({BG: '#c9c9c9'});	//30
        }
        z.LAYER.focus = n;

        z.layerAlphaSet(n, z.LAYER.opacity[n]);
        z.tempOpacitySet();
        return z.LAYER.focus;
    }
    , pause_2: function (eobj) {			//暂停，停止/播放转换					-> barFadeout / stopMp3
        var z = eobj ? eobj.G_ : this;
        z.PLAY.is_stop = 1;
        z.BAR.div_play.V();
        z.BAR.div_pause.H();
        z.barFadeout();

        //cbq begin
        z.stopMp3();
        //cbq end

        if (!z.DRAW || z.DRAW.div.isH()) {
            z.CURSOR.div.H();	//暂停时，关闭光标
        }
    }
    , playerEvent_2: function () {				//绑定事件								-> on
        var z = this;
        z.BOARD.div.FATHER.resize = function (w, h) {			//外围层变动，驱动内部尺寸调节					-> resize_2
            z.resize_2(Math.min((this.W_ - 12) / z.BOARD.canvas_w, (this.H_ - 10) / z.BOARD.canvas_h), 546, 'z.BOARD.div.FATHER.resize');
        }

        if (z.SETTING.mongo_id) {
            z.resize_2(0, 550, 'playerEvent_2');
        }

        z.BOARD.div.G_ = z;
        z.BOARD.div.mousedown(z.showHideBar_3);
        //z. (z.BOARD.div, );
        z.on(z.BAR.div, $._emptyFunc);				//阻断 z.BOARD.div 监听到点击
        z.on(z.BAR.div_slide_bg, z.jump_8);
        z.on(z.BAR.div_stop, z.stop_3);
        z.on(z.BAR.div_pause, z.pause_2);
        z.on(z.BAR.div_play, z.play_7);
        z.on(z.BAR.div_speed1, z.speed1Set_9);
        z.on(z.BAR.div_speed2, z.speed2Set_9);
        z.on(z.BAR.div_speed3, z.speed3Set_9);
        z.on(z.BAR.div_fullscreen, z.fullScreen_3);
    }
    , resize_2: function (d, line, func) {				//调整尺寸					-> timetipSet / cursorSet / drawResize
        var z = this;
        if (!d) {
            d = Math.min(z.BOARD.div.width() / z.BOARD.canvas_w, z.BOARD.div.height() / z.BOARD.canvas_h);
        }
        z.BOARD.view_rate = d;

        var w = $.R(z.BOARD.canvas_w * z.BOARD.view_rate); //z.BOARD.div.width();
        var h = $.R(z.BOARD.canvas_h * z.BOARD.view_rate); //z.BOARD.div.height();

        var css = {W: w, H: h, TS: $.TWEEN.speed()};
        /*
         var css2 = {
         L:$.R(z.BOARD.div.L_ + z.BOARD.div.W_/2 - w/2)
         , T:$.R(z.BOARD.div.T_ + z.BOARD.div.H_/2 - h/2)
         };
         */
        var css2 = {
            L: $.R(z.BOARD.div.FATHER.W_ / 2 - w / 2)
            , T: $.R(z.BOARD.div.FATHER.H_ / 2 - h / 2)
        };

        z.BOARD.div.S(css).S(css2);
        z.BOARD.box_bg.S(css);
        z.BOARD.img.S(css);

        for (var i = z.LAYER.layers.length - 1; i >= 0; i--) {
            z.LAYER.layers[i].draw.S(css);		//已绘制画布
            z.LAYER.layers[i].temp.S(css);		//临时画布
        }

        z.BAR.div.S({TS: d, T: h - 25, W: w, H: 27});
        w -= 35;
        z.BAR.div_time.S({L: 35, T: -10});
        z.BAR.div_stop.S({L: 0}).H();
        z.BAR.div_slide_bg.S({L: 35, W: Math.max(0, w - 165)});
        z.BAR.div_pause.S({L: w - 117});
        z.BAR.div_play.S({L: w - 117});
        z.BAR.div_speed1.S({L: w - 90});
        z.BAR.div_speed2.S({L: w - 62});
        z.BAR.div_speed3.S({L: w - 28});
        z.BAR.div_fullscreen.S({L: w});

        z.timetipSet();

        z.cursorSet();

        //绘画状态存在以下层
        z.DRAW && z.drawResize();
        z.DRAW && z.BAR.div_stop.V();
    }
    , fillCircle_3: function (x, y, w, p) {		//第三步，用一连串的图案连接这些节点	-> circle_2 / cursorMove
        var z = this;

        x /= z.BOARD.scaling;
        y /= z.BOARD.scaling;

        if (z.PLAY.pos_x == -1000) {
            z.PLAY.pos_x = x;										//圆心坐标
            z.PLAY.pos_y = y;
            z.PLAY.pos_lw = w;
            z.PLAY.pos_p = p;
        }
        else {
            if (z.PLAY.pos_lw == 0) {	//如果点下去后不动，则在起点绘制半径为 z.PLAY.pos_lw 的圆
                z.PLAY.pos_x = x;
                z.PLAY.pos_y = y;
                z.PLAY.pos_lw = w;
                z.PLAY.pos_p = p;
                z.circle_2(x, y, w, p);
                return;
            }
            var rate;
            var i = 100;
            while (i--) {
                var inter = $.B(0.5, 2.5, z.BRUSH.type == 2 ? z.BRUSH.circle_itv * 3 : z.PLAY.pos_lw * z.BRUSH.circle_itv);
                var len = Math.sqrt($.P2(x - z.PLAY.pos_x) + $.P2(y - z.PLAY.pos_y));		//终点(x, y)到最后一个圆心(z.PLAY.pos_x, z.PLAY.pos_y)的距离

                if (len >= inter) {
                    rate = inter / len;
                    z.PLAY.pos_x += rate * (x - z.PLAY.pos_x );
                    z.PLAY.pos_y += rate * (y - z.PLAY.pos_y );
                    z.PLAY.pos_lw += rate * (w - z.PLAY.pos_lw);
                    z.PLAY.pos_p += rate * (p - z.PLAY.pos_p );
                    z.circle_2(
                        z.PLAY.pos_x
                        , z.PLAY.pos_y
                        , z.PLAY.pos_lw
                        , z.PLAY.pos_p
                    );

                    if (z.PLAY.wait > -20) {
                        z.cursorMove(
                            z.PLAY.pos_x * z.BOARD.view_rate
                            , z.PLAY.pos_y * z.BOARD.view_rate
                            , z.PLAY.pos_p
                        );
                    }
                } else {
                    return;
                }
            }
        }
    }
    , fullScreen_3: function (eobj) {			//全屏/复原显示							-> resize_2 / barFadeout
        var z = eobj.G_;

        var sw = $.IW(); //z.BOARD.div.FATHER.width()  || z.BOARD.div.W_ || 800;
        var sh = $.IH(); //z.BOARD.div.FATHER.height() || z.BOARD.div.H_ || 600;

        var y = z.BOARD.div;
        if (y.FATHER.Z_ != 999) {
            var x = [[], []];
            z.last_view_rate = y.W_ / z.BOARD.canvas_w;
            $.TODO = function () {
                z.fullScreen_3(eobj)
            };
            if ($.IS.FF || $.IS.I) {
                y.last_scroll_top = document.documentElement.scrollTop;
                document.documentElement.scrollTop = 0;
            } else {
                y.last_scroll_top = document.body.scrollTop;
                document.body.scrollTop = 0;
            }
            var view_rate = $.FX(Math.min((sw - 30) / z.BOARD.canvas_w, (sh - 30) / z.BOARD.canvas_h), 4);
            while (y.FATHER) {
                y = y.FATHER;
                //y.fullscreen && y.fullscreen(y.Z_ != 999 ? 'hide' : 'show');
                y.last_s = {
                    P: y.P_ || ''
                    , L: y.L_ || ''
                    , T: y.T_ || ''
                    , W: y.W_ || ''
                    , H: y.H_ || ''
                    , BG: y.BG_ || ''
                    , BD: y.BD_ || 0
                    , Z: y.Z_ || 0
                    , O: y.O_ || ''
                    //, TS: y.TS_ || 0
                    , TX: y.TX_ || 0
                    , TY: y.TY_ || 0
                    , TZ: y.TZ_ || 0
                    , RX: y.RX_ || 0
                    , RY: y.RY_ || 0
                    , RZ: y.RZ_ || 0
                }
                y.S({
                    P: 'absolute',
                    L: 0,
                    T: 0,
                    W: sw,
                    H: sh,
                    BG: '#cccccc',
                    BD: 0,
                    Z: 999,
                    TS: 0,
                    O: 'hidden',
                    TX: 0,
                    TY: 0,
                    TZ: 0,
                    RX: 0,
                    RY: 0,
                    RZ: 0
                }, 'done');
                x[0].push(y);
                y.fullScreen3D && y.fullScreen3D(0);
            }
            y = y.context;
            if (y != document.body) {
                while (y.parentNode) {
                    y = y.parentNode;
                    y.EOBJ = {
                        position: y.style.position || ''
                        , left: y.style.left || ''
                        , top: y.style.top || ''
                        , width: y.style.width || ''
                        , height: y.style.height || ''
                        , overflow: y.style.overflow
                        , zIndex: y.style.zIndex || ''
                        , margin: y.style.margin || ''
                        , className: y.className || ''
                    }
                    y.style.position = 'absolute';
                    y.style.left = 0;
                    y.style.top = 0;
                    y.style.width = sw + 'px';
                    y.style.height = sh + 'px';
                    y.style.overflow = 'hidden';
                    y.style.zIndex = 999;
                    y.style.margin = 0;
                    y.className = '';
                    x[1].push(y);
                    if (y == document.body) {
                        break;
                    }
                }
            }
            z.BOARD.div.full_list = x;
        }
        else {
            var view_rate = z.last_view_rate;
            var x = y.full_list;
            if ($.IS.FF || $.IS.I) {
                document.documentElement.scrollTop = y.last_scroll_top;
            } else {
                document.body.scrollTop = y.last_scroll_top;
            }
            for (var i = x[1].length - 1; i >= 0; i--) {
                y = x[1][i];

                y.style.position = y.EOBJ.position;
                y.style.left = y.EOBJ.left;
                y.style.top = y.EOBJ.top;
                y.style.width = y.EOBJ.width;
                y.style.height = y.EOBJ.height;
                //y.style.overflow = y.EOBJ.overflow;
                y.style.zIndex = y.EOBJ.zIndex;
                y.style.margin = y.EOBJ.margin;
                y.className = y.EOBJ.className;
                y.scrollTop = 0;
            }
            for (var i = x[0].length - 1; i >= 0; i--) {
                y = x[0][i];
                y.S(y.last_s, 'done');
                y.fullScreen3D && y.fullScreen3D(1);
            }
            $.TODO = null;
        }
        z.resize_2(view_rate, 1059, 'fullScreen_3');
        window.onresize && window.onresize()
    }
    , layerAdd_3: function (txt) {			//添加图层								-> layerToolAdd_2 / layerAlphaSet
        var z = this;
        var y = z.BOARD;
        var x = y.div;
        var n = z.LAYER.layers.length;
        var div = $.C(x, {Z: z.setZ(n)});
        div.draw = $.C(div, {W: y.canvas_w, H: y.canvas_h}, 'canvas').S({W: x.W_, H: x.H_});
        div.temp = $.C(div, {W: y.canvas_w, H: y.canvas_h}, 'canvas').S({W: x.W_, H: x.H_});
        //z.CACHE.cache[0][n] && div.draw.CTX.DI(z.CACHE.cache[0][n], 0, 0);
        z.LAYER.layers[n] = div;
        z.LAYER.layers[n].changed = 0;
        z.LAYER.sequence[n] = n;
        z.LAYER.show_status[n] = 1;
        z.DRAW && z.layerToolAdd_2(n, txt)
        z.layerAlphaSet(n, 1);
    }
    , showHideBar_3: function (eobj) {			//点击显隐进度条						-> barFadein_2 / barFadeout / focusSet
        var z = eobj.G_;
        if (z.TOOLS && z.TOOLS.is_over) {
            return;
        }
        if (z.BAR.div.A_ < 0.5) {
            z.barFadein_2()
        }
        else {
            z.barFadeout(1);
        }
        z.focusSet();
    }
    , stop_3: function (eobj) {			//停止播放								-> pause_2 / drawMode_2
        var z = eobj.G_ || this;
        z.pause_2();
        if (z.DRAW) {
            z.drawMode_2();
        }
    }

    , brushSet_4: function (att, is_silent) {	//设置笔触		原setAllPen				-> layerAdd_3 / layerSel_2 / layerShowHide / layerAlphaSet / preDraw / fillColor / tempOpacitySet / cursorSet
        var z = this;
        z.CACHE.last_att = $.E(z.CACHE.last_att, att);
        var c = {};
        var change_bg = 0, change_fg = 0, lchange = '';
        var y;
        if (att[23]) {
            z.PLAY.version = +att[23];
        }
        for (var i in att) {
            if (typeof(att[i]) == 'undefined') {
                continue;
            }
            y = +att[i];

            /*
             0: 笔宽	 	0.1-200									r0 diameter
             1: 速度敏感 	0-1 1：最敏感							r1
             2: 笔宽敏感 	0-1 1：最敏感							r2
             3: 触点平滑 	0-1 1：最平滑							r3
             4: 笔锋长		0-1 1：最长；drawEnd用到；目前固定值0.8 r4
             5: 间隔比例	0-1 fillCircle_3/circle_2 用到 				r5
             6: H			0-360
             7: S			0-1
             8: B			0-1
             9: 透明度		0-1
             10: 笔触类型	1实心, 2钢笔, 3粗笔, 4细笔, 5超细笔 BRUSH.type
             11: 是否橡皮	1是
             12: 背景-r		0-255
             13: 背景-g		0-255
             14: 背景-b		0-255
             15: 背景-a		0-1
             16: 缩放		倍数
             17: 层分布		整数，转换成二进制来表示层的分布, num2arr, layerAdd_3
             18: 选择层		正整数							  layerSel_2
             19: 层隐藏		整数，转换成二进制来表示层的隐藏, num2arr, layerShowHide
             20: 透明		小数用，号连接起来，拼成字符串
             21: 清空层		正整数
             22: 设备		1触屏, 2鼠标, 3手写板
             23: 版本		正整数
             24: 填充层		整数
             */

            if (i == 0) {
                z.BRUSH.diameter = y;
                z.DRAW && z.brushWidthSet();
            }//笔宽，则改变光标
            else if (i == 1) {
                z.BRUSH.speed_sens = y;
            }
            else if (i == 2) {
                z.BRUSH.width_sens = y;
            }
            else if (i == 3) {
                z.BRUSH.pos_smooth = y;
            }
            else if (i == 4) {
                z.BRUSH.tail_extend = y;
            }
            else if (i == 5) {
                z.BRUSH.circle_itv = y;
            }
            else if (i == 6) {
                z.BRUSH.color_h = y;
                change_fg = 1;
            }
            else if (i == 7) {
                z.BRUSH.color_s = y;
                change_fg = 1;
            }
            else if (i == 8) {
                z.BRUSH.color_v = y;
                change_fg = 1;
            }
            else if (i == 9) {
                z.BRUSH.color_a = y;
                change_fg = 1;
            }
            else if (i == 10) {
                z.BRUSH.type = y;
            }
            else if (i == 11) {
                z.BRUSH.is_rubber = y;
            }
            else if (i == 12) {
                z.BOARD.color_r = y;
                change_bg = 1;
            }
            else if (i == 13) {
                z.BOARD.color_g = y;
                change_bg = 1;
            }
            else if (i == 14) {
                z.BOARD.color_b = y;
                change_bg = 1;
            }
            else if (i == 15) {
                z.BOARD.color_a = y;
                change_bg = 1;
            }
            else if (i == 16) {
                z.BOARD.scaling = y || 1;
            }
            else if (i == 17) {												//层顺序 000102030405060708
                z.LAYER.sequence = z.num2seq(att[i]);
                var from = z.LAYER.layers.length;
                var to = z.LAYER.sequence.length;
                for (var d = from; d < to; d++) {
                    z.layerAdd_3();
                }
                for (d = from; d > to; d--) {
                    var n = d - 1;
                    if (z.TOOLS) {
                        z.TOOLS.layerControlArr[n].R();
                        z.TOOLS.layerControlArr.splice(n, 1);
                    }
                    z.LAYER.layers[n].draw.R();
                    z.LAYER.layers[n].temp.R();
                    z.LAYER.layers.splice(n, 1);
                    z.LAYER.opacity.splice(n, 1);
                    z.LAYER.show_status.splice(n, 1);
                    z.LAYER.sequence.splice(n, 1);
                }
                for (var i = to - 1; i >= 0; i--) {
                    z.LAYER.layers[z.LAYER.sequence[i]].S({Z: z.setZ(i)}); // 19 -i ??
                }
            }
            else if (i == 18) {
                z.layerSel_2(y);
            }							//层选择
            else if (i == 19) {												//层显隐
                var show_status = z.num2arr(att[i]);
                for (var i = z.LAYER.layers.length - 1; i >= 0; i--) {
                    if (show_status[i] == 0) {
                        z.layerShowHide(i, -1);
                    } else {
                        z.layerShowHide(i, 1);
                    }
                }
            }
            else if (i == 20) {												//层透明
                var alpha = att[i].split(',');
                for (var i = z.LAYER.layers.length - 1; i >= 0; i--) {
                    z.layerAlphaSet(i, alpha[i]);
                }
            }
            else if (i == 21) {
                y && z.LAYER.layers[y - 1].draw.CTX.CR(0, 0);
            }	//层清空/删除
            else if (i == 22) {
                z.BOARD.type = y;
            }
            else if (i == 24) {
                z.BOARD.focus = y;
                change_bg = 1;
            }
        }

        z.preDraw();

        var gco = z.BRUSH.is_rubber ? 'destination-out' : 'source-over';
        if (z.BOARD.canvas_draw.CTX.globalCompositeOperation != gco) {
            z.BOARD.canvas_draw.CTX.GC(gco);
        }

        if (change_fg) {
            var rgb = z.hsv2rgb(z.BRUSH.color_h, z.BRUSH.color_s, z.BRUSH.color_v);
            z.BRUSH.color_r = rgb[0];
            z.BRUSH.color_g = rgb[1];
            z.BRUSH.color_b = rgb[2];
        }

        if (change_bg) {
            z.fillColor();
        }

        z.tempOpacitySet();

        if (z.CURSOR.type != 'i') {
            z.cursorSet(z.BRUSH.is_rubber ? 'e' : 'b');
        }
    }
    , draw_4: function (x, y, w, p, a) {	//第二步，基本节点中间添加过渡曲线节点	-> fillCircle_3 / quan
        var z = this;
        var arr = z.PLAY.drawlist;
        arr.push([x, y, w, p]);
        var len = arr.length;
        if (len == 1) {
            z.fillCircle_3(x, y, w, p, 1);
        }
        else if (len == 2) {
            var pos = arr[len - 2];
            z.PLAY.pre_pos = [
                (x + pos[0]) / 2
                , (y + pos[1]) / 2
                , (w + pos[2]) / 2
                , (p + pos[3]) / 2
            ];
            z.fillCircle_3(
                z.PLAY.pre_pos[0]
                , z.PLAY.pre_pos[1]
                , z.PLAY.pre_pos[2]
                , z.PLAY.pre_pos[3]
                , 1
            );
        }
        else if (len > 2) {
            //把两个点的中间点作为端点，每个点变为参考点
            var pos = arr[len - 2];
            //pre_pos2: 最新一个点和上一个点的中点
            var pre_pos2 = [
                (x + pos[0]) / 2
                , (y + pos[1]) / 2
                , (w + pos[2]) / 2
                , (p + pos[3]) / 2
            ];
            //z.circle_2(pre_pos2[0], pre_pos2[1], 3, pre_pos2[3], 'blue');
            var x1, y1, x2, y2, w1, w2, p1, p2;
            for (var i = 0; i <= 1; i += 0.1) {		//2次
                x1 = z.quan(z.PLAY.pre_pos[0], pos[0], i);
                y1 = z.quan(z.PLAY.pre_pos[1], pos[1], i);
                w1 = z.quan(z.PLAY.pre_pos[2], pos[2], i);
                p1 = z.quan(z.PLAY.pre_pos[3], pos[3], i);
                x2 = z.quan(pos[0], pre_pos2[0], i);
                y2 = z.quan(pos[1], pre_pos2[1], i);
                w2 = z.quan(pos[2], pre_pos2[2], i);
                p2 = z.quan(pos[3], pre_pos2[3], i);
                //quard
                z.fillCircle_3(
                    z.quan(x1, x2, i)
                    , z.quan(y1, y2, i)
                    , z.quan(w1, w2, i)
                    , z.quan(p1, p2, i)
                    , !i
                );
            }

            z.PLAY.pre_pos = pre_pos2;
        }
    }

    , drawEnd_5: function () {				//第一步，收尾处理						-> draw_4
        var z = this, list = z.PLAY.drawlist;
        if (z.BRUSH.diameter == 0 || z.BRUSH.is_rubber) {
            return;
        }
        if (z.BRUSH.width_sens == 0 && list.length == 1) {
            z.fillCircle_3(list[0][0], list[0][1], list[0][2], list[0][5] * 1000);
            return;
        }
        if (z.PLAY.smooth_y == z.PLAY.pre_y || z.PLAY.smooth_x == z.PLAY.pre_x || list.length - 3 < 0) {
            return;
        }
        var a1 = Math.atan2(z.PLAY.smooth_y - z.PLAY.pre_y, z.PLAY.smooth_x - z.PLAY.pre_x);
        var p3 = list[list.length - 3];
        var a2 = Math.atan2(z.PLAY.pre_y - p3[0], z.PLAY.pre_x - p3[1]);
        var a = a1,
            d = $.B(-0.05, 0.05, z.jiao(a1 - a2)),
            x = z.PLAY.smooth_x,
            y = z.PLAY.smooth_y,
            smooth_d = z.BRUSH.is_rubber ? z.BRUSH.diameter : z.PLAY.smooth_d * 1,

            lw_dif = z.PLAY.smooth_d / z.PLAY.pre_d > 0.9 ? z.PLAY.smooth_d * 0.1 : z.PLAY.pre_d - z.PLAY.smooth_d,	//确保收敛速度
            speed = $.B(0, (z.PLAY.pos_group.length || z.PLAY.J) / 8, z.PLAY.transition),
            p = z.PLAY.smooth_p,
            n = 0;

        z.PLAY.wait = 0;
        while (smooth_d >= 0.01 && n < 20 && speed > 0.01) {
            n++;
            if (smooth_d > lw_dif) {
                smooth_d -= lw_dif;
                speed *= 0.8;//z.BRUSH.tail_extend;		//笔锋长度
            } else {
                smooth_d = 0.01;
                speed *= smooth_d / lw_dif;
            }
            smooth_d = $.B(0.01, 1000, smooth_d);
            d *= 0.8;

            z.draw_4(x += speed * Math.cos(a += d / 2), y += speed * Math.sin(a), smooth_d, p, a);
        }
    }
    , smooth_5: function (x, y, p) {		//第一步，坐标平滑处理后，生成基本节点	-> draw_4
        var z = this;
        z.PLAY.ctx = z.BRUSH.is_rubber ? z.BOARD.canvas_draw.CTX : z.BOARD.canvas_temp.CTX;
        x = +x;
        y = +y;
        p = +p;
        if (z.PLAY.pre_x <= -1000) {
            z.PLAY.pre_x = x;
            z.PLAY.pre_y = y;
            z.PLAY.smooth_x = x;
            z.PLAY.smooth_y = y;
            z.PLAY.x = x;
            z.PLAY.y = y;
            z.PLAY.p = p;	//当前压力
            z.PLAY.smooth_p = p;
            z.PLAY.smooth_d = 0;
            z.draw_4(z.PLAY.pre_x, z.PLAY.pre_y, z.PLAY.smooth_d, p);
        }
        else {
            //还原数值
            z.PLAY.x += x;
            z.PLAY.y += y;
            z.PLAY.p += p;

            //z.circle_2(z.PLAY.x, z.PLAY.y, 7, z.PLAY.p, 'green');

            z.PLAY.pre_x = z.PLAY.smooth_x;
            z.PLAY.pre_y = z.PLAY.smooth_y;

            var move = Math.sqrt(x * x + y * y) / 50;
            var _r3 = $.B(0.3, 1, move); 				//触点平滑动态调节
            if (move == 0) {
                _r3 = 0.7;
            }
            z.PLAY.smooth_x += (z.PLAY.x - z.PLAY.smooth_x) * 0.8; //_r3 * z.BRUSH.pos_smooth;		//z.r3是触点平滑
            z.PLAY.smooth_y += (z.PLAY.y - z.PLAY.smooth_y) * 0.8; //_r3 * z.BRUSH.pos_smooth;

            if (Math.abs(z.PLAY.smooth_x - z.PLAY.pre_x) + Math.abs(z.PLAY.smooth_y - z.PLAY.pre_y) < 0.5) { //停下来，则快速逼近;
                z.PLAY.smooth_x = z.PLAY.x;
                z.PLAY.smooth_y = z.PLAY.y;
                z.PLAY.smooth_p = z.PLAY.p;
            }

            z.PLAY.pre_d = z.PLAY.smooth_d;

            //位移
            z.PLAY.transition = Math.round(Math.sqrt($.P2(z.PLAY.smooth_x - z.PLAY.pre_x) + $.P2(z.PLAY.smooth_y - z.PLAY.pre_y)));

            //角度
            z.PLAY.smooth_a = Math.atan2(z.PLAY.smooth_y - z.PLAY.pre_y, z.PLAY.smooth_x - z.PLAY.pre_x);

            //速度
            z.PLAY.speed += (z.PLAY.transition - z.PLAY.speed) * (z.BRUSH.speed_sens || 0.1);	//z.r1速度敏感

            //压感
            z.PLAY.smooth_p += (z.PLAY.p - z.PLAY.smooth_p) * (z.BRUSH.width_sens || 0.5);		//z.BRUSH.width_sens 笔宽敏感，压感敏感
            var pressure_lw = 0.001 * z.PLAY.smooth_p * z.BRUSH.diameter;
            //线宽
            if (z.BOARD.type == 1) {					//'touch' 触屏和mouse，速度快，线条粗
                var speed_limit = 20;
                z.PLAY.smooth_d = pressure_lw * $.B(0.2, 1, z.PLAY.speed / speed_limit);	//速度范围20%-100%
            }
            else {									//手写板3
                z.PLAY.smooth_d = pressure_lw;
            }

            z.draw_4(z.PLAY.smooth_x, z.PLAY.smooth_y, z.BRUSH.is_rubber ? z.BRUSH.diameter : z.PLAY.smooth_d, z.PLAY.smooth_p, z.PLAY.smooth_a);
        }
    }

    , repeater_6: function (position) {		//播放z.PLAY.pos_all					-> initDraw_5 / drawEnd_5 / smooth_5 / brushSet_4 / stop_3 /  preDraw / pause_2 / bgimgResize / timestartSet / timetipSet / temp2draw / cacheSave
        var z = this;

        clearTimeout(z.PLAY.timer);
        var client = z.PLAY.pos_all;
        var pos_all_lenth = client.length;

        //跳转到某一刻开始画
        if (position) {

            var y;
            //找到最近的缓存
            for (var j = z.CACHE.cache.length - 1; j > 0; j--) {
                y = z.CACHE.cache[j];
                //找到离z.PLAY.I最近的缓存
                if (y && y.process < position) {
                    if (y.process < z.PLAY.now_process) {	//找到的缓存没有现在的进程新，就不用缓存
                        break;
                    }
                    z.brushSet_4(JSON.parse(y.att));
                    z.PLAY.I = y.i;
                    z.PLAY.J = 0;
                    z.PLAY.now_process = y.process;
                    z.timestartSet(position);

                    //往下找存在的缓存
                    for (var i = z.LAYER.layers.length - 1; i >= 0; i--) {
                        z.LAYER.layers[i].draw.CTX.CR();
                        z.LAYER.layers[i].temp.CTX.CR();
                        for (var k = j; k > 0; k--) {
                            y = z.CACHE.cache[k];
                            if (y.canvas_img[i]) {
                                z.LAYER.layers[i].draw.CTX.DI(y.canvas_img[i].context, 0, 0);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }

        if (!z.PLAY.step && z.DRAW) {
            z.initDraw_5()
        }

        //实现从头开始播放
        if (z.PLAY.now_process > z.PLAY.total_time) {
            //全部播放完之后，z.PLAY.now_process++，所以才会 > z.PLAY.total_time;
            z.PLAY.I = 0;
            z.PLAY.J = 0;
            z.PLAY.now_process = 0;
            z.timestartSet();
        }

        z.timetipSet();

        while (1) {

            //全部结束
            if (z.PLAY.I >= z.PLAY.step) {
                z.timetipSet();

                z.PLAY.now_process++;

                z.pause_2();
                if (z.BRUSH.last_att) {
                    //恢复undo前的最后状态
                    z.brushSet_4(JSON.parse(z.BRUSH.last_att));
                    delete z.BRUSH.last_att;
                }
                //cbq begin
                if (window.tuya_x) {
                    z.overTimer = setTimeout(function () {
                        //clearTimeout(z.loadPicTimer);
                        if (window.tuya_x.isClick) {
                            window.tuya_x.isClick = 0;

                        } else {
                            if (window.tuya_x.switchIndex + 1 > 3) {
                            } else {
                                window.tuya_x.switchIndex++;
                                window.tuya_x.switchDiv[window.tuya_x.switchIndex - 1].context.className = 'switchDiv';
                                window.tuya_x.loadCycle(window.tuya_x.switchIndex);
                            }
                        }

                    }, 2000);
                }
                //cbq end
                return;
            }

            //暂停
            if (z.PLAY.is_stop) {
                return;
            }

            //设置笔触
            if (z.PLAY.J < 2 && isNaN(client[z.PLAY.I][0])) {	//新格式，笔触有变化，[0]为笔触，不是数组，也不是字符串

                if (!z.PLAY.I) {
                    z.brushSet_4({17: '0001', 18: 0, 19: '1,1,1'}); //为最早的一批作品添加基本层'00'=>[0], '0001'=>[0, 1]
                    z.brushSet_4(client[0][0]);
                }

                if (!z.PLAY.I && !z.PLAY.J) {
                    //清空画板
                    for (var i = z.LAYER.layers.length - 1; i >= 0; i--) {
                        z.LAYER.layers[i].temp.CTX.CR();
                        z.LAYER.layers[i].draw.CTX.CR();
                        //初始化图层，贴图

                        if (z.CACHE.cache[0][i]) {
                            if ($.F(z.CACHE.cache[0][i].src, '/bg/') && !$.F(z.CACHE.cache[0][i].src, 'data:image')) {
                                var ctx = z.LAYER.layers[i].draw.CTX;
                                ctx
                                    .FS(ctx.createPattern(z.CACHE.cache[0][i], 'repeat'))
                                    .FR(0, 0, z.BOARD.canvas_w, z.BOARD.canvas_h);
                            } else {
                                //z.LAYER.layers[i].draw.CTX.DI(z.CACHE.cache[0][i], 0, 0);
                                z.bgimgResize(i, z.CACHE.cache[0][i]);
                            }
                        }
                    }
                }

                z.PLAY.J = 1;
            }

            //绘制
            if (z.PLAY.J <= client[z.PLAY.I].length - 4) {			//最后一点
                z.smooth_5(
                    client[z.PLAY.I][z.PLAY.J]
                    , client[z.PLAY.I][z.PLAY.J + 1]
                    , client[z.PLAY.I][z.PLAY.J + 3]
                );
                z.PLAY.J += 4;
            }

            //这笔画完
            if (z.PLAY.J > client[z.PLAY.I].length - 4) {
                z.drawEnd_5();
                //把这一笔的内容从temp_canvas印到draw_canvas层上去
                z.temp2draw();
                z.LAYER.layers[z.LAYER.focus].changed = 1;
                z.preDraw('play411: newRepeater');
                z.PLAY.I++;
                z.PLAY.J = 0;


                if (z.PLAY.I >= z.PLAY.step) {		//全部结束
                    continue;			//接下来由本函数 '全部结束' 处理
                }
            }

            if (z.PLAY.J == 0 && isNaN(client[z.PLAY.I][0])) {
                z.brushSet_4(client[z.PLAY.I][0]);
                z.PLAY.J = 1
            }

            if (isNaN(client[z.PLAY.I][z.PLAY.J + 2])) {
                //alert(1);
                continue;
            }

            //两点时间间隔
            var wait = $.B(0, z.PLAY.J < 4 ? z.PLAY.hua_inter : z.PLAY.pos_inter, +client[z.PLAY.I][z.PLAY.J + 2]);

            z.PLAY.now_process += wait;							//记录中的原速时间累计
            z.PLAY.time_sum += wait / z.PLAY.playspeed;						//记录中的变速时间累计，计划到达

            if (z.PLAY.now_process >= z.PLAY.time_jump) {
                wait = $.R(z.PLAY.time_start + z.PLAY.time_sum - $.MS());		//计划到达与实际进度的差距，就是休整时间
                //var t = $.MS() - z.PLAY.time_start;				//实际绘画过程已经过了多久，实际进度
                if (wait > -100 && wait < -20) {					//如果绘画速度过快，会出现跳的感觉，这一步让进度缓一缓
                    z.PLAY.time_start += 20 - wait;
                    wait = 20;
                }
            }
            else {
                z.PLAY.time_start = $.MS() - z.PLAY.time_sum;
                if (z.PLAY.show_count > 100) {						//跳转过程中，如果没有缓存，会看到死机一样的停顿，这时缓一下，显示一下绘图状态，感觉会舒服
                    z.PLAY.show_count = 0;
                    wait = 1;
                    z.PLAY.time_start += wait;
                } else {
                    wait = 0;
                    z.PLAY.show_count++;
                }
            }
            z.PLAY.wait = wait;

            //缓存当前各个层
            z.cacheSave();

            //休整或立即行动
            if (wait > 0) {					//|| z.PLAY.J<2
                if (z.PLAY.J < 6 && wait > 100) {
                    var r = z.BOARD.view_rate / z.BOARD.scaling;
                    var w = z.CURSOR.div.W_ / 2 || 0;
                    z.CURSOR.div
                        .S({A: 0.2})
                        .animate({
                            L: $.R(client[z.PLAY.I][z.PLAY.J + 0] * r - w)	//坐标使用之前需要/scaling还原
                            , T: $.R(client[z.PLAY.I][z.PLAY.J + 1] * r - w)
                        }, wait > 1000 ? 1000 : wait, wait > 1000 ? wait - 1000 : 0);
                    z.BAR.div_slide
                        .animate({L: z.PLAY.total_time == 0 ? 0 : (z.BAR.div_slide_bg.W_) * (z.PLAY.now_process / z.PLAY.total_time) - 5}, wait, 0, 'LINEAR');
                } else {
                    z.timetipSet();
                }

                z.PLAY.timer = setTimeout(function () {
                    z.repeater_6()
                }, wait);
                return;
            }
        }
    }

    , play_7: function (eobj, a) {		//回放									-> repeater_6 / timestartSet / barFadeout
        var z = eobj && eobj.G_ ? eobj.G_ : this;

        z.PLAY.is_stop = 0;
        z.BAR.div_pause.V();
        z.BAR.div_play.H();
        z.timestartSet(a);
        z.repeater_6(a);
        z.barFadeout();
    }
    , jump_8: function (eobj) {			//位置跳转								-> play_7 / addMp3Jump
        var z = eobj.G_;
        var w = eobj.W_;
        var pos = eobj.context.getBoundingClientRect();
        var l = $.B(0, w, eobj.X - pos.x);

        //cbq begin
        z.percent = l / w;
        z.addMp3Jump();
        //cbq end

        var position = $.FX(z.PLAY.total_time * z.percent);
        if (position < z.PLAY.now_process || !z.PLAY.now_process) {
            //从头开始画
            z.PLAY.I = 0;
            z.PLAY.J = 0;
            z.PLAY.now_process = 0;
        }
        z.PLAY.show_count = 0; //用于统计没间隔n步就显示一次。不至于出现死机现象
        z.play_7('', position);
    }
    , speedSet_8: function (speed) {			//设置速度图标高亮，然后播放或暂停		-> play_7 / addMp3Jump
        var z = this;
        z.PLAY.playspeed = speed;
        z.BAR.div_speed1.I(z.imgSet('slow.png'));
        z.BAR.div_speed2.I(z.imgSet('normal.png'));
        z.BAR.div_speed3.I(z.imgSet('fast.png'));

        //cbq begin
        z.percent = z.PLAY.now_process / z.PLAY.total_time;
        z.addMp3Jump();
        //cbq end

        z.play_7();
    }

    , speed1Set_9: function (eobj) {			//设置自行车速度						-> speedSet_8
        var z = eobj.G_;
        z.speedSet_8(0.5);
        eobj.I(z.imgSet('slow_h.png'))
    }
    , speed2Set_9: function (eobj) {			//设置汽车速度							-> speedSet_8
        var z = eobj.G_;
        z.speedSet_8(1);
        eobj.I(z.imgSet('normal_h.png'))
    }
    , speed3Set_9: function (eobj) {			//设置飞机速度							-> speedSet_8
        var z = eobj.G_;
        z.speedSet_8(30);
        eobj.I(z.imgSet('fast_h.png'))
    }

    , begin_9: function () {				//										-> speed1Set_9 / resize_2 / showHideBar_3
        var z = this;
        z.resize_2(0, 1568, 'begin');
        if (z.PLAY.playspeed == 1) {
            z.speed1Set_9(z.BAR.div_speed1);
        } else if (z.PLAY.playspeed == 5) {
            z.speed2Set_9(z.BAR.div_speed2);
        } else {
            z.speed3Set_9(z.BAR.div_speed3);
        }
        z.showHideBar_3(z.BOARD.div);
    }
    , begin_10: function () {
        var z = this;
        if (z.MP3) {
            var that = z;
            var MP3check = setInterval(function () {
                if (z.MP3.context.duration) {
                    clearInterval(MP3check);
                    that.begin_9();
                }
            }, 10);
        } else {
            z.begin_9();
        }
    }

    //cbq begin
    , addMp3Jump: function () {
        var z = this;
        if (z.MP3 && z.playspeed != 1) {
            z.MP3.context.pause();
        } else if (z.MP3) {
            z.MP3.context.currentTime = (isNaN(z.MP3.context.duration) ? 0 : z.MP3.context.duration) * z.percent;
            console.log(1277);
            z.MP3.context.play();
        }
    }
    , Mp3Time: function () {
        var z = this;
        if (z.MP3) {
            //z.MP3.context.pause();
            z.MP3.context.currentTime = (z.MP3.context.duration - z.total_time / 1000) > 0 ? (z.MP3.context.duration - z.total_time / 1000) : 0;
            console.log((z.MP3.context.duration - z.total_time) > 0 ? (z.MP3.context.duration - z.total_time) : 0);
            z.MP3.context.play();
        }
    }
    , addMp3: function () {
        var z = this;
        if (z.MP3 && z.playspeed == 1) {
            z.MP3.context.play();
        }
    }
    , stopMp3: function () {
        var z = this;
        if (z.MP3) {
            var differentTime = (z.MP3.context.duration - z.total_time / 1000) > 0 ? (z.MP3.context.duration - z.total_time / 1000) : 0;
            setTimeout(function () {
                z.MP3.context.pause();
            }, differentTime * 1000);
        }
    }
    //cbq end
};
/*
 index.html
 body
 div1
 div2
 div3
 BOARD.div
 BOARD.box_bg
 BOARD.img
 LAYER.layers
 draw				20-n*2
 temp				21
 CURSOR.div 				39
 BAR.bar					40
 BAR.div_time
 BAR.div_slide_bg
 BAR.div_pause
 BAR.div_speed1
 BAR.div_speed2
 BAR.div_speed3
 BAR.div_slide
 DRAW.div				50
 z.TOOLS.up_tools			60
 TOOLS.button_undo
 TOOLS.button_redo
 TOOLS.button_clear
 TOOLS.button_zomo
 TOOLS.zoom_slide
 TOOLS.huakuai
 TOOLS.button_zoomi
 TOOLS.zoom_info
 z.TOOLS.vertical_tools		60
 TOOLS.cross
 TOOLS.layer_icon
 TOOLS.brush_img
 TOOLS.pencil_img
 TOOLS.pen_img
 TOOLS.brush_img
 TOOLS.rubber_img
 TOOLS.width_slide
 TOOLS.width_slide_title
 TOOLS.penwid
 TOOLS.sub_layer
 图层
 TOOLS.layers
 TOOLS.layerControlArr	//相关
 TOOLS.control
 TOOLS.control.eye
 TOOLS.control.name
 TOOLS.control.upload
 插入图片
 透明度
 TOOLS.layer_opacity
 TOOLS.layer_tools
 TOOLS.layer_add
 TOOLS.layer_up
 TOOLS.layer_dn
 TOOLS.layer_clear
 TOOLS.color_board_fg
 TOOLS.color_board_bg

 COLOR.div
 */