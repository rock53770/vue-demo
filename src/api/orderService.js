import api from './request'

export default {
    getOrderLists(data) {// 订单 - 报价单
        return api({
            method: 'get',
            url: '/insurance/xxb/order/index',
            data: data
        });
    },
    // getOrderTradeLists(data) {// 订单 - 交易中
    //     return api({
    //         method: 'get',
    //         url: '/insurance/xxb/order/trade',
    //         data: data,
    //     });
    // }, 
    // getOrderDoneLists(data) {// 订单 - 交易完成
    //     return api({
    //         method: 'get',
    //         url: '/insurance/xxb/order/completion',
    //         data: data,
    //     });
    // }, 
    getQuoteLists(data) {// 订单详情
        return api({
            method: 'get',
            url: '/insurance/xxb/order/details',
            data: data,
        });
    },
    postDeleteQuote(data) {// 删除保单
        return api({
            method: 'post',
            url: '/insurance/xxb/order/delete',
            data: data,
        });
    },
    getQuoteDetail(data) {// 报价单详情
        return api({
            method: 'get',
            url: '/insurance/xxb/order/quotation/detail',
            data: data,
        });
    },
    paycheck(data) {//获取支付详情
        return api({
            method: 'get',
            url: '/insurance/xxb/order/paycheck/1_0_0_0',
            data: data,
        });
    },
    payok(data) {//订单确认支付
        return api({
            method: 'post',
            url: '/insurance/xxb/order/payok/1_0_0_0',
            data: data,
        });
    },
    payout(data) {//二维码失效重新申请
        return api({
            method: 'post',
            url: '/insurance/xxb/order/payout/1_0_0_0',
            data: data,
        });
    },
    mailing(data) {//补全地址
        return api({
            method: 'post',
            url: '/insurance/xxb/order/mailing',
            data: data,
        });
    },
    postUnderwrit(data) {//提交核保
        return api({
            method: 'post',
            url: '/insurance/xxb/order/underwriting',
            data: data,
        });
    },
    postInsure(data) {//提交投保
        return api({
            method: 'post',
            url: '/insurance/xxb/order/autograph',
            data: data,
        });
    },
    getCarDetail(data) {//获取车辆信息
        return api({
            method: 'get',
            url: '/insurance/xxb/order/car/detail/1_0_0_0',
            data: data,
        });
    },
    getHasImgs(data) { // 获取已上传的图片信息
        return api({
            method: 'get',
            url: '/insurance/xxb/order/pic',
            data: data
        })
    },
    postOrderPic(data) {// 车辆信息-图片保存
        return api({
            method: 'post',
            url: '/insurance/xxb/order/pic',
            data: data
        })
    },
    postPayok(data) { // 支付确认
        return api({
            method: 'post',
            url: '/insurance/xxb/order/payok/1_0_0_0',
            data: data
        })
    },
    getPayDoneMsg(data) {  
        return api({
            method: 'get',
            url: '/insurance/xxb/order/pay-ok-info',
            data: data
        })
    },
    getSelfAddress(data) { // 获取自营网点地址
        return api({
            method: 'get',
            url: '/insurance/xxb/order/query/pickUpLocation',
            data: data
        }) 
    },
    orderChange(data) {// 变更报价单
        return api({
            method: 'post',
            url: '/insurance/xxb/order/change',
            data: data
        })
    }, 
    shareDetail(data) { // 报价单分享接口
        return api({
            method: 'get',
            url: '/insurance/xxb/share/quote',
            data: data
        })
    }
};
