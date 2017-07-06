/**
 * home页面(包含首页)
 *
 * Created by jinyong on 16-9-23.
 */
export default {
    'DashboardCtrl' : /*@ngInject*/DashboardCtrl,
    'MonitorCtrl' : /*@ngInject*/MonitorCtrl
};

//home页面
function DashboardCtrl($rootScope, $scope, NavMenu, tools,sse,SweetAlert){

    //设置整体字体大小基数
    /*
    var fontSize = $(window).width()/12.8;
    $("html").css("font-size",fontSize+"px");
    */

    var menus = [];
    var navNumSession = sessionStorage.getItem("navNum");
    navNumSession = Number(navNumSession);
    //获取导航菜单list
    NavMenu.json.then((data)=>{
        menus = setNavCurrent(data.menus);
        $scope.navMenus = menus;

        $("nav ul.nav li").eq(navNumSession).find("a.nav-a").removeClass("nav-current").addClass("nav-current");
    });

    $("div.dashboard-nav").on("click","a.nav-a",function(){
        var this_url = tools.getRouterName();
        var a_url = $(this).attr("ng-href");
        if(a_url === this_url && a_url !== '#'){
            menus = setNavCurrent(menus);
            $scope.navMenus = menus;
            $("div.nav-container").find("a.nav-a").removeClass("nav-current");
            $(this).addClass("nav-current");
        }
        if(this_url === '/monitor' || a_url === '/monitor'){
            var navNum1 = $(this).parents("li.parent-li").index();
            sessionStorage.setItem("navNum",navNum1);
        } 
    });
    $("div.dashboard-nav").on("click","a.sec-a",function(){
        menus = setNavCurrent(menus);
        $scope.navMenus = menus;
        var navNum2 = $(this).parents("li.parent-li").index();
        sessionStorage.setItem("navNum",navNum2);
    });
    $("nav ul.nav li").eq(navNumSession).find("a.nav-a").removeClass("nav-current").addClass("nav-current");

    //全屏功能
    $scope.fullScreen = function(){
        $("#dashboard-container").addClass("full-screen");
        tools.launchFullScreen(document.documentElement);
        $rootScope.$broadcast('content.reload');
        $(document).keyup(function(event){
            var keyCode = event.keyCode?event.keyCode:event.which;
            switch(keyCode){
                case 27:
                    console.log("ESC");
                    $("#dashboard-container").removeClass("full-screen");
                    tools.exitFullScreen();
                    $rootScope.$broadcast('content.reload');
                    break;
                case 96:
                    console.log("ESC");
                    $("#dashboard-container").removeClass("full-screen");
                    tools.exitFullScreen();
                    $rootScope.$broadcast('content.reload');
                    break;
            }
        });
    };

    //整站颜色设置
    $scope.themePurple = function(){
        $("body").removeClass("theme-purple").removeClass("theme-red").removeClass("theme-violet").addClass("theme-purple");
        sessionStorage.setItem("themeStyle","0");
    };
    $scope.themeRed = function(){
        $("body").removeClass("theme-purple").removeClass("theme-red").removeClass("theme-violet").addClass("theme-red");
        sessionStorage.setItem("themeStyle","1");
    };
    $scope.themeViolet = function(){
        $("body").removeClass("theme-violet").removeClass("theme-purple").removeClass("theme-red").addClass("theme-violet");
        sessionStorage.setItem("themeStyle","2");
    };
    var themeStyle = sessionStorage.getItem("themeStyle");
    if(themeStyle){
        switch(themeStyle){
            case "1":
                $scope.themeRed();
                break;
            case "2":
                $scope.themeViolet();
                break;
            default:
                $scope.themePurple();
        }
    }

    //公共头部用户管理
    $scope.logout = function(){
        
    };

    //当前浏览器判断
    var browserAlert = sessionStorage.getItem("browserAlert");
    var browser = tools.myBrowser();
    if(browserAlert !== 'false' && browser !== 'Firefox'){
        sessionStorage.setItem("browserAlert","false");
        SweetAlert.swal('您当前的浏览器不是最佳效果浏览器，推荐您使用火狐浏览器进行浏览');
    }

    //配置导航菜单选中项
    function setNavCurrent(menu){
        var this_url = tools.getRouterName();
        for(var i=0;i<menu.length;i++){
            if(menu[i].sec_menus){
                var sec = menu[i].sec_menus;
                for(var j=0;j<sec.length;j++){
                    if(sec[j].href === this_url){
                        //sec[j].current = true;
                        menu[i].current = true;
                        break;
                    }else{
                        //delete sec[j].current;
                        delete menu[i].current;
                    }
                }
            }else{
                if(menu[i].href === this_url){
                    menu[i].current = true;
                }else{
                    delete menu[i].current;
                }
            }
        }
        if(this_url === '/'){
            menu[0].current = true;
        }    
        return menu;
    }

    //SSE反向代理
    sse.listen('UPDATE', $scope, function (data) {
        console.log(data);
        if (data.sseType === 'CLIENT_UPDATE') {
            console.log(data.content);
            console.log('CLIENT_UPDATE:'+new Date());
            $rootScope.$broadcast('newClientUpdate', data.content);
        }else if(data.sseType === 'CLIENT_ONLINE'){
            console.log(data.content);
            console.log('CLIENT_ONLINE:'+new Date());
            $rootScope.$broadcast('newClientOnline', data.content);
        }else if(data.sseType === 'CLIENT_OFFLINE'){
            console.log(data.content);
            console.log('CLIENT_OFFLINE:'+new Date());
            $rootScope.$broadcast('newClientOffline', data.content);
        }else if(data.sseType === 'CLIENT_UNINSTALL'){
            console.log(data.content);
            console.log('CLIENT_UNINSTALL:'+new Date());
            $rootScope.$broadcast('newClientUninstall', data.content);
        }else if(data.sseType === 'SCAN_WHITELIST_ING'){
            console.log(data.content);
            console.log('SCAN_WHITELIST_ING:'+new Date());
            $rootScope.$broadcast('scanWhitelistIng', data.content);
        }else if(data.sseType === 'SCAN_WHITELIST_END'){
            console.log(data.content);
            console.log('SCAN_WHITELIST_END:'+new Date());
            $rootScope.$broadcast('scanWhitelistEnd', data.content);
        }else if(data.sseType === 'DEPLOY_POLICY_ING'){
            console.log(data.content);
            console.log('DEPLOY_POLICY_ING:'+new Date());
            $rootScope.$broadcast('deployPolicyIng', data.content);
        }else if(data.sseType === 'DEPLOY_POLICY_END'){
            console.log(data.content);
            console.log('DEPLOY_POLICY_END:'+new Date());
            $rootScope.$broadcast('deployPolicyEnd', data.content);
        }else if(data.sseType==='SCAN_SNAPSHOT_END'){
            console.log(data.content);
            console.log('SCAN_SNAPSHOT_END:'+new Date());
        }else if(data.sseType==='EXPORT_REPORT_END'){
            console.log(data.content);
            console.log('EXPORT_REPORT_END:'+new Date());
            $rootScope.$broadcast('exportReportEnd', data.content);
        }else if(data.sseType==='EXPORT_INCIDENT_END'){
            console.log(data.content);
            console.log('EXPORT_INCIDENT_END:'+new Date());
            $rootScope.$broadcast('exportIncidentEnd',data.content);
        }
    });
}

//主页:监控页面
function MonitorCtrl($scope,$interval,$filter,dashboardService,$http,reportsService,URI){
    //基本信息
    $scope.diffTime=moment.duration(moment().diff(moment('2016-10-20 09:00:00','YYYY-MM-DD HH:mm:ss')),'ms');
    $scope.runningTime=Math.floor($scope.diffTime.asDays())+'天'+$scope.diffTime.hours()+'小时'+$scope.diffTime.minutes()+'分钟'+$scope.diffTime.seconds()+'秒' ;
    dashboardService.sysStatus().then(function(res){
        if(res.data.status){
            $scope.diffTime=parseInt(res.data.data.sysBaseInfoVo.runningTime);
            $scope.baseInfo=res.data.data.sysBaseInfoVo;$scope.graphInfo=res.data.data.sysGraphInfoVo;
            $scope.gauge_data_cpu ="50";
            $scope.gauge_data_mem ="50";
            $scope.gauge_data_disk ="50";
            $scope.sysRunTime=$interval(function(){
                //$scope.gauge_data = Math.random() * 100;
                $scope.diffTime=moment.duration($scope.diffTime+1000,'ms');
                $scope.runningTime=Math.floor($scope.diffTime.asDays())+'天'+$scope.diffTime.hours()+'小时'+$scope.diffTime.minutes()+'分钟'+$scope.diffTime.seconds()+'秒';
            },1000);
        }
    });
    $scope.baseInfoTimer=$interval(function(){
        dashboardService.sysStatus().then(function(res){
            if(res.data.status){
                $scope.baseInfo=res.data.data.sysBaseInfoVo;$scope.graphInfo=res.data.data.sysGraphInfoVo;
                $scope.gauge_data_cpu =$scope.graphInfo.cpu;
                $scope.gauge_data_mem =$scope.graphInfo.mem;
                $scope.gauge_data_disk =$scope.graphInfo.disk;
            }
        });
        var test=Math.floor(Math.random()*85+20),client=Math.floor(Math.random()*80+25);
        $scope.testProgress=test<100?test:'100+';
        $scope.clientProgress=client<100?client:'100+';
    },3500);
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.sysRunTime);$interval.cancel($scope.baseInfoTimer);$interval.cancel($scope.charTimer);$interval.cancel($scope.byTimeSecList);
    });

    //安全事件
    var params={
        currentPage:1,
        pageSize:6,
        searchParams:{
            eventType: "",
            queryBeginTime: "",
            queryEndTime: "",
            status: "",
            description: ""
        }
    };
    $scope.secEvts=function(){
        $http.post(URI+'/api/event/pieChart',params).success(function(res){
            if(res){
                $scope.secEvtCount=res;
                $http.post(URI+'/api/event/securityEvent',params).success(function(res){
                    $scope.secEvtList=res.data;
                    console.log($filter('transEvtType')(res.data[0].eventType));
                });
            }
        });
    };
    $scope.secEvts();
    $scope.byTimeSecList=$interval($scope.secEvts, 3000);
    /*var mark;
    dashboardService.securityEvts().then(function(res){
        if(res.status){
            $scope.secEvt=res.evtLog.count;
            $scope.secEvtList=res.evtLog.logs;
            $scope.evTimer=$interval(
                function(){
                    faked_data($scope.secEvtList);
                },2000);
        }
    });
    function faked_data(res) {
        mark=!mark;
        $scope.secEvt={
            normal:$scope.secEvt.normal+1,
            noTrust:Math.round(Math.random()*30)?$scope.secEvt.noTrust:$scope.secEvt.noTrust+1,
            warnning:Math.round(Math.random()*10)?$scope.secEvt.warnning:$scope.secEvt.warnning+1
        };
        $scope.secEvtList = [
            {
                time: Number(res[0].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'断开网络':'进程文件非法访问':'非法访问USB设备':'接入网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'0D:C4:82A6:05:01':'1C:C6:82A6:05:F1',
                res: Math.round(Math.random()*2)?'成功':'失败'
            },
            {
                time: Number(res[1].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'接入网络':'进程文件非法访问':'非法访问USB设备':'断开网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'2D:22:82A6:05:42':'63:C6:82A6:05:33',
                res: Math.round(Math.random()*2)?'成功':'失败'
            },
            {
                time: Number(res[2].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'断开网络':'进程文件非法访问':'非法访问USB设备':'接入网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'63:C6:82A6:05:33':'0D:C4:82A6:05:01',
                res: Math.round(Math.random()*2)?'成功':'失败'
            },
            {
                time: Number(res[3].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'接入网络':'进程文件非法访问':'非法访问USB设备':'断开网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'90:BC:82A6:05:B3':'2D:22:82A6:05:42',
                res: Math.round(Math.random()*2)?'成功':'失败'
            },
            {
                time: Number(res[4].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'断开网络':'进程文件非法访问':'非法访问USB设备':'接入网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'1C:C6:82A6:05:F1':'0D:C4:82A6:05:07',
                res: Math.round(Math.random()*2)?'成功':'失败'
            },
            {
                time: Number(res[0].time) + Math.floor(Math.random()*3+1)*10000,
                action: Math.round(Math.random())?Math.round(Math.random())?Math.round(Math.random())?'接入网络':'进程文件非法访问':'非法访问USB设备':'断开网络',
                ip: Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170)+'.'+Math.floor(Math.random()*50+170),
                mac: mark?'54:11:82A6:05:22':'90:BC:82A6:05:B3',
                res: Math.round(Math.random()*2)?'成功':'失败'
            }
        ];
    }*/


    var pubOpts={
        toolbox:{
            show:true,
            top:5,
            right:10,
            feature : {
                mark : {show: true},
                dataView : {
                    show: true,
                    readOnly: false,
                    iconStyle:{
                        normal:{
                            borderColor:'#4c3d79',
                            borderWidth:1
                        }
                    }
                },
                magicType : {
                    show: false,
                    type: ['pie', 'funnel']
                },
                saveAsImage : {
                    show: true,
                    iconStyle:{
                        normal:{
                            borderColor:'#4c3d79',
                            borderWidth:1
                        }
                    },
                    type:'jpeg'
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params){
                return params.data.name;
            }
        },
        legend: {
            orient: 'horizontal',
            x: 'center',

            bottom:25
            /*data*/
        },
        title:{
            //text
            x:5,
            y:5,
            textStyle:{
                color:'#4c3d79',
                fontStyle:'normal',
                fontWeight:'normal',
                fontSize:15
            }

        },
        series: [
            {
                /*name*/
                center:['50%','48%'],
                type:'pie',
                radius: ['42%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                }/*,
                data*/
            }
        ]
    };

    $scope.blueRound=$.extend(true,angular.copy(pubOpts), {
        legend: {
            data: ['暂无数据']
        },
        series: [
            {
                name:'在线终端统计',
                data: [
                    {name:'暂无数据',value:0}
                ]
            }
        ],
        title:{
            text:"在线终端统计"

        },
        color: ['#ccc']
    });

    $scope.greenRound=$.extend(true,angular.copy(pubOpts), {
        legend: {
            data: ['暂无数据']
        },
        series: [
            {
                name:'终端类型统计',
                data: [{name:'暂无数据',value:0}]
            }
        ],
        title:{
            text:"终端类型统计"

        },
        color: ['#ccc']
    });
    $scope.purpleRound=$.extend(true,angular.copy(pubOpts), {
        legend: {
            data: ['暂无数据']
        },
        series: [
            {
                name:'安全事件统计',
                data: [{name:'暂无数据',value:0}]
            }
        ],
        title:{
            text:"安全事件统计"

        },
        color: ['#ccc']
    });
    $scope.redRound=$.extend(true,angular.copy(pubOpts), {
        legend: {
            data: ['低危','中危','高危']
        },
        series: [
            {
                name:'风险评估统计',
                data: [
                    {value: 300, name: '低危'},
                    {value: 500, name: '中危'},
                    {value: 100, name: '高危'}
                ]
            }
        ],
        title:{
            text:"风险评估统计"

        },
        color: ['#ccc', '#ccc','#ccc']
    });
    updateChart();
    $scope.charTimer=$interval(updateChart,15*1000);
    function updateChart(){
        reportsService.getPieInfo({eventType:'',queryBeginTime:'',queryEndTime:'',status:''}).then(function(res){
            if(res.status===200){
                var secEvtCount=res.data;
                $scope.purpleRound=$.extend(true,$scope.purpleRound, {
                    legend: {
                        data: (function(){
                            var data=[];
                            $.each(secEvtCount,function(k,v){
                                if(k==='CLIENT_LOGIN'){
                                    data.push('客户端登入: '+v);
                                }else if(k==='CLIENT_LOGOUT'){
                                    data.push('登出: '+v);
                                }else if(k==='WARNING'){
                                    data.push('告警: '+v);
                                }else if(k==='OTHER'){
                                    data.push('其它: '+v);
                                }
                            });
                            return data;
                        })()
                    },
                    series: [
                        {
                            data: (function(){
                                var data=[];
                                $.each(secEvtCount,function(k,v){
                                    if(k==='CLIENT_LOGIN'){
                                        data[1]={name:'登入: '+v,value:v};
                                    }else if(k==='CLIENT_LOGOUT'){
                                        data[2]={name:'登出: '+v,value:v};
                                    }else if(k==='WARNING'){
                                        data[0]={name:'告警: '+v,value:v};
                                    }else if(k==='OTHER'){
                                        data[3]={name:'其它: '+v,value:v};
                                    }
                                });
                                return data;
                            })()
                        }
                    ],
                    color: ['#ceb2fb', '#a787dc','#8969c9','#7247b9']
                });
            }
        });
        dashboardService.clientInfo().then(function(data){
            if(data){
                var onlineCount=data.onlineInfo,clientCount=data.clientTypeInfo,online={},clientType={};
                $(onlineCount).each(function(i,d){
                    switch(d.onlineStatus){
                        case 0:online.onCount=onlineCount[i].count?onlineCount[i].count:0;
                            break;
                        case 1:online.offCount=onlineCount[i].count?onlineCount[i].count:0;
                            break;
                    }
                });
                $(clientCount).each(function(i,d){
                    switch(d.clientType){
                        case 0:clientType.unKnowCount=clientCount[i].count?clientCount[i].count:0;
                            break;
                        case 1:clientType.unCheckCount=clientCount[i].count?clientCount[i].count:0;
                            break;
                        case 2:clientType.normalCount=clientCount[i].count?clientCount[i].count:0;
                            break;
                    }
                });
                $scope.blueRound=$.extend(true,$scope.blueRound, {
                    legend: {
                        data: (function(){
                            var data=[];
                            $.each(online,function(k,v){
                                if(k==='onCount'){
                                    data.push('在线: '+v);
                                }else if(k==='offCount'){
                                    data.push('离线: '+v);
                                }
                            });
                            return data;
                        })()
                    },
                    series: [
                        {
                            data: (function(){
                                var data=[];
                                $.each(online,function(k,v){
                                    if(k==='onCount'){
                                        data.push({name:'在线: '+v,value:v});
                                    }else if(k==='offCount'){
                                        data.push({name:'离线: '+v,value:v});
                                    }
                                });
                                return data;
                            })()
                        }
                    ],
                    color: ['#86daf9', '#6ab7ed']
                });

                $scope.greenRound=$.extend(true,$scope.greenRound, {
                    legend: {
                        data: (function(){
                            var data=[];
                            $.each(clientType,function(k,v){
                                if(k==='unKnowCount'){
                                    data.push('未知终端: '+v);
                                }else if(k==='unCheckCount'){
                                    data.push('待审终端: '+v);
                                }else if(k==='normalCount'){
                                    data.push('正常终端: '+v);
                                }
                            });
                            return data;
                        })()
                    },
                    series: [
                        {
                            data: (function(){
                                var data=[];
                                $.each(clientType,function(k,v){
                                    if(k==='unKnowCount'){
                                        data.push({name:'未知终端: '+v,value:v});
                                    }else if(k==='unCheckCount'){
                                        data.push({name:'待审终端: '+v,value:v});
                                    }else if(k==='normalCount'){
                                        data.push({name:'正常终端: '+v,value:v});
                                    }
                                });
                                return data;
                            })()
                        }
                    ],
                    color: ['#a9cba2', '#8abb6f','#68a54a']
                });

                $scope.redRound=$.extend(true,$scope.redRound, {
                    series: [
                        {
                            data: [
                                {value: 300, name: '低危'},
                                {value: 500, name: '中危'},
                                {value: 100, name: '高危'}
                            ]
                        }
                    ],
                    color: ['#f29c9f', '#f06d5c','#e54f5c']
                });
            }

        });
    }



    $scope.navMenu = [
        {
            linkTo: 'policy-safe',
            name: '安全策略',
            class: 'fa-shield',
        },
        {
            linkTo: 'terminal-list',
            name: '查看所有终端',
            class: 'fa-desktop',
        },
        {
            linkTo: 'enterprise-department',
            name: '部门',
            class: 'fa-users',
        },
        {
            linkTo: 'terminal-list',
            name: '待审核的终端',
            class: 'fa-clock-o',
        },
        {
            linkTo: 'policy-whitelist',
            name: '白名单',
            class: 'fa-bars',
        },
        {
            linkTo: 'assets',
            name: '资产报告',
            class: 'fa-file-text-o',
        },
        {
            linkTo: 'department-topology',
            name: '部门拓朴',
            class: 'fa-paper-plane-o',
        },
        {
            linkTo: 'audit',
            name: '审计报告',
            class: 'fa-clipboard',
        },
        {
            linkTo: 'network-edit',
            name: '系统配置',
            class: 'fa-cog',
        }
    ];
}