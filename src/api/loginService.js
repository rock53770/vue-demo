
import api from './request'

export default {
  verifyCode(data) {
    return api({
      method: 'get',
      url: '/insurance/base/get/code',
      data: data,
    });
  },
  wapLogin(data){
    return api({
      method: 'post',
      url: '/insurance/base/common/login',
      data: data
    });
  },
  appLogin(data){
    return api({
      method: 'post',
      url: '/insurance/app/login/login',
      data: data
    });
  },
  updatePhone(data){
    return api({
      method: 'post',
      url: '/insurance/xxb/user-agent/update/phone',
      data: data
    });
  },
  userInfo(data){
    return api({
      method: 'post',
      url: '/wechat/common/get/userInfo',
      data: data
    });
  },
  appUserInfo(data){
    return api({
      method: 'post',
      url: '/insurance/app/login/code-to-login',
      data: data
    });
  },
  loginOut(data){
    return api({
      method: 'get',
      url: '/insurance/base/app/login/out',
      data: data
    });
  },
  getJssdkConfig(data){
    return api({
      method: 'post',
      url: '/wechat/common/get/jsticket',
      data: data
    });
  },
  soundVertify(data) {// 语音验证码
    return api({
      method: 'get',
      url: '/insurance/common/code/voice',
      data: data
    });
  }
};



































