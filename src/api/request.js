
import router from '@/router'
import Axios from 'axios'

// 创建实例时设置配置的默认值
var axios = Axios.create({
  // baseURL: 'https://api.example.com'
});
// 在实例已创建后修改默认值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

// 公共请求头参数定义
// client-type:表示客户来源，可取范围（1:pc或h5,2:微信公众号,3:微信小程序,4:app,5:百度小程序,6:支付宝小程序）默认为1
// company-brand-type:表示品牌类型，可取范围（1:保赞,2:爱卡资产,3:新欣保）
// user-identity-type:表示客户端用户身份类型，可取范围 （1:代理人，2:个人，3:员工，4:车商）
// device-type:表示app端类型，可取范围（1:ios，2:安卓）
// device-token:设备唯一标识
axios.defaults.headers['client-type'] = Util.userAgentType() == "wechat" ? '2' : '1';
axios.defaults.headers['company-brand-type'] = '3';
axios.defaults.headers['user-identity-type'] = '1';
axios.defaults.headers['device-type'] = !!navigator.userAgent.match(/iPhone|iPod|iPad/i) ? '1' : '2';
axios.defaults.headers['device-token'] = '';

var submitMap = {};

export default function get(config) {
  if (GConfig.isTest || sessionStorage.isTest) {
    // config.url = '/mock/api/m' + config.url
    config.url = '/mock/5b8e2934d3e04c7d342dcd4d' + config.url
    config.testUrl = config.url;
  } else {
    config.url = '/api/m' + config.url
  }


  if(config.method === "multiPart"){

  } else {
    config.method = config.method.toLowerCase();
  }
  if (config.data) {
    for (let key in config.data) {
      if (config.data[key] === null) {
        delete config.data[key];
      }
    }
  } else {
    config.data = {};
  }
  let headers = {
    'AccessToken': Util.getCookie("AccessToken"),
  }
  headers = Object.assign({},headers,config.headers)
  let data = {}
  let promise = new Promise((resolve, reject) => {
		if(GConfig.isInApp && 1){
      config.head = {
        'AccessToken':"",
        "client-type":'4',
        "company-brand-type":"3",
        "user-identity-type":"1",
        "device-type":!!navigator.userAgent.match(/iPhone|iPod|iPad/i) ? '1' : '2',
        "device-token":"",
      };
      if(Util.getLocalData("appInfo") && Util.getLocalData("appInfo").pushId){
        config.head['device-token'] = Util.getLocalData("appInfo").pushId;
      }
      var AccessToken = Util.getLocalData("AccessToken");
      if (AccessToken) {
        config.head.AccessToken = AccessToken;
      }
      console.log(config)
      wv.fetchData(config, (data)=>{
        console.log("请求url: " + config.url)
        resolve(data)
      });

		} else{
      if (config.method == 'post') {
        axios({
          method:'post',
          url:config.url,
          data:config.data,
          headers: headers,
          transformRequest: [function (data) {
            if(headers.post && headers.post['Content-Type'] == ''){
              return data
            }
            var tmpArr = [];
              data && Object.keys(data).forEach(function(k,v){
              if (data[k] === null || data[k] === undefined) data[k] = "";
              tmpArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
            })
            return tmpArr.join('&').replace(/%20/g, '+')
          }],
        }).then((result) => {

          resolve(result.data)
        }).catch(function(error) {
          Toast("" + error);
          // console.log(error)
        });
      } else {
        data = axios.get(config.url, {
          params: config.data,
          headers: headers,
        }).then((result) => {
          // console.log(result)
          resolve(result.data)
        }).catch(function(error) {
          Toast("" + error);
          // console.log(error)
        });
      }
    }
  })

  return promise.then((result) => {
    //cookie失效 code:-1
    if (result.code && result.code == 1000) {
        console.log(router.currentRoute)

        if(GConfig.isInApp){
          Util.removeLocalData("AccessToken");
          Util.removeLocalData("userInfo");
          btPage.open({
            url: '/app_login',
            enter_animate:2,
            type:3,
            container_style:1
          })
        } else {
          Util.removeCookie("AccessToken");
          Util.removeCookie("userInfo");
          if(router.currentRoute.path != '/login'){
              app.$router.push({
                  path: '/login',
                  query: {redirect: router.currentRoute.fullPath}
              });
          }
        }

    }
    return result
  })
}


































