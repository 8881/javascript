'use strict';

var headers = new Headers({
    'content-type': 'application/json'
});

headers.append('Origin', 'http://localhost');

var params = {
    method: 'GET',
    headers: headers,
    mode: 'cors'
};

var f = fetch('http://23.88.58.151:8887/webapi/tag', params);

f.then((res) => {
    console.log(res);
    return res.json();   // arrayBuffer(),blob(),json(),text(),formData()
}).then((res) => {
    console.log(res);
}).catch((ex) => {
    console.log(ex);
});
