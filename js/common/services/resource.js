import {servicesModule} from "./module";

/**
 * 获取json资源
 *
 * Created by jinyong on 16-9-5.
 */
export default function() {
    servicesModule
        //菜单导航
        .factory("NavMenu", /*@ngInject*/function($http, CWD) {
            let json = $http.get(CWD + "navmenu.json").then(function (data) {
                return data.data;
            });
            return {json};
        });
}