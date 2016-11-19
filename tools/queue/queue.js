'use strict';

var ajax = function (url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return false;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        xhr.send();
    });
};

var f1 = ajax('http://23.88.58.151:8887/webapi/tag');

f1.then((res) => {
    console.log(res);
}).catch((ex)=> {
    console.log(ex);
});