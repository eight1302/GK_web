/**
 * Login Config
 *
 * Created by jinyong on 16-9-5.
 */
export default /*@ngInject*/function($stateProvider, CWD) {
    //缺省页 & 欢迎页(下载) & 登录页
    $stateProvider
        .state('index', {
            parent: 'root',
            url: "/",
            views: {
                '@': {
                    controller: "RedirectCtrl"
                }
            }
        })

        .state('welcome', {
            parent: 'root',
            url: "/welcome",
            views: {
                '@': {
                    templateUrl: CWD + "templates/auth/welcome.html",
                    controller: "welcomeCtrl as auth"
                }
            }
        })

        .state('auth', {
            parent: 'root',
            url: "/login",
            views:{
                '@':{
                    templateUrl: CWD + "templates/auth/login.html",
                    controller: "authCtrl as auth"
                }
            }
        })

        .state('download', {
            parent: 'root',
            url: "/download",
            views:{
                '@':{
                    templateUrl: CWD + "templates/auth/download.html",
                    controller: "downloadCtrl as auth"
                }
            }
        });
}
