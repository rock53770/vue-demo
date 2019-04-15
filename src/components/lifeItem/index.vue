<template>
    <div class="bg-white mt10 mlr12 bdr8 info-shadow p12">
        <div @click="opationRout">
            <div class="flex-center justify-sb ft14 mb15">
                <div class="flex-center">
                    <img :src="item.logo" height="20" width="20" class="bdr-50">
                    <span class="ml8">{{ item.company }}</span>
                </div>
                <span class="cl-orange">{{ item.handlerStatusName }}</span>
            </div>
            <div class="flex ft12">
                <img :src="item.logo" width="80" height="80" class="bdr5 info-shadow">
                <div class="ml12">
                    <h3 class="ft16 mb6">{{ item.productName }}</h3>
                    <p class="cl-gray">投保人：{{ item.applicantName }}</p>
                    <p class="cl-gray">被保人：{{ item.insuredName }}</p>
                    <p class="cl-gray">保障期间：{{ $util.formatDate(item.startTime,"yyyy-MM-dd") }} 至 {{ $util.formatDate(item.endTime,"yyyy-MM-dd") }}</p>
                </div>
            </div>
            <div class="flex-center justify-sb mt10 mb8 ft12">
                <p class="cl-yellow">推广费：{{ item.promotion }}%</p>
                <p>保费合计：<span class="ft16">{{ item.price | currency2('￥','2') }}</span></p>
            </div>
        </div>
        <div class="van-hairline--top pt10 flex-center justify-sb">
            <span class="cl-gray ft12">{{ $util.formatDate(item.handlerTime,"yyyy-MM-dd HH:mm") }}</span>
            <div class="flex-center">
                <button class="order-btn" v-show="item.isShowDelete" @click="deleteItem">删除订单</button>
                <button class="order-btn heigh-line ml8" v-show="item.isShowPay" @click="gopage('/payment', { id: item.id })">支付保单</button>
                <!-- <button class="order-btn heigh-line" v-show="item.isShowGuarantee">查看电子保单</button> -->
                <button class="order-btn heigh-line ml8" v-show="item.isShowSecondInsure" @click="gopage('/life/life_detail', { id: item.goodsId })">再次投保</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'lifeItem',
    props: ['item', 'index', 'getfn'],
    methods: {
        gopage(url, query) {
            btPage.open({
                url: url,
                container_style: 1,
                params: query,
                jsOnResume: () => {
                    this.getfn()                  
                }
            })
        },
        opationRout() {
            if (this.item.isShowDetail) {
                this.gopage('/life/life_order_detail',{ id: this.item.id })
            }
        },
        deleteItem () {
            this.$emit('del', {id: this.item.id, index: this.index })
        },   
    },
    
}
</script>
<style lang="less" scoped>
    .info-shadow {
        box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.08);
    }
    .order-btn {
        height: 28px;
        background-color: #fff;
        border: 1px solid #C6C6C6;
        color: #666;
        padding: 0 8px;
        border-radius: 14px;
        font-size: 12px;
    }
    .heigh-line {
        border-color: #FC6B47;
        color: #FC6B47;
    }
</style>
