<template>
  <div class="gift-rule-wrapper">
    <h1>活动规则</h1>
    <p>1.有效参与用户须身体健康，符合健康告知与投保条件；</p>
    <p>2.每位用户限领1份保障，多次领取仅一次有效；</p>
    <p>3.“安心1号·百万医疗药神版”赠险的保障期限为1个月，到期后会有专业保险人员通知续保事宜。</p>
    <p>4.本保险仅提供电子保单，保单生效后，承保用户会自动收到保险平台及保险公司短信通知；</p>
    <p>5.因单一保险公司保障范围存在地域等限制因素，为提升用户体验，我们将及时为用户免费赠送其他保险公司同类型产品。</p>
    <p>6.本次活动的赠险为对应保险公司提供，咨询：18667908773（微信同号）</p>
  </div>
</template>

<script>
export default {
  name: 'giftActivityRule',
  mounted() {
    setPageTitle('活动规则');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";

  .gift-rule-wrapper {
    background: white;
    padding: 0 10px;
    height: 100vh;

    h1 {
      .font(24px, #000, center, 2);
    }
    p {
      .font(14px, #000, justify, 2);
      text-indent: 28px;
    }
    h3 {
      .font(14px, #000, right, 2, normal);
    }
    .red {
      color: #f00;
    }
  }
</style>
