'use strict';

var path = require('path');
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

var config = {
    username: 'test',
    password: 'test',
    host: '23.88.58.151',
    port: 21,
    localRoot: path.join(__dirname, 'file'),
    remoteRoot: '/var/www/',
    exclude: []
};

ftpDeploy.on('uploading', function (data) {
    var totalFileCount = data.totalFileCount;       // total file count being transferred
    var transferredFileCount = data.transferredFileCount; // number of files transferred
    var percentComplete = data.percentComplete;      // percent as a number 1 - 100
    var filename = data.filename;             // partial path with filename being uploaded
    console.log('uploading', percentComplete + '%', transferredFileCount + '/' + totalFileCount, filename);
});

ftpDeploy.deploy(config, function (err) {
    if (err) {
        console.log(err);   // 如果报421,关掉其他ftp工具然后重试
    } else {
        console.log('done');
    }
});
