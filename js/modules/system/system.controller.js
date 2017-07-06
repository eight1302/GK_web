/**
 * Created by Carol on 17/11/16.
 */

export default {
    networkEdit:/*@ngInject*/networkEdit,
    networkCtrl:/*@ngInject*/networkCtrl,
    systemTimesetCtrl:/*@ngInject*/systemTimesetCtrl,
    systemEmailCtrl:/*@ngInject*/systemEmailCtrl,
    systemUserCtrl:/*@ngInject*/systemUserCtrl,
    systemUserCreatCtrl:/*@ngInject*/systemUserCreatCtrl,
    systemUserUpdateCtrl:/*@ngInject*/systemUserUpdateCtrl
};

function networkEdit($scope,$stateParams,$rootScope,$state,systemServices){
    systemServices.getNetworkCount().then(function(res){
        var networkCards=res.data.networkCardInfo;
        $(networkCards).each(function(i,d){
           $.each(d,function(k,v){
               if(k==='isMaster'&&v===1){
                   $scope.initcard=networkCards[i].id;
                   $scope.currentCard=networkCards[i];
               }
           });
        });
        $scope.networks=networkCards;
        $scope.dnsServer=res.data.dnsInfo?res.data.dnsInfo:null;
        $scope.dnsSetting =res.data.dnsInfo.server?1 :0;
        $scope.networkCardSet=function(){
            var mark=findMark($scope.initcard,networkCards);
            $scope.currentCard=$scope.networks[mark];
        };
        $scope.isShowDnsInfo = function () {
            if ($scope.dnsSetting) {
                $scope.dnsServer = res.data.dnsInfo ? res.data.dnsInfo : {server:'',reserveServer:''};
            } else {
                $scope.dnsServer = {server:null,reserveServer:null};
            }
        };
    });

    function findMark(id,data){
        var mark;
        $(data).each(function(i,d){
            $.each(d,function(k,v){
                if(k==='id'&&v===id){
                    mark=i;
                }
            });
        });
        return mark;
    }


    $scope.submitSettings=function(cond){
        if(($scope.networkCard.ip.$dirty===true||$scope.networkCard.mask.$dirty===true||$scope.networkCard.gateway.$dirty===true||$scope.networkCard.server.$dirty===true||$scope.networkCard.reserver.$dirty===true)||($scope.networkCard.ip.$dirty===false&&$scope.networkCard.mask.$dirty===false&&$scope.networkCard.gateway.$dirty===false&&$scope.networkCard.server.$dirty===false&&$scope.networkCard.reserver.$dirty===false)){
            if($scope.currentCard.ip!==undefined&&$scope.currentCard.mask!==undefined&&$scope.currentCard.gateway!==undefined){
                if($scope.dnsSetting===1&&(($scope.networkCard.server.$error.server===true||$scope.networkCard.reserver.$error.reserver===true))){
                    $rootScope.addAlert({
                        type:'error',
                        content:'选择自定义DNS服务器时, 请正确服务器配置参数'
                    });
                    return;
                }
                $scope.dnsServer.server=$scope.dnsServer.server?$scope.dnsServer.server:'';
                $scope.dnsServer.reserveServer=$scope.dnsServer.reserveServer?$scope.dnsServer.reserveServer:'';
                if(cond){
                    var params={
                        id:$scope.currentCard.id,
                        useNetworkId:$scope.currentCard.useNetworkId?$scope.currentCard.useNetworkId:'',
                        ip:$scope.currentCard.ip,
                        mask:$scope.currentCard.mask,
                        gateway:$scope.currentCard.gateway,
                        server:$scope.dnsServer.server,
                        reserveServer:$scope.dnsServer.reserveServer
                    };
                    systemServices.networkSet(params).then(function(res){
                        res.status?$rootScope.addAlert({
                            type:'success',
                            content:'修改成功'
                        }):$rootScope.addAlert({
                            type:'error',
                            content:'修改失败, 原因为:'+res.errorMessage?res.errorMessage:'未知'
                        });
                    });
                }else{
                    $rootScope.addAlert({
                        type:'error',
                        content:'请正确填写相关网卡配置参数'
                    });
                }
            }else{
                $rootScope.addAlert({
                    type:'error',
                    content:'请完整网卡配置参数'
                });
            }
        }else{
            $rootScope.addAlert({
                type:'error',
                content:'请正确填写相关网卡配置参数再提交'
            });
        }
    };

    $scope.$watch('dnsSetting',function(){
        if($scope.dnsSetting===0){
            $scope.server=$scope.reserveServer='';
        }
    });
    $scope.stateGo=function(params){
        $state.go('network-list',params,{reload:'network-list'})  ;
    };
}

function networkCtrl($scope,$state,$stateParams,$rootScope,systemServices,$uibModal) {
    $scope.getData=function getCount(){
        systemServices.getCardBindedIp({networkCardId:$stateParams.id}).then(function(res){
            $scope.ipTable=res.data;
        });
    };
    $scope.submitSettings=function(){
        $($scope.ipTable).each(function(i,d){
            d.orderNo=i+1;
            d.networkCardId=parseInt($stateParams.id);
            if(i===0){
                d.isUsed=1;
            }else{
                d.isUsed=0;
            }
        });
        var params=$scope.ipTable;
        systemServices.saveDataSubmit(params).then(function(res){
            if(res){
                $rootScope.addAlert({
                    type:'success',
                    content:'状态更新成功'
                });
            }else{
                $rootScope.addAlert({
                    type:'error',
                    content:'状态更新失败'
                });
            }
        });
    };
    $scope.addIp=function(){
        $uibModal.open({
            templateUrl:'system_add_Ip_Address',
            size:'normal',
            controller:addIp,
            resolve:{
                init:function(){
                    return $stateParams.id;
                },
                update:function(){
                    return $scope.getData;
                }
            }
        });
        function addIp($scope,init,update,$uibModalInstance){
            $scope.ok=function(cond){
                if(cond){
                    var params = {
                        ip: $scope.dialogIp,
                        mask: $scope.dialogMask,
                        gateway: $scope.dialogGateway,
                        networkCardId: parseInt(init)
                    };
                    systemServices.addCardBindedIp(params).then(function(res){
                        if(res.data){
                            update();
                            $uibModalInstance.close(true);
                            $rootScope.addAlert({
                                type:'success',
                                content:'添加IP成功'
                            });
                        }else{
                            $uibModalInstance.close();
                            $rootScope.addAlert({
                                type:'error',
                                content:'添加IP失败'
                            });
                        }
                    });
                }else{
                    $scope.addIpTip=true;
                }
            };
            $scope.cancel=function(){
                $uibModalInstance.close();
            };
        }
    };
    $scope.editIp=function(item) {
        $uibModal.open({
            templateUrl: 'system_edit_Ip_Address',
            size: 'normal',
            controller: editIp,
            resolve: {
                init: function () {
                    return $stateParams.id;
                },
                item:function(){
                    return item;
                },
                update: function () {
                    return $scope.getData;
                }
            }
        });
        function editIp($scope,init,update,item,$uibModalInstance){
            systemServices.getServerNetworkById({networkId: item.id}).then(function (res) {
                $scope.ownValue = res.data;
            });
            $scope.ok =function(cond){
                if(cond){
                    var params = {
                        ip: $scope.ownValue.ip,
                        mask: $scope.ownValue.mask,
                        gateway: $scope.ownValue.gateway,
                        id: item.id
                    };
                    systemServices.modifyBindedIp(params).then(function(res){
                        if(res.data){
                            update();
                            $uibModalInstance.close(true);
                            $rootScope.addAlert({
                                type:'success',
                                content:'编辑IP成功'
                            });
                        }else{
                            $uibModalInstance.close();
                            $rootScope.addAlert({
                                type:'error',
                                content:'编辑IP失败'
                            });
                        }
                    });
                }else{
                    $scope.addIpTip=true;
                }
            };
            $scope.cancel=function(){
                $uibModalInstance.close();
            };
        }
    };
}

function systemTimesetCtrl ($scope,systemServices,$interval,$rootScope){
    systemServices.getSysTime().then(function(res){
        //console.log(res);
        if(res.status){
            $scope.timeNum=parseInt(moment(res.data.data.time).format('x'));
            $scope.hours=[];$scope.minutes=[];$scope.seconds=[];
            for(var i=0;i<24;i++){
                $scope.hours.push({
                    value:i,
                    label:i+' 时'
                });
            }
            for(var j=0;j<60;j++){
                $scope.minutes.push({
                    value:j,
                    label:j+' 分'
                });
                $scope.seconds.push({
                    value:j,
                    label:j+' 秒'
                });
            }
            $scope.sysTimeSet={
                format:'yyyy年 MM月 dd日',
                openState:false,
                dateInit:new Date($scope.timeNum),
                manualSet:function(fn){
                    $scope.sysTimeSet.openState=true;
                    fn&&Object.prototype.toString.call(fn)==='[object Function]'?fn():'';
                }
            };
            $scope.runTimer=function(timeNum){
                $scope.sysTimeProcess(timeNum);
                $scope.timer=$interval(function(){
                    $scope.sysTimeProcess(timeNum);
                    timeNum+=1000;
                },1000);
            };
            //$scope.runTimer($scope.timeNum) ;
            $scope.sysTimeProcess=function(timeNum){
                $scope.sysTimeSet.dateInit=new Date($scope.timeNum);
                $scope.sysSetOpt={
                    sysHour:moment(timeNum).hours(),
                    sysMin:moment(timeNum).minutes(),
                    sysSec:moment(timeNum).seconds()
                };
            };
            $scope.recountTimeNum=function(){
                $interval.cancel($scope.timer);
                $scope.newTimeNum=moment($scope.sysTimeSet.dateInit).format('YYYY-MM-DD')+' '+ (String($scope.sysSetOpt.sysHour).match(/\d{2}/)?$scope.sysSetOpt.sysHour:('0'+$scope.sysSetOpt.sysHour))+':'+(String($scope.sysSetOpt.sysMin).match(/\d{2}/)?$scope.sysSetOpt.sysMin:('0'+$scope.sysSetOpt.sysMin))+':'+(String($scope.sysSetOpt.sysSec).match(/\d{2}/)?$scope.sysSetOpt.sysSec:('0'+$scope.sysSetOpt.sysSec));
                $scope.runTimer(parseInt(moment($scope.newTimeNum).format('x')));
            };
            $scope.sysTimeOpt=res.data.data.type;$scope.syncRate=res.data.data.circle;
            $scope.shiftState=function(){
                if($scope.sysTimeOpt){
                    $scope.sysTimeSet.dateInit='';
                    $scope.sysSetOpt={
                        sysHour:'',
                        sysMin:'',
                        sysSec:''
                    };
                    $scope.timeSetIp=res.data.data.ip;
                    $scope.syncRate=res.data.data.circle;
                    $interval.cancel($scope.timer);
                }else{
                    $scope.timeSetIp='';
                    $scope.syncRate='';
                    systemServices.getSysTime().then(function(res) {
                        $scope.timeNum=parseInt(moment(res.data.timestamp).format('x'));
                        $scope.runTimer($scope.timeNum);
                    });
                }
            };
            $scope.shiftState();
            $scope.syncCycle=[
                {val:0,label:'每天一次'},
                {val:1,label:'每周一次'},
                {val:2,label:'每月一次'}
            ];
        }
    });
    $scope.submitData=function(){
        if(($scope.sysTimeOpt===1&&$scope.system_time.ipadd.$error.ipadd!==true&&$scope.timeSetIp!==''&&$scope.syncRate!=='')||$scope.sysTimeOpt===0){
            var params={
                type:$scope.sysTimeOpt,
                utcTime: moment($scope.newTimeNum).format('YYYY-MM-DD')+'T'+moment($scope.newTimeNum).format('hh:mm:ss')+'Z',
                ntpIp:$scope.timeSetIp,
                cirlceId:$scope.syncRate
            };
            systemServices.setSysTime(params).then(function(res){
                //console.log(res);
                if(res.data.status===0){
                    $rootScope.addAlert({
                        type:'success',
                        content:'设置成功'
                    });
                }else if(res.data.status===-1){
                    $rootScope.addAlert({
                        type:'error',
                        content:'设置失败'
                    });
                }
            });
        }else{
            $rootScope.addAlert({
                type:'error',
                content:'请正确输入相应的ip地址与同步时间再继续'
            });
        }
    };
}

//邮箱设置
function systemEmailCtrl($rootScope,$scope,systemServices){
    systemServices.getSysEmail({}).then(function(res){
        console.log(res);
        if(res.data.length >= 1){
            $scope.emailName = res.data[0].emailRess;
            $scope.emailPwd = res.data[0].emailPassword;
            $scope.emailSmtp = res.data[0].emailSmtp;
            $scope.emailPort = res.data[0].emailPort;
            $scope.submitData = function(){
                var emailName = $scope.emailName,
                    emailPwd = $scope.emailPwd,
                    emailSmtp = $scope.emailSmtp,
                    emailPort = $scope.emailPort;
                if(emailName !== '' && emailPwd !== '' && emailSmtp !== '' && emailPort !== ''){
                    var data = {
                        "id":res.data[0].id,
                        "emailRess":emailName,
                        "emailPassword":emailPwd,
                        "emailSmtp":emailSmtp,
                        "emailPort":emailPort
                    };
                    systemServices.updateSysEmail(data).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
                            $rootScope.addAlert({
                                type:'success',
                                content:'设置成功'
                            });
                        }else{
                            $rootScope.addAlert({
                                type:'error',
                                content:'设置失败，'+res.data.errorMessage
                            });
                        }
                    },function(err){
                        console.log(err);
                        $rootScope.addAlert({
                            type:'error',
                            content:'设置失败'
                        });
                    });
                }else{
                    $rootScope.addAlert({
                        type:'error',
                        content:'请将信息填写完整'
                    });
                }  
            };
        }else{
            $scope.submitData = function(){
                var emailName = $scope.emailName,
                    emailPwd = $scope.emailPwd,
                    emailSmtp = $scope.emailSmtp,
                    emailPort = $scope.emailPort;
                if(!emailName){
                    $rootScope.addAlert({
                        type:'error',
                        content:'请输入有效的邮箱'
                    });
                    return false;
                }
                if(!emailPwd){
                    $rootScope.addAlert({
                        type:'error',
                        content:'请输入有效的密码'
                    });
                    return false;
                }
                if(emailName !== '' && emailPwd !== '' && emailSmtp !== '' && emailPort !== ''){
                    var data = {
                        "emailRess":emailName,
                        "emailPassword":emailPwd,
                        "emailSmtp":emailSmtp,
                        "emailPort":emailPort
                    };
                    systemServices.addSysEmail(data).then(function(res){
                        console.log(res);
                        if(res.data.status === 1){
                            $rootScope.addAlert({
                                type:'success',
                                content:'设置成功'
                            });
                        }else{
                            $rootScope.addAlert({
                                type:'error',
                                content:'设置失败，'+res.data.errorMessage
                            });
                        }  
                    },function(err){
                        console.log(err);
                        $rootScope.addAlert({
                            type:'error',
                            content:'设置失败'
                        });
                    });
                }else{
                    $rootScope.addAlert({
                        type:'error',
                        content:'请将信息填写完整'
                    });
                }  
            };
        }
    },function(err){
        console.log(err);
    });
}

//管理员列表
function systemUserCtrl(){

}

//添加管理员
function systemUserCreatCtrl($scope,$state,tools,systemServices,SweetAlert){
    //返回列表
    $scope.backList = function(){
        $state.go('system-user');
    };

    $scope.$watch('userName',function(){
        if($scope.userName === ''){
            $("#userName").removeClass('has-warning').addClass('has-warning').find('span').text('用户名不能为空');
        }else{
            $("#userName").removeClass('has-warning').find('span').text('');
        }
    });
    $scope.$watch('userPwd',function(){
        if($scope.userPwd === ''){
            $("#userPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码不能为空');
        }else if(!tools.fnValidate.Password.test($scope.userPwd)){
            $("#userPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码需要6到20位之间，且需包含数字和字母');
        }else{
            $("#userPwd").removeClass('has-warning').find('span').text('');
        }
    });
    $scope.$watch('userPwdConfirm',function(){
        if($scope.userPwdConfirm === ''){
            $("#userPwdConfirm").removeClass('has-warning').addClass('has-warning').find('span').text('密码不能为空');
        }else if($scope.userPwdConfirm !== $scope.userPwd){
            $("#userPwdConfirm").removeClass('has-warning').addClass('has-warning').find('span').text('二次密码输入不正确');
        }else{
            $("#userPwdConfirm").removeClass('has-warning').find('span').text('');
        }
    });

    $scope.submitUser = function(){
        if(!$scope.userName){$scope.userName='';}
        if(!$scope.nickName){$scope.nickName='';}
        if(!$scope.userPwd){$scope.userPwd='';}
        if(!$scope.userPwdConfirm){$scope.userPwdConfirm='';}
        if($scope.userName === '' || $scope.userPwd === '' || $scope.userPwdConfirm === ''){
            SweetAlert.swal({
                title: "请将信息填写完整",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(!tools.fnValidate.Password.test($scope.userPwd)){
            SweetAlert.swal({
                title: "密码需要6到20位之间，且需包含数字和字母",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        if($scope.userPwdConfirm !== $scope.userPwd){
            SweetAlert.swal({
                title: "二次密码输入不正确",
                type: "warning",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
            return false;
        }
        var data = {
            "username":$scope.userName,
            "password":$scope.userPwd,
            "nickname":$scope.nickName
        };
        systemServices.userCreate(data).then(function(res){
            console.log(res);
            if(res.data.status === 1){
                SweetAlert.swal({
                    title: "创建成功!",
                    type: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                $state.go('system-user');
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
                text: "网络不畅",
                confirmButtonColor: "#7B69B3",
                confirmButtonText: "确定"
            });
        });
    };
}

//修改管理员
function systemUserUpdateCtrl($scope,$state,$stateParams,tools,systemServices,SweetAlert){
    var id = $stateParams.id;

    //返回列表
    $scope.backList = function(){
        $state.go('system-user');
    };    

    $scope.$watch('userName',function(){
        if($scope.userName === ''){
            $("#userName").removeClass('has-warning').addClass('has-warning').find('span').text('用户名不能为空');
        }else{
            $("#userName").removeClass('has-warning').find('span').text('');
        }
    });
    $scope.$watch('oldPwd',function(){
        if($scope.oldPwd === ''){
            $("#oldPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码不能为空');
        }else if(!tools.fnValidate.Password.test($scope.oldPwd)){
            $("#oldPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码需要6到20位之间，且需包含数字和字母');
        }else{
            $("#oldPwd").removeClass('has-warning').find('span').text('');
        }
    });
    $scope.$watch('newPwd',function(){
        if($scope.newPwd === ''){
            $("#newPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码不能为空');
        }else if(!tools.fnValidate.Password.test($scope.newPwd)){
            $("#newPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码需要6到20位之间，且需包含数字和字母');
        }else{
            $("#newPwd").removeClass('has-warning').find('span').text('');
        }
    });
    $scope.$watch('confirmPwd',function(){
        if($scope.confirmPwd === ''){
            $("#confirmPwd").removeClass('has-warning').addClass('has-warning').find('span').text('密码不能为空');
        }else if($scope.confirmPwd !== $scope.newPwd){
            $("#confirmPwd").removeClass('has-warning').addClass('has-warning').find('span').text('二次密码输入不正确');
        }else{
            $("#confirmPwd").removeClass('has-warning').find('span').text('');
        }
    });

    systemServices.getUserById({"id":id}).then(function(resUser){
        console.log(resUser);
        $scope.userName = resUser.data.userName;
        $scope.nickName = resUser.data.nickName;

        $scope.submitUser = function(){
            if(!$scope.userName){$scope.userName='';}
            if(!$scope.nickName){$scope.nickName='';}
            if(!$scope.oldPwd){$scope.oldPwd='';}
            if(!$scope.newPwd){$scope.newPwd='';}
            if(!$scope.confirmPwd){$scope.confirmPwd='';}
            if($scope.userName === '' || $scope.oldPwd === '' || $scope.newPwd === '' || $scope.confirmPwd === ''){
                SweetAlert.swal({
                    title: "请将信息填写完整",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            if(!tools.fnValidate.Password.test($scope.newPwd)){
                SweetAlert.swal({
                    title: "密码需要6到20位之间，且需包含数字和字母",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            if($scope.confirmPwd !== $scope.newPwd){
                SweetAlert.swal({
                    title: "二次密码输入不正确",
                    type: "warning",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
                return false;
            }
            var data = {
                "id":Number(id),
                "username":$scope.userName,
                "password":$scope.oldPwd,
                "newpassword":$scope.newPwd,
                "nickname":$scope.nickName
            };
            systemServices.userUpdate(data).then(function(res){
                console.log(res);
                if(res.data.status === 1){
                    SweetAlert.swal({
                        title: "修改成功!",
                        type: "success",
                        timer: 1000,
                        showConfirmButton: false
                    });
                    $state.go('system-user');
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
                    title: "创建失败!",
                    type: "error",
                    text: "网络不畅",
                    confirmButtonColor: "#7B69B3",
                    confirmButtonText: "确定"
                });
            });
        };
    },function(errUser){
        console.log(errUser);
    });
}