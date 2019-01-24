
<template>
    <div class="">
        <div class="ta-c pt20 ft12">
            {{loginTipText}}
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
        };
    },
    methods: {
        init(){

            if (GConfig.isTest) {
                this.loginTipText = "微信登录测试";
                Util.setSessionData("WXUA","11651615");
                //Util.setCookie('Authorization', data.object, 60 * 24 * 30);//我存上它一个月
                document.location.replace(Util.getSessionData("entryUrl") || '/')
            } else {
                this.loginTipText = '正在为您进行微信登录...';
                loginService.userInfo({
                    code: this.$route.query.code
                }).then((res)=>{
                    if (res.code == 1) {//此微信账号已经绑定过手机号
                        this.loginTipText = "微信登录成功,正在跳转...";
                        Util.setCookie("AccessToken",res.object.token || '');
                        Util.setCookie("userInfo",res.object||{});
                        Util.setCookie("openId",res.object.openID || '');
                        location.replace(Util.getSessionData("entryUrl") || '/quote?v=20181031')
                        // this.$router.replace({path:Util.getSessionData("entryUrl") || '/'})
                    } else if(res.code == 3){//此微信账号未绑定过手机号

                        if(res.object.openID){
                          Util.setCookie("openId",res.object.openID || '');
                          this.$router.replace({
                              path: '/login',
                              query: {
                                redirect: Util.getSessionData("entryUrl") || '/quote?v=20181031',
                              }
                          });
                        } else {
                          Toast.fail("openID为空");
                          _hmt && _hmt.push(['_trackEvent', 'wxLogin','openID为空',JSON.stringify(res.object)])
                        }

                    } else {
                        this.loginTipText = "微信登录失败，请稍后重试。";
                        Toast.fail(res.message);
                    }
                })
            }
        }
    },
    mounted() {
        setPageTitle("微信登录");
        console.log(1212)
        this.init();
    }
};
</script>




