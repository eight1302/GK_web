/**
 * Dashboard Config
 *
 * Created by jinyong on 16-9-23.
 */
export default /*@ngInject*/function($stateProvider, CWD) {
    //企业资源
    $stateProvider
        .state('enterprise', {
            parent: 'root',
            abstract: true,
            views: {
                '@': {
                    templateUrl: CWD + "templates/dashboard/home.html",
                    controller: "DashboardCtrl as enterprise"
                }
            },
            ncyBreadcrumb: {
                label: '企业资源'
            }
        })
        .state('terminal-list', {
            parent: 'enterprise',
            url: '/terminal-list',
            controller: 'terminalListCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal.html",
            ncyBreadcrumb: {
                parent: 'enterprise',
                label: '终端'
            }
        })
        .state('terminal-hardware', {
            parent: 'enterprise',
            url: '/terminal-hardware?id',
            controller: 'terminalDetailCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal-hardware.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'terminal-list',
                label: '硬件信息'
            }
        })
        .state('terminal-software', {
            parent: 'enterprise',
            url: '/terminal-software?id',
            controller: 'terminalDetailCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal-software.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'terminal-list',
                label: '软件信息'
            }
        })
        .state('terminal-software-edit', {
            parent: 'enterprise',
            url: '/terminal-software-edit?id',
            controller: 'terminalSoftwareEditCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal-software-edit.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'terminal-software',
                label: '软件信息编辑'
            }
        })
        .state('terminal-create', {
            parent: 'enterprise',
            url: '/terminal-create',
            controller: 'terminalCreateCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal-newcreat.html",
            ncyBreadcrumb: {
                parent: 'terminal-list',
                label: '新建终端'
            }
        })
        .state('terminal-edit', {
            parent: 'enterprise',
            url: '/terminal-edit?id',
            controller: 'terminalEditCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/terminal-edit.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'terminal-list',
                label: '修改终端'
            }
        })
        .state('enterprise-department', {
            parent: 'enterprise',
            url: '/enterprise-department',
            controller: 'departmentCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/department.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise',
                label: '部门'
            }
        })
        .state('department-create', {
            parent: 'enterprise',
            url: '/department-create',
            controller: 'departmentCreateCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/department-newcreat.html",
            ncyBreadcrumb: {
                parent: 'enterprise-department',
                label: '新建部门'
            }
        })
        .state('department-edit', {
            parent: 'enterprise',
            url: '/department-edit?id',
            controller: 'departmentEditCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/department-edit.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise-department',
                label: '修改'
            }
        })
        .state('department-topology', {
            parent: 'enterprise',
            url: '/department-topology?id',
            controller: 'departmentTopologyCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/topology.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise-department',
                label: '拓扑图'
            }
        })
        .state('enterprise-label', {
            parent: 'enterprise',
            url: '/enterprise-label',
            controller: 'labelCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/label.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise',
                label: '标签'
            }
        })
        .state('label-create', {
            parent: 'enterprise',
            url: '/label-create',
            controller: 'labelcreateCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/label-newcreat.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise-label',
                label: '新建标签'
            }
        })
        .state('label-edit', {
            parent: 'enterprise',
            url: '/label-edit?id',
            controller: 'labelEditCtrl as enterprise',
            templateUrl: CWD + "templates/enterprise/label-edit.html",
            params:{
                'id':null
            },
            ncyBreadcrumb: {
                parent: 'enterprise-label',
                label: '修改标签'
            }
        });
}
