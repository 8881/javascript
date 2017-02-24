/**
 * 数组拍平
 */

const arr = [1, [2], 3, [4, [5, 6]]];

function foo(arr) {
	const newArr = [];

	const f = function (arr) {
		for (let i = 0, len = arr.length; i < len; i++) {
			// 如果是数组就递归
			if (Array.isArray(arr[i])) {
				f(arr[i]);
			} else {
				newArr.push(arr[i]);
			}
		}
	};

	f(arr);

	return newArr;
}

console.log(foo(arr));   // [ 1, 2, 3, 4, 5, 6 ]
