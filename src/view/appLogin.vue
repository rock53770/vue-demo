<template>
  <div class="app_login-box ft16">

    <div class="ta-c mlr15 cl-white" style="padding-top:135px;">
        <img src="~@/assets/images/logo2.png" width="80">
        <p style="margin-bottom:150px;">新欣保</p>
        <van-button type="primary" :block="true" style="background:#05C13F;height:44px;line-height:44px" class="bdr5" :disabled="loading || !checked" :loading="loading" @click="login">
          <span class="wx-icon">微信授权登录</span>
        </van-button>
        <div class="pt24 pb40" :class="{'cl-gray':!checked}" @click="goLogin">手机号登录></div>
        <div class="w-100 flex-center justify-c">
          <van-checkbox v-model="checked" shape="square" class="mr5">
            <i class="check-box-bz" slot="icon" slot-scope="obj" :class="{'active':obj.checked}"></i>
          </van-checkbox>
          <span @click="checked = !checked">我已阅读并同意</span>
          <span @click="goProtocal" style="text-decoration:underline">《新欣保用户协议》</span>
        </div>
    </div>
  </div>
</template>

<script>
import VerifyCode from "@/components/VerifyCode.vue";
import loginService from "@/api/loginService";
export default {
  name: "appLogin",
  data() {
    return {
      tel: "",
      checked: true,
      loading: false,
    };
  },
  created() {
    wv.customBackAction(function() {});
    wv.setWebViewInfo({
      wvBackDisable:1
    })
  },
  methods: {
    login() {
      wv.callNativeHandle("loginByVendor",{vendor:"wechat",secret:""},function(resText){
        Toast.loading({
            duration:0,
            forbidClick:false,
            message: '正在登录...'
        });
        var res1 = JSON.parse(resText)
        Util.setLocalData("wxuser", res1);
        loginService.appUserInfo(res1).then((res)=>{
            Toast.clear();
            if (res.code == 1) {//此微信账号已经绑定过手机号
                Toast("微信登录成功,正在跳转...")
                Util.setLocalData("AccessToken", res.object.token);
                Util.setLocalData("userInfo", res.object || {});
                btPage.open({
                  url: '/quote',
                  container_style:1,
                  leave_animate:2,
                  type:1
                })
            } else if(res.code == 3){//此微信账号未绑定过手机号
                btPage.open({
                  url: '/login',
                  container_style:1,
                  params:{
                    openId:res1.openid,
                  }
                })
            } else {
                btPage.open({
                  url: '/login',
                  container_style:1,
                  params:{
                    openId:res1.openid,
                  }
                })
                _hmt && _hmt.push(['_trackEvent', 'app_login','微信登录失败',JSON.stringify(res.object)])
            }
        })

      })
    },
    goProtocal(){
      btPage.open({
        url: '/common/agreement',
        container_style:1,
        params:{
          id:0
        }
      })
    },
    goLogin(url, id) {
      if(!this.checked){
        return
      }
      btPage.open({
        url: '/login',
        container_style:1,
        // jsOnResume: () => {
        //     Toast.clear();
        // }
      })
    }
  },
  mounted() {
    this.$store.dispatch("setHead", {
      showHeader:false,
    });
    // setPageTitle("登录");
  },
  components: {
    verifyCode: VerifyCode
  }
};
</script>
<style lang="less">

.login-checked{
  .van-checkbox__icon{
    line-height:12px;
  }
  .van-checkbox__icon .van-icon{
    width:12px;
    height:12px;
  }
}
</style>

