angular.module("ngLaydate", []).directive("ngLaydate", ["$injector", function(a) {
	"use strict";
	var b = a.get("$timeout");
	return {
                require: '?ngModel',
                restrict: 'A',
                scope: {
                    ngModel: '=',
                    maxDate:'@',
                    minDate:'@'
                },
                link: function(scope, element, attr, ngModel) {
                    var _date = null,_config={};
                    
                        // 初始化参数 
                    _config = {
                        elem: '#' + attr.id,
                        format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD hh:mm:ss',
                        istime: true,
                        istoday:true,
                        isclear:false,
                        max:attr.hasOwnProperty('maxDate')?attr.maxDate:'',
                        min:attr.hasOwnProperty('minDate')?attr.minDate:'',
                        choose: function(data) {
                            scope.$apply(setVeiwValue);
                            
                        },
                        clear:function(){
                           ngModel.$setViewValue(null);
                        }
                    };
                    // 初始化
                    _date= laydate(_config);

                    // 监听日期最大值
                    if(attr.hasOwnProperty('maxDate')){
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if(attr.hasOwnProperty('minDate')){
                       attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
                   
                    // 模型值同步到视图上
                    ngModel.$render = function() {
                        element.val(ngModel.$viewValue || '');
                    };

                    // 监听元素上的事件
                    element.on('blur keyup change focus', function() {
                        scope.$apply(setVeiwValue);
                    });

                    setVeiwValue();

                    // 更新模型上的视图值
                    function setVeiwValue() {
                        var val = element.val();
                        ngModel.$setViewValue(val);
                    }
                }  
            }
}]);