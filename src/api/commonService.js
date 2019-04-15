import api from './request'
import loginService from './loginService'
export default {
  setConfig: function(url){
      let _this = this;
      loginService.getJssdkConfig({
          url: url.split('#')[0],
          // url: encodeURIComponent(url),
          appid:"1"
      }).then((data) => {
          // if(jssdkInstance != _this){//已经换页了，就不执行了
          //     return reject();
          // }
          if (data.code != 1) {
              Toast.fail(data.message);
          } else {
              wx.config({
                  debug: GConfig.wechatDebug, // 开启调试模式
                  appId: data.object.appId, // 必填，公众号的唯一标识
                  timestamp: data.object.timestamp, // 必填，生成签名的时间戳
                  nonceStr: data.object.nonceStr, // 必填，生成签名的随机串
                  signature: data.object.signature, // 必填，签名，见附录1
                  jsApiList: GConfig.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              })
          }
      })
  },
  upload(data) {
    return api({
      method: 'post',
      headers:{
        post:{
          'Content-Type':''
        }
      },
      url: '/insurance/common/file/upload',
      data: data,
    });
  },
  uploadApp(fileUrls,otherData) {
    return api({
      method: 'multiPart',
      url: '/insurance/common/file/upload',
      data: otherData||{},
      fileData: {
        ['file']: fileUrls
      }
    });
  },
  testPay(data) { // 支付测试-无用的
    return api({
        method: 'post',
        url: '/weixin/wxpayPaymentNotify/testPay',
        data: data
    });
  },
  payConfig(data) { // 订单支付
    return api({
        method: 'post',
        url: '/insurance/policy/pay/config',
        data: data
    });
  },
}
