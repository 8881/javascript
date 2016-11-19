var Cookie = {
    setCookie: function(name,value,expiredays,path,domain,secure){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    },
    getCookie: function (name) {
        var cname = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(cname) != -1) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = mesCookie.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};
