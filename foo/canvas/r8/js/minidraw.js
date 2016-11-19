$.E(Mina.prototype, {
    nil: null,
    adjustBar : function (obj) { 		//滑动条调整套件
    var w = obj.W;
    var div = $.C(obj.father, {L: obj.L, T: obj.T, W: w + 120, H: 30, Z: 2, G: this, O: 'hidden'});

    div.n = obj.n;
    div.end = obj.end || '';														//后缀	%, 像素, px
    div.fn = obj.fn;																//触发的操作行为
    div.v2r = obj.v2r;																//数值对应的浮动条位置比例，0-1
    div.r2v = obj.r2v;																//浮动条位置比例对应的数值

    var group1 = div.group1 = $.C(div, {W: '100%', H: '100%'});						//滑动条修改组
    var group2 = div.group2 = $.C(div, {W: '100%', H: '100%'}).H();					//数字输入组

    //滑动条修改组
    var css = {W: 20, H: 30, LH: 24, F: 18, C: '#000000', TA: 'center', G: div};
    div.decrease = $.C(group1, {L: 0, I: '-', title: obj.title_decrease})				//减少
        .S(css)
        .mousedown(function (eobj) {
            var div = eobj.G_;
            div.area.MOUSEDOWN(div.area);
            div.area.X = div.bar.L_ + 9 + div.area.__l - 1;
            div.area.MOUSEMOVE(div.area);
            div.area.MOUSEUP(div.area);
            eobj.l_t = eobj.T;
        });

    div.area = $.C(group1, {L: 20, W: w + 10, H: 30, G: div})
        .mousedown(function (eobj) {
            var div = eobj.G_;
            var pos = $.POS(div.hengtiao);
            eobj.__l = $.R(pos.x);
        })
        .mousemove(function (eobj) {
            var div = eobj.G_;
            var r = $.B(0, 1, (eobj.X - eobj.__l) / div.hengtiao.W_);
            if (eobj.l_r == r) {
                return;	//避免重复执行，不然up时会再次调用此方法
            }
            eobj.l_r = r;
            var v = div.r2v(r);
            div.setPosInfo(v);
            div.fn(v, div.n);
            clearTimeout(eobj.timer);
            eobj.timer = setTimeout(function () {
                eobj.MOUSEUP(eobj);
            }, 1000);
        })
        .mouseup(function (eobj) {
            eobj.IS_DOWN = 1;
            eobj.MOUSEMOVE(eobj);
            eobj.IS_DOWN = 0;
        });

    div.hengtiao = $.C(div.area, {L: 5, T: 12, W: w, H: 5, BG: '#40a7c5', BR: '2px'});	//横条
    div.bar = $.C(div.hengtiao, {T: -6, W: 17, H: 17, BG: 'url(img/drag.png)'});	//滑动条

    div.increase = $.C(group1, {L: w + 30, I: '+', title: obj.title_increase})										//增加
        .S(css)
        .mousedown(function (eobj) {
            var div = eobj.G_;
            div.area.MOUSEDOWN(div.area);
            div.area.X = div.bar.L_ + 9 + div.area.__l + 1;
            div.area.MOUSEMOVE(div.area);
            div.area.MOUSEUP(div.area);
            eobj.l_t = eobj.T;
            div.G_.TOOLS.is_over = 0;
        });

    div.info = $.C(group1, {
        T: 3, L: w + 53, W: 40, H: 20, LH: 20						//数字
        , C: '#878787', F: 12
        , BG: '#ffffff'
        , TA: 'center'
        , BD: '#cccccc'
        , BS: '2px 2px 2px rgba(0,0,0,0.3) inset'
        , G: div
    }, 'div')
        .mousedown(function (eobj) {
            var div = eobj.G_;
            div.group1.H();
            div.group2.V();
            div.input.val('').focus2();//val(parseFloat(div.info.I_)).
            div.unit.I(div.end);
            div.G_.TOOLS.is_over = 0;
            setTimeout(function () {
                div.cancle.MOUSEDOWN()
            }, 5000);
        });


    //数字输入组
    var css = {
        T: 3,
        W: 50,
        H: 24,
        LH: 22,
        C: '#878787',
        F: 14,
        BG: '#ffffff',
        paddingLeft: '8px',
        BD: '1px solid #333'
    };

    div.cancle = $.C(group2, {L: w - 95, I: '放弃'}).S(css)							//放弃
        .mousedown(function () {
            div.group1.V();
            div.group2.H();
            div.G_.TOOLS.is_over = 1;
        });
    $.C(div.cancle, {L: 35, W: 24, H: 24}, 'canvas')
        .CTX.M(5, 5).L(19, 19).M(5, 19).L(19, 5).LW(3).S('red');

    div.ok = $.C(group2, {L: w - 30, I: '确认'}).S(css)							//确认
        .mousedown(function () {
            div.group1.V();
            div.group2.H();
            if (div.input.val().trim().length) {
                var v = div.input.val();
                var r = $.B(0, 1, div.v2r(v));
                var v = div.r2v(r);
                div.setPosInfo(v);
                div.fn(v, div.n);
            }
        });
    $.C(div.ok, {L: 35, W: 24, H: 24}, 'canvas')
        .CTX.M(5, 13).L(10, 19).L(19, 5).LW(3).S('green');

    div.input = $.C(group2, {T: 3, L: w + 35, W: 38, H: 16, LH: 16, C: '#878787', F: 16, G: div}, 'input')		//数字输入
        .keydown(function (eobj) {
            if (13 == eobj.KEYCODE) {
                eobj.G_.ok.MOUSEDOWN();
            }
        }, 1);
    div.unit = $.C(group2, {T: 3, L: w + 80, H: 24, LH: 22, F: 12});				//单位


    //显示方法
    div.setPosInfo = function (v) {
        var div = this;
        var r = $.B(0, 1, div.v2r(v));
        div.bar.S({L: $.R(r * div.hengtiao.W_ - 9)});
        var v = div.r2v(r);
        div.info.I(v + div.end);
    };

    //
    div.WHEEL(function (eobj) {
        var div = eobj;
        if (eobj.WHL < 0) {
            div.increase.MOUSEDOWN();
        } else {
            div.decrease.MOUSEDOWN();
        }
    });
    return div;
}
,
arr2num            : function (arr) {		//[0,0,1] 转换成 9
    var num = 0;
    var z = 1;
    for (var i = arr.length - 1; i >= 0; i--) {
        num += arr[i] * z;
        z *= 2;
    }
    return num + z;
}
,
brushDiff            : function (b) {
    //b == 0, 读取目前状态和上一状态的变化值，last 保存目前状态，缺省
    //b == 1, 读取目前所有状态，上一状态不变(last 不变)
    //b == 2, 读取目前所有状态，last 保存目前状态
    var z = this;

    //v3数据结构，每一笔只新增一个成员
    //v2数据结构，修改笔触增加一个成员
    //v1数据结构，笔触增加一个成员
    var att = [
        z.BRUSH.diameter   				//0
        , z.BRUSH.speed_sens   				//1
        , z.BRUSH.width_sens   				//2
        , z.BRUSH.pos_smooth   				//3
        , z.BRUSH.tail_extend   			//4
        , z.BRUSH.circle_itv   				//5
        , z.BRUSH.color_h   				//6
        , z.BRUSH.color_s   				//7
        , z.BRUSH.color_v   				//8
        , z.BRUSH.color_a   				//9
        , z.BRUSH.type  					//10
        , z.BRUSH.is_rubber 				//11
        , z.BOARD.color_r       			//12
        , z.BOARD.color_g       			//13
        , z.BOARD.color_b       			//14
        , z.BOARD.color_a       			//15
        , z.BOARD.scaling					//16
        , z.seq2num(z.LAYER.sequence)		//17
        , z.LAYER.focus						//18
        , z.arr2num(z.LAYER.show_status)	//19
        , z.LAYER.opacity.join(',')			//20
        , 0									//21
        , z.BOARD.type						//22
        , 2									//23
        , z.BOARD.focus						//24
    ];

    var obj = {};
    var is_change = 0;
    for (var i = 0, l = att.length; i < l; i++) {
        if (z.CACHE.his_att[i] != att[i] || b) {
            //b==1时，仅获取保存状态，不更改setting的任何属性
            if (!b || b == 2) {
                z.CACHE.his_att[i] = att[i];
            }
            obj[i] = att[i];
            is_change = 1;
        }
    }
    return is_change || b ? obj : 0;
}
,
brushAdjustSets    : function () {			//笔宽调整套件		-> adjustBar
    var z = this;
    z.TOOLS.width_slide_title = $.C(z.TOOLS.width_slide, {L: 10, T: 5, F: 13});
    z.TOOLS.penwid = z.adjustBar({
        father: z.TOOLS.width_slide		//father
        , L: 10				//left
        , T: 21				//top
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            z.brushSet_4({'0': v});
            z.CURSOR.div.V();	//调整画笔宽度时看到直观的宽度效果
        }
        , r2v: function (r) {
            var z = this.G_;
            return z.brushWidthGet(r);
        }
        , v2r: function (v) {
            var z = this.G_;
            if (v <= 0.5) {
                return 0;
            } else if (v <= 50) {
                return $.FX(v / 100, 2);
            } else {
                return $.FX((v - 50) / 500 + 0.5, 2);
            }
            //return z.guess(v, z.brushWidthGet);
            var step1 = 0.5;
            if (a < step1) {
                return Math.floor(a * 100 + 0.0001) + 1;
            } else {
                var tmp = (a - step1) / (1 - step1);
                var base = step1 * 100 + 10;
                return Math.floor(tmp * (560 - base) + base + 0.0001);
            }
        }
        , end: 'px'
        , title_decrease: '['
        , title_increase: ']'
    });

    z.TOOLS.opacity_slide_title = $.C(z.TOOLS.width_slide, {L: 10, T: 55, F: 13, I: '笔刷不透明度'});
    z.COLOR.opacity = z.adjustBar({
        father: z.TOOLS.width_slide
        , L: 10
        , T: 71
        , W: 100
        , fn: function (v) {
            if (z.TOOLS.color_for != 'bg') {
                z.brushSet_4({9: $.FX(v / 100)})
            } else {
                z.brushSet_4({15: $.FX(v / 100)})
            }
            z.colorDrawAll_4()
        }
        , r2v: function (r) {
            return $.R(r * 100);
        }
        , v2r: function (v) {
            return v / 100;
        }
        , end: '%'
    });
}
,
brushWidthGet        : function (a) {
    var step1 = 0.5;
    if (a <= 0.005) {
        return 0.5;
    } else if (a <= step1) {
        return Math.floor(a * 100 + 0.0001);
    } else {
        var tmp = (a - step1) / (1 - step1);
        var base = step1 * 100;
        return Math.floor(tmp * (300 - base) + base + 0.0001);
    }
    //return $.R(a*a*499+1);
}
,
brushWidthSet        : function () {			// 					-> penwid.setPosInfo
    var z = this;
    z.TOOLS.penwid.setPosInfo(z.BRUSH.diameter);
}
,
buttonChoice        : function (s) {
    var z = this;
    z.TOOLS.brush_img.S({BG: ''});
    z.TOOLS.rubber_img.S({BG: ''});
    z.TOOLS.straw_img.S({BG: ''});
    z.TOOLS[s].S({BG: z.TOOLS.color_select});
}
,
colorFixedSet        : function () {			//预设颜色
    var z = this;
    var color_prepare = [
        [255, 123, 0]
        , [80, 255, 0]
        , [255, 255, 0]
        , [0, 255, 233]
        , [0, 72, 255]
        , [127, 0, 255]
        , [255, 255, 255]
        , [0, 0, 0]
    ];

    $.EACH(color_prepare, function (rgb, i) {
        var color = 'rgb('
            + rgb[0] + ','
            + rgb[1] + ','
            + rgb[2] + ')';

        var color_choice = $.C(z.TOOLS.vertical_tools, {
            TS: 200
            , BG: color
            , name: i
            , BR: '15px'
            , BD: '2px solid #ffffff'
            , BS: '1px 3px 1px rgba(0,0,0,0.5) inset'
            , G: z
        })
            .mousedown(function (eobj) {
                var z = eobj.G_;
                var rgb = eobj.rgb;
                z.colorSet_5('colorFixedSet', rgb[0], rgb[1], rgb[2]);
                if (z.CURSOR.type != 'b') {
                    z.TOOLS.brush_img.MOUSEDOWN();
                }
            })
            .mouseover(function (eobj) {
                eobj.S({
                    L: 7
                    , T: 317 + eobj.NAME_ * 44
                    , W: 42
                    , H: 42
                    , BR: '22px'
                })
            })
            .mouseout(function (eobj) {
                eobj.S({
                    L: 12
                    , T: 322 + eobj.NAME_ * 44
                    , W: 32
                    , H: 32
                    , BR: '17px'
                })
            });

        color_choice.rgb = rgb;

        color_choice.MOUSEOUT();
    });
}
,
colorHisShow        : function () {			//记住曾经用过的颜色和透明度
    var z = this;
    var list = z.COLOR.his_list;
    var table_string = '<table border=0 cellspacing=5>';
    var color;
    var color_arr;
    var len = list.length;
    for (var i = 0; i < len; i++) {
        color_arr = list[len - i - 1].split('_');
        color = z.rgba(
            color_arr[1],
            color_arr[2],
            color_arr[3],
            $.FX(color_arr[4] / 100)
        );
        if ((i) % 2 == 0) {
            table_string += '<tr>';
        }
        table_string += '<td width=23 height=23 onclick="Mina.list.'
        + z.SETTING.zid + '.hisShow(' + (len - i - 1)
        + ')" title="'
        + color + '" style="background:' + color + '"></td>';
        if (i % 2 == 1) {
            table_string += '</tr>';
        }
    }
    if (list.length % 2 == 1) {
        if (list.length > 1) {
            table_string += '<td width=23 height=23>&nbsp;</td>';
        }
        table_string += '</tr>';
    }
    table_string += '</table>';
    z.COLOR.his.I(table_string);
}
,
colorSeta            : function (a) {
    return PI + a;
}
,
colorSetx            : function (x) {
    //顶点在左
    //return x+1;
    //顶点在右
    //return this.COLOR.ww-x;
}
,
colorSety            : function (y) {
    //顶点在上
    //return 1+y;
    //顶点在下
    //return ww-1-y;
}
,
colorSlide        : function () {
    var z = this;
    var t = 310;
    var inter = 25;
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 'r :'});
    z.COLOR.slide_r = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.colorSet_5('slide_r', v, z.BRUSH.color_g, z.BRUSH.color_b);
            }
        }
        , r2v: function (r) {
            return $.R(r * 255);
        }
        , v2r: function (v) {
            return v / 255;
        }
    });
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 'g :'});
    z.COLOR.slide_g = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.colorSet_5('slide_g', z.BRUSH.color_r, v, z.BRUSH.color_b);
            }
        }
        , r2v: function (r) {
            return $.R(r * 255);
        }
        , v2r: function (v) {
            return v / 255;
        }
    });
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 'b :'});
    z.COLOR.slide_b = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.colorSet_5('slide_b', z.BRUSH.color_r, z.BRUSH.color_g, v);
            }
        }
        , r2v: function (r) {
            return $.R(r * 255);
        }
        , v2r: function (v) {
            return v / 255;
        }
    });
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 'h :'});
    z.COLOR.slide_h = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.brushSet_4({'6': v});
            } else {

            }
            z.colorDrawAll_4();
        }
        , r2v: function (r) {
            return $.R(r * 359);
        }
        , v2r: function (v) {
            return v / 359;
        }
    });
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 's :'});
    z.COLOR.slide_s = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.brushSet_4({'7': v});
            } else {

            }
            z.colorDrawAll_4();
        }
        , r2v: function (r) {
            return r;
        }
        , v2r: function (v) {
            return v;
        }
    });
    $.C(z.COLOR.div, {L: 10, T: t += inter, I: 'v :'});
    z.COLOR.slide_v = z.adjustBar({
        father: z.COLOR.div		//father
        , L: 30
        , T: t
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            if (z.TOOLS.color_for != 'bg') {
                z.brushSet_4({'8': v});
            } else {

            }
            z.colorDrawAll_4();
        }
        , r2v: function (r) {
            return r;
        }
        , v2r: function (v) {
            return v;
        }
    });

    $.C(z.COLOR.div, {L: 153, T: t += inter + 10, I: '#'});
    z.COLOR.string16 = $.C(z.COLOR.div, {L: 168, T: t, W: 50, H: 16, G: z}, 'input')
        .keydown(function (eobj) {
            if (13 == eobj.KEYCODE) {
                var z = eobj.G_;
                z.TOOLS.is_over = 0;
                var s = eobj.val();
                if (s.length !== 3 && s.length != 6) {
                    eobj.S({BD: '1px solid red'});
                } else {
                    if (s.length == 3) {
                        var r = parseInt(s.substring(0, 1) + s.substring(0, 1), 16);
                        var g = parseInt(s.substring(1, 2) + s.substring(1, 2), 16);
                        var b = parseInt(s.substring(2, 3) + s.substring(2, 3), 16);
                    } else {
                        var r = parseInt(s.substring(0, 2), 16);
                        var g = parseInt(s.substring(2, 4), 16);
                        var b = parseInt(s.substring(4, 6), 16);
                    }
                    z.colorSet_5('string16', r, g, b);
                }
            } else {
                eobj.G_.TOOLS.is_over = 1;
                eobj.S({BD: '1px solid green'});
            }
        }, 1);
}
,
compress            : function (s) {			//自定义压缩，把绘画过程字符串中的','号连带后面数字用字母代替
    //var s = JSON.stringify(pos);
    var s2 = s;

    s2 = s2.replace(/,-1/g, 'A');
    s2 = s2.replace(/,-2/g, 'B');
    s2 = s2.replace(/,-3/g, 'C');
    s2 = s2.replace(/,-4/g, 'D');
    s2 = s2.replace(/,-5/g, 'E');
    s2 = s2.replace(/,-6/g, 'F');
    s2 = s2.replace(/,-7/g, 'G');
    s2 = s2.replace(/,-8/g, 'H');
    s2 = s2.replace(/,-9/g, 'I');

    s2 = s2.replace(/,0,0,0/g, 'J');

    s2 = s2.replace(/,0/g, ',');
    s2 = s2.replace(/,1/g, 'a');
    s2 = s2.replace(/,2/g, 'b');
    s2 = s2.replace(/,3/g, 'c');
    s2 = s2.replace(/,4/g, 'd');
    s2 = s2.replace(/,5/g, 'e');
    s2 = s2.replace(/,6/g, 'f');
    s2 = s2.replace(/,7/g, 'g');
    s2 = s2.replace(/,8/g, 'h');
    s2 = s2.replace(/,9/g, 'i');

    s2 = s2.replace(/\"0\":/g, 'j');
    s2 = s2.replace(/\"1\":/g, 'k');
    s2 = s2.replace(/\"2\":/g, 'l');
    s2 = s2.replace(/\"3\":/g, 'm');
    s2 = s2.replace(/\"4\":/g, 'n');
    s2 = s2.replace(/\"5\":/g, 'o');
    s2 = s2.replace(/\"6\":/g, 'p');
    s2 = s2.replace(/\"7\":/g, 'q');
    s2 = s2.replace(/\"8\":/g, 'r');
    s2 = s2.replace(/\"9\":/g, 's');
    s2 = s2.replace(/\"10\":/g, 't');
    s2 = s2.replace(/\"11\":/g, 'u');
    s2 = s2.replace(/\"12\":/g, 'v');
    s2 = s2.replace(/\"13\":/g, 'w');
    s2 = s2.replace(/\"14\":/g, 'x');
    s2 = s2.replace(/\"15\":/g, 'y');
    s2 = s2.replace(/\"16\":/g, 'z');

    s2 = s2.replace(/\"17\":/g, 'K');
    s2 = s2.replace(/\"18\":/g, 'L');
    s2 = s2.replace(/\"19\":/g, 'M');
    s2 = s2.replace(/\"20\":/g, 'N');
    s2 = s2.replace(/\"21\":/g, 'O');
    s2 = s2.replace(/\"22\":/g, 'P');
    s2 = s2.replace(/\"23\":/g, 'Q');
    s2 = s2.replace(/\"24\":/g, 'R');
    s2 = s2.replace(/\"25\":/g, 'S');
    s2 = s2.replace(/\"26\":/g, 'T');
    s2 = s2.replace(/\"27\":/g, 'U');
    s2 = s2.replace(/\"28\":/g, 'V');
    s2 = s2.replace(/\"29\":/g, 'W');
    s2 = s2.replace(/\"30\":/g, 'X');
    s2 = s2.replace(/\"31\":/g, 'Y');
    s2 = s2.replace(/\"32\":/g, 'Z');

    return s2;
}
,
createLeftButton    : function (p, css, fn) {
    var z = this;
    var canvas = $.C(p, $.E(css, {G: this}), 'canvas')
        .mousedown(fn)
        .mouseover(function (eobj) {
            if (eobj.BG_ == z.TOOLS.color_select) {
                return;
            }
            eobj.S({
                BG: z.TOOLS.color_over
            });
        })
        .mouseout(function (eobj) {
            if (eobj.BG_ == z.TOOLS.color_select) {
                return;
            }
            eobj.S({
                BG: ''
            });
        });

    return canvas.MOUSEOUT();
}
,
createMixButton    : function (p, css, fn) {
    var z = this;
    var canvas = $.C(p, css, 'canvas');
    var div = $.C(p, $.E(css, {G: z}))
        .S({
            T: 0
            , H: 45
            , LH: 45
            , F: 14
            , C: z.TOOLS.color_text
            , TA: 'center'
        })
        .mousedown(fn)
        .mouseover(function (eobj) {
            eobj.canvas.S({
                BG: z.TOOLS.color_over
            });
        })
        .mouseout(function (eobj) {
            eobj.canvas.S({
                BG: ''
            });
        });

    div.canvas = canvas;

    return div.MOUSEOUT();
}
,
createBigButton    : function (p, css, fn) {
    var z = this;
    var canvas = $.C(p, css, 'canvas');
    var div = $.C(p, $.E(css, {G: z}))
            .mousedown(fn)
        ;
    div.canvas = canvas;
    return div;
}
,
createBgMenu        : function (t, title, fn) {
    var z = this;
    var css = {
        L: 1
        , T: t
        , W: 105
        , H: 38
    }
    var canvas = $.C(z.TOOLS.sub_bg, css, 'canvas');
    var div = $.C(z.TOOLS.sub_bg, $.E(css, {
        G: z
        , borderBottom: '1px solid ' + z.TOOLS.color_fenge
        , F: 12
        , LH: 40
        , W: 55
        , I: title
        , paddingLeft: '50px'
        , C: z.TOOLS.color_text
    }))
        .mousedown(fn)
        .mouseover(function (eobj) {
            eobj.canvas.S({
                BG: z.TOOLS.color_over
            });
        })
        .mouseout(function (eobj) {
            eobj.canvas.S({
                BG: ''
            });
        });
    div.canvas = canvas;
    return div;
}
,
createTopLayer    : function () {			//层选择按钮		->	createMixButton
    var z = this;
    z.TOOLS.layer_icon = z.createMixButton(z.TOOLS.up_tools, {W: 107, H: 45}, function (eobj) {
        var z = eobj.G_;
        z.TOOLS.sub_layer.toggle();
        z.TOOLS.sub_bg.H();
    }).I('&nbsp;&nbsp;线稿层')
    //线稿层
    z.TOOLS.layer_icon.canvas.CTX
        //双环
        .B().A(22, 25, 6, 0, PI2)
        .LW(1).S('#333333')
        .B().A(27, 20, 5, 0, PI2)
        .LW(0.7).S('#333333')
        //第1分割线
        .TL(106, 0)
        .B().LW(1)
        .M(0.5, 0)
        .L(0.5, 45)
        .S(z.TOOLS.color_fenge)
        //第1分割线左侧黑三角
        .B()
        .M(-2, 42)
        .L(-2, 32)
        .L(-12, 42)
        .F(z.TOOLS.color_sanjiao);
}
,
createTopBg        : function () {			//背景控制按钮		->	createMixButton
    var z = this;
    z.TOOLS.button_bg = z.createMixButton(z.TOOLS.up_tools, {L: 107, W: 95, H: 45}, function (eobj) {
        var z = eobj.G_;
        z.TOOLS.sub_bg.toggle();
        z.TOOLS.sub_layer.H();
    }).I('&nbsp;&nbsp;背景')
    //背景
    z.TOOLS.button_bg.canvas.CTX
        //三连环
        .B()
        .M(20, 21)
        .L(28, 18)
        .M(20, 23)
        .L(28, 26)
        .S('#333333')
        .B().A(18, 22, 3, 0, PI2).S()
        .B().A(30, 17, 3, 0, PI2).S()
        .B().A(30, 27, 3, 0, PI2).S()
        //背景分割线
        .TL(94, 0)
        .B().LW(1)
        .M(0.5, 0)
        .L(0.5, 45)
        .S(z.TOOLS.color_fenge)
        //背景分割线左侧黑三角
        .B()
        .M(-2, 42)
        .L(-2, 32)
        .L(-12, 42)
        .F(z.TOOLS.color_sanjiao);
}
,
createTopUndo        : function () {			//updo				->	createMixButton
    var z = this;
    z.TOOLS.button_undo = z.createMixButton(z.TOOLS.up_tools, {L: 202, W: 95, H: 45, title: 'Ctrl+z'}, z.stepUndo_8)
        .I('&nbsp;&nbsp;撤销');
    //撤销
    z.TOOLS.button_undo.canvas.CTX
        //撤销箭头
        .B()
        .M(21, 21)
        .L(21, 16)
        .L(13, 22)
        .L(21, 28)
        .L(21, 23)
        .M(21, 24)
        .QC(30, 24, 34, 28)
        .QC(32, 22, 22, 20)
        .S('#333333')
        //撤销分割线
        .TL(94, 0)
        .B().LW(1)
        .M(0.5, 0)
        .L(0.5, 45)
        .S(z.TOOLS.color_fenge);
}
,
createTopRedo        : function () {			//redo				->	createMixButton
    var z = this;
    z.TOOLS.button_redo = z.createMixButton(z.TOOLS.up_tools, {
        L: 297,
        W: 95,
        H: 45,
        title: 'Ctrl+Shift+z'
    }, z.stepRedo_9)
        .I('&nbsp;&nbsp;恢复');
    //恢复
    z.TOOLS.button_redo.canvas.CTX
        //恢复箭头
        .B()
        .M(26, 21)
        .L(26, 16)
        .L(34, 22)
        .L(26, 28)
        .L(26, 23)
        .M(26, 24)
        .QC(17, 24, 13, 28)
        .QC(15, 22, 25, 20)
        .S('#333333')
        //恢复分割线
        .TL(94, 0)
        .B().LW(1)
        .M(0.5, 0)
        .L(0.5, 45)
        .S(z.TOOLS.color_fenge);
}
,
createTopClear    : function () {			//clear				->	createMixButton
    var z = this;
    z.TOOLS.button_clear = z.createMixButton(z.TOOLS.up_tools, {
        L: 392,
        W: 95,
        H: 45
    }, z.clearBoard_6).I('&nbsp;&nbsp;清空')
    //清空
    z.TOOLS.button_clear.canvas.CTX
        //垃圾桶
        .B()
        .M(18, 17)
        .L(20, 15)
        .L(28, 15)
        .L(30, 17)
        .S('#666666')
        .B()
        .M(14, 17.5)
        .L(34, 17.5)
        .S('#333333')
        .M(18, 18)
        .L(19, 31.5)
        .L(29, 31.5)
        .L(30, 18)
        .S('#333333')
        .M(21, 20)
        .L(22, 29)
        .M(24, 20)
        .L(24, 29)
        .M(27, 20)
        .L(26, 29)
        .S('#666666')
        //清空分割线
        .TL(94, 0)
        .B().LW(1)
        .M(0.5, 0)
        .L(0.5, 45)
        .S(z.TOOLS.color_fenge);
}
,
createTopZoom        : function () {			//显示大小			->	adjustBar
    var z = this;
    z.TOOLS.zoom_slide = z.adjustBar({
        father: z.TOOLS.up_tools		//father
        , L: 520				//left
        , T: 8				//top
        , W: 100				//bar width
        , fn: function (v) {		//set bar location
            var pos = $.POS(z.CURSOR.div);
            var y = z.resize_2(v / 100);
            z.cursorMove(
                pos.x - z.DRAW.init_pos[0] + z.CURSOR.div.W_ / 2
                , pos.y - z.DRAW.init_pos[1] + z.CURSOR.div.W_ / 2
            );
        }
        , r2v: function (r) {
            return $.R(Math.pow(2, r * 6 - 2) * 100);
        }
        , v2r: function (v) {
            return (Math.log(v / 100) / Math.log(2) + 2) / 6
        }
        , end: '%'
        , title_decrease: '空格+"-"'
        , title_increase: '空格+"+"'
    })
    //放大镜
    var canvas = $.C(z.TOOLS.up_tools, {L: 485, W: 50, H: 45, Z: 1}, 'canvas');
    canvas.CTX
        //放大镜
        .B()
        .A(24, 22, 6, 0, PI2)
        .S('#333333')
        .B()
        .M(21, 22)
        .L(27, 22)
        .M(24, 19)
        .L(24, 25)
        .S('#333333')
        .B()
        .LW(2)
        .M(27, 27)
        .L(31, 34)
        .S('#333333');
}
,
createTopPlay        : function () {			//播放				->	createBigButton
    var z = this;
    z.TOOLS.button_play = z.createBigButton(z.TOOLS.up_tools, {
        L: 735, W: 98, H: 43, LH: 43, I: '&nbsp; &nbsp; 回放'
        , TA: 'center', C: '#ffffff'
    }, z.playMode_10);

    //回放
    z.TOOLS.button_play.canvas.CTX
        //圆角按钮底1
        .TL(1, 0)
        .CB(0, 8, 95, 33, 5).F('#333333')
        .CB(0, 6, 95, 33, 5).F('#aaaaaa')

        //播放器
        .CB(13, 21, 15, 12, 3).F('#333333')
        .CB(13, 20, 15, 12, 3).F('#ffffff')
        .B().A(15, 19, 4, 0, PI2).F('#333333')
        .B().A(15, 18, 4, 0, PI2).F('#ffffff')
        .B().A(25, 19, 4, 0, PI2).F('#333333')
        .B().A(25, 18, 4, 0, PI2).F('#ffffff')
        .B()
        .M(29, 25)
        .L(36, 22)
        .L(36, 32)
        .L(29, 29)
        .F('#333333')
        .B()
        .M(29, 24)
        .L(36, 21)
        .L(36, 31)
        .L(29, 28)
        .F('#ffffff');
}
,
createTopSave        : function () {			//保存				->	createBigButton
    var z = this;
    z.TOOLS.button_save = z.createBigButton(z.TOOLS.up_tools, {
        L: 855, W: 98, H: 43, LH: 43
        , I: '&nbsp; &nbsp; 保存'
        , TA: 'center', C: '#ffffff'
    }, z.saveData_2)
    //保存
    z.TOOLS.button_save.canvas.CTX
        //圆角按钮底2
        .TL(1, 0)
        .CB(0, 8, 95, 33, 5).F('#333333')
        .CB(0, 6, 95, 33, 5).F('#aaaaaa')

        //保存
        .LW(5)
        .B()
        .M(17, 23)
        .L(23, 30)
        .L(35, 17)
        .S('#333333')
        .B()
        .M(17, 22)
        .L(23, 29)
        .L(35, 16)
        .S('#ffffff')
    ;
}
,
createSubLayer    : function () {			//图层菜单
    var z = this;
    z.TOOLS.sub_layer = $.C(z.TOOLS.up_tools, {L: 0, T: 46, BG: '#e4e4e4', W: 107, O: 'hidden'})
        .H();

    //图层组
    var w = z.TOOLS.sub_layer.W_;
    z.TOOLS.layers = $.c(z.TOOLS.sub_layer, {P: 'relative', W: w, overflowY: 'auto', overflowX: 'hidden'}, 'form')
        .ATT({
            method: 'post'
            , action: '/php/upload_mina_images.php'
            , multiple: 'multiple'
            , enctype: 'multipart/form-data'
            , target: 'hidden_iframe'
        });
}
,
createSubBg        : function () {			//背景层主窗口	
    var z = this;
    z.TOOLS.sub_bg = $.C(z.TOOLS.up_tools, {
        L: 107, T: 46, BG: '#e4e4e4', W: 107, H: 120
        , BD: '1px solid ' + z.TOOLS.color_fenge
    })
        .H()
}
,
createSubBgColor    : function () {			//背景颜色			->	createBgMenu
    var z = this;
    z.TOOLS.bg_color = z.createBgMenu(0, '颜色填充')
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.TOOLS.color_for = 'bg';
            z.COLOR.div.V().S({L: 217 + z.TOOLS.up_tools.L_, T: 48 + z.TOOLS.up_tools.T_});
            z.colorDrawAll_4();
            z.TOOLS.bg_model_menu.H();
            z.TOOLS.bg_linmo_menu.H();
        });

    z.TOOLS.bg_color.canvas.CTX
        .B().TL(10, 8)
        .LW(1)
        .M(4, 2).L(4, 18)
        .M(12, 2).L(12, 18)
        .M(20, 2).L(20, 18)
        .S('#666666')
        .CB(2, 5, 4, 4, 0).F('#ffffff').S()
        .CB(10, 10, 4, 4, 0).F('#ffffff').S()
        .CB(18, 12, 4, 4, 0).F('#ffffff').S();

}
,
createSubBgModel    : function () {			//背景图案			->	createBgMenu
    var z = this;
    z.TOOLS.bg_model = z.createBgMenu(40, '图案', function (eobj) {
        var z = eobj.G_;
        z.TOOLS.bg_model_menu.toggle();
        var imgobj;
        if (!z.TOOLS.bg_model.list) {
            z.TOOLS.bg_model.list = [];
            for (var i = 1; i <= 66; i++) {
                imgobj = $.C(z.TOOLS.bg_model_menu_slide, {
                    L: (i - 1) % 3 * 71 + 5
                    , T: Math.floor((i - .5) / 3) * 71 + 5
                    , W: 66
                    , H: 66
                    , BD: '1px solid #d2d2d2'
                    , G: z
                }, 'img')
                    .mousedown(function (eobj) {
                        if (eobj.loadok) {
                            var z = eobj.G_;
                            var ctx = z.LAYER.layers[2].draw.CTX;
                            ctx.CR()
                                .FS(ctx.createPattern(eobj.context, 'repeat'))
                                .FR(0, 0, z.BOARD.canvas_w, z.BOARD.canvas_h);
                            z.LAYER.layers[2].bg = eobj.SRC_;
                            z.CACHE.cache[0][2] = eobj.context;
                        } else {
                            $.MSG('image did not prepared');
                        }
                    });

                imgobj.bind('load', function (eobj) {
                    eobj.loadok = 1;
                });
                imgobj.S({src: '/miniplayer/bg/' + i + '.jpg', title: i});
                z.TOOLS.bg_model.list.push(imgobj);
            }
            $.C(z.TOOLS.bg_model_menu_slide, {
                T: Math.floor((i - .5 - 1) / 3 + 1) * 70 + 5
                , W: 66
                , H: 30
            })
        }

        z.COLOR.div.H();
        z.TOOLS.bg_model_menu.V();
        z.TOOLS.bg_linmo_menu.H();
    });

    var ctx = z.TOOLS.bg_model.canvas.CTX;
    ctx.TL(25, 20).SV();

    var l = 3, s = 8, cos, sin;
    for (var j = 0; j < 3; j++) {
        ctx.B();
        for (var i = 0; i < PI2; i += 0.2) {
            cos = Math.cos(i);
            sin = Math.sin(i);
            if (!i) {
                ctx.M(cos * l, sin * s);
            } else {
                ctx.L(cos * l, sin * s);
            }
        }
        ctx.C().S('#666666').RT(PI / 3);
    }

    z.TOOLS.bg_model_menu = $.C(z.TOOLS.sub_bg, {
        L: 108
        , T: 39
        , W: 259
        , H: 330
        , BG: z.TOOLS.color_bg
        , BD: '1px solid ' + z.TOOLS.color_fenge
        , BS: '3px 3px 5px rgba(0,0,0,0.3)'
    }).H();

    z.TOOLS.bg_model_menu_logo = $.C(z.TOOLS.bg_model_menu, {L: 0, T: 0, W: 35, H: 35}, 'canvas');
    var ctx = z.TOOLS.bg_model_menu_logo.CTX;
    ctx.TL(25, 16).SV();

    var l = 3, s = 8, cos, sin;
    for (var j = 0; j < 3; j++) {
        ctx.B();
        for (var i = 0; i < PI2; i += 0.2) {
            cos = Math.cos(i);
            sin = Math.sin(i);
            if (!i) {
                ctx.M(cos * l, sin * s);
            } else {
                ctx.L(cos * l, sin * s);
            }
        }
        ctx.C().S('#666666').RT(PI / 3);
    }

    z.TOOLS.bg_model_menu_title = $.C(z.TOOLS.bg_model_menu, {L: 45, T: 8, I: '图案选择', F: 12, C: z.TOOLS.color_text});

    z.TOOLS.bg_model_menu_div = $.C(z.TOOLS.bg_model_menu, {
        L: 10, T: 35, W: 237, H: 283
        , BS: '4px 4px 3px rgba(0,0,0,0.3) inset'
        , BD: '1px solid ' + z.TOOLS.color_fenge
        , O: 'auto'
    });

    z.TOOLS.bg_model_menu_slide = $.C(z.TOOLS.bg_model_menu_div, {W: 200, H: 250});
}
,
createSubLinmo    : function () {			//图片临摹			->	createBgMenu
    var z = this;
    z.TOOLS.bg_linmo = z.createBgMenu(80, '图片临摹')
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.COLOR.div.H();
            z.TOOLS.bg_model_menu.H();
            z.TOOLS.bg_linmo_menu.V();
        });

    var ctx = z.TOOLS.bg_linmo.canvas.CTX;
    ctx.S('#666666').SR(13, 11, 24, 18)
        .B().A(17, 15, 2, 0, PI2).S()
        .B().M(14, 21).BC(26, 27, 25, 15, 36, 20).S()
        .B().M(14, 24).BC(26, 30, 25, 18, 36, 23).S()
    ;

    z.TOOLS.bg_linmo_menu = $.C(z.TOOLS.sub_bg, {
        L: 108
        , T: 79
        , W: 273
        , H: 75
        , BG: z.TOOLS.color_bg
        , BD: '1px solid ' + z.TOOLS.color_fenge
    }).H();

    z.TOOLS.bg_linmo_file = $.C(z.TOOLS.bg_linmo_menu, {
        L: 38
        , T: 10
        , W: 86
        , H: 25
        , LH: 25
        , BG: '#43b7b8'
        , C: '#ffffff'
        , I: '插入图片'
        , TA: 'center'
        , BR: '2px'
        , F: 12
        , G: z
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            var ele = z.TOOLS.layerControlArr[2].input.context;
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("click", true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false,
                false, 0, null);
            ele.dispatchEvent(event);
        });

    z.TOOLS.bg_linmo_remove = $.C(z.TOOLS.bg_linmo_menu, {
        L: 149
        , T: 10
        , W: 86
        , H: 25
        , LH: 25
        , BG: '#d05454'
        , C: '#ffffff'
        , I: '清空背景'
        , TA: 'center'
        , BR: '2px'
        , F: 12
        , G: z
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.layerClear(2);
        });
}
,
createLeftCross    : function () {			//移动之十字
    var z = this;
    z.TOOLS.cross = $.C(z.TOOLS.vertical_tools, {W: 60, H: 45}, 'canvas')

    //十字锚
    z.TOOLS.cross.CTX
        .B().M(18, 22.5).L(23, 27.5).L(23, 17.5).F('#333333')
        .B().M(42, 22.5).L(37, 27.5).L(37, 17.5).F()
        .B().M(30, 10.5).L(25, 15.5).L(35, 15.5).F()
        .B().M(30, 34.5).L(25, 29.5).L(35, 29.5).F()
        .LW(3)
        .B()
        .M(20, 22.5).L(40, 22.5)
        .M(30, 12.5).L(30, 29.5)
        .S('#333333')
        //十字锚分割线
        .TL(0, 44)
        .B().LW(1)
        .M(0, 0.5)
        .L(60, 0.5)
        .S(z.TOOLS.color_fenge);
}
,
createLeftBrush    : function () {			//毛笔				->	createLeftButton
    var z = this;
    z.TOOLS.brush_img = z.createLeftButton(z.TOOLS.vertical_tools, {T: 45, W: 60, H: 67, title: 'b'}, function (eobj) {
        var z = eobj.G_;
        z.TOOLS.width_slide.S({T: 45, H: 105});
        z.TOOLS.width_slide_title.I('调整画笔大小');
        if (z.CURSOR.type == 'b') {
            z.TOOLS.width_slide.toggle();
        }
        //z.COLOR.div.H();
        z.brushTypeSet_5('brush');
        z.buttonChoice('brush_img');
        z.cursorSet('b');
    });

    z.TOOLS.brush_img.CTX
        .SV()
        .TL(30, 33)
        .RT(PI / 5)
        .B().M(-0.8, -20)
        .L(-2.5, 0)
        .L(2.5, 0)
        .L(0.8, -20)
        .F('#333333')
        .B()
        .M(-2.5, 1)
        .L(2.5, 1)
        .L(3, 5)
        .L(-3, 5)
        .F()
        .B()
        .M(-3, 6)
        .BC(-8, 16, 3, 13, -4, 20)
        .QC(8, 15, 3, 6)
        .F()
        .RS()
        //毛笔分割线
        .TL(0, 66)
        .B().LW(1)
        .M(0, 0.5)
        .L(60, 0.5)
        .S(z.TOOLS.color_fenge)
        //毛笔分割线上侧黑三角
        .B()
        .M(57, -2)
        .L(57, -12)
        .L(47, -2)
        .F(z.TOOLS.color_sanjiao);
}
,
createLeftRubber    : function () {			//橡皮				->	createLeftButton
    var z = this;
    z.TOOLS.rubber_img = z.createLeftButton(z.TOOLS.vertical_tools, {T: 112, W: 60, H: 67, title: 'e'}, function () {
        z.TOOLS.width_slide.S({T: 115, H: 55});
        z.TOOLS.width_slide_title.I('调整橡皮大小');
        z.COLOR.div.H();
        if (z.CURSOR.type == 'e') {
            z.TOOLS.width_slide.toggle();
        }
        z.brushTypeSet_5('rubber');
        z.buttonChoice('rubber_img');
        z.cursorSet('e');
    })
    //橡皮
    z.TOOLS.rubber_img.CTX
        .B()
        .M(31, 25)
        .L(40, 25)
        .L(28, 37)
        .L(18, 37)
        .F('#333333')
        .B()
        .M(40, 26)
        .L(40, 32)
        .L(29, 44)
        .L(29, 38)
        .F()
        .FR(18, 38, 10, 6)
        //橡皮分割线
        .TL(0, 66)
        .B().LW(1)
        .M(0, 0.5)
        .L(60, 0.5)
        .S(z.TOOLS.color_fenge)
        //橡皮分割线上侧黑三角
        .B()
        .M(57, -2)
        .L(57, -12)
        .L(47, -2)
        .F(z.TOOLS.color_sanjiao);
}
,
createLeftStraw    : function () {			//吸管				->	createLeftButton
    var z = this;
    z.TOOLS.straw_img = z.createLeftButton(z.TOOLS.vertical_tools, {T: 179, W: 60, H: 67, title: 'Alt'}, function () {
        if (z.CURSOR.type == 'i') {
            z.TOOLS.brush_img.MOUSEDOWN();
        } else {
            z.buttonChoice('straw_img');
            z.cursorSet('i');
            z.TOOLS.width_slide.H();
        }
    })
    //吸管
    z.TOOLS.straw_img.CTX
        .SV()
        .TL(30, 33)
        .RT(PI / 5)
        .B()
        .LW(10)
        .M(0, -10)
        .L(0, -1)
        .S('#333333')
        .B()
        .LW(4)
        .M(-6, 0)
        .L(6, 0)
        .S()
        .B()
        .LW(2)
        .M(-4, 0)
        .L(-4, 15)
        .L(0, 21)
        .L(4, 15)
        .L(4, 0)
        .S()
        .RS()
        //吸管分割线
        .TL(0, 66)
        .B().LW(1)
        .M(0, 0.5)
        .L(60, 0.5)
        .S(z.TOOLS.color_fenge);
}
,
createLeftColor    : function () {			//当前颜色/背景色/色板开关
    var z = this;
    z.TOOLS.color_board_fg = $.C(z.TOOLS.vertical_tools, {
        Z: 2, L: 6, T: 257, W: 28, H: 28, G: z
        , BS: '3px 3px 1px rgba(0,0,0,0.5) inset'
        , BD: '1px solid #ffffff'
        , title: 'c'
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            if (z.COLOR.div.L_ != 63 + z.TOOLS.right_all.L_ || z.TOOLS.color_for != 'fg') {

                z.COLOR.div.V().S({L: 63 + z.TOOLS.right_all.L_, T: 180 + z.TOOLS.right_all.T_});
            } else {
                z.COLOR.div.toggle();
            }
            eobj.S({Z: 2});
            z.TOOLS.color_for = 'fg';
            z.colorDrawAll_4();
        })

    z.TOOLS.color_board_bg = $.C(z.TOOLS.vertical_tools, {
        Z: 1, L: 24, T: 275, W: 28, H: 28, G: z
        , BS: '3px 3px 1px rgba(0,0,0,0.5) inset'
        , BD: '1px solid #ffffff'
        , title: 'f'
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.TOOLS.color_board_fg.S({Z: 1});
            if (z.COLOR.div.L_ != 63 + z.TOOLS.right_all.L_ || z.TOOLS.color_for != 'bg') {

                z.COLOR.div.V().S({L: 63 + z.TOOLS.right_all.L_, T: 180 + z.TOOLS.right_all.T_});
            } else {
                z.COLOR.div.toggle();
            }
            z.TOOLS.color_for = 'bg';
            z.colorDrawAll_4();
        })
}
,
createLeftWidth    : function () {			//笔宽调整弹出栏
    var z = this;
    //, width_slide	= $.C(z.TOOLS.vertical_tools, {L:-w, H:100, BG:'#e4e4e4', BR:'8px 0 0 8px', W:w, O:'hidden'})
    z.TOOLS.width_slide = $.C(z.TOOLS.vertical_tools, {
        L: 63, H: 105, W: 230
        , BG: z.TOOLS.color_bg
        , BS: '3px 3px 5px rgba(0,0,0,0.3)'
        , O: 'hidden'
    })
        .H()
}
,
drawResize        : function () {			//调整工具和监听笔触的位置	-> zoom_slide.setPosInfo
    var z = this;
    var m = 200;	//poscatch 还监听画框外的画笔轨迹
    z.DRAW.div.S({
        Z: 50
        , L: -m
        , T: -m
        , W: z.BOARD.div.W_ + m * 2
        , H: z.BOARD.div.H_ + m * 2
        , G: z
        //, BD: '1px solid #666'
    });

    z.TOOLS.zoom_slide.setPosInfo($.R(z.BOARD.div.W_ / 8));

    var pos = $.POS(z.BOARD.div);
    z.DRAW.init_pos = [pos.x, pos.y];

    z.TOOLS.up_tools.S({L: $.B(0, 10000, (z.BOARD.div.FATHER.W_ - z.TOOLS.up_tools.W_) / 2)})
}
,
eyeShowHide        : function (eobj, on) {
    var z = eobj.G_;
    eobj.CTX.CR().DI(z.TOOLS.eyeimg, 0, 0);
    if (!on) {
        eobj.CTX.M(0, 0).L(16, 8).C().LW(2).S('#ff6f94');
    }
}
,
shortcutDesc        : function (i) {
    var z = this;
    z.HELP = {
        div: $.C(z.BOARD.div.FATHER, {
            R: 10,
            T: 100,
            W: 210,
            H: 400,
            BD: '1px solid #e5e5e5',
            F: 12,
            LH: 24,
            padding: '10px',
            C: '#333333',
            BG: '#cccccc'
        })
            .I("<div style='font-size:14px;font-weight:bold'>快捷键</div>"
            + "'['			: 缩小画笔<br />"
            + "']'			: 放大画笔<br />"
            + "'b'			: 切换画笔<br />"
            + "'e'			: 切换橡皮<br />"
            + "'i'			: 切换取色状态<br />"
            + "'Alt'		: 切换取色状态<br />"
            + "'c'			: 画笔颜色调色开关<br />"
            + "'f'			: 背景颜色调色开关<br />"
                //+ "'z'			: 切换缩放状态<br />"
                //+ "缩放状态+点击		: 缩小，位置保持<br />"
                //+ "缩放状态+'Alt'+点击	: 放大，位置保持<br />"
            + "'空格'+鼠标滚轴	: 缩放，鼠标位置保持<br />"
            + "'+'	: 放大，中心位置不变<br />"
            + "'_'	: 缩小，中心位置不变<br />"
                //+ "'空格'+'Ctrl' 		: 放大<br />"
                //+ "'空格'+'Alt' 		: 缩小<br />"
            + "'空格'+拖动 		: 拖动画布<br />"
            + "'Ctrl'+'z' 		: 撤销<br />"
            + "'Ctrl'+'Shift'+'z' 	: 恢复<br />"
            + "动笔后，背景图片设置功能将关闭"
        )
        , debug: $.C(z.BOARD.div.FATHER, {R: 10, T: 540, href: '/bbs/shequ2.php#736@-all@-1', target: '_blank'}, 'a')
    }
    $.c(z.HELP.debug, {src: 'img/debug.png'}, 'img');
}
,
hisShow            : function (i) {			//							-> colorSet_5
    var z = this;
    var y = z.COLOR.his_list[i].split('_');
    z.colorSet_5('hisShow', y[1], y[2], y[3], $.FX(y[4] / 100));
}
,
hsv2rgb            : function (h, s, v) {
    h = $.B(0, 359, h);
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
        $.B(0, 255, Math.floor(r * 256)),
        $.B(0, 255, Math.floor(g * 256)),
        $.B(0, 255, Math.floor(b * 256))
    ];
}
,
layerClear        : function (n) {			//							-> brushSet_4
    var z = this;
    if (z.LAYER.layers[n]) {
        z.PLAY.pos_all[z.PLAY.step] = [{21: +n + 1}];
        z.PLAY.step++;
        z.PLAY.I = Math.max(0, z.PLAY.step - 1);
        z.brushSet_4({21: +n + 1});

        z.TOOLS.layerControlArr[n].input.val('');

        delete z.LAYER.layers[n].bg
    }
}
,
layer2temp        : function () {			//合并所有到temp
    var z = this;
    var canvas, order, alpha, img_data;
    var temp0 = z.LAYER.layers[0].temp;
    var temp1 = z.LAYER.layers[1].temp;
    temp0.CTX.CR();
    for (var i = z.LAYER.sequence.length - 1; i >= 0; i--) {
        order = z.LAYER.sequence[i];
        if (z.LAYER.show_status[order]) {
            canvas = z.LAYER.layers[order].draw;
            alpha = z.LAYER.opacity[order];
            if (alpha != 1) {
                img_data = canvas.CTX.getImageData(0, 0, z.BOARD.canvas_w, z.BOARD.canvas_h);
                for (var i = img_data.data.length - 1; i >= 0; i -= 4) {
                    if (img_data.data[i]) {
                        img_data.data[i] *= alpha;
                    }
                }
                temp1.CTX.putImageData(img_data, 0, 0);
                temp0.CTX.DI(temp1.context, canvas.L_, canvas.T_);
                temp1.CTX.CR();
            } else {
                temp0.CTX.DI(canvas.context, canvas.L_, canvas.T_);
            }
        }
    }
    return temp0;
}
,
layerToolsSet        : function () {			//图层控制工具集
    var z = this;

    //底部图层工具集
    z.TOOLS.layer_tools = $.c(z.TOOLS.sub_layer, {P: 'relative', W: z.TOOLS.sub_layer.W_, H: 50, BG: 'green'})
        .H();

    //加图层
    z.TOOLS.layer_add = $.C(z.TOOLS.layer_tools, {
        L: 30,
        W: 25,
        H: 25,
        G: z
    }).I('<img style="width:25px;height:25px" src="img/miao.png">')
        //.hover({BG:''}, {BG:'url(img/tool_hbg.png)'})
        .mousedown(function (eobj) {
            var z = eobj.G_;
            eobj.G_.layerAdd_3();
        })
    //.H();

    //降低图层
    z.TOOLS.layer_up = $.C(z.TOOLS.layer_tools, {L: 90, T: 5, W: 15, H: 15, G: z, src: 'img/layer_up.png'}, 'img')
        .hover({BG: 'url(img/up.gif) no-repeat'}, {BG: 'url(img/up_h.gif) no-repeat'})
        .mousedown(function (eobj) {
            var z = eobj.G_;
            var now = $.IA(z.LAYER.focus, z.LAYER.sequence, 1);
            if (now > 0) {
                z.seqChange(now, now - 1);
            }
        })
    //.H();

    //提升图层
    z.TOOLS.layer_dn = $.C(z.TOOLS.layer_tools, {L: 120, T: 5, W: 15, H: 15, G: z, src: 'img/layer_down.png'}, 'img')
        .mousedown(function (eobj) {
            var z = eobj.G_;
            var now = $.IA(z.LAYER.focus, z.LAYER.sequence, 1);
            if (now < z.LAYER.sequence.length - 1) {
                z.seqChange(now, +now + 1);
            }
        })
    //.H();

    //清空当前图层
    z.TOOLS.layer_clear = $.C(z.TOOLS.layer_tools, {
        L: 150,
        T: 3,
        W: 25,
        H: 25,
        G: z,
        title: 'clear'
    }).I('<img style="width:18px; height:18px" src="img/ico_15.png">')
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.layerClear(z.LAYER.focus);
        })
}
,
guess                : function (a, f) {		//a=f(z); a在[0,1]之间。知道a，反求z
    var max = 1, min = 0, z, y, num = 0;
    while (max - min > 0.001 && num < 20) {
        num++;					//num为计算次数，避免无限循环
        z = $.FX((max + min) / 2, 3);	//二分法逼近
        y = f(z);
        if (y > a) {
            max = z;
        } else if (y < a) {
            min = z;
        } else {
            return z;
        }
    }
    return $.FX(f(max) - a >= a - f(min) ? min : max, 3);
}
,
posCatchAdd        : function () {			//绑定DRAW.div: posDown_7 / posMove_7 / posUp_7
    var z = this;
    z.DRAW.div = $.C(z.BOARD.div)
        .mousedown(z.posDown_7)
        .mousemove(z.posMove_7, 0, function (y) {
            var z = y.G_;
            z.cursorMove(y.X - z.DRAW.init_pos[0], y.Y - z.DRAW.init_pos[1]);
        })
        .mouseup(z.posUp_7);
}
,
pressureGet        : function () {			//笔获得的压感 1-1000, 鼠标和触屏获得的压感都是 0
    var p = Mina.WACOM.penAPI.pressure;
    return p ? $.R($.B(1, 1000, p * 1100 - 100)) : 0;
}
,
rgb2str            : function (r, g, b) {
    var x = parseInt(r).toString(16);
    if (x.length == 1) {
        x = '0' + x
    }
    ;
    var y = parseInt(g).toString(16);
    if (y.length == 1) {
        y = '0' + y
    }
    ;
    var z = parseInt(b).toString(16);
    if (z.length == 1) {
        z = '0' + z
    }
    ;
    return x + y + z;
}
,
seqChange            : function (f, t) {		//f和t对应sequence中下标
    var z = this;
    var l = z.LAYER.layers, sq = z.LAYER.sequence, len = l.length;

    if (f != t) {
        //sequence中交换顺序
        var a = sq[f];
        sq[f] = sq[t];
        sq[t] = a;

        //zIndex
        l[sq[t]].S({Z: z.setZ(t)});
        l[sq[f]].S({Z: z.setZ(f)});

        //同步变动图层控件显示
        sq.forEach(function (m) {
            z.TOOLS.layers.A(z.TOOLS.layerControlArr[m]);
        });
    }
}
,
seq2num            : function (arr) {		//z.LAYER.sequence => 数字
    var s = '';
    for (var i = 0, l = arr.length; i < l; i++) {
        s += arr[i] < 10 ? '0' : '';
        s += arr[i];
    }
    return s;

}
,
zoomOut            : function () {			//					-> zoom_slide.decrease
    var z = this;
    z.TOOLS.zoom_slide.decrease.MOUSEDOWN();
}
,
zoomIn            : function () {			//					-> zoom_slide.increase
    var z = this;
    z.TOOLS.zoom_slide.increase.MOUSEDOWN();
}

,
colorAdd_2        : function () {			//曾用颜色透明度	-> colorHisShow
    var z = this;
    var list = z.COLOR.his_list;
    if (list.length > 19) {
        list.splice(0, list.length - 19);
    }
    var key = '_' + [z.BRUSH.color_r, z.BRUSH.color_g, z.BRUSH.color_b, $.R(z.BRUSH.color_a * 100)].join('_');
    if ($.IA(key, list)) {
        return;
    }

    list.push(key);
    z.colorHisShow();

    localStorage.colorhis = '';//JSON.stringify(list);
}
,
drawMode_2        : function () {			//					-> barFadeout / focusSet
    var z = this;
    z.DRAW.div.V();
    z.TOOLS.div.V();

    z.barFadeout(1);
    z.focusSet();

    z.HELP.div.V();

    window.LOGIN && LOGIN.V();
}
,
hsv2rgba_2        : function (h, s, v, a) {	//					-> hsv2rgb
    var z = this;
    var rgb = z.hsv2rgb(h, s, v);
    return z.rgba(
        rgb[0],
        rgb[1],
        rgb[2],
        a
    );
}
,
layerToolAdd_2    : function (n, txt) {		//眼睛，本层控制	-> eyeShowHide
    var z = this;
    var w = z.TOOLS.layers.W_;
    var layer_control = $.C(z.TOOLS.layers, {
        P: 'relative'
        , W: w, H: 40, BG: '#e4e4e4'
        , borderBottom: '1px solid ' + z.TOOLS.color_fenge
    });

    layer_control.n = n;

    if (n == 2) {
        layer_control.H();
    }

    //图层控制, 显示或者隐藏特定图层
    //眼睛
    layer_control.eye = $.C(layer_control, {
        L: 15, T: 12, W: 16, H: 8, G: z
    }, 'canvas')
        .mousedown(function (eobj) {
            var z = eobj.G_;
            var n = eobj.FATHER.n;
            z.layerShowHide(n);
            z.eyeShowHide(z.TOOLS.layerControlArr[n].eye, z.LAYER.show_status[n]);
        });
    z.eyeShowHide(layer_control.eye, 1);

    //图层名称
    layer_control.name = $.C(layer_control, {
        L: 45, T: 2, W: 50, H: 30
        , LH: 30
        , CS: 'pointer'
        , F: 12
        , I: txt || (n == 0 ? '线稿层' : (n == 1 ? '上色层' : (n == 2 ? '背景层' : ('图层' + n))))
        , G: z
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            var n = eobj.FATHER.n;
            z.TOOLS.layer_icon.I('&nbsp;&nbsp;' + eobj.I_);
            //用于图层选择操作
            z.layerSel_2(n);
            z.TOOLS.sub_layer.H();
        });

    layer_control.upload = $.C(layer_control, {
        L: 120, T: 7, W: 80, H: 26, LH: 26, F: 12, BR: '5px'
        , TA: 'center', BG: '#fff'
        , I: '插入图片', id: 'layer_0'
    })
    layer_control.upload.img = $.C(layer_control.upload, 'img').H();

    //插入图片, 对所有层开放
    layer_control.input = $.C(layer_control.upload, {
        //L:20, T:30, LH:30, W:190, H:24
        //L:180, T:4, W:25, H:25, F:12,
        T: 1, A: 0.01, CS: 'pointer'
        , type: 'file', name: 'layer_' + n, title: '插入图片'
        , G: z
    }, 'input')
        .bind('change', function (eobj) {
            var z = eobj.G_;
            var files = this.files;
            if (files.length) {
                var file = files[0];
                var reader = new FileReader();
                if (/text\/\w+/.test(file.type)) {
                    reader.onload = function () {
                    }
                    reader.readAsText(file);
                } else if (/image\/\w+/.test(file.type)) {
                    reader.onload = function () {
                        eobj.FATHER.img.S({src: this.result});
                        setTimeout(function () {
                            z.bgimgResize(eobj.FATHER.FATHER.n, eobj.FATHER.img.context);
                            z.CACHE.cache[0][eobj.FATHER.FATHER.n] = eobj.FATHER.img.context;
                        }, 50);
                    }
                    reader.readAsDataURL(file);
                }
            }
        });


    //满幅填充
    layer_control.fill = $.C(layer_control, {
        L: 210, T: 7, W: 80, H: 26, LH: 26, F: 12, BR: '5px'
        , TA: 'center', BG: '#fff'
        , I: '满幅填充', id: 'layer_0'
        , G: z
    })
        .mousedown(function (eobj) {
            var z = eobj.G_;
            z.BOARD.focus = eobj.FATHER.n;
            z.fillColor();
        });

    //透明度滑动条
    if (n == 2) {
        $.C(z.TOOLS.bg_linmo_menu, {L: 10, T: 46, I: '不透明度', F: 12, C: z.TOOLS.color_text});
        layer_control.layer_opacity = z.adjustBar({
            father: z.TOOLS.bg_linmo_menu	//father
            , L: 60					//left
            , T: 41					//top
            , W: 100					//bar width
            , n: n
            , fn: function (v, n) {		//set bar location
                z.layerAlphaSet(n, $.FX(v / 100, 2));
            }
            , r2v: function (r) {
                return $.R(r * 100);
            }
            , v2r: function (v) {
                return v / 100;
            }
            , end: '%'
        });
    }
    else {
        layer_control.layer_opacity = z.adjustBar({
            father: layer_control		//father
            , L: 300				//left
            , T: 6				//top
            , W: 100				//bar width
            , n: n
            , fn: function (v, n) {		//set bar location
                z.layerAlphaSet(n, $.FX(v / 100, 2));
            }
            , r2v: function (r) {
                return $.R(r * 100);
            }
            , v2r: function (v) {
                return v / 100;
            }
            , end: '%'
        });
    }

    /*
     */
    z.TOOLS.layerControlArr.push(layer_control);
}
,
saveData_2        : function (eobj) {		//					-> on			
    var z = eobj.G_;
    var preview_main_div = z.TOOLS.preview_main_div;
    if (!preview_main_div) {
        var w = top.$.IW();
        var h = top.$.IH();
        preview_main_div = $.C(top.$.body, {id: 'save_win', L: 0, T: 0, W: w, H: h, Z: 92, TA: 'center', A: 0.01})
            .animate({A: 1});//底

        var bg_div = $.C(preview_main_div, {W: w, H: h, BG: '#959595', A: 0.68});
        z.on(bg_div, function (eobj) {
            var z = eobj.G_
            z.TOOLS.preview_main_div.H();
            document.location.hash = '';
            if (top.model) {
                top.model.P_area.frame1.context.contentWindow.D.is_pause = 0;
                top.model.C_list.more.CLICK();
            }
        });//灰背景

        var hover = $.C(preview_main_div, {L: 0, T: 0, W: w, H: h, O: 'hidden'});
        var kuang = $.C(hover, {
            L: (w - 530) / 2,
            T: (h - 380) / 2,
            W: 530,
            H: 380,
            BG: "#fff",
            BD: "3px solid #e5e5e5"
        });//530*380
        var save = $.C(kuang, {L: 25, T: 20, I: '保存作品'})
        var close = $.C(kuang, {L: 503, T: 15, W: 15, H: 15})	//关闭按钮
            .I('<img src="i/close.png" />')
            .hover({A: 0.7}, {A: 1});
        z.on(close, function (eobj) {
            var z = eobj.G_
            z.TOOLS.preview_main_div.H();
        });

        var picname = $.c('', {W: 255, H: 30, G: z}, 'input')
            .bind('focus', function (eobj) {
                var z = eobj.G_;
                z.TOOLS.is_over = 1;
            })
            .bind('blur', function () {
                var z = eobj.G_;
                z.TOOLS.is_over = 0;
            });

        var name = $.C(kuang, {P: "relative", L: 36, MT: 115, I: '作品名称： ', TA: 'left'}).A(picname);
        var lab = $.C(kuang, {L: 65, T: 194, I: "标签："});
        var tipdiv = $.C(kuang, {P: 'relative', ML: 110, MT: 39, W: 340, TA: 'left', LH: '30'});
        var tips = ['人物', '动物', '场景', '线稿', '色彩', '可爱', '写实', '卡通', '其他'];
        var tipsel = [];
        tips.forEach(function (m, i) {//生成tip标签
            $.C(tipdiv, {
                P: "relative", I: m, H: 23, LH: 23, BD: '1px solid #e5e5e5', marginRight: '11px'
                , TA: 'left', padding: '5px', paddingLeft: '10px', paddingRight: '10px'
            }, 'span')
                .mousedown(function (eobj) {
                    var where = $.IA(eobj.I_, tipsel, 1);
                    if (where >= 0) {
                        eobj.S({BD: '1px solid #e5e5e5'});
                        tipsel.splice(where, 1);
                    } else if (tipsel.length > 2) {
                        alert('最多选择3个标签');
                        return;
                    } else {
                        eobj.S({BD: '1px solid #e64141'});
                        tipsel.push(eobj.I_);
                    }
                })
        });

        var submit = $.C(kuang, {
            P: 'relative',
            L: 220,
            MT: 20,
            W: 90,
            H: 30,
            BG: "#e64141",
            I: '递　交',
            LH: 30,
            C: '#FFF'
        });
        z.on(submit, function (eobj) {
            var z = eobj.G_;
            $.post('../php/call_ajax.php', {PROFILE: 1}, function (data) { //?
                var z = Mina.list[Mina.focus];
                var info = JSON.parse(data.split($.SPLIT1)[1]);
                if (info[3]) {
                    //	OUTPUT.refresh(1);
                    //name = (prompt('new name? (abcABC123_)') || '').replace(/\W/g, '');
                    var name = 'p' + z.PLAY.pos_all.length + $.MS();
                    var title = picname.val() || '新图片' + $.MS();
                    if (!title) {
                        alert('作品名不能为空');
                        return;
                    }
                    if (tipsel.length < 1) {
                        alert('至少选择一个标签');
                        return;
                    }

                    if (/\w+/.test(name)) {
                        z.CACHE.tmp = {
                            name: name
                            , title: title
                            , tipsel: tipsel
                            , nick: info[1]
                            , portrait: info[2]
                            , member_id: +info[3]
                        }
                        var y = z.TOOLS.layers.context;
                        for (var i = y.length - 1; i >= 0; i--) {
                            if (y[i].files && y[i].files.length) {
                                y.submit();
                                return;
                            }
                        }
                        Mina.getData('');
                    }
                    else {
                        alert('your product name "' + name + '" was not valid, please try again to save your product');
                    }
                } else {
                    top.login && top.login.MOUSEDOWN();
                    /*update by ljj 20140623 保存时未登录弹出登陆框*/
                }
            });

        })
        z.TOOLS.preview_main_div = preview_main_div;
    }
    preview_main_div.V();
}
,
savePosAll_2        : function () {			//保存笔触到pos_all	-> brushDiff
    var z = this;
    var penSetting = z.PLAY.step == 0 ? z.brushDiff(2) : z.brushDiff(0); //D.STEP ==0，读取所有并初始化last，否则，读取变化值
    if (penSetting) {	//如果笔触没有变化，addBrush返回值是0
        z.PLAY.pos_all[z.PLAY.step] = [penSetting];
        z.PLAY.step++;
    }
}
,
toolsSet_2        : function () {			//所有工具条		-> createTopxxx / createLeftxxx / createSubxxx / layerToolsSet / colorFixedSet
    var z = this;

    z.TOOLS.color_fenge = '#cccccc';
    z.TOOLS.color_sanjiao = '#b5b5b5';
    z.TOOLS.color_bg = '#e6e6e6';
    z.TOOLS.color_over = '#efefef';
    z.TOOLS.color_select = '#f9f9f9';
    z.TOOLS.color_text = '#858585';

    z.TOOLS.div = $.C(z.BOARD.div.FATHER, {Z: 60, BG: 'blue'});
    z.TOOLS.up_tools = $.C(z.TOOLS.div, {
        T: 5, W: 980, H: 45
        , BD: '1px solid ' + z.TOOLS.color_fenge
        , BG: z.TOOLS.color_bg
        , BS: '3px 3px 5px rgba(0,0,0,0.3)'
    })
    z.createTopLayer();
    z.createTopBg();
    z.createTopUndo();
    z.createTopRedo();
    z.createTopClear();
    z.createTopZoom();
    z.createTopPlay();
    z.createTopSave();

    z.createSubLayer();
    z.createSubBg();
    z.createSubBgColor();
    z.createSubBgModel();
    z.createSubLinmo();

    z.layerToolsSet();

    z.TOOLS.right_all = $.C(z.TOOLS.div, {L: 5, T: 5, BG: 'red'});
    z.TOOLS.vertical_tools = $.C(z.TOOLS.right_all, {
        W: 60, H: 688
        , BD: '1px solid ' + z.TOOLS.color_fenge
        , BG: z.TOOLS.color_bg
        , BS: '3px 3px 5px rgba(0,0,0,0.3)'
        //, BS: '10px 10px 5px #888888'
    });
    var drag = $.C(z.TOOLS.right_all, {W: 60, H: 45, G: z})
        .DRAG({
            goal: z.TOOLS.right_all
            , click: function (eobj) {
                var z = eobj.G_;
                if (z.TOOLS.vertical_tools.H_ > 344) {
                    z.TOOLS.vertical_tools.S({H: 45, O: 'hidden'});
                    z.TOOLS.up_tools.H();
                    z.COLOR.div.H();
                    z.TOOLS.sub_layer.H();
                    z.TOOLS.sub_bg.H();
                    z.TOOLS.width_slide.H();
                } else {
                    z.TOOLS.vertical_tools.S({H: 688, O: ''});
                    z.TOOLS.up_tools.V();
                }
            }
        });
    z.createLeftCross();
    z.createLeftBrush();
    z.createLeftRubber();
    z.createLeftStraw();
    z.createLeftColor();
    z.createLeftWidth();

    z.colorFixedSet();
}
,
colorRainbow_3    : function () {			//					-> hsv2rgba_2
    var z = this;
    var ctx = z.COLOR.rainbow.CTX.I().LW(4);
    var cw = z.COLOR.cw;
    var ch = z.COLOR.ch;
    var step = (cw - 3) / 359;
    var j = 0, x;

    ctx.lineCap = 'butt';
    //绘制彩虹条
    while (j < 360) {
        x = step * j + (j ? 3 : 0);
        ctx.B()
            .M(x, ch - 30)
            .L(x, ch)
            .S(z.hsv2rgba_2(j, 1, 1, 1));

        j++;
    }

    //绘制黑白渐变条
    ctx
        .B().LW(10)
        .M(5, 0)
        .L(5, ch - 33)
        .LG(5, 0, 5, ch - 33,
        [[0, '#ffffff']
            , [0.02, '#ffffff']
            , [0.98, '#000000']
            , [1, '#000000']
        ], 1
    )
        .S()
        .FS('#ffffff')
}
,
colorGradient_3    : function (h) {			//渐变色			-> hsv2rgba_2
    var z = this;
    var ctx = z.COLOR.gradient.CTX.CR();

    //渐变色
    ctx.LW(4);
    ctx.lineCap = 'butt';
    var r = z.COLOR.ch - 37, x1 = 10, x2 = z.COLOR.cw, y1, y2;
    var step = 4 / r;
    for (var s = 0; s <= 1.01; s += step) {
        y1 = r * (1 - s) + 2;
        y2 = y1;
        ctx.B()
            .M(x1, y1)
            .L(x2, y2)
            .LG(x1, y1, x2, y2,
            [[0, z.hsv2rgba_2(h, 0, s, 1)],
                [1, z.hsv2rgba_2(h, 1, s, 1)]
            ], 1
        )
            .S();
    }
}

,
colorBoardSet_4    : function () {			//					-> colorRainbow_3 / colorSlide
    var z = this;
    var cw = 300; 		//彩带的半径
    var ch = 300; 		//彩带的半径

    z.COLOR.div = $.C(z.TOOLS.div, {
        L: 63, W: cw + 75, H: ch + 35
        , BG: z.TOOLS.color_bg
        , BD: '1px solid #c1c1c1'
        , BS: '3px 3px 5px rgba(0,0,0,0.7)'
        , O: 'hidden'
    })
        //.mousedown(function(){})	//用于隔断冒泡，不然锚点会触发click
        .H();

    z.COLOR.cw = cw;
    z.COLOR.ch = ch;

    //logo
    z.COLOR.logo = $.C(z.COLOR.div, {L: 0, T: 0, W: 35, H: 35}, 'canvas');
    z.COLOR.logo.CTX
        .B().TL(10, 8)
        .LW(1)
        .M(4, 2).L(4, 18)
        .M(12, 2).L(12, 18)
        .M(20, 2).L(20, 18)
        .S('#666666')
        .CB(2, 5, 4, 4, 0).F('#ffffff').S()
        .CB(10, 10, 4, 4, 0).F('#ffffff').S()
        .CB(18, 12, 4, 4, 0).F('#ffffff').S()
    ;

    //title
    z.COLOR.title = $.C(z.COLOR.div, {L: 45, T: 8, I: '调色板', F: 12, C: z.TOOLS.color_text});

    //close
    z.COLOR.close_div = $.C(z.COLOR.div, {L: z.COLOR.div.W_ - 30, T: 5, W: 24, H: 24, G: z}, 'canvas')
        .mousedown(function (eobj) {
            eobj.G_.COLOR.div.H();
        });
    z.COLOR.close_div.CTX.M(5, 5).L(19, 19).M(5, 19).L(19, 5).LW(3).S('red');

    //调色板
    z.COLOR.main = $.C(z.COLOR.div, {L: 3, T: 32});
    z.COLOR.boxshadow = $.C(z.COLOR.div, {
        L: z.COLOR.main.L_,
        T: z.COLOR.main.T_,
        W: cw,
        H: ch - 33,
        BS: '2px 2px 3px rgba(0,0,0,0.7) inset'
    });

    //基色
    z.COLOR.gradient = $.C(z.COLOR.main, {W: cw, H: ch}, 'canvas');

    //渐变色
    z.COLOR.rainbow = $.C(z.COLOR.main, {W: cw, H: ch}, 'canvas');

    //彩虹焦点，hsv-h
    z.COLOR.focu1 = $.C(z.COLOR.main, {W: 4, H: 4, BD: '1px solid #000000', BG: '#ffffff'});

    //渐变焦点，hsv-s/b
    z.COLOR.focu2 = $.C(z.COLOR.main, {W: 4, H: 4, BD: '1px solid #000000', BG: '#ffffff'});

    //历史颜色
    z.COLOR.his = $.C(z.COLOR.div, {
        L: cw + 8
        , T: 29
        , W: 61
        , H: z.COLOR.div.H_ - 36
        //, BD: '1px solid #c1c1c1'
    });

    //点击交互
    z.COLOR.mousearea = $.C(z.COLOR.div, {L: z.COLOR.main.L_, T: z.COLOR.main.T_, W: cw, H: ch, G: z})
        .mousedown(z.colorClick_6)
        .mousemove(z.colorClick_6)
        .mouseup(function () {
        });

    z.colorSlide();

    z.colorRainbow_3();
}
,
colorDrawAll_4    : function () {			//					-> colorGradient_3 / opacity.setPosInfo
    var z = this;
    var cw = z.COLOR.cw;
    var ch = z.COLOR.ch;
    if (z.TOOLS.color_for != 'bg') {
        var r = z.BRUSH.color_r;
        var g = z.BRUSH.color_g;
        var b = z.BRUSH.color_b;
        var h = z.BRUSH.color_h;
        var s = z.BRUSH.color_s;
        var v = z.BRUSH.color_v;
        z.TOOLS.color_board_fg.S({BG: z.pressColorGet()});
        z.COLOR.opacity.setPosInfo($.R(z.BRUSH.color_a * 100));
    } else {
        var hsv = z.rgb2hsv(z.BOARD.color_r, z.BOARD.color_g, z.BOARD.color_b);
        var r = z.BOARD.color_r;
        var g = z.BOARD.color_g;
        var b = z.BOARD.color_b;
        var h = hsv[0];
        var s = hsv[1];
        var v = hsv[2];
        z.TOOLS.color_board_bg.S({BG: z.rgba(z.BOARD.color_r, z.BOARD.color_g, z.BOARD.color_b, z.BOARD.color_a)});
        z.COLOR.opacity.setPosInfo($.R(z.BOARD.color_a * 100));
    }
    if (z.COLOR.color_h != h
        || z.COLOR.color_s != s
        || z.COLOR.color_v != v
    ) {
        if (z.COLOR.color_h != h) {
            clearTimeout(z.COLOR.timer);
            z.COLOR.timer = setTimeout(function () {
                z.colorGradient_3(h);
            }, 10);
        }

        z.COLOR.focu1.S({						//彩虹焦点
            L: (cw) * h / 360 - 3
            , T: ch - 18
        });

        z.COLOR.focu2.S({
            L: (cw - 10) * s + 7
            , T: (ch - 33) * (1 - v) - 3
        });

        z.COLOR.color_h = h;
        z.COLOR.color_s = s;
        z.COLOR.color_v = v;

        z.COLOR.slide_r.setPosInfo(r);
        z.COLOR.slide_g.setPosInfo(g);
        z.COLOR.slide_b.setPosInfo(b);
        z.COLOR.slide_h.setPosInfo(h);
        z.COLOR.slide_s.setPosInfo(s);
        z.COLOR.slide_v.setPosInfo(v);
        z.COLOR.string16.val(z.rgb2str(r, g, b));
    }
}
,
brushTypeSet_5    : function (type) {		//设置笔触参数		-> brushSet_4 / buttonChoice
    var z = this;
    var d = z.BRUSH.diameter;
    if (z.BRUSH.last_choose) {
        z.BRUSH['last_' + z.BRUSH.last_choose] = d;
    }

    if (type == 'brush') {
        z.brushSet_4({
            '0': z.BRUSH.last_brush || d
            , '1': 0.1		//0.1 速度敏感
            , '2': 0.75	//0.5 笔宽敏感，压感敏感
            , '3': 1		//1	  触点平滑，N/A
            , '4': 0.75	//0.7 笔锋长度
            , '5': 0.5		//0.5 间隔
            , '9': z.BRUSH.color_a || 1
            , '10': 1
            , '11': 0
        });
    }
    else if (type == 'pen') {
        z.brushSet_4({
            '0': z.BRUSH.last_pen || d
            , '1': 0
            , '2': 0
            , '3': 0.6
            , '4': 0.3
            , '5': 0.1
            , '10': 2
            , '11': 0
        });
    }
    else if (type == 'pencil') {
        z.brushSet_4({
            '0': z.BRUSH.last_pencil || d
            , '1': 0.83
            , '2': 0.52
            , '3': 0.72
            , '4': 0.55
            , '5': 0.25
            , '10': 1
            , '11': 0
        });
    }
    else if (type == 'rubber') {
        z.brushSet_4({
            '0': z.BRUSH.last_rubber || d
            , '1': 0.1		//0.1 速度敏感
            , '2': 0.75	//0.5 笔宽敏感，压感敏感
            , '3': 1		//1	  触点平滑，N/A
            , '4': 0.75	//0.7 笔锋长度
            , '5': 0.5   	//0.5 间隔
            , '10': 1
            , '11': 1
        });
    }
    z.BRUSH.last_choose = type;
}
,
colorSet_5        : function (s, r, g, b, a) {	//					-> colorDrawAll_4 / rgb2hsv
    var z = this;
    if (z.TOOLS.color_for != 'bg') {
        var hsv = z.rgb2hsv(r, g, b);
        if (s == 'colorClick_6_rainbow') {
            var att = {'6': hsv[0]};
        } else {
            var att = {'6': hsv[0], '7': hsv[1], '8': hsv[2], '9': a};
        }
        z.brushSet_4(att);
    } else {
        if (s == 'colorClick_6_rainbow') {
            var hsv = z.rgb2hsv(r, g, b);
            var rgb = z.hsv2rgb(hsv[0], z.BOARD.color_s, z.BOARD.color_v);
            var att = {'12': rgb[0], '13': rgb[1], '14': rgb[2], '15': a, '24': 2};
        } else {
            var att = {'12': r, '13': g, '14': b, '15': a, '24': 2};
        }
        z.brushSet_4(att);
    }
    z.colorDrawAll_4();
}
,
initDraw_5        : function () {			//					-> colorDrawAll_4 / brushSet_4 /  colorHisShow /savePosAll_2
    var z = this;
    z.CACHE.cache = [[]];

    z.TOOLS.layerControlArr && z.TOOLS.layerControlArr.forEach(function (z) {
        z.R()
    });
    z.TOOLS.layerControlArr = [];

    z.LAYER.layers.forEach(function (z) {
        z.draw.R(), z.temp.R()
    });
    z.LAYER.layers = [];
    z.LAYER.sequence = [0];
    z.LAYER.show_status = [];
    z.LAYER.opacity = [];
    z.LAYER.focus = 0;

    z.PLAY.I = 0;
    z.PLAY.J = 0;
    z.PLAY.step = 0;
    z.PLAY.total_time = 0;
    z.PLAY.now_process = 0;
    z.PLAY.time_sum = 0;

    z.COLOR.his_list = localStorage.colorhis ? JSON.parse(localStorage.colorhis) : [];
    z.colorHisShow();

    z.brushSet_4({
        0: 10        //笔宽	 	0.1-200									r0 diameter
        , 1: 0.1       //速度敏感 	0-1 1：最敏感							r1
        , 2: 0.75      //笔宽敏感 	0-1 1：最敏感							r2
        , 3: 1         //触点平滑 	0-1 1：最平滑							r3
        , 4: 0.75      //笔锋长	0-1 1：最长；drawEnd用到；目前固定值0.8 r4
        , 5: 0.5       //间隔比例	0-1 fillCircle_2/circle 用到 				r5
        , 6: 0         //H			0-360
        , 7: 0         //S			0-1
        , 8: 0.3       //B			0-1
        , 9: 1         //透明度	0-1
        , 10: 1         //笔触类型	1实心, 2钢笔, 3粗笔, 4细笔, 5超细笔 BRUSH.type
        , 11: 0         //是否橡皮	1是
        , 12: 255       //背景-r	0-255
        , 13: 255       //背景-g	0-255
        , 14: 255       //背景-b	0-255
        , 15: 1         //背景-a	0-1
        , 16: 1         //缩放		倍数
        , 17: '000102'  //层分布	字符串，两个数字表示一个层，'00010203' num2arr, layerAdd_3
        , 18: 0         //选择层	整数
        , 19: ''     	//层隐藏	正整数，转换成二进制来表示层的隐藏, z.arr2num([1,1]) = 7	num2arr, layerShowHide
        , 20: ''		//层透明度	字符串 layerAlphaSet
        , 21: 0         //层清空	整数-1: 1，2，3；0忽略
        , 22: 3			//设备		1触屏, 2鼠标, 3手写板
        , 23: 2			//版本		整数, 2: 2014/3/18开始
        , 24: 2         //填充层	整数
    });
    z.savePosAll_2();
    z.colorDrawAll_4();
    z.TOOLS.sub_bg.S({H: 120, O: ''});

    z.brushTypeSet_5('brush');
    z.buttonChoice('brush_img');
}
,
setBrushRubber_5    : function (rubber) {		//					-> brushSet_4
    var z = this;

    z.BRUSH.is_rubber = rubber; //z.BRUSH.is_rubber ? 0 : 1;
    //ADJ.pen_type_input.rub_checkbox.ATT({checked:rubber ? !z.BRUSH.is_rubber : z.BRUSH.is_rubber})

    if (z.BRUSH.is_rubber) {
        //把当前笔触数据保存到 DRAW.pencil_obj;
        z.DRAW.pencil_obj = {
            0: z.BRUSH.diameter   				//0
            , 11: 0
        }

        if (!z.DRAW.rubber_obj) {
            z.DRAW.rubber_obj = {
                11: 1
            }
        }
        //恢复橡皮数据
        z.brushSet_4(z.DRAW.rubber_obj);
    } else {
        //把当前笔触数据保存到 DRAW.rubber_obj;
        z.DRAW.rubber_obj = {
            0: z.BRUSH.diameter   				//0
            , 11: 1
        }

        if (z.DRAW.pencil_obj) {
            z.brushSet_4(z.DRAW.pencil_obj);
        }
        //恢复橡皮数据
    }
}

,
beginDraw_6        : function () {			//					-> initDraw_5 / colorBoardSet_4 / resize_2 / posCatchAdd / brushAdjustSets / toolsSet_2 / drawMode_2 / shortcutDesc
    var z = this;

    z.DRAW = {};
    z.TOOLS = {};
    z.COLOR = {};
    z.TOUCH = {};
    z.PLAY.pos_all = [];

    z.shortcutDesc();
    z.posCatchAdd();
    z.toolsSet_2();
    z.brushAdjustSets();
    z.colorBoardSet_4();

    z.resize_2(1);

    z.drawMode_2();

    z.TOOLS.eyeimg = new Image();
    z.TOOLS.eyeimg.src = 'img/eye.png';
    z.TOOLS.eyeimg.onload = function () {
        z.initDraw_5({G_: z});
    };
}
,
clearBoard_6        : function (eobj) {		//					-> initDraw_5
    if (confirm('确认删除当前绘画吗')) {
        var z = eobj.G_;
        z.PLAY.pos_all = [];
        z.initDraw_5();
    }
}
,
colorClick_6        : function (eobj) {		//					-> colorSet_5
    var z = eobj.G_;
    clearTimeout(z.COLOR.gradient_timer);
    var pos = $.POS(eobj);
    var x = eobj.X - pos.x;
    var y = eobj.Y - pos.y;
    var cw = z.COLOR.cw;
    var ch = z.COLOR.ch;
    var area;
    if (Math.abs(x - 5) < 5 && y < ch - 33) {	//黑白区域
        var ctx = z.COLOR.rainbow.CTX;
        x = 5;
        y = $.B(1, ch - 34, y);
        area = 'black_white';
    }
    else if (Math.abs(y - (ch - 15)) < 15) {		//彩虹区域			
        var ctx = z.COLOR.rainbow.CTX;
        x = $.B(1, cw - 1, x);
        y = ch - 16;
        area = 'rainbow';
    } else {									//渐变色区域
        var ctx = z.COLOR.gradient.CTX;
        x = $.B(11, cw - 1, x);
        y = $.B(1, ch - 32, y);
        area = 'gradiant';
    }
    var imgData = ctx.getImageData(x, y, 1, 1).data;
    z.colorSet_5('colorClick_6_' + area, imgData[0], imgData[1], imgData[2]);
}
,
posAdd_6            : function (from) {		//采集数据点		-> smooth_5
    var z = this;

    var dx = z.DRAW.save_pos[0] - z.DRAW.last_pos[0];
    var dy = z.DRAW.save_pos[1] - z.DRAW.last_pos[1];
    var dt = z.DRAW.save_pos[2] - z.DRAW.last_pos[2];
    var dp = z.DRAW.save_pos[3] - z.DRAW.last_pos[3];

    clearTimeout(z.DRAW.timer);
    if (from != 'up') {
        z.DRAW.timer = setTimeout(function () {
            z.DRAW.save_pos = [z.DRAW.save_pos[0], z.DRAW.save_pos[1], $.MS(), z.DRAW.save_pos[3]];
            z.posAdd_6('add');
        }, 20);
    } else {

    }

    //PENCIRCLE.moveTo({X: z.DRAW.save_pos[0], Y: z.DRAW.save_pos[1]});
    var len2 = dx * dx + dy * dy; //距离平方
    if (len2 + dt * dt / 10 > 200 || len2 == 0 || from == 'up') {

        z.PLAY.total_time += $.B(0, from == 'down' ? z.PLAY.hua_inter : z.PLAY.pos_inter, dt);
        z.PLAY.now_process = z.PLAY.total_time;
        var cache_order = Math.floor(z.PLAY.now_process / 60000) + 1;
        if (z.CACHE.cache[cache_order]) {	//undo之后再绘画，才会使cache_order失效
            z.CACHE.cache.splice(cache_order);
        }

        z.PLAY.pos_group.push(dx, dy, dt, dp);
        z.smooth_5(dx, dy, dp);

        z.DRAW.last_pos[0] = z.DRAW.save_pos[0];
        z.DRAW.last_pos[1] = z.DRAW.save_pos[1];
        z.DRAW.last_pos[2] = z.DRAW.save_pos[2];
        z.DRAW.last_pos[3] = z.DRAW.save_pos[3];
    }
}

,
posDown_7            : function (y) {			//					-> posAdd_6 / cursorMove / pressureGet / colorSet_5
    var z = y.G_;
    z.TOOLS.sub_bg.S({H: 40, O: 'hidden'});

    if (z.BRUSH.last_att) {		//undo未完成，屏蔽点击
        return;
    }
    if (!z.BOARD.canvas_draw) {	//??
        y.IS_DOWN = 0;
        return;
    }
    //D.tool = p==0 ? ($.IS.T ? 'touch' : 'mouse') : 'pen';	//只有在down时才知道是不是pen
    z.DRAW.div.S({title: ''});

    var cursor_type = z.CURSOR.type;
    //缩放状态
    if (cursor_type == '+' || cursor_type == '-') {
        //保持光标所在的点位置不变
        var dx = y.X;
        var dy = y.Y;
        var div = z.BOARD.div;

        //前一状态
        var pre = {
            L: div.L_
            , T: div.T_
            , W: div.W_
        };
        var pos = $.POS(z.BOARD.div);

        //缩放
        if (cursor_type == '-') {
            z.TOOLS.zoom_slide.decrease.MOUSEDOWN();
        } else {
            z.TOOLS.zoom_slide.increase.MOUSEDOWN();
        }

        var r = div.W_ / pre.W;

        z.BOARD.div.S({
            L: pre.L + (dx - pos.x) * (1 - r)
            , T: pre.T + (dy - pos.y) * (1 - r)
        });

        var pos = $.POS(z.BOARD.div);
        z.DRAW.init_pos = [pos.x, pos.y];
        z.cursorMove(y.X - z.DRAW.init_pos[0], y.Y - z.DRAW.init_pos[1]);

        y.IS_DOWN = 0;
        return;
    }

    //按空格按下，鼠标平移画布
    if (cursor_type == 'm') {
        y.l_x = y.X;
        y.l_y = y.Y;
        //z.IS_DOWN = 0;
        return;
    }

    /*
     //播放过程中，点击无效

     if(D.is_play_step){
     z.IS_DOWN = 0;
     return ;
     }
     */
    //吸色
    if (cursor_type == 'i') {
        var temp = z.layer2temp();
        var imgData = temp.CTX.getImageData(
            (y.X - z.DRAW.init_pos[0]) / z.BOARD.view_rate
            , (y.Y - z.DRAW.init_pos[1]) / z.BOARD.view_rate
            , 1, 1).data;

        temp.CTX.CR();
        temp.V();

        //点击吸色后立刻变为笔刷
        //z.TOOLS.brush_img.MOUSEDOWN();

        if (!imgData[3]) {
            z.colorSet_5('suck_blank', 255, 255, 255);
        } else {
            z.colorSet_5('suck', imgData[0], imgData[1], imgData[2]);
        }

        y.IS_DOWN = 0;
        return;
    }


    var p = z.pressureGet();

    z.BOARD.type = p == 0 ? ($.IS.T ? 1 : 2) : 3;	//只有在down时才知道是不是pen
    //touch 1
    //mouse 2
    //wacom 3
    //$.MSG(p==0 ? ($.IS.T ? '触' : '鼠') : '笔');
    if (!y.t) {
        y.t = y.T;
    }

    z.BOARD.scaling = z.BOARD.view_rate;	//绘制比例，通常与画板显示尺寸和实际尺寸的比例是一致的，回放则不一致
    //http://www.cnblogs.com/jenry/archive/2012/02/11/2347012.html
    //Canvas里的globalCompositeOperation
    if (z.BRUSH.is_rubber) {
        z.DRAW.goal = z.BOARD.canvas_draw.CTX;
    } else {
        z.DRAW.goal = z.BOARD.canvas_temp.CTX;
    }
    var gco = z.BRUSH.is_rubber ? 'destination-out' : 'source-over';
    if (z.DRAW.goal.globalCompositeOperation != gco) {
        z.DRAW.goal.GC(gco);
    }
    $.E(z.DRAW.goal, {
        lineCap: 'round',
        lineJoin: 'round'
    });

    z.DRAW.last_pos = [z.DRAW.init_pos[0], z.DRAW.init_pos[1], !z.DRAW.last_pos ? y.T : z.DRAW.last_pos[2], 0];
    z.DRAW.save_pos = [y.X, y.Y, y.T, p];
    z.cursorMove(y.X - z.DRAW.init_pos[0], y.Y - z.DRAW.init_pos[1]);
    z.posAdd_6('down');
    //关闭所有子菜单
    z.TOOLS.sub_layer.H();
    z.TOOLS.sub_bg.H();
    z.TOOLS.width_slide.H();
    z.COLOR.div.H();
}
,
posMove_7            : function (y) {			//					-> posAdd_6 / cursorMove / pressureGet
    var z = y.G_;
    if (z.lastDU == 'up') {
        return;
    }
    if (z.CURSOR.type == 'm') {
        var ql = y.X - y.l_x
            , qt = y.Y - y.l_y;
        y.l_x = y.X;
        y.l_y = y.Y;
        if (z.TOOLS.sub_layer.isH()) {
            //
            var div = z.BOARD.div;
            div.S({
                L: div.L_ + ql
                , T: div.T_ + qt
            });
            var pos = $.POS(z.BOARD.div);
            z.DRAW.init_pos = [pos.x, pos.y];
            z.cursorMove(y.X - z.DRAW.init_pos[0], y.Y - z.DRAW.init_pos[1]);
        }
        else {
            var layer = z.LAYER.layers[z.LAYER.focus];
            layer.S({L: layer + ql, T: layer + qt});
        }
        return;
    }
    //协作
    if (z.FFF) {
        y.P = z.P;
    } else {
        var p = z.pressureGet();
        if (p == 0 && z.BOARD.type < 3) {
            p = 1000;
        }
    }
    z.DRAW.save_pos = [y.X, y.Y, y.T, p];
    z.cursorMove(y.X - z.DRAW.init_pos[0], y.Y - z.DRAW.init_pos[1]);
    z.posAdd_6('move');

    //超过了画框外95像素警戒线，当out处理，画域在画框外延展100像素
    var dx = y.X - z.DRAW.init_pos[0];
    var dy = y.Y - z.DRAW.init_pos[1];
    var m = 95;
    if (dx < -m || dx > (z.BOARD.div.W_ + m) || dy < -m || dy > (z.BOARD.div.H_ + m)) {
        z.posUp_7(y);
        y.IS_DOWN = 0;
    }
}
,
posUp_7            : function (y) {			//					-> posAdd_6 / drawEnd_5 / colorAdd_2 / temp2draw / preDraw / timetipSet
    var z = y.G_;

    if (z.PLAY.drawlist.length < 5) {	//如果只点了一下
        //D.init();
        //return;
    }

    if (!z.DRAW.goal) {
        return;
    }

    if (z.CURSOR.type == 'm') {
        return;
    }
    z.BOARD.div.S({Z: 50}); //?

    z.DRAW.save_pos = [z.DRAW.save_pos[0], z.DRAW.save_pos[1], $.MS(), z.DRAW.save_pos[3]];
    //HIS.start_times[D.STEP] = z.T;

    z.posAdd_6('up');

    if (z.BOARD.type < 3) {
        z.drawEnd_5();
    }

    if (z.PLAY.step < z.PLAY.pos_all.length) {	//当中插笔画，便删掉后面的所有
        z.PLAY.pos_all.splice(z.PLAY.step);
        var penSetting = z.brushDiff(2);
        //D.STEP ==0，读取所有并初始化last，否则，读取变化值
    } else {
        var penSetting = z.PLAY.step == 0 ? z.brushDiff(2) : z.brushDiff(0);
    }
    z.PLAY.I = z.PLAY.step;
    if (penSetting == 0) {	//如果笔触没有变化，addBrush返回值是0
        z.PLAY.pos_all[z.PLAY.step] = z.PLAY.pos_group;
    } else {
        z.PLAY.pos_all[z.PLAY.step] = [penSetting].concat(z.PLAY.pos_group);
        z.colorAdd_2();
    }

    //z.LAYER.layers[z.LAYER.focus].changed = 1;

    if (!z.BRUSH.is_rubber) {
        z.temp2draw()
    }

    z.preDraw('poscatch');
    //z.changed = 1;

    z.PLAY.step++;

    z.timetipSet();
}

,
stepUndo_8        : function (eobj) {		//					-> play_7
    var z = eobj ? eobj.G_ : this;
    if (z.PLAY.step > 0) {
        z.PLAY.step = $.B(0, z.PLAY.pos_all.length, z.PLAY.step - 1);
        //D.changed = 1;
        z.PLAY.total_time = z.totalTimeCalc();

        z.PLAY.I = 0;
        z.PLAY.J = 0;
        z.PLAY.now_process = 0;
        z.PLAY.show_count = 0; //用于统计没间隔n步就显示一次。不至于出现死机现象

        z.BRUSH.last_att = JSON.stringify(z.CACHE.last_att);
        z.play_7('', z.PLAY.total_time);
    }
}

,
stepRedo_9        : function (eobj) {		//					-> stepUndo_8
    var z = eobj ? eobj.G_ : this;
    if (z.PLAY.step < z.PLAY.pos_all.length) {
        z.PLAY.step += 2;
        z.stepUndo_8();
    }
}

,
playMode_10        : function (eobj) {		//					-> speed1Set_9 / barFadein_2
    var z = eobj.G_;
    z.TOOLS.div.H();
    z.COLOR.div.H();
    z.DRAW.div.H();

    z.speed1Set_9(z.BAR.div_speed1);
    z.barFadein_2();

    z.HELP.div.H();

    window.LOGIN && LOGIN.H();
}
,
shortcutKey_10    : function (eobj, v, z) {	//快捷键			-> stepRedo_9 / stepUndo_8 / cursorSet
    if (z.TOOLS.is_over) {
        return;	//如果在输入框里按下键，忽略
    }
    var match = {
        16: 'shift'
        , 17: 'ctrl'
        , 18: 'alt'
        , 32: 'space'
        , 66: 'b'
        , 67: 'c'
        , 69: 'e'
        , 70: 'f'
        , 73: 'i'
        , 90: 'z'
        , 109: 'minus'	//- 小键盘
        , 173: 'minus'	//-
        , 189: 'minus'
        , 61: 'plus'	//+
        , 107: 'plus'	//+ 小键盘
        , 187: 'plus'
    };
    var c = match[eobj.KEYCODE] || eobj.KEYCODE;
    var k = z.TOUCH;
    var y;
    if (v) {
        if (k[c]
                //支持重复按键的罗列如下
            && c != 219		//[
            && c != 221		//]
            && c != 'minus'	//-
            && c != 'plus'	//+
        ) {
            return;
        }
        k[c] = v;
    } else {
        k[c] = v;
        if (1
            && c != 'alt'
            && c != 'space'
        ) {
            return;
        }
    }

    if (0) {
    }
    else if (k.e) {/*$.MSG(21);*/
        z.TOOLS.rubber_img.MOUSEDOWN()
    }				//橡皮		->setCircle
    else if (k.b) {/*$.MSG(20);*/
        z.TOOLS.brush_img.MOUSEDOWN()
    }				//笔		->setCircle
    else if (k.c) {/*$.MSG(19);*/
        y = z.TOOLS.color_board_fg;
        y.MOUSEDOWN(y)
    }	//调色板开关
    else if (k.f) {/*$.MSG(18);*/
        y = z.TOOLS.color_board_bg;
        y.MOUSEDOWN(y)
    }	//调色板开关
    else if (k.i) {/*$.MSG(17);*/
        z.TOOLS.straw_img.MOUSEDOWN()
    }				//吸色状态
    else if (c == 219) {/*$.MSG(16);*/
        z.TOOLS.penwid.decrease.MOUSEDOWN()
    }		//宽度 -，画笔橡皮通用
    else if (c == 221) {/*$.MSG(15);*/
        z.TOOLS.penwid.increase.MOUSEDOWN()
    }		//宽度 +，画笔橡皮通用 
    else if (k.ctrl && k.shift && k.z) {/*$.MSG(14);*/
        z.stepRedo_9();
        c = ''
    }						//前进 ->
    else if (k.ctrl && k.z) {/*$.MSG(13);*/
        z.stepUndo_8();
        c = ''
    }						//后退 <-
    else if (k.minus) {/*$.MSG(12);*/
        z.TOOLS.zoom_slide.decrease.MOUSEDOWN()
    }	//缩小 -
    else if (k.plus) {/*$.MSG(11);*/
        z.TOOLS.zoom_slide.increase.MOUSEDOWN()
    }	//放大 +
    //else if(	   	  k.alt			&& k.space		){/*$.MSG(10);*/z.TOOLS.zoom_slide.decrease.MOUSEDOWN()}	//缩小 -
    //else if(k.ctrl 				&& k.space		){/*$.MSG(9) ;*/z.TOOLS.zoom_slide.increase.MOUSEDOWN()}	//放大 +
    else if (k.space) {/*$.MSG(8) ;*/
        z.cursorSet('m')
    }							//拖动状态，配合点击
    else if (c == 'space' && !k.space) {/*$.MSG(7) ;*/
        z.cursorSet(k.ebi || 'b')
    }					//拖动恢复 b/e/z
    else if (c == 'alt') {/*$.MSG(6) ;*/
        z.TOOLS.straw_img.MOUSEDOWN()
    }				//吸色状态
    //else if(!k.alt &&  							){/*$.MSG(5) ;*/c = 'b'; z.cursorSet(c)}					//笔状态
    //else if(z.CURSOR.type == '-'	&& k.z			){/*$.MSG(4) ;*/c = k.ebi || 'b'; z.cursorSet(c)}			//取消缩小状态 
    //else if(		   				   k.z		 	){/*$.MSG(3) ;*/z.cursorSet('-')}							//缩小状态，配合点击 -

    if ($.F('ebi', c)) {		//最近一次ebi值
        k.ebi = c;
    }
}
})
;
$(function () {
    var wacom = document.getElementById('wtPlugin');
    try {
        wacom.penAPI.pressure;
        Mina.WACOM = wacom;

        wacom.style.marginLeft = '-500px';
        $.LOG('wacom support');
    }
    catch (e) {
        wacom.parentNode.removeChild(wacom);
        Mina.WACOM = {
            penAPI: {pressure: 0}
        };
        $.LOG('wacom not support');
    }

    $('#hidden_iframe').H()

    Mina.getData = function (s) {
        var z = Mina.list[Mina.focus];
        var temp = z.layer2temp();
        var img = temp.context.toDataURL();
        img = img.substring(22);

        var bg = [];

        var y = z.LAYER.layers;
        for (var i = y.length - 1; i >= 0; i--) {
            if (y[i].bg) {
                bg.push([y[i].bg, i]);
            }
        }

        temp.CTX.CR();
        temp.V();

        var obj = {
            NAME: z.CACHE.tmp.name
            , title: z.CACHE.tmp.title
            , DATA: z.compress(JSON.stringify(z.PLAY.pos_all))
            , TYPE: 'image/png'
            , BGC: ''
            , WIDTH: z.BOARD.canvas_w
            , HEIGHT: z.BOARD.canvas_h
            , tag: JSON.stringify(z.CACHE.tmp.tipsel)
            , nick: z.CACHE.tmp.nick
            , portrait: z.CACHE.tmp.portrait
            , member_id: z.CACHE.tmp.member_id
            , imgs: s
            , bg: JSON.stringify(bg)
            , is_public: 1
        };

        obj.LEN = obj.DATA.length;

        z.call({
            MONGOFSSTORE: img + $.SPLIT2 + JSON.stringify(obj)
        });
        z.TOOLS.pop = $.C(z.TOOLS.preview_main_div, {
            I: '正在保存图片"' + z.CACHE.tmp.name + '" ，请稍后。。。'
            , L: (top.$.IW() - 530) / 2 + 200
            , T: (top.$.IH() - 380) / 2 + 100
            , W: 250
            , H: 50
            , BG: "#fff"
            , BD: "3px solid #e5e5e5"
        });
        //Close();
    };
    $.body
        .keydown(function (eobj) {
            if (Mina.focus) {
                var z = Mina.list[Mina.focus];
                z.shortcutKey_10(eobj, 1, z);
            }
        }, 1)
        .keyup(function (eobj) {
            if (Mina.focus) {
                var z = Mina.list[Mina.focus];
                z.shortcutKey_10(eobj, 0, z);
            }
        }, 1)
        .WHEEL(function (eobj) {
            if (Mina.focus) {
                var z = Mina.list[Mina.focus];
                if (z.TOUCH.space) {
                    if (eobj.WHL < 0) {
                        z.CURSOR.type = '-';
                    } else {
                        z.CURSOR.type = '+';
                    }
                    eobj.G_ = z;
                    z.posDown_7(eobj);
                }
            }
        });
});
