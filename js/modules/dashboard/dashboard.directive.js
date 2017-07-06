/**
 * Created by pcboby on 10/18/16.
 */

/*const echarts=require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");*/

export default {
    doughnutChart:/*@ngInject*/doughnutChart,
    securityEvt:securityEvt,
    navCards:navCards
};
function doughnutChart(){
    return {
        scope:{
            data:'=doughnutChart'
        },
        restrict:'A',
        replace:false,
        link:link
    };
    function link(scope,element){
        element.css({width:'100%',height:'285px',borderColor:'red'});
        var chart = echarts.init(element[0]);
        chart.setOption(scope.data);
        scope.$watch('data',function(){
            chart.setOption(scope.data);
        },true);
    }
}

function securityEvt(){
    return {
        scope:{
            data:'=securityEvt'
        },
        restrict:'A',
        replace:true,
        template:'<table class="table table-striped"><tbody>' +
        '<tr ng-repeat="item in data track by $index">' +
        '<td class="tabel-li-style"></td>' +
        '<td class="table-font-color"><i class="fa fa-clock-o" aria-hidden="true"></i><em ng-bind="item.createTime | transformTime:\'HH:mm:ss\'"></em></td>' +
        '<td class="table-font-color" ng-bind="item.eventType | transEvtType">接入网络</td>' +
        '<td ng-bind="item.clientName">90:C6:82A6:05:41</td>' +
        '<td ng-bind="item.sourceIp">172.18.10.137</td></tr>' +
        '</tbody></table>'
    };
}

function navCards(){
    return {
        restrict:'A',
        scope:{
            cards:'=navCards'
        },
        replace:false,
        template:'<a ui-sref="{{item.linkTo}}" ng-repeat="item in cards"><div class="short-box"><div ng-class="\'short-color0\'+($index+1)"><i ng-class="\'fa \'+item.class"></i><p>{{item.name}}</p></div></div></a>'
    };
}