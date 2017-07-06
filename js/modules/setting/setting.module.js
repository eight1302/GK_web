import services from './setting.service';

/**
 * 创建setting模块
 *
 * Created by jinyong on 16-9-6.
 */
const moduleName = "waterStone.setting";
export default moduleName;

export var setting = angular.module(moduleName, []);

(function () {

    $.getJSON('./conf.json').then(successHandler, errorHandler);

    function successHandler(data) {
        setting
            .constant('CWD', data.cwd ? data.cwd : '');
//            .config(config)
//            .controller(controllers)
//            .directive(directives);
        //新建服务
        services();
    }

    function errorHandler() {
        console.error("Unable to load Configuration file!");
    }
})();