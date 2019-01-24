
<template>
  <div class="">
    <div class="h50"></div>
    <div class="ta-c plr20 pb30">
      <img src="~@/assets/images/succ.png" width="180">
      <p class="ta-c ft18 mt10 ">提交成功</p>
      <p class="cl-gray lh20 mt10 w-80 mc">提现申请已提交，预计2个工作日到账。 您可在【我的钱包】-【收支明细】中查 看到提现状态哦 ~</p>
    </div>
    <div class="mlr20 mt40">
      <van-button type="primary" round :block="true"  @click="next" text="查看明细"></van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cash-result',
  data () {
    return {
      isNewCar:false,
    }
  },
  methods:{
    next() {
      // this.$router.replace({name:'balanceDetail'})
      btPage.open({
        url: '/achieve/balanceDetail',
        container_style: 1,
        type:1
      })
      // location.href = '/order'
    },
    setHead(isActive) {
      var self = this;
      this.$store.dispatch("setHead", {
        needBack: false,
      });
    }
  },
  beforeDestroy: function() {
      document.body.classList.remove("bg-white");
  },
  mounted () {
      setPageTitle('提现结果');
      this.setHead()
      document.body.classList.add("bg-white");
  },
}
</script>

