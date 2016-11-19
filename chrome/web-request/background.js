chrome.webRequest.onBeforeRequest.addListener(function (detail) {

    console.log(detail.type);

    if (detail.type == 'xmlhttprequest') {
        /*return {
            redirectUrl: "http://23.88.58.151:8887/webapi/home?page_size=5&cur_page=1"
        }*/
    }


}, {urls: ["<all_urls>"]}, ['blocking']);


chrome.webRequest.onBeforeRedirect.addListener(function (details) {
    console.log(details);
}, {urls: ["<all_urls>"]});