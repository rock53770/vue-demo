import api from './request'

export default {
    validRealName(data) {//提交认证
        return api({
            method: 'post',
            url: '/insurance/xxb/user-agent/valid/real-name',
            data: data,
        });
    },
    addressList(data) {//地址列表
        return api({
            method: 'get',
            url: '/insurance/user/address/query/list',
            data: data,
        });
    },
    addressDelete(data) {//地址删除
        return api({
            method: 'post',
            url: '/insurance/user/address/delete',
            data: data,
        });
    },
    addressSave(data) {//新增地址保存
        return api({
            method: 'post',
            url: '/insurance/user/address/save',
            data: data,
        });
    },
    addressQuery(data) {//地址查询
        return api({
            method: 'get',
            url: '/insurance/user/address/query',
            data: data,
        });
    },
    addressUpdata(data) {//修改地址
        return api({
            method: 'post',
            url: '/insurance/user/address/update',
            data: data,
        });
    },
    updateDefault(data) {//修改默认地址
        return api({
            method: 'post',
            url: '/insurance/user/address/update/default',
            data: data,
        });
    },
    bankList(data) {//银行列表
        return api({
            method: 'get',
            url: '/insurance/xxb/bank/get/user/bankCard',
            data: data,
        });
    },
    bankDelete(data) {//解绑
        return api({
            method: 'post',
            url: '/insurance/xxb/bank/unbindCard',
            data: data,
        });
    },
    getUserBank(data) {//获取个人银行卡信息
        return api({
            method: 'get',
            url: '/insurance/xxb/bank/get/user/bankCard',
            data: data,
        });
    },
    bankSave(data) {//绑定银行卡
        return api({
            method: 'post',
            url: '/insurance/xxb/bank/bindCard',
            data: data,
        });
    },
    bankBin(data) {//卡bin
        return api({
            method: 'get',
            url: '/insurance/mine/policy/bank/bin',
            data: data,
        });
    },
    userAgent(data) {//获取代理人信息
        return api({
            method: 'get',
            url: '/insurance/xxb/user-agent/query/agent',
            data: data,
        });
    },
    applyAgent(data) {//申请代理人
        return api({
            method: 'post',
            url: '/insurance/xxb/user-agent/apply/agent',
            data: data,
        });
    },
    validInfo(data) {//提现时验证
        return api({
            method: 'get',
            url: '/insurance/xxb/bank/valid/info',
            data: data,
        });
    },
    transfer(data) {//提现
        return api({
            method: 'post',
            url: '/insurance/xxb/bank/transfer',
            data: data,
        });
    },
    wallet(data) {//我的钱包等
      return api({
        method: 'get',
        url: '/insurance/xxb/user-agent/wallet',
        data: data,
      });
    },
    achievementIncome(data) {//收入明细
      return api({
        method: 'get',
        url: '/insurance/xxb/user-agent/wallet/index',
        data: data,
      });
    },
    achievementTransfer(data) {//提现明细
      return api({
        method: 'get',
        url: '/insurance/mine/achievement/transfer',
        data: data,
      });
    },
    historyList(data) { // 历史推荐列表
        return api({
            method: 'get',
            url: '/insurance/xxb/user-agent/invited/records',
            data: data,
          });
    },
    historyTotal(data) { // 历史推荐统计
        return api({
            method: 'get',
            url: '/insurance/xxb/user-agent/record',
            data: data,
          });
    },
    unbindWechat(data) { // 解除微信绑定
        return api({
            method: 'get',
            url: '/insurance/app/login/unbind/wechat',
            data: data
        })
    },
    bindWechat(data) { // 微信绑定
        return api({
            method: 'post',
            url: '/insurance/app/login/bind/wechat',
            data: data
        })
    },
    changeNickName(data) { // 修改昵称
        return api({
            method: 'post',
            url: '/insurance/xxb/user-agent/update/nickname',
            data: data
        })
    },
    changePhoto(data) { // 绑定新的头像
        return api({
            method: 'post',
            url: '/insurance/xxb/user-agent/update/avatar',
            data: data
        })
    }
};
