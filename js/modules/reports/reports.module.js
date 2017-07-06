/**
 * Created by pcboby on 10/24/16.
 */

import config from './reports.config';
import directives from './reports.directive';
import services from './reports.service';
import filters from './reports.filter';
import controllers from './reports.controller';

const moduleName='waterStone.reports';
export default moduleName;

export var reports=angular.module(moduleName,[]);
(function(){
    $.getJSON('./conf.json').then(successHandler,errorHandler);
    function successHandler(data){
        reports
            .constant('CWD',data.cwd ? data.cwd:'')
            .config(config)
            .filter(filters)
            .controller(controllers)
            .directive(directives);
        services();
    }
    function errorHandler(){
        console.error("Unable to load Configuration file!");
    }
})();