<template>
  	<div class="cash">
      	<div class="mb10 plr10">
            <p class="lh40 cl-gray ft14">提现账户</p>
			<div class="flex hadcard pt10 pb10 pl20 bdr4 pos-r" v-if="cardInfo.encryBankCardNo" @click="goPage('/my/card')">
                <div class="mr10 bg-white icons ta-c"><img src="../../assets/icons/team/images_bank-logo@3x.png" height="22" width="22"></div>
                <div class="cl-white">
                    <p class="ft18">{{ cardInfo.bank }}</p>
                    <div class="cl-white pos-a posCard">更换新卡</div>
                    <p class="ft12">储蓄卡</p>
                    <div class="ft18 mt10 flex-center">
                        <span class="mr25 centerstat">****</span>
                        <span class="mr25 centerstat">****</span>
                        <span class="mr25 centerstat">****</span>
                        <span>{{cardInfo.encryBankCardNo.substr(-4)}}</span>
                    </div>
                </div>
			</div>
			<div class="pt10 pb10 h60 uncard flex-center justify-c" v-else @click="goPage('/my/card')">
			    <img src="../../assets/icons/add@2x.png" width="20" height="20">
			    <p class="cl-gray ml10">添加银行卡</p>
			</div>
      	</div>
        <div class="bg-white">
            <div class="cl-gray lh40 plr10 flex-center justify-sb">
                <span>提现金额</span>
                <div class="widthDraw cl-orange" @click="widthDrawAll">全部提现</div>
            </div>
            <!-- <van-cell-group> -->
                <van-field v-model="cash " label="￥" v-focus class="ft30" clearable>
                </van-field>
            <!-- </van-cell-group> -->
            <div class="cl-gray lh40 plr10">可提现额度{{data.balance|currency2('￥',2)}}</div>
        </div>
        <div class="mlr20 pb15 pt40">
            <van-button type="primary" round :block="true" :loading="loading" @click="withdraw" text="提现"></van-button>
        </div>
        <div class="cl-gray lh20 ft12 mt20 mlr10">
            <p>温馨提示：<br>
            1.单笔提现金额最小为50元，最高为50000元<br>
            2.提现免手续费，每日仅限提现三笔<br>
            3.提现资金T+2工作日到账（遇周末和法定节假日顺延)。<br>
            4.特殊情况下，如因银行网络异常导致延迟到账的，请及时致电客 服热线400-603-8787
            </p>
        </div>
    </div>
</template>

<script>
import myService from "@/api/myService";
    export default {
        name: "cash",
        data() {
            return {
                accountId: "",
                data: {},
                money: 300000,
                waitAmount: 300,
                cash: "",
                cardInfo: {
                    encryBankCardNo: ""
                },
                loading: false
            };
        },
        created() {
            this.getData();
        },
        methods: {
            goPage(url, query) {
                btPage.open({
                    url: url,
                    container_style: 1,
                    params: query,
                    jsOnResume: () => {
                        this.getData();
                    }
                });
            },
            getData() {
                Toast.loading({
                    duration: 0,
                    forbidClick: true,
                    message: "加载中..."
                });
                myService.wallet().then(res => {
                    if (res.code == 1 && res.object) {
                        this.data = res.object;
                        myService.getUserBank().then(res => {
                            Toast.clear();
                            if (res.code == 1) {
                                this.cardInfo = res.object || {};
                            } else {
                                Toast(res.message);
                            }
                        });
                    } else {
                        Toast(res.message);
                    }
                });
            },
            // 
            addCard() {
                this.goPage("/my/card");
            },
            // 提现请求
            withdraw() {
                
                if (!this.cardInfo.encryBankCardNo) {
                    Toast("请添加银行卡");
                    return;
                }
                if (!this.cash) {
                    Toast("请输入提现金额");
                    return;
                }
                if (isNaN(this.cash)) {
                    Toast("请输入正确的提现金额");
                    return;
                }
                var cashFen = parseFloat(this.cash) * 100;
                if (cashFen < 5000) {
                    Toast("单笔提现金额最小为50元");
                    return;
                }
                if (cashFen > this.data.balance * 100) {
                    Toast("超过可提额度");
                    return;
                }
                if (cashFen > 5000000) {
                    Toast("单笔提现金额最大为50000元");
                    return;
                }
                this.loading = true;

                myService.validInfo()
                    .then((res) => {
                        if(res.code == 1 && res.object){
                            if(res.object.code === 0){
                                myService.transfer({
                                    transferMoney:total
                                }).then((res) => {
                                    this.loading = false;
                                    if(res.code == 1){
                                        let url = this.$route.query.type == 1 ? "/my/cash-result" : "/team/team_result"
                                        btPage.open({
                                            url: url,
                                            container_style: 1,
                                            type: 3
                                        });
                                    } else {
                                        Toast(res.message)
                                        this.loading = false;
                                    }
                                })
                            } else {
                                Toast(res.object.message)
                                this.loading = false;
                            }
                        } else {
                            Toast(res.message)
                            this.loading = false;
                        }
                })
            },
            widthDrawAll() {
                this.cash = Util.fixed2(this.data.balance);
            },
        },
        mounted() {
            setPageTitle("提取团队余额");
        }
    };
</script>
<style lang="less">
    .cash .van-field .van-cell__title {
        font-size: 36px;
        max-width: 40px !important;
    }
    .hadcard {
        background: url(../../assets/images/bg_card@3x.png) center center no-repeat;
        background-size: 100% 100%;
        border-radius: 4px;
        .posCard {
            font-size: 12px;
            height: 24px;
            line-height: 24px;
            padding: 0 5px;
            border: 1px solid #fff;
            right: 20px;
            top: 10px;
            border-radius: 4px;
        }
    }
    .centerstat {
        transform: translateY(3px)
    }
    .uncard {
        border: 1px #D5D5D5 dashed;
        border-radius: 8px;
    }
    .addcard {
        border: 2px #D5D5D5 solid;
        border-radius: 50%;
    }
    .icons {
        height: 36px;
        width: 36px;
        border-radius: 50%;
        padding-top: 5px;
    }
</style>


