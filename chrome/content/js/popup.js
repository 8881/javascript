/**
 * Created by gaojian08 on 16/7/28.
 */

var switch_btn = document.querySelector('.js-switch');
var port = document.querySelector('.js-port');
var error = document.querySelector('.js-error');
var submit = document.querySelector('.js-submit');

var chrome_tab = function (fn) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var url = tabs[0].url;
        var a = document.createElement('a');
        a.href = url;

        fn(tabs[0], a.host);
    });
};

// 打开popup判断是否已经开启
chrome_tab(function (tabs, host) {
    var _port = parseInt(localStorage.getItem(host));
    if (!isNaN(_port)) {
        port.value = _port;
        switch_btn.checked = true;
        port.removeAttribute('disabled');
        submit.removeAttribute('disabled');
    }
});

switch_btn.addEventListener('click', function (e) {
    var checked = e.currentTarget.checked;

    if (checked) {
        port.removeAttribute('disabled');
        submit.removeAttribute('disabled');
    } else {
        port.setAttribute('disabled', true);
        submit.setAttribute('disabled', true);
        chrome_tab(function (tabs, host) {
            localStorage.removeItem(host);
            chrome.tabs.sendMessage(tabs.id, {storage: false}, function (response) {
                chrome.tabs.reload(tabs.id);
                window.close();
            });
        });
    }
}, false);

port.addEventListener('focus', function () {
    error.style.display = 'none';
}, false);

submit.addEventListener('click', function (e) {
    var val = port.value;
    if (val === '') {
        error.style.display = 'block';
    } else {
        chrome_tab(function (tabs, host) {
            localStorage.setItem(host, val);
            chrome.tabs.sendMessage(tabs.id, {storage: val}, function (response) {
                chrome.tabs.reload(tabs.id);
                window.close();
            });
        });
    }
}, false);

