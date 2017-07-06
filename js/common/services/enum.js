import {servicesModule} from "./module";

/**
 * Enum Services
 *
 * Created by jinyong on 16-9-7.
 */
export default function() {
    servicesModule
        .factory('Enum', function () {
            var _enum = {};

            return {
                set: function (key, value) {
                    _enum[key] = value;
                },

                get: function (key) {
                    return _enum[key];
                }
            };
        });
}
