/**
 * Created by pcboby on 12/30/16.
 */

export default {
    specialReplace:/*@ngInject*/specialReplace
};
function specialReplace($rootScope){
    var newData,matchString=[
        "'","<",">","%","\"\"",",",".",">=","=<","<>","-","_",";","||","[","]","&","/","-","|","\s"
    ];
    return function(data){
        var tmp='';
        if(data){
            for(var i=0;i<matchString.length;i++){
                console.log(transform(matchString[i])?'\\'+matchString[i]:matchString[i]);
                if(data.match(transform(matchString[i])?'\\'+matchString[i]:matchString[i])){
                    if(i!==matchString.length-1){
                        tmp+=matchString[i]+',';
                    }else{
                        tmp+=matchString[i];
                    }
                    $rootScope.addAlert({
                        type:'danger',
                        content:'输入的特殊字符[ '+tmp+' ]将被替换为空'
                    });
                    newData=data.replace(transform(matchString[i])?'\\'+matchString[i]:matchString[i],'');
                }
            }
        }
        function transform(data){
            var swh,arr=['.','[',']'];
            $(arr).each(function(i,d){
                if(d===data){
                    swh=true;
                }
            });
            return swh?true:false;
        }
        return newData;
    };
}