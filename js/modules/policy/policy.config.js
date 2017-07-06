/**
 * Dashboard Config
 *
 * Created by jinyong on 16-9-23.
 */
export default /*@ngInject*/function($stateProvider, CWD) {
    //策略管理
    $stateProvider
        .state('policy', {
            parent: 'root',
            abstract: true,
            views: {
                '@': {
                    templateUrl: CWD + "templates/dashboard/home.html",
                    controller: "DashboardCtrl as policy"
                }
            },
            ncyBreadcrumb: {
                label: '策略管理'
            }
        })
        .state('policy-whitelist', {
            parent: 'policy',
            url: '/policy-whitelist',
            controller: 'whitelistCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist.html",
            ncyBreadcrumb: {
                parent: 'policy',
                label: '白名单'
            }
        })
        .state('whitelist-app', {
            parent: 'policy',
            url: '/whitelist-app?id',
            controller: 'whitelistDetailCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist-app.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'policy-whitelist',
                label: '应用程序'
            }
        })
        .state('whitelist-certificate', {
            parent: 'policy',
            url: '/whitelist-certificate?id',
            controller: 'whitelistDetailCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist-certificate.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'policy-whitelist',
                label: '证书'
            }
        })
        .state('whitelist-usb', {
            parent: 'policy',
            url: '/whitelist-usb?id',
            controller: 'whitelistDetailCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist-usb.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'policy-whitelist',
                label: 'USB'
            }
        })
        .state('whitelist-creat', {
            parent: 'policy',
            url: '/whitelist-creat',
            controller: 'whitelistCreateCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist-creat.html",
            ncyBreadcrumb: {
                parent: 'policy-whitelist',
                label: '添加白名单'
            }
        })
        .state('whitelist-update', {
            parent: 'policy',
            url: '/whitelist-update?id',
            controller: 'whitelistUpdateCtrl as policy',
            templateUrl: CWD + "templates/policy/whitelist-creat.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'policy-whitelist',
                label: '修改白名单'
            }
        })
        .state('policy-safe', {
            parent: 'policy',
            url: '/policy-safe',
            controller: 'safeCtrl as policy',
            templateUrl: CWD + "templates/policy/safe.html",
            ncyBreadcrumb: {
                parent: 'policy',
                label: '安全策略'
            }
        })
        .state('safe-creat', {
            parent: 'policy',
            url: '/safe-creat',
            controller: 'safeCreateCtrl as policy',
            templateUrl: CWD + "templates/policy/safe-creat.html",
            ncyBreadcrumb: {
                parent: 'policy-safe',
                label: '添加安全策略'
            }
        })
        .state('safe-update', {
            parent: 'policy',
            url: '/safe-update?id',
            controller: 'safeUpdateCtrl as policy',
            templateUrl: CWD + "templates/policy/safe-creat.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'policy-safe',
                label: '修改安全策略'
            }
        })
        .state('policy-config', {
            parent: 'policy',
            url: '/policy-config',
            controller: 'configCtrl as policy',
            templateUrl: CWD + "templates/policy/config-client.html",
            ncyBreadcrumb: {
                parent: 'policy',
                label: '基本配置'
            }
        })
        .state('config-terminal', {
            parent: 'policy',
            url: '/config-terminal',
            controller: 'configCtrl as policy',
            templateUrl: CWD + "templates/policy/config-terminal.html",
            ncyBreadcrumb: {
                parent: 'policy',
                label: '基本配置'
            }
        })
        .state('config-whitelist', {
            parent: 'policy',
            url: '/config-whitelist',
            controller: 'configCtrl as policy',
            templateUrl: CWD + "templates/policy/config-whitelist.html",
            ncyBreadcrumb: {
                parent: 'policy',
                label: '基本配置'
            }
        });
}
