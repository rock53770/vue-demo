import api from './request'

export default {
  getGroupDetail(data) { // 获取开团结果
    return api({
      method: 'get',
      url: '/insurance/anxin/group/detail',
      data: data
    });
  },
  groupUserList(data) { // 当前所在拼团用户列表接口
    return api({
      method: 'get',
      url: '/insurance/anxin/group/user/list',
      data: data
    });
  },
  chanceNum(data) { // 获取活动抽奖次数接口
    return api({
      method: 'get',
      url: '/insurance/anxin/get/activity/chance/num',
      data: data
    });
  },
  collection(data) { // 领取接口
    return api({
      method: 'post',
      url: '/insurance/anxin/group/free/collection',
      data: data
    });
  },
  lottery(data) { // 抽奖接口
    return api({
      method: 'post',
      url: '/insurance/anxin/activity/lottery',
      data: data
    });
  },
  getGroup(data) { // 获取团队接口
    return api({
      method: 'get',
      url: '/insurance/anxin/get/group',
      data: data
    });
  },
  checkCode(data) { // 验证码校验接口
    return api({
      method: 'get',
      url: '/insurance/anxin/check/code',
      data: data
    });
  }
}
