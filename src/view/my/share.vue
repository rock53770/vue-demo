<template>
    <div class="pos-a l0 r0 b0 share" :style="{ top: navHeight + 'px' }">
        <div class="pos-a l0 r0 b0" :style="{ top: '2rem' }">
            <div class="mt10 qrbox cl-white ft12 ta-c">
                <div class="ft16 mb15" v-show="userAgentInfoVo.name">{{ userAgentInfoVo.name }}的专属二维码</div>
                <div class="show-ib p10 bg-white">
                <div id="qrcode"></div>
                </div>
            </div>
            <div class="ta-c plr15 ft16">
                <div class="shareBtn cl-white" @click="showSharePop" v-show="shareShow">邀请好友</div>
                <div
                class="mt10 history cl-white"
                style="text-decoration:underline;"
                @click="goHistory"
                >我的历史推荐</div>
            </div>
        </div>
        <div class="pos-a b20 l0 r0 ta-c">
            <img src="../../assets/images/logots.png" style="width: 92px;height: 29px;">
        </div>
        <van-popup v-model="sharePop" position="bottom" :overlay="true">
            <mobileShare :config="config" v-on:CLOSE_SHARE="closeShare"></mobileShare>
        </van-popup>
    </div>
</template>
<script>
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import myService from "@/api/myService";
import activityService from "@/api/activityService";
import QRCode from "qrcodejs2";

import mobileShare from '@/components/mobileShare/index'

export default {
    name: "share",
    data() {
        return {
            qr: "",
            isSelf: false,
            userAgentInfoVo: {},
            shareShow: true,
            navHeight: Util.getNavHeight(),
            $url: "",
            config: {
                sharePhotos: "http://cdnpubimg.bz-ins.com/PUBLIC/INSURANCE_PUBLIC/2018-11-15/7fc3fe06-21a7-45e5-b573-069768c9d548-YT.png",
                shareTitle: "新欣保向您发来邀请",
                shareDesc: "极速报价，便捷出单，专属客服，百万代理人放心之选",
                shareUrl: ""
            },
            sharePop: false,
        };
    },
    methods: {
        wxconfig() {
            var id = this.$route.query.id;
            var city = JSON.parse(sessionStorage.getItem("locationInfo")) || {
                data: { cityCode: "", provinceCode: "" }
            };
            // const BASE_URL = "https://insuranceapixxb.bz-ins.com" // 生产
			const BASE_URL = "http://wxtest.bz-ins.com"  // 测试
            var $url = BASE_URL + "/activity/page/share/receive.html?city=" +(city.data.cityCode ? city.data.cityCode : "") +"&id=" +id;
            
            
            this.$url = $url;
            this.config.shareUrl = $url
            var ua;
            if (typeof window !== "undefined") {
                ua =
                ("navigator" in window &&
                    "userAgent" in navigator &&
                    navigator.userAgent.toLowerCase()) ||
                "";
            }

            if (document.getElementById('qrcode').childNodes.length == 0) {
                this.qrconfig($url);
            }

            if (ua.indexOf("micromessenger") !== -1) {
                this.shareShow = false;
                var btWechat = new WechatRegistrar();

                btWechat
                .setConfig()
                .then(function() {
                    wxShare({
                    title: `新欣保向您发来邀请`,
                    desc: `极速报价，便捷出单，专属客服，百万代理人放心之选`,
                    link: $url
                    });
                })
                .catch(rej => {
                    btWechat.setConfig().then(function() {
                    wxShare({
                        title: `新欣保向您发来邀请`,
                        desc: `极速报价，便捷出单，专属客服，百万代理人放心之选`,
                        link: $url
                    });
                    });
                });
            } else if (GConfig.isInApp) {
                this.shareShow = true;
            } else {
                this.shareShow = false;
            }
        },
        qrconfig(url) {
            new QRCode("qrcode", {
                text: url,
                height: 150,
                width: 150
            });
        },
        goHistory() {
            btPage.open({
                url: "/my/history",
                container_style: 1,
                jsOnResume: () => {
                    if (GConfig.isInApp) {
                        this.wxconfig()
                    }
                }
            });
        },
        showSharePop() {
            this.sharePop = true
        },
        closeShare(data) {
            this.sharePop = data
        }
    },
    created() {
        if (!Util.getCookie("AccessToken") || !Util.getCookie("userInfo")) {
        //之前是sessionStroage保存userInfo，历史遗留问题
        } else {
            if (Util.getCookie("userInfo").uid == this.$route.query.id) {
                this.isSelf = true;
            }
            myService.userAgent().then(res => {
                // this.loaded = true;
                if (res.object && res.object.userAgentInfoVo) {
                if (res.object.userAgentInfoVo) {
                    this.userAgentInfoVo = res.object.userAgentInfoVo;
                }
                }
            });
        }
    },
    components: {
        mobileShare
    },
    mounted() {
        setPageTitle("我的邀请");
        this.wxconfig();
    }
};
</script>
<style lang="less" scoped>
.share {
    background: url("http://pubimg.bz-ins.com/PUBLIC/h5/static/miniprogram/images/bg.jpg")
        #fd3142 no-repeat;
    background-size: contain;
    background-position: top center;
    .b20 {
        bottom: 20px;
    }
    .box {
        left: 0;
        right: 0;
        bottom: 90px;
    }

    .qrbox {
        margin-bottom: 25px;
    }

    .shareBtn {
        width: 100%;
        height: 45px;
        line-height: 45px;
        border-radius: 25px;
        margin-bottom: 18px;
        cursor: pointer;
        font-size: 16px;
        background-color: #ffaa00;
    }
}
</style>

