window.onload = function() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    //跳转语句
    if (system.win || system.mac || system.xll) {
        // alert("PC访问");
        getRem(3240, 100)
            // $("body").css({ "width": "11.25rem", "margin": " 0 auto" });
        document.body.style['width'] = '11.25rem';
        document.body.style['margin'] = '0 auto';
        document.body.style['background-size'] = '11.25rem 24rem';
        document.body.style['background-position'] = 'center';
        // $(".page").css({"width":"11.25rem","margin":" 0 auto"});


    } else {
        // alert("非PC访问");
        getRem(1125, 100);

    }
    /*720代表设计师给的设计稿的宽度，你的设计稿是多少，就写多少;100代表换算比例，这里写100是
      为了以后好算,比如，你测量的一个宽度是100px,就可以写为1rem,以及1px=0.01rem等等*/

};
window.onresize = function() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    //跳转语句
    if (system.win || system.mac || system.xll) {
        // alert("PC访问");
        console.log("pc访问");
    } else {
        // alert("非PC访问");
        getRem(1125, 100);

    }

};

function getRem(pwidth, prem) {
    var html = document.getElementsByTagName("html")[0];
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    html.style.fontSize = oWidth / pwidth * prem + "px";
}