/**
 * Created by jinyong on 16-9-5.
 */
export default {
	'enterpriseTerminalTable' : /*@ngInject*/enterpriseTerminalTable,
    'terminallistDataSimulate' : /*@ngInject*/terminallistDataSimulate,
    'terminalDetailSoftware': /*@ngInject*/terminalDetailSoftware,
    'departmentTable' : /*@ngInject*/departmentTable,
    'labelTable' : /*@ngInject*/labelTable,
    'departmentTopology' : /*@ngInject*/departmentTopology
};

//终端列表
function enterpriseTerminalTable($rootScope, $state, $q, $filter, $timeout, $uibModal, enterpriseService, CWD, SweetAlert,tools) {

    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/enterprise/terminal-table.html',
        link: link
    };

    return tableObj;

    ////////

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: true,
            filterOptions: [
                {'name': 'clientType', 'display': '终端类型', 'input': 'select', 'option': true, value: 0, 'options': [{'value': null, 'text': '全部'},{'value': 0, 'text': '未知终端'},{'value': 1, 'text': '待审终端'},{'value': 2, 'text': '正常终端'}]},
                {'name': 'isReg', 'display': '是否需要注册', 'input': 'select', 'option': true, value: 0, 'options': [{'value': null, 'text': '全部'},{'value': 0, 'text': '不需要注册'},{'value': 1, 'text': '需要注册'}]},
                {'name': 'clientStatus', 'display': '终端状态', 'input': 'select', 'option': true, value: 0, 'options': [{'value': null, 'text': '全部'},{'value': 0, 'text': '新发现终端'},{'value': 1, 'text': '已注册终端'}]},
                {'name': 'isOnline', 'display': '是否在线', 'input': 'select', 'option': true, value: 0, 'options': [{'value': null, 'text': '全部'},{'value': 0, 'text': '离线'},{'value': 1, 'text': '在线'}]},
                {'name': 'ifInstall', 'display': '是否安装客户端', 'input': 'select', 'option': true, value: 0, 'options': [{'value': null, 'text': '全部'},{'value': 0, 'text': '没安装'},{'value': 1, 'text': '已安装'}]}
                /*{'name': 'testDate', 'display': '测试日期控件', 'input': 'date', 'startTime': '', 'endTime': ''}*/
            ],
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'mergeTerminal', 'display': '合并', 'function': mergeTerminal},
                {'name': 'departBinding', 'display': '部门', 'function' : departBinding},
                {'name': 'uninstallTerminal', 'display': '卸载', 'function': uninstallTerminal},
                {'name': 'deleteBatchTerminal', 'display': '删除', 'function': deleteBatchTerminal}
            ],
            toolbar_selectAll:true,
            toolbar_operator:true,
            toolbar_add:addData,
            toolbar_refresh:refreshTable,
            toolbar_delete:deleteTerminal,
            toolbar_edit:editTerminal,
            filter_save:saveConditionData,
            viewTypes: ['plain','list'],
            cols: [
                {'name':'mac', 'text':'mac'},
                {'name':'sn', 'text':'sn码'},
                {'name':'cer', 'text':'信息标识'},
                {'name':'hd', 'text':'硬盘'},
                {'name':'clientNode', 'text':'终端标识'},
                {'name':'isReg', 'text':'是否需要注册'},
                {'name':'clientStatus', 'text':'终端状态'},
                {'name':'createAt', 'text':'创建时间'},
                {'name':'updateAt', 'text':'更新时间'},
                {'name':'createUser', 'text':'创建人'},
                {'name':'updateUser', 'text':'更新人'}
            ]
        });

        //获取数据列表
        function getAll(params){
            var searchData = {"pageCode":"terminal-table"};
            return enterpriseService.getConditionData(searchData).then(function(resCondition){
                console.log(resCondition);
                var payload = {};
                var search = params.search.predicateObject;
                if(params){
                    payload = {
                        "currentPage":Number(params.pagination.currentPage),
                        "number":Number(params.pagination.number)
                    };
                    var searchAllArr = [];
                    var addSearchParmToList = [];
                    for(var key in search){
                        if(key){
                            searchAllArr.push(key);
                            payload[key] = Number(search[key]);
                            var searchParm = {
                                "searchCondition":key,
                                "searchValue":Number(search[key])
                            };
                            addSearchParmToList.push(JSON.stringify(searchParm));
                        }
                    }
                    var resConditionData = resCondition.data;
                    if(resConditionData.length > 0){
                        for(var i=0;i<resConditionData.length;i++){
                            var status = tools.inArray(searchAllArr,resConditionData[i].searchCondition);
                            if(status === false){
                                $("#stable_filterItem_"+resConditionData[i].searchCondition).val(resConditionData[i].searchValue);
                                payload[resConditionData[i].searchCondition] = Number(resConditionData[i].searchValue);
                                var searchParmCondition = {
                                    "searchCondition":resConditionData[i].searchCondition,
                                    "searchValue":Number(resConditionData[i].searchValue)
                                };
                                addSearchParmToList.push(JSON.stringify(searchParmCondition));
                            }
                        }
                    }
                    $("#stable-addSearchParmToList").val(addSearchParmToList.join("/"));
                    $("#pageCurrent").val(params.pagination.currentPage);
                    $("#pageNumber").val(params.pagination.number);
                    if(search.$){
                        payload.searchAll = search.$;
                        $("#pageSearch").val(params.search.predicateObject);
                    }
                }                
                
                return enterpriseService.terminalList(payload).then(function(res){
                    console.log(res);
                    var listUninstall = window.localStorage.getItem("terminal-list-uninstall");
                    if(listUninstall){
                        listUninstall = listUninstall.split(",");
                    }
                    $.each(res.data.data,function(key,obj){
                        switch(obj.clientType){
                            case 1:
                                obj.clientType = '待审终端';
                                break;
                            case 2:
                                obj.clientType = '正常终端';
                                break;
                            default:
                                obj.clientType = '未知终端';
                        }
                        switch(obj.clientStatus){
                            case 1:
                                obj.clientStatus = '已注册终端';
                                break;
                            default:
                                obj.clientStatus = '新发现终端';
                        }
                        switch(obj.isReg){
                            case 1:
                                obj.isReg = '需要注册';
                                break;
                            default:
                                obj.isReg = '不需要注册';
                        }
                        switch(obj.isOnline){
                            case 1:
                                obj.isOnline = '在线';
                                break;
                            default:
                                obj.isOnline = '离线';
                        }
                        if(listUninstall){
                            if(tools.inArray(listUninstall,obj.id)){
                                obj.ifInstall = 3;
                            }
                        }
                        switch(obj.ifInstall){
                            case 1:
                                obj.ifInstall = '已安装';
                                break;
                            case 2:
                                obj.ifInstall = '已卸载';
                                break;
                            case 3:
                                obj.ifInstall = '卸载中';
                                break;
                            default:
                                obj.ifInstall = '没安装';
                        }
                        obj.createAt = tools.getSmpFormatDateByLong(obj.createAt,true);
                        obj.updateAt = tools.getSmpFormatDateByLong(obj.updateAt,true);
                        enterpriseService.clientIdReturnDepartment({"clientId":obj.id}).then(function(resDepartment){
                            console.log(resDepartment);
                            if(resDepartment.data.data && resDepartment.data.data.departmentName){
                                obj.department = resDepartment.data.data.departmentName;
                            }else{
                                obj.department = "无";
                            }
                        },function(errDepartment){
                            console.log(errDepartment);
                            obj.department = "无";
                        });
                        enterpriseService.clientIdReturnPolicyInfo({"clientId":obj.id}).then(function(resPolicy){
                            console.log(resPolicy);
                            if(resPolicy.data.data && resPolicy.data.data.policyList){
                                var policy = [];
                                $.each(resPolicy.data.data.policyList,function(k,o){
                                    if(o){
                                        policy.push(o.name);
                                    }
                                });
                                obj.policy = policy.join(",");
                            }else{
                                obj.policy = "无";
                            }
                        },function(errPolicy){
                            console.log(errPolicy);
                            obj.policy = "无";
                        });
                        enterpriseService.clientIdReturnLabelInfo(obj.id).then(function(resLabel){
                            console.log(resLabel);
                                if (resLabel.data.data.length >= 1) {
                                     var label=[];
                                    $.each(resLabel.data.data,function(key,lab) {
                                        if(lab){
                                            label.push(lab.labelName);
                                        }
                                    });
                                    obj.label=label.join("  ");
                                } else {
                                    obj.label = "无";
                                }
                        },function(errLabel){
                            console.log(errLabel);
                            obj.label = "无";
                        });
                    });
                    return res.data.data;
                },function(err){
                    console.log(err);
                });
            },function(errCondition){
                console.log(errCondition);
            }); 
        }
        /*
        function getAll(params){
            var payload = params || {};
            console.log(payload);
            return terminallistDataSimulate($q, $filter, $timeout).getPage(payload).then(function(res){
                console.log(res);
                $.each(res.data,function(key,obj){
                    switch(obj.clientType){
                        case 1:
                            obj.clientType = '待审终端';
                            break;
                        case 2:
                            obj.clientType = '正常终端';
                            break;
                        default:
                            obj.clientType = '未知终端';
                    }
                    switch(obj.clientStatus){
                        case 1:
                            obj.clientStatus = '已注册终端';
                            break;
                        default:
                            obj.clientStatus = '新发现终端';
                    }
                    switch(obj.isReg){
                        case 1:
                            obj.isReg = '需要注册';
                            break;
                        default:
                            obj.isReg = '不需要注册';
                    }
                    switch(obj.isOnline){
                        case 1:
                            obj.isOnline = '在线';
                            break;
                        default:
                            obj.isOnline = '离线';
                    }
                    switch(obj.ifInstall){
                        case 1:
                            obj.ifInstall = '已安装';
                            break;
                        default:
                            obj.ifInstall = '没安装';
                    }
                return res.data;
            });
        }
        */

        //获取数据总数
        function getCount(params){
            var searchData = {"pageCode":"terminal-table"};
            return enterpriseService.getConditionData(searchData).then(function(resCondition){
                var payload = {};
                var search = params.search.predicateObject;
                if(params){
                    payload = {
                        "currentPage":Number(params.pagination.currentPage),
                        "number":Number(params.pagination.number)
                    };
                    var searchAllArr = [];
                    for(var key in search){
                        if(key){
                            searchAllArr.push(key);
                            payload[key] = Number(search[key]);
                        }
                    }
                    var resConditionData = resCondition.data;
                    if(resConditionData.length > 0){
                        for(var i=0;i<resConditionData.length;i++){
                            var status = tools.inArray(searchAllArr,resConditionData[i].searchCondition);
                            if(status === false){
                                $("#stable_filterItem_"+resConditionData[i].searchCondition).val(resConditionData[i].searchValue);
                                payload[resConditionData[i].searchCondition] = Number(resConditionData[i].searchValue);
                            }
                        }
                    }
                    if(search.$){
                        payload.searchAll = search.$;
                    }
                }
                return enterpriseService.terminalList(payload).then(function(res){
                    return res.data.count;
                },function(err){
                    console.log(err);
                });
            },function(errCondition){
                console.log(errCondition);
            });     
        }
        /*
        function getCount(params){
            var payload = params || {};
            return terminallistDataSimulate($q, $filter, $timeout).getPage(payload).then(function(res){
                return res.count;
            });
        }
        */

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#terminalList").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#terminalList").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#terminalList").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#terminalList").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#terminalList").find("input[name='sign']").prop("checked",false);
            }else{
                $("#terminalList").find("input[name='sign']").prop("checked",true);
            }
        };

        //增加功能
        function addData(){
            console.log('增加');
            $state.go('terminal-create');
        }

        //保存筛选条件功能
        function saveConditionData(){
            console.log('保存筛选条件');
            var addSearchParmToList = $("#stable-addSearchParmToList").val();
            addSearchParmToList = addSearchParmToList.split("/");
            for(var i=0;i<addSearchParmToList.length;i++){
                addSearchParmToList[i] = JSON.parse(addSearchParmToList[i]);
            }
            var data = {
                "pageCode":"terminal-table",
                "addSearchParmToList":addSearchParmToList
            };
            console.log(data);
            //保存条件到数据库
            enterpriseService.saveConditionData(data).then(function(res){
                if(res.data === true){
                    SweetAlert.swal({
                        title: "保存成功!",
                        type: "success",
                        timer: 1000,
                        showConfirmButton: false
                    });
                }else{
                    SweetAlert.swal({
                        title: "保存失败!",
                        type: "error",
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            },function(err){
                console.log(err);
                SweetAlert.swal({
                    title: "保存失败!",
                    type: "error",
                    timer: 1000,
                    showConfirmButton: false
                });
            });
        }

        //修改终端
        function editTerminal(id){
            $state.go('terminal-edit',{'id':id});
        }

        //刷新列表
        function refreshTable(){
            var refreshParams = {
                "pagination":{},
                "search":{}
            };
            var pageCurrent = $("#pageCurrent").val(),
                pageNumber = $("#pageNumber").val(),
                pageSearch = $("#pageSearch").val();
            if(pageCurrent !== '' && pageNumber !== ''){
                refreshParams.pagination.currentPage = pageCurrent;
                refreshParams.pagination.number = pageNumber;
                if(pageSearch !== ''){
                    refreshParams.search.predicateObject = pageSearch;
                }
                $rootScope.$broadcast('refreshTable',refreshParams);
            }else{
                $rootScope.$broadcast('refreshTable');
            }
        }

        //删除终端
        function deleteTerminal(clientId){
            SweetAlert.swal({
                title: "您确定要删除此终端吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var data = {
                        "clientIds":[clientId]
                    };
                    enterpriseService.deleteTerminalData(data).then(function(res){
                        console.log(res);
                        if(res.status === 200){
                            SweetAlert.swal({
                                title: "删除成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            refreshTable();
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

        //批量删除
        function deleteBatchTerminal(){
            var clientIds = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var clientId = obj.value;
                    clientIds.push(clientId);
                }
            });
            if(clientIds.length >= 1){
                SweetAlert.swal({
                    title: "您确定要删除选中的终端吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var data = {
                            "clientIds":clientIds
                        };
                        enterpriseService.deleteTerminalData(data).then(function(res){
                            console.log(res);
                            if(res.status === 200){
                                SweetAlert.swal({
                                    title: "删除成功!",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                refreshTable();
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
            }else{
                SweetAlert.swal("您还未选择终端");
            }
        }

        //卸载终端
        function uninstallTerminal(){
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var clientId = $(obj).val();
                    ids.push(clientId);
                }
            });
            if(ids.length <= 0){
                SweetAlert.swal({
                    title: "请选择要卸载的终端!",
                    type: "warning",
                    confirmButtonText: "确定"
                });
                return false;
            }
            SweetAlert.swal({
                title: "您确定要卸载选中的终端吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    enterpriseService.uninstallTerminal({"clientIds":ids}).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
                            SweetAlert.swal({
                                title: "卸载请求发送成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            $.each(ids,function(key,obj){
                                $("#stable-"+obj).find(".box-cover").removeClass("box-hide").addClass("box-show");
                            });
                            ids = ids.join(",");
                            window.localStorage.setItem("terminal-list-uninstall",ids);
                        }else{
                            SweetAlert.swal({
                                title: "卸载请求发送失败!",
                                type: "error",
                                text: res.data.errorMessage,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "卸载请求发送失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                }   
            });     
        }

        //合并终端
        function mergeTerminal(){
            var merges = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var deviceName = $(obj).parents("dl").find(".stable-deviceName").text(),
                        clientId = $(obj).val();
                    var mergeObj = {
                        "deviceName":deviceName,
                        "clientId":clientId
                    };
                    merges.push(mergeObj);
                }
            });

            if(merges.length >= 2){
                $(".popover").remove();

                $rootScope.mergeOptions = merges;
                
                var myModalMergeController = function($scope,$uibModalInstance){
                    $scope.okMerge = function(){
                        var clientIds = [];
                        $.each(merges,function(key,obj){
                            var clientId = Number(obj.clientId);
                            clientIds.push(clientId);
                        });
                        var mergeClientId = $("#mergeMaster").val();
                        mergeClientId = Number(mergeClientId);
                        var coverClientIds = tools.removeByArray(clientIds,mergeClientId);
                        var data = {
                            "mergeClientId":mergeClientId,
                            "coverClientIds":coverClientIds
                        };
                        SweetAlert.swal({
                            title: "您确定要合并选中的终端吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },function(isConfirm){
                            if(isConfirm){
                                enterpriseService.mergeTerminalData(data).then(function(res){
                                    console.log(res);
                                    if(res.status === 200){
                                        SweetAlert.swal({
                                            title: "合并成功!",
                                            type: "success",
                                            timer: 1000,
                                            showConfirmButton: false
                                        });
                                        refreshTable();
                                        $uibModalInstance.dismiss('cancel');
                                    }else{
                                        SweetAlert.swal({
                                            title: "合并失败!",
                                            type: "error",
                                            text: res.statusText,
                                            confirmButtonColor: "#7B69B3",
                                            confirmButtonText: "确定"
                                        });
                                    }
                                },function(err){
                                    console.log(err);
                                    SweetAlert.swal({
                                        title: "合并失败!",
                                        type: "error",
                                        text: err.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                });
                            }   
                        });
                    };

                    $scope.cancelMerge = function(){
                        $uibModalInstance.dismiss('cancel');
                    };
                };

                $uibModal.open({
                  templateUrl: 'myModalMerge.html',
                  controller: myModalMergeController
                });
            }else{
                SweetAlert.swal({
                    title: "需要选择两台或两台以上终端才可进行合并",
                    type: "info",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
            }
        }

        //绑定部门
        $rootScope.treeOptions = {
            nodeChildren: "departmentSuperList",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };
        function departBinding(){
            var bings = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var clientId = $(obj).val();
                    bings.push(Number(clientId));
                }
            });

            if(bings.length >0){
                $(".popover").remove();

                var ModalInstanceCtrl = function($scope, $uibModalInstance){
                    $rootScope.dataForTheTree = [];
                    enterpriseService.SubDepartment({}).then(function(res){
                        console.log(res);
                        $rootScope.dataForTheTree = [res.data.data];
                    });

                    $scope.selDepartmentId=function(id){
                        console.log(id);
                        $scope.departmentId = id;
                    };

                    $scope.ok=function() {
                        if($scope.departmentId){
                            SweetAlert.swal({
                                title: "您确定要绑定选中的终端吗？",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                closeOnConfirm: false
                            },function(isConfirm){
                                if(isConfirm){
                                    if(bings instanceof Array){
                                        bings = bings.join(",");
                                    }
                                    var data='departmentId='+Number($scope.departmentId)+'&clientIds='+bings;
                                    enterpriseService.departmentClient(data).then(function(bingres){
                                        console.log(bingres);
                                        if(bingres.data.stat === 1){
                                            SweetAlert.swal({
                                                title: "绑定部门成功!",
                                                type: "success",
                                                timer: 1000,
                                                showConfirmButton: false
                                            });
                                            refreshTable();
                                            $uibModalInstance.close();
                                        }else{
                                            var deName=[];
                                            $.each(bingres.data.data,function(key,obj){
                                                deName.push(obj.deviceName);
                                            });
                                            deName = deName.join(",");
                                            if(bingres.data.stat!==1){
                                                switch(bingres.data.stat){
                                                    case 0:
                                                        SweetAlert.swal({
                                                            title: "个别终端绑定失败!",
                                                            type: "error",
                                                            text: "终端"+deName+"绑定失败",
                                                            confirmButtonColor: "#7B69B3",
                                                            confirmButtonText: "确定"
                                                        });
                                                        break;
                                                    case -2:
                                                        SweetAlert.swal({
                                                            title: "终端已经绑定，不能在绑定!",
                                                            type: "error",
                                                            text: bingres.statusText,
                                                            confirmButtonColor: "#7B69B3",
                                                            confirmButtonText: "确定"
                                                        });
                                                        break;
                                                    case -3:
                                                        SweetAlert.swal({
                                                            title: "部门或者终端不存在或者已经停用!",
                                                            type: "error",
                                                            text: bingres.statusText,
                                                            confirmButtonColor: "#7B69B3",
                                                            confirmButtonText: "确定"
                                                        });
                                                        break;
                                                    case -4:
                                                        SweetAlert.swal({
                                                            title: "终端不存在或者已经停用!",
                                                            type: "error",
                                                            text: bingres.statusText,
                                                            confirmButtonColor: "#7B69B3",
                                                            confirmButtonText: "确定"
                                                        });
                                                        break;
                                                    default:{
                                                        SweetAlert.swal({
                                                            title: "提交参数有误！",
                                                            type: "error",
                                                            text: bingres.statusText,
                                                            confirmButtonColor: "#7B69B3",
                                                            confirmButtonText: "确定"
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },function(err){
                                        console.log(err);
                                        SweetAlert.swal({
                                            title: "绑定部门失败!",
                                            type: "error",
                                            text: err.statusText,
                                            confirmButtonColor: "#7B69B3",
                                            confirmButtonText: "确定"
                                        });
                                    });
                                }
                            });
                        }else{
                            SweetAlert.swal({
                                title: "您还未选择部门",
                                type: "info",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }
                    };
                    $scope.cancel=function(){
                        $uibModalInstance.dismiss('cancel');
                    };
                };
                $uibModal.open({
                    templateUrl: 'myModal.html',
                    controller: ModalInstanceCtrl
                });
            }else{
                SweetAlert.swal({
                    title: "需要选择一台或一台以上终端进行绑定",
                    type: "info",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
            }
        }

    }
}

//模拟终端列表数据
function terminallistDataSimulate($q, $filter, $timeout){
    var randomsItems = [];

    function createRandomItem(id) {
        //test table
        var heroes = ['Batman', 'Superman', 'Robin', 'Thor', 'Hulk', 'Niki Larson', 'Stark', 'Bob Leponge'];
        //reslist
        var ip = ['49.142.156.26', '49.142.156.27', '49.142.156.28', '49.142.156.29', '50.142.156.226'];
        var product_name = ['Siemens PLC QS3', 'Siemens PLC QS2', 'Siemens PLC QS1', 'Siemens PLC QS118', 'Siemens PLC QS514'];
        var os = ['Linux3.x', 'win7', 'win8', 'ubuntu', 'AIX'];
        var country = ['Korea', 'China', 'France', 'Japan', 'India'];
        var city = ['bishan', 'Hangzhou', 'Paris', 'Tokyo', 'NewYork'];
        var port = ['80', '102', '51', '1200', '905'];
        var service = ['http', 'Iec104', 'modebus', 'SCADA', 'FII'];
        //resdetail
        var level = [1,2,3];
        var num = ['KVF-20160519','KVF-20160520','KVF-20160521'];
        var ver = ['1.0','2.0','3.0'];
        var cer = ['未知','未读','已读'];
        var hd = ['希捷Barracuda 2TB 7200转 64MB','西部数据500GB 7200转 16MB SATA','三星M9T 2TB HN-M201RAD','HGST 7K1000 1TB 7200转 32MB SA','希捷Barracuda 1TB 7200转 64MB'];
        var clientNode = ['SA8DSAF9DAD','DASF775ASDSJ','DADFA9776A'];
        var clientStatus = [0,1];
        var clientType = [0,1,2];
        var isReg = [0,1];
        var isOnline = [0,1];
        var ifInstall = [0,1];

        return {
            id: id,
            deviceName: heroes[Math.floor(Math.random() * 8)],
            ip: ip[Math.floor(Math.random() * 5)],
            mac: product_name[Math.floor(Math.random() * 5)],
            sn: num[Math.floor(Math.random() * 3)],
            os: os[Math.floor(Math.random() * 5)],
            ver: ver[Math.floor(Math.random() * 3)],
            cer: cer[Math.floor(Math.random() * 3)],
            hd: hd[Math.floor(Math.random() * 5)],
            clientNode: clientNode[Math.floor(Math.random() * 3)],
            clientStatus: clientStatus[Math.floor(Math.random() * 2)],
            clientType: clientType[Math.floor(Math.random() * 3)],
            isReg: isReg[Math.floor(Math.random() * 2)],
            isOnline: isOnline[Math.floor(Math.random() * 2)],
            ifInstall: ifInstall[Math.floor(Math.random() * 2)],
            createAt: heroes[Math.floor(Math.random() * 8)],
            updateAt: heroes[Math.floor(Math.random() * 8)],
            createUser: heroes[Math.floor(Math.random() * 8)],
            updateUser: heroes[Math.floor(Math.random() * 8)],
            '_source': {
                ip_str: ip[Math.floor(Math.random() * 4)],
                product: {
                    name: product_name[Math.floor(Math.random() * 4)]
                },
                os: os[Math.floor(Math.random() * 4)],
                location: {
                    country:{
                        'en+': country[Math.floor(Math.random() * 4)]
                    },
                    city:{
                        en: city[Math.floor(Math.random() * 4)]
                    }
                },
                updatetime: new Date(),
                port: port[Math.floor(Math.random() * 4)],
                service: service[Math.floor(Math.random() * 4)]
            },
            highlight: {
                data: ["220 DreamHost FTP Server<br />530 Login incorrect.<br />214-The following commands are recognized (* =>'s unimplemented):<br />CWD     XCWD    CDUP    XCUP    SMNT*   QUIT    PORT    PASV   EPRT    EPSV    ALLO*   RNFR    RNTO    DELE    MDTM    RMD     XRMD    MKD    XMKD    PWD     XPWD    SIZE    SY..."]
            },
            level: level[Math.floor(Math.random() * 2)],
            num: num[Math.floor(Math.random() * 2)]
        };

    }

    for (var i = 0; i < 1000; i++) {
        randomsItems.push(createRandomItem(i));
    }


    //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
    //in our case, it actually performs the logic which would happened in the server
    function getPage(params) {
        var start = params.pagination.start || 0;
        var number = params.pagination.number || 10;
        var deferred = $q.defer();

        var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

        if (params.sort.predicate) {
            filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
        }

        var result = filtered.slice(start, start + number);

        $timeout(function () {
            //note, the server passes the information about the data set size
            deferred.resolve({
                data: result,
                count: filtered.length,
                numberOfPages: Math.ceil(filtered.length / number)
            });
        }, 100);


        return deferred.promise;
    }

    return {
        getPage: getPage
    };
}

//终端详情--软件信息
function terminalDetailSoftware($state, $stateParams, enterpriseService, CWD,SweetAlert){
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

        ctrl.softwareType = 1;
        ctrl.softwareHref = function($event,num){
            ctrl.softwareType = num;
            var li = $event.target.parentNode.childNodes;
            for(var i=0;i<li.length;i++){
                li[i].className = '';
            }
            $event.target.className = 'active';
            ctrl.refresh();          
        };

        ctrl.softwareInputShow = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("input[type='text']").show().focus();
        };
        ctrl.softwareInputHide = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("span").show();
        };
        ctrl.softwareUpdate = function($event,id){
            var obj = $event.target;
            switch(ctrl.softwareType){
                case 1:
                    var pname = $(obj).parents("tr").find(".name").text(),
                        pdescription = $(obj).parents("tr").find(".description").text(),
                        pfullpath = $(obj).parents("tr").find(".fullpath").text(),
                        pcompany = $(obj).parents("tr").find(".company").text();
                    var processInfo = [{
                        "id":id,
                        "name":pname,
                        "description":pdescription,
                        "fullpath":pfullpath,
                        "company":pcompany
                    }];
                    var pdata = {
                        "processInfo":processInfo
                    };
                    enterpriseService.terminalUpdateSoftwareInfo(pdata).then(function(res){
                        console.log(res);
                        if(res.data === true){
                            SweetAlert.swal({
                                title: "修改成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }else{
                            console.log(res.statusText);
                            SweetAlert.swal({
                                title: "修改失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }   
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "修改失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                    break;
                case 2:
                    var sname = $(obj).parents("tr").find(".name").text(),
                        sdescription = $(obj).parents("tr").find(".description").text(),
                        sfullpath = $(obj).parents("tr").find(".fullpath").text(),
                        sstatus = $(obj).parents("tr").find(".status").text(),
                        scompany = $(obj).parents("tr").find(".company").text();
                    var serviceInfo = [{
                        "id":id,
                        "name":sname,
                        "description":sdescription,
                        "fullpath":sfullpath,
                        "status":sstatus,
                        "company":scompany
                    }];
                    var sdata = {
                        "serviceInfo":serviceInfo
                    };
                    enterpriseService.terminalUpdateSoftwareInfo(sdata).then(function(res){
                        console.log(res);
                        if(res.data === true){
                            SweetAlert.swal({
                                title: "修改成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }else{
                            console.log(res.statusText);
                            SweetAlert.swal({
                                title: "修改失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }   
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "修改失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                    break;
                case 3:
                    var sfname = $(obj).parents("tr").find(".name").text(),
                        sfpublisher = $(obj).parents("tr").find(".publisher").text(),
                        sfinstallAt = $(obj).parents("tr").find(".installAt").text(),
                        sfsoftSize = $(obj).parents("tr").find(".softSize").text(),
                        sfver = $(obj).parents("tr").find(".ver").text();
                    var softwareInfo = [{
                        "id":id,
                        "name":sfname,
                        "publisher":sfpublisher,
                        "installAt":sfinstallAt,
                        "softSize":sfsoftSize,
                        "ver":sfver
                    }];
                    var sfdata = {
                        "softwareInfo":softwareInfo
                    };
                    enterpriseService.terminalUpdateSoftwareInfo(sfdata).then(function(res){
                        console.log(res);
                        if(res.data === true){
                            SweetAlert.swal({
                                title: "修改成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }else{
                            console.log(res.statusText);
                            SweetAlert.swal({
                                title: "修改失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }   
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "修改失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                    break;
                case 4:
                    var ptname = $(obj).parents("tr").find(".name").text(),
                        ptstatus = $(obj).parents("tr").find(".status").text(),
                        ptsignificance = $(obj).parents("tr").find(".significance").text(),
                        ptinstallAt = $(obj).parents("tr").find(".installAt").text();
                    var patchInfo = [{
                        "id":id,
                        "name":ptname,
                        "description":ptstatus,
                        "fullpath":ptsignificance,
                        "company":ptinstallAt
                    }];
                    var ptdata = {
                        "patchInfo":patchInfo
                    };
                    enterpriseService.terminalUpdateSoftwareInfo(ptdata).then(function(res){
                        console.log(res);
                        if(res.data === true){
                            SweetAlert.swal({
                                title: "修改成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }else{
                            console.log(res.statusText);
                            SweetAlert.swal({
                                title: "修改失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                        }   
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "修改失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                    });
                    break;
            }
        };

        //获取数据列表
        function getAll(params){
            var payload = {};
            var clientId = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "clientId": Number(clientId)
                };
            }
            var getData;
            switch(ctrl.softwareType){
                case 1:
                    getData = enterpriseService.terminalClientProcess(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 2:
                    getData = enterpriseService.terminalClientService(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 3:
                    getData = enterpriseService.terminalClientSoftware(payload).then(function(res){
                        console.log(res);
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 4:
                    getData = enterpriseService.terminalClientPatch(payload).then(function(res){
                        console.log(res);
                        $.each(res.data.data,function(key,obj){
                            if(obj.status.indexOf("http") > -1){
                                obj.status = '<a target="_blank" href="'+obj.status+'">'+obj.status+'</a>';
                            }
                        });
                        return res.data.data;
                    },function(err){
                        console.log(err);
                    });
                    break;
                default:
                    getData = enterpriseService.terminalClientProcess(payload).then(function(res){
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
            var clientId = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "clientId": clientId
                };
            }
            var getCount;
            switch(ctrl.softwareType){
                case 1:
                    getCount = enterpriseService.terminalClientProcess(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 2:
                    getCount = enterpriseService.terminalClientService(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 3:
                    getCount = enterpriseService.terminalClientSoftware(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                case 4:
                    getCount = enterpriseService.terminalClientPatch(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
                    break;
                default:
                    getCount = enterpriseService.terminalClientProcess(payload).then(function(data){
                        return data.data.count;
                    },function(err){
                        console.log(err);
                    });
            }
            return getCount;   
        }
    }
}

//部门列表
function departmentTable($state, $q, $filter, $timeout, enterpriseService, CWD,SweetAlert) {

    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/enterprise/department-table.html',
        link: link
    };

    return tableObj;

    ////////

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 5,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'deleteBatchdepartment', 'display': '删除', 'function': deleteBatchdepartment},
            ],
            toolbar_operator:true,
            toolbar_add:addData,
            toolbar_refresh:refresh,
            toolbar_delete:deletedepartment,
            toolbar_edit:editdepartment,
            toolbar_topology:topology,
            viewTypes: ['plain','list']
        });

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#departTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#departTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#departTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#departTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#terminalList").find("input[name='sign']").prop("checked",false);
            }else{
                $("#terminalList").find("input[name='sign']").prop("checked",true);
            }
        };


        //拓扑图
        function topology(){
            console.log('拓扑图');
            var topoids=[];
            var signs = $("input[name='sign']");
            $.each(signs, function (key, obj) {
                if (obj.checked) {
                    var id = obj.value;
                    topoids.push(id);
                }
            });
            topoids = topoids.join(",");
            $state.go('department-topology',{'id':topoids});
        }


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

            return enterpriseService.departmentData(payload).then(function(res){
                console.log(res);
                $.each(res.data.data,function(key,obj){
                    enterpriseService.departmentIdReturnPolicyInfo({"departmentId" : obj.id}).then(function(policyres){
                        console.log(policyres);
                        if(policyres.data.data){
                            var policy=[];
                            $.each(policyres.data.data.policyList,function(k,o){
                                if(o){
                                    policy.push(o.name);
                                }
                            });
                            obj.policy = policy.join(",");
                        }

                    });
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
            return enterpriseService.departmentData(payload).then(function(res){
                return res.data.info.count;
            },function(err){
                console.log(err);
            });
        }

        //增加功能
        function addData(){
            console.log('增加');
            $state.go('department-create');
        }
        //修改部门
        function editdepartment(id){
            $state.go('department-edit',{'id':id});
        }
        //刷新功能
        function refresh() {

        }

        //删除部门
        function deletedepartment($event,id){
            SweetAlert.swal({
                title: "您确定要删除此部门吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var obj = $event.target;
                    var data='departmentId=' +id+'&'+'isOwn=false';
                    enterpriseService.removeDepartment(data).then(function(res){
                        console.log(res);
                        if(res.data.stat >0){
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
                                confirmButtonText: "确定"
                            });
                        }
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "删除失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonText: "确定"
                        });
                    });
                }
            });
        }

        //删除1个部门
        function deleteBatchdepartment() {
            var departmentid,parentId;
            var signs=$("input[type='checkbox']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id=obj.value;
                    departmentid=id;
                    var sgn=$(obj).parents("dl").find("input[name='sgn']").val();
                    parentId=Number(sgn);
                }
            });
            if(parentId!==-1){
                if (departmentid) {
                    SweetAlert.swal({
                        title: "您确定要删除选中的部门吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var data='departmentId=' +departmentid+'&'+'isOwn=false';
                            enterpriseService.removeDepartment(data).then(function (res) {
                                console.log(res);
                                if (res.data.stat > 0) {
                                    SweetAlert.swal({
                                        title: "删除成功!",
                                        type: "success",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                    if(departmentid.length){
                                        $("#stable-" + departmentid).remove();
                                    }
                                } else {
                                    SweetAlert.swal({
                                        title: "删除失败!",
                                        type: "error",
                                        text: res.statusText,
                                        confirmButtonText: "确定"
                                    });
                                }
                            }, function (err) {
                                console.log(err);
                                SweetAlert.swal({
                                    title: "删除失败!",
                                    type: "error",
                                    text: err.statusText,
                                    confirmButtonText: "确定"
                                });
                            });
                        }
                    });
                } else {
                    SweetAlert.swal("只能选择一个部门");
                }
            }else{
                SweetAlert.swal("根部门不能删除");
            }

        }
    }
}

//标签列表
function labelTable($rootScope, $state, enterpriseService, CWD, SweetAlert) {
    var tableObj={
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD+'templates/enterprise/label-table.html',
        link: link
    };

    return tableObj;

    function link(scope,element,attr,ctrl){

        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 5,
            pipeService: getAll,
            getCount: getCount,
            filter:false,
            operationOptions: [
                {'name': 'deleteBatchlabel','display': '删除', 'function': deleteBatchlabel}
            ],
            toolbar_operator:true,
            toolbar_add: addData,
            toolbar_delete: deletelabel,
            toolbar_edit: editlabel,
            toolbar_refresh: refresh,
            viewTypes: ['plain','list'],
        });
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#terminalList").find("input[name='sign']").prop("checked",false);
            }else{
                $("#terminalList").find("input[name='sign']").prop("checked",true);
            }
        };
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

            return enterpriseService.indexLablePage(payload).then(function(res){
                console.log(res);
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
            return enterpriseService.indexLablePage(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            });
        }
        //增加功能
        function addData(){

            console.log('增加');
            $state.go('label-create');

        }
        //修改标签
        function editlabel(id){
            $state.go('label-edit',{'id':id});
        }
        //刷新功能
        function refresh() {

        }

        //删除标签
        function deletelabel(labelId){
            SweetAlert.swal({
                title: "您确定要删除此标签吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                   // var obj = $event.target;
                    var params = {
                        "labelInfoId":labelId
                    };
                    enterpriseService.deleteLabelInfo(params).then(function(res){
                        console.log(res);
                        if(res.data.stat===1){
                            SweetAlert.swal({
                                title: "删除成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            $rootScope.$broadcast('refreshTable');
                        }else{
                            SweetAlert.swal({
                                title: "删除失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonText: "确定"
                            });
                        }
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "删除失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonText: "确定"
                        });
                    });
                }
            });

        }

        //批量删除
        function deleteBatchlabel(){
            var labelIds;
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var labelId = obj.value;
                    labelIds=Number(labelId);
                }
            });
            SweetAlert.swal({
                title: "您确定要删除选中的标签吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var params = {
                        "labelInfoId":labelIds
                    };
                    enterpriseService.deleteLabelInfo(params).then(function(res){
                        console.log(res);
                        if(res.data.stat === 1){
                            SweetAlert.swal({
                                title: "删除成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            $("#stable-"+labelIds).remove();
                        }else{
                            SweetAlert.swal({
                                title: "删除失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonText: "确定"
                            });
                        }
                    },function(err){
                        console.log(err);
                        SweetAlert.swal({
                            title: "删除失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonText: "确定"
                        });
                    });
                }
            });
        }
    }
}

//拓扑图列表
function departmentTopology(){

}