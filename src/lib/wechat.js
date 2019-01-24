/**
 * 微信通用封装
 *
 * @author dongxiaochai@163.com
 * @since 2017-10-20
 */
// import Vue from 'vue'
// import { WechatPlugin } from 'vux'
import loginService from '@/api/loginService'
import logo from '@/assets/images/logo.png'
// import jsonp from '@/lib/jsonp'
import quoteService from '@/api/quoteService';
// Vue.use(WechatPlugin)

const isIOS = !!navigator.userAgent.match(/iPhone|iPod|iPad/i)
let jssdkInstance = null;//当前有效的jssdk实例
let isfirstConfigSuccess = false//第一次加载保存的url地址（ios下只用这个地址注册一次就好了）

// const FIRST_URL = location.href
const FIRST_URL = isIOS ? (Util.getSessionData("firstUrl") || location.href) : location.href
//第一次进入的时候的url

let jsApiList = GConfig.jsApiList
// alert(113723787137)
// alert(FIRST_URL)
//微信jssdk分类实例
function _wechatRegistrar(){
    let _this = this;
    _this.readyState = 'not_reg';//注册状态，faild注册失败，not_reg未注册，reging注册中，success注册成功

    _this.promise = null;//避免前一个注册请求还在发送中后面的又来了

    jssdkInstance = _this;
}
_wechatRegistrar.prototype = {
    /**
     * 设置config，这个请确保在路由正确替换以后执行，否则安卓有问题
     */
    setConfig: function(){
        let _this = this;
        if(_this.readyState === 'success'){//已注册过，
            return new Promise((resolve) => {
                resolve()
            });
        } else if(_this.readyState === 'reging'){//上次的还在注册中，直接返回上一次的promise
            return _this.promise
        } else{
            _this.promise = new Promise(function(resolve, reject){
                _this.readyState = 'reging'

                if(isIOS && isfirstConfigSuccess){//ios下，如果成功了一次，就不要再注册了
                    return goNext()
                }

                let url = (isIOS ? FIRST_URL : location.href).split('#')[0]

                loginService.getJssdkConfig({
                    url: url,
                    // url: encodeURIComponent(url),
                    appid:"1"
                }).then((data) => {
                    if(jssdkInstance != _this){//已经换页了，就不执行了
                        return reject();
                    }
                    if (data.code != 1) {
                        Toast.fail(data.message);

                        _this.promise = null;
                        _this.readyState = 0;//接口错误导致的，下次重新注册
                        reject()
                    } else {
                        wx.config({
                            debug: GConfig.wechatDebug, // 开启调试模式
                            appId: data.object.appId, // 必填，公众号的唯一标识
                            timestamp: data.object.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.object.nonceStr, // 必填，生成签名的随机串
                            signature: data.object.signature, // 必填，签名，见附录1
                            jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        })

                        return goNext();
                    }
                })

                //注册完以后的回调
                function goNext(){
                    wx.error(function(res){
                        _this.readyState = "faild";
                        isfirstConfigSuccess = false;
                        // Toast.fail('sdk config注册失败，请点击右上角刷新');
                        return reject()
                    });

                    wx.ready(function(){
                        _this.promise = null;
                        isfirstConfigSuccess = true;
                        _this.readyState = "success";

                        resolve()
                    })
                }
            })

            // _this.promise.then(() => {
            // }, () => {
            // })

            return _this.promise;
        }
    },
    /**
     * 微信注册成功时间监听
     * @param  {Function} callback 回调
     */
    ready(callback){
        let _this = this;
        if(_this.readyState === 'success'){
            callback()
        } else{
            _this.setConfig().then(() => {
                callback()
            })
        }
    }
}

export let WechatRegistrar = _wechatRegistrar;

/**
 * 微信分享
 * @param  {Object} config
 *             例子： {
                    title: '',                         v
                    desc: '',
                    link: '',
                    imgUrl: '',
 *             }
 * @return
 */
export function wxShare(config){
    let DEFAULT_CONFIG = {
        title: '新欣保',
        desc: `超多选择，更多优惠`,
        link: location.href,
        imgUrl: location.protocol +'//'+ location.host + logo
    };

    config = Object.assign({}, DEFAULT_CONFIG, config);

    jssdkInstance.ready(function () {
        wx.updateAppMessageShareData(config);
        wx.updateTimelineShareData(config);
        /*分享到朋友圈*/
        wx.onMenuShareTimeline(config);
        /*分享给朋友*/
        wx.onMenuShareAppMessage(config);
        /*分享到QQ*/
        wx.onMenuShareQQ(config);
        /*分享到腾讯微博*/
        wx.onMenuShareWeibo(config);

    });
}
/**
 * 获取当前定位
 */
let getLocationPromise = null;
export function getLocation(){

    if(getLocationPromise){//ios下同时发送多次第二次会失败，所以这里排除重复
        return getLocationPromise;
    }
    let promise = new Promise((resolve, reject) => {
      let SESSION_KEY = 'locationInfo',
          sessionData = Util.getSessionData(SESSION_KEY)
      ;
      if(sessionData){
          getLocationPromise = null
          resolve(sessionData)
          return;
      }
      function where (){
        quoteService.where().then((res) => {
            if(res.code == 1){
              let locationInfo = res.object
              getLocationPromise = null;
              Util.setSessionData(SESSION_KEY, locationInfo)
              resolve(locationInfo)
            } else {
              getLocationPromise = null;
              reject('定位失败');
            }
        })
      }

      setTimeout(function(){
          reject('获取定位超时');
      }, 15000);

      if(Util.userAgentType() == "wechat"){
        jssdkInstance.ready(() => {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    let location = latitude + "," + longitude;
                    quoteService.geocoder({
                      lat:latitude,
                      lng:longitude
                    }).then((res) => {
                        if(res.code == 1){
                          let locationInfo = res.object
                          getLocationPromise = null;
                          Util.setSessionData(SESSION_KEY, locationInfo)
                          resolve(locationInfo)
                        } else {
                          // reject('点击右上角刷新获取位置');
                          where()
                        }
                    });
                },
                fail: function(err){
                  where()
                },
                cancel:function(){
                  where()
                }
            });
        })
      } else {
        where()
      }
    })
    getLocationPromise = promise;
    return promise
}
