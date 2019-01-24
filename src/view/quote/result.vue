
<template>
  <div class="">
    <div class="h50"></div>
    <div class="ta-c plr20 pb30">
      <img src="~@/assets/images/succ.png" width="180">
      <p class="cl-gray lh20 mt16 w-80 mc">报价申请已提交，请耐心等待。您可在【订单】-【报价中】 中查看到报价状态哦 ~</p>
    </div>
    <div class="mlr15 mt40">
      <van-button type="primary" round :block="true"  @click="next" text="查看订单"></van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'result',
  data () {
    return {
      isNewCar:false,
    }
  },
  created(){
    this.$store.dispatch("setHead", {
      needBack:false
    });
  },
  methods:{
    next(){
      // this.$router.push({name:'order'})
      // location.href = '/order?v=20181030'

      btPage.open({
        url: '/order',
        container_style: 1,
        type: 3
      })
      // btPage.open({
      //   url: '/order',
      //   type:3,
      // })
    },
    setHead(isActive){
      var self = this;
      this.$store.dispatch("setHead", {
        menuContent:`<div class="menu"></div>`,
        needBack:false
      });
    }
  },

  beforeDestroy: function() {
      document.body.classList.remove("bg-white");
  },
  mounted () {
      setPageTitle('报价结果');
      wv.customBackAction(function() {
        btPage.open({
          url: '/quote',
          container_style: 1,
          type: 3
        })
      });
      wv.setWebViewInfo({
        wvBackDisable:1
      })
      document.body.classList.add("bg-white");
  },
}
</script>

