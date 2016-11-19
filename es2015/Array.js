/**
 * Created by gaojian08 on 16/8/28.
 */

function xx() {
    console.log(arguments);
    console.log([...arguments]);   // 扩展运算符,背后调用的是遍历器接口
    console.log(Array.prototype.slice.call(arguments));
    console.log([].slice.call(arguments));
    // Array.from()
    console.log(Array.from(arguments));
}

xx(1, 2, 3);

/* Array.from()方法用于将两类对象转为真正的数组.
 * 1 类数组对象(有length属性的对象,比如arguments) 和 Dom操作返回的NodeList集合(querySelectorAll)
 * 2 可遍历对象(包括es6新增的Set和Map)
 */

// Array.from()接受第二个参数,类似于map方法
console.log(Array.from([1, 2, 3], (x) => x * x));    // [1, 4, 9]
console.log(Array.from([1, , 2, , 3], (n) => n || 0));   // [1, 0, 2, 0, 3]

// Array.of()  用于将一组值,转换为数组,可以用来替代Array()或者new Array()
Array.of(3, 11, 8);   // [3,11,8]
Array.of(3);  // [3]
Array.of(3).length;  // 1

/* Array.copyWithin()  在当前数组内部,将指定位置的成员复制到其他位置(会覆盖原有成员),然后返回当前数组
 *
 * Array.prototype.copyWithin(target, start = 0, end = this.length)
 * 接受三个参数:
 * target（必需）：从该位置开始替换数据。
 * start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
 * end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
 */

[1, 2, 3, 4, 5].copyWithin(0, 3);  // [4, 5, 3, 4, 5]
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4); // [4, 2, 3, 4, 5]

/*
 * find() & findIndex
 */
var a = [
    {id: 1, name: '111'},
    {id: 2, name: '222'}
];
// 提供了一种新的不需要循环遍历查询字段对应值得方法
console.log(a.find(item => item.id === 1).name);   // '111'
console.log(a.findIndex(item => item.id === 2));   // 1

// 另外,这俩个方法都可以发现NaN,弥补了indexOf不能识别数组NaN成员的不足

/*
 * fill() 使用给定值填充一个数组
 */

['a', 'b', 'c'].fill(7); // [7, 7, 7]
new Array(3).fill(7); // [7, 7, 7]
['a', 'b', 'c'].fill(7, 1, 2); // ['a', 7, 'c']

/*
 * ES6提供三个新的方法——entries()，keys()和values()——用于遍历数组。
 * 它们都返回一个遍历器对象（详见《Iterator》一章），可以用for...of循环进行遍历，
 * 唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
 */

for (let index of ['a', 'b'].keys()) {
    console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
    console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
}
// 0 "a"
// 1 "b"

/*
 * includes()  判断某个数组是否包含给定的值
 * 第二个参数表示搜索的起始位置，默认为0
 */
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

// ES6明确将数组空位转为undefined