<template>
    <div class="box">
        <div class="ft16">
            <div class="mt10 van-hairline-- h50 bg-white plr12 flex-center justify-sb">
                <strong>头像</strong>
                <div class="flex-1">
                    <upload v-if="showBind"  :pics="photo" :max="1" v-on:upload-success="changePhoto" class="w-100 h-100 ta-r flex-center">
                        <img :src="userInfo.avatar" width="30" height="30" class="bdr-50" v-if="!photo.length">
                        <img :src="photo[0].content" width="30" height="30" class="bdr-50" v-else>
                        <van-icon name="arrow" color="#97999b" class="ml6" style="transform: translateY(-6px);"/>
                    </upload>
                    <div class="w-100 h-100 ta-r" v-else>
                      <img :src="userInfo.avatar"  class="w30 h30 show-ib bdr-50">
                    </div>
                </div>
            </div>

            <div v-if="showBind" class="van-hairline--top h50 bg-white plr12 flex-center justify-sb" @click="goPage('/my/change_nick_name')">
                <strong>昵称</strong>
                <div class="flex-center">
                    <p class="cl-dgray">{{ userInfo.nickName }}</p>
                    <van-icon name="arrow" color="#97999b" class="ml6"/>
                </div>
            </div>
            <div class="van-hairline--top h50 bg-white plr12 flex-center justify-sb" v-if="!showBind">
                <strong>昵称</strong>
                <div class="flex-center">
                    <p class="cl-dgray">{{ userInfo.nickName }}</p>
                </div>
            </div>

            <div class="van-hairline--top mt10 h50 bg-white plr12 flex-center justify-sb" @click="goPage('/my/recomposephone')">
                <strong>手机号</strong>
                <div class="flex-center">
                    <p class="cl-gray">{{ userInfo.phone }}</p>
                    <van-icon name="arrow" color="#97999b" class="ml6"/>
                </div>
            </div>
            <div class="van-hairline--top van-hairline--bottom h50 bg-white plr12 flex-center justify-sb" @click="unbind" v-if="showBind">
                <strong>微信号</strong>
                <div class="flex-center">
                <p class="cl-gray">{{ userInfo.isBindWechat ? '已绑定':'未绑定'}}</p>
                <van-icon name="arrow" color="#97999b" class="ml6"/>
                </div>
            </div>
        </div>

        <div class="h40 mb20 mt10">
            <div class="flex-center pos-f b0 h40 w-100 mb20 mt10 zi10">
                <van-button
                type="primary"
                class="flex-1 mlr15"
                round
                :loading="loading"
                :block="true"
                @click="quit"
                text="退出当前账号"
                ></van-button>
            </div>
        </div>
    </div>
</template>

<script>
import myService from "@/api/myService";
import loginService from "@/api/loginService";
import { Toast } from 'vant';
import upload from "@/components/Upload"

export default {
    name: "setting",
    data() {
        return {
            licenseNo: "",
            name: "",
            userInfo: {},
            photo: [],
            loading: false,
            showBind: true
        };
    },
    created() {
        this.getData()
    },
    mounted() {
        setPageTitle("资料管理");
        this.showBind = GConfig.isInApp
    },
    components: {
        upload
    },
    methods: {
        quit() {
            Toast.loading({
                duration: 0,
                forbidClick: true,
                message: "请稍后..."
            });
            this.loading = true
            loginService.loginOut().then(res => {
              Toast.clear();
              if(res.code !== 1) {
                Toast(res.message);
              } else {
                if(GConfig.isInApp){
                  Util.removeLocalData("AccessToken");
                  Util.removeLocalData("userInfo");
                  Util.removeLocalData("wxuser");
                  btPage.open({
                    url: '/app_login',
                    container_style:1,
                    type:3,
                    enter_animate:2,
                  })
                } else {
                  Util.removeCookie("AccessToken");
                  Util.removeCookie("userInfo");
                  setTimeout(function(){
                    location.href = '/quote';
                  },0)
                }
              }
            })
        },
        getData() {
            myService.userAgent()
                .then((res) => {
                    if (res.code == 1) {
                        this.userInfo = res.object.userAgentInfoVo
                    } else {
                        Toast(res.message)
                    }
                })
        },
        // 解除微信绑定 or 绑定
        unbind() {
            if (this.userInfo.isBindWechat) {
                Dialog.confirm({
                    message: '确定要解除账号与微信的关联吗？',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: '解除绑定',
                    showCancelButto: '取消'
                }).then(() => {
                    this.unbindWechat()
                    this.loading = true
                }).catch(() => {
                    // on cancel
                });
            } else {
                this.bindWechat()
            }
        },
        // 解除微信绑定请求
        unbindWechat() {
            myService.unbindWechat()
                .then((res) => {
                    this.loading = false
                    if (res.code == 1) {
                        this.getData()
                    } else {
                        Toast(res.message)
                    }
                })
        },
        // 绑定微信
        bindWechat() {
            let self = this
            wv.callNativeHandle("loginByVendor",{vendor:"wechat",secret:""},function(resText){
                Toast.loading({
                    duration:0,
                    forbidClick:false,
                    message: '正在登录...'
                });
                var res1 = JSON.parse(resText)

                let param = {
                    openid: res1.openid,
                    accessToken: res1.accessToken
                }
                myService.bindWechat(param)
                    .then((res) => {
                        if (res.code == 1) {
                            Toast.clear()
                            self.getData()
                        } else {
                            Toast.clear()
                            Toast(res.message)
                        }
                })

            })
        },
        // 修改头像
        changePhoto() {
            let file = this.photo[0]
            if (file.status == 2)  {
                myService.changePhoto({ fileUrl: file.result.viewPath })
                    .then((res) => {
                        if (res.code == 1) {
                            Toast.success('修改成功')
                            setTimeout(() => {
                                this.getData()
                            })
                        } else {
                            Toast(res.message)
                        }
                    })
            }
        },
        goPage(url) {
            btPage.open({
                url: url,
                container_style:1,
                enter_animate:2,
                jsOnResume: () => {
                    if (GConfig.isInApp) {
                        this.getData()
                    }
                }
          })
        }
    }
};
</script>
