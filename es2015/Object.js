/**
 * Created by gaojian08 on 16/8/28.
 */

console.log(Object.is(11,11));

/*
 *   Object.setPrototypeOf(target,prototype)
 */
var foo = {
    x() {
        return 111;
    },

    y() {
        return 222;
    }
};

var test = () => 1;
Object.setPrototypeOf(test,foo);
console.log(test.x());
console.log(Object.getPrototypeOf(test));


