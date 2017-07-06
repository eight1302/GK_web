import stable from './stable.filter';
import time from './time.filter';
import html from './html.filter';

/**
 * 创建filters模块
 *
 * Created by jinyong on 16-9-6.
 */
const moduleName = "waterStone.filters";
export default moduleName;

(function () {
    //合并所有模块内的import objects()
    let all = angular.merge(stable, time, html);
    //新建filter模块
    let filtersModule = angular.module(moduleName, []);
    //定义所有的filter
    Object.keys(all).map((key)=>{
        filtersModule.filter(key, all[key]);
    });
})();