import enums from './enum';
import http from './http';
import provider from './provider';
import resource from './resource';
import testTable from './testTable';
import tools from './tools';
import validation from './validation';
import sse from './sse';

/**
 * 创建services模块
 *
 * Created by jinyong on 16-9-6.
 */
const moduleName = "waterStone.services";
export default moduleName;

//新建service模块并export
export var servicesModule = angular.module(moduleName, []);

//定义各个子模块中的service
enums();
http();
provider();
resource();
testTable();
tools();
validation();
sse();