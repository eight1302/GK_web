import {servicesModule} from "./module";

/**
 * 常用工具类
 *
 * Created by jinyong on 16-9-23.
 */
export default function() {
    servicesModule
        .factory('tools', /*@ngInject*/function(){
            //验证
            var fnValidate = {
                "Require": /.+/,
                "Email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                "Phone": /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
                "Mobile": /^((\(\d{3}\))|(\d{3}\-))?(1(3\d|5\d|8\d|7\d|7[0678]))\d{8}?$/, ///1(3\d|5[0-3]|5[5-9]|8[6-9])\d{8}$/,  ///^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}?$/,
                "MobileList": /^(\d{11}){1,2}$/,///(^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}\r?)?(^((\(\d{3}\))|(\d{3}\-))?(13|15|18)\d{9}\r?)$/,///^[\d\r\n]+$/,
                "Url": /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
                "IdCard": /^\d{15}(\d{2}[A-Za-z0-9])?$/,
                "Currency": /^\d+(\.\d+)?$/,
                "Number": /^\d+$/,
                "Zip": /^[1-9]\d{5}$/,
                "QQ": /^[1-9]\d{4,8}$/,
                "IP": /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/,
                "IPPORT": /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}(:\d{1,})?$/,
                "Integer": /^[-\+]?\d{1,9}$/,
                "PositiveInteger": /^[+]?\d{1,9}$/,   //正整数
                "One": /^\d+(\.\d)?$/,    //精确到小数点后一位
                "Double": /^[-\+]?\d+(\.\d+)?$/,  //精确到小数点后两位
                "English": /^[A-Za-z]+$/,
                "Chinese": /^[\u0391-\uFFE5]+$/,
                "UnSafe": /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
                "PostCode": /^\d{6}$/,
                "LessThanRowNum": /^(\d{1,11}\n?){1,1000}$/,
                "Illegal": /^[^ %&,'$\x22][^%&'$\x22]*$/,
                "Engine": /^[0-9a-zA-Z]+$/,
                "CarNo": /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/,
                "IllegalDiy": null,
                "Password": /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
            };

            var tools = {
                fnValidate: fnValidate,
                convertColor: convertColor,
                getRouterName: getRouterName,
                getRequestParams: getRequestParams,
                launchFullScreen: launchFullScreen,
                exitFullScreen: exitFullScreen,
                myBrowser: myBrowser,
                removeByArray: removeByArray,
                inArray: inArray,
                getSmpFormatNowDate: getSmpFormatNowDate,
                getSmpFormatDateByLong: getSmpFormatDateByLong,
                checkIpFormat:checkIpFormat
            };

            return tools;


            function checkIpFormat(ipAdd){
                if(ipAdd){
                    if(ipAdd.match(fnValidate.IP)){
                        return true;
                    }else{
                        return false;
                    }
                }
            }

            //转换颜色
            function convertColor() {
                function hex2rgb(hexColor){
                    let temp = parseInt(hexColor, 16);
                    return {
                        r : (temp >> 16) & 0xFF,
                        g : (temp >> 8) & 0xFF,
                        b : temp & 0xFF
                    };
                }
                function rgb2hex(rgbObj){
                    let hexs = [
                        rgbObj.r.toString(16),
                        rgbObj.g.toString(16),
                        rgbObj.b.toString(16)
                    ];
                    return "#" + hexs.map(hex=>{
                        return (hex.length === 1)?"0" + hex:hex;
                    }).join("");
                }
                return {
                    hex2rgb: hex2rgb,
                    rgb2hex: rgb2hex,
                    darker: function (hexColor) {
                        var rgb = hex2rgb(hexColor.replace('#',''));
                        //floor 向下取整
                        Object.keys(rgb).forEach(key=>{
                            rgb[key] = Math.floor(rgb[key] * 0.7);
                        });
                        return rgb2hex(rgb);
                    }
                };
            }

            //获取当前路由位置
            function getRouterName(){
                var url = window.location.href;
                var host = window.location.host;
                var protocol = window.location.protocol;
                var urlFirstHalf = protocol + "//" + host;
                var urlFirstHalfLen = urlFirstHalf.length;
                var urlEndPosition = url.indexOf("?");
                var urlPath;
                if(urlEndPosition > -1){
                    urlPath = url.substring(urlFirstHalfLen,urlEndPosition);
                }else{
                    urlPath = url.substring(urlFirstHalfLen);
                }
                return urlPath;
            }

            //获取url参数
            function getRequestParams(){
                var url = location.search; //获取url中"?"符后的字串
                var theRequest = {};
                if (url.indexOf("?") !== -1) {
                    var str = url.substr(1);
                    str = decodeURI(str);
                    var strs = str.split("&");
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
                    }
                }
                return theRequest;
            }

            //页面全屏
            //launchFullScreen(document.documentElement); // 整个网页
            //launchFullScreen(document.getElementById("videoElement")); // 某个页面元素
            function launchFullScreen(element){
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //退出页面全屏
            function exitFullScreen(){
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            //判断当前浏览器类型
            function myBrowser(){
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
                var isChrome = userAgent.indexOf("Chrome") > -1; //判断是否Chrome浏览器
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
                var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
                var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
                if(isIE){
                    var browser = navigator.appName;
                    var b_version = navigator.appVersion;
                    var version = b_version.split(";");   
                    var trim_Version = version[1].replace(/[ ]/g,"");
                    if(browser === "Microsoft Internet Explorer" && trim_Version === "MSIE6.0"){
                        return "IE6";
                    }else if(browser === "Microsoft Internet Explorer" && trim_Version === "MSIE7.0"){
                        return "IE7";
                    }else if(browser === "Microsoft Internet Explorer" && trim_Version === "MSIE8.0"){ 
                        return "IE8";
                    }else if(browser === "Microsoft Internet Explorer" && trim_Version === "MSIE9.0"){ 
                        return "IE9";  
                    }
                }else if(isOpera){
                    return "Opera";
                }else if(isFF){
                    return "Firefox";
                }else if(isSafari){
                    return "Safari";
                }else if(isChrome){
                    return "Chrome";
                }
            }

            //删除数组中的指定元素
            function removeByArray(arr,val){
                for(var i=0; i<arr.length; i++) {
                    if(arr[i] === val) {
                      arr.splice(i, 1);
                      break;
                    }
                }
                return arr;
            }

            //检测数组中是否存在指定元素
            function inArray(arr,val){
                if (arr.indexOf(val) > -1){
                    return true;
                }else{
                    return false;
                }
            }

            //扩展Date的format方法
            function dateFormat(date,format){
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            }
            /**
             *转换日期对象为日期字符串
             * @param date 日期对象
             * @param isFull 是否为完整的日期数据,
             * 为true时, 格式如"2000-03-05 01:05:04"
             * 为false时, 格式如 "2000-03-05"
             * @return 符合要求的日期字符串
             */
             function getSmpFormatDate(date, isFull){
                var pattern = "";
                if (isFull === true || isFull === undefined) {
                    pattern = "yyyy-MM-dd hh:mm:ss";
                } else {
                    pattern = "yyyy-MM-dd";
                }
                return getFormatDate(date, pattern);
             }
             /**
             *转换当前日期对象为日期字符串
             * @param date 日期对象
             * @param isFull 是否为完整的日期数据,
             * 为true时, 格式如"2000-03-05 01:05:04"
             * 为false时, 格式如 "2000-03-05"
             * @return 符合要求的日期字符串
             */
             function getSmpFormatNowDate(isFull){
                return getSmpFormatDate(new Date(), isFull);
             }
             /**
             *转换long值为日期字符串
             * @param l long值
             * @param isFull 是否为完整的日期数据,
             * 为true时, 格式如"2000-03-05 01:05:04"
             * 为false时, 格式如 "2000-03-05"
             * @return 符合要求的日期字符串
             */
             function getSmpFormatDateByLong(l, isFull){
                return getSmpFormatDate(new Date(l), isFull);
             }
             /**
             *转换日期对象为日期字符串
             * @param l long值
             * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
             * @return 符合要求的日期字符串
             */
             function getFormatDate(date, pattern){
                if (date === undefined) {
                    date = new Date();
                }
                if (pattern === undefined) {
                    pattern = "yyyy-MM-dd hh:mm:ss";
                }
                return dateFormat(date,pattern);
             }

        });
            
}