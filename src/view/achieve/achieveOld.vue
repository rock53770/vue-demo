
<template>
    <div class="achieve pos-r">
        <div class="achieve-head  pt16 pb25">
            <div class="voice w-100 flex-center ta-c ft13 cl-white mb24" style="justify-content: space-around;">
                <div :class="['ftc', 'pb4', tabType === 0 ? 'active' : '']" @click="tabType = 0">保费</div>
                <div :class="['ftc', 'pb4', tabType === 1 ? 'active' : '']" @click="tabType = 1">出单量</div>
            </div>
            <div class="type w-100 ta-c">
                <div class="flex-center justify-c">
                    <span :class="['ftc', tabType === 0 ? 'mr16': 'mr0']">{{ tabType === 0 ? '当日保费' : '当日出单量' }}</span>
                    <i class="achieve-eye-hide" v-if="tabType === 0"></i>
                </div>
            </div>
            <p class="ta-c total"><strong class="fw-n cl-white">{{ tabType === 0 ? mainData.premiumDayOrder : mainData.numberDayOrder }}</strong></p>
            <div class="flex-center ta-c ft16" style="color: #FFE4E1;">
                <div class="flex-1 line-r">
                    <p class="ft11 mb5">{{ tabType === 0 ? '当月保费(元)' : '当月出单量(单)' }}</p>
                    <p class="cl-white">{{ tabType === 0 ? mainData.premiumMonthOrder : mainData.numberMonthOrder }}</p>
                </div>
                <div class="flex-1">
                    <p class="ft11 mb5">{{ tabType === 0 ? '总保费(元)' : '总出单量(单)' }}</p>
                    <p class="cl-white">{{ tabType === 0 ? mainData.premiumTotalOrder : mainData.numberTotalOrder}}</p>
                </div>
            </div>
        </div>
        
        <div class="flex-center justify-sb ta-c h80 ft16 cl-orange bg-white mb10">
            <div class="flex-1">
                <p class="cl-gray ft14 mb8">可提现(元)</p>
                <p>{{mainData.amountCouldTransfer}}</p>
            </div>
            <div class="flex-1">
                <p class="cl-gray ft14 mb8">冻结中(元)</p>
                <p>{{mainData.amountFreeze}}</p>
            </div>
            <div class="flex-1">
                <p class="cl-gray ft14 mb8">总收入(元)</p>
                <p>{{mainData.amountTotalIncome}}</p>
            </div>
        </div>
        
        <div class="bg-white ft16">
            <router-link :to="{ name: 'achieveDetail', query:{ premium: mainData.premiumTotalOrder, number: mainData.numberTotalOrder } }" tag="div" class="plr12 h50 lh50 van-hairline--bottom arrow-block-right">业绩明细</router-link>
            <router-link :to="{ name: 'balanceDetail' }" tag="div" class="plr12 h50 lh50 arrow-block-right">收支明细</router-link>
        </div>
        <div class="pos-a l0 r0 ta-c plr12 flex-center justify-sb" style="bottom: 10px;">
            <router-link :to="{ name: 'cash' }" class="flex-1 lh50 mr50 bdr5 cl-orange" style="border: 1px solid #EB7352;">我要提现</router-link>
            <div class="flex-1 lh50 bg-orange bdr5 cl-white">马上出单</div>
        </div>
        <footerBar path="achieve"></footerBar>
    </div>
</template>

<script>
import footerBar from "@/components/Footer";
import achieveService from "@/api/achieveService";

export default {
  name: "achieve",
  data() {
    return {
        tabType: 0, // 0: 保费 | 1: 出单量
        mainData:{},//业绩首页全部数据
    }
  },
  methods: {
      gopage () {

      },
      getHomeData(){
          achieveService.home()
            .then((res)=>{
              if(res.code && res.code===1){
                  if(res.object && res.object.achievementVo){
                      for(let [k,v] of Object.entries(res.object.achievementVo)){
                          this.$set(this.mainData, k, v)
                      }
                  }
              }else{
                  Toast(res.message)
              }
          })
      }
  },
  mounted() {
    setPageTitle("业绩");
    this.getHomeData();
  },
  components: {
    footerBar
  }
};
</script>

<style lang="less" scoped>
.achieve {
    height: calc(100vh - 50px);
    .achieve-head {
        background: url(../../assets/images/achieve_bg.png) #FF643F no-repeat center;
        background-size: contain;
        background-position: bottom center;
        .ftc {
            color: #FFE4E1;
            border-bottom: 2px solid transparent;
        }
        .active {
            color: #ffffff;
            border-bottom: 2px solid #ffffff;
        }
        .achieve-eye {
            display: inline-block;
            height: 18px;
            width: 18px;
            background: url('../../assets/icons/chieve_eye.png') no-repeat left;
            background-size: auto 18px;
        }
        .achieve-eye-hide {
            display: inline-block;
            height: 10px;
            width: 20px;
            background: url('../../assets/icons/chieve_eye_close.png') no-repeat left;
            background-size: 20px 10px;
        }
        .total {
            font-size: 40px;
            line-height: 56px;
            margin-bottom: 14px;
        }
        .line-r {
            position: relative;
            &::after {
                content: '';
                display: block;
                position: absolute;
                top: 5px;
                right: 0;
                height: 30px;
                width: 1px;
                background-color: #FFE4E1;
            }
        }
    }
}
</style>

