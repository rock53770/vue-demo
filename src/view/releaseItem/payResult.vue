<template>
  <div class="payResult-wrapper">
    <div class="ta-c bg-white pt24 pb20">
      <img src="~@/assets/icons/team/icon_right@3x.png" width="53">
      <p class="mt10 mb10 ft18">保单支付完成</p>
      <p class="cl-gray">添加配送方式可以完成该订单</p>
    </div>
    <div class="mt10 bg-white">
      <div class="plr10 lh50 flex-center van-hairline--bottom">
        <span class="flex-1 lh50 ft16">保单清单</span>
        <div class="right flex-center">
          <img src="~@/assets/images/releaseItem/icon_kefu@2x.png" width="20">
          <a class="cl-primary ml5" @click="call">联系客服</a>
        </div>
      </div>
      <div class="bg-white ft14 p10 policy-list">
        <div class="flex-center lh30">
          <span class="cl-gray word">车主姓名</span>
          <span class="flex-1" v-text="dataSoure.ownerName"></span>
        </div>
        <div class="flex-center lh30">
          <span class="cl-gray word">车牌号</span>
          <span class="flex-1" v-text="dataSoure.plate"></span>
        </div>
        <div class="flex-center lh30">
          <span class="cl-gray word">总计保费</span>
          <span class="flex-1 cl-orange">{{ dataSoure.totalPremium|currency('￥','2') }}</span>
        </div>
        <!-- <div class="flex-center lh30" v-if="dataSoure.commercialInsurancePremium">
          <span class="flex-1 cl-gray">商业险总计</span>
          <span>{{dataSoure.commercialInsurancePremium|currency('￥','2')}}</span>
        </div>
        <div class="flex-center lh30" v-if="dataSoure.compulsoryInsurancePremium">
          <span class="flex-1 cl-gray">交强险</span>
          <span>{{dataSoure.compulsoryInsurancePremium|currency('￥','2')}}</span>
        </div>
        <div class="flex-center lh30" v-if="dataSoure.vehicleVesselTax">
          <span class="flex-1 cl-gray">车船税</span>
          <span>{{dataSoure.vehicleVesselTax|currency('￥','2')}}</span>
        </div>-->
      </div>
    </div>
    <div class="mt10 bg-white">
      <div class="plr10 lh50 flex-center van-hairline--bottom">
        <span class="flex-1 lh50 ft16">发票信息</span>
      </div>
      <div class="plr10 pt20 pb20">
        <template v-if="dataSoure.invoiceType">
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">公司抬头</span>
            <span>{{ dataSoure.invoiceTitle?dataSoure.invoiceTitle:'--' }}</span>
          </div>
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">公司税号</span>
            <span>{{ dataSoure.invoiceTaxNumber?dataSoure.invoiceTaxNumber:'--' }}</span>
          </div>
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">电话号码</span>
            <span>{{ dataSoure.invoicePhone?dataSoure.invoicePhone:'--' }}</span>
          </div>
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">单位地址</span>
            <span>{{ dataSoure.invoiceAddress?dataSoure.invoiceAddress:'--' }}</span>
          </div>
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">开户银行</span>
            <span>{{ dataSoure.openingBank?dataSoure.openingBank:'--' }}</span>
          </div>
          <div class="flex-center lh30">
            <span class="flex-1 cl-gray">银行账户</span>
            <span>{{ dataSoure.bankAccount?dataSoure.bankAccount:'--' }}</span>
          </div>
        </template>
        <template v-else>
          <div class="ft14 lh30">
            (普票)
          </div>
        </template>
      </div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h65 p10 plr5 w-100 zi10 van-hairline--top">
        <van-button
          type="primary"
          round
          plain
          class="flex-1 mlr5"
          @click="gopage('/order', { type: 1 })"
          text="订单管理"
        ></van-button>
        <van-button type="primary" round class="flex-1 mlr5" @click="next" text="添加配送方式"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from "@/api/orderService";
import releaseItemService from "@/api/releaseItemService.js";

export default {
  data() {
    return {
      second: 3,
      id: "",
      dataSoure: {},
      loading: false
    };
  },
  mounted() {
    setPageTitle("支付状态");
    this.getData();
    this.setHead();
    wv.customBackAction(function() {});
    wv.setWebViewInfo({
      wvBackDisable: 1
    });
  },
  beforeRouteLeave(to, from, next) {
    if(to.path === '/release_item/pay'){
      next({path:'/order',query:{type:2}})
    }else {
      next()
    }
  },
  methods: {
    //  联系客服
    call() {
      wv.callUp("0571-28208124");
    },
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
      this.gopage("/order/choose_address", {
        id: this.$route.query.quoteId,
        sourceType: 1
      });
    },
    async getData() {
      Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });

      let params = {
        orderId: this.$route.query.orderId
      };
      let data = await releaseItemService.payDetail(params);
      console.log(data);
      Toast.clear();

      if (data.code !== 1) {
        Toast(data.message);
      } else {
        this.dataSoure = data.object;
      }
    },
    setHead(isActive) {
      var self = this;
      this.$store.dispatch("setHead", {
        needBack: false
      });
    }
  }
};
</script>

<style lang="less" scoped>
.policy-list {
  .word {
    text-align: right;
    min-width: 56px;
    margin-right: 39px;
  }
}
</style>



