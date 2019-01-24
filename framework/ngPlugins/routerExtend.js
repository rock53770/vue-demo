/* 路由扩展
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-24 13:15:42
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-04-24 13:17:57
 */
export default (router) => {
	Object.assign(router, {
		//路径
		paths: {},
		/**
		 * 根据path获取对应的state配置
		 * @param  {String}  href 要判断的href地址
		 * @return {Object} state对象
		 */
		getState: function(href){
			if(GConfig.PATH_PREFIX && href.startsWith(GConfig.PATH_PREFIX)){
				href = href.replace(GConfig.PATH_PREFIX, '')
			}
			var _this = router;
			if(!href){
				return null;
			}
			href = href.split('?')[0];
			for(var path in _this.paths){
				if(path){
					path = path.toString();
					if(path == href){
						return _this.paths[path];
					}
				}
			}
			return null;
		},
		//注册新路由
		regRoute: function (route) {
			Object.assign(router.routes, route);
			for(var key in route){
				getPath(route[key], "");
			}
		}
	});

	//获取路由对应的path
	function getPath(stateItem, path){
		if(stateItem.url){
			path += stateItem.url;
		}
		path = (path || "").split('?')[0];

		if(path && !stateItem.abstract){
			router.paths[path] = stateItem;
		}

		if(stateItem.subStates){
			for(var key in stateItem.subStates){
				getPath(stateItem.subStates[key], path);
			}
		}
		return "";
	}

	for(var key in router.routes){
		getPath(router.routes[key], "");
	}

	window.getState = router.getState;
}