<template>
  <div class="gift-anxin-wrapper">
    <div>
      <header class="header">
        <div class="form-box">
          <div class="issued-num-box">
            <span class="issued-desc">今日已发放</span>
            <span v-for="(item, index) in aIssueCount" :key="index" class="issued-num">{{ item }}</span>
          </div>
          <p class="benefit">
            完善信息即可免费领取<span>保险</span>
          </p>
          <div class="form-item">
            <span>姓名</span>
            <div class="item-right">
              <input type="text" v-model="submitData.name" placeholder="请输入姓名">
            </div>
          </div>
          <div class="form-item">
            <span>身份证号</span>
            <div class="item-right">
              <input type="text" v-model="submitData.licenseNo" placeholder="请输入身份证号">
            </div>
          </div>
          <div class="form-item">
            <span>社保情况</span>
            <div class="item-right ss-item">
              <span :class="{'curr': submitData.socialInsurance === 1}"
                    @click="submitData.socialInsurance = 1">有社保</span>
              <span :class="{'curr': submitData.socialInsurance === 0}"
                    @click="submitData.socialInsurance = 0">无社保</span>
            </div>
          </div>
          <div class="form-item">
            <span>手机号</span>
            <div class="item-right v-code-item">
              <input type="tel" v-model="submitData.phone" placeholder="请输入手机号">
              <span class="v-code" @click="getVerCode">{{ vercodeValue }}</span>
            </div>
          </div>
          <div class="form-item">
            <span>验证码</span>
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
              <!--<span class="agreement" @click="goToBlackBullAgreement">《黑牛保险用户服务协议》</span>-->
            </p>
          </div>
          <button class="btn-submit" @click="submit">
            免费领取
            <!-- <div class="ft10">（￥145.00元起/首月保费免费送）</div> -->
          </button>
          <p class="supplement"><span>*</span> 续保可一次性缴费，也可提供分期月缴服务</p>
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
        <!--<div class="gift-item gift2">-->
          <!--<h3 class="title">泰康飞常保100万航空意外险</h3>-->
          <!--<div class="ktf-content">-->
            <!--<p class="ktf-base-info">-->
              <!--<span>保期：365天</span>-->
              <!--<span>可投保年龄：22-50周岁</span>-->
            <!--</p>-->
            <!--<div class="ktf-detail">-->
              <!--<div class="detail-left">-->
                <!--<p>保障项目</p>-->
                <!--<p>飞机意外身故/残疾</p>-->
              <!--</div>-->
              <!--<div class="detail-right">-->
                <!--<p>保障金额</p>-->
                <!--<p>100万</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </section>
      <footer>
        <p>
          本次活动产品均为对应保险公司提供，<br>
          活动咨询：18667908773（微信同号）
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import loginService from '../../api/loginService';
import sharePic from '../../assets/images/gift/share.png';
export default {
  name: 'anxinInsurance',
  components: {},
  props: {},
  data() {
    return {
      issueCount: 686,
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
        sharePhotos: location.origin + sharePic,
        shareTitle: "百万医疗免费送",
        shareDesc: "安心百万医疗大放送"
      }
    };
  },
  computed: {
    aIssueCount() {
      const count = parseInt(this.issueCount) || 0;
      return count.toString().split('');
    }
  },
  methods: {
    // 设置微信分享
    wxconfig() {
      if (Util.userAgentType() == "wechat") {
        const btWechat = new WechatRegistrar();
        const shareConfig = {
          title: this.config.shareTitle,
          desc: this.config.shareDesc,
          imgUrl: this.config.sharePhotos
        };

        btWechat
          .setConfig()
          .then(() => {
            wxShare(shareConfig);
          });
      }
    },
    getIssueCount() {
      const date = new Date();
      const day = date.getDate();
      const hour = date.getHours();
      let issueData = Util.getLocalData('__p_issueData__');

      function initIssueCount(plusNum = 0) {
        let issueData = {
          day: day,
          hourChange: false,
          baseNum: 0,
          plusNum
        };

        if (hour < 6) {
          issueData.baseNum = parseInt(Math.random() * 40 + 10);
        } else {
          issueData.baseNum = parseInt(Math.random() * 100 + 300);
          issueData.hourChange = true;
        }

        return issueData;
      }

      if (issueData) {
        if (issueData.day === day) { // 同一天内
          if (hour >= 6 && !issueData.hourChange) { // 6点后重新初始化基数
            issueData = initIssueCount(issueData.plusNum); // 保留已增加的数
          }
          let nPlus = hour < 6 ? (Math.random() > 0.5 ? 1 : 2) : (Math.random() > 0.5 ? 2 : 3);
          issueData.plusNum += nPlus;
          this.issueCount = issueData.baseNum + issueData.plusNum;
          Util.setLocalData('__p_issueData__', issueData);
        } else { // 不是同一天  重新初始化
          issueData = initIssueCount();
          this.issueCount = issueData.baseNum;
          Util.setLocalData('__p_issueData__', issueData);
        }
      } else {
        issueData = initIssueCount();
        this.issueCount = issueData.baseNum;
        Util.setLocalData('__p_issueData__', issueData);
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

      Util.setSessionData('__p_gift_submit__', this.submitData);
      btPage.open({
        url: '/gift/anxin_notify',
        container_style: 1
      });
    },
    goToBlackBullAgreement() {
      this.saveSubmit();
      btPage.open({
        url: '/gift/agreement',
        container_style: 1
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
    }
  },
  created() {
    this.reloadSubmit();
    this.getIssueCount();
  },
  mounted() {
    setPageTitle('安心百万医疗险超值放送');
    this.wxconfig();
  },
  beforeDestroy() {
    this.intervalFlag && clearInterval(this.intervalFlag);
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .gift-anxin-wrapper {
    .header {
      height: auto;
      background: url("../../assets/images/gift/img_anxin_banner.png") no-repeat;
      background-size: 100% auto;
      padding-top: 192px;
      @media screen and (max-width: 340px) {
        padding-top: 164px;
      }
      @media screen and (min-width: 450px) {
        padding-top: 1.92rem;
      }

      .form-box {
        width: 350px;
        @media screen and (max-width: 340px) {
          width: 300px;
        }
        background: #fff;
        border-radius: 15px;
        margin: 0 auto;
        padding: 16px 12px 12px;

        .issued-num-box {
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;

          .issued-desc {
            .font(16px, #333, left, 16px, bold);
            margin-right: 6px;
          }
          .issued-num {
            .wh(18px, 23px);
            background:linear-gradient(0deg,rgba(253,147,57,1) 0%,rgba(253,185,57,1) 100%);
            border-radius: 3px;
            .font(15px, #fff, center, 23px, bold);

            &:not(:last-child) {
              margin-right: 4px;
            }
          }
        }
        .benefit {
          .font(14px, #464646, center, 22px, bold);
          margin-bottom: 16px;

          span {
            color: #ff5d1b;
          }
        }
        .form-item {
          .wh(100%, 40px);
          border-radius: 20px;
          .half-border(all, #ddd, 20px);
          padding: 0 15px;
          display: flex;
          align-items: center;
          margin-bottom: 15px;

          >span {
            .font(15px, #333, right, 22px);
            margin-right: 23px;
            width: 60px;
            flex-shrink: 0;
            @media screen and (max-width: 340px) {
              margin-right: 15px;
            }
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
                  background:linear-gradient(0deg,rgba(253,147,57,1) 0%,rgba(253,185,57,1) 100%);
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
          padding: 0 15px;
          display: flex;
          margin-bottom: 13px;

          .check-box {
            flex-shrink: 0;
            .square(12px);
            .half-border(all, #ddd);
            margin-right: 4px;
            margin-top: 1px;
          }
          .agreement-desc {
            .font(12px, #999, justify, 16px);

            .agreement {
              color: #fd9239;
            }
          }
        }
        .btn-submit {
          display: block;
          .wh(100%, 47px);
          border-radius: 24px;
          background:linear-gradient(0deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 99%);
          .font-core(18px, #fff);
        }
        .supplement {
          margin-top: 10px;
          padding-left: 14px;
          .font(12px, #999, left, 16px);
          span {
            color: #fd9239;
          }
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
