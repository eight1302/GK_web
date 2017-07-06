import {servicesModule} from "./module";
const atmosphere = require("../../dependencies/atmosphere");

/**
 * Enum Services
 *
 * Created by jinyong on 16-9-7.
 */
export default function() {
    servicesModule
        .service('sse', /*@ngInject*/function (URI) {
            this.listen = function (url, scope, cb, onOpenCB) {
	            var request = {
	                contentType: "application/json",
	                logLevel: 'warn',
	                // transport: 'long-polling',
	                // transport: 'websocket',
	                transport: 'sse',
	                // transport: 'streaming',
	                enableXDR: true,
	                reconnectInterval: 1000
	            };

	            request.url = URI + '/sse/' + url ;
	            //console.log(scope);
	            request.onOpen = function (response) {
	              console.log('Atmosphere connected using ' + response.transport + ", " + request.url);
	              onOpenCB && onOpenCB("SSE is on open");
	            };

	            request.onMessage = function (response) {
	            	console.log(response);
	                var json = atmosphere.util.parseJSON(response.responseBody);
	                //console.log(json.content);
	                cb && cb(json);
	            };

	            atmosphere.subscribe(request);
	            // var rq = new atmosphere.AtmosphereRequest(request);
	            // rq.execute();

	            scope.$on('$destroy', function () {
	                console.log("unsubscribeUrl: " + request.url);
	                atmosphere.unsubscribeUrl(request.url);
	                // rq.close();
	                // clearTimeout(rq.response.request.id);

	                // if (rq.heartbeatTimer) {
	                //     clearTimeout(rq.heartbeatTimer);
	                // }
	            });
	        };

	        this.unsubscribe = function (url) {
	            var request = {
	                contentType: "application/json",
	                logLevel: 'debug',
	                // transport: 'long-polling',
	                // transport: 'websocket',
	                transport: 'sse',
	                // transport: 'streaming',
	                enableXDR: true
	            };

	            request.url = '/sse/' + url;

	            console.log("unsubscribeUrl: " + request.url);
	            atmosphere.unsubscribeUrl(request.url);
	        };
    	});
}