<template>
    <div class="address-box ft16">
        <van-cell-group>
            <van-field v-model="newaddress.reciverName" clearable label="联系人" placeholder="请输入联系人"/>
            <van-field v-model="newaddress.reciverPhone" type="tel" clearable label="联系号码" placeholder="请输入联系电话"/>
            <van-field v-model="reciverProvinceCityCount" label="邮寄地址" placeholder="请选择地址">
                <div @click="selectsite" slot="button" class="float-module cl-black"></div>
            </van-field>
            <van-field v-model="newaddress.reciverAddress" autosize clearable type="textarea"
                rows="1"  label="详细地址" placeholder="请输入详细地址" />
        </van-cell-group>
        <div class="plr10 lh50 flex-center bg-white mt10" v-if="!id">
          <span class="flex-1 lh50 ft16">设为默认地址</span>
          <van-switch size="24px" v-model="newaddress.isDefault" />
        </div>
        <div class="h70">
          <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
            <van-button round type="primary flex-1 mlr15" @click="postAddress" text="提交地址"></van-button>
          </div>
        </div>
        <van-popup v-model="isshowsite" position="bottom" :overlay="false">
            <van-area :area-list="areaList" title="选择地址" @cancel="onCancel" @confirm="onConfirm" :value="code"/>
        </van-popup>
    </div>
</template>

<script>
import Area from './../../lib/area.js'
import myService from '@/api/myService'
export default {
    name: 'addressList',
    data() {
        return {
            newaddress: {
                "isDefault": false,
                "reciverName": "",
                "reciverPhone": "",
                "reciverProvinceName": "",
                "reciverProvinceCode": "",
                "reciverCityName": "",
                "reciverCityCode": "",
                "reciverCountyName": "",
                "reciverCountyCode": "",
                "reciverAddress": ""
            },
            id: '',
            isshowsite: false,
            areaList:null,
            chosenAddressId: '1',
            list: ''
        };
    },
    computed:{
      reciverProvinceCityCount(){
        if(this.newaddress.reciverCountyName){
          return this.newaddress.reciverProvinceName + ' ' + this.newaddress.reciverCityName + ' ' + this.newaddress.reciverCountyName
        } else {
          return ''
        }
      },
      code() {
        if(this.newaddress.reciverCountyCode){
            return '' + this.newaddress.reciverCountyCode;
        } else {
            return '';
        }
      }
    },
    created() {
        this.areaList = Area;
        this.id = this.$route.query.id || '';
        if(this.id){
          this.addressQuery();
        }
    },
    methods: {
        addressQuery() {
            myService.addressQuery({ID:this.id}).then((res) => {
                if(res.code == 1){

                  this.newaddress.reciverName  = res.object.reciverName;
                  this.newaddress.reciverPhone = res.object.reciverPhone;
                  this.newaddress.reciverAddress = res.object.reciverAddress;

                  this.newaddress.reciverProvinceCode = res.object.reciverProvinceCode;
                  this.newaddress.reciverProvinceName = res.object.reciverProvinceName;
                  this.newaddress.reciverCityCode = res.object.reciverCityCode;
                  this.newaddress.reciverCityName = res.object.reciverCityName;
                  this.newaddress.reciverCountyCode = res.object.reciverCountyCode;
                  this.newaddress.reciverCountyName = res.object.reciverCountyName;

                } else {
                  Toast(res.message)
                }
                // Toast(res.message)
            })
        },
        selectsite() {
            this.isshowsite = true;
        },
        postAddress() {

            if(!this.newaddress.reciverName){
              Toast("请输入姓名")
              return
            }
            if(!this.newaddress.reciverPhone || !/^1[0-9]{10}$/.test(this.newaddress.reciverPhone)){
              Toast("请输入正确的手机号")
              return
            }
            if(!this.newaddress.reciverCountyCode){
              Toast("请选择省市区")
              return
            }
            if(!this.newaddress.reciverAddress){
              Toast("请输入详细地址")
              return
            }

            Toast.loading({
                duration:0,
                forbidClick:true,
                message: '加载中...'
            });
            var params = Util.deepClone(this.newaddress);
            params.reciverProvinceCode = parseInt(params.reciverProvinceCode)
            params.reciverCityCode = parseInt(params.reciverCityCode)
            params.reciverCountyCode = parseInt(params.reciverCountyCode)
            params.isDefault = this.newaddress.isDefault ? 1 : 0;
            if(this.id){//修改
              params.ID = this.id;
              // delete params.isDefault;
              myService.addressUpdata(params).then((res) => {
                  Toast.clear();
                  if(res.code == 1){
                      this.isshowsite = false;
                        // this.$router.back()
                        btPage.goBack()
                  } else {
                      Toast(res.message)
                  }
              })
            } else {//新增
                myService.addressSave(params).then((res) => {
                    Toast.clear();
                    if(res.code == 1){
                        this.isshowsite = false;
                        // this.$router.back()
                        btPage.goBack()
                    } else {
                        Toast(res.message)
                    }
                })
            }
        },
        onCancel() {
            this.isshowsite = false;
        },
        onConfirm(value) {
            this.newaddress.reciverProvinceName = value[0].name;
            this.newaddress.reciverProvinceCode = value[0].code;
            this.newaddress.reciverCityName =     value[1].name;
            this.newaddress.reciverCityCode =     value[1].code;
            this.newaddress.reciverCountyName =   value[2].name;
            this.newaddress.reciverCountyCode =   value[2].code;
            this.isshowsite = false;
        },
        // goPage(url, query) {
        //     btPage.open({
        //         url: url,
        //         container_style: 1,
        //         params: query,
        //         type: 3
        //     });
        // }
    },
    mounted () {
      if(this.id){
        setPageTitle('编辑地址');
      } else {
        setPageTitle('添加地址');
      }

    },
};
</script>

<style lang="less">
.address-box {
    .van-cell .van-cell__value .van-field__body {
        position: relative;
        .van-field__button {
            position: absolute;
            height: 100%;
            width: 100%;
            left:0;
            .float-module {
                position: absolute;
                height: 100%;
                width: 100%;
            }
        }
    }
}
</style>

