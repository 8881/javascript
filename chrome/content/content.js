/**
 * Created by gaojian08 on 16/7/17.
 */

var path = chrome.extension.getURL('xhr.js');
var script = document.createElement('script');
script.src = path;

document.documentElement.appendChild(script);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.storage) {
            localStorage.setItem(location.host, request.storage);
        } else {
            localStorage.removeItem(location.host);
        }

    });

