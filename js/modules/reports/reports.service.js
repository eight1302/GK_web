/**
 * Created by pcboby on 10/24/16.
 */
import {reports} from './reports.module';

export default function(){
    reports
        .factory('reportsService', /*@ngInject*/function($http, URI){
            var service = {
                snapshotList: snapshotList,
                createSnapshot:createSnapshot,
                madeList: madeList,
                assetHardware:assetHardware,
                assetSoftwareProcess:assetSoftwareProcess,
                assetSoftwareService:assetSoftwareService,
                assetSoftwareProgress:assetSoftwareProgress,
                assetSoftwarePatch:assetSoftwarePatch,
                saveConditionData: saveConditionData,
                getConditionData: getConditionData,
                createTemplate: createTemplate,
                updateTemplate: updateTemplate,
                selectTemplate: selectTemplate,
                getAllTemplateInfo: getAllTemplateInfo,
                createCustomReports: createCustomReports,
                updateCustomReports: updateCustomReports,
                selectCustomReports: selectCustomReports,
                exportReportInfo: exportReportInfo,
                downloadFile: downloadFile,
                deleteMade: deleteMade,
                auditList: auditList,
                auditExport: auditExport,
                departmentStructure: departmentStructure,
                getDepartmentInfo:getDepartmentInfo,
                getSafetyReport:getSafetyReport,
                getEventCategory:getEventCategory,
                getStateCategory:getStateCategory,
                getSafeDetail:getSafeDetail,
                getPieInfo:getPieInfo
            };

            return service;

            /**
             * 获取饼图数据
             */
            function getPieInfo(data){
                return $http({
                    url:URI+'/api/event/pieChart',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }


            /**
             * 获取事件详情
             */
            function getSafeDetail(eventId){
                return $http({
                    url:URI+'/api/event/'+eventId+'/event',
                    method:'get',
                    params:null
                });
            }

            /**
             * 获取安全报告事件类别
             */
            function getEventCategory(){
                return $http({
                    url:URI+'/api/event/eventType',
                    method:'get',
                    params:null
                });
            }

            /**
             * 获取安全报告状态类别
             */
            function getStateCategory(){
                return $http({
                    url:URI+'/api/event/status',
                    method:'get',
                    params:null
                });
            }

            /**
             * 获取安全报告列表
             */
            function getSafetyReport(data){
                return $http({
                    url:URI+'/api/event/securityEvent',
                    method:'post',
                    data:data,
                    responseType:'json',
                    headers:{
                        'content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 获取部门信息
             */
            function getDepartmentInfo(data){
                return $http({
                    url:URI+'/api/department/clientIdReturnDepartment',
                    method:'get',
                    params:data
                });
            }
            /**
             * 快照列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function snapshotList(data){
                return $http({
                    method:'post',
                    url:URI + '/api/device/getClientSnapshotList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 定制报告列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function madeList(data){
                return $http({
                    method:'post',
                    url:URI + '/api/report/getAllReportInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 创建模板->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function createTemplate(data){
                return $http({
                    method:'post',
                    url:URI + '/api/report/insertTemplateInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 更新模板->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function updateTemplate(data){
                return $http({
                    method:'post',
                    url:URI + '/api/report/updateTemplateInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id查询模板->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function selectTemplate(params){
                return $http({
                    method:'get',
                    url:URI + '/api/report/getTemplateInfo',
                    params:params
                });
            }

            /**
             * 获取全部模板->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function getAllTemplateInfo(params){
                return $http({
                    method:'get',
                    url:URI + '/api/report/getAllTemplateInfo',
                    params:params
                });
            }

            /**
             * 创建定制报告->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function createCustomReports(data){
                return $http({
                    method:'post',
                    url:URI + '/api/report/insertReportInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 更新定制报告->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function updateCustomReports(data){
                return $http({
                    method:'post',
                    url:URI + '/api/report/updateReportInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id查询报告->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function selectCustomReports(params){
                return $http({
                    method:'get',
                    url:URI + '/api/report/getReportInfo',
                    params:params
                });
            }

            /**
             * 导出报告->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function exportReportInfo(params){
                return $http({
                    method:'get',
                    url:URI + '/api/report/exportReportInfo',
                    params:params
                });
            }

            /**
             * 下载导出报告->MW
             */
            function downloadFile(data){
                window.location.href = URI + '/api/report/downloadFile?fileName='+data.fileName+'&fileSize='+data.fileSize;
            }

            /**
             * 删除定制报告->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function deleteMade(data){
                return $http({
                    method:'post',
                    url:'',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }


            function createSnapshot(data) {
                return $http({
                    method: 'post',
                    url: URI + '/api/device/insertClientSnapshot',
                    data: data,
                    responseType: 'json',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    }})
                ;
            }


            function assetHardware(data){
                return $http({
                    method:'get',
                    url:URI+'/api/device/getSnapshotHdInfo',
                    params:data
                });
            }

            function assetSoftwareService(data){
                return $http({
                    method:'post',
                    url:URI+'/api/device/getSnapshotClientService',
                    data:data,
                    responseType:'json',
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            function assetSoftwareProgress(data){
                return $http({
                    method:'post',
                    url:URI+'/api/device/getSnapshotClientSoftware',
                    data:data,
                    responseType:'json',
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            function assetSoftwarePatch(data){
                return $http({
                    method:'post',
                    url:URI+'/api/device/getSnapshotClientPatch',
                    data:data,
                    responseType:'json',
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            function assetSoftwareProcess(data){
                return $http({
                    method:'post',
                    url:URI+'/api/device/getSnapshotClientProcess',
                    data:data,
                    responseType:'json',
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8'
                    }
                });
            }

            /**
             * 保存查询条件->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function saveConditionData(data){
                return $http({
                    method:'post',
                    url:URI + '/api/search/insertSearchParam',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取查询条件->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function getConditionData(data){
                return $http({
                    method:'post',
                    url:URI + '/api/search/getSearchParam',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 审计报告列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function auditList(data){
                return $http({
                    method:'post',
                    url:URI + '/api/audit/getOperationLogList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 导出审计报告->MW->UI的数据交互
             *
             */
            function auditExport(data){
                if(data.type === 0){
                    window.location.href = URI + '/api/audit/exportOperationLog?flag='+data.flag+'&ids='+data.ids;
                }else{
                    window.location.href = URI + '/api/audit/exportOperationLog?flag='+data.flag+'&timeStampStart='+data.startTime+'&timeStampEnd='+data.endTime;
                }
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
        });
}