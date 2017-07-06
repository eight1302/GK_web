import config from './enterprise.config';
import controllers from './enterprise.controller';
import directives from './enterprise.directive';
import services from './enterprise.service';

/**
 * 创建dashboard模块
 *
 * Created by jinyong on 16-9-23.
 */
const moduleName = "waterStone.enterprise";
export default moduleName;

export var enterprise = angular.module(moduleName, []);

(function () {
    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        enterprise
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