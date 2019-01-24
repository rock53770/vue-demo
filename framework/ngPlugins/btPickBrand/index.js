/* 品牌车系车款选择器
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-21 16:29:07
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-04-28 09:37:50
 */
import brandData from '../../libs/area';
import serviceFn from './service';
import '../_pickBase/style.less';

import {$module, $router} from '../index';

//路由配置
let ABSTRACT_HTML = '<div ui-view ng-class="moduleClass"></div>';
let _isInstall = false;//插件是否已经install

//路由
const routes = {
	"pickBrand": {
		url: "/pick_brand",
		abstract: true,
		template: ABSTRACT_HTML,
		subStates: {
			//选择品牌车系
			'brand': {
				url: "/brand?deep&showHot&required",
				template: () => require.ensure([], () => require('./brand/view.html'), 'pickBrand'),
				controller: () => require.ensure([], () => require('./brand/controller'), 'pickBrand')
			},
			//选择车款
			'style': {
				url: "/style?params",
				template: () => require.ensure([], () => require('./style/view.html'), 'pickBrand'),
				controller: () => require.ensure([], () => require('./style/controller'), 'pickBrand')
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
	$module.factory("brandService", serviceFn(appService));
}

//注册btPickBrand服务
export default function install(){
	if(_isInstall){//不要重复注册了
		return $module;
	}
	_isInstall = true;

	if($router && $router.regRoute){
		$router.regRoute(routes);
	}

	//注册接口服务
	$module.factory("brandService", serviceFn());

	//注册
	$module.factory("btPickBrand", ["$q", "$state", "$compile", "$timeout", "btPage", function($q, $state, $compile, $timeout, btPage) {
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
				var obj = {
					type: config.deep,
					callback: function (data) {
						deferred.resolve(data);
					}
				}
				wv.showCarBrandPicker(obj);
			} else {
				btPage.$openFull({
					url: "/pick_brand/brand",
					animateClass: 'an-slideRight',
					isTransparent: false,
					params: config,
					jsOnResume: (data) => {
						deferred.resolve(data);
					}
				});
			}

			return deferred.promise;
		};
	}]);

	return $module;
}