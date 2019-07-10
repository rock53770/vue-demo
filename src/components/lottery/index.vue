
<template>
  <div class="lottery-box">
    <div class="pt6"></div>
    <img src="./images/bg_tuoyuan@3x.png" class="w-100 show">
    <div class="lottery">
      <div class="lot_main ta-c" @click="lottery()">
        <img src="./images/img_jindan@3x.png" class="egg" v-show="!show">
        <div v-show="show">
          <img src="./images/img_jindan_up@3x.png" class="broken_egg_up broken_egg">
          <img src="./images/img_light@3x.png" class="broken_egg_light broken_egg">
          <img src="./images/img_jindan_down@3x.png" class="broken_egg_down broken_egg">
        </div>

        <img src="./images/img_chuizi 2@3x.png" class="hammer" v-show="!show"
        :class="{'animate-swipe':anim == 'swipe','animate-fast':anim == 'fast','animate-smash':anim == 'smash'}">
        <div class="pos-a t0 pt22 mc w-100 l0 r0 oppo ft17">您有<b class="cl-orange" v-text="lottNum"></b>次抽奖机会，立即点击抽奖</div>
      </div>
    </div>
    <div class="pos-f l0 r0 t0 b0 wh-100 zi100" style="background-color:rgba(0,0,0,0.5)" v-show="showPrize">
      <div class="prize-box">
        <img src="./images/img_zhongjiang@3x.png" class="prize-img show" v-if="isPrize==1">
        <img src="./images/img_weizj@3x.png" class="prize-img show" v-else>
        <div class="prize-text ta-c bdr5">
          <div class="cl-4A2D14 ft22" v-text="name"></div>
          <div class="mt16" style="color:#666" v-if="isPrize==1">请注意保持电话畅通，<br>客服会在24小时内和您联系</div>
        </div>
        <img src="~@/assets/icons/icon_close@3x.png" class="w30 mc mt20 show" @click="close">
      </div>
    </div>
    <!-- <div v-show="false">
      11
    </div> -->
  </div>
</template>

<script>
import { Popup } from "vant";
// import { setTimeout, clearInterval } from 'timers';
import groupService from '@/api/groupService';
export default {
  name: "lottery",
  data() {
    return {
      show: false,
      showPrize:false,
      prize:null,
      isInApp:GConfig.isInApp,
      isPrize:0,
      name:'',
      anim:'swipe',
      lottNum:0
    };
  },
  mounted() {
  },
  created(){
    groupService.chanceNum().then((res)=>{
      if(res.code == 1){
        this.lottNum = res.object.num;
      } else {
        Toast(res.message)
      }
    })
  },
  props: {
    num: {
      type: String | Number,
      default: 0
    },
  },
  methods: {
    close(){
      this.show = false;
      this.showPrize = false;
      this.anim = 'swipe';
      this.name = '';
      this.isPrize = 0;
    },
    lottery() {

      if(this.lottNum <= 0){
        Toast("暂无抽奖机会")
        return
      }
      if(this.show){
        return
      }
      this.anim = 'fast';
      let hasGetResult = false;
      groupService.lottery().then((res)=>{
        if(res.code == 1){
          this.prize = 1;
          hasGetResult = true;
          this.name = res.object.name;
          this.isPrize = res.object.isPrize;
          this.lottNum--
          // this.$emit('update:lott-num', this.lottNum - 1)
        } else {
          Toast(res.message)
        }
      })

      setTimeout(() => {
        this.anim = 'smash';
        setTimeout(() => {
          this.show = true
          var timer
          if(hasGetResult){
            this.showPrize = true
          } else {
            Toast.loading({
              duration: 0,
              forbidClick: true,
              message: "正在获取抽奖结果..."
            });
            timer = setInterval(()=>{
              if(hasGetResult){
                this.showPrize = true
                Toast.clear()
                clearInterval(timer)
              }
            },100)
          }

        },800)
      },600)
    },
  }
};
</script>
<style lang="less">
.cl-4A2D14{
  color:#4A2D14
}
.lottery-box{
  margin:0px 12px;
  padding-bottom:10px;
  .prize-box{
    animation: linear slowLarge .6s .1s forwards;
    opacity:0
  }
  .prize-img{
    width:189px;
    padding-top:120px;
    margin:0 auto;
    margin-bottom:-56px;
  }
  .prize-text{
    background-color:#FFFDE9;
    margin:0 54px;
    padding:68px 0 74px;
  }
  .lottery{
    padding:0 8px 5px;
    background-color:#fff;
    .lot_main{
      position:relative;
      height:287px;
      background:url(./images/bg_jindan@3x.png) no-repeat,#fff;
      background-size:100% 100%;
      color:#fff;
      .oppo{
        color:#4A2D14;
      }
      .egg{
        width:100px;
        height:142px;
        padding-top:89px;
        box-sizing: content-box;
      }
      .broken_egg{
        position:absolute;
        left:0;
        right:0;
        margin:auto;
      }
      .broken_egg_up{
        top:30px;
        left:60px;
        width:100px;
        height:103px;
        transform-origin:80% 80%;
        // transform:translate(-20px,35px) rotateZ(-30deg);
        animation: open ease-out .3s;
      }
      .broken_egg_light{
        top:70px;
        left:4px;
        width:175px;
        height:100px;
        z-index:1;
      }
      .broken_egg_down{
        top:145px;
        width:100px;
        height:80px;
      }
      .hammer{
        width:75px;
        height:89px;
        position:absolute;
        top:61px;
        left:196px;
      }
      .animate-swipe{
        transform-origin:70% 70%;
        animation: swipe .6s alternate infinite;
      }
      .animate-fast{
        // transform-origin:90% 90%;
        animation: linear fast .6s;
      }
      .animate-smash{
        transform-origin:70% 70%;
        animation: smash ease-in .6s .2s alternate;
      }
    }
  }
}
@keyframes swipe{
  from {transform: rotate(40deg);}
  to {transform: rotate(-20deg)}
}
@keyframes slowLarge{
  from {transform: scale(0.2);opacity:0}
  to {transform: scale(1);opacity:1}
}

@keyframes smash{
  0% {transform: rotate(0);}
  40% {transform:translate(0,0) rotate(90deg);}
  100% {transform:translate(-30px,-20px) rotate(-90deg);}
  // 100% {transform: rotate(720deg)}
}
@keyframes fast{
  0% {transform: rotate(0);}
  30% {transform: rotate(360deg);}
  70% {transform: rotate(360deg);}
  100% {transform: rotate(720deg)}
}

@keyframes open{
  from {transform:translate(-20px,35px) rotateZ(-30deg);}
  to {transform:translate(0,0) rotate(0)}
}
</style>


