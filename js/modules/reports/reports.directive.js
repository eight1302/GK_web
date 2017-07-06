/**
 * Created by pcboby on 10/24/16.
 */
/*const echarts=require("echarts/lib/echarts");
 require("echarts/lib/chart/pie");
 require("echarts/lib/component/tooltip");
 require("echarts/lib/component/toolbox");
 require("echarts/lib/component/title");
 require("echarts/lib/component/legend");*/
export default {
    'reportsTable':/*@ngInject*/reportsTable,
    'validation':/*@ngInject*/validation,
    'reportsMadeTable':/*@ngInject*/reportsMadeTable,
    'assetDetailSoftware':/*@ngInject*/assetDetailSoftware,
    'safetyReports':/*@ngInject*/safetyReports,
    'reportsAuditTable':/*@ngInject*/reportsAuditTable,
    'safetyPieChart':/*@ngInject*/safetyPieChart
};


function safetyPieChart($state,$q, tools,$filter,reportsService){
    return {
        restrict:'A',
        scope:false,
        require:'^stable',
        template:'<div class="chart-box"></div>',
        link:link
    };
    function link(scope,element,attr,ctrl){
        $(element).css({marginTop:'13px',border:'1px solid #ccc',height:530,padding:'15px 25px'});

        ctrl.listShow=true;
        ctrl.shiftPieChart=function(){
            if(tools.getRouterName()==='/reports-safety'){
                $state.go('safety-chart',null,{reload:'safety-chart'});
            }else{
                $state.go('safety',null,{reload:'safety'});
            }
        };

        var opts={
            color:['#ff6f5c','#80c9fd','#b890ef','#a6e19a','#f29c9f'],
            title : {
                text: '分析视图',
                subtext: false,
                x:'center',
                textStyle:{
                    fontSize:20,
                    fontWeight:'normal',
                    color:'#7c69b4'
                }
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: function(data){
                    var item=data.data;
                    return item.name+'<br/>当前值为: '+item.value;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [],
                y:20
            },
            series : [
                {
                    name: '分析视图',
                    type: 'pie',
                    radius : '60%',
                    center: ['45%', '50%'],
                    data:[
                        /*{value:335, name:'告警'},
                        {value:310, name:'接入网络'},
                        {value:234, name:'退出网络'},
                        {value:135, name:'重启网络'},
                        {value:1548, name:'其它'}*/
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label:{
                        normal:{
                            show:true,
                            position: 'outside'
                        }
                    },
                    labelLine:{
                        normal:{
                            show:true,
                            length:30
                        }
                    },
                }
            ]
        };
        echarts.init(element[0]).setOption(opts);
        ctrl.setConfig({
            name: 'device',
            totalCount: false,
            disableToolbar: false,
            numPerPage: 5,
            toolbarDate:true,
            pipeService: getAll,
            getCount: getCount,
            toolbar_refresh: addRefresh,
            toolbarFilters:[
                {'name':'allEvents',options:[{name:'请求失败',value:1}]},
                {'name':'allState',options:[{name:'请求失败',value:1}]}
            ]
        });

        function addRefresh(){
            $state.reload();
        }
        function getAll(payload){
            var listMenu={
                eventCate:[],
                stateCate:[]
            };
            /*function orderBy(data,cate){
                $(data).each(function(i,d){
                    switch(d){
                        case 0:
                            if(cate==='evt'){
                                listMenu.eventCate.push({name:'告警',value:d});
                            }else{
                                listMenu.stateCate.push({name:'未读',value:d});
                            }
                            break;
                        case 1:
                            if(cate==='evt'){
                                listMenu.eventCate.push({name:'登入',value:d});
                            }else{
                                listMenu.stateCate.push({name:'已读',value:d});
                            }
                            break;
                        case 2:
                            if(cate==='evt'){
                                listMenu.eventCate.push({name:'登出',value:d});
                            }else{
                                //listMenu.stateCate.push({name:'未读',value:d});
                            }
                            break;
                        case 3:
                            if(cate==='evt'){
                                listMenu.eventCate.push({name:'其它',value:d});
                            }else{
                                //listMenu.stateCate.push({name:'已读',value:d});
                            }
                            break;
                    }
                });
            }*/
            reportsService.getEventCategory().then(function(res){
                if(res.status=== 200){
                    $(res.data.data).each(function(i,d){
                        //listMenu.eventCate.push({name:$filter('transEvtType')(d),value:i});
                        switch(d){
                            case 'OTHER':
                                listMenu.eventCate[3]={name:$filter('transEvtType')(d),value:3};
                                break;
                            case 'CLIENT_LOGIN':
                                listMenu.eventCate[1]={name:$filter('transEvtType')(d),value:1};
                                break;
                            case 'CLIENT_LOGOUT':
                                listMenu.eventCate[2]={name:$filter('transEvtType')(d),value:2};
                                break;
                            case 'WARNING':
                                listMenu.eventCate[0]={name:$filter('transEvtType')(d),value:0};
                                break;
                        }
                    });
                    reportsService.getStateCategory().then(function(res){
                        if(res.status===200) {
                            $(res.data.data).each(function(i,d){
                                listMenu.stateCate.push({name:$filter('transEvtType')(d),value:i});
                            });
                            ctrl.toolbarFilters[0].options = listMenu.eventCate;
                            ctrl.toolbarFilters[1].options = listMenu.stateCate;
                            var params = {
                                currentPage: payload.pagination.currentPage,
                                pageSize: payload.pagination.number,
                                searchParams: {
                                    eventType: payload.search.predicateObject.allEvents!==undefined ? payload.search.predicateObject.allEvents : '',
                                    queryBeginTime: payload.search.predicateObject.start ? payload.search.predicateObject.start : '',
                                    queryEndTime: payload.search.predicateObject.end ? payload.search.predicateObject.end : '',
                                    status: payload.search.predicateObject.allState!==undefined ? payload.search.predicateObject.allState : '',
                                    description: payload.search.predicateObject.$ ? payload.search.predicateObject.$ : ''
                                }
                            };
                            reportsService.getPieInfo(params).then(function(res){
                                var newData=[],legendData=[];
                                if(res.status===200){
                                    $.each(res.data,function(k,v){
                                        switch(k){
                                            case 'OTHER':
                                                newData[3]={name:'其它事件',value:v};
                                                legendData[3]='其它事件';
                                                break;
                                            case 'CLIENT_LOGIN':
                                                newData[1]={name:'客户端登陆',value:v};
                                                legendData[1]='客户端登陆';
                                                break;
                                            case 'CLIENT_LOGOUT':
                                                newData[2]={name:'登出事件',value:v};
                                                legendData[2]='登出事件';
                                                break;
                                            case 'WARNING':
                                                newData[0]={name:'告警事件',value:v};
                                                legendData[0]='告警事件';
                                                break;
                                        }
                                    });
                                    opts=$.extend(true,angular.copy(opts),{
                                        series:[
                                            {
                                                data:newData
                                            }
                                        ],
                                        legend:{
                                            data:legendData
                                        }
                                    });
                                    echarts.init(element[0]).setOption(opts);
                                }
                            });
                        }
                    });
                }
            });
            return $q.when();

        }
        function getCount(){
            return $q.when();
        }
    }
}

function safetyReports(CWD,$filter,$rootScope,$state,$http,tools,$q,URI,reportsService){
    return {
        restrict:'A',
        require:'^stable',
        scope:false,
        templateUrl:CWD+'templates/reports/safety-table.html',
        replace:true,
        controller:controller,
        controllerAs:'safetyList',
        link:link
    };
    function controller(){
        var vm=this;
        vm.stateGo=function(params){
            $state.go('safety-details',{id:params.id},{reload:'safety-details'});
        };
    }
    function link(scope,element,attr,ctrl){
        scope.$on('exportIncidentEnd',function(evt,data){
            console.log(data );
            //$('<iframe>').attr({src:+data.fileName,display:'none',name:'downSafeFile'}).appendTo($(element));
            if(data.fileName){
                $http.get(URI+'/event/downloadFile?fileName='+data.fileName+'&fileSize='+data.fileSize).then(function(res){
                    console.log(res);
                });
            }
        });
        ctrl.safetyReport = true;
        ctrl.listShow=false;
        ctrl.shiftPieChart=function(){
            if(tools.getRouterName()==='/reports-safety'){
                $state.go('safety-chart',null,{reload:'safety-chart'});
            }else{
                $state.go('safety',null,{reload:'safety'});
            }
        };
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            toolbarDate:true,
            toolbar_refresh: addRefresh,
            toolbarFilters:[
                {'name':'allEvents',options:[{name:'请求失败',value:1}]},
                {'name':'allState', options:[{name:'请求失败',value:1}]}
            ],
            toolbar_export:fileExport,
            cols:[
                {'name':'status','text':'已读/未读'},
                {'name':'eventLevel','text':'事件等级'},
                {'name':'eventType','text':'事件类型'},
                {'name':'time','text':'时间'},
                {'name':'terminal','text':'终端'},
                {'name':'ip','text':'IP'},
                {'name':'content','text':'内容'}
            ]
        });
        function fileExport(){
            $http.post(URI+'/api/event/exportIncident',ctrl.safeParams).success(function(res){
                if(res.status){
                    $rootScope.addAlert({
                        type:'success',
                        content:'后台正在生成下载文件,请稍等~'
                    });
                }
            });
        }
        function getAll(payload){
            var listMenu={
                eventCate:[],
                stateCate:[]
            },def=$q.defer(),prom=def.promise;
            if(payload.search.predicateObject.$){
                payload.search.predicateObject.$=$filter('specialReplace')(payload.search.predicateObject.$);
            }
            reportsService.getEventCategory().then(function(res){
                if(res.status===200){
                    $(res.data.data).each(function(i,d){
                        switch(d){
                            case 'OTHER':
                                listMenu.eventCate[3]={name:$filter('transEvtType')(d),value:3};
                                break;
                            case 'CLIENT_LOGIN':
                                listMenu.eventCate[1]={name:$filter('transEvtType')(d),value:1};
                                break;
                            case 'CLIENT_LOGOUT':
                                listMenu.eventCate[2]={name:$filter('transEvtType')(d),value:2};
                                break;
                            case 'WARNING':
                                listMenu.eventCate[0]={name:$filter('transEvtType')(d),value:0};
                                break;
                        }
                    });
                    reportsService.getStateCategory().then(function(res){
                        if(res.status===200) {
                            $(res.data.data).each(function(i,d){
                                listMenu.stateCate.push({name:$filter('transEvtType')(d),value:i});
                            });
                            ctrl.toolbarFilters[0].options = listMenu.eventCate;
                            ctrl.toolbarFilters[1].options = listMenu.stateCate;
                            var params = {
                                currentPage: payload.pagination.currentPage,
                                pageSize: payload.pagination.number,
                                searchParams: {
                                    eventType: payload.search.predicateObject.allEvents!==undefined ? payload.search.predicateObject.allEvents : '',
                                    queryBeginTime: payload.search.predicateObject.start ? payload.search.predicateObject.start : '',
                                    queryEndTime: payload.search.predicateObject.end ? payload.search.predicateObject.end : '',
                                    status: payload.search.predicateObject.allState!==undefined ? payload.search.predicateObject.allState : '',
                                    description: payload.search.predicateObject.$ ? payload.search.predicateObject.$ : ''
                                }
                            };
                            reportsService.getSafetyReport(params).then(function (res) {
                                console.log(res.data.data);
                                if(res.status===200){
                                    ctrl.safeParams=params;
                                    def.resolve(res.data.data);
                                }else{
                                    def.reject('fail');
                                }
                            });
                        }
                    });
                }
            });
            return prom;
        }
        function getCount(){
            var def=$q.defer(),prom=def.promise;
            reportsService.getSafetyReport(scope.stable.safeParams).then(function (res) {
                console.log(res.data.count);
                if(res.status===200){
                    def.resolve(res.data.count);
                }else{
                    def.reject('fail');
                }
            });
            return prom;
        }
        function addRefresh(){
            $state.reload();
        }
    }
}

function validation() {
    return {
        restrict: "A",
        scope:false,
        require:'?ngIf',
        link: function (scope, element, attr,ctrl) {
            /*ctrl.validators[attr.validation]=function(modelVal){
                return scope.validator()(modelVal);
            };*/
            console.log(ctrl);
            $('.col-md-10 em').each(function(i,d){
                var obj=$(d).next();
                if(obj.is('span')){
                    console.log(obj);
                    $(obj).css({'border':'1px solid #ccc'});
                }
            });
        }
    };
}

function reportsTable($q,$rootScope,SweetAlert,$state,reportsService,CWD){
    return {
        restrict:'A',
        scope:false,
        require:'^stable',
        replace:true,
        controller:/*@ngInject*/controller,
        controllerAs:'reTable',
        templateUrl:CWD+'templates/reports/asset_table.html',
        link:link
    };
    function controller($scope,$uibModal){
        var vm=this;
        vm.stateGo=function(params){
            $state.go('reports.hardware',{id:params},{reload:'reports.hardware'});
        };
        vm.createSnap=function(item,event){
            event.cancelBubble=true;
            var results=$uibModal.open({
                templateUrl:'reports_asset_createsnapshot',
                size:'sm',
                backdrop:'static',
                keyboard:false,
                controller:createSnapshot,
                resolve:{
                    clientInfo:function(){
                        return {
                            clientId:item.clientId,
                            deviceName:item.deviceName
                        };
                    }
                }
            });
            function createSnapshot($scope,clientInfo,$uibModalInstance){
                $scope.clientInfo=clientInfo;
                $scope.ok = function () {
                    /*SweetAlert.swal({
                        title: null,
                        text: '<progress></progress><br /><em style="font-size:14px;font-style:normal">正在创建新的快照, 请等待...</em>',
                        html: true,
                        showConfirmButton: false
                    });*/
                    reportsService.createSnapshot({clientId:clientInfo.clientId}).then(function(res){
                       if(res.data){
                           $rootScope.addAlert({
                               type:'success',
                               content:'创建快照成功'
                           });
                           //SweetAlert.close();
                           $uibModalInstance.close({res:true});
                           //$scope.$emit('refreshTable',{ok:'ok'});
                       }else{
                           $rootScope.addAlert({
                               type:'error',
                               content:'创建快照失败'
                           });
                       }
                    });
                };
                $scope.cancel=function(){
                    $uibModalInstance.close();
                };

            }
            results.result.then(function(res){
                if(res.res){
                    $scope.$emit('refreshTable');
                }
            });
        };
    }
    function link(scope,element,attr,ctrl){

        ctrl.assetReport=ctrl.dateSaveBtn=true;
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbarDate:true,
            toolbar_refresh:addRefresh,
            toolbar_export:exportData,
            filter_save:true,
            viewTypes: ['plain','list'],
            cols: [{'name':'sName', 'text':'名称'},{'name':'sTyps', 'text':'部门'},{'name':'ip', 'text':'IP'},{'name':'asset', 'text':'资产'},{name:'operate',text:'操作'}]
        });

        function getAll(params) {
            var start = params.search.predicateObject.start, end = params.search.predicateObject.end, def = $q.defer(), prom = def.promise;
            var payload = {
                currentPage: params.pagination.currentPage,
                number: params.pagination.number,
                startTime: start ? start : '',
                endTime: end ? end : ''
            } ;
            /*reportsService.getConditionData({pageCode:'reportAsset'}).then(function(res){

                var conditionData=res.data;
                console.log(conditionData);
                if (conditionData.length > 0 && payload.startTime === '' && payload.endTime === '') {
                    $(conditionData).each(function(i,d){
                       $.each(d,function(k,v){
                           if(v==='startTime'){
                               ctrl.fromDate=payload.startTime=new Date(conditionData[i].searchValue);
                               payload.startTime=moment(ctrl.fromDate).format('YYYY-MM-DD hh:mm:ss');
                           }else if(v==='endTime'){
                               ctrl.toDate=new Date(conditionData[i].searchValue);
                               payload.endTime=moment(ctrl.toDate).format('YYYY-MM-DD hh:mm:ss');
                           }
                       });
                    });
                    reportsService.snapshotList(payload).then(function (res) {
                        var Data = res.data.data;
                        procData(Data);
                        def.resolve(Data);
                    });
                }else{
                    if ((Number(moment(start).format('x')) < Number(moment(end).format('x'))) || (start === undefined && end === undefined)) {
                        ctrl.fromDate=start;ctrl.toDate=end;
                        var searchAll = params.search.predicateObject.$;
                        if (searchAll) {
                            payload.searchAll = searchAll;
                        }
                        reportsService.snapshotList(payload).then(function (res) {
                            var Data = res.data.data;
                            procData(Data);

                            def.resolve(Data);
                        });
                    } else if (start > end) {
                        $rootScope.addAlert({
                            type: 'danger',
                            content: '选择的起始时间必须小于结束时间'
                        });
                        def.reject('fail');
                    } else {
                        def.reject('fail');
                    }
                }
                /!*(moment(payload.startTime).format('x')!==moment(tempDate.startTime).format('x'))||(moment(payload.endTime).format('x')!==moment(tempDate.endTime).format('x'))*!/
            });*/

            if ((Number(moment(start).format('x')) < Number(moment(end).format('x'))) || (start === undefined && end === undefined)) {
                //ctrl.fromDate=start;ctrl.toDate=end;
                var searchAll = params.search.predicateObject.$;
                if (searchAll) {
                    payload.searchA9ll = searchAll;
                }
                reportsService.snapshotList(payload).then(function (res) {
                    var Data = res.data.data;
                    procData(Data);
                    joinData(Data,def);
                    //def.resolve(Data);
                });
            } else if (start > end) {
                $rootScope.addAlert({
                    type: 'danger',
                    content: '选择的起始时间必须小于结束时间'
                });
                def.reject('fail');
            } else {
                def.reject('fail');
            }


            return prom;
        }

        function joinData(data,fn){
            var joinedData={clientId:[]};
            if(data.length>0){
                $(data).each(function(i,d){
                    joinedData.clientId.push(d.clientId);
                });
                reportsService.getDepartmentInfo(joinedData).then(function(res){

                    if(res.data.stat){
                        //console.log(res);
                        $(data).each(function(i,d){
                            $(res.data.data).each(function(idx,da){
                                if(d.clientId===da.clientId){
                                    d.dpm=da.departmentName;
                                }
                            });
                        });
                        fn.resolve(data);
                    }else{
                        fn.reject('fail');
                    }
                });
            }
        }

        function procData(data){
            try {
                if(!data){
                    return;
                }
                data.forEach(function (item) {
                    if (item.snapshotDifs) {
                        var obj = {};
                        $(item.snapshotDifs).each(function (i, d) {
                            switch (d.assetType) {
                                case 10:
                                    obj.service = d.difCount;
                                    break;
                                case 11:
                                    obj.progress = d.difCount;
                                    break;
                                case 12:
                                    obj.app = d.difCount;
                                    break;
                                case 13:
                                    obj.patch = d.difCount;
                                    break;
                                default:
                                    console.log('no data');
                                    break;
                            }
                        });
                        item.resolved = obj;
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }

        function getCount(params){
            /*var start = params.search.predicateObject.start, end = params.search.predicateObject.end, def = $q.defer(), prom = def.promise;
            var payload = {
                currentPage: params.pagination.currentPage,
                number: params.pagination.number,
                startTime: start ? start : '',
                endTime: end ? end : ''
            } ;
            reportsService.getConditionData({pageCode:'reportAsset'}).then(function(res){
                var conditionData=res.data;
                if (conditionData.length > 0 && payload.startTime === '' && payload.endTime === '') {
                    $(conditionData).each(function(i,d){
                        $.each(d,function(k,v){
                            if(v==='startTime'){
                                ctrl.fromDate=payload.startTime=new Date(conditionData[i].searchValue);
                                payload.startTime=moment(ctrl.fromDate).format('YYYY-MM-DD hh:mm:ss');
                            }else if(v==='endTime'){
                                ctrl.toDate=new Date(conditionData[i].searchValue);
                                payload.endTime=moment(ctrl.toDate).format('YYYY-MM-DD hh:mm:ss');
                            }
                        });
                    });
                    reportsService.snapshotList(payload).then(function (res) {
                        var Data = res.data.count;
                        def.resolve(Data);
                    });
                }else{
                    if ((Number(moment(start).format('x')) < Number(moment(end).format('x'))) || (start === undefined && end === undefined)) {
                        ctrl.fromDate=start;ctrl.toDate=end;
                        var searchAll = params.search.predicateObject.$;
                        if (searchAll) {
                            payload.searchAll = searchAll;
                        }
                        reportsService.snapshotList(payload).then(function (res) {
                            var Data = res.data.count;
                            def.resolve(Data);
                        });
                    } else if (start > end) {
                        def.reject('fail');
                    } else {
                        def.reject('fail');
                    }
                }
            });
            return prom;*/


            var start=params.search.predicateObject.start,end=params.search.predicateObject.end,def=$q.defer(),prom=def.promise;
            if((Number(moment(start).format('x'))<Number(moment(end).format('x')))||(start===undefined&& end===undefined)){
                var payload = params?{
                    currentPage: params.pagination.currentPage,
                    number: params.pagination.number,
                    startTime: start?start:'',
                    endTime: end?end:''
                }:{};
                var searchAll = params.search.predicateObject.$;
                if(searchAll){
                    payload.searchAll = searchAll;
                }
                reportsService.snapshotList(payload).then(function (res) {
                    var Data = res.data.count;
                    def.resolve(Data);
                });
            }else if(start>end){
                $rootScope.addAlert({
                    type:'danger',
                    content:'选择的起始时间必须小于结束时间'
                });
                def.reject('fail');
            }else {
                def.reject('fail');
            }
            return prom;

        }

        function addRefresh(){
            $state.reload();
        }

        //导出功能
        function exportData(){
            console.log('导出');
            scope.excel.down();
        }

        //保存筛选条件功能
        ctrl.saveCond=function(params){
            var data={
                pageCode:'reportAsset',
                addSearchParmToList:[
                    {
                        searchCondition:'startTime',
                        searchValue:params.startTime
                    },
                    {
                        searchCondition:'endTime',
                        searchValue:params.endTime
                    }
                ]
            };
            reportsService.saveConditionData(data).then(function(res){
                if(res.data){
                    $rootScope.addAlert({
                        type:'success',
                        content:'保存成功'
                    });
                }else{
                    $rootScope.addAlert({
                        type:'error',
                        content:'保存失败'
                    });
                }
            });
        };
    }
}

//定制报告--列表
function reportsMadeTable($state, $q, $filter, $timeout, reportsService, CWD, SweetAlert, tools){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/reports/reports-made-table.html',
        link: link
    };

    return tableObj;

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbar_selectAll:true,
            toolbar_operator:true,
            toolbar_add:addData,
            toolbar_export:exportData,
            toolbar_edit:editMade,
            toolbar_delete:deleteMade,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '全消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'setTpl', 'display': '模板', 'function': setTpl}
            ],
            viewTypes: ['list','plain']
        });

        //获取数据列表
        function getAll(params){
            var payload = {};
            var search = params.search.predicateObject;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            
            return reportsService.madeList(payload).then(function(res){
                console.log(res);
                $.each(res.data.data,function(key,obj){
                    obj.createAt = tools.getSmpFormatDateByLong(obj.createAt,true);
                });
                return res.data.data;
            },function(err){
                console.log(err+' '+new Date());
            });
        }

        //获取数据总数
        function getCount(params){
            var payload = {};
            var search = params.search.predicateObject;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            return reportsService.madeList(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }
        
        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#reportsMadeTable").find("input[name='sign']").prop("checked",true);
        }
        //全消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#reportsMadeTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#reportsMadeTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#reportsMadeTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#reportsMadeTable").find("input[name='sign']").prop("checked",false);
            }else{
                $("#reportsMadeTable").find("input[name='sign']").prop("checked",true);
            }
        };

        //增加功能
        function addData(){
            console.log('增加');
            $state.go('made-creat');
        }

        //导出功能
        function exportData(){
            console.log('导出');
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(id);
                }
            });
            if(ids.length <= 0){
                SweetAlert.swal({
                    title: "您未选中任何报告",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            var data = {
                "reportInfoIds":ids.join(","),
                "fileType":3
            };
            SweetAlert.swal({
                title: "您确定要导出定制吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    reportsService.exportReportInfo(data).then(function(res){
                        if(res.data.status === 1){
                            SweetAlert.swal({
                                title: "导出信息发送成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }else{
                            SweetAlert.swal({
                                title: "导出信息发送失败!",
                                type: "error",
                                text: res.data.errorMessage,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "导出信息发送失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                }   
            }); 
        }

        //修改定制
        function editMade(id){
            $state.go('made-update',{'id':id});
        }

        //删除定制
        function deleteMade($event,id){
            SweetAlert.swal({
                title: "您确定要删除此定制吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var obj = $event.target;
                    var data = {
                        "id":id
                    };
                    reportsService.deleteMade(data).then(function(res){
                        console.log(res);
                        if(res.status === 200){
                            SweetAlert.swal({
                                title: "删除成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            $(obj).parents(".stable-plain-child").remove();
                        }else{
                            SweetAlert.swal({
                                title: "删除失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }  
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "删除失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                }   
            });
        }

        //跳转到设置模板
        function setTpl(){
            $state.go('made-set');
        }
        
    }
}


function assetDetailSoftware($state, $stateParams, reportsService, SweetAlert,CWD){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/enterprise/terminal-software-table.html',
        link: link
    };

    return tableObj;

    ////////

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: true,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false
        });

        ctrl.softwareType = 1,ctrl.disableModify='allow';
        ctrl.softwareHref = function($event,num){
            ctrl.softwareType = num;
            var li = $event.target.parentNode.childNodes;
            for(var i=0;i<li.length;i++){
                li[i].className = '';
            }
            $event.target.className = 'active';
            ctrl.refresh();
        };

        /*ctrl.softwareInputShow = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("input[type='text']").show().focus();
        };
        ctrl.softwareInputHide = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("span").show();
        };*/

        //获取数据列表
        function getAll(params){
            var payload = {};
            var snapshotId = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "snapshotId": Number(snapshotId)
                };
            }
            var getData;
            switch(ctrl.softwareType){
                case 1:
                    getData = reportsService.assetSoftwareProcess(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 2:
                    getData = reportsService.assetSoftwareService(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 3:
                    getData = reportsService.assetSoftwareProgress(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 4:
                    getData = reportsService.assetSoftwarePatch(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                default:
                    getData = reportsService.assetSoftwareProcess(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
            }
            return getData;
        }

        //获取数据总数
        function getCount(params){
            var payload = {};
            var snapshotId = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "snapshotId": snapshotId
                };
            }
            var getCount;
            switch(ctrl.softwareType){
                case 1:
                    getCount = reportsService.assetSoftwareProcess(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 2:
                    getCount = reportsService.assetSoftwareService(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 3:
                    getCount = reportsService.assetSoftwareProgress(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 4:
                    getCount = reportsService.assetSoftwarePatch(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                default:
                    getCount = reportsService.assetSoftwareProcess(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
            }
            return getCount;
        }
    }
}

//审计报告--列表
function reportsAuditTable($rootScope, $uibModal, reportsService, CWD, SweetAlert, tools){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/reports/reports-audit-table.html',
        link: link
    };

    return tableObj;

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbar_selectAll:true,
            toolbar_export:exportData,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '全消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            viewTypes: ['list','plain']
        });

        //获取数据列表
        function getAll(params){
            var payload = {};
            var search = params.search.predicateObject;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            
            return reportsService.auditList(payload).then(function(res){
                console.log(res);
                var sortTimeType = $("#sortTimeType").val();
                if(sortTimeType === '0'){
                    res.data.data.sort(function(a,b){
                        return b.operationAt-a.operationAt;
                    });
                }else if(sortTimeType === '1'){
                    res.data.data.sort(function(a,b){
                        return a.operationAt-b.operationAt;
                    });
                }
                $.each(res.data.data,function(key,obj){
                    obj.operationAt = tools.getSmpFormatDateByLong(obj.operationAt,true);
                    switch(obj.logType){
                        case 0:
                            obj.logType = '企业资源日志';
                            break;
                        case 1:
                            obj.logType = '策略管理日志';
                            break;
                        case 2:
                            obj.logType = '系统操作日志';
                            break;
                        default:
                            obj.logType = '未知';
                    }
                });
                return res.data.data;
            },function(err){
                console.log(err+' '+new Date());
            });
        }

        //获取数据总数
        function getCount(params){
            var payload = {};
            var search = params.search.predicateObject;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            return reportsService.auditList(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }
        
        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#reportsAuditTable").find("input[name='sign']").prop("checked",true);
        }
        //全消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#reportsAuditTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#reportsAuditTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#reportsAuditTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#reportsAuditTable").find("input[name='sign']").prop("checked",false);
            }else{
                $("#reportsAuditTable").find("input[name='sign']").prop("checked",true);
            }
        };

        //时间排序
        ctrl.sortTime = function($event){
            var _this = $event.target;
            var sortTimeType = $("#sortTimeType").val();
            if(sortTimeType === '' || sortTimeType === '0'){
                $(_this).find("i").attr("class","fa fa-sort-up");
                $("#sortTimeType").val("1");
                $rootScope.$broadcast('refreshTable');
            }else{
                $(_this).find("i").attr("class","fa fa-sort-desc");
                $("#sortTimeType").val("0");
                $rootScope.$broadcast('refreshTable');
            }
        };

        //导出功能
        function exportData(){
            console.log('导出');
            var ids = [];
            var signs = $("input[name='sign']");
            var data;
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(id);
                }
            });
            if(ids.length < 1){
                var myModalController = function($scope,$uibModalInstance){
                    $scope.fromDate = '';
                    $scope.toDate = '';
                    $scope.ok = function(){
                        if($scope.fromDate === '' || $scope.toDate === ''){
                            SweetAlert.swal({
                                title: "请将时间填写完整!",
                                type: "warning",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                            return false;
                        }
                        var startTime = Number(moment($scope.fromDate).format('x'));
                        var endTime = Number(moment($scope.toDate).format('x'));
                        if(startTime > endTime){
                            SweetAlert.swal({
                                title: "选择的起始时间必须小于结束时间!",
                                type: "warning",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                            return false;
                        }

                        var flag = $("input[name='exportType']:checked").val();

                        data = {
                            "type":1,
                            "flag":flag,
                            "startTime":startTime,
                            "endTime":endTime
                        };
                        reportsService.auditExport(data);
                    };

                    $scope.cancel = function(){
                        $scope.fromDate = '';
                        $scope.toDate = '';
                        $uibModalInstance.dismiss('cancel');
                    };

                    //日期控件
                    $scope.dateOptions ={
                        formatYear: 'yy',
                        maxDate: new Date(2020, 5, 22),
                        minDate: new Date(),
                        startingDay: 1,
                        locale:'zh_cn'
                    };
                    $scope.dateInit = {
                        format:'yyyy-MM-dd hh:mm:ss',
                        from: false,
                        to:false,
                        openFrom :function() {
                            $scope.fromDate = new Date();
                            $scope.dateInit.from = true;
                        },
                        openTo:function() {
                            $scope.toDate = new Date(Number(moment($scope.fromDate).format('x'))+(1000*3600*24*7));
                            $scope.dateInit.to = true;
                        }
                    };
                };

                $uibModal.open({
                  templateUrl: 'myModalExport.html',
                  controller: myModalController
                });
            }else{
                var myModalController2 = function($scope,$uibModalInstance){
                    $scope.fromDate = '';
                    $scope.toDate = '';
                    $scope.ok = function(){
                        var flag = $("input[name='exportType']:checked").val();

                        data = {
                            "type":0,
                            "flag":flag,
                            "ids":ids.join(",")
                        };
                        reportsService.auditExport(data);
                    };

                    $scope.cancel = function(){
                        $scope.fromDate = '';
                        $scope.toDate = '';
                        $uibModalInstance.dismiss('cancel');
                    };
                };

                $uibModal.open({
                  templateUrl: 'myModalExport2.html',
                  controller: myModalController2
                });
            }
        }     
        
    }
}