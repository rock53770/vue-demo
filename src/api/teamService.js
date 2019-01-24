import api from './request'

export default {
    teamDetail(data) { // 我的团队
        return api({
            method: 'get',
            url: '/insurance/xxb/team/index',
            data: data
        });
    },
    teamMonthCharts(data) { // 月排行
        return api({
            method: 'post',
            url: '/insurance/xxb/team/monthIncome',
            data: data
        });
    },
    teamTotalCharts(data) { // 总排行
        return api({
            method: 'post',
            url: '/insurance/xxb/team/totalIncome',
            data: data,
        });
    },
    addPersonal(data) { // 7日增员
        return api({
            method: 'get',
            url: '/insurance/xxb/team/increase/personnel',
            data: data
        });
    },
    addProfit(data) { // 7日收益
        return api({
            method: 'get',
            url: '/insurance/xxb/team/profit',
            data: data
        });
    },
    teamAchieve(data) { // 团队业绩明细
        return api({
            method: 'get',
            url: '/insurance/xxb/team/achievement/detail',
            data: data
        });
    },
    teamMember(data) { // 团队管理
        return api({
            method: 'get',
            url: '/insurance/xxb/team/member',
            data: data
        });
    },
    teamRecord(data) { // 我的推荐统计
        return api({
            method: 'get',
            url: '/insurance/xxb/user-agent/record',
            data: data
        });
    },
    teamTask(data) { // 团队任务列表
        return api({
            method: 'get',
            url: '/insurance/xxb/team/tasks',
            data: data
        })
    },
    teamCreated(data) { // 创建团队
        return api({
            method: 'post',
            url: '/insurance/xxb/team/index',
            data: data
        })
    },
    teamTaskCb(data) { // 任务完成callback
        return api({
            method: 'post',
            url: '/insurance/xxb/team/task/witch',
            data: data
        })
    },
    wallet(data) { // 可提现总额
        return api({
            method: 'get',
            url: '/insurance/xxb/team/wallet',
            data: data
        })
    },
    cash(data) { // 体现操作
        return api({ 
            method: 'post',
            url: '/insurance/xxb/team/cash',
            data: data
        })
    },
    cashFLow() { // 提现流水
        return api({
            method: 'get',
            url: '/insurance/xxb/team/cash-flow'
        })
    }
};
