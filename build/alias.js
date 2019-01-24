let path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	'btPlugins': resolve('framework/vuePlugins'),
	"demos": process.env.NODE_ENV == 'development' ? resolve("framework/vuePlugins/demos") : resolve("framework/vuePlugins/demos/empty"),//demo根据环境选择是否打包
	'vue$': 'vue/dist/vue.esm.js',
	'@': resolve('src'),
	// 'jquery': 'jquery',
	'framework': resolve('framework'),
	'loading' : resolve("framework/overlay/loading.min"),
	'confirm' : resolve("framework/overlay/confirm.min"),
	'say' : resolve("framework/overlay/say.min"),
	// 'tip' : resolve("framework/overlay/tip.min"),
	'webViewBridge': resolve("framework/webViewBridge"),
	'util': resolve("framework/util")
}