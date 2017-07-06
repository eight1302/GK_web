import {servicesModule} from "./module";

/**
 * Angular configuration providers
 *
 * Created by jinyong on 16-9-7.
 */
export default function() {
    servicesModule
        //内容格式转换
        .provider('transformRequest',function(){
            this.$get = function(){
                return {
                    json2form: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                        }
                        return str.join("&");
                    }
                };
            };
        });

}