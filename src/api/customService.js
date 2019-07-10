import api from './request'

export default {
  customerGet:(data) => { // 非车客户详情
    return api({
      method: 'get',
      url: '/insurance/goods/customer/get',
      data: data
    });
  },
  customerList(data) { // 非车客户管理
    return api({
      method: 'get',
      url: '/insurance/goods/customer/list',
      data: data
    });
  },
  customerSave(data) { // 非车客户保存
    return api({
      method: 'post',
      url: '/insurance/goods/customer/save',
      data: data
    });
  },
}

