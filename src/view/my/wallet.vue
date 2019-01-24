<template>
    <div>
        <div class="lh22 ft16 plr10 bg-white">
            <div class="flex-center pt16 pb16">
                <p class="flex-1 cl-gray">可提现余额（元）</p>
                <span class="cl-orange" @click="go">收支明细</span>
            </div>
            <div class="pb16" style="line-height:50px;font-size:36px;">{{data.balance|currency2('￥',2)}}</div>
        </div>
        <div class="mt10 pt16 pb16 flex-center bg-white ta-c">
            <div class="flex-1">
                <p class="mb8 lh20 cl-gray">冻结中（元）</p>
                <div class="ft16 lh22">{{data.frozenBalance|currency2('￥',2)}}</div>
            </div>
            <div class="flex-1">
                <p class="mb8 lh20 cl-gray">总收入（元）</p>
                <div class="ft16 lh22">{{data.incomeAmount|currency2('￥',2)}}</div>
            </div>
        </div>
        <div class="mlr20 mt40">
            <van-button type="primary" :block="true" round :loading="loading" @click="goCash" text="申请提现"></van-button>
        </div>
        <div class="h40">
            <div class="ta-c lh40 pos-f ft14 cl-gray mt10 w-100" style="bottom:55px">
                <span>如有疑问请联系客服：<a href="tel:4006038787" class="cl-orange">400-603-8787</a></span>
            </div>
        </div>
    </div>
</template>

<script>
import myService from "@/api/myService";

export default {
    name: "wallet",
    data() {
        return {
            data: {},
            loading: false
        };
    },
    created() {
        this.getData()
    },
    mounted: function() {
        setPageTitle("我的钱包");
    },
    methods: {
        goPage(url, query) {
            btPage.open({
                url: url,
                container_style: 1,
                params: query,
                jsOnResume: () => {
                    if (GConfig.isInApp) {
                        this.getData()
                    }
                }
            });
        },
        getData() {
            myService.wallet()
                .then(res => {
                    if (res.code == 1 && res.object) {
                        this.data = res.object;
                    } else {
                        Toast(res.message);
                    }
                });
        },
        go() {
            // this.$router.push({ name: "balanceDetail" });
            this.goPage("/achieve/balanceDetail");
        },
        goCash() {
            this.loading = true;
            myService.validInfo().then(res => {
                this.loading = false;
                if (res.code == 1) {
                  // 0可提现;1未申请代理人;2未认证代理人或者代理人认证失败;3未绑定银行卡,4代理人信息审核中,5未实名
                    if (res.object.code === 1) {
                        this.goPage("/my/agent-notice",{noApply:1});
                    } else if (res.object.code == 2) {
                        this.goPage("/my/agent-notice");
                    } else if (res.object.code == 4) {
                        this.goPage("/my/agenting");
                    } else if (res.object.code == 5) {
                        this.goPage("/my/auth");
                    } else {
                        this.goPage("/my/cash");
                    }
                } else {
                    Toast(res.message);
                }
            });
        }
    }
}
</script>
