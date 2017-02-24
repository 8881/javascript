/**
 * Created by G.J on 16/1/18.
 */
const arr = [1, 3, 4, 5, 2, 2, 3];

const foo1 = function (arr) {
	console.time('foo1');
	const temp = [];
	for (let i = 0, len = arr.length; i < len; i++) {
		!~temp.indexOf(arr[i]) ? temp.push(arr[i]) : '';
	}
	console.timeEnd('foo1');
	return temp.sort();
};

console.log(foo1(arr));

const foo2 = function (arr) {
	console.time('foo2');
	const flag = {}, temp = [];
	for (let i = 0, len = arr.length; i < len; i++) {
		if (!flag[arr[i]]) {
			temp.push(arr[i]);
			flag[arr[i]] = true;
		}
	}
	console.timeEnd('foo2');
	return temp.sort();
};

console.log(foo2(arr));


