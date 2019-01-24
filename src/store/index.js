import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

import head from './modules/head'//header信息
import transNa from './modules/transNa'//header信息
import pics from './modules/pics'//微信用户信息

const store = new Vuex.Store({
	state: {},
	mutations: {},
	modules: {
    head:head,
    transNa:transNa,
    carPics:pics
	},
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    // createPersistedState({ storage: window.sessionStorage })
  ],
});

export default store
