/* 插件注册器
 * @Author: dongxiaochai@163.com
 * @Date: 2018-05-02 16:26:12
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-10 20:15:54
 */

//需要注册的主要模块
export let $router = null;

/**
 * 请先执行这个去注册，再去加载插件
 * @param {*} module
 */
export default function register(router){
	$router = router.router;

	//vue的实现机制有点奇怪的，addRoutes并不会去改变options.routes数组中的数据，需要手动合并一下，以防后期改动大，所以这里扩展一个新的函数
	//暂时没做重复判断（最好判断一下）
	$router.addRoutesBt = (routes) => {
		$router.addRoutes(routes)
		$router.options.routes = $router.options.routes.concat(routes);
	};
}

// 在找到可用的loader方案前，不能直接通过这样暴露，否则会导致打包文件过大
// import {DemosPlugin} from 'btPlugins/demos'
// import {BtPagePlugin} from 'btPlugins/btPage'
// import BtScroller from 'btPlugins/btScroller'
// import BtPickArea, {BtPickAreaPlugin} from 'btPlugins/btPickArea/index'
// import BtPickBrand, {BtPickBrandPlugin} from 'btPlugins/btPickBrand/index'

// export {
// 	DemosPlugin,
// 	BtPagePlugin,
// 	BtScroller,
// 	BtPickArea,
// 	BtPickAreaPlugin,
// 	BtPickBrand,
// 	BtPickBrandPlugin
// }