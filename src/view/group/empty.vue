<template>
  <div class="group-empty-wrapper">
    <div class="empty-img"></div>
    <p>查询到您未参与活动～</p>
    <button @click="goBack">返回</button>
  </div>
</template>

<script>
export default {
  name: 'empty',
  methods: {
    goBack() {
      btPage.goBack();
    }
  },
  mounted() {
    setPageTitle('拼团买保险');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .group-empty-wrapper {
    .empty-img {
      .wh(263px, 147px);
      background: url("../../assets/images/group/img_weicanyu.png") no-repeat center center;
      background-size: 100% 100%;
      margin: 90px auto 24px;
    }
    p {
      .font(16px, #97999b, center, 22px);
      margin-bottom: 80px;
    }
    button {
      display: block;
      margin: 0 auto;
      width:325px;
      height:45px;
      background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
      box-shadow:0 2px 4px 0 rgba(246,124,40,0.3);
      border-radius:25px;
      .font-core(16px, #fff);

      @media screen and (max-width: 340px) {
        width:280px;
      }
    }
  }
</style>
