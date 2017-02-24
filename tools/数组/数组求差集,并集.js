/**
 * 数组求差集，并集
 */

const a = [1, 2, 5, 6, 8];
const b = [2, 4, 8, 10];

const odd = [];  // 奇数数组，差集
const even = [];  // 偶数数组，并集

function loop(arr) {
	for (let i = 0, len = arr.length; i < len; i++) {
		const index = odd.indexOf(arr[i]);
		if (index === -1) {
			odd.push(arr[i]);
		} else {
			odd.splice(index, 1);
			even.push(arr[i]);
		}
	}
}

loop(a);
loop(b);

console.log(odd);   // [ 1, 5, 6, 4, 10 ]
console.log(even);   // [ 2, 8 ]
