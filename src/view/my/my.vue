
<template>

    <div class="my-box pos-r">
      <!-- <div style="height:44px"></div> -->
        <div class="" v-if="unApply && loaded" style="height:32px;">
          <div class="pos-f w-100 cl-orange plr10 flex-center zi10"
          style="background-color:#FDE7D8;height:32px;" :style="{ top: navHeight + 'px' }">
            <div class="flex-1">
              <div class="volumn pl22">完成登记备案，获得保险展业资格</div>
            </div>
            <div class="icon-right-blue cl-blue" style="" @click="goAgent">去认证</div>
          </div>
        </div>
        
        <div class="plr15 pt25 pb15 banner-bg cl-white pos-r">
            <div class="flex-center mb35">
                <div class="mr20 portrait"><img :src="agent.avatar" class="wh-100" v-if="agent.avatar"></div>
                <div class="flex-1">
                    <div class="flex-center">
                        <span class="ft16 lh22 mr15">{{ agent.nickName }}</span>
                        <div v-if="agent.avatar" class="flex-center">
                            <img src="../../assets/icons/team/icon_tel@3x.png" class="mr5" style="height: 12px; width: 8px">
                            <span>{{ agent.phone }}</span>
                        </div>
                    </div>
                    <div>
                        <img v-if="agent && agent.trueName" class="mt14" src="~@/assets/icons/real-name.png" style="height:18px" alt="已实名">
                        <img v-if="agent && agent.auditStatus == 3" src="~@/assets/icons/auth.png" class="ml2 mt14" style="height:18px" alt="已认证">
                    </div>
                </div>
            </div>

            <div class="flex-center pos-a numbers bg-white pt12 pb12 bdr8">
                <div class="w-33 ta-c" @click="goPage('/my/wallet')">
                    <strong class="cl-blue fw-b ft16">{{ agent.balance | currency2 }}</strong>
                    <p class="mt8 cl-gray">可提余额(元)</p>
                </div>
                <div class="w-33 ta-c" @click="goPage('/achieve/balanceDetail')">
                    <strong class="cl-red fw-b ft16">{{ agent.generalIncome | currency2 }}</strong>
                    <p class="mt8 cl-gray">总收入(元)</p>
                </div>
                <div class="w-33 ta-c" @click="goPage('/my/history')">
                    <strong class="cl-yellow fw-b ft16">{{ agent.inviteCount ? agent.inviteCount : 0 }}</strong>
                    <p class="mt8 cl-gray">总邀请(个)</p>
                </div>
            </div>
        </div>
        <div class="ft16">
            <div class="bg-white plr10 mb10" v-if="agent">
                <div class="flex-center lh50" @click="goAgent">
                    <img src="~@/assets/icons/agent.png" width="24" class="mr5">
                    <span class="flex-1">展业资质认证</span>
                    <span class="icon-right cl-gray ft14" v-text="auditText[agent.auditStatus]"></span>
                </div>
            </div>

            <div class="bg-white plr10 mb10">
                <!-- <div class="flex-center lh50 van-hairline--bottom" @click="goPage('card')">
                    <img src="~@/assets/icons/bankcard.png" width="16" class="mr5">
                    <span class="flex-1">银行卡</span>
                    <span class="icon-right"></span>
                </div>
                <div class="flex-center lh50 van-hairline--bottom" @click="goPage('address')">
                    <img src="~@/assets/icons/address.png" width="16" class="mr5">
                    <span class="flex-1">常用地址管理</span>
                    <span class="icon-right"></span>
                </div>-->
                <!-- <div class="flex-center lh50 van-hairline--bottom" @click="goPage('/my/wallet')">
                    <img src="~@/assets/icons/wallet.png" class="mr5" style="width:24px;">
                    <span class="flex-1">我的钱包</span>
                    <span class="icon-right"></span>
                </div> -->
                <div class="flex-center lh50 van-hairline--bottom" @click="share">
                    <img src="~@/assets/icons/invitation.png" width="24" class="mr5">
                    <span class="flex-1">邀请好友</span>
                    <span class="icon-right"></span>
                </div>
                <div class="flex-center lh50 van-hairline--bottom" @click="goTeam" v-if="isInApp">
                    <img src="~@/assets/icons/teamicon.png" width="19" height="20" class="mr5">
                    <div class="flex-1 flex-center justify-sb">
                        <span class="ta-l">我的团队</span>    
                        <span class="cl-gray ft14">开启团队，享团队分红</span>
                    </div>
                    <span class="icon-right"></span>
                </div>
                <div class="flex-center pt10 pb10 van-hairline--bottom" @click="goPage('/my/setting')">
                    <img src="~@/assets/icons/setting@2x.png" width="24" class="mr5">
                    <span class="flex-1">账号资料</span>
                    <span class="icon-right"></span>
                </div>
                <div class="flex-center pt10 pb10 van-hairline--bottom" @click="goPage('/my/contact')">
                    <img src="~@/assets/icons/customer-service.png" width="24" class="mr5">
                    <span class="flex-1">联系客服</span>
                    <span class="icon-right"></span>
                </div>
                <!-- <a class="flex-center lh50" href="tel:4006038787">
                    <img src="~@/assets/icons/customer-service.png" width="24" class="mr5">
                    <span class="flex-1">联系客服</span>
                    <span class="cl-gray ft14">400-603-8787</span>
                </a> -->
            </div>

            <div class="bg-white plr10 mb10">
                <div class="flex-center lh50" @click="goPage('/my/about')">
                    <img src="~@/assets/icons/about.png" width="24" class="mr5">
                    <span class="flex-1">关于我们</span>
                    <span class="icon-right"></span>
                </div>
            </div>
        </div>

        <footerBar path="my"></footerBar>
    </div>
</template>

<script>
import footerBar from "@/components/Footer";
import myService from "@/api/myService";
export default {
    name: "my",
    data() {
        return {
        count:1,
        navHeight: Util.getNavHeight(),
        licenseNo: "",
        auditText: {
            0: "审核中",
            1: "审核中",
            2: "审核未通过",
            3: "审核通过",
            4: "审核未通过"
        },
        agent: {},
        isInApp: GConfig.isInApp,
        unApply: true,
        loaded: false,
        userInfo: {},
        hadTeam: null
        };
    },
    created() {
        if(GConfig.isInApp){
          this.userInfo = Util.getLocalData("userInfo") || {};
        } else {
          this.userInfo = Util.getCookie("userInfo") || {};
        }
        this.getUserAgent()
    },
    methods: {
        /**
         * 获取用户信息
         */
        getUserAgent() {
            myService.userAgent()
                .then(res => {
                    this.loaded = true;
                    if (res.code == 1 && res.object && res.object.userAgentInfoVo) {
                        this.agent = res.object.userAgentInfoVo;
                        let result = res.object.userAgentInfoVo
                        let QR = {
                            code: res.object.userAgentInfoVo.serviceQrcode,
                            name: result.trueName ? result.name ? result.name : result.nickName : result.nickName ? result.nickName : ""
                        };
                        localStorage.setItem("Qrcode", JSON.stringify(QR));
                        this.unApply = false;
                    
                        if ("-1" == res.object.userAgentInfoVo.auditStatus) {
                            this.unApply = true;
                        }
                    } else if (res.code === 0) {
                        this.agent = {};
                        this.unApply = true;
                    }
                });
        },
        goAgent() {
            if (this.unApply) {
                this.goPage('/my/agent', { noApply: 1 })
            } else {
                this.goPage('/my/agent-desc')
            }
        },
        share() {
        // this.$router.push({ name: "share",query:{id:this.userInfo.uid} });
            this.goPage('/share', { id: this.userInfo.uid })
        },
        goPage(path, query) {
        // this.$router.push({ path: path, query: query });
            btPage.open({
                url: path,
                params: query,
                container_style: 1,
                jsOnResume: () => {
                    if (GConfig.isInApp) {
                        this.getUserAgent()
                    }
                }
            });
        },
        goTeam() {
            if (this.agent.hadTeam) {
                this.goPage('/team', { type: 1 })
            } else {
                this.goPage('/team/team_lead')
            }
        }
    },
    mounted() {
        setPageTitle("个人中心");
        wv.customBackAction(()=> {
          if(this.count == 2){
            btPage.goBack(100);
          } else {
            Toast("再按返回退出")
            this.count++;
            setTimeout(()=>{
              this.count = 1;
            },2000)
          }
        });
        wv.setWebViewInfo({
          wvBackDisable:1
        })
    },
    components: {
        footerBar
    }
};
</script>

<style lang="less">
.my-box {
  .portrait {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
    background: url("../../assets/icons/user-name@3x.png") no-repeat;
    background-size: 60px 60px;
  }
  .banner-bg {
    background: url(../../assets/icons/team/bg_Personal@3x.png) transparent;
    background-size: 100% 147px;       
    background-repeat: no-repeat;
    margin-bottom: 45px;
  }
  .numbers {
      bottom: -35px;
      left: 15px;
      right: 15px;
  }
}
</style>
