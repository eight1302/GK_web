/**
 * Created by jinyong on 16-9-5.
 */
export default {
    'sec2Time' : /*@ngInject*/sec2Time,
    'transform' : /*@ngInject*/transform
};

/**
 * seconds to time duration.
 */
function sec2Time(){
    /**
     * formart:支持H,HH,m,mm,s,ss(具体含义参照date filter)
     */
    return function (value, format) {
        function z(n, flag) { return (flag?(n < 10 ? '0' : ''):'') + n; }
        var seconds = z(value % 60, format.indexOf('ss') > -1);
        var minutes = z(Math.floor(value % 3600 / 60), format.indexOf('mm') > -1);
        var hours = z(Math.floor(value / 3600), format.indexOf('HH') > -1);
        if(format){
            return format.replace(/HH/g, hours).replace(/H/g, hours)
                .replace(/mm/g, minutes).replace(/m/g, minutes)
                .replace(/ss/g, seconds).replace(/s/g, seconds);
        }
        return (hours + ':' + minutes + ':' + seconds);
    };
}

/**
 * 转时间格式.
 */
function transform(){
    return function(oldData){
        return oldData.length>19?oldData.substring(0,19):'时间格式有误';
    };
}
