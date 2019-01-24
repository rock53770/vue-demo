/*
 * 插件方式安装
 *
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-02 14:16:25
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-26 20:27:27
 */

import {getIsInApp, GHandlerManager} from '../handlerManager'
import baseService from '../index'
import Util from '../../util'
import pathToRegexp from 'path-to-regexp'
import ModalComponent from './component.vue'

let $vm;
let $router;
const plugin = {
 	install (vue, router) {
		if(router){
			$router = router;
			baseService.$changeLocation = (path) => {
				$router.push(path);
			};
		}
		let baseOpenModal = baseService.openModal;

		//添加外层节点
		if (!$vm) {
			const Modal = vue.extend(ModalComponent)
			$vm = new Modal({
				parent: baseOpenModal.$parent,
				el: document.createElement('bt-modal')
			})
			document.body.appendChild($vm.$el)
		}

		/**
		 * 路由遍寻函数
		 */
		function getState(url, routes){
			if(!url){
				return null;
			}
			if(!routes || routes.length === 0){
				return null;
			}
			url = url.split('?')[0];

			/**
			 * 根据路由和
			 * @param {*} routes //路由数组（只判断当前维度的路由，然后往下面的children递归）
			 * @param {*} prevPath 上一级路由路径
			 */
			function __getState(routes, prevPath){
				prevPath = prevPath || "";
				if(!routes){
					return null;
				}

				for(let i = 0; i < routes.length; i++){
					let path = routes[i].path;

					if(path === '*'){//全匹配的这一条需要排除
						continue;
					}

					if(path && !path.startsWith('/')){
						path = "/" + path
					}
					if(path && prevPath !== '/'){
							path = prevPath + path;
					}

					let re = pathToRegexp(path);
					let regResult = re.exec(url);

					if(regResult){
						return routes[i];
					}
					let child = __getState(routes[i].children, path);
					if(child){
						return child;
					}
				}
			}
			return __getState(routes)
		}
		Object.assign(baseService, {
			/**
			 * 根据path匹配路由项
			*/
			_getState: (url) => {
				if(!$router){
					return null;
				}
				return getState(url, $router.options.routes)
			},
			/**
			 * 打开H5模态窗口（不管是不是app内，都以h5的模态弹层形式加载），暂时不支持更多跟open方法一样的更多的配置，以后有需要再扩展
			 * @return {void}
			 */
			openModal(config = {
				url: '',                //打开的url，可以只传相对路径
				component: null,        //组件
				params: null,           //其它
			}) {
				if(!config.url && !config.component){
					return;
				}

				let _this = this, isRender = baseOpenModal.apply(this, arguments)
				let $parent = this.$parent;

				if(isRender){
					return;
				}

				if(config.url){
					let stateConfig = _this._getState && _this._getState(config.url, this._routes);

					if(!stateConfig){
						console.error('找不到路由: ' + config.url);
						return;
					}
					config.component = stateConfig.component;

					config.params = config.params || {};
					if(config.url.indexOf('?') >= 0){
						Object.assign(config.params, Util.unparam(config.url.split('?')[1]));
					}
				}

				let component = config.component;
				if(typeof component === 'function'){
					//以下处理是为了兼容同步和异步（require.ensure）的模块引入方式
					let res;
					res = new Promise((resolve, reject) => {
						component(resolve).then(function(comp){
							resolve(comp)
						})
					})

					res.then(function(comp) {
						renderModal(comp.default || comp);
					})
				} else{
					renderModal(component);
				}

				//渲染模态框
				function renderModal(component){
					component = vue.extend(component);

					let subVm = $vm.open(component, {
						parent: $parent,
						beforeCreate(){
							//增加query传参，以统一openFull和webModal业务代码中的传参取值
							if(!this.$route){
								this.$route = {
									query: {}
								}
							}
							Object.assign(this.$route.query, config.params);//会污染父级的$route，使用的时候尽量不要跟父级的参数有重名
						}
					});

					let newModal = {
						//提供销毁函数
						destory(){
							$vm.close(subVm);
						},
						jsOnResume: config.jsOnResume
					}

					GHandlerManager.modalManager.push(newModal);

					//路由切换的话，销毁模态框
					if($router && $router.beforeEach){
						router.beforeEach((to, from, next) => {
							newModal.destory();
							GHandlerManager.modalManager.destoryAll();
							next();
						})
					}
				}
			}
		})

		vue.prototype.$btPage = baseService;

		vue.mixin({
			beforeCreate: function () {
				if(!$router && this.$router){//以防装载插件的时候，没传
					$router = this.$router;
					baseService.$changeLocation = (path) => {
						$router.push(path);
					};
				}

				baseService.$parent = this;
				// this.$btPage = baseService//添加到组件中调用
			}
		})
  	}
}

export default plugin;
export const install = plugin.install;