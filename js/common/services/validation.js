import {servicesModule} from "./module";

/**
 * 格式校验
 *
 * Created by jinyong on 16-9-5.
 */
export default function() {
    servicesModule
        .factory('formatVal', function(){
            var VALIDATE_IP_RANGE = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}(\/([12][0-9]|3[0-2]|[0-9])){0,1}$/;
            var VALIDATE_IP_RANGE_LINE = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/;
            var VALIDATE_PORT = /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])(-([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])){0,1}$/;
            var TASK_NAME = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{4,}$/;    //支持中文、数字、字母、-与_的匹配(至少4位以上)
            var USER_NAME = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{4,}$/;    //支持中文、数字、字母、-与_的匹配(至少4位以上)

            var service = {
                validateIpRange : validateIpRange,
                validatePortRange : validatePortRange,
                validateTaskName : validateTaskName,
                validateUserName : validateUserName
            };
            return service;

            function validateIpRange(ipRange) {
                if (!ipRange.match(VALIDATE_IP_RANGE) && !ipRange.match(VALIDATE_IP_RANGE_LINE)) {
                    return false;
                }else{
                    //校验格式:1、192.168.0.1/24; 2、192.168.0.1-192.168.0.115
                    var ips = ipRange.split('/')[0].split('-');
                    for(var i=0; i < ips.length; i++){
                        var ip = ips[i];
                        var lst = ip.split('.');
                        lst = lst.map(parseInt);
                        //A类地址范围：1.0.0.1—126.255.255.254(0-127,其中0.0.0.0和127.0.0.0保留)
                        //B类地址范围：128.1.0.0—191.254.255.254(128-191,其中128.0.0.0和191.255.0.0保留)
                        //C类地址范围：192.0.1.0—223.255.254.254(192-223,其中192.0.0.0和223.255.255.0保留)
                        // --暂不考虑 D类地址范围：224.0.0.0—239.255.255.255
                        // --暂不考虑 E类地址范围：240.0.0.0—255.255.255.255
                        if(lst[0]===0 || lst[0]===127 || lst[0]>223){
                            return false;
                        }
                        if(ip==="1.0.0.0" || ip==="126.255.255.255" || ip==="128.0.0.0" || ip==="191.255.255.255" || ip==="192.0.0.0" || ip==="223.255.255.255"){
                            return false;
                        }
                    }
                }
                return true;
            }

            function validatePortRange(portRange){
                if (!portRange.match(VALIDATE_PORT)){
                    return false;
                }
                return true;
            }

            function validateTaskName(name){
                if (!name.match(TASK_NAME)){
                    return false;
                }
                return true;
            }

            function validateUserName(name){
                if (!name.match(USER_NAME)){
                    return false;
                }
                return true;
            }
        });

}
