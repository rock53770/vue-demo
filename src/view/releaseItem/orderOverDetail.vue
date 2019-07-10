<template>
  <div class="orderDetail pos-r ft16 of-hide" :style="{'padding-bottom' : showToolsBtn ? '70px':0}">
    <template v-if="!isLoading">
      <div class="address bg-white p12 mb10 ft14">
        <p
          class="mb8"
          v-if="dataObject.isShowLogisticsInfo && dataObject.logisticsInfo.name && dataObject.logisticsInfo.phone"
        >
          <span class="mr10">{{ dataObject.logisticsInfo.name }}</span>
          <span>{{ dataObject.logisticsInfo.phone | phone }}</span>
        </p>
        <p
          class="mb8 cl-gray"
          v-if="dataObject.isShowLogisticsInfo && dataObject.logisticsInfo.type !==3 && dataObject.logisticsInfo.type !== 5"
        >{{ dataObject.logisticsInfo.provinceName }}{{ dataObject.logisticsInfo.cityName }}{{ dataObject.logisticsInfo.countyName }}{{ dataObject.logisticsInfo.address }}</p>
        <p class="mb8 cl-gray" v-else>自取</p>
        <p v-if="dataObject.invoice">发票信息：{{ dataObject.invoice }}</p>
      </div>
      <!-- 险种名称 总额 -->
      <div class="detailTitle bg-white ta-c pt16 pb16 mb10">
        <h3 class="fw-n ft16 mb8 cl-white">{{ dataObject.companyName }}</h3>
        <p
          class="ft30 cl-white"
        >{{(dataObject.commercialInsurancePremium+dataObject.compulsoryInsurancePremium+dataObject.vehicleVesselTax) |currency('￥','2')}}</p>
      </div>
      <div class="bg-white ft16" v-if="orderType">
        <div class="h50 lh50 bold_bd_left pr12 van-hairline--bottom">
          <p class="fw-b">报价客户信息</p>
        </div>
        <div class="info plr12 mb10">
          <div class="lh50 van-hairline--bottom">
            <span class="show-ib w80 mr30" style="letter-spacing: 4px;">客户姓名</span>
            <span class="cl-gray">{{ dataObject.agentUserName }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <span class="show-ib w80 mr30">联系方式</span>
            <div class="cl-gray">
              <a class="cl-primary flex-center" :href="`tel:${dataObject.agentUserPhone}`">
                <span>{{ dataObject.agentUserPhone }}</span>
                <van-icon name="phone-o" color="#087BF5" size="20px" class="ml10"/>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-white mb10 ft"
        v-if="dataObject.commercialPolicyNo || dataObject.compulsoryPolicyNo"
      >
        <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
          <p class="ft16 mr10 fw-b">保单号</p>
        </div>
        <div class="van-hairline--bottom pt12 pb12 ft14">
          <p
            class="plr12 mb10"
            v-if="dataObject.commercialPolicyNo"
          >商业险：{{ dataObject.commercialPolicyNo }}</p>
          <p
            class="plr12"
            v-if="dataObject.compulsoryPolicyNo"
          >交强险：{{ dataObject.compulsoryPolicyNo }}</p>
        </div>
      </div>
      <!-- 商业险 -->
      <div class="bg-white mb10" v-if="commercialInsurance.length">
        <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
          <p class="ft16 mr10 fw-b">商业险</p>
          <span
            class="cl-primary ft14 fw-b"
          >(生效日期：{{ $util.formatDate(dataObject.commercialInsuranceDate, 'yyyy-MM-dd') }})</span>
        </div>
        <div class="van-hairline--bottom">
          <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
            <p class="ta-l" style="width: 34%">险种</p>
            <p style="width: 22%;">保额</p>
            <p style="width: 22%;">不计免赔</p>
            <p style="width: 22%;" class="ta-r">保费</p>
          </div>
          <div
            class="ta-c plr12 ft14 flex-center"
            v-for="(item, index) in commercialInsurance"
            :key="index"
          >
            <p class="ta-l pt10 pb10" style="width: 34%">{{ item.insuranceName }}</p>
            <p style="width: 22%;" class="pt10 pb10">{{ item.coverageText }}</p>
            <p style="width: 22%;" class="pt10 pb10">
              <van-icon name="success" color="#087BF5" v-if="item.additionalInsuranceType"/>
            </p>
            <p style="width: 22%;" class="pt10 pb10 ta-r">{{ item.mainPremium|currency('￥','2')}}</p>
          </div>
          <div class="ta-c plr12 ft14 flex-center">
            <p class="ta-l pt10 pb10" style="width: 34%">不计免赔总计</p>
            <p style="width: 22%;" class="pt10 pb10"></p>
            <p style="width: 22%;" class="pt10 pb10"></p>
            <p
              style="width: 22%;"
              class="pt10 pb10 ta-r"
            >{{ dataObject.noneDeductiblePremium|currency('￥','2') }}</p>
          </div>
          <div class="h60 pt8 plr12 van-hairline--top van-hairline--bottom">
            <div class="ta-r ft14 mb8 flex-center">
              <div style="width: 34%" class="fw-b ta-l">
                <p>
                  折扣率：
                  <strong
                    class="cl-orange"
                    v-if="dataObject.discountRate"
                  >{{ dataObject.discountRate|currency2 }}</strong>
                </p>
              </div>
              <div style="width: 22%"></div>
              <div style="width: 22%" class="fw-b cl-orange">合计：</div>
              <div
                style="width: 22%"
                class="ta-r fw-b cl-orange"
              >{{ dataObject.commercialInsurancePremium|currency2 }}</div>
            </div>
            <div class="ta-l ft12 cl-gray">注：因保险公司承保政策等原因，部分险种不可投保</div>
          </div>
        </div>
      </div>
      <!-- 交强险 -->
      <div class="bg-white mb10" v-if="strongInsurance.length">
        <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
          <p class="ft16 mr10 fw-b">交强险</p>
          <span
            class="cl-primary ft14 fw-b"
          >(生效日期：{{ $util.formatDate(dataObject.compulsoryInsuranceDate, 'yyyy-MM-dd') }})</span>
        </div>
        <div class="van-hairline--bottom">
          <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
            <p class="ta-l" style="width: 34%;">险种</p>
            <p style="width: 22%;">保额</p>
            <p style="width: 22%;"></p>
            <p style="width: 22%;" class="ta-r">保费</p>
          </div>
          <div
            class="h40 lh40 ta-c plr12 ft14 flex-center"
            v-for="(item, index) in strongInsurance"
            :key="index"
          >
            <p class="ta-l" style="width: 34%;">{{ item.insuranceName }}</p>
            <p class="cl-lead" style="width: 22%;">{{ item.premium ? '投保' : '未投保' }}</p>
            <p style="width: 22%;"></p>
            <p style="width: 22%;" class="pt10 pb10 ta-r">{{ item.premium|currency('￥','2')}}</p>
          </div>
          <div class="h40 plr12 van-hairline--top van-hairline--bottom">
            <p
              class="ta-r lh40 ft14 fw-b cl-orange"
            >合计：{{ (dataObject.compulsoryInsurancePremium + dataObject.vehicleVesselTax)|currency('￥','2') }}</p>
          </div>
        </div>
      </div>
      <!-- 备注 -->
      <div class="bg-white mb10" v-if="dataObject.quoteRemark">
        <div class="h50 bold_bd_left ft16 flex-center justify-sb pr12 van-hairline--bottom">
          <p class="fw-b">报价备注</p>
        </div>
        <div class="ft14 pt12 plr12 pb10 van-hairline--bottom">
          <p class="ft14">{{ dataObject.quoteRemark }}</p>
        </div>
      </div>
      <!-- 赠品及优惠 -->
      <div class="bg-white mb10" v-if="dataObject.rebateEntry">
        <div class="h50 bold_bd_left ft16 flex-center justify-sb pr12 van-hairline--bottom">
          <p class="fw-b">赠品及优惠</p>
        </div>
        <div class="ft14 plr12 pb10 van-hairline--bottom">
          <div class="flex-center mb13 mt10">
            <img src="../../assets/icons/gift.png" width="20" height="18">
            <span class="ml10 w50">推广费</span>
            <span class="cl-orange" v-if="dataObject.rebateEntry">{{ dataObject.rebateEntry|currency2('￥',2) }}</span>
          </div>
          <p class="ft12 cl-gray">*赠品及优惠以实际出单为准</p>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="bg-white ft16">
        <div class="h50 lh50 bold_bd_left pr12 van-hairline--bottom">
          <p class="fw-b">车主信息</p>
        </div>
        <div class="info plr12 mb10">
          <div class="lh50 van-hairline--bottom">
            <span class="show-ib w80 mr30" style="letter-spacing: 4px;">姓名</span>
            <span class="cl-gray">{{ carOwner.ownerName }}</span>
          </div>
          <!-- <div class="lh50 van-hairline--bottom">
                        <span class="show-ib w80 mr30">手机号</span>
                        <span class="cl-gray">{{ carOwner.ownerPhone }}</span>
          </div>-->
          <div class="lh50 van-hairline--bottom">
            <span class="show-ib w80 mr30">身份证</span>
            <span class="cl-gray">{{ carOwner.ownerCardId }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="h50 bold_bd_left pr12 flex-center mt10 bg-white ft16">
                <p class="w50 mr50 fw-b">投保地</p>
                <span class="cl-gray">{{ dataObject.insuredProvinceName }} {{ dataObject.insuredCityName }}</span>
      </div>-->
      <!-- <div class="h50 bold_bd_left pr12 flex-center mt10 bg-white ft16">
                <p class="w50 mr50 fw-b">承保地</p>
                <span class="cl-gray">{{ dataObject.acceptInsuredCityName }} {{ dataObject.acceptInsuredProvinceName }}</span>
      </div>-->
      <!-- 车辆信息 -->
      <div class="bg-white mt10 ft16">
        <div class="h50 bold_bd_left pr12 flex-center fw-b van-hairline--bottom">车辆信息</div>
        <div class="info plr12">
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">车牌号码</p>
            <span class="cl-gray">{{ carInfo.plate }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">品牌型号</p>
            <span class="cl-gray">{{ carInfo.brandInfo }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">车辆类型</p>
            <span class="cl-gray">{{ carInfo.carModel }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">车架号</p>
            <span class="cl-gray">{{ carInfo.vin }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">发动机号</p>
            <span class="cl-gray">{{ carInfo.engineNo }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">注册日期</p>
            <span class="cl-gray">{{ $util.formatDate(carInfo.registrationTime, 'yyyy-MM-dd') }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center">
            <p class="w100 mr20">是否过户</p>
            <span class="cl-gray">{{ carInfo.isTransfer ? '是' : '否' }}</span>
          </div>
          <div class="lh50 van-hairline--bottom flex-center" v-if="carInfo.isTransfer">
            <p class="w100 mr20">过户日期</p>
            <span class="cl-gray">{{ $util.formatDate(carInfo.transferDate, 'yyyy-MM-dd') }}</span>
          </div>
          <div class="lh50 flex-center">
            <p class="w100 mr20">是否为按揭车</p>
            <span class="cl-gray">{{ carInfo.isMortgage ? '是': '否' }}</span>
          </div>
        </div>
      </div>
      <!-- 订单完成状态 -->
      <div class="type" style="top: 220px;">
        <img src="../../assets/images/order/suc.png" height="100" width="100">
      </div>

      <!-- buttons -->
      <div
        class="bg-white plr12 ft16 h70 pos-f b0 l0 r0 van-hairline--top flex-center"
        v-show="showToolsBtn"
      >
        <van-button
          round
          type="default"
          @click="detailShare"
          class="mr10 bd-orange flex-1 cl-orange p0"
        >分享</van-button>
        <a class="flex-1 cl-orange bd-orange ta-c h50 bdr25 lh50" href="tel:0571-28208124">联系客服</a>
      </div>

      <van-popup v-model="sharePop" position="bottom" :overlay="true">
        <mobileShare :config="config" v-on:CLOSE_SHARE="closeShare"></mobileShare>
      </van-popup>
    </template>
    <template v-if="isLoading">
      <div class="Gspinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>
<script>
import popupSelect from "@/components/PopupSelect.vue";
import orderService from "@/api/orderService";

import mobileShare from "@/components/mobileShare/index";

export default {
  name: "orderDetail",
  data() {
    return {
      dataObject: {}, // 返回数据
      commercialInsurance: [], //商业险
      strongInsurance: [], //交强险
      isLoading: true,
      carInfo: {}, // 车辆信息
      carOwner: {}, // 信息
      isGoUnderwrite: false,
      toolsBtn: {
        text: "立即支付", // 按钮文案  { 1: '去核保',2: '核保中',3: '立即支付',4: '异常', 5: '立即支付' }
        light: true, // 是否可点击
        type: null // 0:已完成或关闭 1:去核保,2:核保中,3:立即支付,4:异常;5:[更换报价&去支付](未执行付款，返回) 6：保单待寄出
      },
      showToolsBtn: true,
      config: {
        sharePhotos: "",
        shareTitle: "星利保向您发来邀请",
        shareDesc: "极速报价，便捷出单，专属客服，百万代理人放心之选",
        shareUrl: ""
      },
      sharePop: false,
      orderType: this.$route.query.type
    };
  },
  components: {
    mobileShare
  },
  methods: {
    gopage(url, query) {
      // this.$router.push({ path: url, query: query });
      btPage.open({
        url: url,
        container_style: 1,
        params: query
      });
    },
    async getOrderDetail() {
      this.isLoading = true;
      let data = await orderService.getQuoteDetail({
        id: this.$route.query.id
      });

      this.isLoading = false;

      if (data.code != 1) {
        Toast(data.message);
        return;
      } else {
        this.dataObject = data.object;
        this.commercialInsurance = [];
        this.carInfo = data.object.carInfo;
        this.carOwner = data.object.carOwner;
        this.toolsBtn = data.object.toolsBtn;
        this.strongInsurance = [];

        const BASE_URL = window.location.host

        this.config = {
          sharePhotos: data.object.share.icon,
          shareTitle: data.object.share.title,
          shareUrl: "http://" + BASE_URL + "/detail_share?id=" + data.object.share.id
        };
        this.dataObject.quoteInsurances.forEach(element => {
          if (element.insuranceType == 2) {
            // 商业险
            this.commercialInsurance.push(element);
          }
          if (element.insuranceType == 1 || element.insuranceType == 3) {
            // 交强险
            this.strongInsurance.push(element);
          }
        });
      }
    },
    setHead(isActive) {
      var self = this;
      this.$store.dispatch("setHead", {
        menuContent: `<div class="menu"></div>`,
        needBack: true,
        back: () => {
          btPage.open({
            url: "/order",
            params: { type: 2 },
            container_style: 1,
            type: 3
          });
        }
      });
    },
    detailShare() {
      this.sharePop = true;
    },
    closeShare(data) {
      this.sharePop = data;
    }
  },
  filters: {
    errorText(code) {
      switch (code) {
        case 0:
          return "无异常";
        case 1:
          return "报价异常";
        case 2:
          return "核保异常";
        case 3:
          return "出单异常";
      }
    },
    phone(str) {
      return str.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
    }
  },
  mounted() {
    setPageTitle("保单详情");
    this.getOrderDetail();
    this.setHead();

    this.showToolsBtn = GConfig.isInApp;
  }
};
</script>
<style lang="less" scoped>
.detailTitle {
  height: 120px;
  background: url("../../assets/images/order/quote-bg.png") center no-repeat;
  background-size: 100% 120px;
}
.icon_right {
  top: 17px;
  right: 8px;
}
.type {
  position: absolute;
  right: 17px;
  background-color: transparent;
  height: 100px;
  width: 100px;
  border-radius: 50%;
}

.bd-orange {
  border: 1px solid #fc6b47;
}
</style>
