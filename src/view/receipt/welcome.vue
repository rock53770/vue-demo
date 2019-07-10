<template>
  <div class="receipt-welcome-wrapper">
    <header></header>
    <h2>你有单，我有路，一起大家帮</h2>
    <h4>严选大家帮供应商，报价多，价格优</h4>
    <h4 class="mb250">平台提供交易担保，佣金有保障</h4>
    <div class="rule-list-box">
      <h3>大家帮交易规则</h3>
      <ul class="rule-list">
        <li>车险大家帮入口发起的报价，将收到平台严选的诚信 供应商提供的多个报价</li>
        <li>可以自由选择其中一个供应商的价格出单</li>
        <li>推荐用户从平台出单，平台将提供交易保障，确保佣 金发放</li>
        <li>线下交易产生的任何纠纷平台概不负责</li>
        <li>退保、批单请及时联系平台，平台将协助处理，确保 交易双方利益</li>
        <li>有任何疑问请及时联系客服，电话：<span class="cl-orange">0571-28208124</span></li>
      </ul>
    </div>
    <div class="btn-box">
      <button class="btn-entry" @click="goToEntry">立即前往</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcom',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    goToEntry() {
      this.$router.replace('/receipt/entry');
    }
  },
  mounted() {
    setPageTitle('车险大家帮');
  },
  created() {
    Util.setLocalData('__p_is_shown_welcome', true);
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .receipt-welcome-wrapper {
    .bg-img-set('~@/assets/images/match/img_banner_cuohe_big@2x.png', '~@/assets/images/match/img_banner_cuohe_big@3x.png', 100%, auto);
    background-position: 0 0;
    background-color: #FFB47E;

    &:before {
      content: '';
      display: table;
    }
    header {
      .wh(183px, 40px);
      .bg-img-set('~@/assets/images/match/banner-wenzi_big@2x.png', '~@/assets/images/match/banner-wenzi_big@3x.png', 100%, 100%);
      margin: 20px auto 10px;
    }
    h2 {
      .font(22px, #fff, left, 30px, bold);
      padding-left: 48px;
      margin-bottom: 12px;
    }
    h4 {
      .font(16px, #fff, left, 22px);
      padding-left: 48px;
      margin-bottom: 6px;
    }
    .mb250 {
      margin-bottom: 250px;
    }
    .rule-list-box {
      padding: 12px 15px 15px;
      background:rgba(255,255,255,0.8);
      box-shadow:0 0 4px 0 rgba(255,154,79,0.5);
      border-radius:8px;
      margin: 0 15px 20px;
      h3 {
        .font(17px, #666, center, 24px, bold);
        margin-bottom: 10px;
      }
      .rule-list {
        li {
          position: relative;
          padding-left: 13px;
          .font(13px, #777, justify, 18px);
          &:not(:last-child) {
            margin-bottom: 6px;
          }

          &:before {
            content: '';
            display: block;
            .square(5px);
            border-radius: 50%;
            background: #ff9363;
            .position2(absolute, left, 0, top, 6px);
          }
        }
      }
    }
    .btn-box {
      padding: 0 12px 12px;
      .btn-entry {
        .wh(100%, 45px);
        display: block;
        background:linear-gradient(90deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
        border-radius:23px;
        .font-core(16px, #fff);
      }
    }
  }
</style>
