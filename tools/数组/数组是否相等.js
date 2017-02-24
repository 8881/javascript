/**
 * 数组是否相等
 * @type {[*]}
 */

const a = [1, 2, 3];
const b = [1, 2, 3];

Array.prototype.isEqual = function (arr) {

	function check(arr1, arr2) {
		for (let i = 0, len = arr1.length; i < len; i++) {
			const bool = arr2.some(function (item) {
				return Object.is(arr1[i], item);
			});
			if (!bool) return false;
		}
		return true;
	}

	return check(this, arr) && check(arr, this);
};


console.log(a.isEqual(b));
