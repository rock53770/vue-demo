<template>
  <div class="box">
    <template v-if="!isLoading">
      <van-notice-bar text="*请确认保单生效日期，如因投保日期产生的纠纷由本人负责" color="#FC6B47" background="#FDE7D8"/>
      <div class="bg-white ft14 plr12 pt15 pb15 mb10">
        <div class="flex-center lh25" v-if="data.compulsoryInsuranceDate">
          <span class="flex-1 cl-gray">交强险生效日期</span>
          <span>{{data.compulsoryInsuranceDate|dataFormat('yyyy-MM-dd hh: mm: ss')}}</span>
        </div>
        <div class="flex-center lh25" v-if="data.commercialInsuranceDate">
          <span class="flex-1 cl-gray">商业险生效日期</span>
          <span>{{data.commercialInsuranceDate|dataFormat('yyyy-MM-dd hh: mm: ss')}}</span>
        </div>
      </div>
      <div class="bg-white ft14 plr12 pt15 pb15">
        <div class="flex-center lh25">
          <span class="flex-1 cl-gray">车主姓名</span>
          <span v-text="data.ownerName"></span>
        </div>
        <div class="flex-center lh25">
          <span class="flex-1 cl-gray">车牌号</span>
          <span v-text="data.plate"></span>
        </div>
        <div class="flex-center lh25" v-if="data.commercialInsurancePremium">
          <span class="flex-1 cl-gray">商业险</span>
          <span>{{data.commercialInsurancePremium|currency('￥','2')}}</span>
        </div>
        <div class="flex-center lh25" v-if="data.compulsoryInsurancePremium">
          <span class="flex-1 cl-gray">交强险</span>
          <span>{{data.compulsoryInsurancePremium|currency('￥','2')}}</span>
        </div>
        <div class="flex-center lh25" v-if="data.vehicleVesselTax">
          <span class="flex-1 cl-gray">车船税</span>
          <span>{{data.vehicleVesselTax|currency('￥','2')}}</span>
        </div>
        <div class="ta-r van-hairline--top mt10 plr12 pt15">
          <b class="cl-orange lh25 ft18">保费总计{{data.totalInsurancePremium|currency('￥','2')}}</b>
        </div>
      </div>
      <div class="ml10 ft16 lh30">
        <p class="cl-gray ft14">请选择付款方式：</p>
      </div>
      <div>
        <van-radio-group v-model="type">
          <ul>
            <li
              class="flex-center plr10 bg-white mb5"
              style="min-height:60px;"
              @click="choose(i.status)"
              v-for="(i,index) in data.payIntroduceBos"
              :key="index"
            >
              <img v-if="i.status==1" src="../../assets/icons/alipay@2x.png" class="w30 mr10">
              <img v-if="i.status==2" src="../../assets/icons/play-money@2x.png" class="w30 mr10">
              <img v-if="i.status==3" src="../../assets/icons/qr-pay.png" class="w30 mr10">
              <div class="flex-1">
                <p class="pt10 pb10 ft14">
                  <span v-if="i.status==1">支付宝支付</span>
                  <span v-if="i.status==2">银行卡支付</span>
                  <span v-if="i.status==3">扫码支付</span>
                  <span class="cl-orange" v-if="i.status==3 && i.status==2 ">( 支付码获取中 )</span>
                </p>
                <p
                  class="pb10 cl-gray ft12"
                  v-if="i.status==3"
                  v-text="i.status==3?'( 扫码保险公司收款码完成支付 )':'( 单笔限额5千，每日限额5千 )'"
                ></p>
              </div>
              <div class="mr10">
                <van-radio :name="i.status"/>
              </div>
            </li>
          </ul>
        </van-radio-group>
      </div>

      <div class="h40">
        <div class="ta-c lh40 ft14 cl-gray mt10 w-100" style="bottom:70px">
          <span>
            如有疑问请联系客服：
            <a href="tel:4006038787" class="cl-orange">400-603-8787</a>
          </span>
        </div>
      </div>
      <div class="h70">
        <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
          <van-button type="primary" round :block="true" @click="gopay" text="去支付"></van-button>
        </div>
      </div>
    </template>
    <template v-if="isLoading">
      <div class="Gspinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>

<script>
import orderService from "@/api/orderService";
import quoteService from "@/api/quoteService";
import { setTimeout } from "timers";
export default {
  name: "payMethod",
  data() {
    return {
      id: "",
      isShow: false,
      type: 3,
      data: {},
      isLoading: true,
      isGoUnderwrite: false
    };
  },
  computed: {
    payMethodInfo() {
      if (this.type !== "") {
        return this.data.payIntroduceBos[this.type - 1];
      }
    }
  },
  created() {
    this.getDetail();
    if (GConfig.isInApp) {
      this.setHead();
    }
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
    getDetail() {
      this.id = this.$route.query.id;
      this.isLoading = true;
      orderService
        .paycheck({
          id: this.id
        })
        .then(res => {
          if (res.code == 1) {
            this.isLoading = false;
            this.data = res.object;
          } else if (res.code == 2) {
            Dialog.confirm({
              message: "该报价已失效, 请重新核保",
              confirmButtonText: "重新核保"
            })
              .then(() => {
                //确认
                this.underWrite();
              })
              .catch(() => {
                //取消
              });
          } else {
            Toast(res.message);
            setTimeout(() => {
              // this.$router.push({path: '/order', query: { type: 0 }})
              this.gopage("/order", { type: 0 });
            }, 3000);
          }
        });
    },
    // 提交核保
    underWrite() {
      this.isGoUnderwrite = true;
      Toast.loading({
        mask: true,
        message: "提交核保中..."
      });
      orderService
        .postUnderwrit({ id: this.$route.query.id })
        .then(res => {
          this.isGoUnderwrite = false;
          if (res.code == 1) {
            // this.$router.push({ path: '/order/order_detail', query: { id: this.$route.query.id} });
            this.gopage("/order/order_detail", { id: this.$route.query.id });
            Toast.clear();
          } else {
            Toast(res.message);
          }
        })
        .catch(rej => {
          console.log(rej.data);
        });
    },
    onCopy(e) {
      Toast("已复制");
    },
    gopay(type) {
      if (!this.type) {
        Toast("请先选择支付方式");
        return;
      }
      btPage.open({
        url: "/order/pay",
        container_style: 1,
        params: { type: this.type, id: this.id },
        jsOnResume: () => {
          if(GConfig.isInApp){
            this.getDetail();
          }
        }
      });
      // this.$router.push({name:"pay",query:{ type:this.type, id: this.id}})
    },
    choose(type) {
      this.type = type;
    },
    setHead(isActive) {
      var self = this;
      this.$store.dispatch("setHead", {
        menuContent: `<div class="menu"></div>`,
        needBack: true,
        back: () => {
          btPage.open({
            url: "/order",
            params: { type: 1 },
            container_style: 1,
            type: 3
          });
        }
      });
    }
  },
  mounted() {
    setPageTitle("支付订单");
    wv.customBackAction(function() {
      btPage.open({
        url: "/order",
        params: { type: 1 },
        container_style: 1,
        type: 3
      });
    });
      wv.setWebViewInfo({
        wvBackDisable:1
      })
  }
};
</script>
