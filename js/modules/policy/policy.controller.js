/**
 * 企业资源
 *
 * Created by sunbowei on 16-10-10.
 */
export default {
    'whitelistCtrl': /*@ngInject*/whitelistCtrl,
    'whitelistDetailCtrl': /*@ngInject*/whitelistDetailCtrl,
    'whitelistCreateCtrl': /*@ngInject*/whitelistCreateCtrl,
    'whitelistUpdateCtrl': /*@ngInject*/whitelistUpdateCtrl,
    'safeCtrl': /*@ngInject*/safeCtrl,
    'safeCreateCtrl': /*@ngInject*/safeCreateCtrl,
    'safeUpdateCtrl': /*@ngInject*/safeUpdateCtrl,
    'configCtrl': /*@ngInject*/configCtrl
};

//白名单--列表
function whitelistCtrl($rootScope){
	$rootScope.$on('scanWhitelistIng',function(event,data){
		if(data){
			$("#stable-"+data).find(".box-cover").removeClass("box-hide").addClass("box-show");
		}
	});
	$rootScope.$on('scanWhitelistEnd',function(event,data){
		if(data){
			$("#stable-"+data).find(".box-cover").removeClass("box-show").addClass("box-hide");
		}
	});
}

//白名单--详情
function whitelistDetailCtrl($scope,$state,$stateParams){
	var id = $stateParams.id;

	$scope.stabApp = function(){
		$state.go('whitelist-app',{'id':id});
	};
	$scope.stabCertificate = function(){
		$state.go('whitelist-certificate',{'id':id});
	};
	$scope.stabUsb = function(){
		$state.go('whitelist-usb',{'id':id});
	};
}

//白名单--添加
function whitelistCreateCtrl($scope,$state,$uibModal,policyService,SweetAlert,tools){
	$scope.backList = function(){
		$state.go('policy-whitelist');
	};

	$scope.selTerminal = function(){
		var lis = [];
		$("#selTerminalList li").each(function(key,obj){
			var li = {
				"clientId":$(obj).find("input[type='checkbox']").val(),
				"deviceName":$(obj).text(),
				"departmentId":$(obj).data("departmentId")
			};
			lis.push(li);
		});
		var myModalController = function($scope,$uibModalInstance){
			var checkTerminal = function(node){
				if(node && node.linkClientList && node.linkClientList.length > 0){
					var clientIds = [];
		        	$.each(lis,function(key,obj){
		        		clientIds.push(Number(obj.clientId));
		        	});
	        		$.each(node.linkClientList,function(key,obj){
	        			if(tools.inArray(clientIds,obj.clientId)){
		        			obj.isCheck = true;
		        		}else{
		        			delete obj.isCheck;
		        		}
	        		});
				}
        	};
			$scope.treeOptions = {
	            nodeChildren: "departmentSuperList",
	            dirSelectable: true,
	            isLeaf: checkTerminal
	        };
			policyService.departmentStructure({}).then(function(res){
				console.log(res);
                $scope.dataForTheTree = [res.data.data];
	        },function(err){
	        	console.log(err);
	        });
	        $(document).on("click","i.tree-branch-head",function(){
				var treeStatus = $(this).parent().hasClass("tree-expanded");
				if(treeStatus === true){
					$(this).parent().children(".tree-label").children("ul").show();
				}else{
					$(this).parent().children(".tree-label").children("ul").hide();
				}
			});
	        $scope.selDepartment = function($event){
	        	var _this = $event.target;
	        	$(_this).parent().parent().find("li.client-li").each(function(key,obj){
	        		var item = $(obj).data("item");
	        		$scope.selClientId(obj,item,true);
	        	});
	        	$event.stopPropagation();
	        };
	        $scope.selClientId = function($event,item,isParentClick){
	        	var _this;
	        	if(isParentClick){
	        		_this = $event;
	        	}else{
	        		_this = $event.target;
	        		$event.stopPropagation();
	        	}
	        	var clientIds = [];
	        	$.each(lis,function(key,obj){
	        		clientIds.push(Number(obj.clientId));
	        	});
	        	var thisItem;
	        	if(!tools.inArray(clientIds,item.clientId)){
	        		var departmentId = $(_this).data("departmentId");
	        		thisItem = {
	        			"clientId":item.clientId,
	        			"deviceName":item.deviceName,
	        			"departmentId":Number(departmentId)
	        		};
	        		lis.unshift(thisItem);
	        		$(_this).find("input[type='checkbox']").prop("checked",true);
	        	}else{
	        		for(var i=0; i<lis.length; i++) {
	                    if(Number(lis[i].clientId) === item.clientId) {
	                      lis.splice(i, 1);
	                      break;
	                    }
	                }
	        		$(_this).find("input[type='checkbox']").prop("checked",false);
	        	}
	        };
            $scope.modalOk = function(){
                var tArr = lis;
                if(tArr.length <= 0){
                	SweetAlert.swal({
		                title: "至少需要选择一个终端!",
		                type: "warning",
		                confirmButtonColor: "#7B69B3",
		                confirmButtonText: "确定"
		            });
                	return false;
                }
                SweetAlert.swal({
                    title: "您确定添加选中的终端吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                    	var listHtml = "";
                    	$.each(tArr,function(key,obj){
                    		var tVal = obj.clientId,
								tText = obj.deviceName,
								tDepartmentId = obj.departmentId;
							listHtml += '<li><input type="checkbox" value="'+tVal+'" data-departmentId="'+tDepartmentId+'" />'+tText+'</li>';
                    	});
						$("#selTerminalList").html(listHtml);
						SweetAlert.swal({
                            title: "添加成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
						$uibModalInstance.close();
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
	};
	$("#selTerminalList").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeTerminal = function(){
		$("#selTerminalList").find("li.current").remove();
	};

    $scope.submitWhitelist = function(){
		var terminalIds = [];
		$("#selTerminalList li").each(function(key,obj){
			var terminalId = $(obj).find("input[type='checkbox']").val();
			terminalId = Number(terminalId);
			terminalIds.push(terminalId);
		});
		if(terminalIds.length <= 0){
			SweetAlert.swal({
                title: "您还未选择终端!",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
			return false;
		}
		var whitelistType = $("input[name='whitelistType']").val();
		var data = {
            "name":$scope.whitelistName,
            "description":$scope.whitelistDesc,
            "clientIds":terminalIds,
            "scanMethod":Number(whitelistType)
        };
        policyService.checkWhiteListInfo(data).then(function(resCheck){
        	if(resCheck.data.status === 1){
                policyService.whitelistCreate(data).then(function(res){
		            if(res.data !== -1){
		                SweetAlert.swal({
		                    title: "创建成功!",
		                    type: "success",
		                    timer: 1000,
		                    showConfirmButton: false
		                });
		                $state.go('policy-whitelist');
		            }else{
		                console.log(res.statusText);
		                SweetAlert.swal({
		                    title: "创建失败!",
		                    type: "error",
		                    text: res.statusText,
		                    confirmButtonColor: "#7B69B3",
		                    confirmButtonText: "确定"
		                });
		            }   
		        },function(err){
		            SweetAlert.swal({
		                title: "创建失败!",
		                type: "error",
		                text: err.statusText,
		                confirmButtonColor: "#7B69B3",
		                confirmButtonText: "确定"
		            });
		        });
            }else{
                SweetAlert.swal({
                    title: "创建失败!",
                    type: "error",
                    text: resCheck.data.errorMessage,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
            }   
        },function(errCheck){
        	SweetAlert.swal({
                title: "创建失败!",
                type: "error",
                text: errCheck.statusText,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
        });       
	};
}

//白名单--修改
function whitelistUpdateCtrl($scope,$state,$stateParams,$uibModal,policyService,SweetAlert,tools){
	var id = $stateParams.id;
	id = Number(id);

	$scope.backList = function(){
		$state.go('policy-whitelist');
	};

	$scope.selTerminal = function(){
		var lis = [];
		$("#selTerminalList li").each(function(key,obj){
			var li = {
				"clientId":$(obj).find("input[type='checkbox']").val(),
				"deviceName":$(obj).text()
			};
			lis.push(li);
		});
		var myModalController = function($scope,$uibModalInstance){
			var checkTerminal = function(node){
				if(node && node.linkClientList && node.linkClientList.length > 0){
					var clientIds = [];
		        	$.each(lis,function(key,obj){
		        		clientIds.push(Number(obj.clientId));
		        	});
	        		$.each(node.linkClientList,function(key,obj){
	        			if(tools.inArray(clientIds,obj.clientId)){
		        			obj.isCheck = true;
		        		}else{
		        			delete obj.isCheck;
		        		}
	        		});
				}
        	};
			$scope.treeOptions = {
	            nodeChildren: "departmentSuperList",
	            dirSelectable: true,
	            isLeaf: checkTerminal
	        };
			policyService.departmentStructure({}).then(function(res){
				console.log(res);
                $scope.dataForTheTree = [res.data.data];
	        },function(err){
	        	console.log(err);
	        });
	        $(document).on("click","i.tree-branch-head",function(){
				var treeStatus = $(this).parent().hasClass("tree-expanded");
				if(treeStatus === true){
					$(this).parent().children(".tree-label").children("ul").show();
				}else{
					$(this).parent().children(".tree-label").children("ul").hide();
				}
			});
	        $scope.selDepartment = function($event){
	        	var _this = $event.target;
	        	$(_this).parent().parent().find("li.client-li").each(function(key,obj){
	        		var item = $(obj).data("item");
	        		$scope.selClientId(obj,item,true);
	        	});
	        	$event.stopPropagation();
	        };
	        $scope.selClientId = function($event,item,isParentClick){
	        	var _this;
	        	if(isParentClick){
	        		_this = $event;
	        	}else{
	        		_this = $event.target;
	        		$event.stopPropagation();
	        	}
	        	var clientIds = [];
	        	$.each(lis,function(key,obj){
	        		clientIds.push(Number(obj.clientId));
	        	});
	        	var thisItem;
	        	if(!tools.inArray(clientIds,item.clientId)){
	        		thisItem = {
	        			"clientId":item.clientId,
	        			"deviceName":item.deviceName
	        		};
	        		lis.unshift(thisItem);
	        		$(_this).find("input[type='checkbox']").prop("checked",true);
	        	}else{
	        		for(var i=0; i<lis.length; i++) {
	                    if(Number(lis[i].clientId) === item.clientId) {
	                      lis.splice(i, 1);
	                      break;
	                    }
	                }
	        		$(_this).find("input[type='checkbox']").prop("checked",false);
	        	}
	        };
            $scope.modalOk = function(){
                var tArr = lis;
                SweetAlert.swal({
                    title: "您确定添加选中的终端吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                    	var listHtml = "";
                    	$.each(tArr,function(key,obj){
                    		var tVal = obj.clientId,
								tText = obj.deviceName;
							listHtml += '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
                    	});
						$("#selTerminalList").html(listHtml);
						SweetAlert.swal({
                            title: "添加成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
						$uibModalInstance.close();
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
	};
	$("#selTerminalList").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeTerminal = function(){
		$("#selTerminalList").find("li.current").remove();
	};

	policyService.getWhitelistById({"whiteListInfoId":id}).then(function(resWhitelist){
		$scope.whitelistName = resWhitelist.data.name;
		$scope.whitelistDesc = resWhitelist.data.description;
		var terminalListHtml = "";
		$.each(resWhitelist.data.clientInfos,function(key,obj){
			terminalListHtml += '<li><input type="checkbox" value="'+obj.id+'" />'+obj.deviceName+'</li>';
		});
		$("#selTerminalList").append(terminalListHtml);
		$("input[name='whitelistType'][value="+resWhitelist.data.scanMethod+"]").prop("checked",true);

		$scope.submitWhitelist = function(){
			var terminalIds = [];
			$("#selTerminalList li").each(function(key,obj){
				var terminalId = $(obj).find("input[type='checkbox']").val();
				terminalId = Number(terminalId);
				terminalIds.push(terminalId);
			});
			if(terminalIds.length <= 0){
				SweetAlert.swal({
	                title: "您还未选择终端!",
	                type: "warning",
	                confirmButtonColor: "#7B69B3",
	                confirmButtonText: "确定"
	            });
				return false;
			}
			var whitelistType = $("input[name='whitelistType']").val();
			var data = {
				"id":id,
	            "name":$scope.whitelistName,
	            "description":$scope.whitelistDesc,
	            "clientIds":terminalIds,
	            "scanMethod":Number(whitelistType)
	        };
	        policyService.checkWhiteListInfo(data).then(function(resCheck){
	        	if(resCheck.data.status === 1){
	                policyService.whitelistUpdate(data).then(function(res){
			            if(res.data !== -1){
			                SweetAlert.swal({
			                    title: "修改成功!",
			                    type: "success",
			                    timer: 1000,
			                    showConfirmButton: false
			                });
			                $state.go('policy-whitelist');
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
			            SweetAlert.swal({
			                title: "修改失败!",
			                type: "error",
			                text: err.statusText,
			                confirmButtonColor: "#7B69B3",
			                confirmButtonText: "确定"
			            });
			        });
	            }else{
	                SweetAlert.swal({
	                    title: "修改失败!",
	                    type: "error",
	                    text: resCheck.data.errorMessage,
	                    confirmButtonColor: "#7B69B3",
	                    confirmButtonText: "确定"
	                });
	            }   
	        },function(errCheck){
	        	SweetAlert.swal({
	                title: "修改失败!",
	                type: "error",
	                text: errCheck.statusText,
	                confirmButtonColor: "#7B69B3",
	                confirmButtonText: "确定"
	            });
	        });
		};
	},function(errWhitelist){
		console.log(errWhitelist);
	});
}

//安全策略--列表
function safeCtrl($rootScope){
	$rootScope.$on('deployPolicyIng',function(event,data){
		console.log(event);
		if(data){
			$("#stable-"+data).find(".box-cover").removeClass("box-hide").addClass("box-show");
		}
	});
	$rootScope.$on('deployPolicyEnd',function(event,data){
		console.log(event);
		if(data){
			$("#stable-"+data).find(".box-cover").removeClass("box-show").addClass("box-hide");
		}
	});
}

//安全策略--添加
function safeCreateCtrl($scope,$state,$uibModal,policyService,SweetAlert,tools){
	$scope.backList = function(){
		$state.go('policy-safe');
	};

	$scope.addWhitelist = function(){
		var tVal = $('#whitelistAll option:selected').val(),
			tText = $('#whitelistAll option:selected').text();
		var addLi = '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
		var whitelistIds = [];
		$("#selWhitelist li").each(function(key,obj){
			var whitelistId = $(obj).find("input[type='checkbox']").val();
			whitelistId = Number(whitelistId);
			whitelistIds.push(whitelistId);
		});
		if(tools.inArray(whitelistIds,Number(tVal))){
			SweetAlert.swal({
                title: "此白名单已添加",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
		}else{
			$("#selWhitelist").prepend(addLi);
		}
	};
	$("#selWhitelist").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeWhitelist = function(){
		$("#selWhitelist").find("li.current").remove();
	};
	$scope.whitelistOptions = [];
    policyService.getAllWhiteList({}).then(function(res){
        console.log(res);
        $scope.whitelistOptions = res.data;
    },function(err){
        console.log(err);
    });

	$scope.selTerminal = function(){
		var lis = [];
		$("#selTerminalList li").each(function(key,obj){
			var li = {
				"clientId":$(obj).find("input[type='checkbox']").val(),
				"deviceName":$(obj).text()
			};
			lis.push(li);
		});
		var myModalController = function($scope,$uibModalInstance){
			var checkTerminal = function(node){
				if(node && node.linkClientList && node.linkClientList.length > 0){
					var clientIds = [];
		        	$.each(lis,function(key,obj){
		        		clientIds.push(Number(obj.clientId));
		        	});
	        		$.each(node.linkClientList,function(key,obj){
	        			if(tools.inArray(clientIds,obj.clientId)){
		        			obj.isCheck = true;
		        		}else{
		        			delete obj.isCheck;
		        		}
	        		});
				}
        	};
			$scope.treeOptions = {
	            nodeChildren: "departmentSuperList",
	            dirSelectable: true,
	            isLeaf: checkTerminal
	        };
			policyService.departmentStructure({}).then(function(res){
				console.log(res);
                $scope.dataForTheTree = [res.data.data];
	        },function(err){
	        	console.log(err);
	        });
	        $(document).on("click","i.tree-branch-head",function(){
				var treeStatus = $(this).parent().hasClass("tree-expanded");
				if(treeStatus === true){
					$(this).parent().children(".tree-label").children("ul").show();
				}else{
					$(this).parent().children(".tree-label").children("ul").hide();
				}
			});
	        $scope.selDepartment = function($event){
	        	var _this = $event.target;
	        	$(_this).parent().parent().find("li.client-li").each(function(key,obj){
	        		var item = $(obj).data("item");
	        		$scope.selClientId(obj,item,true);
	        	});
	        	$event.stopPropagation();
	        };
	        $scope.selClientId = function($event,item,isParentClick){
	        	var _this;
	        	if(isParentClick){
	        		_this = $event;
	        	}else{
	        		_this = $event.target;
	        		$event.stopPropagation();
	        	}
	        	var clientIds = [];
	        	$.each(lis,function(key,obj){
	        		clientIds.push(Number(obj.clientId));
	        	});
	        	var thisItem;
	        	if(!tools.inArray(clientIds,item.clientId)){
	        		thisItem = {
	        			"clientId":item.clientId,
	        			"deviceName":item.deviceName
	        		};
	        		lis.unshift(thisItem);
	        		$(_this).find("input[type='checkbox']").prop("checked",true);
	        	}else{
	        		for(var i=0; i<lis.length; i++) {
	                    if(Number(lis[i].clientId) === item.clientId) {
	                      lis.splice(i, 1);
	                      break;
	                    }
	                }
	        		$(_this).find("input[type='checkbox']").prop("checked",false);
	        	}
	        };
            $scope.modalOk = function(){
                var tArr = lis;
                SweetAlert.swal({
                    title: "您确定添加选中的终端吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                    	var listHtml = "";
                    	$.each(tArr,function(key,obj){
                    		var tVal = obj.clientId,
								tText = obj.deviceName;
							listHtml += '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
                    	});
						$("#selTerminalList").html(listHtml);
						SweetAlert.swal({
                            title: "添加成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
						$uibModalInstance.close();
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
	};
	$("#selTerminalList").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeTerminal = function(){
		$("#selTerminalList").find("li.current").remove();
	};

	$scope.submitSafe = function(){
		var whitelistIds = [];
		$("#selWhitelist li").each(function(key,obj){
			var whitelistId = $(obj).find("input[type='checkbox']").val();
			whitelistId = Number(whitelistId);
			whitelistIds.push(whitelistId);
		});
		var terminalIds = [];
		$("#selTerminalList li").each(function(key,obj){
			var terminalId = $(obj).find("input[type='checkbox']").val();
			terminalId = Number(terminalId);
			terminalIds.push(terminalId);
		});
		if(terminalIds <= 0){
			SweetAlert.swal({
                title: "请选择终端!",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
		}
		SweetAlert.swal({
            title: "您确定创建新的安全策略吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7B69B3",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },function(isConfirm){
            if(isConfirm){
            	var data = {
		            "name":$scope.safeName,
		            "description":$scope.safeDesc,
		            "whiteListIds":whitelistIds,
		            "clientIds":terminalIds
		        };
		        policyService.safeCreate(data).then(function(res){
		            if(res.data.status === 1){
		                SweetAlert.swal({
		                    title: "创建成功!",
		                    type: "success",
		                    timer: 1000,
		                    showConfirmButton: false
		                });
		                $state.go('policy-safe');
		            }else{
		                SweetAlert.swal({
		                    title: "创建失败!",
		                    type: "error",
		                    text: res.data.errorMessage,
		                    confirmButtonColor: "#7B69B3",
		                    confirmButtonText: "确定"
		                });
		            }   
		        },function(err){
		            SweetAlert.swal({
		                title: "创建失败!",
		                type: "error",
		                text: err.statusText,
		                confirmButtonColor: "#7B69B3",
		                confirmButtonText: "确定"
		            });
		        });
            }
        });
	};
}

//安全策略--修改
function safeUpdateCtrl($scope,$state,$stateParams,$uibModal,policyService,SweetAlert,tools){
	var id = $stateParams.id;
	id = Number(id);

	$scope.backList = function(){
		$state.go('policy-safe');
	};

	$scope.addWhitelist = function(){
		var tVal = $('#whitelistAll option:selected').val(),
			tText = $('#whitelistAll option:selected').text();
		var addLi = '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
		var whitelistIds = [];
		$("#selWhitelist li").each(function(key,obj){
			var whitelistId = $(obj).find("input[type='checkbox']").val();
			whitelistId = Number(whitelistId);
			whitelistIds.push(whitelistId);
		});
		if(tools.inArray(whitelistIds,Number(tVal))){
			SweetAlert.swal({
                title: "此白名单已添加",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
		}else{
			$("#selWhitelist").prepend(addLi);
		}
	};
	$("#selWhitelist").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeWhitelist = function(){
		$("#selWhitelist").find("li.current").remove();
	};
	$scope.whitelistOptions = [];
    policyService.getAllWhiteList({}).then(function(res){
        console.log(res);
        $scope.whitelistOptions = res.data;
    },function(err){
        console.log(err);
    });

	$scope.selTerminal = function(){
		var lis = [];
		$("#selTerminalList li").each(function(key,obj){
			var li = {
				"clientId":$(obj).find("input[type='checkbox']").val(),
				"deviceName":$(obj).text()
			};
			lis.push(li);
		});
		var myModalController = function($scope,$uibModalInstance){
			var checkTerminal = function(node){
				if(node && node.linkClientList && node.linkClientList.length > 0){
					var clientIds = [];
		        	$.each(lis,function(key,obj){
		        		clientIds.push(Number(obj.clientId));
		        	});
	        		$.each(node.linkClientList,function(key,obj){
	        			if(tools.inArray(clientIds,obj.clientId)){
		        			obj.isCheck = true;
		        		}else{
		        			delete obj.isCheck;
		        		}
	        		});
				}
        	};
			$scope.treeOptions = {
	            nodeChildren: "departmentSuperList",
	            dirSelectable: true,
	            isLeaf: checkTerminal
	        };
			policyService.departmentStructure({}).then(function(res){
				console.log(res);
                $scope.dataForTheTree = [res.data.data];
	        },function(err){
	        	console.log(err);
	        });
	        $(document).on("click","i.tree-branch-head",function(){
				var treeStatus = $(this).parent().hasClass("tree-expanded");
				if(treeStatus === true){
					$(this).parent().children(".tree-label").children("ul").show();
				}else{
					$(this).parent().children(".tree-label").children("ul").hide();
				}
			});
	        $scope.selDepartment = function($event){
	        	var _this = $event.target;
	        	$(_this).parent().parent().find("li.client-li").each(function(key,obj){
	        		var item = $(obj).data("item");
	        		$scope.selClientId(obj,item,true);
	        	});
	        	$event.stopPropagation();
	        };
	        $scope.selClientId = function($event,item,isParentClick){
	        	var _this;
	        	if(isParentClick){
	        		_this = $event;
	        	}else{
	        		_this = $event.target;
	        		$event.stopPropagation();
	        	}
	        	var clientIds = [];
	        	$.each(lis,function(key,obj){
	        		clientIds.push(Number(obj.clientId));
	        	});
	        	var thisItem;
	        	if(!tools.inArray(clientIds,item.clientId)){
	        		thisItem = {
	        			"clientId":item.clientId,
	        			"deviceName":item.deviceName
	        		};
	        		lis.unshift(thisItem);
	        		$(_this).find("input[type='checkbox']").prop("checked",true);
	        	}else{
	        		for(var i=0; i<lis.length; i++) {
	                    if(Number(lis[i].clientId) === item.clientId) {
	                      lis.splice(i, 1);
	                      break;
	                    }
	                }
	        		$(_this).find("input[type='checkbox']").prop("checked",false);
	        	}
	        };
            $scope.modalOk = function(){
                var tArr = lis;
                SweetAlert.swal({
                    title: "您确定添加选中的终端吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                    	var listHtml = "";
                    	$.each(tArr,function(key,obj){
                    		var tVal = obj.clientId,
								tText = obj.deviceName;
							listHtml += '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
                    	});
						$("#selTerminalList").html(listHtml);
						SweetAlert.swal({
                            title: "添加成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
						$uibModalInstance.close();
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
	};
	$("#selTerminalList").on("click","li",function(){
		if($(this).hasClass("current")){
			$(this).removeClass("current");
		}else{
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	$scope.removeTerminal = function(){
		$("#selTerminalList").find("li.current").remove();
	};

    policyService.getSafeById({"policyId":id}).then(function(resSafe){
    	console.log(resSafe);
    	$scope.safeName = resSafe.data.name;
		$scope.safeDesc = resSafe.data.description;
		var whiteList = "";
		if(resSafe.data.policyWhiteLists){
			$.each(resSafe.data.policyWhiteLists,function(key,obj){
				whiteList += '<li><input type="checkbox" value="'+obj.id+'" />'+obj.name+'</li>';
			});
		}
		$("#selWhitelist").html(whiteList);
		var listHtml = "";
		if(resSafe.data.policyClients){
			$.each(resSafe.data.policyClients,function(key,obj){
				listHtml += '<li><input type="checkbox" value="'+obj.id+'" />'+obj.deviceName+'</li>';
			});
		}
		$("#selTerminalList").html(listHtml);

		$scope.submitSafe = function(){
			var whitelistIds = [];
			$("#selWhitelist li").each(function(key,obj){
				var whitelistId = $(obj).find("input[type='checkbox']").val();
				whitelistId = Number(whitelistId);
				whitelistIds.push(whitelistId);
			});
			var terminalIds = [];
			$("#selTerminalList li").each(function(key,obj){
				var terminalId = $(obj).find("input[type='checkbox']").val();
				terminalId = Number(terminalId);
				terminalIds.push(terminalId);
			});
			if(terminalIds <= 0){
				SweetAlert.swal({
	                title: "请选择终端!",
	                type: "warning",
	                confirmButtonColor: "#7B69B3",
	                confirmButtonText: "确定"
	            });
	            return false;
			}
			SweetAlert.swal({
	            title: "您确定修改安全策略吗？",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#7B69B3",
	            confirmButtonText: "确定",
	            cancelButtonText: "取消",
	            closeOnConfirm: false
	        },function(isConfirm){
	            if(isConfirm){
	            	var data = {
	            		"id":id,
	            		"name":$scope.safeName,
			            "description":$scope.safeDesc,
			            "whiteListIds":whitelistIds,
			            "clientIds":terminalIds
			        };
			        policyService.safeUpdate(data).then(function(res){
			            if(res.data.status === 1){
			                SweetAlert.swal({
			                    title: "修改成功!",
			                    type: "success",
			                    timer: 1000,
			                    showConfirmButton: false
			                });
			                $state.go('policy-safe');
			            }else{
			                SweetAlert.swal({
			                    title: "修改失败!",
			                    type: "error",
			                    text: res.data.errorMessage,
			                    confirmButtonColor: "#7B69B3",
			                    confirmButtonText: "确定"
			                });
			            }   
			        },function(err){
			            SweetAlert.swal({
			                title: "修改失败!",
			                type: "error",
			                text: err.statusText,
			                confirmButtonColor: "#7B69B3",
			                confirmButtonText: "确定"
			            });
			        });
	            }
	        });
		};
    },function(errSafe){
    	console.log(errSafe);
    });
}

//基本配置
function configCtrl($scope,$state,SweetAlert,policyService){
	$scope.stabClient = function(){
		$state.go('policy-config');
	};
	$scope.stabTerminal = function(){
		$state.go('config-terminal');
	};
	$scope.stabWhitelist = function(){
		$state.go('config-whitelist');
	};

	//控制自动保护
	$scope.autoProtect = function(){
		var status = $("#btn-wl-01").prop("checked");
		if(status === false){
			$("#all-protect").find("input.btn-on").prop("checked",true);
			$("#btn-wl-01").prop("checked",true);
		}else{
			$("#all-protect").find("input.btn-on").prop("checked",false);
			$("input[name='workMode']").prop("checked",false);
			$("#work-mode-2").prop("checked",true);
			$("#btn-wl-01").prop("checked",false);
		}
	};

	policyService.getAllSystemSet({}).then(function(resWhitelist){
		console.log(resWhitelist);
		if(resWhitelist.data[0].setValue==="1"){$("#btn-wl-01").prop("checked",true);}
		if(resWhitelist.data[1].setValue==="1"){$("#btn-wl-02").prop("checked",true);}
		if(resWhitelist.data[2].setValue==="1"){$("#btn-wl-03").prop("checked",true);}
		if(resWhitelist.data[3].setValue==="1"){$("#btn-wl-04").prop("checked",true);}
		if(resWhitelist.data[4].setValue==="1"){$("#btn-wl-05").prop("checked",true);}
		if(resWhitelist.data[5].setValue==="1"){$("#btn-wl-06").prop("checked",true);}
		var workModeVal = resWhitelist.data[6].setValue;
		$("input[name='workMode']").prop("checked",false);
		$("#work-mode-"+workModeVal).prop("checked",true);

		//提交白名单管理
		$scope.submitWhitelist = function(){
			var autoProtect,appProtect,peripheralProtect,
				integrityProtect,selfProtect,certificate,workMode;
			var btn01 = $("#btn-wl-01").prop("checked"),
				btn02 = $("#btn-wl-02").prop("checked"),
				btn03 = $("#btn-wl-03").prop("checked"),
				btn04 = $("#btn-wl-04").prop("checked"),
				btn05 = $("#btn-wl-05").prop("checked"),
				btn06 = $("#btn-wl-06").prop("checked");
			if(btn01 === true){autoProtect = 1;}else{autoProtect = 0;}
			if(btn02 === true){appProtect = 1;}else{appProtect = 0;}
			if(btn03 === true){peripheralProtect = 1;}else{peripheralProtect = 0;}
			if(btn04 === true){integrityProtect = 1;}else{integrityProtect = 0;}
			if(btn05 === true){selfProtect = 1;}else{selfProtect = 0;}
			if(btn06 === true){certificate = 1;}else{certificate = 0;}
			workMode = $("input[name='workMode']:checked").val();
			var data = [
				{
					"id":resWhitelist.data[0].id,
					"setType":0,
					"setValue":autoProtect+""
				},
				{
					"id":resWhitelist.data[1].id,
					"setType":1,
					"setValue":appProtect+""
				},
				{
					"id":resWhitelist.data[2].id,
					"setType":2,
					"setValue":peripheralProtect+""
				},
				{
					"id":resWhitelist.data[3].id,
					"setType":3,
					"setValue":integrityProtect+""
				},
				{
					"id":resWhitelist.data[4].id,
					"setType":4,
					"setValue":selfProtect+""
				},
				{
					"id":resWhitelist.data[5].id,
					"setType":5,
					"setValue":certificate+""
				},
				{
					"id":resWhitelist.data[6].id,
					"setType":6,
					"setValue":workMode
				}
			];
			SweetAlert.swal({
	            title: "您确定保存设置吗？",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#7B69B3",
	            confirmButtonText: "确定",
	            cancelButtonText: "取消",
	            closeOnConfirm: false
	        },function(isConfirm){
	            if(isConfirm){
			        policyService.saveSystemSet(data).then(function(res){
			            if(res.data.status === 1){
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
			                    text: res.data.errorMessage,
			                    confirmButtonColor: "#7B69B3",
			                    confirmButtonText: "确定"
			                });
			            }   
			        },function(err){
			            SweetAlert.swal({
			                title: "保存失败!",
			                type: "error",
			                text: err.statusText,
			                confirmButtonColor: "#7B69B3",
			                confirmButtonText: "确定"
			            });
			        });
	            }
	        });
		};
	},function(errWhitelist){
		console.log(errWhitelist);
	});
}