/* 省市区选择器
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-21 16:18:58
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-02 09:55:15
 */

import provinceData from '../../libs/area';
import serviceFn from './service';
import '../_pickBase/style.less';

import {$module, $router} from '../index';

//路由配置
let ABSTRACT_HTML = '<div ui-view ng-class="moduleClass"></div>';
let _isInstall = false;//插件是否已经install

//路由
const routes = {
	"pickArea": {
		url: "/pick_area",
		abstract: true,
		template: ABSTRACT_HTML,
		subStates: {
			//选择省市
			'province': {
				url: "/province?deep&showHot&showLocation&required",
				template: () => require.ensure([], () => require('./province/view.html'), 'pickArea'),
				controller: () => require.ensure([], () => require('./province/controller'), 'pickArea')
			},
			//选择区
			'country': {
				url: "/country?params",
				template: () => require.ensure([], () => require('./country/view.html'), 'pickArea'),
				controller: () => require.ensure([], () => require('./country/controller'), 'pickArea')
			}
		}
	},
}

//重写接口服务
export function rewiteService(appService){
	if($module === null){
		console.error('请先注册插件注册器')
		return;
	}
	$module.factory("locationService", serviceFn(appService));
}

//注册btPickArea服务
export default function install(){
	if(_isInstall){//不要重复注册了
		return $module;
	}
	_isInstall = true;

	if($router && $router.regRoute){
		$router.regRoute(routes);
	}

	//注册接口服务
	$module.factory("locationService", serviceFn());

	//注册
	$module.factory("btPickArea", ["$q", "$state", "$compile", "$timeout", "btPage", function($q, $state, $compile, $timeout, btPage) {
		return function(deep) {
			let deferred = $q.defer(),
				DEFAULT_CONFIG = {
					deep: 2 //省市区级别：1省，2省市；3省市区
				},
				config = {};

			if (typeof(deep) === "object") {
				config = $.extend({}, DEFAULT_CONFIG, deep);
			} else {
				config.deep = deep;
			}

			//调用webview接口
			if (GConfig.isInApp && !config.useH5){
				wv.showAreaPicker(function(data){
					deferred.resolve(data);
				}, config.deep);
			} else {
				btPage.$openFull({
					url: "/pick_area/province",
					animateClass: 'an-slideRight',
					isTransparent: false,
					params: config,
					jsOnResume: (data) => {
						let newData = data;
						// {
						// 	// brandId: ,
						// 	// brandName: ,
						// 	// modelId: ,
						// 	// modelName: ,
						// 	// styleId: ,
						// 	// styleName:
						// };
						deferred.resolve(newData);
					}
				});
			}

			return deferred.promise;
		};
	}]);

	return $module;
}