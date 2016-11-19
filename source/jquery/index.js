/**
 * Created by G.J on 16/1/18.
 */
var jQuery = function () {
    return new jQuery.prototype.init();
};

jQuery.prototype = {
    init: function () {
        this.age = 18;
        return this;
    },
    name: function () {
        return 'jQuery.name';
    },
    age: 20
};

jQuery.prototype.init.prototype = jQuery.prototype;

//console.log(jQuery().name());

function foo(list) {
    var task = list.shift(),
        len = list.length;

    task();

    if (len > 0) {
        foo(list);
    } else {
        console.log('done.');
    }
}

function fn1() {
    console.log(1);
}

function fn2() {
    console.log(2);
}

function fn3() {
    console.log(3);
}

//foo([fn1,fn2,fn3]);

var callback = $.Callbacks('memory');
callback.add(fn1);
callback.add(fn2);
callback.add(fn3);
callback.fire();
callback.add(function () {
    console.log('new func');
});
callback.fire();
