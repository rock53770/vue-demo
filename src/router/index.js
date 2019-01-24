import Vue from 'vue'
import Router from 'vue-router'
// import {WechatRegistrar, wxShare} from '@/lib/wechat'
Vue.use(Router)

const Parent = {
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    // const toDepth = to.path.split('/').length
    // const fromDepth = from.path.split('/').length
    // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },
  template: `
  <router-view class=""></router-view>
  `
}
const router = new Router({
    mode:  GConfig.isAppProject ? 'hash' : 'history',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    routes: [
        {
            path: '/demo',
            component: Parent,
            children: [{
                path: 'demo',
                name: 'demo',
                component: () => {return import(/* webpackChunkName: "demo" */ '../view/demo/demo.vue')},
                meta: {
                    // keepAlive: true // 需要被缓存
                }
            },{
                path: 'btupload',
                name: 'btupload',
                component: () => {return import(/* webpackChunkName: "demo" */ '../view/demo/upload.vue')}
            },{
                path: 'charts',
                name: 'charts',
                component: () => {return import(/* webpackChunkName: "demo" */ '../view/demo/chats.vue')}
            }],
        }, {
            path: '/',
            redirect: {name: 'quote'}
        }, {
            path: '/wxlogin',
            name: 'wxLogin',
            component: () => {return import(/* webpackChunkName: "login" */ '../view/wxLogin.vue')}
        }, {
            path: '/login',
            name: 'login',
            component: () => {return import(/* webpackChunkName: "login" */ '../view/login.vue')}
        }, {
            path: '/app_login',
            name: 'appLogin',
            component: () => {return import(/* webpackChunkName: "login" */ '../view/appLogin.vue')}
        }, {
            path: '/app_ads',
            name: 'appAds',
            component: () => {return import(/* webpackChunkName: "login" */ '../view/appAds.vue')}
        }, {
            path: '/share',
            name: 'share',
            component: () => {return import(/* webpackChunkName: "login" */ '../view/my/share.vue')}
        }, {
            path: '/detail_share',
            name: 'detailShare',
            meta:{
                requireLogin: false,
            },
            component: () => {return import(/* webpackChunkName: "order" */ '../view/order/detailShare.vue')}
        },{
            path: '/common',
            component: Parent,
            children: [{
                path: 'agreement',
                name: 'agreement',
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/common/agreement.vue')}
            }]
        }, {
          path: '/notice',
          component: Parent,
          meta:{
              requireLogin:true,
          },
          children: [{
              path: '',
              name: 'notice',
              component: () => {return import(/* webpackChunkName: "quote" */ '../view/notice/notice.vue')}
          }]
        }, {
            // 首页
            path: '/quote',
            // redirect: {name: 'quote'},
            component: Parent,
            meta:{
                requireLogin:true,
                // keepAlive:true,
            },
            children: [{
                path: '',
                name: 'quote',
                meta:{
                    requireLogin:false,
                    keepAlive:true,
                },
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/quote/quote.vue')}
            },{
                path: 'car_pic',
                name: 'carPic',
                meta:{
                    keepAlive:false,
                },
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/quote/carPic.vue')}
            },{
                path: 'sample',
                name: 'sample',
                meta:{
                    keepAlive:true,
                },
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/quote/sample.vue')}
            },{
                path: 'choose_ins_type',
                name: 'chooseInsType',
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/quote/chooseInsType.vue')}
            },{
                path: 'result',
                name: 'result',
                component: () => {return import(/* webpackChunkName: "quote" */ '../view/quote/result.vue')}
            }]
        }, {
            // 订单
            path: '/order',
            // redirect: {name: 'order'},
            component: Parent,
            meta:{
                requireLogin:true,
            },
            children: [{
                path: '',
                name: 'order',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/order.vue')},
                meta:{
                    keepAlive:false,
                },
            },{
                path: 'add_car_pic',
                name: 'addCarPic',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/addCarPic.vue')}
            },{
                path: 'quote_detail',
                name: 'quoteDetail',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/quoteDetail.vue')}
            },{
                path: 'order_detail',
                name: 'orderDetail',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/orderDetail.vue')}
            },{
                path: 'order_detail_done',
                name: 'orderDetailDone',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/orderDetailDone.vue')}
            },{
                path: 'pay_method',
                name: 'payMethod',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/payMethod.vue')}
            },{
                path: 'pay',
                name: 'pay',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/pay.vue')}
            },{
                path: 'pay_result',
                name: 'payResult',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/payResult.vue')}
            },{
                path: 'choose_address',
                name: 'chooseAddress',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/chooseAddress.vue')}
            },{
                path: 'address_list_select',
                name: 'addressListSelect',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/addressListSelect.vue')}
            },{
                path: 'car_detail',
                name: 'carDetail',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/carDetail.vue')}
            },{
                path: 'post_underwritin_or_insure',
                name: 'postUnderwritingOrInsure',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/postUnderwritingOrInsure.vue')}
            },{
                path: 'order_search',
                name: 'orderSearch',
                component: () => {return import(/* webpackChunkName: "order" */ '../view/order/orderSearch.vue')}
            }]
        }, {
            path: '/my',
            meta:{
                requireLogin:true
            },
            // redirect: {name: 'my'},
            component: Parent,
            children: [{
                path: '',
                name: 'my',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/my.vue')}
            },{
                path: 'about',
                name: 'about',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/about.vue')}
            },{
                path: 'agent',
                name: 'agent',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/agent.vue')}
            },{
                path: 'wallet',
                name: 'wallet',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/wallet.vue')}
            },{
                path: 'auth',
                name: 'auth',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/auth.vue')}
            },{
                path: 'agent-desc',
                name: 'agent-desc',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/agent-desc.vue')}
            },{
                path: 'agenting',
                name: 'agenting',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/agenting.vue')}
            },{
                path: 'cash',
                name: 'cash',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/cash.vue')}
            },{
                path: 'agent-notice',
                name: 'agent-notice',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/agent-notice.vue')}
            },{
                path: 'cash-result',
                name: 'cash-result',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/cash-result.vue')}
            },{
                path: 'history',
                name: 'history',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/history.vue')}
            },{
                path: '/help',
                component: { template: '<router-view/>' },
                children:[{
                    path: '',
                    name: 'help',
                    component: () => {return import(/* webpackChunkName: "my" */ '../view/my/help.vue')},
                },{
                    path: 'detail',
                    name: 'helpDetail',
                    component: () => {return import(/* webpackChunkName: "my" */ '../view/my/help-detail-templater.vue')}
                }]
            },{
              path: 'recomposephone',
              name: 'recomposephone',
              component: () => {return import(/* webpackChunkName: "my" */ '../view/my/recomposephone.vue')},
            },{
                path: 'card',
                name: 'card',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/card.vue')},
            },{
                path: 'setting',
                name: 'setting',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/setting.vue')},
            },{
                path: 'address',
                name: 'address',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/address.vue')},
            },{
                path: 'address-edit',
                name: 'address-edit',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/address-edit.vue')},
            },{
                path: 'change_nick_name',
                name: 'changeNickName',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/changeNickName.vue')}
            },{
                path: 'contact',
                name: 'contact',
                component: () => {return import(/* webpackChunkName: "my" */ '../view/my/contact.vue')}
            }]
        }, {
            path: '/achieve',
            meta:{
                requireLogin:true
            },
            component: Parent,
            children: [{
                path: '',
                name: 'achieve',
                component: () => {return import(/* webpackChunkName: "achieve" */ '../view/achieve/achieve.vue')}
            },{
                path: 'achieveDetail',
                name: 'achieveDetail',
                component: () => {return import(/* webpackChunkName: "achieve" */ '../view/achieve/achieveDetail.vue')}
            },{
                path: 'balanceDetail',
                name: 'balanceDetail',
                component: () => {return import(/* webpackChunkName: "achieve" */ '../view/achieve/balanceDetail.vue')}
            }]
        }, {
            path: '/team',
            meta:{
                requireLogin:true
            },
            component: Parent,
            children: [{
                path: '',
                name: 'team',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/team.vue')}
            },{
                path: '/team/team_lead',
                name: 'teamLead',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamLead.vue')}
            },{
                path: '/team/team_open',
                name: 'teamOpen',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamOpen.vue')}
            },{
                path: '/team/team_charts',
                name: 'teamCharts',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamCharts.vue')}
            },{
                path: '/team/team_achieve',
                name: 'teamAchieve',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamAchieve.vue')}
            },{
                path: '/team/team_note',
                name: 'teamNotes',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamNotes.vue')}
            },{
                path: '/team/team_with_draw',
                name: 'teamWithDraw',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamWithDraw.vue')}
            },{
                path: '/team/team_result',
                name: 'teamResult',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamResult.vue')}
            },{
                path: '/team/team_manage',
                name: 'teamManage',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamManage.vue')}
            },{
                path: '/team/team_rules',
                name: 'teamRules',
                component: () => {return import(/* webpackChunkName: "team" */ '../view/team/teamRules.vue')}
            }]
        }, {
            path: '*',
            redirect: '/'
        }
    ]
})
import store from '../store/index'
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

            // if (Util.getCookie("AccessToken") && Util.getCookie("userInfo") && Util.getCookie("openId")) {
            //     next()
            // } else {
            //     if(Util.userAgentType() === 'wechat' && GConfig.verifyWeChat){//微信中
            //         Util.setSessionData("entryUrl",to.fullPath);
            //         let verifyUrl = encodeURIComponent(`${location.origin}/wxlogin`);

            //         console.log(GConfig.appId)
            //         location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${GConfig.appId}&redirect_uri=${verifyUrl}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
            //         next(false)
            //     } else {//其他浏览器手机号登录
            //       next()
            //     }
            // }
        }

    } else if(to.name === 'wxLogin'){
        next();
    } else if (to.name === 'detailShare'){
        next()
    } else {
        if (to.matched.some(record => record.meta.requireLogin)) {

            if (Util.getCookie("AccessToken") && Util.getCookie("userInfo")) {
                next()
            } else {
                if(Util.userAgentType() === 'wechat' && GConfig.verifyWeChat){//微信中
                    Util.setSessionData("entryUrl",to.fullPath);
                    let verifyUrl = encodeURIComponent(`${location.origin}/wxlogin`);

                    console.log(GConfig.appId)
                    location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${GConfig.appId}&redirect_uri=${verifyUrl}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
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
