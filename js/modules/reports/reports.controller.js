/**
 * Created by pcboby on 10/24/16.
 */
export default {
    //assetCtrl:/*@ngInject*/assetCtrl,
    assetDetailCtrl:/*@ngInject*/assetDetailCtrl,
    madeReportsListCtrl:/*@ngInject*/madeReportsListCtrl,
    madeReportsCtrl:/*@ngInject*/madeReportsCtrl,
    madeReportsUpdateCtrl:/*@ngInject*/madeReportsUpdateCtrl,
    auditCtrl:/*@ngInject*/auditCtrl,
    safetyDetailCtrl:/*@ngInject*/safetyDetailCtrl
};
function safetyDetailCtrl($state,$scope,$stateParams,$rootScope,reportsService){
    reportsService.getSafeDetail($stateParams.id).then(function(res){
        if(res.status===200){
            $scope.reportDetail=res.data.data;
        }else{
            $rootScope.addAlert({
                type:'error',
                content:'获取详情失败'
            });
        }
    });
}

/*function assetCtrl($scope) {
}*/

function assetDetailCtrl($scope,$state,$stateParams,reportsService,SweetAlert){
    var clientId = $stateParams.id;

    reportsService.assetHardware({snapshotId:$stateParams.id}).then(function(res){
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
        $scope.onlyread='disallow';
    },function(err){
        console.log(err);
    });
    $scope.viewloaded=function(){

            $('.col-md-10 em').each(function(i,d){
                var obj=$(d).next();
                if(obj.is('span')){
                    console.log(obj);
                    $(obj).css({'border':'1px solid #ccc'});
                }
            });
    };

    /*$scope.hardwareInputShow = function($event){
        var obj = $event.target;
        $(obj).hide().siblings("input[type='text']").show().focus();
    };
    $scope.hardwareInputHide = function($event){
        var obj = $event.target;
        $(obj).hide().siblings("span").show();
    };*/

    $scope.hardwareHref = function($event,num){
        var obj = $event.target;
        $(obj).parent().find("li").removeClass("active");
        $(obj).addClass("active");
        $scope.hardwareType = num;
    };
    $scope.shiftState=$scope.$on('$stateChangeStart',function(e,ts,tp,fs){
        if(ts.name==='reports.hardware'&&fs.name==='reports.software'){
            e.preventDefault();
            $scope.shiftState();
            $state.go('reports.hardware',{id:$stateParams.id});
            $scope.viewloaded();
        }else if(ts.name==='reports.software'&&fs.name==='reports.hardware'){
            e.preventDefault();
            $scope.shiftState();
            $state.go('reports.software',{id:$stateParams.id});
        }
    });
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
        console.log(data,SweetAlert);
        /*enterprise.terminalUpdateHdInfo(data).then(function(res){
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
        });*/
    };
}

//定制报告列表
function madeReportsListCtrl($rootScope,reportsService){
    $rootScope.$on('exportReportEnd',function(event,data){
        if(data){
            reportsService.downloadFile(data);
        }
    });
}

//定制报告
function madeReportsCtrl($scope,$state,$uibModal,reportsService,SweetAlert,tools){
    //日期控件
    $scope.dateOptions ={
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        locale:'zh_cn'
    };
    $scope.dateInit1 = {
        format:'yyyy-MM-dd hh:mm:ss',
        from: false,
        to:false,
        openFrom :function() {
            $scope.fromDate1 = new Date();
            $scope.dateInit1.from = true;
        },
        openTo:function() {
            $scope.toDate1 = new Date(Number(moment($scope.fromDate).format('x'))+(1000*3600*24*7));
            $scope.dateInit1.to = true;
        }
    };
    $scope.dateInit2 = {
        format:'yyyy-MM-dd hh:mm:ss',
        from: false,
        to:false,
        openFrom :function() {
            $scope.fromDate2 = new Date();
            $scope.dateInit2.from = true;
        },
        openTo:function() {
            $scope.toDate2 = new Date(Number(moment($scope.fromDate).format('x'))+(1000*3600*24*7));
            $scope.dateInit2.to = true;
        }
    };
    
    //新建策略页---设置类型（0为资产，1为安全，2为审计）
    $scope.madeType = 1;
    $scope.madeTypeTab = function(num){
        $scope.madeType = num;
    };

    //选择终端
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
            reportsService.departmentStructure({}).then(function(res){
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

    //提交定制
    $scope.madeName = "";
    $scope.madeDesc = "";
    $scope.submitMade = function(){
        var madeTpl = $("#madeTpl").val();
        var terminalIds = [];
        $("#selTerminalList li").each(function(key,obj){
            var terminalId = $(obj).find("input[type='checkbox']").val();
            terminalId = Number(terminalId);
            terminalIds.push(terminalId);
        });
        if($scope.madeName === ''){
            SweetAlert.swal({
                title: "名称不能为空!",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(madeTpl === ''){
            SweetAlert.swal({
                title: "您未选择模板!",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        var data = {
            "name":$scope.madeName,
            "description":$scope.madeDesc,
            "templateIds":[Number(madeTpl)]
        };
        if($scope.madeType === 1){
            data.type = 0;
            var searchValue0 = [];
            $("#assetsType input[type='checkbox']").each(function(key,obj){
                var thisStatus = $(obj).prop("checked");
                if(key === 0){
                    if(thisStatus === true){
                        searchValue0.push("HARDWARE");
                    }
                }else if(key === 1){
                    if(thisStatus === true){
                        searchValue0.push("SOFTWARE");
                    }
                }
            });
            searchValue0 = searchValue0.join(",");
            data.reportSearch = [
                {
                    "searchCondition":0,
                    "searchValue":searchValue0
                }
            ];

            data.clientIds = terminalIds;
        }else if($scope.madeType === 2){
            data.type = 1;
            var searchValue1,searchValue2 = [];
            var startTime1 = $scope.fromDate1,
                endTime1 = $scope.toDate1;
            startTime1 = Number(moment(startTime1).format('x'));
            endTime1 = Number(moment(endTime1).format('x'));
            if(startTime1 > endTime1){
                SweetAlert.swal({
                    title: "选择的起始时间必须小于结束时间!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            startTime1 = tools.getSmpFormatDateByLong(startTime1,true);
            endTime1 = tools.getSmpFormatDateByLong(endTime1,true);
            searchValue1 = "'"+startTime1+"'" + "," + "'"+endTime1+"'";

            $("#safeType input[type='checkbox']").each(function(key,obj){
                var thisStatus = $(obj).prop("checked");
                if(key === 0){
                    if(thisStatus === true){
                        searchValue2.push("WARNING");
                    }
                }else if(key === 1){
                    if(thisStatus === true){
                        searchValue2.push("CLIENT_LOGIN");
                    }
                }else if(key === 2){
                    if(thisStatus === true){
                        searchValue2.push("CLIENT_LOGOUT");
                    }
                }else if(key === 3){
                    if(thisStatus === true){
                        searchValue2.push("OTHER");
                    }
                }
            });
            searchValue2 = searchValue2.join(",");

            data.reportSearch = [
                {
                    "searchCondition":1,
                    "searchValue":searchValue1
                },
                {
                    "searchCondition":2,
                    "searchValue":searchValue2
                }
            ];

            data.clientIds = terminalIds;
        }else if($scope.madeType === 3){
            data.type = 2;
            var searchValue3,searchValue4 = [];
            var startTime2 = $scope.fromDate2,
                endTime2 = $scope.toDate2;
            startTime2 = Number(moment(startTime2).format('x'));
            endTime2 = Number(moment(endTime2).format('x'));
            if(startTime2 > endTime2){
                SweetAlert.swal({
                    title: "选择的起始时间必须小于结束时间!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            startTime2 = tools.getSmpFormatDateByLong(startTime2,true);
            endTime2 = tools.getSmpFormatDateByLong(endTime2,true);
            searchValue3 = "'"+startTime2+"'" + "," + "'"+endTime2+"'";

            $("#auditType input[type='checkbox']").each(function(key,obj){
                var thisStatus = $(obj).prop("checked");
                if(key === 0){
                    if(thisStatus === true){
                        searchValue4.push("ASSET");
                    }
                }else if(key === 1){
                    if(thisStatus === true){
                        searchValue4.push("POLICY");
                    }
                }else if(key === 2){
                    if(thisStatus === true){
                        searchValue4.push("SYSTEM");
                    }
                }
            });
            searchValue4 = searchValue4.join(",");

            data.reportSearch = [
                {
                    "searchCondition":3,
                    "searchValue":searchValue3
                },
                {
                    "searchCondition":4,
                    "searchValue":searchValue4
                }
            ];
        }
        SweetAlert.swal({
            title: "您确定要创建定制吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7B69B3",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },function(isConfirm){
            if(isConfirm){
                reportsService.createCustomReports(data).then(function(res){
                    if(res.data.status === 1){
                        SweetAlert.swal({
                            title: "创建成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
                        $state.go('made');
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

    //设置模板页---模板列表
    $scope.tplOptions = [];
    reportsService.getAllTemplateInfo({}).then(function(res){
        console.log(res);
        $scope.tplOptions = res.data;
    },function(err){
        console.log(err);
    });

    //设置模板页---设置是否有水印
    $scope.setWatermark = function($event){
        var obj = $event.target;
        var status = $(obj).prop("checked");
        if(status === false){
            $("#tplWatermarkContent").find("input[type='text']").attr("readonly","readonly");
        }else{
            $("#tplWatermarkContent").find("input[type='text']").removeAttr("readonly");
        }
        $event.stopPropagation();
    };
    //设置模板页---设置是否邮件发送
    $scope.setEmail = function($event){
        var obj = $event.target;
        var status = $(obj).prop("checked");
        if(status === false){
            $("#tplEmailContent").find("input[type='text']").attr("readonly","readonly");
        }else{
            $("#tplEmailContent").find("input[type='text']").removeAttr("readonly");
        }
        $event.stopPropagation();
    };

    //提交模板
    $scope.tplTitle = "";
    $scope.tplWatermark = "";
    $scope.tplEmail = "";
    $scope.submitTpl = function(){
        if($scope.tplTitle === ''){
            SweetAlert.swal({
                title: "请将内容填写完整",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        var data = {
            "title":$scope.tplTitle,
            "watContent":$scope.tplWatermark,
            "email":$scope.tplEmail
        };
        var setWatermarkStatus = $("#setWatermark").prop("checked");
        var setEmailStatus = $("#setEmail").prop("checked");
        if(setWatermarkStatus === true){
            data.watStatus = 1;
            if($scope.tplWatermark === ''){
                SweetAlert.swal({
                    title: "请将内容填写完整",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
        }else{
            data.watStatus = 0;
        }
        if(setEmailStatus === true){
            data.emailStatus = 1;
            if($scope.tplEmail === ''){
                SweetAlert.swal({
                    title: "请将内容填写完整",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            if(!tools.fnValidate.Email.test($scope.tplEmail)){
                SweetAlert.swal({
                    title: "邮箱格式不正确!",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
        }else{
            data.emailStatus = 0;
        }
        reportsService.createTemplate(data).then(function(res){
            console.log(res);
            if(res.data.status === 1){
                SweetAlert.swal({
                    title: "创建成功!",
                    type: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                reportsService.getAllTemplateInfo({}).then(function(resTpl){
                    $scope.tplOptions = resTpl.data;
                },function(errTpl){
                    console.log(errTpl);
                });
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
            console.log(err);
            SweetAlert.swal({
                title: "创建失败!",
                type: "error",
                text: err.statusText,
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
        });
    };
    //设置模板页---创建新模板
    $scope.createTpl = function(){
        $("#tplList").val("");
        $scope.tplTitle = "";
        $scope.tplWatermark = "";
        $scope.tplEmail = "";
        $("#tplList").val("");
        $scope.submitTpl = function(){
            if($scope.tplTitle === ''){
                SweetAlert.swal({
                    title: "请将内容填写完整",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            var data = {
                "title":$scope.tplTitle,
                "watContent":$scope.tplWatermark,
                "email":$scope.tplEmail
            };
            var setWatermarkStatus = $("#setWatermark").prop("checked");
            var setEmailStatus = $("#setEmail").prop("checked");
            if(setWatermarkStatus === true){
                data.watStatus = 1;
                if($scope.tplWatermark === ''){
                    SweetAlert.swal({
                        title: "请将内容填写完整",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
            }else{
                data.watStatus = 0;
            }
            if(setEmailStatus === true){
                data.emailStatus = 1;
                if($scope.tplEmail === ''){
                    SweetAlert.swal({
                        title: "请将内容填写完整",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
                if(!tools.fnValidate.Email.test($scope.tplEmail)){
                    SweetAlert.swal({
                        title: "邮箱格式不正确!",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
            }else{
                data.emailStatus = 0;
            }
            reportsService.createTemplate(data).then(function(res){
                console.log(res);
                if(res.data.status === 1){
                    SweetAlert.swal({
                        title: "创建成功!",
                        type: "success",
                        timer: 1000,
                        showConfirmButton: false
                    });
                    reportsService.getAllTemplateInfo({}).then(function(resTpl){
                        $scope.tplOptions = resTpl.data;
                    },function(errTpl){
                        console.log(errTpl);
                    });
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
                console.log(err);
                SweetAlert.swal({
                    title: "创建失败!",
                    type: "error",
                    text: err.statusText,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
            });
        };
    };
    //设置模板页---根据模板列表的id获取相应的值
    $("#tplList").on("change",function(){
        var id = $(this).val();
        if(id === ''){
            $scope.createTpl();
            return false;
        }
        id = Number(id);
        reportsService.selectTemplate({"templateInfoId":id}).then(function(resTpl){
            console.log(resTpl);
            $scope.tplTitle = resTpl.data.title;
            $scope.tplWatermark = resTpl.data.watContent;
            $scope.tplEmail = resTpl.data.email;
            if(resTpl.data.watStatus === 1){
                $("#setWatermark").prop("checked",true);
                $("#tplWatermarkContent").find("input[type='text']").removeAttr("readonly");
            }else{
                $("#setWatermark").prop("checked",false);
                $("#tplWatermarkContent").find("input[type='text']").attr("readonly","readonly");
            }
            if(resTpl.data.emailStatus === 1){
                $("#setEmail").prop("checked",true);
                $("#tplEmailContent").find("input[type='text']").removeAttr("readonly");
            }else{
                $("#setEmail").prop("checked",false);
                $("#tplEmailContent").find("input[type='text']").attr("readonly","readonly");
            }

            $scope.submitTpl = function(){
                if($scope.tplTitle === ''){
                    SweetAlert.swal({
                        title: "请将内容填写完整",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
                var data = {
                    "id":id,
                    "title":$scope.tplTitle,
                    "watContent":$scope.tplWatermark,
                    "email":$scope.tplEmail
                };
                var setWatermarkStatus = $("#setWatermark").prop("checked");
                var setEmailStatus = $("#setEmail").prop("checked");
                if(setWatermarkStatus === true){
                    data.watStatus = 1;
                    if($scope.tplWatermark === ''){
                        SweetAlert.swal({
                            title: "请将内容填写完整",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                }else{
                    data.watStatus = 0;
                }
                if(setEmailStatus === true){
                    data.emailStatus = 1;
                    if($scope.tplEmail === ''){
                        SweetAlert.swal({
                            title: "请将内容填写完整",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                    if(!tools.fnValidate.Email.test($scope.tplEmail)){
                        SweetAlert.swal({
                            title: "邮箱格式不正确!",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                }else{
                    data.emailStatus = 0;
                }
                reportsService.updateTemplate(data).then(function(res){
                    console.log(res);
                    if(res.data.status === 1){
                        SweetAlert.swal({
                            title: "修改成功!",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
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
        },function(errTpl){
            console.log(errTpl);
        });
    });
}

//定制报告修改
function madeReportsUpdateCtrl($scope,$state,$stateParams,$uibModal,reportsService,SweetAlert,tools){
    var id = $stateParams.id;
    id = Number(id);

    //日期控件
    $scope.dateOptions ={
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        locale:'zh_cn'
    };
    $scope.dateInit1 = {
        format:'yyyy-MM-dd hh:mm:ss',
        from: false,
        to:false,
        openFrom :function() {
            $scope.fromDate1 = new Date();
            $scope.dateInit1.from = true;
        },
        openTo:function() {
            $scope.toDate1 = new Date(Number(moment($scope.fromDate).format('x'))+(1000*3600*24*7));
            $scope.dateInit1.to = true;
        }
    };
    $scope.dateInit2 = {
        format:'yyyy-MM-dd hh:mm:ss',
        from: false,
        to:false,
        openFrom :function() {
            $scope.fromDate2 = new Date();
            $scope.dateInit2.from = true;
        },
        openTo:function() {
            $scope.toDate2 = new Date(Number(moment($scope.fromDate).format('x'))+(1000*3600*24*7));
            $scope.dateInit2.to = true;
        }
    };
    
    //新建策略页---设置类型（0为资产，1为安全，2为审计）
    $scope.madeType = 1;
    $scope.madeTypeTab = function(num){
        $scope.madeType = num;
    };

    //模板列表
    $scope.tplOptions = [];
    //选择终端
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
            reportsService.departmentStructure({}).then(function(res){
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
    
    reportsService.selectCustomReports({"reportInfoId":id}).then(function(resMade){
        console.log(resMade);

        reportsService.getAllTemplateInfo({}).then(function(resTpl){
            $scope.tplOptions = resTpl.data;
            
            var listHtml = "";
            if(resMade.data.clientIds){
                $.each(resMade.data.clientIds,function(key,obj){
                    listHtml += '<li><input type="checkbox" value="'+obj.id+'" />'+obj.deviceName+'</li>';
                });
            }
            $("#selTerminalList").html(listHtml);

            $scope.madeName = resMade.data.name;
            $scope.madeDesc = resMade.data.description;
            var madeType = Number(resMade.data.type)+1;
            $scope.madeTypeTab(madeType);
            $("input[name='madeType']").prop("checked",false);
            $("input[id='madeType"+madeType+"']").prop("checked",true);
            $scope.$watch('tplOptions',function(){
                if(resMade.data.templateIds){
                    $("#madeTpl").get(0).selectedIndex=resMade.data.templateIds[0]-1;
                }
            });
            if(resMade.data.reportSearch){
                if($scope.madeType === 1){
                    var searchValue0 = resMade.data.reportSearch[0].searchValue.split(",");
                    $.each(searchValue0,function(key,obj){
                        if(obj === 'HARDWARE'){
                            $("#assetsType input[type='checkbox']").eq(0).prop("checked",true);
                        }else if(obj === 'SOFTWARE'){
                            $("#assetsType input[type='checkbox']").eq(1).prop("checked",true);
                        }
                    });
                }else if($scope.madeType === 2){
                    var searchValue1 = resMade.data.reportSearch[0].searchValue.replace(/'/g,"").split(",");
                    var starttime1 = new Date(searchValue1[0]);
                    starttime1 = moment(starttime1).format('YYYY-MM-DD hh:mm:ss');
                    $("#starttime1").val(starttime1);
                    var endtime1 = new Date(searchValue1[1]);
                    endtime1 = moment(endtime1).format('YYYY-MM-DD hh:mm:ss');
                    $("#endtime1").val(endtime1);

                    var searchValue2 = resMade.data.reportSearch[1].searchValue.split(",");
                    $.each(searchValue2,function(key,obj){
                        if(obj === 'WARNING'){
                            $("#safeType input[type='checkbox']").eq(0).prop("checked",true);
                        }else if(obj === 'CLIENT_LOGIN'){
                            $("#safeType input[type='checkbox']").eq(1).prop("checked",true);
                        }else if(obj === 'CLIENT_LOGOUT'){
                            $("#safeType input[type='checkbox']").eq(2).prop("checked",true);
                        }else if(obj === 'OTHER'){
                            $("#safeType input[type='checkbox']").eq(3).prop("checked",true);
                        }
                    });
                }else if($scope.madeType === 3){
                    var searchValue3 = resMade.data.reportSearch[0].searchValue.replace(/'/g,"").split(",");
                    var starttime2 = new Date(searchValue3[0]);
                    starttime2 = moment(starttime2).format('YYYY-MM-DD hh:mm:ss');
                    $("#starttime2").val(starttime2);
                    var endtime2 = new Date(searchValue3[1]);
                    endtime2 = moment(endtime2).format('YYYY-MM-DD hh:mm:ss');
                    $("#endtime2").val(endtime2);

                    var searchValue4 = resMade.data.reportSearch[1].searchValue.split(",");
                    $.each(searchValue4,function(key,obj){
                        if(obj === 'ASSET'){
                            $("#auditType input[type='checkbox']").eq(0).prop("checked",true);
                        }else if(obj === 'POLICY'){
                            $("#auditType input[type='checkbox']").eq(1).prop("checked",true);
                        }else if(obj === 'SYSTEM'){
                            $("#auditType input[type='checkbox']").eq(2).prop("checked",true);
                        }
                    });
                }
            }
            $scope.submitMade = function(){
                if($scope.madeName === ''){
                    SweetAlert.swal({
                        title: "名称不能为空!",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
                var madeTpl = $("#madeTpl").val();
                var terminalIds = [];
                $("#selTerminalList li").each(function(key,obj){
                    var terminalId = $(obj).find("input[type='checkbox']").val();
                    terminalId = Number(terminalId);
                    terminalIds.push(terminalId);
                });
                if(madeTpl === ''){
                    SweetAlert.swal({
                        title: "您未选择模板!",
                        type: "warning",
                        confirmButtonColor: "#7B69B3",
                        confirmButtonText: "确定"
                    });
                    return false;
                }
                var data = {
                    "id":id,
                    "name":$scope.madeName,
                    "description":$scope.madeDesc,
                    "templateIds":[Number(madeTpl)]
                };
                if($scope.madeType === 1){
                    data.type = 0;
                    var searchValue0 = [];
                    $("#assetsType input[type='checkbox']").each(function(key,obj){
                        var thisStatus = $(obj).prop("checked");
                        if(key === 0){
                            if(thisStatus === true){
                                searchValue0.push("HARDWARE");
                            }
                        }else if(key === 1){
                            if(thisStatus === true){
                                searchValue0.push("SOFTWARE");
                            }
                        }
                    });
                    searchValue0 = searchValue0.join(",");
                    data.reportSearch = [
                        {
                            "searchCondition":0,
                            "searchValue":searchValue0
                        }
                    ];

                    data.clientIds = terminalIds;
                }else if($scope.madeType === 2){
                    data.type = 1;
                    var searchValue1,searchValue2 = [];
                    var startTime1 = $scope.fromDate1,
                        endTime1 = $scope.toDate1;
                    startTime1 = Number(moment(startTime1).format('x'));
                    endTime1 = Number(moment(endTime1).format('x'));
                    if(startTime1 > endTime1){
                        SweetAlert.swal({
                            title: "选择的起始时间必须小于结束时间!",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                    startTime1 = tools.getSmpFormatDateByLong(startTime1,true);
                    endTime1 = tools.getSmpFormatDateByLong(endTime1,true);
                    searchValue1 = "'"+startTime1+"'" + "," + "'"+endTime1+"'";

                    $("#safeType input[type='checkbox']").each(function(key,obj){
                        var thisStatus = $(obj).prop("checked");
                        if(key === 0){
                            if(thisStatus === true){
                                searchValue2.push("WARNING");
                            }
                        }else if(key === 1){
                            if(thisStatus === true){
                                searchValue2.push("CLIENT_LOGIN");
                            }
                        }else if(key === 2){
                            if(thisStatus === true){
                                searchValue2.push("CLIENT_LOGOUT");
                            }
                        }else if(key === 3){
                            if(thisStatus === true){
                                searchValue2.push("OTHER");
                            }
                        }
                    });
                    searchValue2 = searchValue2.join(",");

                    data.reportSearch = [
                        {
                            "searchCondition":1,
                            "searchValue":searchValue1
                        },
                        {
                            "searchCondition":2,
                            "searchValue":searchValue2
                        }
                    ];

                    data.clientIds = terminalIds;
                }else if($scope.madeType === 3){
                    data.type = 2;
                    var searchValue3,searchValue4 = [];
                    var startTime2 = $scope.fromDate2,
                        endTime2 = $scope.toDate2;
                    startTime2 = Number(moment(startTime2).format('x'));
                    endTime2 = Number(moment(endTime2).format('x'));
                    if(startTime2 > endTime2){
                        SweetAlert.swal({
                            title: "选择的起始时间必须小于结束时间!",
                            type: "warning",
                            confirmButtonColor: "#7B69B3",
                            confirmButtonText: "确定"
                        });
                        return false;
                    }
                    startTime2 = tools.getSmpFormatDateByLong(startTime2,true);
                    endTime2 = tools.getSmpFormatDateByLong(endTime2,true);
                    searchValue3 = "'"+startTime2+"'" + "," + "'"+endTime2+"'";

                    $("#auditType input[type='checkbox']").each(function(key,obj){
                        var thisStatus = $(obj).prop("checked");
                        if(key === 0){
                            if(thisStatus === true){
                                searchValue4.push("ASSET");
                            }
                        }else if(key === 1){
                            if(thisStatus === true){
                                searchValue4.push("POLICY");
                            }
                        }else if(key === 2){
                            if(thisStatus === true){
                                searchValue4.push("SYSTEM");
                            }
                        }
                    });
                    searchValue4 = searchValue4.join(",");

                    data.reportSearch = [
                        {
                            "searchCondition":3,
                            "searchValue":searchValue3
                        },
                        {
                            "searchCondition":4,
                            "searchValue":searchValue4
                        }
                    ];
                }
                SweetAlert.swal({
                    title: "您确定要修改此定制吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },function(isConfirm){
                    if(isConfirm){
                        reportsService.updateCustomReports(data).then(function(res){
                            console.log(res);
                            if(res.data.status === 1){
                                SweetAlert.swal({
                                    title: "修改成功!",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                $state.go('made');
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
        },function(errTpl){
            console.log(errTpl);
        });     
    },function(errMade){
        console.log(errMade);
    });
}

//审计报告
function auditCtrl(){
    
}