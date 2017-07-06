/**
 * Created by Carol on 17/11/16.
 */
export default {
    'ipTableState':/*@ngInject*/ipTableState,
    'validationIp':/*@ngInject*/validationIp,
    'validationEmailPwd':/*@ngInject*/validationEmailPwd,
    'validationInteger':/*@ngInject*/validationInteger,
    'systemUserTable':/*@ngInject*/systemUserTable
};


function validationIp(tools,$rootScope){
    return {
        require:'?ngModel',
        restrict:'A',
        scope:{
            validationIp:'@'
        },
        link:function(scope,element,attr,ctrl){
            if(ctrl&&ctrl.$validators){
                ctrl.$validators[scope.validationIp]=function(val){
                    if($rootScope.currentState==='networkList'){
                        scope.$parent.addIpTip=false;
                    }
                    return tools.checkIpFormat(val);
                };
            }
        }
    };
}
function ipTableState(systemServices,$stateParams,$rootScope) {
    return {
        restrict: 'A',
        scope: {
            ipTableState:'=',
            getIpTable:'&',
            editIp:'&'
        },
        template: '<tbody><tr ng-repeat="item in ipTableState track by $index"><td ng-bind="item.ip"></td><td ng-bind="item.mask"></td><td ng-bind="item.gateway"></td>'+
        '<td><a class="fa fa-arrow-up" title="上移" href="javascript:;" ng-click="upMove($index)"></a></td><td><a class="fa fa-arrow-down" title="下移" href="javascript:;" ng-click="downMove($index)"></a></td>' +
        '<td><a class="fa fa-trash-o fa-big" title="删除" href="javascript:;" ng-click="delIp($index)"></a><a class="fa fa-pencil-square-o fa-big" title="编辑" ng-click="editIp()(ipTableState[$index])"></a></td></tr></tbody>',
        replace: true,
        link: link
    };
    function link(scope,$q){
        scope.getIpTable()();
        scope.delIp=function(idx){
            var params={
                networkIds:[]
            },isHas=false;
            $(scope.ipTableState).each(function(i, d){
                if(i===idx){
                    isHas=true;
                    params.networkIds.push(d.id);
                }
            });
            if(!isHas){
                $rootScope.addAlert({
                    type:'error',
                    content:'程序出错,找不到ID'
                });
                return;
            }
            try{
                systemServices.deleteBindedIp(params).then(function(res){
                    if(res.data.status){
                        scope.ipTableState.splice(idx,1);
                        $rootScope.addAlert({
                            type:'success',
                            content:'删除成功'
                        });
                    }else{
                        $rootScope.addAlert({
                            type:'error',
                            content:'删除失败, 原因为: '+res.data.errorMessage?res.data.errorMessage:'未知'
                        });
                    }
                });
            }catch(e){
                $rootScope.addAlert({
                    type:'error',
                    content:'服务器出错了, 请稍候再尝试'
                });
                //console.log(e);
            }
        };

        scope.upMove=function(idx){
            if(idx-1<0){
                $rootScope.addAlert({
                    type:'error',
                    content:'该条已经为最顶部'
                });
            }else{
                scope.ipTableState.splice(idx-1,0,scope.ipTableState.splice(idx,1)[0]);
            }
        };
        scope.downMove=function(idx){
            if(idx+1>(scope.ipTableState.length-1)){
                $rootScope.addAlert({
                    type:'error',
                    content:'该条已经为最底部'
                });
            }else{
                scope.ipTableState.splice(idx+1,0,scope.ipTableState.splice(idx,1)[0]);
                $q.when(function(){return 'abc';}).then(function(res){console.log(res);});
            }

        };
    }
}
//验证邮箱密码
function validationEmailPwd(){
    return {
        require:'?ngModel',
        restrict:'A',
        scope:{
            validationEmailPwd:'@'
        },
        link:function(scope,element,attr,ctrl){
            if(ctrl&&ctrl.$validators){
                ctrl.$validators[scope.validationEmailPwd]=function(val){
                    if(val && val !== ''){
                        if(val.length >= 6){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return true;
                    }   
                };
            }
        }
    };
}
//验证正整数
function validationInteger(tools){
    return {
        require:'?ngModel',
        restrict:'A',
        scope:{
            validationInteger:'@'
        },
        link:function(scope,element,attr,ctrl){
            if(ctrl&&ctrl.$validators){
                ctrl.$validators[scope.validationInteger]=function(val){
                    if(val !== ''){
                        return tools.fnValidate.PositiveInteger.test(val);
                    }else{
                        return true;
                    }
                };
            }
        }
    };
}

//管理员--列表
function systemUserTable($rootScope, $state, systemServices, CWD, SweetAlert, tools){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/system/system-user-table.html',
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
            toolbar_operator:false,
            toolbar_add:addData,
            toolbar_refresh:refreshTable,
            toolbar_edit:editUser,
            toolbar_delete:deleteUser,
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
            
            return systemServices.userList(payload).then(function(res){
                console.log(res);
                $.each(res.data.data,function(key,obj){
                    obj.lastLogin = tools.getSmpFormatDateByLong(obj.lastLogin,true);
                    switch(obj.locked){
                        case 0:
                            obj.locked = "未锁定";
                            break;
                        case 1:
                            obj.locked = "已锁定";
                            break;
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
            return systemServices.userList(payload).then(function(res){
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
            $state.go('system-usercreat');
        }

        //刷新
        function refreshTable(){
            console.log('刷新');
            $rootScope.$broadcast('refreshTable');
        }

        //修改管理员
        function editUser(id){
            $state.go('system-userupdate',{'id':id});
        }

        //删除管理员
        function deleteUser(id){
            SweetAlert.swal({
                title: "您确定要删除此管理员吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var data = {
                        "id":Number(id)
                    };
                    systemServices.deleteUser(data).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
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
                                text: res.data.errorMessage,
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
        /*
        function deleteBatch(){
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(Number(id));
                }
            });
            if(ids.length >= 1){
                SweetAlert.swal({
                    title: "您确定要删除选中的管理员吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var data = {
                            "ids":ids
                        };
                        systemServices.deleteTerminalData(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
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
                                    text: res.data.errorMessage,
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
                SweetAlert.swal("您还未选择管理员");
            }
        }
        */

    }
}