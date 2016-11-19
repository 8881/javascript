function color_generator() {
    var letter = '0123456789abcdef'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letter[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clock(el) {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = h >= 10 ? h : ('0' + h);
    m = m >= 10 ? m : ('0' + m);
    s = s >= 10 ? s : ('0' + s);

    el.innerHTML = h + ":" + m + ":" + s;
    el.style.color = color_generator();
    setTimeout(function () {
        clock(el)
    }, 1000);
}

var clock_div = document.getElementById('clock');
clock(clock_div);
