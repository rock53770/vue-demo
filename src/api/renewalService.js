import api from './request'

export default {
  getPolicyDetail(data) { // 获取保单详情
    return api({
      method: 'get',
      url: '/insurance/anxin/policy/detail',
      data: data,
    })
  },
  doPay(data) { // 立即投保
    return api({
      method: 'post',
      url: '/insurance/anxin/go/insured',
      data: data,
    })
  }
}
