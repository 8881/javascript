'use strict';

const nav = document.querySelector('.nav');
nav.addEventListener('click', e => {
  console.log(e.target.nodeName);
  if (e.target.nodeName === 'A') {
    const href = e.target.getAttribute('data-href');
    const target = document.querySelector(href);
    const to = target.offsetTop;
    const from = document.body.scrollTop;
    scroll(from, to);
  }
}, false);

function scroll(from, to, interval) {
  const _interval = interval ? interval : 200;
  const beginTime = Date.now();
  const endTime = beginTime + _interval;

  function loop() {
    const now = Date.now();
    const cur = (to - from) / _interval * (now - beginTime) + from;
    if (now < endTime) {
      document.body.scrollTop = cur;
      requestAnimationFrame(loop);
    } else {
      document.body.scrollTop = to;
    }
  }

  requestAnimationFrame(loop);
}
