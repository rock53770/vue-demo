<template>
  <div class="receipt-invoice-wrapper">
    <content-box title="增值税专用发票信息">
      <div class="key-val-info">
        <div class="key-val-info-item">
          <span class="desc">公司抬头</span>
          <span class="val">{{ data.invoiceTitle }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">公司税号</span>
          <span class="val">{{ data.invoiceTaxNumber }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">电话号码</span>
          <span class="val">{{ data.invoicePhone }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">单位地址</span>
          <span class="val">{{ data.invoiceAddress }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">开户银行</span>
          <span class="val">{{ data.openingBank }}</span>
        </div>
        <div class="key-val-info-item">
          <span class="desc">银行账号</span>
          <span class="val">{{ data.bankAccount }}</span>
        </div>
      </div>
    </content-box>
    <div class="footer-gap"></div>
    <div class="footer">
      <button @click="goBack">返回</button>
    </div>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import receiptService from '../../api/receiptService';
export default {
  name: 'invoice',
  components: { ContentBox },
  props: {},
  data() {
    return {
      id: null,
      data: {}
    };
  },
  methods: {
    goBack() {
      btPage.goBack();
    },
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getInvoiceDetail({
        quoteId: this.id
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
        } else {
          Toast(data.message);
        }
      })
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.pullData();
  },
  mounted() {
    setPageTitle('发票信息');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .receipt-invoice-wrapper {
    .key-val-info {
      padding: 15px;
      .key-val-info-item {
        display: flex;
        .desc {
          flex-shrink: 0;
          width: 70px;
          .font(14px, #999, right, 20px);
          margin-right: 22px;
        }
        .val{
          .font(14px, #333, left, 20px);
        }
        &:not(:last-child) {
          margin-bottom: 8px;
        }
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
        box-shadow:0 2px 4px 0 rgba(30,124,255,0.3);
        .font-core(16px, white);
      }
    }
  }
</style>
