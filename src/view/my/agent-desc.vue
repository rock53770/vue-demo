

<template>
  <div class="agent-desc" v-if="agent.auditStatus!=3">
    <van-notice-bar
      v-if="agenResult"
      :text="agenResult"
      color="#FC6B47"
      background="#FDE7D8"
    />
    <div class="pt10"></div>
    <div class="watermark-box" v-if="agent.auditStatus <= 4">
        <div class="watermark" :class="[agent.auditStatus==3?'succ':'fail']"  v-text="auditText[agent.auditStatus]"></div>
    </div>
    <div class="bg-white ft16 mb10">
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span>姓名</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.name"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span>身份证号码</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.licenseNo"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.nation">
        <span>民族</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.nation"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.political">
        <span>政治面貌</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.political"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.degree">
        <span>文化程度</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.degree"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.school">
        <span>毕业院校</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.school"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.company">
        <span>所在公司</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.company"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.position">
        <span>职位</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.position"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.provinceName">
        <span>省/市/区</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.provinceName+agent.cityName+agent.countyName"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.address">
        <span>详细地址</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.address"></span>
        </div>
      </div>
    </div>
    <!-- <div class="bg-white ft16 mb10">
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span>审核结果</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="auditText[agent.auditStatus]"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="agent.auditRemark">
        <span>审核备注</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="agent.auditRemark"></span>
        </div>
      </div>
    </div> -->
    <div class="h70" v-if="agent.auditStatus == 2 || agent.auditStatus == 4">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" class="flex-1 mlr5" round block @click="submit" text="编辑后重新提交"></van-button>
      </div>
    </div>
  </div>
  <div class="agent-desc-succ" v-else>
    <div class="">
      <img src="~@/assets/images/agent-succ.png" class="w-100" style="height:1.92rem">
    </div>
    <div class="pos-r" style="margin:-0.87rem 15px 0;">
      <div class="bdr5 bg-white plr10 pb5 mb10">
        <div class="flex-center pb37 pt18">
          <b class="ft16 flex-1" v-text="agent.name || ''"></b>
          <!-- <div class="bg-orange lh25 plr10 ft10 cl-white bdr3" @click="goAgreement">查看我的电子合约</div> -->
        </div>
        <div class="flex-center pb10 lh20">
          <span class="flex-1">身份证号</span>
          <div class="" v-text="agent.licenseNo"></div>
        </div>
        <div class="flex-center pb10 lh20">
          <span class="flex-1">执业证书编号</span>
          <div class="" v-text="agent.practiceCertificateNumber"></div>
        </div>
      </div>
      <div class="bdr5 bg-white ta-c p10">
        <img src="~@/assets/images/tit.png" class="mt24 mb14" style="height:17px">
        <p class="ft13 lh26 cl-gray ta-l" style="text-indent:26px;">
           星利保险经纪有限公司成立于2008年，是经中国保监会批准设立的全国性专业保险经纪公司合作的保险产品涵盖车险、意外险、健康险、寿险等。
        </p>
        <p class="ft13 lh26 cl-gray ta-l" style="text-indent:26px;">
           公司为保险代理人提供从商品到售后，从工具到附能的全方位服务，拓宽保险代理人获客、展业与销售渠道，努力成就保险代理人百万年薪的梦想！
        </p>
      </div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" class="flex-1 mlr5" round block @click="goQuote" text="开始保险出单"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
    import myService from '@/api/myService'
    export default {
        name: 'auth',
        data () {
            return {
                arr:[],
                auditText: {
                    0:'审核中',
                    1:'审核中',
                    2:'审核未通过',
                    3:'审核通过',
                    4:'审核未通过',
                },
                agent:{},
                agenResult:""
            }
        },
        computed:{
          // agenResult(){
          //   return "111"
          // }
        },
        beforeRouteEnter (to, from, next) {
          Toast.loading({
              duration:0,
              forbidClick:false,
              message: '加载中..'
          });
          myService.userAgent().then((res) => {
              Toast.clear();
              if(res.code == 1){
                  next(vm => {
                    vm.agent = res.object.userAgentInfoVo;
                    if(vm.agent.auditStatus != 3){
                      setPageTitle('审核结果');
                    }
                    if(vm.agent.auditStatus == 2 || vm.agent.auditStatus == 4){
                      vm.agenResult = "审核结果:" + vm.auditText[vm.agent.auditStatus];
                      if(vm.agent.auditRemark){
                        vm.agenResult += ("  审核备注:" + vm.agent.auditRemark)
                      }
                    }
                  })

              } else {
                  Toast(res.message)
              }
          })
        },
        methods:{
            submit(){
                // this.$router.replace({name:"agent"})
                btPage.open({
                  url: '/my/agent',
                  container_style: 1
                })
            },
            goAgreement(){

            },
            goQuote(){
              btPage.open({
                  url: "quote",
                  type: 3,
                  container_style: 1
              });
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
            setPageTitle('资质认证');
        },
    }
</script>
<style lang="less">
.agent-desc{
  .watermark-box{
    position:absolute;
    top:100px;
    right:80px;
    opacity:0.6;
    transform: rotate(-45deg);
    .watermark{
      width:100px;
      height:100px;
      line-height:100px;
      text-align:center;
      border-radius: 50%;
      font-size:16px;
      color:#fc6b47;
      border:1px dotted  #fc6b47;
      &.succ{
        border:1px dotted #14BC84;
        color:#14BC84;
      }
      &.fail{
        border:1px dotted #FF4141;
        color:#FF4141;
      }
    }
  }

}
</style>


