'use strict';

var arr = [
    {
        id: 1,
        name: 'a'
    },
    {
        id: 1,
        name: 'b'
    },
    {
        id: 1,
        name: 'c'
    },
    {
        id: 2,
        name: 2
    },
    {
        id: 3,
        name: 3
    }
];

var array_reduce = function(arr){
    return arr.reduce(function (prev, next, index, array) {
        // 复制,防止污染原数组
        var _prev = JSON.parse(JSON.stringify(prev));
        // 存储归并累加数组
        var temp = index === 1 ? [_prev] : _prev;
        var cur = temp[temp.length - 1];
        if (cur.id === next.id) {
            cur.name = cur.name + next.name;
        } else {
            temp.push(next);
        }
        return temp;
    })
};

console.log(array_reduce(arr));  // [{id:1,name:'abc'},{id:2,name:2},{id:3,name:3}]
