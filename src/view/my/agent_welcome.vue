<template>
  <div class="agent-welcome-wrapper">
    <div class="desc-content">
      <div class="desc-item">
        <h2>
          <i class="icon1"></i>资质好
        </h2>
        <p>星利保险经纪有限公司成立于2008年，是经中国 保监会批准设立的全国性专业保险经纪公司，已 与国内数十家保险公司开展合作，产品涵盖车险、 意外险、健康险、寿险等。</p>
      </div>
      <div class="desc-item">
        <h2>
          <i class="icon2"></i>业务全
        </h2>
        <p>公司经营业务包括：在全国区域内（港、澳、台 除外）为保人拟定投保方案、选择保险人、办理 投保手续；协助被保险人或受益人进行索赔；再 保险经纪业务；为委托人提供防灾、防损或风险 评估、风险管理咨询服务等。</p>
      </div>
      <div class="desc-item">
        <h2>
          <i class="icon3"></i>政策好
        </h2>
        <p>公司为保险代理人提供从商品到售后，从工具到 附能的全方位服务，拓宽保险代理人获客、展业 与销售渠道，成就保险代理人百万年薪的梦想！</p>
      </div>
    </div>
    <button class="btn-agent" @click="goToAgent">即刻认证，合规展业！</button>
  </div>
</template>

<script>
export default {
  name: 'agentWelcome',
  data() {
    return {};
  },
  methods: {
    goToAgent() {
      this.$router.replace({ name: "agent", query: { noApply: 1 }});
    }
  },
  mounted() {
    setPageTitle('申请加入星利');
    Util.setLocalData('__p_agent_welcome__', true);
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .agent-welcome-wrapper {
    min-height: 100vh;
    .bg-img-set('~@/assets/images/agent/chexian_banner@2x.png', '~@/assets/images/agent/chexian_banner@3x.png');
    background-position: top left;
    background-color: #fffaf5;

    &:before, &:after {
      content: '';
      display: table;
    }

    .desc-content {
      margin: 270px auto 33px;
      width: 335px;
      @media screen and (max-width: 340px) {
        width: 285px;
      }
      box-shadow:0 2px 6px 0 rgba(0,0,0,0.1);
      background-color: white;
      border-radius:5px;
      padding: 15px;

      .desc-item {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 20px;
        }
        h2 {
          display: flex;
          align-items: center;
          .font(16px, #464646, left, 22px, bold);
          margin-bottom: 4px;

          i {
            display: inline-block;
            .square(30px);
            margin-right: 8px;

            &.icon1 {
              .bg-img-set('~@/assets/images/agent/icon_zizhi@2x.png', '~@/assets/images/agent/icon_zizhi@3x.png', 100%, 100%);
            }
            &.icon2 {
              .bg-img-set('~@/assets/images/agent/icon_yewu@2x.png', '~@/assets/images/agent/icon_yewu@3x.png', 100%, 100%);
            }
            &.icon3 {
              .bg-img-set('~@/assets/images/agent/icon_zhengce@2x.png', '~@/assets/images/agent/icon_zhengce@3x.png', 100%, 100%);
            }
          }
        }
        p {
          .font(14px, #888, justify, 20px);
        }
      }
    }
    .btn-agent {
      display: block;
      .wh(280px, 45px);
      border-radius: 23px;
      .position2(fixed, bottom, 11px, left, 50%);
      transform: translateX(-50%);
      background:linear-gradient(90deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
      .font-core(16px, #fff);
    }
  }
</style>
