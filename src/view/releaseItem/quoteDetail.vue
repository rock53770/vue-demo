<template>
  <div class="quoteDetail-wrapper">
    <template v-if="!isLoading">
      <!-- 状态 -->
      <!-- <template v-if="dataSoure.showConfirmPay">
         <div class="quote-status-await">
          <img src="~@/assets/images/life/icon_daizhifu@3x.png" alt width="24">
          <span>二维码更新中</span>
        </div>
      </template>-->
      <template v-if="dataSoure.orderStatusContent">
        <!-- 待支付 、 更新二维码-->
        <div class="quote-status-await">
          <img src="~@/assets/images/life/icon_daizhifu@3x.png" alt width="24">
          <span>{{ dataSoure.orderStatusContent }}</span>
        </div>
      </template>
      <template v-if="dataSoure.commercialPolicyNo || dataSoure.commercialPolicyUrl || dataSoure.compulsoryPolicyNo">
        <!-- 已完成 -->
        <div class="quote-status-over bg-white mb10">
          <div class="info p15">
            <div class="title flex-center">
              <div class="left flex-1 flex-center">
                <img src="~@/assets/icons/team/icon_right@3x.png" width="30">
                <span class="ml10">订单已完成</span>
              </div>
              <div class="right flex-center" @click="call">
                <img src="~@/assets/images/releaseItem/icon_kefu@2x.png" width="20">
                <span class="ml5">联系客服</span>
              </div>
            </div>
            <div class="content mt15">
              <div class="left-word">
                <div v-if="dataSoure.commercialPolicyNo">商业险保单号</div>
                <div v-if="dataSoure.compulsoryPolicyNo">交强险保单号</div>
                <div v-if="dataSoure.commercialPolicyUrl && dataSoure.commercialPolicyUrl.length">保单照片</div>
              </div>
              <div class="flex-1 right-value">
                <div class="word" v-if="dataSoure.commercialPolicyNo">{{ dataSoure.commercialPolicyNo?dataSoure.commercialPolicyNo:'--' }}</div>
                <div class="word" v-if="dataSoure.compulsoryPolicyNo">{{ dataSoure.compulsoryPolicyNo?dataSoure.compulsoryPolicyNo:'--' }}</div>
                <div class="mt10" v-if="dataSoure.commercialPolicyUrl && dataSoure.commercialPolicyUrl.length">
                  <van-swipe class="swipe-img-box" :autoplay="3000">
                    <van-swipe-item @click="pictureView(index,dataSoure.commercialPolicyUrl)" v-for="(image, index) in dataSoure.commercialPolicyUrl" :key="index">
                      <img class="img-box" v-lazy="image" />
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 报价详情 -->
      <div class="quoteDetail">
        <itemHeader :title="'报价详情'">
          <div class="content p15">
            <div class="info">
              <div class="institution">
                <img :src="dataSoure.companyLogoUrl" alt>
                <span>{{ dataSoure.companyName }}</span>
              </div>
              <div class="cost">
                <p class="word">保费确定</p>
                <p class="value">
                  {{ dataSoure.totalPremium|currency('','2') }}
                  <span>元</span>
                </p>
              </div>
              <div class="brokerage">
                <p class="word">
                  <span>佣金</span>
                  <span class="tips">(平台将预先锁定供应商佣金，确保交易成功的佣金发放)</span>
                </p>
                <p class="value">
                  {{ dataSoure.rebateAmount|currency('','2') }}
                  <span>元</span>
                </p>
              </div>
              <div v-if="dataSoure.quoteRemark" class="remark mt11">
                <p class="word">
                  <span>报价备注</span>
                </p>
                <p class="value mt6 ft13 cl-gray">{{ dataSoure.quoteRemark }}</p>
              </div>
            </div>
            <div class="strong">
              <PopIcon></PopIcon>
            </div>
          </div>
        </itemHeader>
      </div>
      <!-- 车险需求明细 -->
      <div v-if="dataSoure.insuranceDetailList" class="carInsuranceList">
        <itemHeader :title="'车险需求明细'">
          <CarInsuranceDemandDetail
            :remark="dataSoure.remark"
            :insurances="dataSoure.insuranceDetailList"
          ></CarInsuranceDemandDetail>
        </itemHeader>
      </div>
      <!-- 报价人信息 -->
      <div class="bidderInformation">
        <itemHeader :title="'报价人信息'">
          <div class="content p15">
            <template v-if="dataSoure.quoteUserName || dataSoure.quoteUserPhone">
              <div class="ft14">
                <span class="word cl-gray">收单人姓名</span>
                <span>{{ dataSoure.quoteUserName }}</span>
              </div>
              <div class="ft14 mt10">
                <span class="word cl-gray">联系电话</span>
                <span>{{ dataSoure.quoteUserPhone }}</span>
              </div>
            </template>
            <template v-else>
              <div class="dot">
                <span></span>
              </div>
              <p class="no-authority">接受报价后双方可互看联系信息</p>
            </template>
          </div>
        </itemHeader>
      </div>
      <!-- 操作按钮 -->
      <div
        v-if="dataSoure.showInsured || dataSoure.showPay || dataSoure.showChangeQuote || dataSoure.showConfirmPay || dataSoure.showAddAddress"
        class="h65"
      >
        <div class="h65 flex-center pos-f b0 bg-white h5 p10 plr5 w-100 zi10">
          <template v-if="dataSoure.showInsured">
            <van-button
              round
              type="primary"
              block
              :class="['flex-1', 'mlr5',{'unclick':unClick}]"
              @click="putItem"
            >{{ unClick?'供应商确定中..':'发起出单' }}</van-button>
          </template>
          <template v-if="dataSoure.showChangeQuote || dataSoure.showPay">
            <van-button
              v-if="dataSoure.showChangeQuote"
              type="primary"
              round
              plain
              :class="['flex-1', 'mlr5']"
              @click="changeItem"
              text="更换报价"
            ></van-button>
            <van-button
              v-if="dataSoure.showPay"
              type="primary"
              round
              block
              :class="['flex-1', 'mlr5']"
              @click="pay"
              text="立即支付"
            ></van-button>
          </template>
          <template v-if="dataSoure.showConfirmPay">
            <van-button
              type="primary"
              round
              block
              :class="['flex-1', 'mlr5']"
              @click="confirmPay"
              text="确认支付"
            ></van-button>
          </template>
          <template v-if="dataSoure.showAddAddress">
            <van-button
              type="primary"
              round
              block
              :class="['flex-1', 'mlr5']"
              @click="selectAddress"
              text="选择取件方式"
            ></van-button>
          </template>
        </div>
      </div>
    </template>
    <!-- animation Loading -->
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
/**
 * $route.query.type { num } 1 未出单 2 已出单，未支付 3已完成  9支付待确定
 *
 */
import releaseItemService from "@/api/releaseItemService.js";
import itemHeader from "@/components/Match/ContentBox";
import CarInsuranceDemandDetail from "@/components/Match/CarInsuranceDemandDetail";
import PopIcon from "@/components/Match/PopIcon";
export default {
  name: "",
  components: {
    PopIcon,
    itemHeader,
    CarInsuranceDemandDetail
  },
  props: {},
  data() {
    return {
      dataSoure: {},
      unClick: false,
      isLoading: true
    };
  },
  watch: {},
  computed: {},
  created() {
    this.init();
  },
  mounted() {
    setPageTitle("需求详情");
  },
  methods: {
    //  联系客服
    call() {
      wv.callUp("0571-28208124");
    },
    async init() {
      // 初始化数据
      this.isLoading = true;
      let params = {
          quoteId: this.$route.query.id
        },
        data;
      data = await releaseItemService.quoteItemDetail(params);
      this.isLoading = false;
      if (data.code !== 1) {
        Toast(res.message);
      } else {
        this.dataSoure = data.object;
      }
    },
    gopage(url, query) {
      btPage.open({
        url: url,
        container_style: 1,
        params: query,
        type: 3,
        jsOnResume: () => {
          // if (GConfig.isInApp) {
          //   this.getOrderDetail();
          // }
        }
      });
    },
    putItem() {
      // Dialog.confirm({
      //   messageAlign: "center",
      //   cancelButtonText: "取消",
      //   confirmButtonText: "确定",
      //   message: "发起出单将锁定出单供应商，请确定"
      // })
      //   .then(() => {
      let params = {
        quoteId: this.$route.query.id
      };
      releaseItemService.putInsurance(params).then(res => {
        if (res.code !== 1) {
          Toast(res.message);
        } else {
          Toast({
            type: "success",
            message: "发起出单成功"
          });
          this.unClick = true;
          setTimeout(() => {
            this.gopage("/order", {
            });
          }, 0);
        }
      });
      // })
      // .catch(() => {});
    },
    changeItem() {
      Dialog.confirm({
        messageAlign: "center",
        cancelButtonText: "取消",
        confirmButtonText: "确定更换",
        message: "更换报价将让订单重回报价状态,是否确定更换？"
      })
        .then(() => {
          let params = {
            quoteId: this.$route.query.id
          };
          releaseItemService.changeInsurance(params).then(res => {
            if (res.code !== 1) {
              Toast(res.message);
            } else {
              Toast("更换报价单成功!");
              this.gopage("/order", {
                quoteId: this.dataSoure.quoteId,
              });
            }
          });
        })
        .catch(() => {});
    },
    pay() {
      this.gopage("/release_item/pay", {
        quoteId: this.dataSoure.quoteId,
        orderId: this.dataSoure.orderId
      });
    },
    confirmPay() {
      // 支付确认
      Dialog.confirm({
        messageAlign: "center",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        message: "发起支付将锁定出单供应商，请确定"
      })
        .then(() => {
          let params = {
            quoteId: this.$route.query.id
          };
          releaseItemService.confirmPay(params).then(res => {
            if (res.code !== 1) {
              Toast(res.message);
            } else {
              Toast({
                type: "success",
                message: "确定成功"
              });
              this.gopage("/release_item/pay", {
                quoteId: this.dataSoure.quoteId,
                orderId: this.dataSoure.orderId
              });
            }
          });
        })
        .catch(() => {});
    },
    // 选择取件方式
    selectAddress(){
      this.gopage("/order/choose_address", {
        id: this.dataSoure.quoteId,
        sourceType: 1
      });
    },

    pictureView(index,arr){
      ImagePreview({
        images: arr,
        startPosition: index,
        onClose() {}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.quoteDetail-wrapper {
  .quote-status-await {
    img,
    span {
      vertical-align: middle;
    }
    height: 55px;
    background: url("~@/assets/images/releaseItem/Group3@2x.png") no-repeat
      center;
    background-size: 100% 55px;
    color: #fff;
    text-align: center;
    line-height: 55px;
    font-size: 18px;
  }
  .quote-status-over {
    .info .title {
      border-bottom: 1px dashed #dddddd;
    }
    .content {
      display: flex;
      .left-word {
        text-align: right;
        min-width: 84px;
        margin-right: 15px;
        line-height: 24px;
      }
      .right-value {
        .img-box,.swipe-img-box {
          display: block;
          height: 90px;
          width: 145px;
          border-radius: 5px;
        }
        .word{
          line-height: 24px;
        }
      }
    }
  }
  .bidderInformation {
    .dot {
      padding: 15px 0 30px;
      text-align: center;
      span {
        display: inline-block;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: #d8d8d8;
        position: relative;
        &::after,
        &::before {
          content: "";
          position: absolute;
          display: inline-block;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background-color: #d8d8d8;
          left: 25px;
        }
        &::before {
          content: "";
          left: -25px;
        }
      }
    }
    .no-authority {
      text-align: center;
      color: #999999;
      font-size: 14px;
    }
    .word {
      display: inline-block;
      width: 70px;
      margin-right: 25px;
      text-align: right;
    }
  }
  .content {
    background: #fff;
    position: relative;
  }
  .quoteDetail {
    .info {
      .institution {
        img {
          height: 36px;
          width: 36px;
          border-radius: 50%;
          vertical-align: middle;
          border: 0.5px solid #dbdbdb;
        }
        span {
          font-weight: 700;
          margin-left: 5px;
          vertical-align: middle;
          font-size: 16px;
          color: #333;
        }
      }
      .cost,
      .brokerage {
        margin-top: 15px;
      }
      .cost .word,
      .brokerage .word {
        font-size: 15px;
        color: #464646;
      }
      .cost .value,
      .brokerage .value {
        height: 30px;
        margin-top: 8px;
        color: #333;
        font-weight: bold;
        font-size: 22px;
        line-height: 30px;
        width: 110px;
        position: relative;
      }
      .cost .value span,
      .brokerage .value span {
        position: absolute;
        left: 110px;
        top: 0;
        font-size: 15px;
        color: #666;
      }
      .brokerage .word .tips {
        font-size: 12px;
        color: #999;
        margin-left: -5px;
      }
    }
    .strong {
      position: absolute;
      top: 19px;
      right: 28px;
    }
  }
}
</style>
