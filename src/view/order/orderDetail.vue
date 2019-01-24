<template>
    <div class="ft16" :style="{'padding-bottom':toolsBtn.type == 0 ? '0px':'70px'}">
        <template v-if="!isLoading">
            <div class="notice-bar plr20 flex-center" v-if="(toolsBtn.type == 4) || (toolsBtn.type == 5)">
                <div v-if="toolsBtn.type == 4" class="flex-center justify-sb w-100">
                    <span>订单状态：{{ dataObject.exceptionType | errorText }}</span>
                    <span>{{ dataObject.exceptionType == 4? '失败':'异常'}}原因：{{ dataObject.feedBack }}</span>
                </div>
                <div v-else class="flex-center justify-sb w-100">
                    <span>保单待支付</span>
                    <span>请在当天24点之前完成支付</span>
                </div>
            </div>
            <!-- 险种名称 总额 -->
            <div class="h100 bg-white ta-c pt16 pb16 mb10">
                <h3 class="fw-n ft16 mb8">{{ dataObject.companyName }}</h3>
                <p class="ft30 cl-orange">{{(dataObject.commercialInsurancePremium+dataObject.compulsoryInsurancePremium+dataObject.vehicleVesselTax) |currency('￥','2')}}</p>
            </div>
            <!-- 商业险 -->
            <div class="bg-white mb10" v-if="commercialInsurance.length">
                <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
                    <p class="ft16 mr10 fw-b">商业险</p>
                    <span class="cl-orange ft14 fw-b">(生效日期：{{ $util.formatDate(dataObject.commercialInsuranceDate, 'yyyy-MM-dd') }})</span>
                </div>
                <div class="van-hairline--bottom">
                    <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
                        <p class="ta-l" style="width: 34%">险种</p>
                        <p style="width: 22%;">保额</p>
                        <p style="width: 22%;">不计免赔</p>
                        <p style="width: 22%;" class="ta-r">保费</p>
                    </div>
                    <div class="ta-c plr12 ft14 flex-center" v-for="(item, index) in commercialInsurance" :key="index">
                        <p class="ta-l pt10 pb10" style="width: 34%">{{ item.insuranceName }}</p>
                        <p style="width: 22%;" class="pt10 pb10">{{ item.coverageText }}</p>
                        <p style="width: 22%;" class="pt10 pb10"><van-icon name="success" color="#FC7453" v-if="item.additionalInsuranceType"/></p>
                        <p style="width: 22%;" class="pt10 pb10 ta-r">{{ item.mainPremium|currency('￥','2')}}</p>
                    </div>
                    <div class="ta-c plr12 ft14 flex-center">
                        <p class="ta-l pt10 pb10" style="width: 34%">不计免赔总计</p>
                        <p style="width: 22%;" class="pt10 pb10"></p>
                        <p style="width: 22%;" class="pt10 pb10"></p>
                        <p style="width: 22%;" class="pt10 pb10 ta-r">{{dataObject.noneDeductiblePremium|currency('￥','2')}}</p>
                    </div>
                    <div class="h60 pt8 plr12 van-hairline--top van-hairline--bottom">
                        <div class="ta-r ft14 mb8 flex-center">
                            <div style="width: 34%" class="fw-b ta-l">
                                <p v-if="dataObject.discountRate">折扣率：<strong class="cl-orange" >{{ dataObject.discountRate|currency2 }}</strong></p>
                            </div>
                            <div style="width: 22%"></div>
                            <div style="width: 22%" class="fw-b cl-orange">合计：</div>
                            <div style="width: 22%" class="ta-r fw-b cl-orange">{{ dataObject.commercialInsurancePremium|currency2('￥','2') }}</div>
                        </div>
                        <div class="ta-l ft12 cl-gray">注：因保险公司承保政策等原因，部分险种不可投保</div>
                    </div>
                </div>
            </div>
        <!-- 交强险 -->
        <div class="bg-white mb10" v-if="strongInsurance.length">
            <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
                <p class="ft16 mr10 fw-b">交强险</p>
                <span class="cl-orange ft14 fw-b">(生效日期：{{ $util.formatDate(dataObject.compulsoryInsuranceDate, 'yyyy-MM-dd') }})</span>
            </div>
            <div class="van-hairline--bottom">
                <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
                    <p class="ta-l" style="width: 34%;">险种</p>
                    <p style="width: 22%;">保额</p>
                    <p style="width: 22%;"></p>
                    <p style="width: 22%;" class="ta-r">保费</p>
                </div>
                <div class="h40 lh40 ta-c plr12 ft14 flex-center" v-for="(item, index) in strongInsurance" :key="index">
                    <p class="ta-l" style="width: 34%;">{{ item.insuranceName }}</p>
                    <p class="cl-orange" style="width: 22%;">{{ item.premium ? '投保' : '未投保' }}</p>
                    <p style="width: 22%;"></p>
                    <p style="width: 22%;" class="ta-r">{{ item.premium | currency('￥','2') }}</p>
                </div>
                <div class="h40 plr12 van-hairline--top van-hairline--bottom">
                    <p class="ta-r lh40 ft14 fw-b cl-orange">合计：{{ (dataObject.compulsoryInsurancePremium + dataObject.vehicleVesselTax) |currency('￥','2') }}</p>
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
        <div class="bg-white mb10">
            <div class="h50 bold_bd_left ft16 flex-center justify-sb pr12 van-hairline--bottom">
                <p class="fw-b">赠品及优惠</p>
            </div>
            <div class="ft14 plr12 pb10 van-hairline--bottom">
                <div class="flex-center mb13 mt10">
                    <img src="../../assets/icons/gift.png" width="20" height="18">
                    <span class="ml10 w50">推广费</span>
                    <span class="cl-orange" v-if="dataObject.rebateEntry">{{ dataObject.rebateEntry|currency2('￥','2') }}</span>
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
        <div class="concat lh30 cl-gray ta-c" v-if="toolsBtn.type == 4">
            <p>如有疑问请联系客服：<span class="cl-orange">400-0909-0909</span>
            </p>
        </div>
        <!-- buttons -->
        <div v-if="toolsBtn.type !== 0"
            class="bg-white plr12 cl-white h70 pos-f b0 l0 r0 van-hairline--top"
            :class="[toolsBtn.type !== 4 ? 'flex-center':'pt10']"
        >
            <van-button
            round
            type="default"
            block
            v-if="toolsBtn.type !== 4 && showShareBtn"
            @click="detailShare"
            :class="['cl-orange', 'ft16','mr10', 'bd-orange', 'flex-1', toolsBtn.type == 5 ? 'p0': '']"
            >分享</van-button>
            <van-button
            round
            type="default"
            block
            v-if="toolsBtn.type == 5"
            @click="changeOrder"
            :class="['cl-orange','ft16', 'mr10','bd-orange', 'flex-1',toolsBtn.type == 5 ? 'p0': '']"
            >更换报价</van-button>
            <van-button
            round
            type="default"
            block
            :class="['cl-white', 'ft16', toolsBtn.light ? 'van-button--primary': 'unLink', 'flex-1',toolsBtn.type == 5 ? 'p0': '', toolsBtn.light? 'events-auto':'events-none']"
            @click="bottomBtnHandler"
            >{{ toolsBtn.text }}</van-button>
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
import { Toast, Dialog } from "vant";
import { nextTick } from "async";
import mobileShare from '@/components/mobileShare/index'

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
      config: {
        sharePhotos: "",
        shareTitle: "",
        shareDesc: "",
        shareUrl: ""
      },
      sharePop: false,
      showShareBtn: true
    };
  },
  methods: {
    gopage(url, query) {
      // this.$router.push({ path: url, query: query });
      btPage.open({
        url: url,
        container_style: 1,
        params: query,
        type: 3,
        jsOnResume: () => {
          if(GConfig.isInApp){
            this.getOrderDetail();
          }

        }
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

        // const BASE_URL = "https://insuranceapixxb.bz-ins.com" // 生产
			  const BASE_URL = "http://wxtest.bz-ins.com"  // 测试

        this.config = {
          sharePhotos: data.object.share.icon,
          shareTitle: data.object.share.title,
          shareUrl: BASE_URL + "/detail_share?id=" + data.object.share.id
        }
        this.strongInsurance = [];
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
    onQuoteStatus() {
      let _this = this;
      if (
        _this.dataObject.handlerStatus != 250 &&
        _this.dataObject.handlerStatus != 350 &&
        _this.dataObject.handlerStatus != 400 &&
        _this.dataObject.handlerStatus != 500
      ) {
        return;
      }
      if (_this.dataObject.handlerStatus === 250) {
        // 报价成功-提交核保
        this.gopage("/order/post_underwritin_or_insure", {
          type: 1,
          id: _this.$route.query.id,
          applicantName: encodeURI(_this.dataObject.applicantName),
          applicantLicenseNo: encodeURI(_this.dataObject.applicantLicenseNo),
          insurantName: encodeURI(_this.dataObject.insurantName),
          insurantLicenseNo: encodeURI(_this.dataObject.insurantLicenseNo)
        });
      }
      if (_this.dataObject.handlerStatus === 350) {
        // 投保
        this.gopage("/order/post_underwritin_or_insure", {
          type: 2,
          id: _this.$route.query.id
        });
      }
      if (_this.dataObject.handlerStatus === 400) {
        // 投保
        this.gopage("/order/post_underwritin_or_insure", {
          type: 2,
          id: _this.$route.query.id
        });
      }
      if (_this.dataObject.handlerStatus === 500) {
        // 支付
        this.gopage("/order/pay_method", {
          id: _this.$route.query.id
        });
      }
    },
    // 提交核保
    underWrite() {
      this.isGoUnderwrite = true;
      Toast.loading({
        mask: true,
        message: "提交核保中..."
      });
      orderService
        .postUnderwrit({ id: this.$route.query.id })
        .then(res => {
          this.isGoUnderwrite = false;
          if (res.code == 1) {
            this.getOrderDetail();
            Toast.clear();
          } else {
            Toast(res.message);
          }
        })
        .catch(rej => {
          console.log(rej.data);
        });
    },
    // 按钮控制器
    bottomBtnHandler() {
      switch (this.toolsBtn.type) {
        case 0:
          return;
        case 1:
          this.underWrite();
        case 2:
          return;
        case 3:
          this.autograph();
        case 4:
          return;
        case 5:
          this.gopage("/order/pay_method", { id: this.$route.query.id });
          break;
        case 6:
          this.gopage("/order/choose_address", {
            id: this.$route.query.id,
            active: 0
          });
          break;
      }
    },
    // 修改报价
    changeOrder() {
      let self = this;
      Dialog.confirm({
        message: "更换报价单将让订单重回报价状态</br>是否确认更换?"
      })
        .then(res => {
          self.postChangeOrder();
        })
        .catch(() => {
          console.log("取消");
        });
    },
    postChangeOrder() {
      let param = { id: this.$route.query.id };
      orderService.orderChange(param).then(res => {
        if (res.code == 1) {
          // this.$router.push({ name: 'quoteDetail', query: { id: this.dataObject.oId }})
          btPage.open({
            url: "/order",
            container_style: 1,
            params: { type: 0 },
            type: 3
          });
        } else {
          Toast(res.message);
        }
      });
    },
    // 提交投保->支付
    autograph() {
      orderService
        .postInsure({
          id: this.$route.query.id
        })
        .then(res => {
          if (res.code == 1) {
            this.gopage("/order/pay_method", { id: this.$route.query.id });
          } else if (res.code == 2) {
            Dialog.confirm({
              message: "该报价已失效, 请重新核保",
              confirmButtonText: "重新核保"
            })
              .then(() => {
                //确认
                this.underWrite(); //重新核保
                this.toolsBtn.text = "核保中"; //变为去核保
                this.toolsBtn.light = false;
                this.toolsBtn.type = 2;
              })
              .catch(() => {
                //取消
              });
          } else {
            Toast(res.message);
          }
        });
    },
    detailShare() {
      this.sharePop = true
    },
    closeShare(data) {
        this.sharePop = data
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
        case 4:
          return "核保失败";
      }
    }
  },
  mounted() {
    setPageTitle("报价单详情");
    this.getOrderDetail();
    this.showShareBtn = GConfig.isInApp
  },
  components: {
    popupSelect,
    mobileShare
  }
};
</script>
<style lang="less" scoped>
.icon_right {
  top: 17px;
  right: 8px;
}
.unLink {
  background: #d8d8d8;
}
.bd-orange {
  border: 1px solid #fc6b47;
}
.flex {
  display: flex;
}
.events-none {
  pointer-events: none;
}
.events-auto {
  pointer-events: auto;
}
</style>


