/* btPage进一步封装
 * @Author: dongxiaochai@163.com
 * @Date: 2018-05-04 11:11:29
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-29 15:35:50
 */
import Vue from 'vue';
import baseOpenPage, {BtPagePlugin as plugin, setConfig as _setConfig} from '../../btPage/vue/index';
import {$router} from '../index';

let installOrigin = plugin.install;

//重写install，把router传过去
plugin.install = (vue, router) => {
	if(!router){
		router = $router;
	}
	installOrigin(vue, router);
}

//指令
const btSrefDirective = {
	inserted(el, binding){
		let option = binding.value;
		if(typeof option === 'string' || !option){
			option = {
				url: option
			}
		}

		if(el.tagName.toUpperCase() === 'A' && !el.attributes.href){
			el.setAttribute('href', option.url);
		}

		el.onclick = () => {
			baseOpenPage.open(option);
			return false;
		}
	},
};
Vue.directive('btSref', btSrefDirective);

// const btGoBackDirective = {
// 	inserted(el, binding){
// 		let option = binding.value;
// 		// if(typeof option === 'string' || !option){
// 		// 	option = {
// 		// 		url: option
// 		// 	}
// 		// }

// 		// if(el.tagName.toUpperCase() === 'A' && !el.attributes.href){
// 		// 	el.setAttribute('href', option.url);
// 		// }

// 		el.onclick = () => {
// 			baseOpenPage.goBack(option);
// 			return false;
// 		}
// 	},
// };
// Vue.directive('btGoBack', btGoBackDirective);

export let setConfig = _setConfig;
export const BtPagePlugin = plugin;
export const install = plugin.install;
export const BtPageOpenDirective = btSrefDirective;
// export const BtPageGoBackDirective = btGoBackDirective;