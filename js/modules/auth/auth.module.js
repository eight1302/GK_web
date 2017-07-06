import config from './auth.config';
import controllers from './auth.controller';
import directives from './auth.directive';
import services from './auth.service';

/**
 * 创建auth模块
 *
 * Created by jinyong on 16-9-6.
 */
const moduleName = "waterStone.auth";
export default moduleName;

export var auth = angular.module(moduleName, []);

(function () {

    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        auth
            .constant('CWD', data.cwd ? data.cwd : '')
            .config(config)
            .controller(controllers)
            .directive(directives);
        //新建服务
        services();
    }

    function errorHandler() {
        console.error("Unable to load Configuration file!");
    }
})();