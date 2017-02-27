/**
 * 数组去重 && 找出重复项
 */

const a = [1, 2, 3, 3, 4, 5, 5, 5, 6, 7, 7, 8];

const arr = [];
const repeat = [];

for (let i = 0, len = a.length; i < len; i++) {
	if (arr.indexOf(a[i]) === -1) {
		arr.push(a[i]);
	} else {
		repeat.push(a[i]);
	}
}

console.log(arr);   // [ 1, 2, 3, 4, 5, 6, 7, 8 ]
console.log(repeat);   // [ 3, 5, 5, 7 ]
