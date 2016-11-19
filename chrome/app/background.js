/**
 * Created by gaojian08 on 16/7/16.
 */

'use strict';

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        bounds: {
            left: 20,
            top: 50,
            width: 375,
            height: 667
        },
        resizable: true,
        alwaysOnTop: false,
        focused: true
    });
});

chrome.app.runtime.onSuspend.addEventListener(function () {
    // TODO 关闭前清理工作
});