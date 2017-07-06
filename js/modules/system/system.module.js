/**
 * Created by Carol on 17/11/16.
 */


import config from './system.config';
import directives from './system.directive';
import services from './system.service';
import controllers from './system.controller';

const moduleName='waterStone.system';
export default moduleName;

export var system=angular.module(moduleName,[]);
(function(){
    $.getJSON('./conf.json').then(successHandler,errorHandler);
    function successHandler(data){
        system
            .constant('CWD',data.cwd ? data.cwd:'')
            .config(config)
            .controller(controllers)
            .directive(directives);
        services();
    }
    function errorHandler(){
        console.error("Unable to load Configuration file!");
    }
})();