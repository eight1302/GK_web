import {setting} from "./setting.module";

/**
 * 系统设置
 *
 * Created by jinyong on 16-9-5.
 */
export default function() {
    setting
        .factory('SystemSetting', /*@ngInject*/function(URI, FileUploader){
            var service = {
                getRunningDuration: getRunningDuration,
                uploadUpgradeFile: uploadUpgradeFile
            };

            return service;

            /**
             * 上传升级包
             *
             * 返回值：
             */
            function uploadUpgradeFile(){
                var uploader =  new FileUploader({
                    url: URI + 'uploadUpgradeFile',
                    autoUpload: false,
                    queueLimit: 1
                });
                return uploader;
            }

            /**
             * 系统运行时间
             *
             * 返回值：
             */
            function getRunningDuration() {
                //TODO：需要中间件支持，调用获取系统时间api
                var diff = moment().diff(moment('2016-06-15 00:00:00', 'YYYY-MM-DD HH-mm-ss'));
                var duration = moment.duration(diff, 'ms');
                var days = Math.floor(duration.asDays());
                var hours = duration.hours();
                var minutes = duration.minutes();
                var seconds = duration.seconds();
                return (days?(days + '天'):'') + (hours?(hours + '小时'):'') +
                    (minutes?(minutes + '分钟'):'') + seconds + '秒';
            }

        });
}