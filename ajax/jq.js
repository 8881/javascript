'use strict';

$(function () {
    $(document)
        .on('click', '.jq-get', function () {
            // get
            $.ajax({
                url: url + '/webapi/get',
                type: 'GET',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function (res) {
                    console.log(res);
                },
                error: function (ex) {
                    console.error(ex);
                }
            });
        })
        .on('click', '.jq-post', function () {
            // post
            $.ajax({
                url: url + '/webapi/post',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: {
                    id: 1
                },
                success: function (res) {
                    console.log(res);
                },
                error: function (ex) {
                    console.error(ex);
                }
            });
        })
});

