

<template>
  <div class="">
    <div class="bg-white flex-center plr15">
      <div class="w50 h50 mr15">
        <img :src="detail.headUrl" v-if="detail.headUrl" class="wh-100 bdr-50" alt=''>
        <img src="~@/assets/icons/head@3x.png"  class="wh-100 bdr-50" v-else>
      </div>
      <div class="flex-1">
        <p class="van-hairline--bottom lh40" v-text="detail.name"></p>
        <p class="lh40" v-text="detail.phone"></p>
      </div>
    </div>
    <div class="bg-white ft15 mb10 mt10">
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="w100">邮箱</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="detail.customerEmail"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="w100">证件类型</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="detail.licenseType"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="detail.licenseNo">
        <span class="w100">证件号码</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="detail.licenseNo"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="detail.birthDay">
        <span class="w100">出生日期</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="">{{detail.birthDay|dataFormat('yyyy-MM-dd')}}</span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="detail.gender">
        <span class="w100">性别</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="detail.gender==1?'男':'女'"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" v-if="detail.reciverProvinceCityCount">
        <span class="w100">常用地址</span>
        <div class="flex-1 ta-r cl-gray">
            <span class="" v-text="reciverProvinceCityCount + detail.customerAddress || ''"></span>
        </div>
      </div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" class="flex-1 mlr5" round block @click="go" text="编辑客户资料"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
    import customService from '@/api/customService'
    export default {
        name: 'customDetail',
        data () {
            return {
                id:'',
                detail:{},
                agenResult:""
            }
        },
        created(){
          this.id = this.$route.query.id
          Toast.loading({
            duration: 0,
            forbidClick: false,
            message: "加载中.."
          });
          customService.customerGet({id:this.id}).then(res => {
            Toast.clear()
            if(res.code == 1){
              this.detail = res.object;
              this.licenseList = res.map.licenseType

              let found = this.licenseList.find(k => {
                return k.value == this.detail.licenseType
              })
              this.detail.licenseType = found && found.content

              this.provinceName = this.detail.customerProvinceName || '';
              this.cityName = this.detail.customerCityName || '';
              this.countyName = this.detail.customerCountyName || '';
              this.reciverProvinceCityCount = this.provinceName + '' + this.cityName + '' + this.countyName;
            } else {
              Toast(res.message)
            }
          })
        },
        methods:{
            go(){
                btPage.open({
                  url: '/custom/custom_edit',
                  container_style: 1,
                  params:{
                    id:this.id
                  }
                })
            },
        },
        mounted () {
            setPageTitle('客户详情');
        },
    }
</script>


