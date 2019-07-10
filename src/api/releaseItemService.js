import api from './request'

export default {
  getInsurance(data) {
    //获取选择险种信息
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/insurance',
      data
    });
  },
  createOrder(data) {
    //创建订单
    return api({
      method: 'post',
      url: '/insurance/clue/send/create/order',
      data
    });
  },
  quoteItemList(data) {
    //报价列表接口
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/detail',
      data
    });
  },
  getCarDetail(data) {
    //获取车辆信息
    return api({
      method: 'get',
      url: '/insurance/clue/send/car/detail',
      data
    });
  },
  getCarDetailPic(data) {
    //获取车辆信息图片信息
    return api({
      method: 'get',
      url: '/insurance/clue/send/pic',
      data
    });
  },
  quoteItemDetail(data) {
    //报价单详情
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/quote/detail',
      data
    });
  },
  quoteItemDetailOver(data) {
    //报价单详情 完成
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/complete/order/detail',
      data
    });
  },
  putInsurance(data) {
    //发起出单
    return api({
      method: 'post',
      url: '/insurance/clue/send/go/insured',
      data
    });
  },
  changeInsurance(data) {
    //更换报价单
    return api({
      method: 'post',
      url: '/insurance/clue/send/change/quote',
      data
    });
  },
  getPayInfo(data) {
    //获取支付信息
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/pay/detail',
      data
    });
  },
  reGetQRcode(data) {
    //重新获取支付接口
    return api({
      method: 'get',
      url: '/insurance/clue/send/regain/pay/code',
      data
    });
  },
  payFinish(data) {
    //支付完成
    return api({
      method: 'post',
      url: '/insurance/clue/send/complete/pay',
      data
    });
  },
  payDetail(data) {
    //支付结果详情
    return api({
      method: 'get',
      url: '/insurance/clue/send/complete/pay/detail',
      data
    });
  },
  addSendAddress(data) {
    // 添加配送方式
    return api({
      method: 'post',
      url: '/insurance/clue/send/add/address',
      data
    });
  },
  allAddress(data) {
    // 所有地址
    return api({
      method: 'get',
      url: '/insurance/clue/send/get/history/address',
      data
    });
  },
  confirmPay(data) {
    // 确认发起支付状态接口
    return api({
      method: 'post',
      url: '/insurance/clue/send/confirm/pay',
      data
    });
  }
};
