/*
 * baseService的vue版本
 *
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-02 14:16:25
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-29 15:33:52
 */
import plugin from './plugin';
import baseService from '../index'
import {setConfig as _setConfig} from '../index'

if(window.Vue){
    Vue.use(plugin)
}

export let setConfig = _setConfig;
export const BtPagePlugin = plugin;
export const install = plugin.install;
export default baseService;