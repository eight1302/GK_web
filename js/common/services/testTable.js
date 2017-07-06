import {servicesModule} from "./module";

/**
 * 测试数据provider
 *
 * Created by jinyong on 16-9-5.
 */
export default function(){
    servicesModule
        //测试stable plugins的service
        .factory('testTableRes', ['$q', '$filter', '$timeout', function ($q, $filter, $timeout) {

            //this would be the service to call your server, a standard bridge between your model an $http

            // the database (normally on your server)
            var randomsItems = [];

            function createRandomItem(id) {
                //test table
                var heroes = ['Batman', 'Superman', 'Robin', 'Thor', 'Hulk', 'Niki Larson', 'Stark', 'Bob Leponge'];
                //reslist
                var ip = ['49.142.156.26', '49.142.156.27', '49.142.156.28', '49.142.156.29', '50.142.156.226'];
                var product_name = ['Siemens PLC QS3', 'Siemens PLC QS2', 'Siemens PLC QS1', 'Siemens PLC QS118', 'Siemens PLC QS514'];
                var os = ['Linux3.x', 'win7', 'win8', 'ubuntu', 'AIX'];
                var country = ['Korea', 'China', 'France', 'Japan', 'India'];
                var city = ['bishan', 'Hangzhou', 'Paris', 'Tokyo', 'NewYork'];
                var port = ['80', '102', '51', '1200', '905'];
                var service = ['http', 'Iec104', 'modebus', 'SCADA', 'FII'];
                //resdetail
                var level=[1,2,3];
                var num=['KVF-20160519','KVF-20160520','KVF-20160521'];

                return {
                    id: id,
                    name: heroes[Math.floor(Math.random() * 7)],
                    age: Math.floor(Math.random() * 1000),
                    saved: Math.floor(Math.random() * 10000),
                    '_source': {
                        ip_str: ip[Math.floor(Math.random() * 4)],
                        product: {
                            name: product_name[Math.floor(Math.random() * 4)]
                        },
                        os: os[Math.floor(Math.random() * 4)],
                        location: {
                            country:{
                                'en+': country[Math.floor(Math.random() * 4)]
                            },
                            city:{
                                en: city[Math.floor(Math.random() * 4)]
                            }
                        },
                        updatetime: new Date(),
                        port: port[Math.floor(Math.random() * 4)],
                        service: service[Math.floor(Math.random() * 4)]
                    },
                    highlight: {
                        data: ["220 DreamHost FTP Server<br />530 Login incorrect.<br />214-The following commands are recognized (* =>'s unimplemented):<br />CWD     XCWD    CDUP    XCUP    SMNT*   QUIT    PORT    PASV   EPRT    EPSV    ALLO*   RNFR    RNTO    DELE    MDTM    RMD     XRMD    MKD    XMKD    PWD     XPWD    SIZE    SY..."]
                    },
                    level: level[Math.floor(Math.random() * 2)],
                    num: num[Math.floor(Math.random() * 2)]
                };

            }

            for (var i = 0; i < 1000; i++) {
                randomsItems.push(createRandomItem(i));
            }


            //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
            //in our case, it actually performs the logic which would happened in the server
            function getPage(params) {
                var start = params.pagination.start || 0;
                var number = params.pagination.number || 10;
                var deferred = $q.defer();

                var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

                if (params.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $timeout(function () {
                    //note, the server passes the information about the data set size
                    deferred.resolve({
                        data: result,
                        count: filtered.length,
                        numberOfPages: Math.ceil(filtered.length / number)
                    });
                }, 100);


                return deferred.promise;
            }

            return {
                getPage: getPage
            };

        }]);
}