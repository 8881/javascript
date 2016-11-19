/**
 * Created by g.j on 16/3/28.
 */

var canvas = document.querySelector('#canvas'),context;

var canvasSupport = function(){
    return document.createElement('canvas').getContext('2d');
};

if(canvasSupport()){
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    context = canvas.getContext('2d');

    context.save();

    // context.strokeStyle = 'rgba(0,0,0,1)';
    // context.lineCap = 'butt';
    // context.lineWidth = 10;
    // context.lineJoin = 'round';

    //画圆
    // context.beginPath();

    //下凹弧线
    /*context.moveTo(100,100);
    context.quadraticCurveTo(400,900,700,100);*/

    //s形
    /*context.moveTo(150,0);
    context.bezierCurveTo(0,300,300,175,150,300);*/



    // context.stroke();
    // context.closePath();

    context.setTransform(1,0,0,1,0,0);  //设置x,y都不缩放
    context.translate(250,250);  //移动原点到正方形中心
    context.rotate(45 * Math.PI / 180);   //旋转45°  x * Math.PI/180
    context.fillStyle = '#000';
    context.fillRect(-50,-50,100,100);  //从正方形左上角开始画

    context.restore();

    context.fillStyle = '#ff0000';
    context.scale(2,2);  //x,y轴都放大两倍
    context.fillRect(0,0,50,50);  //实际的长宽是100*100

    context.restore();

    context.setTransform(1,0,0,1,0,0);  //消除上边scale导致的缩放
    context.strokeStyle = '#f17172';
    context.lineWidth = 1;
    context.strokeRect(100,100,100,100);


    context.restore();

    var gr = context.createLinearGradient(0,0,100,0);  //创建渐变色
    gr.addColorStop(0,'rgba(0,0,0,1)');
    gr.addColorStop(1,'rgba(255,255,255,1)');

    context.fillStyle = gr;
    context.fillRect(0,400,100,100);

    context.restore();

    var gr2 = context.createLinearGradient(0,0,0,100);  //创建渐变色
    gr2.addColorStop(0,'rgb(0,0,0)');
    gr2.addColorStop(1,'rgb(255,255,255)');

    context.beginPath();
    context.lineWidth = 10;
    context.strokeStyle = gr2;
    context.moveTo(200,400);
    context.lineTo(200,500);
    context.stroke();
    context.closePath();

}