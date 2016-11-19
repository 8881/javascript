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


    context.strokeStyle = 'rgba(0,0,0,1)';
    context.lineWidth = 1;
    context.strokeRect(0,0,100,100);
    context.strokeRect(100,100,400,400);

}