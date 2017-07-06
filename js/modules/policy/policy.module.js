import config from './policy.config';
import controllers from './policy.controller';
import directives from './policy.directive';
import services from './policy.service';

/**
 * 创建dashboard模块
 *
 * Created by jinyong on 16-9-23.
 */
const moduleName = "waterStone.policy";
export default moduleName;

export var policy = angular.module(moduleName, []);

(function () {
    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        policy
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