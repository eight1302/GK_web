/**
 * Created by pcboby on 10/24/16.
 */

import {system} from './system.module';
export default function () {
    system
        .factory('systemServices', /*@ngInject*/function ($http, URI) {
            return {
                'getNetworkCount': getNetworkCount,
                'networkSet':networkSet,
                'getCardBindedIp':getCardBindedIp,
                'addCardBindedIp':addCardBindedIp,
                'saveDataSubmit':saveDataSubmit,
                'modifyBindedIp':modifyBindedIp,
                'deleteBindedIp':deleteBindedIp,
                'getServerNetworkById':getServerNetworkById,
                'getSysTime':getSysTime,
                'setSysTime':setSysTime,
                'getSysEmail':getSysEmail,
                'addSysEmail':addSysEmail,
                'updateSysEmail':updateSysEmail,
                'userList':userList,
                'deleteUser':deleteUser,
                'userCreate':userCreate,
                'userUpdate':userUpdate,
                'getUserById':getUserById
            };


            /**
             *
             *获取网卡数量
             */
            function getNetworkCount(data) {
                return $http({
                    url: URI + '/api/network/getAllNetworkCard',
                    method: 'get',
                    params: data
                });
            }

            /**
             * 网络设置提交
             */
            function networkSet(data) {
                return $http({
                    url: URI + '/api/network/saveNetworkInfo',
                    data: data,
                    method: 'post',
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取TCP高级设置绑定IP
             */
            function getCardBindedIp(data){
                return $http({
                    url:URI+'/api/network/getServerNetworkByCard',
                    method:'get',
                    params:data
                });
            }

            /**
             * 网卡添加绑定IP地址
             */
            function addCardBindedIp(data){
                return $http({
                    url:URI+'/api/network/insertServerNetwork',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 绑定IP更新
             *
             */
            function saveDataSubmit(data){
                return $http({
                    url:URI+'/api/network/updateServerNetworkUse',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }


            /**
             * 修改绑定IP
             */
            function modifyBindedIp(data){
                return $http({
                    url:URI+'/api/network/updateServerNetwork',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 删除对应IP
             */
            function deleteBindedIp(data){
                return $http({
                    url:URI+'/api/network/deleteServerNetwork',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 根据id获取当前ip详情
             */
            function getServerNetworkById(data){
                return $http({
                    url: URI + '/api/network/getServerNetworkById',
                    method: 'get',
                    params: data,
                    responseType: 'json',
                    headers: {
                        'content-Type': 'application/json;chartset=UTF-8'
                    }
                });
            }

            /**
             * 获取系统时间
             */
            function getSysTime(){
                return $http({
                    url:URI+'/api/system/getSysTime',
                    method:'get',
                    params:''
                });
            }

            /**
             * 设置系统时间
             */
            function setSysTime(data){
                return $http({
                    url:URI+'/api/system/setSysTime',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 获取系统邮件
             */
            function getSysEmail(params){
                return $http({
                    url:URI + '/api/network/getServerEmail',
                    method:'get',
                    params:params
                });
            }

            /**
             * 添加系统邮件
             */
            function addSysEmail(data){
                return $http({
                    url:URI + '/api/network/addServerEmail',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 修改系统邮件
             */
            function updateSysEmail(data){
                return $http({
                    url:URI + '/api/network/updateServerEmail',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 管理员列表
             */
            function userList(data) {
                return $http({
                    url: URI + '/api/user/getUserList',
                    data: data,
                    method: 'post',
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 删除管理员
             */
            function deleteUser(data) {
                return $http({
                    url: URI + '/api/user/deleteUser',
                    data: data,
                    method: 'post',
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 管理员创建
             */
            function userCreate(data) {
                return $http({
                    url: URI + '/api/user/addUser',
                    data: data,
                    method: 'post',
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 管理员修改
             */
            function userUpdate(data) {
                return $http({
                    url: URI + '/api/user/updateUser',
                    data: data,
                    method: 'post',
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取管理员
             */
            function getUserById(params){
                return $http({
                    url:URI + '/api/user/showUser',
                    method:'get',
                    params:params
                });
            }
        });
}


