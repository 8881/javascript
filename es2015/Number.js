/**
 * Created by gaojian08 on 16/8/28.
 */

/*  @note
 *  ES5: 一元加操作符相当于Number()转型方法
 *  +'1' ===  Number('1');
 */

isFinite(25); // true
isFinite("25"); // true
Number.isFinite(25); // true
Number.isFinite("25"); // false

isNaN(NaN); // true
isNaN("NaN"); // true
Number.isNaN(NaN); // true
Number.isNaN("NaN"); // false


// ES5的写法
parseInt('12.34'); // 12
parseFloat('123.45#'); // 123.45

// ES6的写法
Number.parseInt('12.34'); // 12
Number.parseFloat('123.45#'); // 123.45

/*  @note
 *  逐步减少全局性方法,使得语言逐步模块化
 */

Number.isInteger(25);   // true
Number.isInteger(25.0);   // true   Javascript里整数和浮点数是同样的存储方法
Number.isInteger(25.1);   // false
Number.isInteger('25');   // false
Number.isInteger(true);   // false

// 去除一个数的小数部分,非数字会先Number()转为数值
Math.trunc(4.1);  // 4
Math.trunc(4.9);  // 4
Math.trunc(-4.1);  // -4
Math.trunc(-4.9);  // -4

/*
 *  Math.sign()  // 判断一个数到底是正数,负数还是零
 *  参数为正数，返回+1；
 *  参数为负数，返回-1；
 *  参数为0，返回0；
 *  参数为-0，返回-0;
 *  其他值，返回NaN。
 */

Math.sign(-5); // -1
Math.sign(5); // +1
Math.sign(0); // +0
Math.sign(-0); // -0
Math.sign(NaN);// NaN
Math.sign('foo'); // NaN
Math.sign();      // NaN

// Math.found()  // 返回一个数的单精度浮点数形式
Math.fround(0.2);  // 0.20000000298023224
Math.fround(0.1);  // 0.10000000149011612
Math.fround(0.3);  // 0.30000001192092896

// 指数运算符  **
console.log(2 ** 2);   // 4
console.log(2 ** 3);   // 8
