
<template>
    <div class="cl-gray" v-if="showAds">
        <van-swipe :loop="false" class="pos-a t0 l0 w-100 h-100">
            <van-swipe-item v-for="(i, index) in adsList" :key="index" class="w-100" >
                <img :src="i" class="show" style="object-fit:cover;height:100%;width:100%" @click="go(index)"/>
            </van-swipe-item>
        </van-swipe>
        <div class="pos-a plr10" @click="skip" style="top:58px;right:30px;border:1px solid #999; border-radius:14px;line-height:28px;">
          跳过 <span v-text="time"></span>s
        </div>
    </div>
</template>

<script>
import quoteService from '@/api/quoteService';
import loginService from '@/api/loginService.js';
export default {
    name: 'ads',
    data() {
        return {
            loading:false,
            isLogin:false,
            time:6,
            showAds:false,
            adsList:['./static/1.jpg','./static/2.png','./static/3.png'],
        };
    },
    computed: {

    },
    mounted(){
        this.$store.dispatch("setHead", {
          showHeader:false,
        });
        var timer = setInterval(()=>{
          this.time--;
          if(this.time === 0){
            Util.setLocalData("hasShowAdsed","1");
            this.go();
          }
        },1000)
        this.$once('hook:beforeDestroy', function () {
          clearInterval(timer)
        })
    },
    created() {
      if(Util.getLocalData("hasShowAdsed")){
        this.goPage('/quote')
      } else {
        Util.setLocalData("hasShowAdsed","1");
        this.showAds = true;
      }
    },
    methods: {
        skip(){
          this.go();
        },
        goPage(path,query){
          // btPage.open({
          //     url: path,
          //     params: query,
          //     type:1,
          //     container_style: 1
          // });
          this.$router.replace({ path: path, query:query});
        },
        go(index){
          let AccessToken = Util.getLocalData("AccessToken");
          if (AccessToken) {
            this.goPage('/quote')
          } else {
            this.goPage('/app_login')
          }
        }
    },
    components: {
    }
};
</script>

