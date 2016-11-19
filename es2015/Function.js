/**
 * Created by gaojian08 on 16/8/28.
 */

/*
 *  箭头函数
 *
 *  (1)函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
 * （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
 * （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。
 * （4）不可以使用yield命令，因此箭头函数不能用作Generator函数。
 *
 */

// 变量解构
const fullName = ({first, last}) => first + ' ' + last;
const person = {
    first: 'kobe',
    last: 'bryant'
};
fullName(person);  // 'kobe bryant'