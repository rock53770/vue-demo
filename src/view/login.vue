
<template>
  <div>
    <div class="ta-l pl15" v-if="isInApp && nickName">
      <h2 class="lh40 pt10" v-text="'亲爱的'+ nickName"></h2>
      <p class="cl-gray">首次登陆请绑定手机号</p>
    </div>
    <div class="ta-c pt27" v-else>
      <img class="" style="width:87px;" src="~@/assets/icons/logo.png" />
      <div class="lh20 cl-gray mt8">超值车险 专属定制</div>
    </div>
    <div class="pl30 pr30 pt30">
        <div class="flex-center van-hairline--bottom h42 plr15 mb16">
            <div class="pr10">
                <img style="width:13px;height:22px" src="~@/assets/icons/tel@2x.png"/>
            </div>
            <div class="flex-1">
                <van-field type="tel" v-model="tel" clearable placeholder="请输入手机号"/>
            </div>
        </div>
        <div class="flex-center van-hairline--bottom h42 plr15">
            <div class="pr10">
                <img style="width:16px;height:20px;" src="~@/assets/icons/code@2x.png"/>
            </div>
            <div class="flex-1">
                <van-field type="tel" v-model="code" clearable placeholder="请输入验证码"/>
            </div>
            <verify-code :tel="tel" v-on:unGetMsg="ungetmsg"></verify-code>
        </div>
        <div class="ft12 cl-orange ta-r mt10" v-show="unget" @click="soundVer">没收到短信？</div>
    </div>
    <div class="ml25 mr25 mt34">
        <van-button type="primary" round :block="true" :disabled="loading" :loading="loading" @click="login" text="提交"></van-button>
    </div>
    <div class="ta-c ft10 lh40" v-if="!isInApp">
      <span class="cl-orange" @click="goProtocal">注册成功表示您已同意本协议</span>
    </div>
  </div>
</template>

<script>
import VerifyCode from "@/components/VerifyCode.vue";
import loginService from "@/api/loginService";
export default {
  name: "login",
  data() {
    return {
      tel: "",
      refereeId: "",
      loading: false,
      code: "",
      unget: false,
      canget: true,
      nickName:"",
      isInApp:GConfig.isInApp
    };
  },
  created() {
    //      if(Util.userAgentType() == 'wechat'){
    //        var openId = Util.getCookie("openId")||'';
    //        if(!openId){
    //          location.href = '/quote'
    ////          this.$router.replace({name: 'quote'});
    //        }
    //      }
    if(GConfig.isInApp && Util.getLocalData("wxuser")){
      this.nickName = Util.getLocalData("wxuser").name;
    }
  },
  methods: {
    async login() {
      if (!this.tel || !this.code) {
        Toast("用户名或验证码不能为空！");
        return;
      }
      let params = {
        username: this.tel,
        code: this.code
      };
      if (this.$route.query) {
        params.refereeId = this.$route.query.refereeId || "";
        params.openId = this.$route.query.openId || "";
      }
      if (Util.userAgentType() == "wechat") {
        params.openId = Util.getCookie("openId") || "";
        if (!params.openId) {
          _hmt &&
            _hmt.push([
              "_trackEvent",
              "login",
              "params",
              JSON.stringify(params)
            ]);
        }
      }
      this.loading = true;

      let data;
      if(GConfig.isInApp){
        data = await loginService.appLogin(params);
      } else {
        data = await loginService.wapLogin(params);
      }

      console.log(data);
      this.loading = false;
      if (data.code !== 1) {
        Toast(data.message);
        return;
      } else {
        if (data.object.token == "") {
          console.log("哎，token为空啊");
          return;
        }
        if(GConfig.isInApp){
          Util.setLocalData("AccessToken", data.object.token);
          Util.setLocalData("userInfo", data.object || {});
          if (this.$route.query.redirect) {
            btPage.open({
              url: this.$route.query.redirect,
              container_style:1,
              leave_animate:2,
              type:3
            })
          } else {
            btPage.open({
              url: '/quote',
              container_style:1,
              leave_animate: 2,
              type:3
            })
          }
        } else {
          Util.setCookie("AccessToken", data.object.token);
          Util.setCookie("userInfo", data.object || {});
          if (this.$route.query.redirect) {
            location.replace(this.$route.query.redirect);
          } else {
            if (Util.getSessionData("entryUrl")) {
              this.$router.go(-1);
            } else {
              location.replace("/quote?v=20181031");
            }
          }
        }

        // if(this.$route.query.redirect){
        //     this.$router.replace({path:this.$route.query.redirect})
        // } else {
        //     this.$router.go(-1)
        // }
      }
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
    getVertify() {
        let self = this;
        Dialog.confirm({
          title: "获取语音验证码",
          message: "验证码将以电话的形式通知您，请注意接听",
          showCancelButton: false
        }).then(() => {
          console.log('close')
        });
    },
    soundVer() {
      if (this.canget) {
        let param = {
          phone: this.tel,
          type: 1
        };
        loginService.soundVertify(param).then(res => {
          if (res.code == 1) {
            this.getVertify();
          } else {
            Toast(res.message);
          }
        });
      }
    },
    ungetmsg(e) {
      this.unget = e;
      this.canget = e;
    }
  },
  mounted() {
    setPageTitle("登录");
    document.body.classList.add("bg-white");
    this.$store.dispatch("setHead", {
      menuContent:'',
      needBack:true,
    });
  },
  beforeDestroy: function() {
      document.body.classList.remove("bg-white");
  },
  components: {
    verifyCode: VerifyCode
  }
};
</script>
