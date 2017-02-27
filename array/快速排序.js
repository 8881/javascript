/**
 * 快速排序
 */

const arr = [3, 6, 2, 9, 5, 1, 4, 8, 7];

const foo = function (arr) {
	if (arr.length <= 1) {
		return arr;
	}

	const middleIndex = Math.floor(arr.length / 2);
	const middle = arr.splice(middleIndex, 1)[0];
	const left = [];
	const right = [];

	for (let i = 0, len = arr.length; i < len; i++) {
		if (arr[i] < middle) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}

	return foo(left).concat([middle], foo(right));
};

console.log(foo(arr));
