import config from './dashboard.config';
import controllers from './dashboard.controller';
import services from './dashboard.service';
import directives from './dashboard.directive';
import filters from './dashboard.filter';

/**
 * 创建dashboard模块
 *
 * Created by jinyong on 16-9-23.
 */
const moduleName = "waterStone.dashboard";
export default moduleName;

export var dashboard = angular.module(moduleName, []);

(function () {

    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        dashboard
            .constant('CWD', data.cwd ? data.cwd : '')
            .config(config)
            .filter(filters)
            .directive(directives)
            .controller(controllers);

        //新建服务
        services();
    }

    function errorHandler() {
        console.error("Unable to load Configuration file!");
    }
})();