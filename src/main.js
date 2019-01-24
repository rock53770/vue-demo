import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
let vConsole = new VConsole() // 初始化
// import 'babel-polyfill'
// Object.assign = require('object-assign');

import $ from 'jquery';
window.$ = $;
import './config'

import  'webViewBridge'
import 'say'
import 'loading'
import 'confirm'
import 'util'

import Vue from 'vue'
import './directive/index'
import './filter/index'
import store from './store/index'

import './lib/util'
import './lib/setPageTitle'
Vue.config.productionTip = false
Util.setSessionData("firstUrl",location.href);

// import VueResource from 'vue-resource'
// Vue.use(VueResource)
// const FastClick = require('fastclick')
// FastClick.attach(document.body)
import * as vant from 'vant'
Vue.use(vant.Toast).use(vant.Button).use(vant.Cell).use(vant.CellGroup).use(vant.Field).use(vant.Popup).use(vant.Actionsheet)
.use(vant.Switch).use(vant.Uploader).use(vant.Icon).use(vant.Picker).use(vant.Swipe).use(vant.SwipeItem).use(vant.Lazyload)
.use(vant.Tab).use(vant.Tabs).use(vant.SwipeCell).use(vant.RadioGroup).use(vant.Radio).use(vant.Area).use(vant.AddressList)
.use(vant.AddressEdit).use(vant.Search).use(vant.NoticeBar).use(vant.Tag).use(vant.Loading).use(vant.Checkbox)
.use(vant.CheckboxGroup).use(vant.DatetimePicker).use(vant.ImagePreview).use(vant.Dialog);


window.Toast = vant.Toast;
window.Dialog = vant.Dialog;
window.ImagePreview = vant.ImagePreview;

Vue.prototype.$util = Util
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
window.isSupportedClipboard = VueClipboard.config.isSupported;//修改了clipboard
Vue.use(VueClipboard)

// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
// Vue.use(VueAwesomeSwiper, /* { default global options } */ )

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

import './assets/main.less'
import App from './App'
import router from './router'

// import pluginRegister from 'btPlugins';
// pluginRegister({
// 	router
// });
import {BtPagePlugin} from 'btPlugins/btPage'
import {DemosPlugin} from 'demos'
import { WSAVERNOTSUPPORTED } from 'constants'

Vue.use(BtPagePlugin);
Vue.use(DemosPlugin);
wv.getAppInfo(function (data) {
  Util.setLocalData("appInfo",data.object);
  console.log(data)
  // wv.addNotifactionListener("UIApplicationDidFinishLaunchingNotification",()=>{
  //   alert("UIApplicationDidFinishLaunchingNotification launched")
  // })
  window.app = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
      App
    }
  })
});

