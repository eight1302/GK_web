import {enterprise} from "./enterprise.module";

export default function() {
    enterprise
        .factory('enterpriseService', /*@ngInject*/function($http, URI){            
            var service = {
                terminalList: terminalList,
                addTerminalData: addTerminalData,
                updateTerminalData: updateTerminalData,
                queryTerminalById: queryTerminalById,
                deleteTerminalData: deleteTerminalData,
                uninstallTerminal: uninstallTerminal,
                mergeTerminalData: mergeTerminalData,
                saveConditionData: saveConditionData,
                getConditionData: getConditionData,
                terminalHardware: terminalHardware,
                terminalUpdateHdInfo: terminalUpdateHdInfo,
                terminalClientProcess: terminalClientProcess,
                terminalClientService: terminalClientService,
                terminalClientSoftware: terminalClientSoftware,
                terminalClientPatch: terminalClientPatch,
                terminalUpdateSoftwareInfo: terminalUpdateSoftwareInfo,
                downloadTemplate: downloadTemplate,
                departmentData : departmentData,
                clientIdReturnDepartment:clientIdReturnDepartment,
                addDepartmentData : addDepartmentData,
                deletedepartmentData : deletedepartmentData,
                querydepartmentById : querydepartmentById,
                updatedepartmentData : updatedepartmentData,
                departmentAll : departmentAll,
                SubDepartment : SubDepartment,
                departmentClient : departmentClient,
                getAllPolicy :getAllPolicy,
                clientIdReturnPolicyInfo:clientIdReturnPolicyInfo,
                departmentIdReturnPolicyInfo:departmentIdReturnPolicyInfo,
                topodepartment : topodepartment,
                removeDepartment : removeDepartment,
                departmentRemoveClient : departmentRemoveClient,
                moveDepartment : moveDepartment,
                moveClientToDepartment : moveClientToDepartment,
                clientIdReturnLabelInfo : clientIdReturnLabelInfo,
                departmentStructure : departmentStructure,
                indexLablePage : indexLablePage,
                createLableinfo : createLableinfo,
                deleteLabelInfo : deleteLabelInfo,
                ReturnLabelInfo : ReturnLabelInfo,
                updateLableinfo : updateLableinfo
            };

            return service;

            /**
             * 终端列表->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function terminalList(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/getAllClient',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 增加终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function addTerminalData(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/insertClient',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 修改终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function updateTerminalData(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/updateClient',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id查询终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function queryTerminalById(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/device/getClientInfo',
                    params:params
                });
            }

            /**
             * 删除终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function deleteTerminalData(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/deleteClient',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 卸载终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function uninstallTerminal(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/uninstallDevice',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 合并终端信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function mergeTerminalData(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/handleClientMerge',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
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
                    method:'POST',
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
                    method:'POST',
                    url:URI + '/api/search/getSearchParam',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端硬件信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalHardware(params){
                return $http({
                    method:'GET',
                    url:URI + '/api/device/getHdInfo',
                    params:params
                });
            }

            /**
             * 终端硬件信息编辑->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalUpdateHdInfo(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/updateHdInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端软件信息(正在运行的程序)->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalClientProcess(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/getClientProcess',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端软件信息(正在运行的服务)->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalClientService(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/getClientService',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端软件信息(已安装的软件)->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalClientSoftware(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/getClientSoftware',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端软件信息(补丁)->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalClientPatch(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/getClientPatch',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端软件信息编辑->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function terminalUpdateSoftwareInfo(data){
                return $http({
                    method:'POST',
                    url:URI + '/api/device/updateSoftwareInfo',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据终端id获取部门->MW->UI的数据交互
             */
            function clientIdReturnDepartment(params){
                return $http({
                    metod:'GET',
                    url:URI + '/api/department/clientIdReturnDepartment',
                    params:params
                });
            }

            /**
             * 根据终端id获取策略->MW->UI的数据交互
             */
            function clientIdReturnPolicyInfo(params){
                return $http({
                    metod:'GET',
                    url:URI + '/api/department/clientIdReturnPolicyInfo',
                    params:params
                });
            }

            /**
             * 根据终端id获取标签->MW->UI的数据交互
             */
            function clientIdReturnLabelInfo(params){
                return $http({
                    metod: 'GET',
                    url: URI + '/api/department/clientIdReturnLabelInfo?clientId='+params,
                });
            }

            /**
             * 导出报告->MW
             */
            function downloadTemplate(id){
                window.location.href = URI + '/api/downloadTemplate?id='+id;
            }

            /**
             * 部门信息->MW->UI的数据交互
             *
             * 返回对象是JSON数据格式
             * */
            function departmentData(data) {
                return $http({
                    method:'POST',
                    url:URI+'/api/department/indexDepartment', //http://172.18.6.213:8080
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 终端绑定部门-_MW->UI的数据交互
             *
             * 返回值为普通类型
             */
            function departmentClient(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/departmentLinkClient?'+data,
                });
            }

            /**
             * 增加部门信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function addDepartmentData(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/createDepartment',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取上级部门->MW->UI的数据交互
             *
             * 返回的json数据  departmentAllList
             */
            function departmentAll(data) {
                return $http({
                    method:'POST',
                    url:URI+'/api/department/departmentAllList',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 删除部门信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function deletedepartmentData(data){

                return $http({
                    method:'POST',
                    url:URI+'/api/department/statusDepartment',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 根据id查询部门信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function querydepartmentById(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/queryIdDepartment',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }

                });
            }

            /**
             * 修改部门信息->MW->UI的数据交互
             *
             * 返回值：json格式
             */
            function updatedepartmentData(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/updateDepartment',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }


            /**
             * 部门显示获取策略信息
             *
             * 获取方式get
             */

            function departmentIdReturnPolicyInfo(params){
               return $http({
                   method:'GET',
                   url:URI+'/api/department/departmentIdReturnPolicyInfo',
                   params:params
               });
            }


            /**
             * 部门拓扑图列表显示->MW->UI的数据交互
             */
            function topodepartment(params){
                var paramshtml;
                if(params === null){
                    paramshtml = '';
                }else{
                    paramshtml = '?departmentId='+params;
                }
                return $http({
                    method:'GET',
                    url:URI+'/api/department/departmentTapView?departmentId='+paramshtml //http://172.18.6.213:8080
                });
            }
            /**
             * 部门拓扑图删除终端->MW->UI的数据交互
             */
            function departmentRemoveClient(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/departmentRemoveClient?'+data,

                });
            }
            /**
             * 部门拓扑图删除整个部门以及部门下的子部门终端->MW->UI的数据交互
             *
             * 请求方式POST
             */
            function removeDepartment(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/removeDepartment?'+data,
                });
            }

            /**
             * 部门拓扑图部门切换操作->MW->UI的数据交互
             *
             * 请求方式POST
             */
            function moveDepartment(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/moveDepartment?'+data,
                });
            }

            /**
             * 终端拓扑图部门切换操作->MW->UI的数据交互
             *
             * 请求方式POST
             */
            function moveClientToDepartment(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/moveClientToDepartment?'+data,
                });
            }
            /**
             * 标签信息->MW->UI的数据交互
             *
             * 返回对象是JSON数据格式
             * */
            function indexLablePage(data) {
                return $http({
                    method: 'POST',
                    url: URI + '/api/department/indexLablePage',
                    data: data,
                    responseType: 'json',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                });
            }

            /**
             *添加标签->MW->UI的数据交互
             *
             * 返回对象是json数据格式
             */
            function createLableinfo(data){
                return $http({
                    method: 'POST',
                    url: URI + '/api/department/createLableinfo',
                    data: data,
                    responseType: 'json',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 获取树形的部门终端数据->MW->UI的数据交互
             *
             * 返回值：json格式list
             */
            function departmentStructure(params) {
                return $http({
                    method: 'GET',
                    url: URI + '/api/department/departmentStructure',
                    params: params
                });
            }

           /**
             *删除标签->MW->UI的数据交互
             *
             * 返回对象是json数据格式
             */
            function deleteLabelInfo(params){
               return $http({
                   method: 'POST',
                   url: URI + '/api/department/deleteLabelInfo',
                   params: params,
               });
            }

            /**
             * 根据标签ID查询到标签的信息
             *
             * 返回对象是json数据
             * */
            function ReturnLabelInfo(params){
                return $http({
                    method: 'GET',
                    url: URI + '/api/department/idReturnLabelInfo',
                    params: params
                });
            }

            /**
             * 修改标签->MV->UI的数据交互
             *
             * 返回的对象格式JSON
             * */
            function updateLableinfo(data){
                return $http({
                    method: 'POST',
                    url: URI + '/api/department/updateLableinfo',
                    data: data,
                    responseType: 'json',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 绑定部门获取数据信息->MV->UI的数据交互
             *
             * 返回值是json格式
             */
            function SubDepartment(data){
                return $http({
                    method:'POST',
                    url:URI+'/api/department/querySubDepartment',
                    data:data,
                    responseType:'json',
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    }
                });
            }

            /**
             * 创建部门策略列表->MW->UI的数据交互
             */
            function getAllPolicy(params){
                return $http({
                    metod:'GET',
                    url:URI+'/api/policy/getAllPolicy',
                    params:params
                });
            }

        });
}
