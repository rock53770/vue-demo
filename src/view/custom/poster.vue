<template>
  <div class="pl20 pr20 pt10 pos-r">
      <div class="pos-r" id="capture" style="min-height:200px">
        <div>
          <img :src="bgSrc" class="w-100 show">
        </div>
        <div class="pos-a b0 l0 flex-center w-100" style="height:67px;background:rgba(255,255,255,0.8)">
          <div class="mr8 ml15">
            <img src="~@/assets/images/logo.png" class="w40">
          </div>
          <div class="flex-1 h40">
            <p class="ft16 lh22">
              <b class="mr5" style="color:#000">星利保</b> <span style="color:#464646" v-text="userInfo.name || userInfo.nickName">张建国</span>
            </p>
            <p style="color:#666" class="lh20" v-text="userInfo.phone || ''"></p>
          </div>
          <div class="mr15">
            <!-- < src="~@/assets/images/logo.png" class="w50"> -->
            <div class="p3 bg-white">
              <div id="qrcode" class="w55" v-if="!qrSrc"></div>
              <img :src="qrSrc" class="w55 h55" style="object-fit:contain" v-else/>
            </div>
          </div>
        </div>
      </div>
      <div class="pt30 pb16">
        <van-button type="primary" class="" round :block="true" @click="download" text="下载"></van-button>
      </div>
      <div class="pos-a w-100 l0 t0 pl20 pr20 pt10" v-if="show">
        <img :src="src" class="w-100">
      </div>
      <div class="pos-a t0 r0 pt8" style="right:20px;top:10px">
        <van-uploader :after-read="onRead.bind(null,1)">
          <div class="lh30 plr12 cl-white ft13 mr8 fl" style="background:rgba(0,0,0,0.3);border-radius:15px">更换背景</div>
        </van-uploader>
        <van-uploader :after-read="onRead.bind(null,2)">
          <div class="lh30 plr12 cl-white ft13 mr8 fl" style="background:rgba(0,0,0,0.3);border-radius:15px">替换二维码</div>
        </van-uploader>
      </div>
  </div>
</template>
<script>
import quoteService from "@/api/quoteService";
import myService from "@/api/myService.js";
import QRCode from "qrcodejs2";
import '@/lib/canvas2image'
import '@/lib/html2canvas'

import bgSrc from '@/assets/images/bg_zhanye@3x.png'
export default {
  name: "poster",
  data() {
    return {
      loading: false,
      show: false,
      bgSrc:bgSrc,
      hasChangeQr:false,
      // bgSrc:'http://public.upload.acar168.cn:5516/PUBLIC/INSURANCE_PUBLIC/2019-04-29/39674c56-ec01-4310-b801-1de91c7f24e3.jpg',
      qrSrc:'',
      userInfo: {},
      src:''
    };
  },
  computed: {

  },
  created() {
  },
  mounted() {
    setPageTitle("展业海报");
    quoteService.bannerQuery()
    if(GConfig.isInApp){
      this.userInfo = Util.getLocalData("userInfo") || {};
    } else {
      this.userInfo = Util.getCookie("userInfo") || {};
    }

    var city = Util.getSessionData("locationInfo") || {
        data: { cityCode: "", provinceCode: "" }
    };
    const BASE_URL = window.location.host
    var $url = "http://" + BASE_URL + "/activity/page/xl_share/receive.html?city=" +(city.data.cityCode ? city.data.cityCode : "") +"&id=" + this.userInfo.uid;
    $url && new QRCode("qrcode", {
        text: $url,
        colorDark : "#333",
        colorLight : "#fff",
        correctLevel : QRCode.CorrectLevel.M,
        width: 55,
        height: 55,
    });
  },
  methods: {
    onRead(index,file){
      console.log(index)
      console.log(file)
      if(index == 1){
        this.bgSrc = file.content
      } else {
        this.qrSrc = file.content
      }
      this.generateImg()
      this.show = true;
    },
    download(){
      this.generateImg()
      this.show = true;
      Toast("请长按图片保存")
    },
    generateImg(v) {
      var that = this;
      var shareContent = document.getElementById("capture");
      var opts = {
          // width: width, //dom 原始宽度
          // height: height,
          useCORS: true // 【重要】开启跨域配置
      };

      html2canvas(shareContent, opts).then(function (canvas) {

          var context = canvas.getContext('2d');
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          // 【重要】默认转化的格式为png,也可设置为其他格式
          var img = Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height);
          that.src = img.getAttribute("src");

      });
    },
  },
  activated() {
  },
  components: {
  }
};
</script>
<style lang="less" scope>

</style>

