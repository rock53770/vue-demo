import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store/index'
import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';

Vue.use(Router)

const router = new Router({
    mode:  GConfig.isAppProject ? 'hash' : 'history',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    routes: routes
})

router.beforeEach((to, from, next) => {
    var obj = {}
    if(to.name == "quote" || to.name == "order" || to.name == "achieve" || to.name == "my" || to.name == "appLogin"){
      obj = {
        showHeader: true,
        needBack:false,
        menuContent:'',
      }
    }
    if(to.name == "detailShare"){
      obj = {
        showHeader: false,
        needBack:false,
        menuContent:'',
      }
    }
    store.dispatch("setHead", obj);
    if(to.name === 'login'){

        if(from.name === 'login'){
            next(false)
        } else {
            next()
        }

    } else if(to.name === 'wxLogin'){
        next();
    } else if (to.name === 'detailShare'){
        next()
    } else {
        let requireLogin = false;
        let requireBase = false;
        requireLogin = to.matched.some(record => record.meta.requireLogin)
        requireBase = to.matched.some(record => (record.meta.requireBase && (Util.userAgentType() === 'wechat') && GConfig.verifyWeChat))
        if (requireLogin || requireBase) {

            if ((Util.getCookie("AccessToken") && Util.getCookie("userInfo")) ||  (requireBase && Util.getCookie("openId"))) {
                next()
            } else {
                if(Util.userAgentType() === 'wechat' && GConfig.verifyWeChat){//微信中
                    Util.setSessionData("entryUrl",to.fullPath);
                    let verifyUrl = encodeURIComponent(`${location.origin}/wxlogin`);
                    if(requireLogin){
                      location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${GConfig.appId}&redirect_uri=${verifyUrl}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`)
                    } else if(requireBase){
                      location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${GConfig.appId}&redirect_uri=${verifyUrl}&response_type=code&scope=snsapi_base&state=2#wechat_redirect`)
                    }
                    next(false)
                } else if(GConfig.isInApp){//
                  let AccessToken = Util.getLocalData("AccessToken");
                  if (AccessToken) {
                    next()
                    // btPage.open({
                    //   url: '/login',
                    //   enter_animate:2,
                    // })
                  } else {
                    btPage.open({
                      url: '/app_login',
                      container_style:1,
                      enter_animate:2,
                    })
                  }

                } else {//其他浏览器手机号登录

                  if(to.name == 'quote'){
                    next()
                  } else {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    })
                  }
                }
            }
        } else {
            next()
        }
    }
})
//路由切换结束
//注意该钩子发生的时候，其实浏览器地址栏地址还并未更改！！！！
router.afterEach(route => {
  Toast.clear();
  if(route.name != 'wxLogin' && route.name != 'login' &&  Util.userAgentType() == "wechat"){

  }
})

export default router;
