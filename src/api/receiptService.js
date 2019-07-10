import request from './request'

let api = function(obj){
  return request(Object.assign({},obj,{
    headers: {
      post: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }})
  )
}
export default {
  getEntryPremission(data) { // 获取入口权限
    return request({
      method: 'get',
      url: '/insurance/clue/common/permission',
      data: data,
    });
  },
  getPremissionEnum(data) { // 获取通用权限枚举 （车辆种类/使用性质）
    return request({
      method: 'get',
      url: '/insurance/clue/common/enums',
      data: data,
    });
  },
  getPurchaseList(data) { // 获取线索大厅列表
    return request({
      method: 'get',
      url: '/insurance/clue/receive/order/list',
      data: data,
    });
  },
  getPurchaseDetail(data) { // 获取需求详情
    return request({
      method: 'get',
      url: '/insurance/clue/receive/order/detail',
      data: data,
    });
  },
  getCarDetail(data) { // 获取需求车辆详情
    return request({
      method: 'get',
      url: '/insurance/clue/receive/order/car/detail',
      data: data,
    });
  },
  sendQuote(data) { // 发起报价
    return api({
      method: 'post',
      url: '/insurance/clue/receive/quote',
      data: data
    });
  },
  getMyReceiptList(data) { // 获取我的收单列表
    return request({
      method: 'get',
      url: '/insurance/clue/receive/mine/quote/list',
      data: data,
    });
  },
  getReceiptDetail(data) { // 获取我的收单详情
    return request({
      method: 'get',
      url: '/insurance/clue/receive/mine/quote/detail',
      data: data,
    });
  },
  confirmPay(data) { // 确认支付
    return api({
      method: 'post',
      url: '/insurance/clue/receive/mine/quote/confirm/pay',
      data: data,
    });
  },
  getPolicyInfo(data) { // 获取保单信息
    return request({
      method: 'get',
      url: '/insurance/clue/receive/mine/quote/get/policy',
      data: data,
    });
  },
  sendAddPlicyInfo(data) { // 上传保单信息
    return api({
      method: 'post',
      url: '/insurance/clue/receive/mine/quote/add/policy',
      data: data
    });
  },
  getInsuranceCompany(data) { // 获取保险公司
    return request({
      method: 'get',
      url: '/insurance/clue/common/companies',
      data: data,
    });
  },
  uploadQrCode(data) { // 上传/更新支付二维码
    return api({
      method: 'post',
      url: '/insurance/clue/receive/mine/quote/upload/qrcode',
      data: data,
    });
  },
  getInvoiceDetail(data) { // 获取发票信息
    return request({
      method: 'get',
      url: '/insurance/clue/receive/mine/quote/invoice',
      data: data,
    });
  }
}
