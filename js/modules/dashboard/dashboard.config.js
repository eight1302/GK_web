/**
 * Dashboard Config
 *
 * Created by jinyong on 16-9-23.
 */
export default /*@ngInject*/function($stateProvider, CWD) {
    //home页
    $stateProvider
        .state('dashboard', {
            parent: 'root',
            abstract: true,
            views: {
                '@': {
                    templateUrl: CWD + "templates/dashboard/home.html",
                    controller: "DashboardCtrl as dashboard"
                }
            }
        })
        .state('monitor', {
            parent: 'dashboard',
            url: '/monitor',
            controller: 'MonitorCtrl as monitor',
            templateUrl: CWD + "templates/dashboard/monitor.html"
        })
        .state('search', {
            parent: 'dashboard',
            url: '/search',
            controller: 'SearchCtrl as monitor',
            templateUrl: CWD + "templates/dashboard/search.html"
        })
        .state('message', {
            parent: 'dashboard',
            url: '/message',
            controller: 'MessageCtrl as monitor',
            templateUrl: CWD + "templates/dashboard/message.html"
        });
}
