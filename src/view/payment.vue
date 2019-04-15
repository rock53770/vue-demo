
<template>
  <div>
    <div class="bg-white pt12 pb12 mb15">
      <div class="lh22 ft16 cl-gray ta-c">支付金额</div>
      <div class="ft24 fw-b mt7 lh40 ta-c" style="min-height:40px">{{orderData.premium|currency('￥','2')}}</div>
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
          <div class="ta-c cl-orange" @click="afterPay(1)">已完成支付</div>
        </van-cell>
        <van-cell>
          <div class="ta-c" @click="show = false">支付遇到问题，重新支付</div>
        </van-cell>
      </van-dialog>
  </div>
</template>

<script>
import VerifyCode from "@/components/VerifyCode.vue";
import commonService from "@/api/commonService";
import lifeService from '@/api/lifeService';
import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';
export default {
  name: "payment",
  data() {
    return {
      show:false,
      payType: "1",
      id: "",
      loading: false,
      orderData:{},
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
    lifeService.getOrderDetail({
      id: this.id
    }).then((data) => {
      Toast.clear();
      if (data.code == 1) {
        this.orderData = data.object;
        if(this.orderData.handlerStatus != 500){
          Dialog.confirm({
            title: '此订单' + this.orderData.handlerStatusName,
            showCancelButton:false,
          }).then(() => {
            // this.afterPay(0)
            this.$router.go(-1);
          }).catch(() => {
            this.$router.go(-1);
          });
        }
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
          url: '/life/life_order_detail',
          container_style:1,
          type:1,
          params:{
            id:that.id,
            success:status
          }
        })
      } else {
        that.$router.replace({ path: '/life/life_order_detail', query: { id: that.id, success:status} });
      }
    },
    pay(){
      // if(!this.isWx){
      //   Toast("请在微信中打开此页面进行支付")
      //   return
      // }
      this.loading = true;
      commonService.payConfig({
        id:this.orderData.orderId,
        payType:this.payType,
        tradeType:this.tradeType,
        openId:Util.getCookie("openId") || ''
      }).then((res)=>{
        this.loading = false;
        if(res.code == 1){
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
      // 'getBrandWCPayRequest', {
      //         "appId":res.appId,     //公众号名称，由商户传入
      //         "timeStamp":res.timeStamp,         //时间戳，自1970年以来的秒数
      //         "nonceStr":res.nonceStr, //随机串
      //         "package":res.packagetemp,
      //         "signType":res.signType,         //微信签名方式：
      //         "paySign":res.paySign //微信签名
      //       },
      var that = this;
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
      var btWechat = new WechatRegistrar();
      btWechat.setConfig().then(()=>{
          Toast.clear();
          onBridgeReady()
      }).catch(()=>{
        Toast("微信签名失败，请刷新页面重试")
      });
      // if (typeof WeixinJSBridge == "undefined"){
      //   if( document.addEventListener ){
      //       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      //   }else if (document.attachEvent){
      //       document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      //       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      //   }
      // }else{
      //   onBridgeReady();
      // }
    },
  },
};
</script>
