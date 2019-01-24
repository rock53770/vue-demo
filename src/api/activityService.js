import api from './request'

export default {
    config(data) {//配置
        return api({
            method: 'get',
            url: '/insurance/activity/double/festival/config',
            data: data,
        });
    },
    index(data) {//排行首页
        return api({
            method: 'get',
            url: '/insurance/activity/double/festival/index',
            data: data,
        });
    },
    detail(data) {//排行详情
        return api({
            method: 'get',
            url: '/insurance/activity/double/festival/detail',
            data: data,
        });
    },
    qr(data) {//qr
      return api({
          method: 'get',
          url: '/insurance/xxb/user-agent/get-qrcode',
          data: data,
      });
  },
};
