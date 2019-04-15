import api from './request'

export default {
  lifeOrder(data) { // 寿险列表
    return api({
      method: 'get',
      url: '/insurance/base/order/index',
      data: data
    });
  },
  goodsDetail(data) { // 产品详情
    return api({
      method: 'get',
      url: '/insurance/goods/detail',
      data: data
    });
  },
  goodsShareDetail(data) { // 产品详情分享
    return api({
      method: 'get',
      url: '/insurance/goods/detail/share',
      data: data
    });
  },
  goodsPreDetail(data) { // 产品详情预览
    return api({
      method: 'get',
      url: '/insurance/goods/detail/preview',
      data: data
    });
  },
  information(data) { // 健康告知
    return api({
      method: 'get',
      url: '/insurance/xxb/order/life/safeInformation',
      data: data
    });
  },
  hotGoods(data) { // 热卖商品
    return api({
      method: 'get',
      url: '/insurance/goods/hot/list',
      data: data
    })
  },
  getGoodsList(data) { // 商品列表
    return api({
      method: 'get',
      url: '/insurance/goods/list',
      data: data,
    });
  },
  getTags() { // 寿险tags
    return api({
      method: 'get',
      url: '/insurance/goods/tags',
    })
  },
  getCustomerInfo(data) { // 客户投保资料必填项获取
    return api({
      method: 'get',
      url: '/insurance/goods/customerInfoRule/get',
      data: data,
    });
  },
  getOrderDetail(data) { // 订单详情
    return api({
      method: 'get',
      url: '/insurance/base/order/details',
      data: data,
    });
  },
  getProfession(data) { // 职业列表
    return api({
      method: 'get',
      url: '/common/profession/list',
      data: data,
    });
  },
    calculate(data) { // 获取价格
        return api({
        method: 'post',
            url: '/insurance/goods/calculate',
            data: data,
        });
    },
  computePrice(data) { // 计算价格
    return api({
      method: 'post',
      url: '/insurance/goods/compute/price',
      data: data,
    });
  },
  createOrder(data) { // 创建订单
    return api({
      method: 'post',
      url: '/insurance/base/order/create',
      data: data,
    });
  },
  getIdType(data) { // 获取证件类型
    return api({
      method: 'get',
      url: '/insurance/goods/document/type',
      data: data,
    });
  },
  getRelationship(data) { // 获取被保人关系
    return api({
      method: 'get',
      url: '/insurance/goods/personnel/relationship',
      data: data,
    });
  },
  deleteOrder(data) { // 删除订单
    return api({
      method: 'post',
      url: '/insurance/base/order/delete',
      data: data,
    });
  }
}
