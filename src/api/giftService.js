import api from './request'

export default {
  getGift(data) { // 免费领取
    return api({
      method: 'post',
      url: '/insurance/anxin/free/collection',
      data: data,
    })
  }
}
