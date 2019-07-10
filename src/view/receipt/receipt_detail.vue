<template>
  <div class="receipt-detail-wrapper">
    <header class="header" v-if="isShowStatusHeader">
      <p class="prompt" v-if="data.handlerStatus === 510">客户确认已支付保费，请确认出单信息，如有异议请联系客服</p>
      <p class="prompt" v-if="data.handlerStatus === 500 && data.qrCode && data.qrCode.isShowModify">
        客户发起更新二维码的请求，如过期请更新二维码！
      </p>
      <p class="prompt" v-if="data.handlerStatus === 410">
        等待客户支付保费，如客户长时间未支付，请联系客服
      </p>
      <div class="status-box">
        <p class="statu-detail">
          <i class="statu-icon"
             :class="{
              'right': [410, 500].includes(data.handlerStatus),
              'daichudan': data.handlerStatus===510,
              'success': [520, 600, 610].includes(data.handlerStatus)}"></i>
          {{ data.handlerStatusContent }}
        </p>
        <ul class="content handlerStatus-detail" v-if="data.quote">
          <li class="pay">
            <span class="label">支付金额</span>
            <span class="val">{{ data.quote.totalAmount | currency2('', 2) }}元</span>
          </li>
          <li class="promotion">
            <span class="label">佣金</span>
            <span class="val">{{ data.quote.rebateAmount | currency2('', 2) }}元</span>
          </li>
          <li class="server-fee">
            <span class="label">服务费</span>
            <span class="val">{{ data.quote.serviceAmount | currency2('', 2) }}元</span>
          </li>
        </ul>
      </div>
    </header>
    <content-box v-if="!isShowStatusHeader">
      <div class="detail-top">
        <div class="flex-center">
          <div class="car-icon"></div>
          <span class="license-plate" v-if="data.car">{{ data.car.plate }}</span>
        </div>
        <div class="flex-center" @click="showCarDetail">
          <span class="jump-desc mr8">查看车辆详情信息</span>
          <van-icon name="arrow" color="#CBCBCB"/>
        </div>
      </div>
    </content-box>
    <content-box title="保单支付二维码"
                 title-desc="上传客户支付保费的二维码"
                 v-if="isShowQRContent && data.qrCode">
      <div class="qrcode-box">
        <img-upload add-desc="添加照片"
                    :is-allow-add="data.qrCode.isShowAdd"
                    :is-allow-delete="data.qrCode.isShowAdd"
                    :is-allow-preview="true"
                    :max="2"
                    v-model="picList"/>
        <!--<div v-else>-->
          <!--<img-updata-single v-for="(imgData, index) in picList"-->
                             <!--add-desc="更新二维码"-->
                             <!--:key="index"-->
                             <!--:pic="imgData"-->
                             <!--:index="index"-->
                             <!--@img-update="imgUpdate"-->
                             <!--:disable="!data.qrCode.isShowModify"/>-->
        <!--</div>-->
      </div>
    </content-box>
    <content-box title="保单寄送"
                 v-if="isShowDeliveryContent && data.logistics">
      <div class="key-val-info policy-delivery">
        <div class="key-val-info-item" v-if="!data.logistics.pickupType">
          <span class="desc">收件人</span>
          <span class="val">
            <span class="val-item" v-if="data.logistics.recipientName">{{ data.logistics.recipientName }}</span>
            <span class="val-item">{{ data.logistics.recipientPhone }}</span>
          </span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">配送地址</span>
          <span class="val" v-if="!data.logistics.pickupType">
            <span class="val-item" v-if="data.logistics.provinceName">{{ data.logistics.provinceName }}</span>
            <span class="val-item" v-if="data.logistics.cityName">{{ data.logistics.cityName }}</span>
            <span class="val-item" v-if="data.logistics.countyName">{{ data.logistics.countyName }}</span>
            <span class="val-item" v-if="data.logistics.address">{{ data.logistics.address }}</span>
          </span>
          <span class="val" v-else>
            <span class="val-item">自取</span>
          </span>
        </div>
      </div>
    </content-box>
    <content-box title="我的出价" v-if="data.quote">
      <div class="key-val-info my-bid">
        <div class="key-val-info-item">
          <span class="desc">保险公司</span>
          <span class="val">{{ data.quote.companyName }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">总保费</span>
          <span class="val">{{ data.quote.premium | currency2('￥',2)}}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">佣金</span>
          <span class="val cl-orange">{{ data.quote.rebateAmount | currency2('￥',2)}}</span>
        </div>
        <div class="key-val-info-item" v-if="data.quote.remark">
          <span class="desc">收单备注</span>
          <span class="val">{{ data.quote.remark }}</span>
        </div>
      </div>
    </content-box>
    <content-box v-if="isShowStatusHeader">
      <div class="detail-top">
        <div class="flex-center">
          <div class="car-icon"></div>
          <span class="license-plate" v-if="data.car">{{ data.car.plate }}</span>
        </div>
        <div class="flex-center" @click="showCarDetail">
          <span class="jump-desc mr8">查看车辆详情信息</span>
          <van-icon name="arrow" color="#CBCBCB"/>
        </div>
      </div>
    </content-box>
    <content-box title="发单人信息" v-if="data.sendUser">
      <div class="key-val-info" v-if="data.sendUser.isShowSendUser">
        <div class="key-val-info-item">
          <span class="desc">发单人姓名</span>
          <span class="val">{{ data.sendUser.sendUserName }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">联系电话</span>
          <span class="val">{{ data.sendUser.sendUserPhone }}</span>
        </div>
      </div>
      <div class="biller-info-hidden" v-else>
        <div class="hide-points">
          <i></i><i></i><i></i>
        </div>
        <p class="hide-desc">接受报价后双方可互看联系信息</p>
      </div>
    </content-box>
    <content-box title="车险需求明细">
      <car-insurance-demand-detail v-if="data.insurances"
                                   :insurances="data.insurances"
                                   :commercial-start-time="data.commercialStartTime "
                                   :compulsory-start-time="data.compulsoryStartTime"/>
      <div class="billing-note">
        <h3 v-if="data.sendRemark">发单备注</h3>
        <p class="note-content" v-if="data.sendRemark">{{ data.sendRemark }}</p>
        <p class="reference-price" v-if="data.referencePremium">(平台参考报价：{{ data.referencePremium | currency2('￥',2)}})</p>
      </div>
    </content-box>
    <div class="footer-gap"></div>
    <div class="footer">
      <button class="disable" v-if="data.handlerStatus === 300">发单人确认中...</button>
      <button class="normal" v-if="data.isShowModifyQuote" @click="changeQuote">修改报价</button>
      <button class="blue" v-if="data.isShowPay" @click="doPay">预付佣金并发起出单</button>
      <button class="normal" v-if="data.isShowUpdateQrCode" @click="updateQR">更新支付二维码</button>
      <button class="normal" v-if="[410, 500, 520, 600, 610].includes(data.handlerStatus)" @click="contactService">联系客服</button>
      <button class="normal" v-if="data.handlerStatus === 510" @click="contactService">未支付联系客服</button>
      <button class="blue" v-if="data.isShowConfirmPremiumPayed" @click="makeSurePaid">确认保费已支付</button>
    </div>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import CarInsuranceDemandDetail from "@/components/Match/CarInsuranceDemandDetail";
import ImgUpload from "@/components/Match/ImgUpload";
import ImgUpdataSingle from "@/components/Match/ImgUpdateSingle";
import receiptService from '../../api/receiptService';

/**
 * handlerStatus 状态代码
 * 0：默认 200：报价中 300：报价完成 400：待出单 405：出单中 410：佣金已支付 500：保费待支付
 * 510：保费支付待确认 520：保费已支付 600：保单待寄出 610：保单已寄出 -1：保单关闭
 */
export default {
  name: 'purchaseDetail',
  components: {
    ContentBox,
    CarInsuranceDemandDetail,
    ImgUpload,
    ImgUpdataSingle
  },
  data() {
    return {
      id: null,
      orderId: null,
      data: {},
      picList: [
        // {
        //   content: 'imgurl',
        //   file: File,
        //   percent: 0,
        //   result: {
        //     id: 'imgId',
        //     viewPath: 'imgUrl'
        //   },
        //   status: 2
        // }
      ]
    };
  },
  computed: {
    isShowStatusHeader: function () {
      return [410, 500, 510, 520, 600, 610].includes(this.data.handlerStatus);
    },
    isShowQRContent: function () {
      return [400, 410, 500, 510].includes(this.data.handlerStatus);
    },
    isShowDeliveryContent: function () {
      return [520, 600, 610].includes(this.data.handlerStatus);
    }
  },
  methods: {
    // 获取用于上传的图片id数组
    getPicIds() {
      let fileIds = [];
      this.picList.forEach(item => {
        if (item.result && item.result.id) {
          fileIds.push(item.result.id);
        } else {
          return {
            code: 0,
            msg: '请确保照片都已成功上传'
          };
        }
      });

      return {
        code: 1,
        fileIds
      };
    },
    uploadQrCode(callBack) {
      let oPics = this.getPicIds();
      let fileIds = [];
      if (oPics.code === 0) {
        Toast(oPics.msg);
        return;
      } else {
        fileIds = oPics.fileIds
      }

      Toast.loading({
        mask: true,
        message: '二维码上传中...',
        duration:0
      });
      receiptService.uploadQrCode({
        quoteId: this.id,
        fileIds: fileIds
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          Toast.success('二维码上传成功');
          callBack && setTimeout(() => {
            callBack();
          }, 1000);
        } else {
          Toast(data.message);
        }
      })
    },
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getReceiptDetail({
        quoteId: this.id
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
          this.initPicList();
          this.setTitle();
        } else {
          Toast(data.message);
        }
      })
    },
    initPicList() {
      this.picList = [];
      if (this.data.qrCode && this.data.qrCode.qrCodeList && this.data.qrCode.qrCodeList.length) {
        let list = [];
        this.data.qrCode.qrCodeList.forEach(item => {
          list.push({
            content: item.fileUrl,
            percent: 0,
            result: {
              id: item.fileId,
              viewPath: item.fileUrl
            },
            status: 2
          })
        });
        this.picList = list;
      }
      // this.isPicListInit = true;
    },
    showCarDetail() {
      btPage.open({
        url: '/receipt/car_detail',
        container_style: 1,
        params: { id : this.orderId }
      })
    },
    changeQuote() {
      Util.setLocalData('__p_to_quoteDetail__', this.data.quote);
      btPage.open({
        url: '/receipt/quote_detail',
        container_style: 1,
        params: {
          id : this.data.quote.quoteId,
          type: 2
        }
      })
    },
    doPay() {
      if (this.picList && this.picList.length) {
        this.uploadQrCode(() => {
          btPage.open({
            url: '/receipt/payment',
            container_style: 1,
            params: {
              id : this.data.quote.quoteId,
              oid: this.orderId
            }
          })
        });
      } else {
        Toast('请上传保费支付二维码');
      }
    },
    updateQR() {
      this.uploadQrCode(() => {
        this.pullData();
      });
    },
    contactService() {
      wv.callUp(this.data.customerServiceNumber);
    },
    makeSurePaid() {
      Dialog.confirm({
        cancelButtonText: "取消",
        confirmButtonText: "确定出单",
        message: "确认出单佣金将支付给代理人"
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '确认中...',
          duration:0
        });
        receiptService.confirmPay({
          quoteId: this.id
        }).then(data => {
          Toast.clear();
          if (data.code === 1) {
            // 确认保费已支付成功 --> 刷新数据
            Toast.success('成功');
            setTimeout(() => {
              this.pullData();
            }, 1000);
          } else {
            Toast(data.message);
          }
        })
      }).catch(() => {});
    },
    setTitle() {
      if ([300, 400].includes(this.data.handlerStatus)) {
        setPageTitle('报价单详情');
      } else if ([410, 500].includes(this.data.handlerStatus)) {
        setPageTitle('订单详情');
      } else if ([520, 600, 610].includes(this.data.handlerStatus)) {
        setPageTitle('确认出单');
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.orderId = this.$route.query.oid;
    this.pullData();
  },
  mounted() {
    setPageTitle('报价单详情');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .receipt-detail-wrapper {
    .header {
      height: auto;
      .prompt {
        padding: 7px 12px;
        .font(13px, #fc6b47, justify, 18px);
        background: #ffeee3;
      }
      .status-box {
        .wh(100%, 103px);
        background: url('../../assets/images/releaseItem/Group3@2x.png') no-repeat center center;
        background-size: 100% 100%;
        margin-bottom: 55px;
        position: relative;
        padding-top: 17px;

        .statu-detail {
          .font(18px, white, center, 25px, 500);
          display: flex;
          justify-content: center;
          align-items: center;

          .statu-icon {
            /*display: inline-block;*/
            .square(24px);
            /*vertical-align: bottom;*/
            margin-right: 10px;

            &.right {
              .bg-img-set('~@/assets/images/life/icon_right@2x.png', '~@/assets/images/life/icon_right@3x.png', 100%, 100%);
            }
            &.daichudan {
              .bg-img-set('~@/assets/images/life/icon_daichudan@2x.png', '~@/assets/images/life/icon_daichudan@3x.png', 100%, 100%);
            }
            &.success {
              .bg-img-set('~@/assets/images/life/icon_success@2x.png', '~@/assets/images/life/icon_success@3x.png', 100%, 100%);
            }
          }
        }
        .content {
          //.wh(3.45rem, 80px);
          width: 3.45rem;
          background: white;
          border-radius: 5px;
          box-shadow:0 2px 6px 0 rgba(0,0,0,0.06);
          .position2(absolute, top, 57px, left, 50%);
          transform: translateX(-50%);
        }
        .handlerStatus-detail {
          /*height: 90px;*/
          padding: 10px 15px;

          &.l-label {
            li {
              .label {
                width: 90px;
              }
            }
          }
          li {
            display: flex;
            align-items: center;

            .label {
              width: 64px;
              flex-grow: 0;
              margin-right: 16px;
            }
            .val {
              flex-grow: 1;
            }
            &.pay {
              margin-bottom: 4px;
              .label {
                .font(16px, #333, right, 22px);
              }
              .val {
                .font(20px, #fc6b47, left, 28px);
              }
            }
            &.promotion {
              margin-bottom: 6px;
              .label {
                .font(12px, #666, right, 17px);
              }
              .val {
                .font(13px, #ff8526, left, 18px);
              }
            }
            &.server-fee {
              .label {
                .font(12px, #999, right, 15px);
              }
              .val {
                .font(12px, #999, left, 15px);
              }
            }
          }
        }
      }
    }
    .qrcode-box {
      padding: 12px 15px 0;
    }
    .detail-top {
      display: flex;
      height: 58px;
      padding: 0 15px;
      align-items: stretch;
      justify-content: space-between;

      .car-icon {
        .wh(47px, 34px);
        .bg-img-set('~@/assets/images/match/download@2x.png', '~@/assets/images/match/download@3x.png', 100%, 100%);
        margin-right: 12px;
      }
      .license-plate {
        .font-core(17px, #333);
      }
      .jump-desc {
        .font-core(14px, #666);
      }
    }
    .key-val-info {
      padding: 15px;
      .key-val-info-item {
        display: flex;
        .desc {
          flex-shrink: 0;
          width: 70px;
          .font(14px, #999, right, 20px);
          margin-right: 25px;
        }
        .val{
          .font(14px, #333, left, 20px);
        }
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
      &.my-bid, &.policy-delivery {
        .key-val-info-item {
          .desc {
            width: 56px;
            margin-right: 40px;
          }
        }
      }
      &.policy-delivery {
        .val-item {
          &:not(:last-child) {
            margin-right: 15px;
          }
        }
      }
    }
    .biller-info-hidden {
      .hide-points {
        text-align: center;
        padding: 34px 0 30px;
        i {
          display: inline-block;
          .square(14px);
          border-radius: 50%;
          background: #d8d8d8;
          &:not(:last-child) {
            margin-right: 25px;
          }
        }
      }
      .hide-desc {
        .font(14px, #999, center, 20px);
        padding-bottom: 15px;
      }
    }
    .billing-note {
      padding: 11px 15px 15px;

      h3 {
        .font(15px, #333, left, 21px, bold);
        margin-bottom: 8px;
      }
      .note-content {
        .font(15px, #666, justify, 21px);
      }
      .reference-price {
        margin-top: 12px;
        .font(16px, #fc6b47, left, 22px);
      }
    }
    .footer-gap {
      height: 65px;
    }
    .footer {
      .wh(100%, 65px);
      padding: 10px;
      background: white;
      .position2(fixed, bottom, 0, left, 0);
      display: flex;

      button {
        flex-grow: 1;
        display: block;
        /*max-width: 170px;*/
        height: 100%;
        border-radius: 25px;
        font-size: 16px;

        @media screen and (max-width: 340px) {
          max-width: 144px;
        }
        &.normal {
          border:1px solid rgba(8,123,245,1);
          background: #fff;
          color: #087bf5;
        }
        &.blue {
          background:linear-gradient(270deg,rgba(8,123,245,1) 0%,rgba(10,172,246,1) 100%);
          box-shadow:0 2px 4px 0 rgba(30,124,255,0.3);
          color: #fff;
        }
        &.disable {
          background:rgba(216,216,216,1);
          box-shadow:0 2px 4px 0 rgba(211,211,211,0.3);
          color: #fff;
        }
        &:not(:last-child) {
          margin-right: 12px;
        }
        &:only-child {
          max-width: 100%;
        }
      }
    }
  }
</style>
