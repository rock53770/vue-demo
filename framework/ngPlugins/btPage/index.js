/* btPage
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-21 16:18:58
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-29 15:35:21
 */
import {$module, $router} from '../index';
import btPage, {setConfig as _setConfig} from '../../btPage/ng';

let _isInstall = false;//插件是否已经install

//注册服务
export default function install(){
	if(_isInstall){//不要重复注册了
		return $module;
	}
	_isInstall = true;

	//注册
    $module.factory("btPage", ['$compile', '$timeout', '$controller', "$location", function ($compile, $timeout, $controller, $location) {
        let service = btPage(...arguments)

        service.$changeLocation = url => {//跳转用系统的定位跳转函数
            $location.url(url)
        };

        //在这里还可以扩展
        return service
    }]);

	return $module;
}
export let setConfig = _setConfig;