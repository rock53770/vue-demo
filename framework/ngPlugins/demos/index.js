/*
 * 各种demo
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-20 17:08:44
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-06-28 13:09:51
 */
/**
 * 省市区选择指令（目前暂时只支持省市两级哈）
 *
 * model格式：
 *     {
 *         provinceId: 1,
 *         provinceName: "浙江省"，
 *         cityId: 2,
 *         cityName: "杭州",
 *         distinctId: "32",
 *         distinctName: "拱墅区"
 *     }
 */
//路由配置
let ABSTRACT_HTML = '<div ui-view ng-class="moduleClass"></div>';
let _isInstall = false;//插件是否已经install
import {$router} from '../index';

//路由
const routes = {
	"demo": {
		url: "/demo",
		abstract: true,
		template: ABSTRACT_HTML,
		subStates: {
			//引导页
			"index": {
				url: "",
				template: () => require.ensure([], () => require('./apps/index/view.html'), 'apps/demo'),
				controller: () => require.ensure([], () => require('./apps/index/controller'), 'apps/demo')
			},
			//btPage demo页面
			"btPage": {
				url:"/btPage",
				abstract: true,
				template: ABSTRACT_HTML,
				subStates: {
					"index": {
						url: "?num",
						template: () => require.ensure([], () => require('./apps/btPage/view.html'), 'apps/demo'),
						controller: () => require.ensure([], () => require('./apps/btPage/controller'), 'apps/demo')
					},
					"modal": {
						url: "/modal?test_param",
						template: () => require.ensure([], () => require('./apps/btPage/modal/view.html'), 'apps/demo'),
						controller: () => require.ensure([], () => require('./apps/btPage/modal/controller'), 'apps/demo')
					}
				}
			},
			//综合demo页面
			"mix": {
				url: "/mix",
				template: () => require.ensure([], () => require('./apps/mix/view.html'), 'apps/demo'),
				controller: () => require.ensure([], () => require('./apps/mix/controller'), 'apps/demo')
			},
			//overlay系列
			"overlay": {
				url: "/overlay",
				template: () => require.ensure([], () => require('./apps/overlay/view.html'), 'apps/demo'),
				controller: () => require.ensure([], () => require('./apps/overlay/controller'), 'apps/demo')
			},
			//btScroller系列
			"btScroller": {
				url: "/btScroller",
				template: () => require.ensure([], () => require('./apps/btScroller/view.html'), 'apps/demo'),
				controller: () => require.ensure([], () => require('./apps/btScroller/controller'), 'apps/demo')
			}
		}
	},
}

//装载
export default function install(){
	if(_isInstall){//不要重复注册了
		return;
	}
	_isInstall = true;

	if($router && $router.regRoute){
		$router.regRoute(routes);
	}
}
