/*
 * 插件demo
 */
//路由配置
let _isInstall = false;//插件是否已经install
import {$router} from '../index';

const ROUTER_VIEW_TEMP = `<div><keep-alive>
			<router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
		</keep-alive>
		<transition :name="$route.meta && $route.meta.animate ? (typeof $route.meta.animate === 'string' ? $route.meta.animate : 'vux-pop-in') : ''">
			<router-view v-if="!($route.meta && $route.meta.keepAlive)"></router-view>
		</transition>
	</div>`
;

//路由
const routes = [{
	path: '/demo',
	name: 'demo',
	component: { template: ROUTER_VIEW_TEMP }, //
	redirect: { name: 'demoIndex'},
	children: [
		{
			name: 'demoIndex',
			path: 'index',
			component: () => import ( /* webpackChunkName: "demo" */ './views/index'),
			meta: { keepAlive: true }
		}, {
			path: 'mix',
			component: () => import ( /* webpackChunkName: "demo" */ './views/mix')
		}, {
			path: 'btPage',
			component: () => import ( /* webpackChunkName: "demo" */ './views/btPage'),
			meta: { animate: true }
		}, {
			path: 'btPage/modal',
			component: () => import ( /* webpackChunkName: "demo" */ './views/btPage/modal')
		}, {
			path: 'btScroller',
			component: () => import ( /* webpackChunkName: "demo" */ './views/btScroller')
		}, {
			path: 'btPickArea',
			component: () => import ( /* webpackChunkName: "demo" */ './views/btPickArea'),
			meta: { animate: 'vux-pop-up' }
		}, {
			path: 'btUploader',
			component: () => import ( /* webpackChunkName: "demo" */ './views/btUploader')
		}
	]
}];

const plugin = {
	install (vue, options) {
		if(_isInstall){//不要重复注册了
			return;
		}
		_isInstall = true;
		if($router/* && $router.addRoutes && $router.options && $router.options.routes*/){
			$router.addRoutesBt(routes);
		}
	}
}

// if(window.Vue){
// 	Vue.use(plugin)
// }

// export const DemosPlugin = plugin
// export const install = plugin.install
export default plugin;