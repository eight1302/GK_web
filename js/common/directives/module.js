import chart from './chart';
import privilege from './privilege';
import stable from './stable';
import testTable from './testTable';

/**
 * 创建directives模块
 *
 * Created by jinyong on 16-9-6.
 */
const moduleName = "waterStone.directives";
export default moduleName;

(function () {
    angular
        .module(moduleName, [])
        .directive(chart)
        .directive(privilege)
        .directive(stable)
        .directive(testTable);
})();