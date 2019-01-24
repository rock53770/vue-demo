

<template>
  <div class="plr15">
    <div class="ta-c pt26">
      <img src="../../assets/images/agenting.png" width="181">
      <div class="">
        <p class="ft18 lh22 pt40 pb20">展业资质认证审核中</p>
        <p class="ft15 lh30 cl-gray pb20 ta-l">您的展业资质正在申请审核中，暂时无法申请提现，平台将在1-3个工作日通过您的资质审核，如有任何问题请随时联系客服。</p>
          <div class="mt40">
            <van-button type="primary" round :block="true"  @click="next" text="查询认证状态"></van-button>
          </div>
          <div class="mt40 pb20">
            <van-button type="primary" round :block="true"  @click="contact" text="联系客服" plain></van-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
    import PopupRadio from '@/components/PopupRadio.vue'
    import upload from '@/components/Upload/index.vue'
    import myService from '@/api/myService'
    export default {
        name: 'auth',
        data () {
            return {
                arr:[],
                notice:false,
            }
        },
        created() {
          // if(this.$route.query.notice == 1){
          //   this.notice = true;
          // }
        },
        methods:{
            next(){
              if(GConfig.isInApp){
                btPage.open({
                    url: '/my/agent-desc',
                    type:1,
                    container_style: 1
                });
              } else {
                this.$router.replace({ name: "agent-desc"});
              }

            },
            contact() {
                this.goPage('/my/contact')
            },
            goPage(path, query) {
                btPage.open({
                    url: path,
                    params: query,
                    container_style: 1
                });
            }
        },
        beforeDestroy: function() {
            document.body.classList.remove("bg-white");
        },
        mounted () {
            setPageTitle('认证通告');
            // wv.customBackAction(function() {
            //   btPage.open({
            //     url: '/quote',
            //     container_style: 1,
            //     type: 3
            //   })
            // });
            // wv.setWebViewInfo({
            //   wvBackDisable:1
            // })
            document.body.classList.add("bg-white");
        },
        components :{
            // upload,PopupRadio
        }
    }
</script>
<style lang="less">
.agent-notice{
  background:url(../../assets/images/agent-notice.png) no-repeat;
  background-size:100% auto;
}
</style>


