<template>
  <div class="match-purchase-detail-wrapper">
    <content-box>
      <div class="detail-top">
        <div class="flex-center">
          <div class="car-icon"></div>
          <span class="license-plate">{{ data.plate }}</span>
        </div>
        <div class="flex-center" @click="showCarDetail">
          <span class="jump-desc mr8">查看车辆详情信息</span>
          <van-icon name="arrow" color="#CBCBCB"/>
        </div>
      </div>
    </content-box>
    <content-box title="车险需求明细">
      <car-insurance-demand-detail v-if="data.insurances" :insurances="data.insurances"/>
      <div class="billing-note">
        <h3 v-if="data.sendRemark">发单备注</h3>
        <p class="note-content" v-if="data.sendRemark">{{ data.sendRemark }}</p>
        <p class="reference-price" v-if="data.referencePremium">(平台参考报价：{{ data.referencePremium | currency2('￥',2)}})</p>
      </div>
    </content-box>
    <content-box title="报价人信息">
      <div class="biller-info" v-if="data.isShowSendUser">
        <div class="biller-info-item">
          <span class="desc">发单人姓名</span>
          <span class="val">{{ data.sendUserName }}</span>
        </div>
        <div class="biller-info-item">
          <span class="desc">联系电话</span>
          <span class="val">{{ data.sendUserPhone }}</span>
        </div>
      </div>
      <div class="biller-info-hidden" v-else>
        <div class="hide-points">
          <i></i><i></i><i></i>
        </div>
        <p class="hide-desc">接受报价后双方可互看联系信息</p>
      </div>
    </content-box>
    <div class="footer-gap"></div>
    <div class="footer">
      <button @click="doQuote">发起报价</button>
    </div>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import CarInsuranceDemandDetail from "@/components/Match/CarInsuranceDemandDetail";
import receiptService from '../../api/receiptService';
export default {
  name: 'purchaseDetail',
  components: {
    ContentBox,
    CarInsuranceDemandDetail
  },
  data() {
    return {
      id: null,
      data: {}
    };
  },
  computed: {},
  methods: {
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getPurchaseDetail({
        id: this.id
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
        } else {
          Toast(data.message);
        }
      })
    },
    showCarDetail() {
      btPage.open({
        url: '/receipt/car_detail',
        container_style: 1,
        params: { id : this.id }
      })
    },
    doQuote() {
      btPage.open({
        url: '/receipt/quote_detail',
        container_style: 1,
        params: {
          id : this.id,
          type: 1
        }
      })
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.pullData();
  },
  mounted() {
    setPageTitle('需求详情');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-purchase-detail-wrapper {
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
    .biller-info {
      padding: 15px;
      .biller-info-item {
        .desc {
          display: inline-block;
          width: 70px;
          .font(14px, #999, right, 20px);
          margin-right: 21px;
        }
        .val{
          .font(14px, #333, left, 20px);
        }
        &:not(:last-child) {
          margin-bottom: 8px;
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
    .footer-gap {
      height: 65px;
    }
    .footer {
      .wh(100%, 65px);
      padding: 10px;
      background: white;
      .position2(fixed, bottom, 0, left, 0);

      button {
        display: block;
        .wh(100%, 100%);
        border-radius: 23px;
        background:linear-gradient(270deg,rgba(8,123,245,1) 0%,rgba(10,172,246,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(30,124,255,0.3);
        .font-core(16px, white);
      }
    }
  }
</style>
