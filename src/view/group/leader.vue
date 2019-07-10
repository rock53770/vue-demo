<template>
  <div class="group-get-leader-wrapper">
    <header class="header">
      <div class="form-box">
        <h3>资料填写</h3>
        <div class="form-item">
          <span>姓名：</span>
          <div class="item-right">
            <input type="text" v-model="submitData.name" placeholder="请输入姓名">
          </div>
        </div>
        <div class="form-item">
          <span>身份证号：</span>
          <div class="item-right">
            <input type="text" v-model="submitData.licenseNo" placeholder="请输入身份证号">
          </div>
        </div>
        <div class="form-item">
          <span>社保情况：</span>
          <div class="item-right ss-item">
            <span :class="{'curr': submitData.socialInsurance === 1}"
                  @click="submitData.socialInsurance = 1">有社保</span>
            <span :class="{'curr': submitData.socialInsurance === 0}"
                  @click="submitData.socialInsurance = 0">无社保</span>
          </div>
        </div>
        <div class="form-item">
          <span>手机号：</span>
          <div class="item-right v-code-item">
            <input type="tel" v-model="submitData.phone" placeholder="请输入手机号">
            <span class="v-code" @click="getVerCode">{{ vercodeValue }}</span>
          </div>
        </div>
        <div class="form-item">
          <span>验证码：</span>
          <div class="item-right">
            <input type="text" v-model="submitData.code" maxlength="6" placeholder="请输入验证码">
          </div>
        </div>
        <div class="agreements-item">
          <span class="check-box" @click="isReadAgreements = !isReadAgreements">
            <van-icon v-show="isReadAgreements" name="success" color="#fd9239" size="12px"/>
          </span>
          <p class="agreement-desc">
            我已认真阅读并知晓<span class="agreement" v-for="(sItem, sIndex) in submitAgreements" :key="sIndex" @click="goToProtocol(sItem.url)">《{{ sItem.name }}》</span><span class="agreement" @click="goToRule">《活动规则》</span>
          </p>
        </div>
        <button class="btn-submit" @click="submit">领取保障</button>
      </div>
    </header>
    <section class="gift-detail">
      <h2>保障详情</h2>
      <div class="gift-item gift1">
        <h3 class="title">安心1号·百万医疗</h3>
        <p class="val-detail val-detail-title">
          <span class="desc">保障计划</span>
          <span @click="goToProtocol('https://m.95303.com/health/desc/plandetail/ysb_dianshang/11')" class="value">查看详情</span>
        </p>
        <p class="val-detail" v-for="(dItem, dIndex) in gift1Detail" :key="dIndex">
          <span class="desc">{{ dItem.desc }}</span>
          <span class="value">{{ dItem.value }}</span>
        </p>
        <p class="note">
          *<span v-for="(gItem, gIndex) in giftAgreements" :key="gIndex" @click="goToProtocol(gItem.url)">《{{ gItem.name }}》</span>
        </p>
      </div>
    </section>
    <footer>
      <p>
        本次活动产品均为对应保险公司提供，<br>
        活动咨询：18667908773（微信同号）
      </p>
    </footer>
  </div>
</template>

<script>
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import loginService from '../../api/loginService';
// import sharePic from '../../assets/images/gift/share.png';
import groupService from '@/api/groupService';
export default {
  name: 'anxinInsurance',
  components: {},
  props: {},
  data() {
    return {
      isLogined: false,
      submitData: {
        name: null,
        licenseNo: null,
        socialInsurance: 1,
        phone: null,
        code: null
      },
      isReadAgreements: true,
      vercodeValue: '获取验证码',
      canClick: true,
      intervalFlag: null,
      submitAgreements: [
        { name: '安心保险用户服务协议', url: 'https://static.95303.com/static/html/service.html'},
        { name: '隐私声明', url: 'https://static.95303.com/static/html/privacy.html'}
      ],
      gift1Detail: [
        { desc: '一般医疗保险金', value: '300万' },
        { desc: '恶性肿瘤医疗保险金', value: '300万' },
        { desc: '院外靶向药报销', value: '30万' },
        { desc: '异地转诊交通费', value: '5000元' },
      ],
      giftAgreements: [
        { name: '投保须知', url: 'https://m.95303.com/health/desc/page/6/ysb_dianshang'},
        { name: '保险条款', url: 'https://static.95303.com/pdf/common/pdf/pdf.html?file=https://static.95303.com/pdf/terms/ysb/ysbbxtk2018.pdf'},
        { name: '投保声明', url: 'https://m.95303.com/health/desc/page/4/ysb_dianshang'},
        { name: '常见问题', url: 'https://m.95303.com/health/desc/commenqa/ysb_dianshang'}
      ],
      config: {
        // sharePhotos: location.origin + sharePic,
        shareTitle: "拼团免费领，百万医疗险免费送",
        shareDesc: "安心百万医疗·药神版免费领"
      }
    };
  },
  methods: {
    // 设置微信分享
    wxconfig() {
      if (Util.userAgentType() == "wechat") {
        const btWechat = new WechatRegistrar();
        const shareConfig = {
          title: this.config.shareTitle,
          desc: this.config.shareDesc
          // imgUrl: this.config.sharePhotos
        };

        btWechat
          .setConfig()
          .then(() => {
            wxShare(shareConfig);
          });
      }
    },
    checkName() {
      if (!this.submitData.name) {
        Toast('请输入姓名');
        return false;
      }
      return true;
    },
    checkLicenseNo() {
      if (!this.submitData.licenseNo) {
        Toast('请输入身份证号');
        return false;
      }
      if (!Util.REGEXP.IDCARD.test(this.submitData.licenseNo)) {
        Toast('请输入正确的身份证号');
        return false;
      }

      return true;
    },
    checkPhone() {
      if (!this.submitData.phone) {
        Toast('请输入手机号');
        return false;
      }
      if (!Util.REGEXP.PHONE.test(this.submitData.phone)) {
        Toast('请输入正确的手机号');
        return false;
      }

      return true;
    },
    checkCode() {
      if (!this.submitData.code) {
        Toast('请输入验证码');
        return false;
      }
      if (!Util.REGEXP.VERCODE.test(this.submitData.code)) {
        Toast('请输入正确的验证码');
        return false;
      }

      return true;
    },
    async getVerCode() {
      if (!this.canClick) return;
      if (!this.checkPhone()) return;

      this.canClick = false;
      let params = {
        phone: this.submitData.phone,
        type: 4
      };
      let data = await loginService.verifyCode(params);
      if (data.code != '1') {
        Toast(data.message);
        this.canClick = true;
        this.vercodeValue = '重新发送';
        return;
      }
      this.vercodeValue = '正在获取...';
      let count = 60;
      this.intervalFlag = setInterval(() => {
        count--;
        if (count === 0) {
          clearInterval(this.intervalFlag);
          this.canClick = true;
          this.vercodeValue = '重新发送';
        } else {
          this.vercodeValue = count + 's';
        }
      }, 1000);
    },
    submit() {
      if (!this.isReadAgreements) {
        Toast('请确认已阅读所有条款');
        return;
      }
      if (!this.checkName()) return;
      if (!this.checkLicenseNo()) return;
      if (!this.checkPhone()) return;
      if (!this.checkCode()) return;

      Toast.loading({
        mask: true,
        message: '发送中...',
        duration: 0,
      });

      groupService.checkCode({
        phone: this.submitData.phone,
        code: this.submitData.code
      }).then((data) => {
        if (data.code == 1) {
          Util.setSessionData('__p_gift_submit__', this.submitData);

          if (!this.isLogin) {
            let params = {
              username: this.submitData.phone,
              code: this.submitData.code,
              openId: Util.getCookie("openId") || "",
              isCheckCode: 0
            };
            loginService.wapLogin(params).then(loginResult => {
              Toast.clear();
              if (loginResult.code !== 1) {
                Toast(loginResult.message);
              } else {
                Util.setCookie("AccessToken", loginResult.object.token);
                Util.setCookie("userInfo", loginResult.object || {});
                btPage.open({
                  url: '/gift/anxin_notify',
                  container_style: 1,
                  params: {
                    type: 'group'
                  }
                });
              }
            });
          } else {
            Toast.clear();
            btPage.open({
              url: '/gift/anxin_notify',
              container_style: 1,
              params: {
                type: 'group'
              }
            });
          }
        } else {
          Toast.clear();
          Toast(data.message);
        }
      });
    },
    goToRule() {
      this.saveSubmit();
      btPage.open({
        url: '/gift/rule',
        container_style: 1
      });
    },
    saveSubmit() {
      Util.setSessionData('__p_gift_submit__', this.submitData);
    },
    reloadSubmit() {
      let submitData = Util.getSessionData('__p_gift_submit__');
      if (submitData) {
        this.submitData = submitData;
        Util.removeSessionData('__p_gift_submit__');
      }
    },
    goToProtocol(url) {
      this.saveSubmit();
      location.href = url;
    },
    // getGroup() {
    //   Toast.loading({
    //     mask: true,
    //     message: '加载中...',
    //     duration: 0,
    //   });
    //
    //   groupService.getGroup().then((data) => {
    //     Toast.clear();
    //     if (data.code == 1) {
    //       if (data.object && data.object.groupId) {
    //         btPage.open({
    //           url: '/group/join_result',
    //           container_style: 1,
    //           params: {
    //             id: data.object.groupId,
    //           }
    //         });
    //       }
    //     } else {
    //       Toast(data.message);
    //     }
    //   });
    // }
  },
  created() {
    if (Util.getCookie("AccessToken")) {
      this.isLogined = true;
    }
    this.reloadSubmit();
    // this.getGroup();
  },
  mounted() {
    setPageTitle('安心赠险领取');
    this.wxconfig();
  },
  beforeDestroy() {
    this.intervalFlag && clearInterval(this.intervalFlag);
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .group-get-leader-wrapper {
    .header {
      height: auto;
      padding-top: 10px;

      .form-box {
        width: 350px;
        @media screen and (max-width: 340px) {
          width: 300px;
        }
        background: #fff;
        border-radius: 5px;
        margin: 0 auto;
        padding: 0 10px 16px;

        >h3 {
          .font(16px, #464646, center, 22px, bold);
          padding: 8px 0 12px;
        }
        .form-item {
          .wh(100%, 40px);
          border-radius: 20px;
          .half-border(bottom, #ddd);
          padding: 0 5px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          >span {
            .font(15px, #464646, right, 21px);
            margin-right: 4px;
            width: 75px;
            flex-shrink: 0;
          }
          .item-right {
            flex-grow: 1;
            height: 100%;
            display: flex;
            align-items: center;

            input {
              flex-grow: 1;
              flex-shrink: 1;
              .font(15px, #333, left, 22px);
            }
            &.ss-item {
              span {
                .wh(70px, 25px);
                border-radius: 13px;
                .font(14px, #666, center, 25px);
                .half-border(all, #ddd, 13px);

                &:first-child {
                  margin-right: 10px;
                }
                &.curr {
                  background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
                  box-shadow:0 2px 4px 0 rgba(246,124,40,0.3);
                  color: #fff;

                  &:after {
                    display: none;
                  }
                }
              }
            }
            &.v-code-item {
              input {
                width: 124px;
                @media screen and (max-width: 340px) {
                  width: 90px;
                }
              }
              .v-code {
                white-space: nowrap;
                .font(15px, #ff5d1b, left, 22px);
                padding-left: 13px;
                border-left: 1px solid #ccc;
                @media screen and (max-width: 340px) {
                  padding-left: 10px;
                }
              }
            }
          }
        }
        .agreements-item {
          display: flex;
          margin-bottom: 15px;

          .check-box {
            flex-shrink: 0;
            .square(12px);
            .half-border(all, #ddd);
            margin-right: 8px;
            margin-top: 1px;
          }
          .agreement-desc {
            .font(12px, #97999B, justify, 16px);

            .agreement {
              color: #fd9239;
            }
          }
        }
        .btn-submit {
          display: block;
          .wh(100%, 45px);
          border-radius: 25px;
          background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
          box-shadow:0 2px 4px 0 rgba(246,124,40,0.3);
          .font-core(16px, #fff);
        }
      }
    }
    .gift-detail {
      >h2 {
        .wh(100%, 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        .font-core(20px, #464646);

        &:before, &:after {
          content: '';
          .wh(33px, 12px);
          margin: 0 15px;
        }
        &:before {
          background: url("../../assets/images/gift/bg_dot_left.png") no-repeat center center;
          background-size: 100% 100%;
        }
        &:after {
          background: url("../../assets/images/gift/bg_dot_right.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .gift-item {
        background-color: #fff;
        .title {
          .font(19px, #333, center, 16px, bold);
        }

        &.gift1 {
          .title {
            padding: 15px 0 8px;
          }
          .val-detail {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 15px;
            .half-border(bottom, #ddd);
            height: 32px;

            .desc {
              .font-core(14px, #999);
            }
            .value {
              .font-core(14px, #333);
            }

            &.val-detail-title {
              height: 35px;
              .desc {
                .font-core(15px, #333);
                font-weight: bold;
              }
              .value {
                .font-core(15px, #3e9cff);
              }
            }
          }
          .note {
            .font(12px, #fd9239, justify, 16px);
            padding: 12px 15px 10px;
            a {
              color: #fd9239;
            }
          }
        }
        &.gift2 {
          .title {
            margin: 0 15px;
            .half-border(bottom, #ddd);
            padding: 15px 0;
          }
          .ktf-content {
            padding: 0 21px 7px;
          }
          .ktf-base-info {
            height: 40px;
            .font-core(13px, #999);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .ktf-detail {
            display: flex;

            .detail-left, .detail-right {
              .half-border(all, #ddd);

              p {
                padding: 10px 12px;

                &:first-child {
                  background: #f2f2f2;
                  .font(15px, #333, left, 16px, bold);
                }
                &:last-child {
                  .font(13px, #666, left, 16px);
                }
              }
            }
            .detail-left {
              flex-grow: 1;
            }
            .detail-right {
              flex-shrink: 0;
              width: 108px;

              p {
                text-align: center !important;
              }
            }
          }
        }
      }
    }
    footer {
      height: 78px;
      padding-top: 21px;
      background: #fff url("../../assets/images/gift/bg_bottom.png") no-repeat center center;
      background-size: 100% 100%;

      p {
        width: 100%;
        .font(12px, #666, center, 18px);
      }
    }
  }
</style>
