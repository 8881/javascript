/**
 * Created by gaojian08 on 16/7/18.
 */

var oldXMLHttpRequest = window.XMLHttpRequest;

window.XMLHttpRequest = function () {
    var actual = new oldXMLHttpRequest();
    var self = this;

    ["status", "statusText", "responseType", "response",
        "readyState", "responseXML", "upload"].forEach(function (item) {
        Object.defineProperty(self, item, {
            get: function () {
                return actual[item];
            }
        });
    });

    ["ontimeout, timeout", "withCredentials", "onload", "onerror", "onprogress"].forEach(function (item) {
        Object.defineProperty(self, item, {
            get: function () {
                return actual[item];
            },
            set: function (val) {
                actual[item] = val;
            }
        });
    });

    ["addEventListener", "send", "abort", "getAllResponseHeaders",
        "getResponseHeader", "overrideMimeType", "setRequestHeader"].forEach(function (item) {
        Object.defineProperty(self, item, {
            value: function () {
                return actual[item].apply(actual, arguments);
            }
        });
    });

    // 修改open 请求地址
    Object.defineProperty(self, 'open', {
        value: function () {
            var val = parseInt(localStorage.getItem(location.host));
            if (!isNaN(val)) {
                var a = document.createElement('a');
                a.href = arguments[1];

                a.host = 'localhost:' + val;

                // 替换host
                arguments[1] = a.href;
            }
            return actual['open'].apply(actual, arguments);
        }
    });

    // this.onreadystatechange = null;
    //
    // actual.onreadystatechange = function () {
    //     if (this.readyState == 4) {
    //
    //         var url = new RegExp(blocker.req, 'ig');
    //         if (url.test(this.responseURL)) {
    //         // 修改响应
    //             self.responseText = JSON.stringify(blocker.res);
    //         }
    //     }
    //     if (self.onreadystatechange) {
    //         return self.onreadystatechange();
    //     }
    // };
};
