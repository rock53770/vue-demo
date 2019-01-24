<template>
  <div class="address-box">
    <div>
      <ul class="pt10">
        <li class="plr10 mb10 bg-white" v-for="(i, index) in list" :key="index">
          <div class="van-hairline--bottom">
            <p class="mb5 pt10">
              <span class v-text="i.reciverName"></span>
              <span class v-text="i.reciverPhone"></span>
            </p>
            <p
              class="cl-dgray pb5 ft13"
              v-text="i.reciverProvinceName + i.reciverCityName + i.reciverCountyName + i.reciverAddress"
            ></p>
          </div>
          <div class="flex-center h35 ft14 cl-gray">
            <span
              class="flex-1"
              :class="[i.isDefault?'icon-elect cl-orange':'icon-select']"
              v-text="i.isDefault?'默认地址':'设为默认地址'"
              @click="setDefault(i)"
            ></span>
            <div class>
              <span @click="onEdit(i)" class="icon-edit mr10">编辑</span>
              <span @click="ondel(i)" class="icon-delete2">删除</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="ft16 ta-c p10" v-if="list && !list.length">暂无地址，赶快去添加吧</div>
      <div class="h70">
        <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
          <van-button type="primary flex-1" @click="onAdd" text="添加新地址"></van-button>
        </div>
      </div>
    </div>
    <van-popup class="form-container h-100" v-model="isshowedit" position="top" :overlay="true">
      <van-cell-group>
        <van-field
          v-model="newaddress.reciverName"
          clearable
          label="联系人"
          placeholder="请输入联系人"
          :error="newaddress_error.reciverName"
        />
        <van-field
          v-model="newaddress.reciverPhone"
          type="tel"
          clearable
          label="联系号码"
          placeholder="请输入联系电话"
          :error="newaddress_error.reciverPhone"
        />
        <van-field
          v-model="reciverProvinceCityCount"
          disabled
          label="邮寄地址"
          placeholder="请选择地址"
          :error="newaddress_error.reciverCountyCode"
        >
          <div @click="selectsite" slot="button" class="float-module"></div>
        </van-field>
        <van-field
          v-model="newaddress.reciverAddress"
          clearable
          label="详细地址"
          placeholder="请输入详细地址"
          :error="newaddress_error.reciverAddress"
        />
      </van-cell-group>
      <div class="flex-center mlr15 mt24">
        <van-button type="primary flex-1 mlr15" @click="isshowsite=isshowedit=false" text="取消"></van-button>
        <van-button type="primary flex-1 mlr15" @click="postAddress" text="提交地址"></van-button>
      </div>
    </van-popup>
    <van-popup v-model="isshowsite" position="bottom" :overlay="false">
      <van-area
        :area-list="areaList"
        title="选择地址"
        @change="onChange"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import Area from './../../lib/area.js'
import myService from "@/api/myService";
export default {
  name: "addressList",
  data() {
    return {
      newaddress: {
        isDefault: 0,
        reciverName: "",
        reciverPhone: "",
        reciverProvinceName: "",
        reciverProvinceCode: "",
        reciverCityName: "",
        reciverCityCode: "",
        reciverCountyName: "",
        reciverCountyCode: "",
        reciverProvinceCityCount: "",
        reciverAddress: ""
      },
      newaddress_error: {
        name: false,
        tel: false,
        address: false,
        addressdetail: false
      },
      isshowedit: false,
      isshowsite: false,
      areaList: null,
      chosenAddressId: "1",
      list: ""
    };
  },
  computed: {
    reciverProvinceCityCount() {
      if (this.newaddress.reciverCountyName) {
        return (
          this.newaddress.reciverProvinceName +
          " " +
          this.newaddress.reciverCityName +
          " " +
          this.newaddress.reciverCountyName
        );
      } else {
        return "";
      }
    }
  },
  created() {
    this.areaList = Area;
    this.getList();
  },
  methods: {
    goPage(url, query) {
      btPage.open({
        url: url,
        container_style: 1,
        params: query
      });
    },
    getList() {
      myService.addressList({}).then(res => {
        if (res.code == 1) {
          if (res.object) {
            this.list = res.object || [];
          }
        } else {
          this.list = [];
          //                    Toast(res.message)
        }
      });
    },
    onAdd() {
      // this.$router.push({ name: "address-edit" });
      this.goPage('/my/address-edit')
    },
    onEdit(i) {
      // this.$router.push({
      //   name: "address-edit",
      //   query: {
      //     id: i.ID
      //   }
      // });
      this.goPage('/my/address-edit', {id: i.ID})
    },
    ondel(i) {
      myService.addressDelete({ ID: i.ID }).then(res => {
        if (res.code == 1) {
          this.list = this.list.filter(function(j) {
            return j.ID !== i.ID;
          });
        }
        Toast(res.message);
      });
    },
    setDefault(i) {
      if (i.isDefault) {
        return;
      }
      myService.updateDefault({ ID: i.id }).then(res => {
        if (res.code == 1) {
          this.list.forEach(function(k) {
            k.isDefault = 0;
          });
          i.isDefault = 1;
          // Toast(data.message);
        } else {
          Toast(res.message);
          // this.list = [];
        }
      });
    },
    selectsite() {
      console.log("selectsite");
      this.isshowsite = true;
    },
    postAddress() {
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

      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });
      var params = this.newaddress;
      myService.addressSave(params).then(res => {
        Toast.clear();
        if (res.code == 1) {
          //                    params.ID = res.object;
          //                    this.list.push(params);
          this.getList();
          this.isshowedit = false;
          this.isshowsite = false;
          for (var i in this.newaddress) {
            this.newaddress[i] = "";
          }
        } else {
          Toast(res.message);
        }
      });
    },
    onChange(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      console.log("取消");
      this.isshowsite = false;
    },
    onConfirm(value) {
      console.log(value);
      this.newaddress.reciverProvinceName = value[0].name;
      this.newaddress.reciverProvinceCode = value[0].code;
      this.newaddress.reciverCityName = value[1].name;
      this.newaddress.reciverCityCode = value[1].code;
      this.newaddress.reciverCountyName = value[2].name;
      this.newaddress.reciverCountyCode = value[2].code;
      this.isshowsite = false;
    }
  },
  mounted() {
    setPageTitle("地址管理");
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
</style>

