import {auth} from "./auth.module";

/**
 * 安全认证
 *
 * Created by jinyong on 16-9-5.
 */
export default function() {
    auth
        .factory('auth', /*@ngInject*/function($rootScope, $cookies, $timeout, $http, $uibModalStack, $state, $q,
                                               $crypto, Enum, tokenKey, accessToken, TIMEOUT, URI, CWD){
//            var _identity = {
//                name:''
//            };

            var service = {
                whoAmI: whoAmI,
                welcome: welcome,
                login: login,
                clear: clear,
                logout: logout,
                shutdown: shutdown,
                reboot: reboot,
                encrypt: encrypt,
                decrypt: decrypt,
                checkSessionTimeout: checkSessionTimeout,
                parseToken: parseToken,
                getSecretKey: getSecretKey
            };

            return service;

            /**
             * 利用token校验身份(刷新时也会重新验证)
             *
             */
            function whoAmI() {
                //TODO:MW支持了api之后再释放
                //$http.get(URI + '/auth/whoami'),
                return $http.get(CWD + '/navmenu.json').then(function (/*data*/) {
                    //TODO:具体的返回值结构要与MW协调
                    // set root user privilege on UI side
//                    $rootScope.isRootUser = false;
//                    if(data[0].data.user.name === 'root' && data[0].data.user._roles[0].roleId === "0"){
//                        $rootScope.isRootUser = true;
//                    }
//
//                    (function() {
//                        _identity = data[0].data.user;
//                        Enum.set('privilege', data[0].data.targetAndActionValueFormList);
//                        Enum.set('deviceAccess', data[0].data.deviceIds);
//                        Enum.set('Role', data[0].data.user._roles);
//                        Enum.set('userType', data[0].data.user._type);
//                        $rootScope.navmenu = data[1].data;
//
//                        //$rootScope.$broadcast('username', _identity);
//                        //SystemUser.userToken();
//                    })();
                }, function(data) {
                    if (data.status === 401) {
                        console.error('current user was unauthenticated.');
                    }
                });
            }

            /**
             * 校验是否需要跳转到欢迎页
             *
             * 返回值：{"Status": 1/0}, 1代表已安装客户端，0代表未安装需要跳转到欢迎页
             */
            function welcome(){
                return $http.get(URI + '');
            }

            /**
             * 登录系统
             *
             * 返回值：{"Status": 1/0}, 1代表成功，0代表失败
             */
            function login(data){
                return $http({
                    method: 'post',
                    url: URI + '/api/priviage/login',
                    data: data,
                    responseType:'json',
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                        }
                        return str.join("&");
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }

            /**
             * 关闭弹窗，返回登陆页
             *
             */
            function clear() {
                $uibModalStack.dismissAll();
                $state.go('auth');
            }

            /**
             * 登出系统
             *
             * 返回值：{"Status": 1/0}, 1代表成功，0代表失败
             */
            function logout(data){
                return $http.post(URI+'logout', data);
            }

            /**
             * 关闭设备
             *
             * 返回值：{"Status": 1/0}, 1代表成功，0代表失败
             */
            function shutdown(){
                //TODO 目前没有接口
            }

            /**
             * 重启设备
             *
             * 返回值：{"Status": 1/0}, 1代表成功，0代表失败
             */
            function reboot(){
                //TODO 目前没有接口
            }

            /**
             * 加密认证相关信息
             *
             * 返回值：密文
             */
            function encrypt(content){
                var key = sessionStorage.getItem(tokenKey);
                if(key){
                    try{
                        content = $crypto.encrypt(content, btoa(key));
                    }catch(exp){
                        content = '';
                    }
                }
                return content;
            }

            /**
             * 解密认证相关信息
             *
             * 返回值：明文
             */
            function decrypt(content){
                var key = sessionStorage.getItem(tokenKey);
                if(key){
                    try{
                        content = $crypto.decrypt(content, btoa(key));
                    }catch(exp){
                        content = '';
                    }
                }
                return content;
            }

            /**
             * 前端session超时计数器（如果由server端来维护session则不需要使用）
             *
             */
            function checkSessionTimeout(){
                $timeout.cancel($rootScope.checkSessionTimeout);
                //超时时间设置
                $rootScope.checkSessionTimeout = $timeout(function(){
                    $cookies.remove(accessToken);
                }, TIMEOUT*60000);
            }

            /**
             * 获取认证用token信息
             *
             * 返回值：{oper_user: '@user'
             user_auth: '@privilege'}
             */
            function parseToken(){
                var token = $cookies.get(accessToken);
                if(token){
                    var decToken = decrypt(token);
                    return decToken?JSON.parse(decToken):'';
                }
                return token;
            }

            /**
             * 获取加密用SecretKey
             *
             */
            function getSecretKey(){
                return $http({
                    method:'get',
                    url:URI + '/api/priviage/getSecretKey',
                    params:null
                });
            }

        });
}
