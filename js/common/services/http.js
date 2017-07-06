import {servicesModule} from "./module";

/**
 * http通信相关
 *
 * Created by jinyong on 16-9-5.
 */
export default function() {
    servicesModule
        //处理response错误
        .factory('handleResErr', /*@ngInject*/function ($rootScope) {
            return {
                catch: function (err, content) {
                    var config = {};
                    config.type = 'error';
                    if (err.status && err.status !== -1) {
                        config.content = content + '(' + err.status + ' ' + err.statusText + ')';
                    } else {
                        config.content = content;
                    }
                    $rootScope.addAlert(config);
                }
            };
        })

        //http请求过滤器
        .factory('httpInterceptor', /*@ngInject*/function ($rootScope, $q, $injector/*, $cookies*/) {
            var interceptor = {
                request: function (config) {
                    //TODO:如果MW支持token，则该部分可以删除
//                    //校验token,如果非法则跳转auth
//                    if(config && config.url.indexOf('/api/') >= 0){
//                        var auth = $injector.get('auth');
//                        var token = auth.parseToken();
//                        if(token){
//                            //向request params中添加oper_user属性
//                            config.params = config.params?config.params:{};
//                            config.params.oper_user = token.oper_user;
//                            //重置超时计数器
//                            auth.checkSessionTimeout();
//                        }else{
//                            auth.clear();
//                            //中断request请求
//                            var canceler = $q.defer();
//                            config.timeout = canceler.promise;
//                            canceler.resolve();
//                        }
//                    }
                    return config;
                },
                responseError: function (response) {
                    var auth = $injector.get('auth');
                    if (response.status === 401) {
                        auth.clear();
                    }
                    return $q.reject(response);
                }
            };
            return interceptor;
        });

}