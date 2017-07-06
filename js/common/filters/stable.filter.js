/**
 * Created by jinyong on 16-9-5.
 */
export default {
    'tableUnit' : /*@ngInject*/tableUnit
};

function tableUnit(){
    return function (value) {
        var map = {
            'device': '台设备',
            'user': '个用户',
            'log': '条日志'
        };
        return map[value] || value;
    };
}
