/**
 * 两个有序数组，合并成一个有序数组，最快的方法
 */

const a = [1, 3, 5, 6, 8];
const b = [2, 6, 9];

let i = 0;
let j = 0;
let k = 0;
const arr = [];

while (i < a.length && j < b.length) {
	if (a[i] === b[j]) {
		arr[k++] = a[i] = b[j];
		i++;
		j++;
		continue;
	}
	arr[k++] = a[i] < b[j] ? a[i++] : b[j++];
}

while (i < a.length) {
	arr[k++] = a[i++];
}

while (j < b.length) {
	arr[k++] = b[j++];
}

console.log(arr);  // [ 1, 2, 3, 5, 6, 8, 9 ]
