<template>
  <div class="renewal-result-wrapper">
    <template v-if="resultType">
      <i class="result-icon success"></i>
      <h2>续保成功！</h2>
      <p class="success">你已成功续保 {{ insuranceName }}，请注意查看手机和邮箱确认保单信息。</p>
      <button @click="goToQuote">确认</button>
    </template>
    <template v-else>
      <i class="result-icon fail"></i>
      <h2>扣款失败！</h2>
      <p class="fail">扣款失败，请检查支付渠道是否异常。 返回重新申请续保。</p>
      <button @click="goBack">返回</button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'result',
  components: {},
  props: {},
  data() {
    return {
      resultType: 0, // 0：失败 1：成功
      insuranceName: ''
    };
  },
  computed: {},
  methods: {
    goBack() {
      btPage.goBack();
    },
    goToQuote() {
      btPage.open({
        url: '/quote',
        container_style: 1,
      });
    }
  },
  created() {
    this.resultType = parseInt(this.$route.query.type) || 0;
    if (this.resultType) {
      this.insuranceName = decodeURIComponent(this.$route.query.name);
    }
  },
  mounted() {
    const title = this.resultType ? '缴费成功' : '缴费失败';
    setPageTitle(title);
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .renewal-result-wrapper {
    .wholeScreen();
    background: #fff;

    .result-icon {
      display: block;
      .wh(76px, 95px);
      margin: 40px auto 25px;

      &.success {
        background: url("../../assets/images/gift/icon_right@2x.png") no-repeat center center;
        background-size: 100% 100%;
      }
      &.fail {
        background: url("../../assets/images/gift/icon_fail_big@2x.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
    h2 {
      .font(18px, #333, center, 25px);
      margin-bottom: 15px;
    }
    p {
      .font(14px, #666, center, 20px);
      margin: 0 auto 66px;

      &.success {
        width: 295px;
      }
      &.fail {
        width: 238px;
      }
    }
    button {
      display: block;
      .wh(260px, 45px);
      margin: 0 auto;
      background: #fff;
      .font-core(16px, #ff8526);
      border-radius:25px;
      border:1px solid rgba(255,133,38,1);
    }
  }
</style>
