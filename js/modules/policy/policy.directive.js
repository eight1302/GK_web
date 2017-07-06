/**
 * Created by jinyong on 16-9-5.
 */
export default {
	'whitelistTable' : /*@ngInject*/whitelistTable,
    'whitelistDetailApp': /*@ngInject*/whitelistDetailApp,
    'whitelistDetailUsb': /*@ngInject*/whitelistDetailUsb,
    'whitelistDetailCertificate': /*@ngInject*/whitelistDetailCertificate,
    'safeTable': /*@ngInject*/safeTable
};

//白名单--列表
function whitelistTable($rootScope, $state, policyService, CWD, $uibModal, SweetAlert){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/policy/whitelist-table.html',
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
            toolbar_import:importData,
            toolbar_export:exportData,
            toolbar_edit:editWhitelist,
            toolbar_delete:deleteWhitelist,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'deleteBatch', 'display': '删除', 'function': deleteBatch}
            ]
        });

        //跳转到详情
        ctrl.goDetail = function(detailId){
            var boxEle = $("#stable-"+detailId).find(".box-cover");
            if(boxEle.hasClass("box-show")){
                return false;
            }
            $state.go('whitelist-app',{'id':detailId});
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
                $("#pageCurrent").val(params.pagination.currentPage);
                $("#pageNumber").val(params.pagination.number);
                if(search.$){
                    payload.searchAll = search.$;
                    $("#pageSearch").val(params.search.predicateObject);
                }else{
                    $("#pageSearch").val("");
                }
            }
            
            return policyService.whitelist(payload).then(function(res){
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
            
            return policyService.whitelist(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#whitelistTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#whitelistTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }
        }

        //增加功能
        function addData(){
            console.log('增加');
            $state.go('whitelist-creat');
        }

        //导入功能
        function importData(){
            console.log('导入');
            var ids = [],names = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(Number(id));

                    var name = $(obj).parent().find("span.title").find("a").text();
                    names.push(name);
                }
            });
            if(ids.length > 1){
                SweetAlert.swal({
                    title: "只能选择导入1个白名单!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            if(ids.length <= 0){
                var myModalController = function($scope,$uibModalInstance){
                    $scope.ok = function(){
                        var name = $("#importWhitelistName").val(),
                            file = $("#nocheckImportFormFile").val();
                        if(name === ''){
                            SweetAlert.swal({
                                title: "请输入白名单名称!",
                                type: "error",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                            return false;
                        }
                        if(file === ''){
                            SweetAlert.swal({
                                title: "您还未上传要导入的文件",
                                type: "warning",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                            return false;
                        }
                        var fileSize = document.getElementById("nocheckImportFormFile").files[0].size;
                        if(fileSize > 10240000){
                            SweetAlert.swal({
                                title: "导入的文件请不要超过10M!",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },function(isConfirm){
                                if(isConfirm){
                                    SweetAlert.swal({
                                        title: "请重新选择文件!",
                                        type: "info",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                }   
                            });
                            return false;
                        }
                        var data = new FormData($("#nocheckImportForm")[0]);
                        SweetAlert.swal({
                            title: "您确定要进行导入吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },function(isConfirm){
                            if(isConfirm){
                                policyService.importWhitelist(data).then(function(res){
                                    console.log(res);
                                    if(res.data.status === 0){
                                        SweetAlert.swal({
                                            title: "文件上传成功，系统正在努力加载中，请稍后使用!",
                                            type: "success",
                                            timer: 1000,
                                            showConfirmButton: false
                                        });
                                        refreshTable();
                                        $uibModalInstance.dismiss('cancel');
                                    }else{
                                        SweetAlert.swal({
                                            title: "导入失败！",
                                            type: "error",
                                            text: res.data.message,
                                            confirmButtonColor: "#7B69B3",
                                            confirmButtonText: "确定"
                                        });
                                    }
                                },function(err){
                                    console.log(err);
                                    SweetAlert.swal({
                                        title: "导入失败!",
                                        type: "error",
                                        text: err.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                });
                            }   
                        });
                    };

                    $scope.cancel = function(){
                        $("#importWhitelistName").val("");
                        $("#nocheckImportFormFile").val("");
                        $uibModalInstance.dismiss('cancel');
                    };
                };

                $uibModal.open({
                  templateUrl: 'myModalImport.html',
                  controller: myModalController
                });
            }else{
                var myModalController2 = function($scope,$uibModalInstance){
                    $scope.checkImportFormNames = names.join(",");

                    $scope.ok = function(){
                        var file = $("#checkImportFormFile").val();
                        if(file === ''){
                            SweetAlert.swal({
                                title: "您还未上传要导入的文件",
                                type: "warning",
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定"
                            });
                            return false;
                        }
                        var fileSize = document.getElementById("checkImportFormFile").files[0].size;
                        if(fileSize > 10240000){
                            SweetAlert.swal({
                                title: "导入的文件请不要超过10M!",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#7B69B3",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },function(isConfirm){
                                if(isConfirm){
                                    SweetAlert.swal({
                                        title: "请重新选择文件!",
                                        type: "info",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                }
                            });
                            return false;
                        }
                        $("#checkImportFormIds").val(ids[0]);

                        var data = new FormData($("#checkImportForm")[0]);
                        SweetAlert.swal({
                            title: "您确定要进行导入吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },function(isConfirm){
                            if(isConfirm){
                                policyService.importWhitelist(data).then(function(res){
                                    console.log(res);
                                    if(res.data.status === 0){
                                        SweetAlert.swal({
                                            title: "文件上传成功，系统正在努力加载中，请稍后使用!",
                                            type: "success",
                                            timer: 1000,
                                            showConfirmButton: false
                                        });
                                        refreshTable();
                                    }else{
                                        SweetAlert.swal({
                                            title: "导入失败！",
                                            type: "error",
                                            text: res.data.message,
                                            confirmButtonColor: "#7B69B3",
                                            confirmButtonText: "确定"
                                        });
                                    }
                                },function(err){
                                    console.log(err);
                                    SweetAlert.swal({
                                        title: "导入失败!",
                                        type: "error",
                                        text: err.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                });
                            }   
                        });
                    };

                    $scope.cancel = function(){
                        $scope.checkImportFormNames = "";
                        $("#checkImportFormIds").val("");
                        $("#checkImportFormFile").val("");
                        $uibModalInstance.dismiss('cancel');
                    };
                };

                $uibModal.open({
                  templateUrl: 'myModalImport2.html',
                  controller: myModalController2
                });
            }
        }

        //导出功能
        function exportData(){
            console.log('导出');
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(Number(id));
                }
            });
            if(ids.length <= 0){
                SweetAlert.swal({
                    title: "您未选择要导出的白名单!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            if(ids.length > 3){
                SweetAlert.swal({
                    title: "最多只能导出3个白名单!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            SweetAlert.swal({
                title: "您确定要进行导出吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    ids = ids.join(",");
                    policyService.exportWhiteList(ids);
                    $(".sweet-alert .cancel").click();
                }   
            });     
        }

        //修改白名单
        function editWhitelist(id){
            $state.go('whitelist-update',{'id':id});
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

        //删除白名单
        function deleteWhitelist(id){
            var dontDetele = $("#stable-"+id).find("input[name='dontDetele']").val();
            if(Number(dontDetele) === 1){
                SweetAlert.swal({
                    title: "此白名单不可删除!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            SweetAlert.swal({
                title: "您确定要删除此白名单吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var data = {
                        "whiteListIds":[id]
                    };
                    policyService.whitelistDelete(data).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
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
        function deleteBatch(){
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(id);
                }
            });
            if(ids.length >= 1){
                $.each(ids,function(key,obj){
                    var dontDetele = $("#stable-"+obj).find("input[name='dontDetele']").val();
                    if(Number(dontDetele) === 1){
                        SweetAlert.swal({
                            title: "此白名单不可删除!",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                });
                SweetAlert.swal({
                    title: "您确定要删除选中的白名单吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var data = {
                            "whiteListIds":ids
                        };
                        policyService.whitelistDelete(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
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
                SweetAlert.swal("您还未选择白名单");
            }
        }
    }
}

//白名单详情--应用
function whitelistDetailApp($rootScope, $state, $stateParams, $uibModal, policyService, CWD, SweetAlert){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/policy/whitelist-app-table.html',
        link: link
    };

    return tableObj;

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            disableToolbarRight: true,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbar_selectAll:true,
            toolbar_operator:true,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'createData', 'display': '添加', 'function': createData},
                {'name': 'deleteBatch', 'display': '删除', 'function': deleteBatch}
            ]
        });

        ctrl.inputShow = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("input[type='text']").show().focus();
        };
        ctrl.inputHide = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("span").show();
        };
        ctrl.dataUpdate = function($event,id){
            var obj = $event.target;
            var fileName = $(obj).parents("tr").find(".fileName").text(),
                fileProductName = $(obj).parents("tr").find(".fileProductName").text(),
                filePath = $(obj).parents("tr").find(".filePath").text();
            var processInfo = [{
                "id":id,
                "fileName":fileName,
                "fileProductName":fileProductName,
                "filePath":filePath
            }];
            var pdata = {
                "processInfo":processInfo
            };
            policyService.whitelistAppUpdate(pdata).then(function(res){
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
        };

        //获取数据列表
        function getAll(params){
            var payload = {};
            var search = params.search.predicateObject;
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            
            return policyService.whitelistApp(payload).then(function(res){
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
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            return policyService.whitelistApp(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#whitelistTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#whitelistTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }else{
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }
        };

        //添加
        function createData(){
            $(".popover").remove();

            var myModalController = function($scope,$uibModalInstance){
                $scope.modalOk = function(){
                    var fileName = $("#myModalBody").find(".fileName").val(),
                        filePath = $("#myModalBody").find(".filePath").val(),
                        fileVersion = $("#myModalBody").find(".fileVersion").val(),
                        fileProductName = $("#myModalBody").find(".fileProductName").val(),
                        fileCertSigner = $("#myModalBody").find(".fileCertSigner").val(),
                        fileMd5 = $("#myModalBody").find(".fileMd5").val();
                    var data = {
                        "fileName":fileName,
                        "filePath":filePath,
                        "fileVersion":fileVersion,
                        "fileProductName":fileProductName,
                        "fileCertSigner":fileCertSigner,
                        "fileMd5":fileMd5
                    };
                    SweetAlert.swal({
                        title: "您确定要添加新的应用程序吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    },function(isConfirm){
                        if(isConfirm){
                            policyService.whitelistAppCreate(data).then(function(res){
                                console.log(res);
                                if(res.status === 200){
                                    SweetAlert.swal({
                                        title: "添加成功!",
                                        type: "success",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                    $scope.modalCancel();
                                    $rootScope.$emit('refreshTable');
                                }else{
                                    SweetAlert.swal({
                                        title: "添加失败!",
                                        type: "error",
                                        text: res.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                }
                            },function(err){
                                console.log(err);
                                SweetAlert.swal({
                                    title: "添加失败!",
                                    type: "error",
                                    text: err.statusText,
                                    confirmButtonColor: "#7B69B3",
                                    confirmButtonText: "确定"
                                });
                            });
                        }   
                    });
                };

                $scope.modalCancel = function(){
                    $uibModalInstance.dismiss('cancel');
                };
            };
            
            $uibModal.open({
              templateUrl: 'myModal.html',
              controller: myModalController
            });
        }

        //批量删除
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
                    title: "您确定要删除选中的应用吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var whiteListInfoId = $stateParams.id;
                        var data = {
                            "whiteListInfoId":Number(whiteListInfoId),
                            "programInfoIds":ids
                        };
                        policyService.whitelistAppDelete(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
                                SweetAlert.swal({
                                    title: "删除成功!",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                for(var i=0;i<ids.length;i++){
                                    $("#stable-"+ids[i]).remove();
                                }
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
                SweetAlert.swal("您还未选择应用");
            }
        }
        
    }
}

//白名单详情--USB
function whitelistDetailUsb($rootScope, $state, $stateParams, $uibModal, policyService, CWD, SweetAlert){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/policy/whitelist-usb-table.html',
        link: link
    };

    return tableObj;

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            disableToolbarRight: true,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbar_selectAll:true,
            toolbar_operator:true,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'createData', 'display': '添加', 'function': createData},
                {'name': 'deleteBatch', 'display': '删除', 'function': deleteBatch}
            ]
        });

        ctrl.inputShow = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("input[type='text']").show().focus();
        };
        ctrl.inputHide = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("span").show();
        };
        ctrl.dataUpdate = function($event,id){
            var obj = $event.target;
            var friendlyName = $(obj).parents("tr").find(".friendlyName").text(),
                deviceDesc = $(obj).parents("tr").find(".deviceDesc").text(),
                hardwareId = $(obj).parents("tr").find(".hardwareId").text(),
                instanceId = $(obj).parents("tr").find(".instanceId").text();
            var processInfo = [{
                "id":id,
                "friendlyName":friendlyName,
                "deviceDesc":deviceDesc,
                "hardwareId":hardwareId,
                "instanceId":instanceId
            }];
            var pdata = {
                "processInfo":processInfo
            };
            policyService.whitelistAppUpdate(pdata).then(function(res){
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
        };

        //获取数据列表
        function getAll(params){
            var payload = {};
            var search = params.search.predicateObject;
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            
            return policyService.whitelistUsb(payload).then(function(res){
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
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            return policyService.whitelistUsb(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#whitelistTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#whitelistTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }else{
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }
        };

        //添加
        function createData(){
            $(".popover").remove();
                
            var myModalController = function($scope,$uibModalInstance){
                $scope.modalOk = function(){
                    var friendlyName = $("#myModalBody").find(".friendlyName").val(),
                        deviceDesc = $("#myModalBody").find(".deviceDesc").val(),
                        hardwareId = $("#myModalBody").find(".hardwareId").val(),
                        instanceId = $("#myModalBody").find(".instanceId").val(),
                        driver = $("#myModalBody").find(".driver").val();
                    var data = {
                        "friendlyName":friendlyName,
                        "deviceDesc":deviceDesc,
                        "hardwareId":hardwareId,
                        "instanceId":instanceId,
                        "driver":driver
                    };
                    SweetAlert.swal({
                        title: "您确定要添加新的USB吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    },function(isConfirm){
                        if(isConfirm){
                            policyService.whitelistUsbCreate(data).then(function(res){
                                console.log(res);
                                if(res.status === 200){
                                    SweetAlert.swal({
                                        title: "添加成功!",
                                        type: "success",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                    $scope.modalCancel();
                                    $rootScope.$emit('refreshTable');
                                }else{
                                    SweetAlert.swal({
                                        title: "添加失败!",
                                        type: "error",
                                        text: res.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                }
                            },function(err){
                                console.log(err);
                                SweetAlert.swal({
                                    title: "添加失败!",
                                    type: "error",
                                    text: err.statusText,
                                    confirmButtonColor: "#7B69B3",
                                    confirmButtonText: "确定"
                                });
                            });
                        }   
                    });
                };

                $scope.modalCancel = function(){
                    $uibModalInstance.dismiss('cancel');
                };
            };
            
            $uibModal.open({
              templateUrl: 'myModal.html',
              controller: myModalController
            });
        }

        //批量删除
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
                    title: "您确定要删除选中的USB吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var whiteListInfoId = $stateParams.id;
                        var data = {
                            "whiteListInfoId":Number(whiteListInfoId),
                            "usbInfoIds":ids
                        };
                        policyService.whitelistUsbDelete(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
                                SweetAlert.swal({
                                    title: "删除成功!",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                for(var i=0;i<ids.length;i++){
                                    $("#stable-"+ids[i]).remove();
                                }
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
                SweetAlert.swal("您还未选择USB");
            }
        }
        
    }
}

//白名单详情--证书
function whitelistDetailCertificate($rootScope, $state, $stateParams, $uibModal, policyService, CWD, SweetAlert){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/policy/whitelist-certificate-table.html',
        link: link
    };

    return tableObj;

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            disableToolbarRight: true,
            numPerPage: 10,
            pipeService: getAll,
            getCount: getCount,
            filter: false,
            toolbar_selectAll:true,
            toolbar_operator:true,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'createData', 'display': '添加', 'function': createData},
                {'name': 'deleteBatch', 'display': '删除', 'function': deleteBatch}
            ]
        });

        ctrl.inputShow = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("input[type='text']").show().focus();
        };
        ctrl.inputHide = function($event){
            var obj = $event.target;
            $(obj).hide().siblings("span").show();
        };
        ctrl.dataUpdate = function($event,id){
            var obj = $event.target;
            var subject = $(obj).parents("tr").find(".subject").text(),
                issuer = $(obj).parents("tr").find(".issuer").text(),
                date = $(obj).parents("tr").find(".date").text();
            var processInfo = [{
                "id":id,
                "subject":subject,
                "issuer":issuer,
                "date":date
            }];
            var pdata = {
                "processInfo":processInfo
            };
            policyService.whitelistAppUpdate(pdata).then(function(res){
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
        };

        //获取数据列表
        function getAll(params){
            var payload = {};
            var search = params.search.predicateObject;
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            
            return policyService.whitelistCertificate(payload).then(function(res){
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
            var id = $stateParams.id;
            if(params){
                payload = {
                    "currentPage":Number(params.pagination.currentPage),
                    "number":Number(params.pagination.number),
                    "whiteListId": Number(id)
                };
                if(search.$){
                    payload.searchAll = search.$;
                }
            }
            return policyService.whitelistCertificate(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#whitelistTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#whitelistTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }
        }
        ctrl.selectInvert = function($event){
            var obj = $event.target;
            var status = $(obj).prop("checked");
            if(status === false){
                $("#whitelistTable").find("input[name='sign']").prop("checked",false);
            }else{
                $("#whitelistTable").find("input[name='sign']").prop("checked",true);
            }
        };

        //添加
        function createData(){
            $(".popover").remove();

            var myModalController = function($scope,$uibModalInstance){
                $scope.modalOk = function(){
                    var subject = $("#myModalBody").find(".subject").val(),
                        issuer = $("#myModalBody").find(".issuer").val(),
                        date = $("#myModalBody").find(".date").val();
                    var data = {
                        "subject":subject,
                        "issuer":issuer,
                        "date":date
                    };
                    SweetAlert.swal({
                        title: "您确定要添加新的应用程序吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    },function(isConfirm){
                        if(isConfirm){
                            policyService.whitelistCertificateCreate(data).then(function(res){
                                console.log(res);
                                if(res.status === 200){
                                    SweetAlert.swal({
                                        title: "添加成功!",
                                        type: "success",
                                        timer: 1000,
                                        showConfirmButton: false
                                    });
                                    $scope.modalCancel();
                                    $rootScope.$emit('refreshTable');
                                }else{
                                    SweetAlert.swal({
                                        title: "添加失败!",
                                        type: "error",
                                        text: res.statusText,
                                        confirmButtonColor: "#7B69B3",
                                        confirmButtonText: "确定"
                                    });
                                }
                            },function(err){
                                console.log(err);
                                SweetAlert.swal({
                                    title: "添加失败!",
                                    type: "error",
                                    text: err.statusText,
                                    confirmButtonColor: "#7B69B3",
                                    confirmButtonText: "确定"
                                });
                            });
                        }   
                    });
                };

                $scope.modalCancel = function(){
                    $uibModalInstance.dismiss('cancel');
                };
            };
            
            $uibModal.open({
              templateUrl: 'myModal.html',
              controller: myModalController
            });
        }

        //批量删除
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
                    title: "您确定要删除选中的证书吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var whiteListInfoId = $stateParams.id;
                        var data = {
                            "whiteListInfoId":Number(whiteListInfoId),
                            "qualificationInfoIds":ids
                        };
                        policyService.whitelistCertificateDelete(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
                                SweetAlert.swal({
                                    title: "删除成功!",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                for(var i=0;i<ids.length;i++){
                                    $("#stable-"+ids[i]).remove();
                                }
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
                SweetAlert.swal("您还未选择证书");
            }
        }
        
    }
}

//安全策略--列表
function safeTable($rootScope, $state, policyService, CWD, SweetAlert){
    var tableObj = {
        scope: true,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/policy/safe-table.html',
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
            toolbar_edit:editSafe,
            toolbar_delete:deleteSafe,
            selectAllOptions: [
                {'name': 'selectAll', 'display': '全选', 'function': selectAll},
                {'name': 'unselectAll', 'display': '取消', 'function': unselectAll},
                {'name': 'selectInvert', 'display': '反选', 'function': selectInvert}
            ],
            operationOptions: [
                {'name': 'deleteBatch', 'display': '删除', 'function': deleteBatch}
            ]
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
                $("#pageCurrent").val(params.pagination.currentPage);
                $("#pageNumber").val(params.pagination.number);
                if(search.$){
                    payload.searchAll = search.$;
                    $("#pageSearch").val(params.search.predicateObject);
                }else{
                    $("#pageSearch").val("");
                }
            }
            
            return policyService.safeList(payload).then(function(res){
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
            return policyService.safeList(payload).then(function(res){
                return res.data.count;
            },function(err){
                console.log(err);
            }); 
        }

        //全选
        function selectAll(){
            $("#selectAllData").prop("checked",true);
            $("#safeTable").find("input[name='sign']").prop("checked",true);
        }
        //取消
        function unselectAll(){
            $("#selectAllData").prop("checked",false);
            $("#safeTable").find("input[name='sign']").prop("checked",false);
        }
        //反选
        function selectInvert(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#selectAllData").prop("checked",true);
                $("#safeTable").find("input[name='sign']").prop("checked",true);
            }else{
                $("#selectAllData").prop("checked",false);
                $("#safeTable").find("input[name='sign']").prop("checked",false);
            }
        }

        //增加功能
        function addData(){
            console.log('增加');
            $state.go('safe-creat');
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
        }

        //修改安全策略
        function editSafe(id){
            $state.go('safe-update',{'id':id});
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

        //删除安全策略
        function deleteSafe(id){
            var dontDetele = $("#stable-"+id).find("input[name='dontDetele']").val();
            if(Number(dontDetele) === 1){
                SweetAlert.swal({
                    title: "此白名单不可删除!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            SweetAlert.swal({
                title: "您确定要删除此安全策略吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var data = {
                        "policyIds":[id]
                    };
                    policyService.safeDelete(data).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
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
        function deleteBatch(){
            var ids = [];
            var signs = $("input[name='sign']");
            $.each(signs,function(key,obj){
                if(obj.checked){
                    var id = obj.value;
                    ids.push(id);
                }
            });
            if(ids.length >= 1){
                $.each(ids,function(key,obj){
                    var dontDetele = $("#stable-"+obj).find("input[name='dontDetele']").val();
                    if(Number(dontDetele) === 1){
                        SweetAlert.swal({
                            title: "此白名单不可删除!",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                });
                SweetAlert.swal({
                    title: "您确定要删除选中的安全策略吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        var data = {
                            "policyIds":ids
                        };
                        policyService.safeDelete(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
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
                SweetAlert.swal("您还未选择安全策略");
            }
        }
    }
}