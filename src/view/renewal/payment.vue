
<template>
  <div>
    <div class="bg-white pt12 pb12 mb15">
      <div class="lh22 ft16 cl-gray ta-c">支付金额</div>
      <div class="ft24 fw-b mt7 lh40 ta-c" style="min-height:40px">{{data.renewalPrice|currency('￥','2')}}</div>
    </div>
    <div class="mlr15">
      <span class="cl-gray ft13 lh18">选择支付方式</span>
      <van-radio-group v-model="payType" class="mt8 bdr5 bg-white plr15">
        <div class="h50 flex-center van-hairline--bottom" @click="payType = '1'">
          <img src="~@/assets/icons/wx@2x.png" class="w30 mr10">
          <div class="flex-1">微信</div>
          <van-radio name="1" />
        </div>
        <!-- <div class="h50 flex-center van-hairline--bottom" @click="payType = '2'">
          <img src="~@/assets/icons/alipay@2x.png" class="w30 mr10">
          <div class="flex-1">支付宝</div>
          <van-radio name="2" />
        </div> -->
      </van-radio-group>
    </div>
    <div class="h50">
      <div class="flex-center pos-f b0 bg-white h50 w-100 zi10">
        <van-button type="primary" :block="true" :disabled="loading" :loading="loading" @click="pay" text="支付订单"></van-button>
      </div>
    </div>
    <van-dialog
      v-model="show"
      :showConfirmButton = "false"
      class="ta-c"
    >
      <div class="pt20 pb20 lh30 van-hairline--bottom">请确认微信支付是否已完成</div>
      <van-cell>
        <div class="ta-c cl-primary" @click="afterPay(1)">已完成支付</div>
      </van-cell>
      <van-cell>
        <div class="ta-c" @click="show = false">支付遇到问题，重新支付</div>
      </van-cell>
    </van-dialog>
  </div>
</template>

<script>
import commonService from "@/api/commonService";
import renewalService from '@/api/renewalService';
import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';
export default {
  name: "renewalPayment",
  data() {
    return {
      show:false,
      payType: "1",
      id: "",
      loading: false,
      data:{},
      tradeType:'0',
      isWx:Util.userAgentType() == "wechat" && Util.isMobile(),
      isInApp:GConfig.isInApp
    };
  },
  created() {
    this.id = this.$route.query.id;

    if(this.isWx){
      this.tradeType = '0'
    } else {
      this.tradeType = '3'
    }
    if(this.$route.query.type == 'redirect'){
      this.show = true
    }
    Toast.loading({
      mask: false,
      message: '加载中...',
      duration:0
    });
    renewalService.getPolicyDetail({
      policyId: this.id,
    }).then((data) => {
      Toast.clear();
      if (data.code === 1) {
        this.data = data.object;
        // if(this.orderData.handlerStatus != 500){
        //   Dialog.confirm({
        //     title: '此订单' + this.orderData.handlerStatusName,
        //     showCancelButton:false,
        //   }).then(() => {
        //     // this.afterPay(0)
        //     this.$router.go(-1);
        //   }).catch(() => {
        //     this.$router.go(-1);
        //   });
        // }
      } else {
        Toast(data.message);
      }
    })
  },
  mounted(){
    setPageTitle('支付订单');
  },
  methods: {
    afterPay(status){
      var that = this;
      if(GConfig.isInApp){
        btPage.open({
          url: '/renewal/result',
          container_style:1,
          type:1,
          params:{
            type: 1
          }
        })
      } else {
        that.$router.replace({ path: '/renewal/result', query: { type: 1} });
      }
    },
    pay(){
      this.loading = true;
      commonService.payConfig({
        id: this.id,
        payType: this.payType,
        tradeType: this.tradeType
      }).then((res)=>{
        this.loading = false;
        if(res.code === 1){
          if(this.payType == "1"){
            if(this.tradeType == "0"){
              this.wxJSAPI(res.object)
            } else {
              this.wxMWEB(res.object)
            }
          } else if(this.payType == "2") {
            this.aliPay(res.object)
          }
        } else {
          Toast(res.message)
        }
      })
    },
    aliPay(res){

    },
    wxMWEB(res){
      let redirect_url = `${location.href}&type=redirect`

      location.href = res.mweb_url + '&redirect_url=' +encodeURIComponent(redirect_url)
    },
    wxJSAPI(res) {
      let that = this;
      function onBridgeReady(){
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', res,
          function(res){
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              Toast("支付成功")
              that.afterPay(1);
            } else {
              Toast("支付失败")
            }
          });
      }
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      let btWechat = new WechatRegistrar();
      btWechat.setConfig().then(()=>{
        Toast.clear();
        onBridgeReady()
      }).catch(()=>{
        Toast("微信签名失败，请刷新页面重试")
      });
    },
  },
};
</script>
