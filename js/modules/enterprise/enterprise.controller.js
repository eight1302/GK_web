/**
 * 企业资源
 *
 * Created by sunbowei on 16-10-10.
 */
export default {
    'terminalListCtrl': /*@ngInject*/terminalListCtrl,
    'terminalDetailCtrl' : /*@ngInject*/terminalDetailCtrl,
    'terminalCreateCtrl' : /*@ngInject*/terminalCreateCtrl,
    'terminalEditCtrl' : /*@ngInject*/terminalEditCtrl,
    'terminalSoftwareEditCtrl': /*@ngInject*/terminalSoftwareEditCtrl,
    'departmentCtrl' : /*@ngInject*/departmentCtrl,
    'departmentCreateCtrl' : /*@ngInject*/departmentCreateCtrl,
    'departmentEditCtrl' : /*@ngInject*/departmentEditCtrl,
	'labelCtrl' : /*@ngInject*/labelCtrl,
	'labelcreateCtrl' : /*@ngInject*/labelcreateCtrl,
	'labelEditCtrl' : /*@ngInject*/labelEditCtrl,
	'departmentTopologyCtrl': /*@ngInject*/departmentTopologyCtrl
};

//终端列表
function terminalListCtrl($rootScope,tools){
	$rootScope.$on('newClientUpdate',function(event,data){
		console.log(event);
		console.log(data);
		$rootScope.$broadcast('refreshTable');
	});
	$rootScope.$on('newClientOnline',function(event,data){
		if(data){
			var nodes = data.split(",");
			if(nodes.length > 0){
				for(var i=0;i<nodes.length;i++){
					$(".stable-plain-child-"+nodes[i]).find(".is-online").text("在线");
					$(".stable-plain-child-"+nodes[i]).find("dl").attr("class","current");
				}	
			}	
		}
	});
	$rootScope.$on('newClientOffline',function(event,data){
		if(data){
			var nodes = data.split(",");
			if(nodes.length > 0){
				for(var i=0;i<nodes.length;i++){
					$(".stable-plain-child-"+nodes[i]).find(".is-online").text("离线");
					$(".stable-plain-child-"+nodes[i]).find("dl").removeAttr("class");
				}	
			}	
		}
	});
	$rootScope.$on('newClientUninstall',function(event,data){
		if(data){
			if(data.status === 1){
				$(".stable-plain-child-"+data.data).find(".is-online").text("离线");
				$(".stable-plain-child-"+data.data).find(".stable-ifInstall").text("已卸载");
				$(".stable-plain-child-"+data.data).find("dl").removeAttr("class");
			}else{
				$(".stable-plain-child-"+data.data).find(".stable-ifInstall").text("卸载失败，"+data.errorMessage);
			}
			var listUninstall = window.localStorage.getItem("terminal-list-uninstall");
            listUninstall = listUninstall.split(",");
            var id = $(".stable-plain-child-"+data.data).find("input[name='sign']").val();
            tools.removeByArray(listUninstall,id);
			$(".stable-plain-child-"+data.data).find(".box-cover").removeClass("box-show").addClass("box-hide");
		}
	});
}

//终端详情
function terminalDetailCtrl($scope,$state,$stateParams,enterpriseService,SweetAlert){
	var clientId = $stateParams.id;
	//硬件信息的二级菜单
	var params = {
		"clientId":clientId
	};
	enterpriseService.terminalHardware(params).then(function(res){
		console.log(res);
		var hardwareData = {};
		//硬件资产数据表数据pci等,相似的写在tool,对硬件资产进行包装.
		hardwareData.summary=res.data.summaryInfo;     		//概述object
		hardwareData.mainboard=res.data.mainboardInfo; 		//主板object
		hardwareData.cpu=res.data.cpuInfo;  		//处理器object
		hardwareData.hardDisk=res.data.hardDiskInfo;    		//硬盘array
		hardwareData.memory=res.data.memoryInfo;        		//内存array
		hardwareData.videocard=res.data.videocardInfo;  		//x显卡array
		hardwareData.screen=res.data.screenInfo;         		//显示器array
		hardwareData.otherDevice=res.data.otherDeviceInfo; 	//其他设备array
		hardwareData.pci = res.data.pciInfo;             		//pci设备array
		hardwareData.usb = res.data.usbInfo;             		//usb设备array

		$scope.hardwareData = hardwareData;
		$scope.hardwareType = 1;
	},function(err){
		console.log(err);
	});

	$scope.hardwareInputShow = function($event){
		var obj = $event.target;
		$(obj).hide().siblings("input[type='text']").show().focus();
	};
	$scope.hardwareInputHide = function($event){
		var obj = $event.target;
		$(obj).hide().siblings("span").show();
	};

	$scope.hardwareHref = function($event,num){
		var obj = $event.target;
		$(obj).parent().find("li").removeClass("active");
		$(obj).addClass("active");
		$scope.hardwareType = num;
	};

	$scope.hardwareSubmit = function(){
		var summaryType = $("#summaryType").text(),
			summaryOs = $("#summaryOs").text(),
			summaryCpu = $("#summaryCpu").text(),
			summaryMainboard = $("#summaryMainboard").text(),
			summaryVideo = $("#summaryVideo").text(),
			summaryMemory = $("#summaryMemory").text(),
			summaryHard = $("#summaryHard").text(),
			summaryCdrom = $("#summaryCdrom").text(),
			summaryAudio = $("#summaryAudio").text(),
			summaryNetcard = $("#summaryNetcard").text();
		var mainboardBoardType = $("#mainboardBoardType").text(),
			mainboardChips = $("#mainboardChips").text(),
			mainboardSn = $("#mainboardSn").text(),
			mainboardVer = $("#mainboardVer").text(),
			mainboardBios = $("#mainboardBios").text();
		var cpuName = $("#cpuName").text(),
			cpuSpeed = $("#cpuSpeed").text(),
			cpuNum = $("#cpuNum").text(),
			cpuArt = $("#cpuArt").text(),
			cpuSlotSocket = $("#cpuSlotSocket").text(),
			cpuL1cache = $("#cpuL1cache").text(),
			cpuL2cache = $("#cpuL2cache").text(),
			cpuL3cache = $("#cpuL3cache").text(),
			cpuSign = $("#cpuSign").text();
		var summaryInfo = {
			"id":Number(clientId),
			"type":summaryType,
			"os":summaryOs,
			"cpu":summaryCpu,
			"mainboard":summaryMainboard,
			"video":summaryVideo,
			"memory":summaryMemory,
			"hard":summaryHard,
			"cdrom":summaryCdrom,
			"audio":summaryAudio,
			"netcard":summaryNetcard
		};
		var mainboardInfo = {
			"id":Number(clientId),
			"boardType":mainboardBoardType,
			"chips":mainboardChips,
			"sn":mainboardSn,
			"ver":mainboardVer,
			"bios":mainboardBios
		};
		var cpuInfo = {
			"id":Number(clientId),
			"name":cpuName,
			"speed":cpuSpeed,
			"num":cpuNum,
			"art":cpuArt,
			"slotSocket":cpuSlotSocket,
			"l1cache":cpuL1cache,
			"l2cache":cpuL2cache,
			"l3cache":cpuL3cache,
			"sign":cpuSign
		};
		var hardDiskInfo = [];
		$("#hardDisk .info-group").each(function(key,obj){
			var hardDiskProduct = $(obj).find(".hardDiskProduct").text(),
				hardDiskSize = $(obj).find(".hardDiskSize").text(),
				hardDiskSpeed = $(obj).find(".hardDiskSpeed").text(),
				hardDiskCache = $(obj).find(".hardDiskCache").text(),
				hardDiskUsedInfo = $(obj).find(".hardDiskUsedInfo").text(),
				hardDiskFirmware = $(obj).find(".hardDiskFirmware").text(),
				hardDiskHInterface = $(obj).find(".hardDiskHInterface").text(),
				hardDiskDataRate = $(obj).find(".hardDiskDataRate").text(),
				hardDiskFeature = $(obj).find(".hardDiskFeature").text(),
				hardDiskSn = $(obj).find(".hardDiskSn").text();
			var item = {
				"id":Number(clientId),
				"product":hardDiskProduct,
				"size":hardDiskSize,
				"speed":hardDiskSpeed,
				"cache":hardDiskCache,
				"usedInfo":hardDiskUsedInfo,
				"firmware":hardDiskFirmware,
				"hInterface":hardDiskHInterface,
				"dataRate":hardDiskDataRate,
				"feature":hardDiskFeature,
				"sn":hardDiskSn
			};
			hardDiskInfo.push(item);
		});
		var memoryInfo = [];
		$("#memory .info-group").each(function(key,obj){
			var memoryDIMM = $(obj).find(".memoryDIMM").text(),
				memoryProductionDate = $(obj).find(".memoryProductionDate").text(),
				memoryModel = $(obj).find(".memoryModel").text(),
				memorySn = $(obj).find(".memorySn").text(),
				memoryManufacturer = $(obj).find(".memoryManufacturer").text(),
				memoryModuleWidth = $(obj).find(".memoryModuleWidth").text(),
				memoryModuleVoltage = $(obj).find(".memoryModuleVoltage").text();
			var item = {
				"id":Number(clientId),
				"DIMM":memoryDIMM,
				"productionDate":memoryProductionDate,
				"model":memoryModel,
				"sn":memorySn,
				"manufacturer":memoryManufacturer,
				"moduleWidth":memoryModuleWidth,
				"moduleVoltage":memoryModuleVoltage
			};
			memoryInfo.push(item);
		});
		var videocardInfo = [];
		$("#videocard .info-group").each(function(key,obj){
			var videocardVideoCard = $(obj).find(".videocardVideoCard").text(),
				videocardVideoMemory = $(obj).find(".videocardVideoMemory").text(),
				videocardManufacturer = $(obj).find(".videocardManufacturer").text(),
				videocardDriveVersion = $(obj).find(".videocardDriveVersion").text(),
				videocardDriveDate = $(obj).find(".videocardDriveDate").text();
			var item = {
				"id":Number(clientId),
				"videoCard":videocardVideoCard,
				"videoMemory":videocardVideoMemory,
				"manufacturer":videocardManufacturer,
				"driveVersion":videocardDriveVersion,
				"driveDate":videocardDriveDate
			};
			videocardInfo.push(item);
		});
		var screenInfo = [];
		$("#screen .info-group").each(function(key,obj){
			var screenProduct = $(obj).find(".screenProduct").text(),
				screenManufacturer = $(obj).find(".screenManufacturer").text(),
				screenFirmwareDate = $(obj).find(".screenFirmwareDate").text(),
				screenScreenSize = $(obj).find(".screenScreenSize").text(),
				screenDisplayScale = $(obj).find(".screenDisplayScale").text(),
				screenResolution = $(obj).find(".screenResolution").text(),
				screenGamma = $(obj).find(".screenGamma").text(),
				screenPowerManagement = $(obj).find(".screenPowerManagement").text(),
				screenMaxResolution = $(obj).find(".screenMaxResolution").text();
			var item = {
				"id":Number(clientId),
				"product":screenProduct,
				"manufacturer":screenManufacturer,
				"firmwareDate":screenFirmwareDate,
				"screenSize":screenScreenSize,
				"displayScale":screenDisplayScale,
				"resolution":screenResolution,
				"gamma":screenGamma,
				"powerManagement":screenPowerManagement,
				"maxResolution":screenMaxResolution
			};
			screenInfo.push(item);
		});
		var otherDeviceInfo = [];
		$("#otherDevice .info-group").each(function(key,obj){
			var otherDeviceProduct = $(obj).find(".otherDeviceProduct").text(),
				otherDeviceCache = $(obj).find(".otherDeviceCache").text(),
				otherDeviceNetcard = $(obj).find(".otherDeviceNetcard").text(),
				otherDeviceManufacturer = $(obj).find(".otherDeviceManufacturer").text(),
				otherDeviceWirelessNetcard = $(obj).find(".otherDeviceWirelessNetcard").text(),
				otherDeviceSoundCard = $(obj).find(".otherDeviceSoundCard").text(),
				otherDeviceKeyboard = $(obj).find(".otherDeviceKeyboard").text(),
				otherDeviceMouse = $(obj).find(".otherDeviceMouse").text(),
				otherDeviceCamera = $(obj).find(".otherDeviceCamera").text();
			var item = {
				"id":Number(clientId),
				"product":otherDeviceProduct,
				"cache":otherDeviceCache,
				"netcard":otherDeviceNetcard,
				"manufacturer":otherDeviceManufacturer,
				"wirelessNetcard":otherDeviceWirelessNetcard,
				"soundCard":otherDeviceSoundCard,
				"keyboard":otherDeviceKeyboard,
				"mouse":otherDeviceMouse,
				"camera":otherDeviceCamera
			};
			otherDeviceInfo.push(item);
		});
		var pciInfo = [];
		$("#pci .info-group").each(function(key,obj){
			var pciDevice = $(obj).find(".pciDevice").text(),
				pciDeviceId = $(obj).find(".pciDeviceId").text(),
				pciManufacturer = $(obj).find(".pciManufacturer").text(),
				pciManufacturerId = $(obj).find(".pciManufacturerId").text(),
				pciCategory = $(obj).find(".pciCategory").text(),
				pciSubManufacturer = $(obj).find(".pciSubManufacturer").text(),
				pciSubSystemId = $(obj).find(".pciSubSystemId").text();
			var item = {
				"id":Number(clientId),
				"device":pciDevice,
				"deviceId":pciDeviceId,
				"manufacturer":pciManufacturer,
				"manufacturerId":pciManufacturerId,
				"category":pciCategory,
				"subManufacturer":pciSubManufacturer,
				"subSystemId":pciSubSystemId
			};
			pciInfo.push(item);
		});
		var usbInfo = [];
		$("#usb .info-group").each(function(key,obj){
			var usbDescription = $(obj).find(".usbDescription").text(),
				usbManufacturerId = $(obj).find(".usbManufacturerId").text(),
				usbDeviceCode = $(obj).find(".usbDeviceCode").text(),
				usbCategory = $(obj).find(".usbCategory").text(),
				usbDevice = $(obj).find(".usbDevice").text(),
				usbSn = $(obj).find(".usbSn").text(),
				usbVer = $(obj).find(".usbVer").text();
			var item = {
				"id":Number(clientId),
				"description":usbDescription,
				"manufacturerId":usbManufacturerId,
				"deviceCode":usbDeviceCode,
				"category":usbCategory,
				"device":usbDevice,
				"sn":usbSn,
				"ver":usbVer
			};
			usbInfo.push(item);
		});
		var data = {
			"summaryInfo":summaryInfo,
			"mainboardInfo":mainboardInfo,
			"cpuInfo":cpuInfo,
			"hardDiskInfo":hardDiskInfo,
			"memoryInfo":memoryInfo,
			"videocardInfo":videocardInfo,
			"screenInfo":screenInfo,
			"otherDeviceInfo":otherDeviceInfo,
			"pciInfo":pciInfo,
			"usbInfo":usbInfo
		};
		enterpriseService.terminalUpdateHdInfo(data).then(function(res){
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

	$scope.stabHardware = function(){
		$state.go('terminal-hardware',{'id':clientId});
	};
	$scope.stabSoftware = function(){
		$state.go('terminal-software',{'id':clientId});
	};
}

//修改软件资产
function terminalSoftwareEditCtrl($scope,$stateParams){
	var id = $stateParams.id,
		type = $stateParams.type;
	console.log(id);
	$scope.softwareType = type;
}

//添加终端信息
function terminalCreateCtrl($scope,$state,enterpriseService,SweetAlert){
	$(".input-feedback").on("blur",function(){
		var val = $(this).val();
		if(val === ''){
			$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
		}else{
			$(this).parent().removeClass('has-warning').find('span').text('');
		}
	});

	//新建部门获取上级部门接口
	$scope.department = [];
	enterpriseService.departmentAll({}).then(function(res){
		console.log(res);
		$scope.department = res.data.data;
	},function(err){
		console.log(err);
	});

	$scope.submitTerminalInfo = function(){
		var departmentId=$("#departmentId").val(),
			ip = $("#ip").val(),
    		mac = $("#mac").val(),
    		sn = $("#sn").val(),
    		ver = $("#ver").val(),
    		deviceName = $("#deviceName").val(),
    		os = $("#os").val();
		if(ip === '' || mac === '' || sn === '' || ver === '' || deviceName === '' || os === ''){
			SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
			return false;
		}
		SweetAlert.swal({
			title: "",
            text: "您确定要添加终端吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7B69B3",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },function(isConfirm){
            if(isConfirm){
				var data = {
					"departmentId":Number(departmentId),
					"ip":ip,
					"mac":mac,
					"sn":sn,
					"ver":ver,
					"deviceName":deviceName,
					"os":os
				};
				enterpriseService.addTerminalData(data).then(function(res){
					console.log(res);
					if(res.data === true){
						SweetAlert.swal({
				            title: "创建成功!",
				            type: "success",
				            timer: 1000,
				            showConfirmButton: false
				        });
				        $state.go('terminal-list');
					}else{
						SweetAlert.swal({
				            title: "创建失败!",
				            type: "error",
				            text: res.statusText,
				            confirmButtonColor: "#7B69B3",
				            confirmButtonText: "确定"
				        });
					}	
				},function(err){
					console.log(err);
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

//修改终端信息
function terminalEditCtrl($stateParams,$state,$scope,enterpriseService,SweetAlert){
	var clientId = $stateParams.id;

	//硬件信息的二级菜单
	var params = {
		"clientId":clientId
	};
	enterpriseService.terminalHardware(params).then(function(res){
		console.log(res);
		var hardwareData = {};
		//硬件资产数据表数据pci等,相似的写在tool,对硬件资产进行包装.
		hardwareData.summary=res.data.summaryInfo;     		//概述object
		hardwareData.mainboard=res.data.mainboardInfo; 		//主板object
		hardwareData.cpu=res.data.cpuInfo;  		//处理器object
		hardwareData.hardDisk=res.data.hardDiskInfo;    		//硬盘array
		hardwareData.memory=res.data.memoryInfo;        		//内存array
		hardwareData.videocard=res.data.videocardInfo;  		//x显卡array
		hardwareData.screen=res.data.screenInfo;         		//显示器array
		hardwareData.otherDevice=res.data.otherDeviceInfo; 	//其他设备array
		hardwareData.pci = res.data.pciInfo;             		//pci设备array
		hardwareData.usb = res.data.usbInfo;             		//usb设备array

		$scope.hardwareData = hardwareData;
		$scope.hardwareType = 1;
	},function(err){
		console.log(err);
	});
	$scope.hardwareHref = function($event,num){
		var obj = $event.target;
		$(obj).parent().find("li").removeClass("active");
		$(obj).addClass("active");
		$scope.hardwareType = num;
	};

	$(".input-feedback").on("blur",function(){
		var val = $(this).val();
		if(val === ''){
			$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
		}else{
			$(this).parent().removeClass('has-warning').find('span').text('');
		}
	});

	var paramsInfo = {
		"clientId":clientId
	};
	enterpriseService.queryTerminalById(paramsInfo).then(function(res){
		console.log(res);
		$("#departmentName").val(res.data.departmentName);
		$("#liable").val(res.data.personLiable);
		$("#ip").val(res.data.ip);
		$("#mac").val(res.data.mac);
		$("#sn").val(res.data.sn);
		$("#os").val(res.data.os);
		$("#ver").val(res.data.ver);
		$("#hd").val(res.data.hd);
	},function(err){
		console.log(err);
	});
	$scope.submitTerminalInfo = function(){
		var personLiable = $("#liable").val(),
			ip = $("#ip").val(),
    		mac = $("#mac").val(),
    		sn = $("#sn").val(),
    		os = $("#os").val(),
    		ver = $("#ver").val(),
    		hd = $("#hd").val();
		if(personLiable === '' || ip === '' || mac === '' || sn === '' || ver === '' || os === '' || hd === ''){
			SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
			return false;
		}
		SweetAlert.swal({
            title: "您确定要修改此终端吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },function(isConfirm){
            if(isConfirm){            	
				var submitData = {
					"id":clientId,
					"personLiable":personLiable,
					"ip":ip,
					"mac":mac,
					"sn":sn,
					"os":os,
					"ver":ver,
					"hd":hd
				};
				enterpriseService.updateTerminalData(submitData).then(function(res){
					console.log(res);
					if(res.status === 200){
						SweetAlert.swal({
				            title: "修改成功!",
				            type: "success",
				            timer: 1000,
				            showConfirmButton: false
				        });
				        $state.go('terminal-list');
					}else{
						SweetAlert.swal({
				            title: "修改失败!",
				            type: "error",
				            text: res.statusText,
				            confirmButtonText: "确定"
				        });
					}
				},function(err){
					console.log(err);
					SweetAlert.swal({
			            title: "修改失败!",
			            type: "error",
			            text: err.statusText,
			            confirmButtonText: "确定"
			        });
				});
            }   
        });
	};
}

//部门信息列表
function departmentCtrl(){

}

//添加部门信息
function departmentCreateCtrl($scope,$state,enterpriseService,SweetAlert) {
    $(".input-feedback").on("blur", function () {
        var val = $(this).val();
        if (val === '') {
            $(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
        } else {
            $(this).parent().removeClass('has-warning').find('span').text('');
        }
    });

	//新建部门获取上级部门接口
	$scope.department = [];
	enterpriseService.departmentAll({}).then(function(res){
		console.log(res);
		$scope.department = res.data.data;
	},function(err){
		console.log(err);
	});


	//安全策略列表接口
	$scope.policys = [];
	enterpriseService.getAllPolicy({}).then(function(Polres){
		console.log(Polres);
		$scope.policys=Polres.data;
	},function(err){
		console.log(err);
	});

    $scope.submitdepartmentadd = function () {
        var departmentName = $("#departmentName").val(),
			parentId = $("#parentId").val(),
			policyId = $("#policyId").val(),
			inheritUp = $("#inheritUp").prop("checked"),
			inheritDow = $("#inheritDow").prop("checked"),
			address = $("#address").val(),
			description=$("#description").val();

        if (departmentName === '' || parentId === '' || policyId === '') {
            SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
            return false;
        }

        if (inheritUp === true) {
			inheritUp="1";
        } else {
			inheritUp="0";
        }
        if (inheritDow === true) {
			inheritDow="1";
        } else {
			inheritDow="0";
        }
        SweetAlert.swal({
            title: "",
            text: "您确定要添加部门吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function (isConfirm) {
            if (isConfirm) {
                var data = {
					"departmentName": departmentName,
                    "parentId": parentId,
                    "policyId": policyId,
                    "address": address,
					"description": description,
                    "inheritUp": inheritUp,
					"inheritDow": inheritDow
                };
                enterpriseService.addDepartmentData(data).then(function (res) {
                    console.log(res);
                    if (res.data.stat === 1) {
                        SweetAlert.swal({
                            title: "创建成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
                        $state.go('enterprise-department');
                    } else if(res.data.stat === -5){
                        SweetAlert.swal({
                            title: "创建失败,超过规定部门等级数!",
                            type: "error",
                            text: res.statusText,
                            confirmButtonText: "确定"
                        });
                    }else{
						SweetAlert.swal({
							title: "创建失败!",
							type: "error",
							text: res.statusText,
							confirmButtonText: "确定"
						});					}
                }, function (err) {
                    console.log(err);
                    SweetAlert.swal({
                        title: "创建失败!",
                        type: "error",
                        text: err.statusText,
                        confirmButtonText: "确定"
                    });
                });
            }
        });
    };
}

//修改部门信息
function departmentEditCtrl($stateParams,$state,$scope,enterpriseService,SweetAlert){
    var departmentid =  Number($stateParams.id);


    $(".input-feedback").on("blur",function(){
        var val = $(this).val();
        if(val === ''){
            $(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
        }else{
            $(this).parent().removeClass('has-warning').find('span').text('');
        }
    });

    var paramsInfo = {
        "id":departmentid
    };

    //获取上级部门列表
	enterpriseService.departmentAll({}).then(function(res){
		console.log(res);
		$scope.department = res.data.data;
	},function(err){
		console.log(err);
	});

	//安全策略列表接口
	$scope.policys = [];
	enterpriseService.getAllPolicy({}).then(function(Polres){
		console.log(Polres);
		$scope.policys=Polres.data;
	},function(err){
		console.log(err);
	});




	enterpriseService.querydepartmentById(paramsInfo).then(function(res){
        console.log(res);
        $("#departmentName").val(res.data.data.departmentName);
		$("#parentId").val(res.data.data.parentId);
        $("#policyId").val(res.data.data.policyId);
		$("#inheritUp").val(res.data.data.inheritUp);
		$("#inheritDow").val(res.data.data.inheritDow);
        $("#address").val(res.data.data.address);
        $("#description").val(res.data.data.description);

		if(res.data.data.parentId===0 || res.data.data.parentId===-1){
			$scope.isParent=true;
		}
		if(res.data.data.parentId===0 || res.data.data.parentId===-1){
			$scope.isreadonly=true;
		}
		if(departmentid===res.data.data.policyId){
			parent().$("#parentId").remove();
		}
		if(res.data.data.inheritUp===1){
			$("#inheritUp").prop("checked",true);
		}else{
			$("#inheritUp").prop("checked",false);
		}
		if(res.data.data.inheritDow===1){
			$("#inheritDow").prop("checked",true);
		}else{
			$("#inheritDow").prop("checked",false);
		}
        $scope.submitdepartmentupdate = function(){
            var departmentName = $("#departmentName").val(),
				parentId = $("#parentId").val(),
				policyId = $("#policyId").val(),
				inheritUp = $("#inheritUp").prop("checked"),
				inheritDow = $("#inheritDow").prop("checked"),
                address = $("#address").val(),
				description = $("#description").val();
            if (departmentName === '' || policyId === '' || parentId === '') {
                SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
                return false;
            }

            if (inheritUp === true) {
				inheritUp="1";
            } else {
				inheritUp="0";
            }
            if (inheritDow === true) {
				inheritDow="1";
            } else {
				inheritDow="0";
            }
            SweetAlert.swal({
                title: "您确定要修改此部门吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    var submitData = {
                    	"id":departmentid,
						"departmentName": departmentName,
						"parentId": parentId,
						"policyId": policyId,
						"address": address,
						"description": description,
						"inheritUp": inheritUp,
						"inheritDow": inheritDow
                    };
                    enterpriseService.updatedepartmentData(submitData).then(function (res) {
                        console.log(res);
                        if (res.data.stat ===1) {
                            SweetAlert.swal({
                                title: "修改成功!",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            });
                            $state.go('enterprise-department');
                        }else if(res.data.stat === -5){
							SweetAlert.swal({
								title: "创建失败,超过规定部门等级数!",
								type: "error",
								text: res.statusText,
								confirmButtonText: "确定"
							});
						} else {
                            console.log(res.statusText);
                            SweetAlert.swal({
                                title: "修改失败!",
                                type: "error",
                                text: res.statusText,
                                confirmButtonText: "确定"
                            });
                        }
                    }, function (err) {
                        console.log(err);
                        SweetAlert.swal({
                            title: "修改失败!",
                            type: "error",
                            text: err.statusText,
                            confirmButtonText: "确定"
                        });
                    });
                }
            });
        };
    },function(err){
        console.log(err);
    });

}

//拓扑图功能
function departmentTopologyCtrl($scope,$state,$stateParams,enterpriseService,$uibModal,$rootScope,SweetAlert){

	var topodpartid;
	if($stateParams.id===null){
		topodpartid=$stateParams.id;
	}else{
		topodpartid =Number($stateParams.id);
	}
	var params=topodpartid;
	//var mouseDropid;
	enterpriseService.topodepartment(params).then(function(res){
		console.log(res);
		if(res.data.stat===1){
			var topoData =res.data.data.split("/");
			var resultData = [];
			$.each(topoData,function(key,obj){
				obj = obj.replace(/'/g,'"');
				obj =obj.replace(/null/g,'无');
				obj = JSON.parse(obj);
				resultData.push(obj);
			});
			console.log(resultData);

			var treeData = {
				"class": "go.TreeModel", nodeDataArray:resultData
			};
			var tpl= go.GraphObject.make;
			var myDiagram =tpl(go.Diagram, "myDiagramDiv",
				{
					initialContentAlignment: go.Spot.Center,
					maxSelectionCount: 1,
					validCycle: go.Diagram.CycleDestinationTree,
					layout:
						tpl(go.TreeLayout,
							{
								treeStyle: go.TreeLayout.StyleLastParents,
								arrangement: go.TreeLayout.ArrangementHorizontal,
								angle: 90,
								layerSpacing: 35,
								alternateAngle: 90,
								alternateLayerSpacing: 35,
								alternateNodeSpacing: 20
							}),
					"undoManager.isEnabled": true
				});

			var levelColors = ["#C848D7/#C848D7"];
			var levelColors1 = ["#8BCDED/#8BCDED"];
			var levelColors2 = ["#84D747/ #84D747"];
			var levelColors3 = ["#9795E0/#9795E0"];
			var levelColors4 = ["#9D9A34/#9D9A34"];
			var levelColors5 = ["#E538AE/#E538AE"];
			var levelColors6 = ["#C5139D/#C5139D"];
			var levelColors7 = ["#7CA7EA/#7CA7EA"];
			var levelColors8 = ["#444DB4/#444DB4"];
			var levelColors9 = ["#4185F4/#4185F4"];
			var levelColors0 = ["#00d56b/#00d56b"];

			myDiagram.layout.commitNodes = function() {
				go.TreeLayout.prototype.commitNodes.call(myDiagram.layout);
				myDiagram.layout.network.vertexes.each(function(v) {

					if (v.node) {
						var level = v.level % (levelColors.length);
						var colors = levelColors[level].split("/");
						var shape = v.node.findObject("SHAPE");
						if (shape){
							shape.fill = tpl(go.Brush, "Linear", { 0: colors[0], 1: colors[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.type===1) {
						var level1 = v.level % (levelColors1.length);
						var colors1 = levelColors1[level1].split("/");
						var shape1 = v.node.findObject("SHAPE");
						if (shape1){
							shape1.fill = tpl(go.Brush, "Linear", { 0: colors1[0], 1: colors1[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.type==="6.1.7601.48") {
						var level2 = v.level % (levelColors2.length);
						var colors2 = levelColors2[level2].split("/");
						var shape2 = v.node.findObject("SHAPE");
						if (shape2){
							shape2.fill = tpl(go.Brush, "Linear", { 0: colors2[0], 1: colors2[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win7q_32') {
						var level3 = v.level % (levelColors3.length);
						var colors3 = levelColors3[level3].split("/");
						var shape3= v.node.findObject("SHAPE");
						if (shape3){
							shape3.fill = tpl(go.Brush, "Linear", { 0: colors3[0], 1: colors3[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win7q_64') {
						var level4 = v.level % (levelColors4.length);
						var colors4 = levelColors4[level4].split("/");
						var shape4 = v.node.findObject("SHAPE");
						if (shape4){
							shape4.fill = tpl(go.Brush, "Linear", { 0: colors4[0], 1: colors4[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win7z_32') {
						var level5 = v.level % (levelColors5.length);
						var colors5 = levelColors5[level5].split("/");
						var shape5 = v.node.findObject("SHAPE");
						if (shape5){
							shape5.fill = tpl(go.Brush, "Linear", { 0: colors5[0], 1: colors5[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win7z_64') {
						var level6 = v.level % (levelColors6.length);
						var colors6 = levelColors5[level6].split("/");
						var shape6 = v.node.findObject("SHAPE");
						if (shape6){
							shape6.fill = tpl(go.Brush, "Linear", { 0: colors6[0], 1: colors6[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win10z_32') {
						var level7 = v.level % (levelColors7.length);
						var colors7 = levelColors7[level7].split("/");
						var shape7 = v.node.findObject("SHAPE");
						if (shape7){
							shape7.fill = tpl(go.Brush, "Linear", { 0: colors7[0], 1: colors7[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win10z_64') {
						var level8 = v.level % (levelColors8.length);
						var colors8 = levelColors8[level8].split("/");
						var shape8 = v.node.findObject("SHAPE");
						if (shape8){
							shape8.fill = tpl(go.Brush, "Linear", { 0: colors8[0], 1: colors8[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win10q_32') {
						var level9 = v.level % (levelColors9.length);
						var colors9 = levelColors9[level9].split("/");
						var shape9 = v.node.findObject("SHAPE");
						if (shape9){
							shape9.fill = tpl(go.Brush, "Linear", { 0: colors9[0], 1: colors9[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
					if (v.node.data.name==='win10q_64') {
						var level0 = v.level % (levelColors0.length);
						var colors0 = levelColors0[level0].split("/");
						var shape0 = v.node.findObject("SHAPE");
						if (shape0){
							shape0.fill = tpl(go.Brush, "Linear", { 0: colors0[0], 1: colors0[1], start: go.Spot.Left, end: go.Spot.Right });
						}
					}
				});
			};

			//新增部门
			$scope.adddepentment=function(){
				var myModalMergeController=function($scope,$uibModalInstance){
					$(".input-feedback").on("blur", function () {
						var val = $(this).val();
						if (val === '') {
							$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
						} else {
							$(this).parent().removeClass('has-warning').find('span').text('');
						}
					});

					//新建部门获取上级部门接口
					$scope.department = [];
					enterpriseService.departmentAll({}).then(function(res){
						console.log(res);
						$scope.department = res.data.data;
					},function(err){
						console.log(err);
					});


					//安全策略列表接口
					$scope.policys = [];
					enterpriseService.getAllPolicy({}).then(function(Polres){
						console.log(Polres);
						$scope.policys=Polres.data;
					},function(err){
						console.log(err);
					});

					$scope.okMerge = function () {
						var departmentName = $("#departmentName").val(),
							parentId = $("#parentId").val(),
							policyId = $("#policyId").val(),
							inheritUp = $("#inheritUp").prop("checked"),
							inheritDow = $("#inheritDow").prop("checked"),
							address = $("#address").val(),
							description=$("#description").val();

						if (departmentName === '' || parentId === '' || policyId === '') {
							SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
							return false;
						}

						if (inheritUp === true) {
							inheritUp="1";
						} else {
							inheritUp="0";
						}
						if (inheritDow === true) {
							inheritDow="1";
						} else {
							inheritDow="0";
						}
						SweetAlert.swal({
							title: "",
							text: "您确定要添加部门吗？",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							closeOnConfirm: false
						}, function (isConfirm) {
							if (isConfirm) {
								var data = {
									"departmentName": departmentName,
									"parentId": parentId,
									"policyId": policyId,
									"address": address,
									"description": description,
									"inheritUp": inheritUp,
									"inheritDow": inheritDow
								};
								enterpriseService.addDepartmentData(data).then(function (res) {
									console.log(res);
									if (res.data.stat === 1) {
										SweetAlert.swal({
											title: "创建成功!",
											type: "success",
											timer: 1000,
											showConfirmButton: false
										});
										$uibModalInstance.dismiss('cancel');
										document.location.reload();
									} else if(res.data.stat === -5){
										SweetAlert.swal({
											title: "创建失败,超过规定部门等级数!",
											type: "error",
											text: res.statusText,
											confirmButtonText: "确定"
										});
									}else {
										console.log(res.statusText);
										SweetAlert.swal({
											title: res.data.err,
											type: "error",
											text: res.statusText,
											confirmButtonText: "确定"
										});
									}
								}, function (err) {
									console.log(err);
									SweetAlert.swal({
										title: res.data.err,
										type: "error",
										text: err.statusText,
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
					templateUrl: 'adepartmwnt.html',
					controller: myModalMergeController
				});
			};

			//新增终端
			$scope.addclient=function(){
				var myModalMergeController=function($scope,$uibModalInstance){
					$(".input-feedback").on("blur",function(){
						var val = $(this).val();
						if(val === ''){
							$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
						}else{
							$(this).parent().removeClass('has-warning').find('span').text('');
						}
					});

					//新建部门获取上级部门接口
					$scope.department = [];
					enterpriseService.departmentAll({}).then(function(res){
						console.log(res);
						$scope.department = res.data.data;
					},function(err){
						console.log(err);
					});

					$scope.okMerge = function(){
						var departmentId=$("#departmentId").val(),
							ip = $("#ip").val(),
							mac = $("#mac").val(),
							sn = $("#sn").val(),
							ver = $("#ver").val(),
							deviceName = $("#deviceName").val(),
							os = $("#os").val();
						if(departmentId==='' || ip === '' || mac === '' || sn === '' || ver === '' || deviceName === '' || os === ''){
							SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
							return false;
						}
						SweetAlert.swal({
							title: "",
							text: "您确定要添加终端吗？",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							closeOnConfirm: false
						},function(isConfirm){
							if(isConfirm){
								var data = {
									"departmentId": departmentId,
									"ip":ip,
									"mac":mac,
									"sn":sn,
									"ver":ver,
									"deviceName":deviceName,
									"os":os
								};
								enterpriseService.addTerminalData(data).then(function(res){
									console.log(res);
									if(res.status === 200){
										SweetAlert.swal({
											title: "创建成功!",
											type: "success",
											timer: 1000,
											showConfirmButton: false
										});
										$uibModalInstance.dismiss('cancel');
										location.reload();
									}else{
										console.log(res.statusText);
										SweetAlert.swal({
											title: "创建失败!",
											type: "error",
											text: res.statusText,
											confirmButtonText: "确定"
										});
									}
								},function(err){
									console.log(err);
									SweetAlert.swal({
										title: "创建失败!",
										type: "error",
										text: err.statusText,
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
					templateUrl: 'aclient.html',
					controller: myModalMergeController
				});

			};

			//拓扑图部门切换
			$scope.mayWorkFor=function(node1, node2) {
				console.log(node1.data.parent);
				console.log(node2.data.parent);
				var toDepartmentId=Number(node2.data.id);
				var departmentId=Number(node1.data.id);
				var clientIds=Number(node1.data.clientId);
				if(node2.data.type===0 || node1.data.type===0) {

					if (!(node1 instanceof go.Node)) {
						return false;
					}
					if (node1 === node2) {
						return false;
					}
					if (node2.isInTreeOf(node1)) {
						return false;
					}
					if(node1.data.parent!==0){
						if((node1.data.parent!==Number(node2.data.key))){
							if(node2.data.type===0){
								SweetAlert.swal({
									title: "你确定要改变部门或终端结构吗？",
									type: "warning",
									showCancelButton: true,
									confirmButtonColor: "#DD6B55",
									confirmButtonText: "确定",
									cancelButtonText: "取消",
									closeOnConfirm: false
								}, function (isConfirm) {
									if (isConfirm) {
										if (node2.data.type === 0) {
											var data = 'toDepartmentId=' + toDepartmentId +'&'+ 'departmentId=' + departmentId;
											var data1 = 'clientIds=' + clientIds +'&'+ 'toDepartmentId=' + toDepartmentId;
											enterpriseService.moveDepartment(data).then(function (res) {
												console.log(res);
												if (res.data.stat === 1) {
													$rootScope.addAlert({
														type:'success',
														content:'切换部门成功'
													});
													document.location.reload();
													return true;
												} else if(res.data.stat === -5){
													$rootScope.addAlert({
														type:'error',
														content:'创建失败,超过规定部门等级数!'
													});
												}else {
													$rootScope.addAlert({
														type:'error',
														content:'切换部门失败'
													});
												}
											}, function (err) {
												console.log(err);
												$rootScope.addAlert({
													type:'error',
													content:'切换部门失败,'+err.statusText
												});
											});
											enterpriseService.moveClientToDepartment(data1).then(function (res) {
												console.log(res);
												if (res.data.stat === 1) {
													$rootScope.addAlert({
														type:'success',
														content:'切换终端成功'
													});
													document.location.reload();
													return true;
												} else {
													$rootScope.addAlert({
														type:'error',
														content:'切换终端失败'
													});
												}
											}, function (err) {
												console.log(err);
												$rootScope.addAlert({
													type:'error',
													content:'切换终端失败,'+err.statusText
												});
											});

										}
									}
								}, function (err) {
									console.log(err);
									SweetAlert({
										text: "改变拓扑图结构失败"
									});
								});
							}
						}
					}
				}
			};
			$scope.textStyle=function() {
				return { font: "9pt Segoe UI,sans-serif", stroke: "black"};
			};
			myDiagram.nodeTemplate = tpl(go.Node, "Auto", {
					mouseDrop: function (e, node) {
						var diagram = node.diagram;
						var selnode = diagram.selection.first();
						if ($scope.mayWorkFor(selnode, node)) {
							var link = selnode.findTreeParentLink();
							if (link !== null) {
								link.fromNode = node;
							} else {
								diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
							}
						}
					}
				},
				tpl(go.Shape, "Rectangle",
					{
						name: "SHAPE", fill: "black", stroke: null
						//portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
					}
				), tpl(go.Panel, "Horizontal", tpl(go.Panel, "Table",
					{
						maxSize: new go.Size(150, 999),
						margin: new go.Margin(5, 10, -5, 3),
						defaultAlignment: go.Spot.Left
					},
					tpl(go.TextBlock, $scope.textStyle(), {
							row: 0, column: 0, columnSpan: 2,
							font: "12pt Segoe UI,sans-serif",
							editable:false, isMultiline: false,
							minSize: new go.Size(5,5)
						},
						new go.Binding("text", "name").makeTwoWay()),
					tpl(go.TextBlock, "策略: ", $scope.textStyle(), {
						row: 1, column: 0
					}),
					tpl(
						go.TextBlock, $scope.textStyle(), {
							row: 1, column: 1, columnSpan: 4,
							editable: false, isMultiline: false,
							minSize: new go.Size(10, 12),
							margin: new go.Margin(0, 0, 2, 3)
						},
						new go.Binding("text", "title").makeTwoWay()
					),
					tpl(go.TextBlock, $scope.textStyle(),
						{
							row: 3, column: 0, columnSpan: 5,
							font: "italic 9pt sans-serif",
							wrap: go.TextBlock.WrapFit,
							editable: false,
							minSize: new go.Size(10, 12)
						},
						new go.Binding("text", "comments").makeTwoWay())
					)
				)
			);

			myDiagram.nodeTemplate.contextMenu =
				tpl(go.Adornment, "Vertical",
					tpl("ContextMenuButton",
						tpl(go.TextBlock, "删除整个部门"),
						{
							click: function(e, obj) {
								var node = obj.part.adornedPart;
								if(Number(node.data.id)!==params && Number(node.data.id)!==1){
									if (node.data.type === 0) {
										SweetAlert.swal({
											title: "您确定要删除此部门所有相关的部门以及所属所有终端吗？",
											type: "warning",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											confirmButtonText: "确定",
											cancelButtonText: "取消",
											closeOnConfirm: false
										},function(isConfirm){
											if(isConfirm) {
												var data='departmentId=' + Number(node.data.id)+'&'+'isOwn=true';
												enterpriseService.removeDepartment(data).then(function (res) {
													console.log(res);
													if (res.data.stat === 1) {
														SweetAlert.swal({
															title: "删除整个部门及所属终端成功!",
															type: "success",
															timer: 1000,
															showConfirmButton: false
														});
														myDiagram.startTransaction("remove dept");
														myDiagram.removeParts(node.findTreeParts());
														myDiagram.commitTransaction("remove dept");
														//location.reload();
													} else {
														SweetAlert.swal({
															title: "删除整个部门及所属终端失败!",
															type: "error",
															text: res.statusText,
															confirmButtonText: "确定"
														});
													}
												}, function (err) {
													console.log(err);
													SweetAlert.swal({
														title: "删除整个部门及所属终端失败!",
														type: "error",
														text: err.statusText,
														confirmButtonText: "确定"
													});
												});
											}
										});
									}
								}else{
									SweetAlert.swal({
										title: "当前拓扑图中为顶级部门，不能删除!",
										confirmButtonText: "确定"
									});
								}

							}
						}
					),
					tpl("ContextMenuButton",
						tpl(go.TextBlock, "删除部门"),
						{
							click: function(e, obj) {
								var node = obj.part.adornedPart;
								if(Number(node.data.id)!==params && Number(node.data.id)!==1){
									if (node.data.type === 0) {
										SweetAlert.swal({
											title: "您确定要删除此部门所有相关的部门以及所属所有终端吗？",
											type: "warning",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											confirmButtonText: "确定",
											cancelButtonText: "取消",
											closeOnConfirm: false
										},function(isConfirm){
											if(isConfirm) {
												var data='departmentId=' + Number(node.data.id)+'&'+'isOwn=false';
												enterpriseService.removeDepartment(data).then(function (res) {
													console.log(res);
													if (res.data.stat === 1) {
														SweetAlert.swal({
															title: "删除部门成功!",
															type: "success",
															timer: 1000,
															showConfirmButton: false
														});
														myDiagram.startTransaction("reparent remove");
														var chl = node.findTreeChildrenNodes();
														while(chl.next()) {
															var emp = chl.value;
															myDiagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
														}
														myDiagram.model.removeNodeData(node.data);
														myDiagram.commitTransaction("reparent remove");

													} else {
														SweetAlert.swal({
															title: "删除部门失败!",
															type: "error",
															text: res.statusText,
															confirmButtonText: "确定"
														});
													}
												}, function (err) {
													console.log(err);
													SweetAlert.swal({
														title: "删除部门失败!",
														type: "error",
														text: err.statusText,
														confirmButtonText: "确定"
													});
												});
											}
										});
									}
								}else{
									SweetAlert.swal({
										title: "当前拓扑图中为顶级部门，不能删除!",
										confirmButtonText: "确定"
									});
								}
							}
						}

					),
					tpl("ContextMenuButton",
						tpl(go.TextBlock, "删除终端"),
						{

							click: function(e, obj) {
								console.log(resultData);
								var node = obj.part.adornedPart;
								var parent=node.data.parent;
								var departmentId;
								var id=Number(node.data.clientId);
								$.each(resultData,function(key,obj){
									if(Number(obj.key)===parent){
										var id =obj.id;
										departmentId=Number(id);
									}
								});
								SweetAlert.swal({
									title: "您确定要删除此终端吗？",
									text:"删除终端不会改变拓扑图结构",
									type: "warning",
									showCancelButton: true,
									confirmButtonColor: "#DD6B55",
									confirmButtonText: "确定",
									cancelButtonText: "取消",
									closeOnConfirm: false
								},function(isConfirm) {
									if (isConfirm) {
										if (id !== 0) {
											var data = 'departmentId=' + departmentId+'&'+'clientId='+id;
											enterpriseService.departmentRemoveClient(data).then(function (res) {
												console.log(res);
												if (res.data.stat === 1) {
													SweetAlert.swal({
														title: "删除终端成功!",
														type: "success",
														timer: 1000,
														showConfirmButton: false
													});
													myDiagram.startTransaction("reparent remove");
													var chl = node.findTreeChildrenNodes();
													while (chl.next()) {
														var emp = chl.value;
														myDiagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
													}
													myDiagram.model.removeNodeData(node.data);
													myDiagram.commitTransaction("reparent remove");
													//location.reload();
												} else if(res.data.stat===-1){
													SweetAlert.swal({
														title: "删除失败，正在部署，请稍后!",
														type: "error",
														text: res.statusText,
														confirmButtonText: "确定"
													});
												}else if(res.data.stat===-2){
													SweetAlert.swal({
														title: "删除失败，正在扫描，请稍后!",
														type: "error",
														text: res.statusText,
														confirmButtonText: "确定"
													});
												}else{
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
													title: "删除终端失败!",
													type: "error",
													text: err.statusText,
													confirmButtonText: "确定"
												});
											});
										}
									}
								});
							}
						}
					),
					tpl("ContextMenuButton",
						tpl(go.TextBlock, "修改部门"),
						{

							click: function(e, obj) {
								console.log(resultData);
								var node = obj.part.adornedPart;
								var departmentId=node.data.id;
								if(node.data.type===0){
									var myModalMergeController=function($scope,$uibModalInstance){

										$(".input-feedback").on("blur",function(){
											var val = $(this).val();
											if(val === ''){
												$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
											}else{
												$(this).parent().removeClass('has-warning').find('span').text('');
											}
										});

										var paramsInfo = {
											"id":departmentId
										};

										//获取上级部门列表
										enterpriseService.departmentAll({}).then(function(res){
											console.log(res);
											$scope.department = res.data.data;
										},function(err){
											console.log(err);
										});

										//安全策略列表接口
										$scope.policys = [];
										enterpriseService.getAllPolicy({}).then(function(Polres){
											console.log(Polres);
											$scope.policys=Polres.data;
										},function(err){
											console.log(err);
										});




										enterpriseService.querydepartmentById(paramsInfo).then(function(res){
											console.log(res);
											$("#departmentName").val(res.data.data.departmentName);
											$("#parentId").val(res.data.data.parentId);
											$("#policyId").val(res.data.data.policyId);
											$("#inheritUp").val(res.data.data.inheritUp);
											$("#inheritDow").val(res.data.data.inheritDow);
											$("#address").val(res.data.data.address);
											$("#description").val(res.data.data.description);

											if(res.data.data.parentId===0 || res.data.data.parentId===-1){
												$scope.isParent=true;
											}
											if(res.data.data.parentId===0 || res.data.data.parentId===-1){
												$scope.isreadonly=true;
											}else{
												$scope.isreadonly=false;
											}
											if(res.data.data.inheritUp===1){
												$("#inheritUp").prop("checked",true);
											}else{
												$("#inheritUp").prop("checked",false);
											}
											if(res.data.data.inheritDow===1){
												$("#inheritDow").prop("checked",true);
											}else{
												$("#inheritDow").prop("checked",false);
											}
											$scope.okMerge = function(){
												var departmentName = $("#departmentName").val(),
													parentId = $("#parentId").val(),
													policyId = $("#policyId").val(),
													inheritUp = $("#inheritUp").prop("checked"),
													inheritDow = $("#inheritDow").prop("checked"),
													address = $("#address").val(),
													description = $("#description").val();
												if (departmentName === '' || policyId === '' || parentId === '') {
													SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
													return false;
												}

												if (inheritUp === true) {
													inheritUp="1";
												} else {
													inheritUp="0";
												}
												if (inheritDow === true) {
													inheritDow="1";
												} else {
													inheritDow="0";
												}
												SweetAlert.swal({
													title: "您确定要修改此部门吗？",
													type: "warning",
													showCancelButton: true,
													confirmButtonColor: "#DD6B55",
													confirmButtonText: "确定",
													cancelButtonText: "取消",
													closeOnConfirm: false
												},function(isConfirm){
													if(isConfirm){
														var submitData = {
															"id":departmentId,
															"departmentName": departmentName,
															"parentId": parentId,
															"policyId": policyId,
															"address": address,
															"description": description,
															"inheritUp": inheritUp,
															"inheritDow": inheritDow
														};
														enterpriseService.updatedepartmentData(submitData).then(function (res) {
															console.log(res);
															if (res.data.stat >0) {
																SweetAlert.swal({
																	title: "修改成功!",
																	type: "success",
																	timer: 1000,
																	showConfirmButton: false
																});
																$uibModalInstance.dismiss('cancel');
																document.location.reload();
															}else if(res.data.stat === -5){
																SweetAlert.swal({
																	title: "创建失败,超过规定部门等级数!",
																	type: "error",
																	text: res.statusText,
																	confirmButtonText: "确定"
																});
															} else {
																console.log(res.statusText);
																SweetAlert.swal({
																	title: "修改失败!",
																	type: "error",
																	text: res.statusText,
																	confirmButtonText: "确定"
																});
															}
														}, function (err) {
															console.log(err);
															SweetAlert.swal({
																title: "修改失败!",
																type: "error",
																text: err.statusText,
																confirmButtonText: "确定"
															});
														});
													}
												});
											};
										},function(err){
											console.log(err);
										});

										$scope.cancelMerge = function(){
											$uibModalInstance.dismiss('cancel');
										};
									};
									$uibModal.open({
										templateUrl: 'updepartmwnt.html',
										controller: myModalMergeController
									});
								}

							}
						}
					),
					tpl("ContextMenuButton",
						tpl(go.TextBlock, "修改终端"),
						{

							click: function(e, obj) {
								console.log(resultData);
								var node = obj.part.adornedPart;
								var clientId=node.data.clientId;
								if(node.data.type!==0){
									var myModalMergeController=function($scope,$uibModalInstance){
										$scope.hardwareHref = function($event,num){
											var obj = $event.target;
											$(obj).parent().find("li").removeClass("active");
											$(obj).addClass("active");
											$scope.hardwareType = num;
										};

										$(".input-feedback").on("blur",function(){
											var val = $(this).val();
											if(val === ''){
												$(this).parent().addClass('has-warning').find('span').text('此输入框值不能为空！');
											}else{
												$(this).parent().removeClass('has-warning').find('span').text('');
											}
										});

										//获取上级部门列表
										enterpriseService.departmentAll({}).then(function(res){
											console.log(res);
											$scope.department = res.data.data;
										},function(err){
											console.log(err);
										});

										var paramsInfo = {
											"clientId":clientId
										};
										enterpriseService.queryTerminalById(paramsInfo).then(function(res){
											console.log(res);
											$("#departmentName").val(res.data.departmentName);
											$("#liable").val(res.data.personLiable);
											$("#ip").val(res.data.ip);
											$("#mac").val(res.data.mac);
											$("#sn").val(res.data.sn);
											$("#os").val(res.data.os);
											$("#ver").val(res.data.ver);
											$("#hd").val(res.data.hd);
										},function(err){
											console.log(err);
										});
										$scope.okMerge = function(){
											var personLiable = $("#liable").val(),
												ip = $("#ip").val(),
												mac = $("#mac").val(),
												sn = $("#sn").val(),
												os = $("#os").val(),
												ver = $("#ver").val(),
												hd = $("#hd").val();
											if(personLiable === '' || ip === '' || mac === '' || sn === '' || ver === '' || os === '' || hd === ''){
												SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
												return false;
											}
											SweetAlert.swal({
												title: "您确定要修改此终端吗？",
												type: "warning",
												showCancelButton: true,
												confirmButtonColor: "#DD6B55",
												confirmButtonText: "确定",
												cancelButtonText: "取消",
												closeOnConfirm: false
											},function(isConfirm){
												if(isConfirm){
													var submitData = {
														"id":clientId,
														"personLiable":personLiable,
														"ip":ip,
														"mac":mac,
														"sn":sn,
														"os":os,
														"ver":ver,
														"hd":hd
													};
													enterpriseService.updateTerminalData(submitData).then(function(res){
														console.log(res);
														if(res.status === 200){
															SweetAlert.swal({
																title: "修改成功!",
																type: "success",
																timer: 1000,
																showConfirmButton: false
															});
															$uibModalInstance.dismiss('cancel');
															document.location.reload();
														}else{
															SweetAlert.swal({
																title: "修改失败!",
																type: "error",
																text: res.statusText,
																confirmButtonText: "确定"
															});
														}
													},function(err){
														console.log(err);
														SweetAlert.swal({
															title: "修改失败!",
															type: "error",
															text: err.statusText,
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
										templateUrl: 'upclient.html',
										controller: myModalMergeController
									});
								}

							}
						}
					)

				);
			myDiagram.linkTemplate = tpl(go.Link, go.Link.Orthogonal, {
					corner: 5, relinkableFrom: true, relinkableTo: true
				}, tpl(
				go.Shape, {
					strokeWidth: 1.5, stroke: "#7B69B3"   //设置线条颜色
				})
			);
			myDiagram.model = go.Model.fromJson(treeData);
			$scope.load=function(){
				myDiagram.model = go.Model.fromJson(treeData);
			};
		}else{
			var errMSG;
			if(res.data.code==="-10000"){
				errMSG=res.data.msg;
			}else{
				errMSG=res.data.err;
			}
			SweetAlert.swal({
				title: res.data.err,
				type: "errMSG",
				confirmButtonText: "确定"
			},function(isConfirm){
				if(isConfirm){
					$(".sweet-alert").remove();
					$(".sweet-overlay").hide();
					$state.go('enterprise-department');
				}
			});

		}

	},function(err){
		console.log(err);
	});
}

//标签列表
function labelCtrl(){

}

//添加标签
function labelcreateCtrl($scope, $state, $uibModal,$rootScope, enterpriseService, SweetAlert, tools){
	$scope.backListlabel = function(){
		$state.go('enterprise-label');
	};

	//安全策略列表接口
	$scope.policys = [];
	enterpriseService.getAllPolicy({}).then(function(Polres){
		console.log(Polres);
		$scope.policys=Polres.data;
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
			//获取部门下的终端
			enterpriseService.departmentStructure({}).then(function(res){
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
					$rootScope.addAlert({
						content:'至少需要选择一个终端!'
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

	$scope.submitlabel = function(){
		var terminalIds = [],
			labelName=$("#labelName").val(),
			policyId=$("#policyId").val(),
			labelDescribe=$("#labelDescribe").val();
		if(labelName==='' || policyId===''){
			$rootScope.addAlert({
				content:'您还有输入框没有填写!'
			});
			return false;
		}
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
		if(labelName==='' || policyId===''){
			SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
			return false;
		}
		var data = {
			"labelName":labelName,
			"policyId":policyId,
			"labelDescribe":labelDescribe,
			"clientIds":terminalIds
		};

		enterpriseService.createLableinfo(data).then(function(res){
			console.log(res);
			if(res.data.stat=== 1){
				SweetAlert.swal({
					title: "创建成功!",
					type: "success",
					timer: 1000,
					showConfirmButton: false
				});
				$state.go('enterprise-label');
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

	};
}

//修改标签
function labelEditCtrl($stateParams,$state,$uibModal,$scope,$rootScope,enterpriseService,SweetAlert,tools) {
	var labelId =  Number($stateParams.id);

	var params={
		"labelInfoId":labelId
	};

	$scope.backListlabel = function(){
		$state.go('enterprise-label');
	};

	//安全策略列表接口
	$scope.policys = [];
	enterpriseService.getAllPolicy({}).then(function(Polres){
		console.log(Polres);
		$scope.policys=Polres.data;
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
			if(li){
				$.each(function(key,obj){
					if(li.clientId===obj.clientId){
						$rootScope.addAlert({
							content:'以及选择次终端!'
						});
						return false;
					}else{
						lis.push(li);
					}
				});
			}
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
			//获取部门下的终端
			enterpriseService.departmentStructure({}).then(function(res){
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
					$rootScope.addAlert({
						content:'至少需要选择一个终端!'
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



	enterpriseService.ReturnLabelInfo(params).then(function(res){
		console.log(res);
		$("#labelName").val(res.data.data.labelName);
		$("#policyId").val(res.data.data.policyId);
		$("#labelDescribe").val(res.data.data.labelDescribe);
        var listHtml = "";
        $.each(res.data.data.lableLinkClients,function(key,obj){
            var tVal = obj.clientId,
                tText = obj.deviceName;
            listHtml += '<li><input type="checkbox" value="'+tVal+'" />'+tText+'</li>';
        });
        $("#selTerminalList").html(listHtml);

		$scope.submitlabel = function(){
			var terminalIds = [],
				labelName=$("#labelName").val(),
				policyId=$("#policyId").val(),
				labelDescribe=$("#labelDescribe").val();
			if(labelName==='' || policyId===''){
				$rootScope.addAlert({
					content:'您还有输入框没有填写!'
				});
				return false;
			}
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
			if(labelName==='' || policyId===''){
				SweetAlert.swal("您有输入框还未填写内容，请填写后再提交");
				return false;
			}
			var data = {
				"id":labelId,
				"labelName":labelName,
				"policyId":policyId,
				"labelDescribe":labelDescribe,
				"clientIds":terminalIds
			};

			enterpriseService.updateLableinfo(data).then(function(res){
				if(res.data !== -1){
					SweetAlert.swal({
						title: "修改成功!",
						type: "success",
						timer: 1000,
						showConfirmButton: false
					});
					$state.go('enterprise-label');
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

		};
	});

}