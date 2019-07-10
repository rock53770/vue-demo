
<template>
  <div>
    <div class="status-box">
      <p class="statu-detail">
        <i class="statu-icon daizhifu"></i>出价单待支付
      </p>
      <div class="content handlerStatus-detail">
        <p class="label">支付金额</p>
        <p class="val">{{quote.totalAmount|currency('￥','2')}}</p>
      </div>
    </div>
    <!--<div class="bg-white pt12 pb12 mb15">-->
      <!--<div class="lh22 ft16 cl-gray ta-c">支付金额</div>-->
      <!--<div class="ft24 fw-b mt7 lh40 ta-c cl-orange" style="min-height:40px">{{quote.totalAmount|currency('￥','2')}}</div>-->
    <!--</div>-->
    <div class="bg-white">
      <div class="lh45 plr15 van-hairline--bottom">
        <span class="show-ib bg-primary bdr3 ver-align-mid" style="width:4px;height:14px;"></span>
        <span class="show-ib ft16 ver-align-mid">支付项目</span>
      </div>
      <div class="pl15 pb10 pt10">
        <p class="lh20">
          <span class="cl-gray show-ib w50 ta-r">佣金:</span>
          <span>{{quote.rebateAmount|currency('￥','2')}}</span>
        </p>
        <p class="lh20">
          <span class="cl-gray show-ib w50 ta-r">服务费:</span>
          <span>{{quote.serviceAmount|currency('￥','2')}}</span>
        </p>
        <p class="lh20 pt12">
          <span class="cl-gray ft13">如客户未支付保费，请及时联系客服，佣金和服务费将在1-3个工作日内退回</span>
        </p>
      </div>
    </div>
    <div class="bg-white mt10">
      <div class="lh45 plr15 van-hairline--bottom">
        <span class="show-ib bg-primary bdr3 ver-align-mid" style="width:4px;height:14px;"></span>
        <span class="show-ib ft16 ver-align-mid">选择支付渠道</span>
      </div>
      <!-- <span class="cl-gray ft13 lh18">选择支付方式</span> -->
      <van-radio-group v-model="payType" class="mt8 bdr5 bg-white plr15">
          <div class="h50 flex-center plr15 van-hairline--bottom" @click="payType = '1'">
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
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" round :block="true" :disabled="loading" :loading="loading" @click="pay" text="支付订单"></van-button>
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
import VerifyCode from "@/components/VerifyCode.vue";
import commonService from "@/api/commonService";
import receiptService from '@/api/receiptService';
import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';
export default {
  name: "payment",
  data() {
    return {
      show:false,
      payType: "1",
      id: "",
      orderId:'',
      quoteId:'',
      loading: false,
      orderData:{},
      quote:{},
      tradeType:'0',
      isWx:Util.userAgentType() == "wechat" && Util.isMobile(),
      isInApp:GConfig.isInApp
    };
  },
  created() {
    this.orderId = this.$route.query.oid;
    this.quoteId = this.$route.query.id;
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
    receiptService.getReceiptDetail({
      quoteId: this.quoteId
    }).then((data) => {
      Toast.clear();
      if (data.code == 1) {
        this.orderData = data.object;
        this.quote = data.object.quote;
        if(this.orderData.handlerStatus != 400){
          Dialog.confirm({
            title: '此订单' + this.orderData.handlerStatusContent,
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
    setPageTitle('支付佣金服务费');
  },
  methods: {
    afterPay(status){
      var that = this;
      if(GConfig.isInApp){
        btPage.open({
          url: '/receipt/receipt_detail',
          container_style:1,
          type:1,
          params:{
            id:that.quoteId,
            oid:that.orderId,
          }
        })
      } else {
        that.$router.replace({ path: '/receipt/receipt_detail', query: { id: that.quoteId, oid:that.orderId} });
      }
    },
    pay(){
      // if(!this.isWx){
      //   Toast("请在微信中打开此页面进行支付")
      //   return
      // }
      this.loading = true;
      commonService.payConfig({
        id:this.quoteId,
        payOrderType:1,
        payType:this.payType,
        tradeType:this.tradeType
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
      if(GConfig.isInApp){
        let ua = window.navigator.userAgent.toLowerCase();
        if (/iphone/gi.test(ua)) {
          btPage.open({
            url: res.mweb_url,
            jsOnResume:() => {
              this.show = true
            }
          })
        } else {
          location.href = res.mweb_url
        }
        return
      }
      let redirect_url = location.href
      if(location.href.indexOf('type=redirect') == -1){
        redirect_url = `${location.href}&type=redirect`
      }
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

<style scoped lang="less">
  @import "../../assets/less/global";
  .status-box {
    .wh(100%, 103px);
    background: url('../../assets/images/releaseItem/Group3@2x.png') no-repeat center center;
    background-size: 100% 100%;
    margin-bottom: 55px;
    position: relative;
    padding-top: 17px;

    .statu-detail {
      .font(18px, white, center, 25px, 500);
      display: flex;
      justify-content: center;
      align-items: center;

      .statu-icon {
        /*display: inline-block;*/
        .square(24px);
        /*vertical-align: bottom;*/
        margin-right: 10px;

        &.daizhifu {
          .bg-img-set('~@/assets/images/life/icon_daizhifu@2x.png', '~@/assets/images/life/icon_daizhifu@3x.png', 100%, 100%);
        }
      }
    }
    .content {
      //.wh(3.45rem, 80px);
      width: 3.45rem;
      background: white;
      border-radius: 5px;
      box-shadow:0 2px 6px 0 rgba(0,0,0,0.06);
      .position2(absolute, top, 57px, left, 50%);
      transform: translateX(-50%);
    }
    .handlerStatus-detail {
      /*height: 90px;*/
      padding: 12px 15px 10px;

      .label {
        .font(16px, #666, center, 22px);
        margin-bottom: 4px;
      }
      .val {
        .font(30px, #fc6b47, center, 33px);
        &:first-letter {
          font-size: 24px;
        }
      }
    }
  }
</style>
