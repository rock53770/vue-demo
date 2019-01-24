<template>
    <div>
        <div class="ta-c bg-white pt24 pb20">
            <img src="~@/assets/icons/pay-succ.png" width="53">
            <p class="mt10 mb10 ft18">支付成功</p>
            <p class="cl-gray">添加配送方式可以完成该订单</p>
            <!-- <p class="cl-gray">{{second}}秒后将自动跳转</p> -->
        </div>
        <div class="mt10 bg-white">
            <div class="plr10 lh50 flex-center van-hairline--bottom">
                <span class="flex-1 lh50 ft16">保单清单</span>
                <a class="cl-orange" href="tel:4006038787">联系客服</a>
            </div>
            <div class="bg-white ft14 p10">
                <div class="flex-center lh20">
                    <span class="flex-1 cl-gray">车主姓名</span>
                    <span v-text="datas.onwerName"></span>
                </div>
                <div class="flex-center lh20">
                    <span class="flex-1 cl-gray">车牌号</span>
                    <span v-text="datas.plate"></span>
                </div>
                <div class="flex-center lh20" v-if="datas.commercialInsurancePremium">
                    <span class="flex-1 cl-gray">商业险总计</span>
                    <span>{{datas.commercialInsurancePremium|currency('￥','2')}}</span>
                </div>
                <div class="flex-center lh20" v-if="datas.compulsoryInsurancePremium">
                    <span class="flex-1 cl-gray">交强险</span>
                    <span>{{datas.compulsoryInsurancePremium|currency('￥','2')}}</span>
                </div>
                <div class="flex-center lh20" v-if="datas.vehicleVesselTax">
                    <span class="flex-1 cl-gray">车船税</span>
                    <span>{{datas.vehicleVesselTax|currency('￥','2')}}</span>
                </div>
                <!-- <div class="ta-r van-hairline--top mt10 pt10">
                    <b class="cl-orange lh25 ft18">保费总计{{datas.totalInsurancePremium|currency('￥','2')}}</b>
                </div>-->
            </div>
        </div>
        <div class="mt10 bg-white">
            <div class="plr10 lh50 flex-center van-hairline--bottom">
                <span class="flex-1 lh50 ft16">发票信息</span>
            </div>
            <div class="plr10 pt20 pb20">{{ datas.ticketInfo }}</div>
        </div>
        <div class="h70">
            <div class="flex-center pos-f b0 bg-white h70 p10 plr5 w-100 zi10 van-hairline--top">
                <van-button type="primary" round plain class="flex-1 mlr5" @click="go" text="订单管理"></van-button>
                <van-button type="primary" round class="flex-1 mlr5" @click="next" text="添加配送方式"></van-button>
            </div>
        </div>
    </div>
</template>

<script>
import orderService from "@/api/orderService";
import { Toast } from "vant";

export default {
    name: "payResult",
    data() {
        return {
            second: 3,
            id: "",
            datas: {},
            loading: false
        };
    },
    methods: {
        gopage(url, query) {
            // this.$router.push({ path: url, query: query });
            btPage.open({
                url: url,
                container_style: 1,
                type: 3,
                params: query
            });
        },
        next() {
            // this.$router.push({name:"chooseAddress",query:{ id:this.$route.query.id }})
            this.gopage("/order/choose_address", { id: this.$route.query.id });
        },
        go() {
            // this.$router.push({name:"order",query:{type:1}})
            this.gopage("/order", { type: 1 });
        },
        getMsg() {
            Toast.loading({
                mask: true,
                message: "加载中...",
                duration: 0
            });
            orderService.getPayDoneMsg({ id: this.$route.query.id }).then(res => {
                Toast.clear();
                if (res.code == 1) {
                    this.datas = res.object;
                } else {
                    Toast(res.message);
                }
            });
        },
        setHead(isActive) {
            var self = this;
            this.$store.dispatch("setHead", {
                needBack: false,
            });
        }
    },
    mounted() {
        setPageTitle("支付状态");
        this.getMsg();
        this.setHead()
        wv.customBackAction(function() {});
        wv.setWebViewInfo({
            wvBackDisable:1
        })
    }
};
</script>

