'use strict';

$(function () {

    var getData = $.getJSON('./data.json');

    var temp = '';
    getData.done(function(res){
        res.forEach(function(item){
            temp += '<div class="box">\
            <div class="qr-code">\
                <img src="'+item.qrImg+'" width="180" height="180"/>\
            </div>\
            </div>';
        });

        $('.container').append(temp);
    });

    $(document).on('mouseenter', '.box', function (e) {
        $(this).find('.qr-code').show();
    }).on('mouseleave', '.box', function (e) {
        $(this).find('.qr-code').hide();
    });
});
