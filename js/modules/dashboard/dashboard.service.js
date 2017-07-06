import {dashboard} from "./dashboard.module";

/**
 * 首页等公用部分
 *
 * Created by jinyong on 16-9-28.
 */
export default function() {
    dashboard
        .factory('dashboardService',/*@ngInject*/function($http,CWD,URI){
            return {
                'securityEvts':securityEvts,
                'sysStatus':sysStatus,
                'clientInfo':clientInfo,
                'dashboard':dashboard
            };

            function securityEvts(){
                return $http.get(CWD + "securityEvts.json").then(function (data) {
                    return data.data;
                });
            }
            function sysStatus(){
                return $http({
                    url:URI + '/api/system/getSysStat',
                    method:'get',
                    params:''
                });
                /*return $http.get('sysStatus.json').then(function(res){
                    return res.data;
                });*/
            }
            function clientInfo(){
                return $http.get(URI+'/api/home/'+'getClientInfo').then(function(data){
                    return data.data;
                });
            }
            function dashboard(){


                /**
                 * 测试客户端->MW->UI的数据交互展示
                 *
                 * 返回值：json格式客户端硬件信息
                 */

                return $http.get(URI + '/test/testForQueryStatus');

            }
        });

}
