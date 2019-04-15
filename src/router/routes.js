
import Parent from '@/components/Parent'
import LoadingComponent from '@/components/LoadingComponent'
import ErrorComponent from '@/components/ErrorComponent'

//不需要异步加载页面
import WxLogin from '@/view/wxLogin.vue'
import Login from '@/view/login.vue'
import AppLogin from '@/view/appLogin.vue'
import AppAds from '@/view/appAds.vue'
import Share from '@/view/my/share.vue'
import Payment from '@/view/payment.vue'

//异步加载增加loading  会导致beforeRouteLeave等路由钩子失效 暂时先保持原样
function lazyLoadView (AsyncView) {
  return AsyncView
  // const AsyncHandler = () => ({
  //   component: AsyncView,
  //   loading: LoadingComponent,
  //   error: ErrorComponent,
  //   delay: 200,
  //   timeout: 10000
  // });
  // return Promise.resolve({
  //   functional: true,
  //   render (h, { data, children }) {
  //     return h(AsyncHandler, data, children);
  //   }
  // });
}

const routes = [{
      path: '/demo',
      component: Parent,
      children: [{
          path: 'demo',
          name: 'demo',
          component: () => lazyLoadView(import(/* webpackChunkName: "demo" */ '../view/demo/demo.vue')),
          meta: {
              // keepAlive: true // 需要被缓存
          }
      },{
          path: 'btupload',
          name: 'btupload',
          component: () => lazyLoadView(import(/* webpackChunkName: "demo" */ '../view/demo/upload.vue'))
      },{
          path: 'charts',
          name: 'charts',
          component: () => lazyLoadView(import(/* webpackChunkName: "demo" */ '../view/demo/chats.vue'))
      },{
          path: 'detail',
          name: 'detail',
          component: () => lazyLoadView(import(/* webpackChunkName: "demo" */ '../view/demo/detail.vue'))
      }],
  }, {
      path: '/',
      redirect: {name: 'quote'}
  }, {
      path: '/wxlogin',
      name: 'wxLogin',
      component: WxLogin
  }, {
      path: '/login',
      name: 'login',
      component: Login
  }, {
      path: '/app_login',
      name: 'appLogin',
      component: AppLogin
  }, {
      path: '/app_ads',
      name: 'appAds',
      component: AppAds
  }, {
      path: '/share',
      name: 'share',
      component: Share
  }, {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta:{
          // requireLogin: true,
          requireBase: true,//微信静默授权
      },
  }, {
      path: '/detail_share',
      name: 'detailShare',
      component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/detailShare.vue')),
      meta:{
          requireLogin: false,
      },
  },{
      path: '/common',
      component: Parent,
      children: [{
          path: 'agreement',
          name: 'agreement',
          component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/common/agreement.vue'))
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
        component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/notice/notice.vue'))
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
          component: () => lazyLoadView(import(/* webpackChunkName: "index" */ '../view/quote/quote.vue')),
          meta:{
              requireLogin:false,
              keepAlive:true,
          },
      },{
          path: 'car_pic',
          name: 'carPic',
          component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/quote/carPic.vue')),
          meta:{
              keepAlive:false,
          },
      },{
          path: 'sample',
          name: 'sample',
          component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/quote/sample.vue')),
          meta:{
              keepAlive:true,
          },
      },{
          path: 'choose_ins_type',
          name: 'chooseInsType',
          component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/quote/chooseInsType.vue'))
      },{
          path: 'result',
          name: 'result',
          component: () => lazyLoadView(import(/* webpackChunkName: "quote" */ '../view/quote/result.vue'))
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
          component: () => lazyLoadView(import(/* webpackChunkName: "index" */ '../view/order/order.vue')),
          meta:{
              keepAlive:false,
          },
      },{
          path: 'add_car_pic',
          name: 'addCarPic',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/addCarPic.vue'))
      },{
          path: 'quote_detail',
          name: 'quoteDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/quoteDetail.vue'))
      },{
          path: 'order_detail',
          name: 'orderDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/orderDetail.vue'))
      },{
          path: 'order_detail_done',
          name: 'orderDetailDone',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/orderDetailDone.vue'))
      },{
          path: 'pay_method',
          name: 'payMethod',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/payMethod.vue'))
      },{
          path: 'pay',
          name: 'pay',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/pay.vue'))
      },{
          path: 'pay_result',
          name: 'payResult',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/payResult.vue'))
      },{
          path: 'choose_address',
          name: 'chooseAddress',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/chooseAddress.vue'))
      },{
          path: 'address_list_select',
          name: 'addressListSelect',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/addressListSelect.vue'))
      },{
          path: 'car_detail',
          name: 'carDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/carDetail.vue'))
      },{
          path: 'post_underwritin_or_insure',
          name: 'postUnderwritingOrInsure',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/postUnderwritingOrInsure.vue'))
      },{
          path: 'order_search',
          name: 'orderSearch',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/orderSearch.vue'))
      },{
          path: 'order_close',
          name: 'orderClose',
          component: () => lazyLoadView(import(/* webpackChunkName: "order" */ '../view/order/orderClose.vue'))
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
          component: () => lazyLoadView(import(/* webpackChunkName: "index" */ '../view/my/my.vue'))
      },{
          path: 'about',
          name: 'about',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/about.vue'))
      },{
          path: 'agent',
          name: 'agent',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/agent.vue'))
      },{
          path: 'wallet',
          name: 'wallet',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/wallet.vue'))
      },{
          path: 'auth',
          name: 'auth',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/auth.vue'))
      },{
          path: 'agent-desc',
          name: 'agent-desc',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/agent-desc.vue'))
      },{
          path: 'agenting',
          name: 'agenting',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/agenting.vue'))
      },{
          path: 'cash',
          name: 'cash',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/cash.vue'))
      },{
          path: 'agent-notice',
          name: 'agent-notice',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/agent-notice.vue'))
      },{
          path: 'cash-result',
          name: 'cash-result',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/cash-result.vue'))
      },{
          path: 'history',
          name: 'history',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/history.vue'))
      },{
          path: 'recomposephone',
          name: 'recomposephone',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/recomposephone.vue')),
      },{
          path: 'card',
          name: 'card',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/card.vue')),
      },{
          path: 'setting',
          name: 'setting',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/setting.vue')),
      },{
          path: 'address',
          name: 'address',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/address.vue')),
      },{
          path: 'address-edit',
          name: 'address-edit',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/address-edit.vue')),
      },{
          path: 'change_nick_name',
          name: 'changeNickName',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/changeNickName.vue'))
      },{
          path: 'contact',
          name: 'contact',
          component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/contact.vue'))
      },{
          path: '/help',
          component: { template: '<router-view/>' },
          children:[{
              path: '',
              name: 'help',
              component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/help.vue')),
          },{
              path: 'detail',
              name: 'helpDetail',
              component: () => lazyLoadView(import(/* webpackChunkName: "my" */ '../view/my/help-detail-templater.vue'))
          }]
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
          component: () => lazyLoadView(import(/* webpackChunkName: "index" */ '../view/achieve/achieve.vue'))
      },{
          path: 'achieveDetail',
          name: 'achieveDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "achieve" */ '../view/achieve/achieveDetail.vue'))
      },{
          path: 'balanceDetail',
          name: 'balanceDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "achieve" */ '../view/achieve/balanceDetail.vue'))
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
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/team.vue'))
      },{
          path: 'team_lead',
          name: 'teamLead',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamLead.vue'))
      },{
          path: 'team_open',
          name: 'teamOpen',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamOpen.vue'))
      },{
          path: 'team_charts',
          name: 'teamCharts',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamCharts.vue'))
      },{
          path: 'team_achieve',
          name: 'teamAchieve',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamAchieve.vue'))
      },{
          path: 'team_note',
          name: 'teamNotes',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamNotes.vue'))
      },{
          path: 'team_with_draw',
          name: 'teamWithDraw',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamWithDraw.vue'))
      },{
          path: 'team_result',
          name: 'teamResult',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamResult.vue'))
      },{
          path: 'team_manage',
          name: 'teamManage',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamManage.vue'))
      },{
          path: 'team_rules',
          name: 'teamRules',
          component: () => lazyLoadView(import(/* webpackChunkName: "team" */ '../view/team/teamRules.vue'))
      }]
  },  {
      path: '/life',
      meta:{
          requireLogin: false
      },
      component: Parent,
      children: [{
          path: '',
          name: 'life',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/order.vue'))
      },{
          path: 'life_detail',
          name: 'lifeDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeDetail.vue'))
      },{
          path: 'life_insure',
          name: 'lifeInsure',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeInsure.vue'))
      },{
          path: 'life_product_list',
          name: 'lifeProductList',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeProductList.vue'))
      },{
          path: 'life_confirm_order',
          name: 'lifeConfirmOrder',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeConfirmOrder.vue'))
      },{
          path: 'life_order_detail',
          name: 'lifeOrderDetail',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeOrderDetail.vue'))
      },{
          path: 'tell_customer',
          name: 'tellCustomer',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/tellCustomer.vue'))
      },{
          path: 'life_search',
          name: 'lifeSearch',
          component: () => lazyLoadView(import(/* webpackChunkName: "life" */ '../view/life/lifeSearch.vue'))
      }]
  }, {
      path: '*',
      redirect: '/'
  }]

export default routes;
