import api from './request'

export default {
    home(data) {//业绩首页数据
        return api({
            method: 'get',
            url: '/insurance/xxb/achievement/index',
            data: data,
        })
    },
    balanceFlow(data) {//收支明细
        return api({
            method: 'get',
            url: '/insurance/xxb/achievement/balanceFlow',
            data: data,
        })
    },
    achieveFlow(data) { //业绩明细
        return api({
            method: 'get',
            url: '/insurance/xxb/achievement/details',
            data: data,
        })
    }
}
