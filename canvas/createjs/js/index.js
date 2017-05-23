'use strict';

function init () {
  const stage = new createjs.Stage("demoCanvas");
  stage.canvas.width = window.innerWidth * window.devicePixelRatio;
  stage.canvas.height = window.innerHeight * window.devicePixelRatio;

  // 避免多次调用update
  createjs.Ticker.addEventListener("tick", function () {
    stage.update();
  });

  /**
   * 画圆
   */
  const circle = new createjs.Shape();
  circle.graphics.beginFill("red").drawCircle(50, 50, 100);
  circle.x = circle.y = 50;
  circle.addEventListener('click', function () {
    alert('circle');
  });
  stage.addChild(circle);

  /**
   * 画正方形
   */
  const rect = new createjs.Shape();
  rect.graphics.beginFill("#f17172").drawRect(300, 300, 200, 200);
  rect.addEventListener('click', function () {
    alert('rect');
  });
  rect.alpha = 0;
  createjs.Tween.get(rect, { loop: false, override: true }).wait(500)
    .to({ alpha: 1 }, 1000)
    .call(function () {
      console.log('show done.');
    });
  stage.addChild(rect);


  /**
   * 写文字
   */
  const title = new createjs.Text('Hello createjs', '40px Arial', '#ffffff');
  title.x = 50;
  title.y = 30;
  stage.addChild(title);
}
