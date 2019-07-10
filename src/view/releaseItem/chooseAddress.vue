<template>
  <div>
    <van-notice-bar text="*为保证保单快速寄出，请填写正确的配送地址" color="#FC6B47" background="#FDE7D8"/>
    <van-tabs v-model="active" :line-width="40" color="#087BF5" class="cl-primary ft16">
      <van-tab title="寄送">
        <div class="address-box pt10">
          <div>
            <van-cell-group>
              <van-field
                v-model="newaddress.reciverName"
                clearable
                label="收件人"
                placeholder="请输入姓名"
              />
              <van-field
                v-model="newaddress.reciverPhone"
                type="tel"
                clearable
                label="手机号"
                placeholder="请输入手机号"
              />
              <van-field v-model="reciverProvinceCityCount" label="省/市/区" placeholder="请选择地区">
                <div @click="selectsite" slot="button" class="float-module cl-black"></div>
              </van-field>
              <van-field
                v-model="newaddress.reciverAddress"
                type="textarea"
                autosize
                rows="1"
                clearable
                label="详细地址"
                placeholder="请输入详细地址"
              />
            </van-cell-group>
            <div class="bg-white lh50 plr10 mt10 ta-c" @click="addressListSelect">
              <img class="w20 ver-align-mid" src="../../assets/icons/add@2x.png">
              <span class="cl-primary ver-align-mid">选择现有配送地址</span>
            </div>
          </div>
          <van-popup v-model="isshowsite" position="bottom" :overlay="false">
            <van-area
              :area-list="areaList"
              :value="newaddress.reciverCountyCode ? newaddress.reciverCountyCode.toString() : ''"
              @cancel="onCancel"
              @confirm="onConfirm"
            />
          </van-popup>
        </div>
      </van-tab>
      <van-tab title="自取">
        <div class="pt10">
          <div class="plr10 flex-center lh50 bg-white" @click="choose({id:''})">
            <span class="flex-1">保险公司自取</span>
            <div class>
              <img src="~@/assets/icons/select.png" width="14" v-show="reciverid">
              <img src="~@/assets/icons/elect.png" width="14" v-show="!reciverid">
            </div>
          </div>
          <div class="mt10 bg-white">
            <div class="lh50 pl10 van-hairline--bottom">新欣保自营网点自取</div>
            <ul>
              <li class v-for="(i,index) in selfAddress" :key="index">
                <div class="van-hairline--bottom flex-center plr10" @click="choose(i)">
                  <div class="flex-1 pt10 pb10">
                    <span class>{{ i.locationName }}</span>
                    <p class="ft12 mt5 cl-gray">{{ i.provinceName }}{{ i.cityName }}{{ i.address }}</p>
                  </div>
                  <div class="ml10">
                    <img src="~@/assets/icons/select.png" width="14" v-show="i.id != reciverid">
                    <img src="~@/assets/icons/elect.png" width="14" v-show="i.id == reciverid">
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button round type="primary" block @click="finish" text="完成"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Area from "./../../lib/area.js";
import myService from "@/api/myService";
import orderService from "@/api/orderService";

export default {
  name: "chooseAddress",
  data() {
    return {
      active: 0,
      id: "",
      newaddress: {
        isDefault: "",
        reciverName: "",
        reciverPhone: "",
        reciverProvinceName: "",
        reciverProvinceCode: "",
        reciverCityName: "",
        reciverCityCode: "",
        reciverCountyName: "",
        reciverCountyCode: "",
        reciverAddress: ""
      },
      reciverProvinceCityCount: "",
      isshowsite: false,
      areaList: null,
      chosenAddressId: "1",
      reciverid: "",
      list2: [
        {
          id: 1,
          desc: 11
        },
        {
          id: 2,
          desc:
            "浙江省杭州市浙江省杭州市浙江省杭州市浙江省杭州市浙江省杭州市浙江省杭州市浙江省杭州市"
        }
      ],
      selfAddress: []
    };
  },
  computed: {
    type() {
      if (this.active === 0) {
        return 1;
      } else if (this.active === 1) {
        if (this.reciverid === "") {
          return 2;
        } else {
          return 3;
        }
      }
    }
  },
  created() {
    this.active = this.$route.query.active || 0;
    this.id = this.$route.query.id || "";
    this.areaList = Area;
    this.addressQuery();
    this.getSelfAddress();
  },
  methods: {
    gopage(url, query) {
      btPage.open({
        url: url,
        container_style: 1,
        type: 3,
        params: query,
        jsOnResume: res => {
          if (GConfig.isInApp) {
            this.newaddress = res.selectAddress;
            this.reciverProvinceCityCount =
              this.newaddress.reciverProvinceName +
              " " +
              this.newaddress.reciverCityName +
              " " +
              this.newaddress.reciverCountyName;
          }
        }
      });
    },
    addressQuery() {
      myService.addressQuery({ ID: this.id }).then(res => {
        if (res.code == 1) {
          var address = res.object;

          if (Util.getLocalData("selectAddress")) {
            address = Util.getLocalData("selectAddress");

            this.newaddress = address;
            this.reciverProvinceCityCount =
              address.reciverProvinceName +
              " " +
              address.reciverCityName +
              " " +
              address.reciverCountyName;
            this.reciverid = address.id;
          } else {
            if (res.object) {
              this.newaddress = address;
              this.reciverProvinceCityCount =
                address.reciverProvinceName +
                " " +
                address.reciverCityName +
                " " +
                address.reciverCountyName;
              this.reciverid = "";
            } else {
              this.getList();
            }
          }
        } else {
          Toast(res.message);
        }
      });
    },
    choose(i) {
      this.reciverid = i.id;
    },
    getList() {
      let self = this;
      myService.addressList({}).then(res => {
        if (res.code == 1) {
          res.object.forEach(it => {
            if (it.isDefault) {
              self.newaddress = it;
              self.reciverProvinceCityCount =
                it.reciverProvinceName +
                " " +
                it.reciverCityName +
                " " +
                it.reciverCountyName;
            }
          });
        }
      });
    },
    finish() {
      if (this.type == 1) {
        if (!this.newaddress.reciverName) {
          Toast("请输入姓名");
          return;
        }
        if (
          !this.newaddress.reciverPhone ||
          !/^1[0-9]{10}$/.test(this.newaddress.reciverPhone)
        ) {
          Toast("请输入正确的手机号");
          return;
        }
        if (!this.newaddress.reciverCountyCode) {
          Toast("请选择省市区");
          return;
        }
        if (!this.newaddress.reciverAddress) {
          Toast("请输入详细地址");
          return;
        }
      }

      var params = {
        id: this.$route.query.id,
        type: this.type
      };

      if (this.type == 1) {
        params.reciverName = this.newaddress.reciverName;
        params.reciverPhone = this.newaddress.reciverPhone;
        params.reciverProvinceCode = this.newaddress.reciverProvinceCode;
        params.reciverCityCode = this.newaddress.reciverCityCode;
        params.reciverCountyCode = this.newaddress.reciverCountyCode;
        params.reciverAddress = this.newaddress.reciverAddress;
        params.reciverid = this.reciverid;
      } else {
        params.reciverid = this.reciverid;
      }

      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });
      orderService.mailing(params).then(res => {
        Toast.clear();
        if (res.code == 1) {
          Toast("地址提交成功");
          setTimeout(() => {
            // this.$router.replace({
            //     name:"order",
            //     query:{
            //       type:2
            //     }
            // });
            this.gopage("/order", { type: 2 });
          }, 2000);
        } else {
          Toast(res.message);
        }
      });
    },
    addressListSelect() {
      // this.$router.push({name:"addressListSelect"});
      this.gopage("/order/address_list_select");
    },
    selectsite() {
      this.isshowsite = true;
    },
    onCancel(value) {
      this.isshowsite = false;
    },
    onConfirm(value) {
      this.newaddress.reciverProvinceName = value[0].name;
      this.newaddress.reciverProvinceCode = value[0].code;
      this.newaddress.reciverCityName = value[1].name;
      this.newaddress.reciverCityCode = value[1].code;
      this.newaddress.reciverCountyName = value[2].name;
      this.newaddress.reciverCountyCode = value[2].code;
      this.reciverProvinceCityCount =
        value[0].name + " " + value[1].name + " " + value[2].name;
      this.isshowsite = false;
    },
    getSelfAddress() {
      let param = {};
      orderService.getSelfAddress(param).then(res => {
        if (res.code == 1) {
          this.selfAddress = res.object;
        } else {
          Toast(res.message);
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== "addressListSelect") {
      Util.removeLocalData("selectAddress");
    }
    next();
  },
  mounted() {
    setPageTitle("选择取件方式");
  }
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
      left: 0;
      .float-module {
        position: absolute;
        height: 100%;
        width: 100%;
      }
    }
  }
}
.van-tabs {
  .van-tabs__nav {
    /deep/ .vant-tab {
      font-size: 16px;
      color: #666666;
    }
    /deep/ .van-tab--active {
      color: #087bf5;
    }
  }
}
</style>



