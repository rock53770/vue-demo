
<template>
    <div class="">
        <div class="ta-c pt20 ft12">
            {{loginTipText}}
        </div>
        <div class="lh40 ta-c mt40" v-if="loginFail" @click="retry">
          点击重试
        </div>
    </div>
</template>

<script>
import loginService from '@/api/loginService';
export default {
    name: 'wxLogin',
    data() {
        return {
            loginTipText: '',
            loginFail:false,
        };
    },
    methods: {
        retry(){
          location.replace(Util.getSessionData("entryUrl") || ('/quote?v='+new Data().getTime()))
        },
        init(){

            if (GConfig.isTest) {
                this.loginTipText = "微信登录测试";
                Util.setSessionData("WXUA","11651615");
                //Util.setCookie('Authorization', data.object, 60 * 24 * 30);//我存上它一个月
                document.location.replace(Util.getSessionData("entryUrl") || '/')
            } else {
                this.loginTipText = '正在为您进行微信登录...';
                loginService.userInfo({
                    code: this.$route.query.code,
                    state:this.$route.query.state,
                }).then((res)=>{
                    if (res.code == 1) {//此微信账号已经绑定过手机号
                        this.loginTipText = "微信登录成功,正在跳转...";
                        Util.setCookie("AccessToken",res.object.token || '');
                        Util.setCookie("userInfo",res.object||{});
                        Util.setCookie("openId",res.object.openID || '');
                        console.log(Util.getSessionData("entryUrl"))
                        // location.replace("http://insuranceapixxb.bz-ins.com/payment")
                        location.replace(Util.getSessionData("entryUrl") || ('/quote?v='+new Data().getTime()))
                        // this.$router.replace({path:Util.getSessionData("entryUrl") || '/'})
                    } else if(res.code == 3){//此微信账号未绑定过手机号

                        if(res.object.openID){
                          Util.setCookie("openId",res.object.openID || '');
                          this.$router.replace({
                              path: '/login',
                              query: {
                                redirect: Util.getSessionData("entryUrl") || ('/quote?v='+new Data().getTime()),
                              }
                          });
                        } else {
                          Toast.fail("openID为空");
                          _hmt && _hmt.push(['_trackEvent', 'wxLogin','openID为空',JSON.stringify(res.object)])
                        }

                    }  else if(res.code == 4){//静默授权

                        if(res.object.openID){
                          Util.setCookie("openId",res.object.openID || '');
                          location.replace(Util.getSessionData("entryUrl") || ('/quote?v='+new Data().getTime()))
                        } else {
                          Toast.fail("openID为空了");
                          _hmt && _hmt.push(['_trackEvent', 'wxLogin','openID为空了',JSON.stringify(res.object)])
                        }

                    } else {
                        this.loginTipText = "微信登录失败";
                        this.loginFail = true;
                        Toast.fail(res.message);

                    }
                })
            }
        }
    },
    mounted() {
        setPageTitle("新欣保微信登录");
        this.init();
    }
};
</script>




