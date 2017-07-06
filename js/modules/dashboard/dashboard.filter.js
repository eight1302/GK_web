/**
 * Created by pcboby on 10/20/16.
 */

export default {
    transformTime:transformTime,
    transEvtType:transEvtType
};

function transEvtType(){
    return function(data){
        if(data==='WARNING'){
            data='告警事件';
        }else if(data==='OTHER'){
            data='其它事件';
        }else if(data==='CLIENT_LOGIN'){
            data='客户端登入';
        }else if(data==='CLIENT_LOGOUT'){
            data='登出事件';
        }else if(data==='NEW'){
            data='未读';
        }else if(data==='READED'){
            data='已读';
        }
        return data;
    };
}

function transformTime(){
    return function(timedata,formatter){
        return timedata?moment(timedata).format(formatter):'';
    };
}