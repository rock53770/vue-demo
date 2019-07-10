<template>
  <div class="enquiry">
    <div class="bg-white" style="height:1.64rem">
      <img src="~@/assets/images/match/chexian_banner@3x.png" class="wh-100 show img-cov">
    </div>

    <div class="bg-white">
      <div class="pb10 pos-r" style="margin:-0.37rem 15px 0">
        <div class="flex-center justify-sb h45 ft16 bdr5 info-shadow plr15 bg-white" @click="showSite">
          <span class="bd-left">投保城市</span>
          <div class="flex-center">
            <span class="cl-primary mr8">{{ activeArea[1].name }}</span>
            <van-icon name="arrow-down" color="#CBCBCB"/>
          </div>
        </div>
        <div class="mt10 bdr5 info-shadow ">
            <div class="lh45 pl15 ft16 van-hairline--bottom">
              <span class="bd-left">选择品牌</span>
            </div>

            <div class="plr10 pt12" v-if="products.length">
              <van-checkbox-group v-model="product" @change="change">
                <div class="flex-center justify-sb flex-w">
                  <div
                    v-for="(i,index) in products"
                    class="mb12 bdr5 info-shadow p5 flex-center justify-sb compony h40"
                    :key="index"
                    @click="toggle(index)"
                  >
                    <div class="bd-gray bdr-50 logo of-hide">
                      <img :src="i.logo" v-show="i.logo" class="logo">
                      <img src="~@/assets/icons/insurance-company.png" v-show="!i.logo" class="logo">
                    </div>
                    <p v-text="i.companyName" class="fz16"></p>
                    <van-checkbox :name="i.id" ref="checkboxes"/>
                  </div>
                </div>
              </van-checkbox-group>
              <div class="h50 flex-center justify-sb van-hairline--top">
                <p class="cl-gray ft13 mr10 van-ellipsis">
                  <i class="cl-primary">*</i> 仅支持9座以下的非运营私家车
                </p>
              </div>
            </div>
            <div class="mt10 unList ta-c" v-else>
              <img src="../../assets/images/img_empty_city@3x.png" width="140" height="111">
              <p class="cl-gray mt12">该地区暂未开通服务，去其他地区报 价成功也可出单哦～</p>
            </div>
        </div>
      </div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button
            type="primary"
            block
            round
            :disabled="loading || !checked"
            :loading="loading"
            @click="peopleAccess"
            text="立即投保">
        </van-button>
      </div>
    </div>
    <!-- 地区选择 -->
    <van-popup v-model="isShowSite" position="bottom" :overlay="true">
      <van-area
        :area-list="areaList"
        v-if="areaList"
        :loading="false"
        :height="'180'"
        :columns-num="2"
        title="选择城市"
        @cancel="onCancel"
        @confirm="onConfirm"
        :value="code"
      />
    </van-popup>
  </div>
</template>
<script>
import popupSelect from "@/components/PopupSelect.vue";
import quoteService from "@/api/quoteService";
import { getLocation, WechatRegistrar, wxShare } from "@/lib/wechat";
export default {
  name: "enquiry",
  data() {
    return {
      loading: false,
      isLogin: false,
      checked: true,
      unreadNum: 0,
      areaList: null, //省市json
      maxProductsNum: 3,
      activeArea: [
        { code: "330000", name: "浙江省" },
        { code: "330100", name: "杭州市" }
      ],
      loadingFinish: false,
      product: [],
      products: [],
      area: "",
      isShowSite: false,
      count: 1,
      access: undefined,
    };
  },
  computed: {
    code() {
      if (this.activeArea[1].code) {
        return "" + this.activeArea[1].code;
      } else {
        return "";
      }
    }
  },
  mounted() {
    setPageTitle("询价");
  },
  created() {
    var that = this;

    if (Util.getLocalData("activeArea")) {
      this.activeArea = Util.getLocalData("activeArea");
    }
    // this.getProducts(this.activeArea);
    // 获取可投保城市
    Toast.loading({
      duration: 0,
      forbidClick: false,
      message: "努力加载中.."
    });
    quoteService.area().then(res => {
      Toast.clear();
      if (res.code == 1) {
        that.areaList = res.object;
        if (Util.userAgentType() == "wechat") {
          var btWechat = new WechatRegistrar();
          btWechat
            .setConfig()
            .then(() => {
              setCity();
            })
            .catch(() => {
              this.getProducts(this.activeArea);
            });
        } else {
          setCity();
        }
      }
    });
    // return
    function setCity() {
      getLocation()
        .then(obj => {
          var activeArea = [
            {
              code: obj.provinceCode,
              name: obj.provinceName
            },
            {
              code: obj.cityCode,
              name: obj.cityName
            }
          ];
          let isvalidAddress = false;
          Object.keys(that.areaList.city_list).forEach(function(k, v) {
            if (k == obj.cityCode) {
              isvalidAddress = true;
            }
          });
          if (isvalidAddress) {
            //有效地址
            if (Util.getLocalData("positionArea")) {
              //有历史地址
              if (
                obj.cityCode == Util.getLocalData("positionArea")[1].code ||
                obj.cityCode == Util.getLocalData("activeArea")[1].code
              ) {
                Util.setLocalData("positionArea", activeArea);
                that.getProducts(that.activeArea);
              } else {
                Dialog.confirm({
                  title: "定位到您在 " + obj.cityName,
                  message: "是否切换至该城市？"
                })
                  .then(() => {
                    Util.setLocalData("positionArea", activeArea);
                    Util.setLocalData("activeArea", activeArea);
                    that.activeArea = activeArea;
                    that.getProducts(activeArea);
                  })
                  .catch(() => {
                    Util.setLocalData("positionArea", activeArea);
                    that.getProducts(that.activeArea);
                  });
              }
            } else {
              //无历史地址，首次进入
              Util.setLocalData("positionArea", activeArea);
              Util.setLocalData("activeArea", activeArea);
              that.activeArea = activeArea;
              that.getProducts(activeArea);
            }
          } else {
            //无效地址
            if (Util.getLocalData("activeArea")) {
              //已经有选择过地址，直接用之前选择过的地址
            } else {
              var cityCode = ("" + obj.cityCode).substr(0, 2) + "0100";
              var hasSh = false;
              Object.keys(that.areaList.city_list).forEach(function(k, v) {
                if (k == cityCode) {
                  that.activeArea = [
                    {
                      code: obj.provinceCode,
                      name: obj.provinceName
                    },
                    {
                      code: parseInt(cityCode),
                      name: that.areaList.city_list[cityCode]
                    }
                  ];
                  hasSh = true;
                }
              });
              Util.setLocalData("positionArea", that.activeArea);
              Util.setLocalData("activeArea", that.activeArea);
            }
            that.getProducts(that.activeArea);
          }
        })
        .catch(() => {
          that.getProducts(that.activeArea);
        });
    }
  },
  methods: {
    change(v) {
      if (this.product.length > this.maxProductsNum) {
        this.product.splice(this.maxProductsNum, 1);
        Toast("最多选" + this.maxProductsNum + "个同时报价");
      } else {
        // this.$router.replace({ name: 'quote', query:{
        //     cids:JSON.stringify(this.product),
        //     cityCode:this.activeArea[1].code
        // }});
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    quote() {
      if (this.access === false) {
        Toast("依据相关规定，请申请认证星利代理人后进行操作。");
        return;
      }

      if (!this.product.length) {
        Toast("请选择保险公司");
        return;
      }
      // this.$router.push({ name: 'carPic', query:{
      //     cids:JSON.stringify(this.product),
      //     cityCode:this.activeArea[1].code
      // }});
      btPage.open({
        url: "/quote/car_pic",
        container_style: 1,
        params: {
          cids: JSON.stringify(this.product),
          cityCode: this.activeArea[1].code
        }
      });
    },
    choose(i) {
      this.product = i;
    },
    showSite() {
      this.isShowSite = true;
    },
    onCancel() {
      this.isShowSite = false;
    },
    getProducts(value) {
      this.activeArea = value;
      this.product = [];
      this.loadingFinish = false;
      Toast.loading({
        duration: 0,
        forbidClick: false,
        message: "加载中.."
      });
      let cityCode = this.activeArea[1].code;
      quoteService.orderCompany({ citycode: cityCode }).then(res => {
        Toast.clear();
        this.loadingFinish = true;
        if (res.code == 1) {
          this.products = res.object.companys || [];
          this.maxProductsNum = res.object.selectCount || 1;
        } else if (res.code === 0) {
          Toast(res.message);
          this.products = res.object || [];
        } else {
          Toast(res.message);
        }
      });
    },
    onConfirm(value) {
      this.isShowSite = false;
      if (this.activeArea[1].code == value[1].code) {
        return;
      }
      this.getProducts(value);
      Util.setLocalData("activeArea", value);
    },
    goProtocal() {
      btPage.open({
        url: "/common/agreement",
        container_style: 1,
        params: {
          id: 0
        }
      });
    },
    getNotice() {
      quoteService.noticeInfo().then(res => {
        if (res.code == 1 && res.object) {
          this.unreadNum = res.object.unreadNum;
          if (this.unreadNum) {
            this.setHead(1);
          } else {
            this.setHead();
          }
        }
      });
    },
    setHead(isActive) {
      var self = this;
      this.$store.dispatch("setHead", {
        menuContent: `<div class="menu notice${
          isActive ? "-active" : ""
        }"></div>`,
        needBack: false,
        menuClick: () => {
          btPage.open({
            url: "/notice",
            container_style: 1,
            jsOnResume: () => {
              this.getNotice();
            }
          });
        }
      });
    },
    peopleAccess() { // 是否具备星利代理人资格
      if (!this.product.length) {
        Toast("请选择保险公司");
        return;
      }
      if (this.access !== undefined) {
        this.quote()
        return
      }
      quoteService.peopleAccess()
        .then((res) => {
          if (res.code == 1) {
            this.access = true
            this.quote()
          } else if(res.code == 1000){
            // this.access = false
          } else {
            this.access = false
            Toast(res.message);
          }

        })
    }
  },
  activated() {
    setPageTitle("询价");
  },
  components: {
    popupSelect,
  }
};
</script>
<style lang="less" scope>
.enquiry {
  .bd-left {
    position: relative;
    padding-left: 8px;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      height: 14px;
      width: 3px;
      background-color: #087bf5;
    }
  }
  .bd-gray {
    border: 1px solid #e5e5e5;
  }
  .info-shadow {
    box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.08);
  }
  .compony {
    width: 49%;
    .logo {
      height: 28px;
      width: 28px;
      box-sizing: content-box;
      @media screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) {
        height: 0.3rem;
        width: 0.3rem;
      }
    }
    .fz16 {
      font-size: 16px;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      @media screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) {
        font-size: 0.154rem;
      }
    }
  }
  .unList {
    padding: 14px 60px;
  }
}
</style>

