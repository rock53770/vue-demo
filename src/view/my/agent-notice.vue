

<template>
  <div class="agent-notice">
    <div class="" style="padding-top:79px;">
      <div class="bg-white mlr15 plr10 bdr5" style="color:#D6A669">
        <p class="ft15 lh22 pt40 pb20" v-text="(userInfo.nickName?'尊敬的':'')+userInfo.nickName+'您好：'"></p>
        <p class="ft15 lh30" style="text-indent:30px">由于政策要求，平台展业需要认证您的展业资格，请协助提供您的相应代理信息。平台认证将在1-3个工作日完成。
          有任何问题请随时联系您的专属客服，造成不便请谅解。</p>
          <div class="mt40">
            <van-button type="primary" round :block="true"  @click="next" text="开始资质认证"></van-button>
          </div>
          <div class=" mt40 pb20">
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
        name: 'agent-notice',
        data () {
            return {
                userInfo:{},
                notice:false,
            }
        },
        created() {
          if(this.$route.query.notice == 1){
            this.notice = true;
          }
          if(GConfig.isInApp){
            this.userInfo = Util.getLocalData("userInfo") || {};
          } else {
            this.userInfo = Util.getCookie("userInfo") || {};
          }
        },
        methods:{
            next(){
              var query = {};
              if(this.$route.query.noApply){
                query.noApply = 1
              }
              if(GConfig.isInApp){
                btPage.open({
                  url: '/my/agent',
                  type:1,
                  params: query,
                  container_style: 1
                })
              } else {
                this.$router.replace({ name: "agent", query:query });
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
        mounted () {
            setPageTitle('认证通告');
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


