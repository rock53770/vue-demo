/* 插件注册器
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-21 15:49:03
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-07-02 17:42:08
 */

//需要注册的主要模块
export let $module = null;
export let $router = null;

/**
 * 请先执行这个去注册，再去加载插件
 * @param {*} module
 */
function register(appModule, router){
	$module = appModule;
	$router = router;

	//注册指令集成服务(注意增加的指令，在销毁的时候，一定要移除)
	$module.factory("btRefs", ['$q', function($q) {
		let service = {
			_$refs: {},//保存所有指令对象引用
			//异步resolve
			_asyncResolve: {},
			//返回对应的引用对象
			get: name => {
				return service._$refs[name];
			},
			//异步返回指令对象
			getAsync: name => {
				let deferred = $q.defer();

				service._asyncResolve[name] = deferred.resolve;

				return deferred.promise;
			},
			//增加关联指令
			set: (name, val) => {
				service._$refs[name] = val;
				//如果有resolve，返回
				if(service._asyncResolve[name]){
					service._asyncResolve[name](val);
					delete service._asyncResolve[name];
				}
			},
			//移除关联指令
			remove: (name) => {
				delete service._$refs[name];
			}
		};
		return service;
	}]);

	$module.use = (installer) => {
		typeof installer === 'function' && installer();
	};
}

export default register;
export const pluginRegister = register;