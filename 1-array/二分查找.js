/**
 * 给定数组，找出指定元素所在的位置（下标值）
 * 即实现 indexOf 方法
 */

const arr = [1, 2];

// 找出数字7的下标

function findIndex(arr, cell) {
	let index = 0;

	if (arr.length === 1) {
		return 0;
	}

	if (arr.length === 2) {
		return arr.indexOf(Math.max.apply(null, arr));
	}

	function foo(arr) {
		const middle = Math.floor(arr.length / 2);
		index += middle;
		if (arr[middle] > cell) {
			foo(arr.slice(0, middle));
		} else if (arr[middle] < cell) {
			foo(arr.slice(middle));
		} else {
			return true;
		}
	}

	foo(arr);

	return index;
}

console.log(findIndex(arr, 7)); // 6
