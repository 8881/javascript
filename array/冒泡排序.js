/**
 * 冒泡排序
 */

const arr = [3, 6, 2, 9, 5, 1, 4, 8, 7];

function bubble(arr) {
	const len = arr.length;
	for (let i = 0; i < len; i++) {
		for (let j = 0; j < len - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}
	return arr;
}

console.log(bubble(arr));

