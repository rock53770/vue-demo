import api from './request'

export default {
    bannerQuery() {//轮播图
        return api({
            method: 'get',
            url: '/insurance/banner/query/1_0_0_0',
            data: {},
        });
    },
    where() {//ip定位获取城市
        return api({
            method: 'get',
            url: '/insurance/common/ip-location',
        });
    },
    noticeInfo() {//notice数量
        return api({
            method: 'get',
            url: '/insurance/mine/notice/info',
        });
    },
    geocoder(data) {//经纬度获取城市
        return api({
            method: 'get',
            url: '/insurance/common/geocoder',
            data: data,
        });
    },
    area() {//城市数据
        return api({
            method: 'get',
            url: '/insurance/common/opencity',
        });
    },
    orderCompany(data) {//根据城市获取保险产品列表
        return api({
            method: 'get',
            url: '/insurance/xxb/order/company/1_0_0_0',
            data: data,
        });
    },
    orderProduct(data) {//获取险种
        return api({
            method: 'get',
            url: '/insurance/xxb/order/product/1_0_0_0',
            data: data,
        });
    },
    quote(data) {//生成报价单
        return api({
            method: 'post',
            url: '/insurance/xxb/order/create',
            data: data,
        });
    },
    notice(data) {//获取消息列表页
        return api({
            method: 'get',
            url: '/insurance/mine/notice/list',
            data: data,
        });
    },
    // orderPic(data) {//提交图片
    //     return api({
    //         method: 'post',
    //         url: '/insurance/xxb/order/pic/1_0_0_0',
    //         data: data,
    //     });
    // },
    // orderParame(data) {//提交险种
    //     return api({
    //         method: 'post',
    //         url: '/insurance/xxb/order/parame/1_0_0_0',
    //         data: data,
    //     });
    // },
    // orderAutograph(data) {//去投保
    //     return api({
    //         method: 'post',
    //         url: '/insurance/xxb/order/autograph/1_0_0_0',
    //         data: data,
    //     });
    // }
};
