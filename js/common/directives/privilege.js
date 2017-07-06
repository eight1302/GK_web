/**
 * 权限及各种验证
 *
 * Created by jinyong on 16-9-5.
 */
export default {
    'customVal' : /*@ngInject*/customVal,
    'nvPrivilege' : /*@ngInject*/nvPrivilege
};

/**
 * 自定义校验器
 *
 * 参数：customVal-校验名称、validator-校验handler
 */
function customVal() {
    return {
        require: '?ngModel',
        scope:{
            customVal: '@',
            validator: '&'
        },
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the validator
            if (ctrl && ctrl.$validators) {
                // this will add new Angular validator
                ctrl.$validators[scope.customVal] = function(modelVal) {
                    return scope.validator()(modelVal);
                };
            }
        }
    };
}

/**
 * 根据directive指令中传递的参数，确定是否拥有权限查看
 *
 * 参数：su-仅超级管理员可见、adm-仅普通管理员可见、adu-仅审计管理员可见（多个内容输入时，逗号分割）
 */
function nvPrivilege(auth){
    return {
        scope:{
            'pri':'@nvPrivilege'
        },
        restrict: 'A',
        link: function postLink(scope, element) {
            var token = auth.parseToken();
            var hasPri = false;
            if (token) {
                //user_auth:1 代表有用户账户修改权限
                var user_pri = token.user_auth;
                var pris = scope.pri ? scope.pri.split(',') : [];
                if (pris.length === 0) {
                    return;
                } else {
                    pris.some(function (pri) {
                        //TODO:针对三权分立中其他类型用户的权限设定
                        if (pri === 'su' && user_pri === 1) {
                            hasPri = true;
                        } else if (pri === 'adm') {
                            hasPri = true;
                        } else if (pri === 'adu'){
                            hasPri = true;
                        }
                        return hasPri;
                    });
                }
            }
            if (!hasPri) {
                angular.element(element).remove();
            }
        }
    };
}