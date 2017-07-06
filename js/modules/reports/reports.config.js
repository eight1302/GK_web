/**
 * Created by pcboby on 10/24/16.
 */

export default /*@ngInject*/function($stateProvider,CWD){
    $stateProvider
        .state('reports',{
            parent:'root',
            abstract:true,
            views:{
                '@':{
                    templateUrl:CWD + "templates/dashboard/home.html",
                    controller:'DashboardCtrl as reports'
                }
            },
            ncyBreadcrumb: {
                label: '统计报告'
            }
        })
        .state('assets',{
            parent:'reports',
            url:'/reports-asset',
            templateUrl:CWD + "templates/reports/reports-asset.html",
            //controller:'assetCtrl as asset',
            ncyBreadcrumb: {
                parent: 'reports',
                label: '资产报告'
            }
        })
        .state('reports.hardware',{
            parent:'reports',
            url:'/assets-hardware?id',
            templateUrl:CWD + "templates/reports/assets_hardware.html",
            controller:'assetDetailCtrl',
            ncyBreadcrumb: {
                parent: 'assets',
                label: '硬件信息'
            }
        })
        .state('reports.software',{
            parent:'reports',
            url:'/assets-software?id',
            templateUrl:CWD + "templates/reports/assets_software.html",
            controller:'assetDetailCtrl',
            ncyBreadcrumb: {
                parent: 'assets',
                label: '软件信息'
            }
        })
        .state('made',{
            parent:'reports',
            url:'/reports-made',
            templateUrl:CWD + "templates/reports/reports-made.html",
            controller:'madeReportsListCtrl as made',
            ncyBreadcrumb: {
                parent: 'reports',
                label: '定制报告'
            }
        })
        .state('made-creat',{
            parent:'reports',
            url:'/made-creat',
            templateUrl:CWD + "templates/reports/reports-made-creat.html",
            controller:'madeReportsCtrl as made',
            ncyBreadcrumb: {
                parent: 'made',
                label: '新建定制报告'
            }
        })
        .state('made-update',{
            parent:'reports',
            url:'/made-update?id',
            templateUrl:CWD + "templates/reports/reports-made-creat.html",
            controller:'madeReportsUpdateCtrl as made',
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'made',
                label: '修改定制报告'
            }
        })
        .state('made-set',{
            parent:'reports',
            url:'/made-set',
            templateUrl:CWD + "templates/reports/reports-made-setting.html",
            controller:'madeReportsCtrl as made',
            ncyBreadcrumb: {
                parent: 'made',
                label: '定制报告模板'
            }
        })
        .state('safety',{
            parent:'reports',
            url:'/reports-safety',
            templateUrl:CWD + "templates/reports/reports-safety.html",
            //controller:'safetyCtrl as safe',
            ncyBreadcrumb:{
                parent:'reports',
                label:'安全报告'
            }
        })
        .state('safety-chart',{
            parent:'reports',
            url:'/safety-chart',
            templateUrl:CWD + "templates/reports/reports-safety-chart.html",
            //controller:'safetyCtrl as safe',
            ncyBreadcrumb:{
                parent:'reports',
                label:'安全报告饼状图'
            }
        })
        .state('safety-details',{
            parent:'reports',
            url:'/safety-details?id',
            templateUrl:CWD + "templates/reports/reports-safety-details.html",
            controller:'safetyDetailCtrl as safeDetail',
            ncyBreadcrumb:{
                parent:'safety',
                label:'安全报告详情'
            }
        })
        .state('audit',{
            parent:'reports',
            url:'/reports-audit',
            templateUrl:CWD + "templates/reports/reports-audit.html",
            controller:'auditCtrl as made',
            ncyBreadcrumb: {
                parent: 'reports',
                label: '审计报告'
            }
        });

}