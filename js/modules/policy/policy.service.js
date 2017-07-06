import {policy} from "./policy.module";

export default function() {
    policy
        .factory('policyService', /*@ngInject*/function($http, URI){
            var service = {
                whitelist: whitelist,
                whitelistDelete: whitelistDelete,
                whitelistApp: whitelistApp,
                whitelistAppCreate: whitelistAppCreate,
                whitelistAppDelete: whitelistAppDelete,
                whitelistUsb: whitelistUsb,
                whitelistUsbCreate: whitelistUsbCreate,
                whitelistUsbDelete: whitelistUsbDelete,
                whitelistCertificate: whitelistCertificate,
                whitelistCertificateCreate: whitelistCertificateCreate,
                whitelistCertificateDelete: whitelistCertificateDelete,
                whitelistAppUpdate: whitelistAppUpdate,
                checkWhiteListInfo: checkWhiteListInfo,
                whitelistCreate: whitelistCreate,
                whitelistUpdate: whitelistUpdate,
                getWhitelistById: getWhitelistById,
                getAllClient: getAllClient,
                getAllWhiteList: getAllWhiteList,
                exportWhiteList: exportWhiteList,
                importWhitelist: importWhitelist,
                safeList: safeList,
                safeDelete: safeDelete,
                safeCreate: safeCreate,
                safeUpdate: safeUpdate,
                getSafeById: getSafeById,
                departmentStructure: departmentStructure,
                saveSystemSet: saveSystemSet,
                getAllSystemSet: getAllSystemSet
            };

            return service;

            /**
             * 白名单列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function whitelist(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/getAllWhiteListInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单删除->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistDelete(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/deleteWhiteListInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单列表(应用程序)->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function whitelistApp(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/getProgramInfoByWhiteList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单应用程序添加->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistAppCreate(data){
                return $http({
                    method:'POST',
                    url:URI + '',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单应用程序删除->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistAppDelete(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/deleteProgramInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单列表(USB)->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function whitelistUsb(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/getUsbInfoByWhiteList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单USB添加->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistUsbCreate(data){
                return $http({
                    method:'POST',
                    url:URI + '',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单USB删除->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistUsbDelete(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/deleteUSBInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单列表(证书)->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function whitelistCertificate(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/getQualificationInfoByWhiteList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单证书添加->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistCertificateCreate(data){
                return $http({
                    method:'POST',
                    url:URI + '',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单证书删除->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistCertificateDelete(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/deleteQualificationInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 白名单列表更新(应用程序)->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function whitelistAppUpdate(data){
                return $http({
                    method:'POST',
                    url:URI + '',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 检查白名单是否在扫描->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function checkWhiteListInfo(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/checkWhiteListInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 添加白名单->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistCreate(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/insertWhiteListInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 修改白名单->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function whitelistUpdate(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/updateWhiteListInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id获取白名单信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function getWhitelistById(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/whiteList/getWhiteListInfoById',
                    params:params
                });
            }

            /**
             * 获取全部终端->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function getAllClient(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/whiteList/getAllClient',
                    params:params
                });
            }

            /**
             * 获取全部白名单->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function getAllWhiteList(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/policy/getAllWhiteList',
                    params:params
                });
            }

            /**
             * 导出白名单->MW->UI的数据交互
             *
             */
            function exportWhiteList(ids){
                window.location.href = URI + '/api/whiteList/export?ids='+ids;
            }

            /**
             * 导入白名单->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function importWhitelist(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/whiteList/upload',
                    data:data,
                    //responseType:'json',
                    headers:{
                        "Content-Type":undefined
                    },
                    transformRequest: angular.identity
                });
            }

            /**
             * 获取安全策略列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function safeList(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/policy/getPolicyList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 安全策略删除->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function safeDelete(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/policy/deletePolicy',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 添加安全策略->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function safeCreate(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/policy/insertPolicy',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 修改安全策略->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function safeUpdate(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/policy/updatePolicy',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id获取安全策略信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function getSafeById(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/policy/getPolicyInfoById',
                    params:params
                });
            }

            /**
             * 获取树形的部门终端数据->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function departmentStructure(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/department/departmentStructure',
                    params:params
                });
            }

            /**
             * 保存白名单管理->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function saveSystemSet(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/system/saveSystemSet',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取白名单管理数据->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function getAllSystemSet(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/system/getAllSystemSet',
                    params:params
                });
            }
        });
}
