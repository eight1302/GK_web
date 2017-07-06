/**
 * Created by jinyong on 16-9-5.
 */
export default {
    'testTable' : /*@ngInject*/testTable
};

function testTable(testTableRes, CWD) {

    var tableObj = {
        scope: false,
        restrict: 'E',
        require: '^stable',
        replace: true,
        templateUrl: CWD + 'templates/common/test/testTable.html',
        link: link
    };

    return tableObj;

    ////////

    function link(scope, element, attr, ctrl) {
        ctrl.setConfig({
            name: 'device',
            pagination: true,
            totalCount: true,
            disableToolbar: false,
            numPerPage: 5,
            searchAttr:'id',
            pipeService: getAll,
            getCount: getCount,
            filter: true,
            filterOptions: [
                {'name': 'name', 'display': '姓名', 'input': 'name', 'option': true, value: "",  'options': [{'value': 'Stark', 'text': 'Stark'},{'value': 'Robin', 'text': 'Robin'}]},
                {'name': 'level', 'display': '事件等级', 'input': 'checkbox', 'option': true, value: -1, 'options': [{'value': -1, 'text': '全部'},{'value': 'WARN', 'text': '警告'},{'value': 'ERROR', 'text': '丢弃'}, {'value': 'REJECTBOTH', 'text': '阻断'}]},
                {'name': 'sourceName', 'display': '起源', 'input': 'string', 'option': false, value: ""},
                {'name': 'age', 'display': '年龄', 'input': 'string', 'option': true, value: 0,'options': [{'value': 22, 'text': '22'},{'value': 50, 'text': '50'},{'value': 30, 'text': '30'},{'value': 86, 'text': '86'}]},
                {'name': 'id', 'display': 'id', 'input': 'string', 'option': true, value: "",'options': [{'value': 1, 'text': '1'},{'value': 2, 'text': '2'},{'value': 3, 'text': '3'},{'value': 4, 'text': '4'}]},
                {'name': 'appLayerProtocol', 'display': '是否安装客户端', 'input': 'string', 'option': false, value: ""}
            ],
            toolbar_selectAll:selectAllData,
            toolbar_operator:operatorData,
            toolbar_add:addData,
            toolbar_delete:deleteData,
            filter_save:saveConditionData,
            viewTypes: ['list', 'plain'],
            cols: [{'name':'name', 'text':'姓名'},{'name':'age', 'text':'年龄'},{'name':'id', 'text':'id'},{'name':'saved', 'text':'saved people'}]
        });

        function getAll(params){
            var payload = params || {};
            return testTableRes.getPage(payload).then(function(data){
                console.log(data);
                return data.data;
            });
        }

        function getCount(params){
            var payload = params || {};
            return testTableRes.getPage(payload).then(function(data){
                return data.count;
            });
        }

        //全选功能
        function selectAllData(){
            var status = $("#selectAllData").prop("checked");
            if(status === false){
                $("#terminalList").find("input[type='checkbox']").prop("checked",true);
            }else{
                $("#terminalList").find("input[type='checkbox']").prop("checked",false);
            }
            console.log('全选');
        }

        //操作功能
        function operatorData(){
            console.log('操作');
        }

        //增加功能
        function addData(){
            console.log('增加');
            window.location.href = '/';
        }

        //删除功能
        function deleteData(){
            console.log('删除');
        }

        //保存筛选条件功能
        function saveConditionData(){
            console.log('保存筛选条件');
        }
    }
}