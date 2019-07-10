<template>
  <div class="receipt-quote-detail-wrapper">
    <content-box>
      <div class="page-top flex-center justify-sb">
        <div class="top-left">
          <h2>{{ showTitle }}</h2>
          <p>{{ showDesc }}</p>
        </div>
        <div class="top-right">
          <pop-icon/>
        </div>
      </div>
    </content-box>
    <content-box>
      <div class="insurance-company van-hairline--bottom">
        <h4>保险公司</h4>
        <div class="choice-box flex-center justify-sb" @click="isShowPicker = true">
          <p class="company">{{ company.companyName }}</p>
          <van-icon name="arrow" color="#CBCBCB"/>
        </div>
      </div>
      <div class="input-box">
        <h4>保费确认</h4>
        <div>
          <div class="input-container van-hairline--bottom">
            <input type="number" v-model="premium">
          </div>
          <span class="unit">元</span>
        </div>
      </div>
      <div class="input-box">
        <h4>佣金</h4>
        <div>
          <div class="input-container van-hairline--bottom">
            <input type="number" v-model="rebateAmount">
          </div>
          <span class="unit">元</span>
        </div>
      </div>
      <div class="note-box">
        <h4>备注</h4>
        <div class="textarea-box">
          <textarea v-model="remark"></textarea>
        </div>
      </div>
    </content-box>
    <div class="footer-gap"></div>
    <div class="footer">
      <button @click="doQuote">发起报价</button>
    </div>
    <van-popup v-model="isShowPicker" position="right">
      <insurance-company-picker :curr-company="company"
                                @selectCompany="selectCompany"
                                @close="isShowPicker = false"/>
    </van-popup>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import PopIcon from "@/components/Match/PopIcon";
import InsuranceCompanyPicker from "@/components/Match/InsuranceCompanyPicker";
import receiptService from '../../api/receiptService';
export default {
  name: 'quoteDetail',
  components: { ContentBox, PopIcon, InsuranceCompanyPicker },
  props: {},
  data() {
    return {
      id: null,
      type: null, // 1: 发起报价 2：修改报价
      company: {
        id: null,
        companyName: ''
      },
      premium: null,
      rebateAmount: null,
      remark: null,
      isShowPicker: false
    };
  },
  computed: {
    showTitle: function () {
      return this.type === 1 ? '上传报价单' : '修改报价';
    },
    showDesc: function () {
      const desc1 = '请确认出单的准确价格和佣金，佣金 为本次交易支付给发单人的准确金额';
      const desc2 = '请确认最终报价，支付后价格不可更改';
      return this.type === 1 ? desc1 : desc2;
    }
  },
  methods: {
    doQuote() {
      if (this.type === 1) {
        this.sendQuoteData();
      } else if (this.type === 2) {
        this.updateQuoteData();
      }
    },
    checkSendData() {
      if (!this.company || !this.company.id) {
        Toast('请选择保险公司');
        return false;
      }
      if (!this.premium) {
        Toast('请输入保费');
        return false;
      }
      if (this.premium < 0) {
        Toast('请输入合理的保费');
        return false;
      }
      if (!this.rebateAmount) {
        Toast('请输入佣金');
        return false;
      }
      if (this.rebateAmount < 0) {
        Toast('请输入合理的佣金');
        return false;
      }
      return true;
    },
    // 发起报价
    sendQuoteData() {
      if (!this.checkSendData()) return;
      Toast.loading({
        mask: true,
        message: '发送中...',
        duration:0
      });
      receiptService.sendQuote({
        orderId: this.id,
        companyId: this.company.id,
        premium: this.premium,
        rebateAmount: this.rebateAmount,
        remark: this.remark
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          Toast.success('发送报价成功');
          setTimeout(() => {
            btPage.open('/receipt/my_receipt');
          }, 1000);
        } else {
          Toast(data.message);
        }
      })
    },
    // 更新报价
    updateQuoteData() {
      if (!this.checkSendData()) return;
      Toast.loading({
        mask: true,
        message: '发送中...',
        duration:0
      });
      receiptService.sendQuote({
        quoteId: this.id,
        companyId: this.company.id,
        premium: this.premium,
        rebateAmount: this.rebateAmount,
        remark: this.remark
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          Toast.success('更新报价成功');
          setTimeout(() => {
            btPage.goBack();
          }, 1000);
        } else {
          Toast(data.message);
        }
      })
    },
    selectCompany(companyData) {
      this.company = companyData;
      this.isShowPicker = false;
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.type = parseInt(this.$route.query.type);
    if (this.type === 2) {
      let data = Util.getLocalData('__p_to_quoteDetail__');
      if (data) {
        this.premium = data.premium;
        this.rebateAmount = data.rebateAmount;
        this.remark = data.remark;
        this.company.id = data.companyId;
        this.company.companyName = data.companyName;
      }
    }
  },
  mounted() {
    const title = this.type === 1 ? '发起报价' : '修改报价';
    setPageTitle(title);
  },
  beforeDestroy() {
    this.type === 2 && Util.removeLocalData('__p_to_quoteDetail__');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .receipt-quote-detail-wrapper {
    .page-top {
      background-color: #fff;
      padding: 14px 8px 5px 15px;

      .top-left {
        h2 {
          .font(20px, #333, left, 28px, bold);
          margin-bottom: 8px;
        }
        p {
          width: 208px;
          .font(13px, #999, justify, 20px);

          @media screen and (max-width: 340px) {
            width: 180px;
          }
        }
      }
    }
    .insurance-company {
      h4 {
        .font(16px, #464646, left, 22px, bold);
        padding: 13px 15px 6px;
      }
      .choice-box {
        padding: 15px;
        height: 50px;

        .company {
          .font(15px, #666, left, 21px);
        }
      }
    }
    .input-box {
      h4 {
        padding: 20px 15px 15px;
        .font(16px, #464646, left, 22px, bold);
      }
      >div {
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .input-container {
          flex-grow: 1;
          height: 50px;

          input {
            .font(26px, #333, left, 50px, bold);
            width: 100%;
          }
        }
        .unit {
          flex-grow: 0;
          flex-shrink: 0;
          .font-core(16px, #666);
          margin-left: 12px;
        }
      }
    }
    .note-box {
      &:after {
        content: '';
        display: table;
      }
      h4 {
        .font(16px, #333, left, 22px, bold);
        padding: 20px 15px 10px;
      }
      .textarea-box {
        height: 100px;
        margin: 0 15px 15px;
        .half-border(all, #ddd, 5px);
        padding: 10px;

        textarea {
          .wh(100%, 100%);
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
