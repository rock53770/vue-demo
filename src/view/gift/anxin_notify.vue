<template>
  <div class="gift-anxin-notify-wrapper">
    <header class="header">
      <h2>安心1号·百万医疗产品</h2>
      <p>健康告知书</p>
    </header>
    <section class="notify-content">
      <h4>请如实告知被保险人是否存在一下情况：</h4>
      <p>(1) 过去 2 年内投保人身保险或健康保险时，被保险公司拒保、延期、加费或者附加条件承保。</p>
      <p>(2) 过去 1 年内有健康检查结果异常(如血液、超声、影像、内镜、病理检查);过去 2 年曾住院 (不包括剖腹产/顺产/鼻炎/急性胃肠炎/肺炎/上呼吸道感染住院)。</p>
      <p>
        (3) 目前或过往患有下列疾病或症状:<br>
        良/恶性肿瘤、白血病、3 级以上高血压(收缩压大于 180mmHg，舒张压大于 110mmHg)、糖尿病、冠心病/冠状动脉狭窄、心肌梗死、风湿性心脏病、心功能不全二级以上、脑梗死/脑出血、 肾炎、肾功能不全、肾/输尿管结石、肝炎、肝硬化、再生障碍性贫血、系统性红斑狼疮、类风湿 性关节炎、帕金森氏病、癫痫、精神病、肺结核、慢性阻塞性肺病、瘫痪、慢性胆囊炎、胆石症、 胆囊息肉、下肢静脉曲张、甲亢、甲状腺结节、传导性耳聋、胃/十二指肠溃疡、椎间盘突出症、 乳腺囊肿/结节、克罗恩病(节段性肠炎)、先天性疾病。
      </p>
      <p>(4) 过去 1 年内存在下列症状:反复头痛、晕厥、胸痛、气急、紫绀、持续反复发热、抽搐、不明原因皮下出血点、咯血、反复呕吐、进食梗噎感或吞咽困难、呕血、浮肿、腹痛、黄疸(新生儿黄 疸且已治愈的除外)、便血、血尿、蛋白尿、肿块、消瘦(体重减轻 5 公斤以上)、职业病、酒精 中毒、其他药品中毒、智能障碍、五官/脊柱/胸廓/四肢/手指/足趾缺损/畸形或功能障碍。</p>
      <p>
        (5) 2 周岁以下:出生时体重低于 2.5 公斤，有早产/窒息/发育迟缓/脑瘫。<br>
        投保人应在对所有被保险人健康/职业状况充分了解的基础上履行如实告知义务。投保人承诺完全知晓所有被保险人健康/职业状况。若被保险人健康/职业状况与上述告知内容不符:<br>
        1、本公司有权不同意承保。<br>
        2、若发生保险事故，本公司不承担赔偿或给付保险金的责任，并有权不退还保险费。
      </p>
      <p>(6) 目前从事高危职业 <a href="https://m.95303.com/health/desc/specialoccupation" style="text-direction:none; color:#ED4F34">(查看特别职业表)</a>。</p>
    </section>
    <footer class="btn-box">
      <button class="btn-white" @click="doCancel">部分填“是”</button>
      <button class="btn-color" @click="doSubmit">全部“否”</button>
    </footer>
    <div class="toast-box success" v-if="isShowToast && toastType">
      <h3>领取成功！</h3>
      <p>请注意检查手机短信<br>确认保单</p>
    </div>
    <div class="toast-box fail" v-if="isShowToast && !toastType">
      <h3>领取失败！</h3>
      <p>很抱歉，您不符合该保险要求</p>
    </div>
  </div>
</template>

<script>
import giftService from '../../api/giftService';
import groupService from '@/api/groupService';
export default {
  name: 'anxinNotify',
  components: {},
  props: {},
  data() {
    return {
      type: null, // group 组队赠险
      isShowToast: false,
      toastType: 0, // 0：失败 1：成功
      timeoutFlag: null,
      submitData: {}
    };
  },
  methods: {
    doSubmit() {
      if (this.isShowToast) return;

      Toast.loading({
        mask: true,
        message: '发送中...',
        duration: 0,
      });

      if (this.type === 'group') {
        groupService.collection(this.submitData).then((data) => {
          Toast.clear();
          if (data.code == 1) {
            Util.removeSessionData('__p_gift_submit__');
            Toast.success('领取申请已发送');
            this.timeoutFlag = setTimeout(() => {
              btPage.open({
                url: '/group/join_result',
                container_style: 1,
                params: {
                  id: data.object.groupId || null,
                }
              });
            }, 3000);
          } else {
            Toast(data.message);
          }
        });
      } else {
        giftService.getGift(this.submitData).then((data) => {
          Toast.clear();
          if (data.code == 1) {
            Util.removeSessionData('__p_gift_submit__');
            this.toastType = 1;
            this.isShowToast = true;
            this.timeoutFlag = setTimeout(() => {
              btPage.open({
                url: '/quote',
                container_style: 1,
              });
            }, 1500);
          } else {
            Toast(data.message);
          }
        });
      }
    },
    doCancel() {
      if (this.isShowToast) return;
      this.toastType = 0;
      this.isShowToast = true;
      this.timeoutFlag = setTimeout(() => {
        btPage.goBack();
      }, 1500);
    }
  },
  created() {
    this.submitData = Util.getSessionData('__p_gift_submit__');
    this.type = this.$route.query.type;
  },
  mounted() {
    setPageTitle('健康告知');
  },
  before() {
    this.timeoutFlag && clearTimeout(this.timeoutFlag);
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .gift-anxin-notify-wrapper {
    .header {
      height: auto;
      padding: 10px 0;

      h2 {
        .font(17px, #333, center, 24px, bold);
        margin-bottom: 2px;
      }
      p {
        .font(17px, #333, center, 24px);
      }
    }
    .notify-content {
      background: #fff;
      padding: 12px 15px 50px;

      h4 {
        .font(15px, #666, left, 21px);
        margin-bottom: 4px;
      }
      p {
        .font(15px, #666, justify, 24px);
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }
    .btn-box {
      .wh(100%, 50px);
      display: flex;
      .position2(fixed, bottom, 0, left, 0);

      button {
        flex-grow: 1;
        font-size: 17px;

        &.btn-white {
          background: #fff;
          color: #444;
        }
        &.btn-color {
          background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
          color: #fff;
        }
      }
    }
    .toast-box {
      background: rgba(0, 0, 0, 0.7);
      border-radius: 3px;
      width: 240px;
      .position2(fixed, top, 50%, left, 50%);
      transform: translate(-50%, -50%);
      padding: 12px;

      h3 {
        display: flex;
        align-items: center;
        justify-content: center;
        .font(17px, #fff, left, 24px, bold);
        margin-bottom: 16px;

        &:before {
          content: '';
          .square(22px);
          margin-right: 6px;
        }
      }
      p {
        .font(15px, #fff, center, 24px);
      }
      &.success {
        h3:before {
          background: url("../../assets/images/gift/icon_suc@2x.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &.fail {
        h3:before {
          background: url("../../assets/images/gift/icon_fail@2x.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
