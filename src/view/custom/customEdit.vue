

<template>
  <div>
    <div class="bg-white flex-center plr15">
      <div class="w50 h50 mr15">
        <upload :pics="headUrls" class="w-100 h-100" :max="1" @upload-success="uploadSuccess">
          <!-- <div class="w-100 h-100 flex-center justify-c">
              <span class="plr10 lh24 bdr10 bg-o5 cl-white">点击上传</span>
          </div> -->
          <img :src="headUrls[0].content" v-if="headUrls[0]" class="wh-100 bdr-50">
          <img src="~@/assets/icons/head@3x.png"  class="wh-100 bdr-50" v-else>
        </upload>
      </div>
      <div class="flex-1">
        <p class="van-hairline--bottom lh40">
          <input class="wh-100" type="text" v-model="detail.name" placeholder="请输入姓名">
        </p>
        <p class="lh40">
          <input class="wh-100" type="tel" v-model="detail.phone" placeholder="请输入手机号">
        </p>
      </div>
    </div>
    <div class="bg-white ft15 mt10 bg-white">
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="w100">邮箱</span>
        <div class="flex-1">
            <input class="w-100" type="text" v-model="detail.customerEmail" placeholder="请输入邮箱">
        </div>
      </div>
      <div class="lh50 plr10 van-hairline--bottom">
        <popup-radio :cur-column.sync="licenseItem" :columns="licenseList" nameKey="content" valueKey="value" class="flex-center" cancelText="取消">
          <span class="w100">证件类型</span>
          <span class="w-100 flex-1" v-text="licenseItem.content || '请选择证件类型'" :class="{'cl-gray':!licenseItem.content}"></span>
          <van-icon name="arrow" class="cl-lgray"/>
        </popup-radio>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="w100">证件号码</span>
        <div class="flex-1">
            <input class="w-100" type="text" v-model="detail.licenseNo" placeholder="请输入证件号码">
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom" @click="showDate">
        <span class="w100">出生日期</span>
        <div class="flex-1">
          <span class="w-100 cl-gray" v-if="!detail.birthDay">请输入出生日期</span>
          <span class="w-100" v-else>{{detail.birthDay|dataFormat('yyyy-MM-dd')}}</span>
        </div>
        <van-icon name="arrow" class="cl-lgray"/>
      </div>
      <div class="lh50 plr10 van-hairline--bottom">
        <popup-radio :cur-column.sync="genderItem" :columns="genderList" class="flex-center" cancelText="取消">
          <span class="w100">性别</span>
          <span class="w-100 flex-1" v-text="genderItem.name || '请选择性别'" :class="{'cl-gray':!genderItem.name}"></span>
          <van-icon name="arrow" class="cl-lgray"/>
        </popup-radio>
      </div>
      <div class="h50 plr10 flex-center van-hairline--bottom"  @click="showSite">
        <span class="w100">省/市/区</span>
        <div class="flex-1">
            <span class="w-100" v-text="reciverProvinceCityCount || '请选择'" :class="{'cl-gray':!reciverProvinceCityCount}"></span>
        </div>
        <van-icon name="arrow" class="cl-lgray"/>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <div class="flex-1">
            <van-field
              class="w-100 ft16 custom-address"
              v-model="detail.customerAddress"
              label="详细地址"
              type="textarea"
              placeholder="请输入地址"
              rows="1"
              autosize
            />
        </div>
      </div>
    </div>
    <van-popup v-model="isShowSite" position="bottom" :overlay="true">
        <van-area :area-list="areaList" :loading="false" :height="'180'" title="选择城市" :value="countyCode"  @cancel="onCancel" @confirm="onConfirm"/>
    </van-popup>
    <van-popup v-model="dateShow" position="bottom" :overlay="true">
      <van-datetime-picker v-model="currentDate"  :min-date="new Date(1900,1,1)" :max-date="new Date()" type="date" @confirm="confirmDate" @cancel="cancelDate"/>
    </van-popup>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10 van-hairline--top">
        <van-button type="primary flex-1" :block="true" round  @click="submit" text="保存客户资料"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
    import PopupRadio from '@/components/PopupRadio.vue'
    import upload from '@/components/Upload/index.vue'
    import customService from '@/api/customService'
    import Area from './../../lib/area.js'
    export default {
        name: 'customEdit',
        data () {
            return {
                checked:true,
                dateShow:false,
                currentDate:new Date(),
                headUrls:[],
                isShowSite:false,
                reciverProvinceCityCount:'',
                provinceCode:"",
                cityCode:"",
                countyCode:"",
                provinceName:"",
                cityName:"",
                countyName:"",
                detail:{
                  name:'',
                  phone:'',
                  customerEmail:'',
                  licenseNo:'',
                  birthDay:'',
                  customerAddress:'',
                  headUrl:''
                },
                licenseList:[{id:1,name:"身份证"}],
                genderList:[{id:1,name:"男"},{id:2,name:"女"}],
                genderItem:{},
                licenseItem:{},
            }
        },
        created() {
          this.areaList = Area;
          this.id = this.$route.query.id

          if(this.id || 1){
            Toast.loading({
                duration:0,
                forbidClick:true,
                message: '加载中...'
            });
            customService.customerGet({id:this.id}).then(res => {
              Toast.clear()
              if(res.code == 1){
                this.licenseList = res.map.licenseType
                if(!res.object){
                  return
                }
                console.log(this.licenseList)
                this.detail = res.object
                // this.licenseList = res.map;
                if(this.detail.licenseType){
                  let found = this.licenseList.find(k => {
                    return k.value == this.detail.licenseType
                  })
                  this.licenseItem = {
                    value:this.detail.licenseType,
                    content:found && found.content
                  }
                }
                if(this.detail.gender){
                  this.genderItem = {
                    id:this.detail.gender,
                    name:this.detail.gender == 1 ? '男' : '女'
                  }
                }
                this.provinceCode = this.detail.customerProvinceCode;
                this.cityCode = this.detail.customerCityCode;
                this.countyCode = "" + this.detail.customerCountyCode;
                this.provinceName = this.detail.customerProvinceName || '';
                this.cityName = this.detail.customerCityName || '';
                this.countyName = this.detail.customerCountyName || '';
                this.reciverProvinceCityCount = this.provinceName + ' ' + this.cityName + ' ' + this.countyName;

                this.headUrls[0] = {};
                this.headUrls[0].content = this.detail.headUrl || '';
                this.headUrls[0].result = {viewPath:this.detail.headUrl || '',id:this.detail.headFileId};

              } else {
                Toast(res.message)
              }
            })
          } else {
            Toast.clear()
          }

        },
        methods:{
            uploadSuccess(){
              this.detail.headUrl = this.headUrls[0].content;
            },
            showDate(){
              this.currentDate = this.detail.birthDay ? new Date(this.detail.birthDay) : new Date();
              this.dateShow = true;
            },
            cancelDate(){
              this.dateShow = false;
            },
            confirmDate(){
              this.detail.birthDay = this.currentDate.getTime();
              this.dateShow = false;
            },
            submit(){
                // if(!(this.headUrls[0] && this.headUrls[0].result && this.headUrls[0].result.viewPath)){
                //     Toast("请上传头像照片")
                //     return
                // }
                if(!this.detail.name){
                    Toast("请输入姓名")
                    return
                }
                if(!this.detail.phone){
                    Toast("请输入手机号")
                    return
                }
                if(!/^1\d{10}$/.test(this.detail.phone)){
                    Toast("请输入11位手机号")
                    return
                }

                // if(!this.detail.licenseNo){
                //     Toast("请输入证件号")
                //     return
                // }

                Toast.loading({
                    duration:0,
                    forbidClick:true,
                    message: '加载中...'
                });
                var detail = this.detail;
                customService.customerSave({
                    id:this.id,
                    name:detail.name,
                    phone:detail.phone,
                    licenseType:this.licenseItem.value,
                    licenseNo:detail.licenseNo,
                    // jobId:this.genderItem.name,
                    birthDay:detail.birthDay,
                    gender:this.genderItem.id,
                    customerProvinceCode:this.provinceCode||"",
                    customerCityCode:this.cityCode||"",
                    customerCountyCode:this.countyCode||"",
                    customerAddress:detail.customerAddress||"",
                    headFileId:this.headUrls[0] && this.headUrls[0].result.id,
                    customerEmail:detail.customerEmail
                }).then((res) => {
                    Toast.clear();
                    if(res.code == 1){
                        btPage.goBack()
                    } else {
                        Toast(res.message)
                    }
                })
            },
            showSite() {
                this.isShowSite = true;
            },
            onCancel() {
                this.isShowSite = false;
            },
            onConfirm(value) {
                this.isShowSite = false;
                this.reciverProvinceCityCount = value[0].name + ' ' + value[1].name + ' ' + value[2].name;
                this.provinceCode = value[0].code;
                this.cityCode = value[1].code;
                this.countyCode = value[2].code;
            },
        },
        mounted () {
            setPageTitle('客户详情');
        },
        components :{
            upload,PopupRadio
        }
    }
</script>
<style lang="less" scoped>
/deep/ .custom-address{
  padding:10px 0;
}
input::-webkit-input-placeholder{
    color:#97999b;
}
</style>


