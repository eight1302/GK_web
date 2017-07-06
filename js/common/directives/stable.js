/**
 * 表格控件
 *
 * Created by jinyong on 16-5-27.
 */
export default {
    'stable' : /*@ngInject*/stable
};

function stable(CWD) {

    var stableObj = {
        scope: false,
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: CWD + 'templates/common/stable/stable.html',
        controllerAs: 'stable',
        controller: /*@ngInject*/controller,
        link: link
    };

    return stableObj;

    ////////
    function controller($q, $timeout) {
        var vm = this;
        var order = {};
        var tableDataService, getTableDataCount, fields;

        vm.currentPage = 1; //current page
        vm.tableData = [];
        vm.tableState = {};

        vm.dateOptions ={
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            locale:'zh_cn'
        };
        vm.dateInit = {
            format:'yyyy-MM-dd hh:mm:ss',
            from: false,
            to:false,
            openFrom :function() {
                vm.fromDate = new Date();
                vm.dateInit.from = true;
            },
            openTo:function() {
                vm.toDate = new Date(Number(moment(vm.fromDate).format('x'))+(1000*3600*24*7));
                vm.dateInit.to = true;
            }
        };
        /**
         * config = {
             *     pagination: boolean
             *     totalCount: boolean
             *     disableToolbar: boolean
             *     pipeService: function
             *     getCount: function
             *     name: string
             *     fields: array[string]
             *     predicate: string
             *     reverse: boolean
             * }
         */
        vm.setConfig = function (config) {
            tableDataService = config.pipeService;//请求到的返回内容
            getTableDataCount = config.getCount;//返回总数
            fields = config.fields;
            order.predicate = config.predicate;
            order.reverse = config.reverse;
            vm.pagination = config.pagination;
            vm.numPerPage = config.numPerPage?config.numPerPage:10;//max rows for data table
            vm.name = config.name;
            vm.totalCount = config.totalCount;
            vm.disableToolbar = config.disableToolbar;
            vm.disableToolbarRight = config.disableToolbarRight;
            //toolbar中的增删查改的4个function接口，暂时不支持传递参数。
            vm.toolbar_selectAll = config.toolbar_selectAll;
            vm.toolbarFilters=config.toolbarFilters;
            vm.toolbar_operator = config.toolbar_operator;
            vm.toolbar_add = config.toolbar_add;
            vm.toolbar_refresh = config.toolbar_refresh;
            vm.toolbar_import = config.toolbar_import;
            vm.toolbar_export = config.toolbar_export;
            vm.toolbar_delete = config.toolbar_delete;
            vm.toolbar_edit = config.toolbar_edit;
            vm.toolbar_topology = config.toolbar_topology;
            vm.filter = config.filter;
            vm.filterOptions = config.filterOptions;
            vm.selectAllOptions = config.selectAllOptions;
            vm.operationOptions = config.operationOptions;
            vm.toolbarDate=config.toolbarDate;
            //filter中保存筛选条件的function接口，暂时不支持传递参数。
            vm.filter_save = config.filter_save;
            vm.viewTypes = config.viewTypes;
            if(angular.isArray(config.viewTypes)){
                vm.view_list = config.viewTypes.includes('list');
                vm.view_plain = config.viewTypes.includes('plain');
                if(config.viewTypes[0] === 'list'){
                    vm.table_view = vm.view_list?'list':(vm.view_plain?'plain':'');
                }else{
                    vm.table_view = vm.view_plain?'plain':(vm.view_list?'plain':'');
                }
            }
            vm.cols = config.cols;
            vm.colsVal = {};
            if(angular.isArray(vm.cols)){
                if(vm.assetReport || vm.safetyReport){
                    vm.cols.forEach((col)=>{
                        vm.colsVal[col.name] = true;
                    });
                }else{
                    vm.cols.forEach((col)=>{
                        vm.colsVal[col.name] = false;
                    });
                }
            }
        };

        vm.getOrderConfig = function () {
            return order;
        };

        vm.searchBar = function () {
            //自定义'search'事件触发查询 ref -> /templates/common/stable/toolbar.html
            angular.element(document.querySelector('#stable-toolbar_input_search')).triggerHandler('search');
            vm.currentPage = 1;

        };

        vm.keyUpSearch = function(code){
            if (code === 13) {
                vm.searchBar();
            }
        };

        vm.clickSearch = function(){
            vm.searchBar();
        };

        vm.refresh = function (params) {
            return vm.getTableData(vm.tableState, null, params);
        };

        //////////
        /**
         * params = {
             *     pagination: {number, numberOfPages, start, totalItemCount, currentPage}
             *     search: {predicateObject: {fields: val,...}} //when fields==='$' means global search
             *     sort: {predicate, revers:boolean}
             *     [param]: [any]
             *     ...
             * }
         */
        vm.getTableData = function(tableState, stCtrl, params) {
            var payload = {};
            var deferred = $q.defer();
            var promise = deferred.promise;//主要是refresh用来判断数据是否更新完毕

            if(tableState){
                vm.tableState = tableState;

                tableState.pagination.number = vm.numPerPage;//解决使用stPagination时，调用2次api的问题

                if(params){
                    //记录业务条件+
                    payload = angular.copy(params);
                    //记录筛选条件
                    vm.predicateObject = payload.search?payload.search.predicateObject:'';

                    //当从refresh访问时，切换到第1页
                    vm.currentPage = 1;
                    tableState.pagination.start=0;//强制st-pagination切换到第1页
                }else if(tableState.pagination.start >= 0 && tableState.pagination.number){
                    vm.currentPage = Math.floor(tableState.pagination.start / tableState.pagination.number) + 1;
                }

                payload.pagination = tableState.pagination?tableState.pagination:{};
                payload.sort = tableState.sort.predicate?tableState.sort:order;
                payload.search = tableState.search.predicateObject?tableState.search:{predicateObject:{}};
                //payload.startTime = vm.fromDate ? moment(vm.fromDate).format('YYYY-MM-DD hh:mm:ss') : '';
                //payload.endTime = vm.toDate ? moment(vm.toDate).format('YYYY-MM-DD hh:mm:ss') : '';
                if(vm.predicateObject){
                    angular.extend(payload.search.predicateObject, vm.predicateObject);
                }
                payload.pagination.currentPage = vm.currentPage;
            }

            //当service为undefined时不执行操作，直接返回错误
            if(!tableDataService){
                deferred.resolve('fail');
                return promise;
            }

            tableDataService(payload).then(function (data) {
                //1.table中显示数据（当前页）
                vm.tableData = data;
                console.log(vm.tableData);
                getTableDataCount(payload).then(function (count) {
                    //2.数据总数
                    tableState.pagination.totalItemCount = vm.totalItemCount = count;
                    //3.总页数 set the number of pages so the pagination can update
                    tableState.pagination.numberOfPages = vm.totalItemCount > 0 ? Math.ceil(vm.totalItemCount / tableState.pagination.number) : 1;

                    $timeout.cancel(vm.checkTimeout);
                    //vm.fromDate=payload.search.predicateObject.start?new Date(payload.search.predicateObject.start):vm.fromDate;
                    //vm.toDate=payload.search.predicateObject.end?new Date(payload.search.predicateObject.end):vm.toDate;
                    deferred.resolve('success');
                });
            });

            vm.checkTimeout = $timeout(function () {
                deferred.resolve('fail');
            }, 10000);

            return promise;
        };
    }

    function link(scope, element, attr, ctrl) {
        //更新table数据的event
        scope.$on('refreshTable', function(event, data){
            //console.log(data);
            if(data){
                ctrl.refresh(data);
            }else{
                ctrl.refresh();
            }
        });

        //更新数据(向parent scope中传递数据)
        scope.$on('emitScope', function(event, data){
            scope[data.key] = data.val;
        });
    }
}