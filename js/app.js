import angular from 'angular';

/* import lib in code */
import directives from './common/directives/module';
import filters from './common/filters/module';
import services from './common/services/module';
import auth from './modules/auth/auth.module';
import dashboard from './modules/dashboard/dashboard.module';
import enterprise from './modules/enterprise/enterprise.module';
import reports from './modules/reports/reports.module';
import system from './modules/system/system.module';
import setting from './modules/setting/setting.module';
import policy from './modules/policy/policy.module';



/* import html in code(loading by webpack) */
//@require "../templates/**/*.html"

/* import json in code(loading by webpack) */
//@require "./*.json"
//@require "../resource/*.json"
//@require "./faked_data/*.json"

(function () {
    /* App libs and modules */
    var libs = [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngSanitize',
        'ngCookies',
        'smart-table',
        'angularFileUpload',
        'cgBusy',
        'ngCrypto',
        'angular-uuid',
        'chart.js',
        'ngScrollable',
        'ncy-angular-breadcrumb',
        'oitozero.ngSweetAlert',
        'treeControl'
    ];

    var modules = [
        // Utilities
        directives,
        filters,
        services,
        // Business
        auth,
        dashboard,
        enterprise,
        reports,
        system,
        setting,
        policy
    ];

    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        //定义main module
        angular
            .module("waterStone", libs.concat(modules))
            .config(config)
            .run(run)
            .controller('AppCtrl', AppCtrl)
            .constant('tokenKey', 'tokenKey')
            .constant('accessToken', 'accesstoken')
            .constant('isUnloaded', 'isUnloaded')
            .constant('CWD', data.cwd ? data.cwd : '')
            .constant('URI', data.uri ? data.uri : '')
            .constant('TIMEOUT', data.timeout ? data.timeout : 10);

        //启动app
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['waterStone'], {
                "strictDi": true
            });
        });
    }

    function errorHandler() {
        console.error("Unable to load Configuration file!");
    }

//全局配置
    /*@ngInject*/
    function config($urlRouterProvider, $locationProvider, $animateProvider, $httpProvider, $stateProvider, stConfig, ChartJsProvider, CWD) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        $animateProvider.classNameFilter(/angular-animate/);

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
        $httpProvider.interceptors.push('httpInterceptor');

        //配置smart table
        stConfig.pagination.template = CWD + 'templates/common/stable/paginator-stable-custom.html';//分页的template
        //stConfig.pipe.delay = 100;//数据加载延时（保证stable的config设定之后再执行pipeService,防止报service undefined的错）

        //根状态(首页)
        var init = false;
        $stateProvider.state('root', {
            abstract: true,
            url: '',
            resolve: {
                init: /*@ngInject*/function (auth) {
                    if (!init) {
                        init = true;
                        return auth.whoAmI();
                    }
                }
            }
        });

        //设置图表的默认颜色
        ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    }

//系统启动时初始化操作
    /*@ngInject*/
    function run($rootScope, $cookies, uuid, isUnloaded, accessToken, tokenKey, auth) {
        //设置view container的高度(使滚动条生效)
        let viewContainer = angular.element(document.querySelector('#view-container'));
        const bodyHeight = document.body.clientHeight;
        viewContainer.css('height', bodyHeight + 'px');
        //监听窗口尺寸变化事件，动态设定#view-container高度(使滚动条在窗口缩小是出现，刷新时不出现)
        angular.element(window).bind('resize', ()=>{
            if(bodyHeight < document.body.clientHeight){
                //这里必须用Jquery修改高度，如果用angular.element，无法实时更新高度
                $('#view-container').height(document.body.clientHeight);
            }
        });

        //当tab或是browser关闭时，再次登录时导向登录页(当tab关闭时sessionStorage会被删掉，刷新时会保留)
        var unloadFlg = sessionStorage.getItem(isUnloaded) === 'true' ? true : false;//sessionStorage[isUnloaded]在window.unload事件触发时，被设定
        if (!unloadFlg) {
            $cookies.remove(accessToken);
            sessionStorage.setItem(isUnloaded, true);
        }

        //设置token加密秘钥　TODO:MW支持access token得话，这部分可以删掉。
        var key = sessionStorage.getItem(tokenKey);
        if (!key) {
            sessionStorage.setItem(tokenKey, uuid.v4());
        }

        //获取客户端安装状态
        auth.welcome().then(function(res){
            $rootScope.isClientInstalled = res.data;
        });
        //TODO:当MW支持这个api之后，要把这行注释掉
        $rootScope.isClientInstalled = true;
    }

//菜单导航 & 首页
    /*@ngInject*/
    function AppCtrl($rootScope, $state, $scope, $location, $anchorScroll, $interval, $timeout, isUnloaded, auth) {

        var vm = this;

        //state切换前的预处理
        vm.cancellable = $rootScope.$on('$stateChangeStart', function(event, toState){
            var redirect = 'welcome';
            if(toState.name!=='index' && toState.name!==redirect && !$rootScope.isClientInstalled){
                event.preventDefault();//禁止state切换
                $state.go(redirect, null, {reload:redirect});
            }
        });
        $scope.$on('$destroy', function(){
            vm.cancellable();
        });

        vm.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };

        //alert框定义
        vm.alerts = [];
        $rootScope.addAlert = function (config) {
            var alert = {
                type: config.type,
                content: config.content
            };
            //先关闭正在显示的alert，然后再显示最新的
            vm.closeAlert(0, true);
            //将要显示的alert添加到数组中
            vm.alerts.push(alert);
            //console.log($scope);
            //定义计时器
            vm.dismissOnTimeout = $timeout(function () {
                vm.closeAlert();
            }, 6000);
        };

        //isPush为true表示需要强制remove alert element
        vm.closeAlert = function (index, isPush) {
            if (isPush) {
                //删除页面element
                angular.element(document.querySelector('.fade-out-right')).remove();
            }
            //删除alert数组节点
            vm.alerts.splice(index ? index : 0, 1);
            //删除计时器
            if (vm.dismissOnTimeout) {
                $timeout.cancel(vm.dismissOnTimeout);
            }
        };

        //top页面系统时间
        $scope.systemtime = moment();
        vm.sysytemTimeInterval = $interval(function () {
            $scope.systemtime = moment();
        }, 60000);

        //当页面刷新或是tab关闭时触发
        angular.element(window).bind('unload', function () {
            //标记执行过unload事件(可能是刷新或页面关闭，但是sessionStorage在页面关闭后也会消失)
            sessionStorage.setItem(isUnloaded, true);
            //释放资源
            $interval.cancel(vm.sysytemTimeInterval);
            $timeout.cancel($rootScope.checkSessionTimeout);
        });

        //登录用户
        //TODO:如果MW支持token验证，则该部分代码可以直接删除（interceptor中的status=401错误就可以直接判断登陆是否超时）
        var token = auth.parseToken();
        if (token) {
            $scope.user = token.oper_user ? token.oper_user : '未知';
            $scope.userPri = token.user_auth ? token.user_auth : 0;
        }
    }
})();