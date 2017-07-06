/**
 * 安全认证
 *
 * Created by jinyong on 16-9-2.
 */
export default {
    'RedirectCtrl' : /*@ngInject*/RedirectCtrl,
    'welcomeCtrl' : /*@ngInject*/welcomeCtrl,
    'downloadCtrl' : /*@ngInject*/downloadCtrl,
    'authCtrl' : /*@ngInject*/authCtrl
};

function RedirectCtrl($state, $cookies, accessToken){
    var userCookie = $cookies.get(accessToken);
    if(userCookie !== null && userCookie !== undefined && userCookie !== ''){
        $state.go('monitor');
    }else{
        $state.go('auth');
    }
}

function welcomeCtrl(){

}

function downloadCtrl(){
    
}

function authCtrl($rootScope, $scope, $state, $cookies, $timeout, $crypto, auth, accessToken) {

    var vm = this;

    $scope.username=$scope.password=$scope.verifycode='';
    vm.login = function(){
        if($scope.error !== ''){
            $rootScope.addAlert({
                type:'error',
                content:$scope.error
            });
            return false;
        }

        auth.getSecretKey().then(function(resKey){
            var secretKey = resKey.data.key;

            auth.login({
               'username': btoa($crypto.encrypt($scope.username, secretKey)),
               'password': btoa($crypto.encrypt($scope.password, secretKey)),
               'verifycode':btoa($scope.verifycode)
            }).then(function(res){
               if(res && res.data.success === true){
                   $cookies.put(accessToken, res.data.message);
                   $state.go('monitor');
               }else{
                   $scope.authErr = '用户名或密码输入不正确';
               }
            }, function(){
               $scope.authErr = '服务器连接错误';
            });
        },function(errKey){
            console.log(errKey);
           $state.go('monitor');
        });
    };
    $scope.isOpen = false;
    vm.keyPress = function (event){
        $scope.isOpen=true;
        var e = event||window.event;
        var keyCode = e.keyCode||e.which; // 按键的keyCode
        var isShift = e.shiftKey ||(keyCode === 16 ) || false; // shift键是否按
        if (((keyCode >= 65&&keyCode <=90 ) && !isShift) ||((keyCode >= 97 && keyCode <= 122 )&&isShift)){
            $scope.isCapsLock = true;
        }else{
            $scope.isCapsLock = false;
        }
    };
    vm.keyUp = function(code,state,formCtrl){
        //TODO:去jquery化修改必要
        if($('.password').val()){
            if (code === 13) {
                formCtrl.$setSubmitted();
            }else if(code === 20){
                if(state && $scope.isOpen){
                    if($scope.isCapsLock === true){
                        $scope.isCapsLock = false;
                    }else{
                        $scope.isCapsLock = true;
                    }
                }
            }
        }
    };
    vm.showError = function(form){
        $scope.error = '';
        if(form){
            if((form.username.$dirty || form.$submitted) && form.username.$error.required){
                $scope.error = '用户名不允许为空';
                $scope.authErr = '';
            }else if((form.password.$dirty || form.$submitted) && !form.username.$error.required && form.password.$error.required){
                $scope.error = '密码不允许为空';
                $scope.authErr = '';
            }else if($scope.authErr){
                $scope.error = $scope.authErr;
            }else{
                $scope.error = '';
            }
        }
        return $scope.error;
    };

    vm.logout = function(){
        auth.logout().then(function(res){
            if(res && res.status === 1){
                $cookies.remove(accessToken);
                $timeout.cancel($rootScope.checkSessionTimeout);
                auth.clear();
            }else{
                $rootScope.addAlert({
                    type:'error',
                    content:'系统登出失败，请联系管理员'
                });
            }
        }, function(){
            $rootScope.addAlert({
                type:'error',
                content:'服务器连接错误'
            });
        });
    };
}