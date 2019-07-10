<template>
  <div class="match-receipt-item-wrapper" @click="buttonClick(0)">
    <div class="item-top van-hairline--bottom">
      <div class="item-horiz mb8">
        <div class="car-info">
          <div class="car-icon"></div>
          <span class="license-plate">{{ itemData.plate }}</span>
          <span class="location">{{ itemData.cityName }}</span>
        </div>
        <div class="status">{{ itemData.handlerStatusContent }}</div>
      </div>
      <div class="item-horiz mb6">
        <div class="company">{{ itemData.companyName }}</div>
        <div class="total-fee">总保费：{{ itemData.premium | currency2('￥',2)}}</div>
      </div>
      <div class="item-horiz mb3">
        <div class="fee">
          <span class="desc">佣金：</span>
          <span class="val">{{ itemData.rebateAmount | currency2('￥',2)}}</span>
        </div>
      </div>
      <div class="item-horiz pb7">
        <div class="fee">
          <span class="desc">平台服务费：</span>
          <span class="val">{{ itemData.serviceAmount | currency2('￥',2)}}</span>
        </div>
        <div class="total">
          合计:<span class="total-val">{{ itemData.totalAmount | currency2('￥',2)}}</span>
        </div>
      </div>
    </div>
    <div class="item-bottom item-horiz">
      <div class="date">{{ itemData.createTime | dataFormat('MM-dd hh: mm') }}</div>
      <div class="btns">
        <button v-if="itemData.isShowConfirmPay" @click.stop="buttonClick(1)">确认支付</button>
        <button v-if="itemData.isShowConfirmInsured" @click.stop="buttonClick(2)">确认出单</button>
        <button v-if="itemData.isShowInvoice" @click.stop="buttonClick(3)">发票</button>
        <button v-if="itemData.isShowPolicy" @click.stop="buttonClick(4)">补充保单信息</button>
        <button v-if="itemData.isShowPay" @click.stop="buttonClick(5)">预付佣金并发起出单</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReceiptItem',
  components: {},
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    buttonClick(buttonType) {
      this.$emit('buttonClick', {
        buttonType,
        ...this.itemData
      });
    }
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  @blue: #087BF5;
  .match-receipt-item-wrapper {
    margin: 10px 12px;
    background: white;
    box-shadow:0 4px 6px 0 rgba(0,0,0,0.06);
    border-radius:8px;
    padding: 12px 12px 0;

    .item-horiz {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .car-info {
      display: flex;
      align-items: center;
      .car-icon {
        .square(28px);
        border-radius: 50%;
        border:1px solid rgba(219,219,219,1);
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:after {
          content: '';
          .wh(24px, 19px);
          .bg-img-set('~@/assets/images/match/icon_car@2x.png', '~@/assets/images/match/icon_car@3x.png', 100%, 100%);
        }
      }
      .license-plate {
        .font-core(16px, #333);
        margin-right: 10px;
      }
      .location {
        .font-core(14px, #999);
      }
    }
    .status {
      .font-core(14px, @blue);
    }
    .company {
      .font(14px, #333, left, 20px);
    }
    .total-fee {
      .font-core(13px, #666);
    }
    .fee {
      display: flex;
      .desc {
        width: 72px;
        .font(12px, #999, left, 17px);
      }
      .val {
        .font(12px, #666, left, 17px);
      }
    }
    .total {
      .font-core(12px, #3d4244);

      .total-val {
        .font(16px, #fc6b47, left, 17px);
        &:first-letter {
          font-size: 12px;
        }
      }
    }
    .item-bottom {
      padding-top: 6px;
      .date {
        flex-shrink: 0;
        .font-core(12px, #999);
        margin-bottom: 6px;
        margin-right: 5px;
      }
      .btns {
        button {
          padding: 0 12px;
          border: 1px solid @blue;
          border-radius: 14px;
          height: 28px;
          .font-core(13px, @blue);
          background: white;
          margin-bottom: 6px;
        }
      }
    }

  }
</style>
