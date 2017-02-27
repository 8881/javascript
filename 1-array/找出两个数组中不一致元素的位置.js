/**
 * 两个数组元素相同，可能乱序，向其中一个数组中插入一个元素，问最快的方法找出这个元素和他的位置
 */

const a = [1, 2, 3, 4, 5, 6, 7];
const b = [1, 2, 3, 4, 8, 5, 6, 7];

let i = 0;
let search = 0;

while (i < b.length) {
	if (a.indexOf(b[i]) == -1) {
		search = b[i];
		break;
	} else {
		i++;
	}
}

console.log(search);
