/**
 * Created by Carol on 17/11/16.
 */

export default /*@ngInject*/function($stateProvider,CWD){
    $stateProvider
        .state('system',{
            parent:'root',
            abstract:true,
            views:{
                '@':{
                    templateUrl:CWD + "templates/dashboard/home.html",
                    controller:'DashboardCtrl as system'
                }
            },
            ncyBreadcrumb: {
                label: '系统设置'
            }
        })
        .state('network-list',{
            parent:'system',
            url:'/system-network?id',
            params:{
                id:null
            },
            templateUrl:CWD + "templates/system/system-network.html",
            controller:'networkCtrl as networkList',
            ncyBreadcrumb: {
                parent: 'network-edit',
                label: '高级TCP/IP设置'
            },
            resolve:{
                state:function($rootScope){
                    $rootScope.currentState = 'networkList';
                }
            }
        })
        .state('network-edit',{
            parent:'system',
            url:'/system-networkedit',
            templateUrl:CWD + "templates/system/network-edit.html",
            controller:'networkEdit as networkEdit',
            ncyBreadcrumb: {
                parent: 'system',
                label: '网络配置'
            }
        })
        .state('system-timeset',{
            parent:'system',
            url:'/system-timeset',
            templateUrl:CWD + "templates/system/system-timeset.html",
            controller:'systemTimesetCtrl as timesetCtrl',
            ncyBreadcrumb: {
                parent: 'system',
                label: '时间设置'
            }
        })
        .state('system-backup',{
            parent:'system',
            url:'/system-backup',
            templateUrl:CWD + "templates/system/system-backup.html",
            controller:'systemBackupCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '备份与恢复'
            }
        })
        .state('system-upgrade',{
            parent:'system',
            url:'/system-upgrade',
            templateUrl:CWD + "templates/system/system-upgrade.html",
            controller:'systemUpgradeCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '升级'
            }
        })
        .state('system-licence',{
            parent:'system',
            url:'/system-licence',
            templateUrl:CWD + "templates/system/system-licence.html",
            controller:'systemLicenceCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '许可证'
            }
        })
        .state('system-user',{
            parent:'system',
            url:'/system-user',
            templateUrl:CWD + "templates/system/system-user.html",
            controller:'systemUserCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '管理员'
            }
        })
        .state('system-usercreat',{
            parent:'system',
            url:'/system-usercreat',
            templateUrl:CWD + "templates/system/system-usercreat.html",
            controller:'systemUserCreatCtrl as system',
            ncyBreadcrumb: {
                parent: 'system-user',
                label: '新建管理员'
            }
        })
        .state('system-userupdate',{
            parent:'system',
            url:'/system-userupdate?id',
            templateUrl:CWD + "templates/system/system-userupdate.html",
            controller:'systemUserUpdateCtrl as system',
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'system-user',
                label: '修改管理员'
            }
        })
        .state('system-log',{
            parent:'system',
            url:'/system-log',
            templateUrl:CWD + "templates/system/system-log.html",
            controller:'systemLogCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '调试日志'
            }
        })
        .state('system-logset',{
            parent:'system',
            url:'/system-logset',
            templateUrl:CWD + "templates/system/system-logset.html",
            controller:'systemLogsetCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '参数设置'
            }
        })
        .state('system-setting',{
            parent:'system',
            url:'/system-setting',
            templateUrl:CWD + "templates/system/system-setting.html",
            controller:'systemSettingCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '设置'
            }
        })
        .state('system-customize',{
            parent:'system',
            url:'/system-customize',
            templateUrl:CWD + "templates/system/system-customize.html",
            controller:'systemCustomizeCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '企业定制'
            }
        })
        .state('system-email',{
            parent:'system',
            url:'/system-email',
            templateUrl:CWD + "templates/system/system-email.html",
            controller:'systemEmailCtrl as system',
            ncyBreadcrumb: {
                parent: 'system',
                label: '邮件设置'
            }
        });

}