<template>
  <div class="renewal-detail-wrapper">
    <header class="header">
      <p><span>{{ data.userName }}</span> 您好，</p>
      <p>您的 <span>{{ data.productName }}</span><span class="normal-size">保单编号：</span><span>{{ data.policyNo }}</span> 即将到期，敬请续保。</p>
    </header>
    <div class="box">
      <h2>保障方案</h2>
      <div class="protection-plan">
        <div class="plan-item">
          <span class="desc">产品名称</span>
          <div class="val-box">
            <p>{{ data.productName }}</p>
          </div>
        </div>
        <div class="plan-item">
          <span class="desc">已选方案</span>
          <div class="val-box">
            <span v-for="(item, index) in data.selectPlan" :key="index">{{ item }}</span>
          </div>
        </div>
        <div class="plan-item">
          <span class="desc">续保截止时间</span>
          <div class="val-box">
            <p>{{ data.endDate | dataFormat('yyyy-MM-dd hh:mm:ss')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>保障清单</h2>
      <ul class="protection-list">
        <li v-for="(pItem, pIndex) in protectionList" :key="pIndex">
          <span class="desc">{{ pItem.desc }}</span>
          <span class="value">{{ pItem.value }}</span>
        </li>
      </ul>
    </div>
    <div class="box">
      <h2>续保支付信息</h2>
      <ul class="pay-info">
        <li>
          <span class="desc">支付方式</span>
          <span>趸缴</span>
        </li>
        <li>
          <span class="desc">续费价格</span>
          <span class="price">{{data.renewalPrice|currency2('',2)}}元</span>
        </li>
      </ul>
    </div>
    <footer>
      <div class="btn-box">
        <a href="tel:4006038787" class="btn-contact">
          <i class="icon-contact"></i>
          <p>客服</p>
        </a>
        <p class="price">
          {{data.renewalPrice|currency2('',2)}}<span class="unit">元</span>
        </p>
        <button class="btn-insurance" @click="pay">立即投保</button>
      </div>
    </footer>
  </div>
</template>

<script>
import renewalService from '../../api/renewalService';
export default {
  name: 'detail',
  components: {},
  props: {},
  data() {
    return {
      id: null,
      data: {},
      protectionList: [
        { desc: '一般医疗保险金', value: '300万元' },
        { desc: '恶性肿瘤医疗保险金', value: '300万元' },
        { desc: '质子重离子放射治疗', value: '包含' },
        { desc: '院外靶向用药', value: '300万元' },
        { desc: '异地转诊交通服务费', value: '5000元' },
        { desc: '健康管理服务', value: '提供' },
      ]
    };
  },
  computed: {},
  methods: {
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      renewalService.getPolicyDetail({
        insuredId: this.id,
      }).then((data) => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
          this.resetTitle(this.data.productName);
        } else {
          Toast(data.message);
        }
      });
    },
    resetTitle(title) {
      setPageTitle(title);
    },
    pay() {
      Toast.loading({
        mask: true,
        message: '处理中...',
        duration: 0,
      });
      renewalService.doPay({
        userId: this.data.userId,
        policyId: this.id,
        payType: 1, // 趸缴
        payPrice: this.data.renewalPrice
      }).then((data) => {
        Toast.clear();
        if (data.code === 1) {
          // 跳转到收银台
          btPage.open({
            url: '/renewal/payment',
            params: {
              id: this.id
            },
            container_style: 1
          });
        } else {
          Toast(data.message);
        }
      });
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.pullData();
  },
  mounted() {
    setPageTitle('保单详情');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .renewal-detail-wrapper {
    .header {
      height: auto;
      background: url("../../assets/images/gift/bg_yellow@2x.png") no-repeat center center;
      background-size: 100% 100%;
      padding: 10px 15px;

      p {
        .font(14px, #fff, left, 21px);

        span {
          font-size: 15px;
          font-weight: bold;

          &.normal-size {
            font-weight: normal;
          }
        }
        &:first-child {
          margin-bottom: 4px;
        }
        &:last-child {
          text-indent: 30px;
        }
      }
    }
    .box {
      background: #fff;
      margin-bottom: 10px;

      h2 {
        height: 45px;
        .half-border(bottom, #ddd);
        padding-left: 15px;
        .font-core(16px, #464646);
        font-weight: bold;
        display: flex;
        align-items: center;

        &:before {
          content: '';
          .wh(4px, 14px);
          background:rgba(255,133,38,1);
          border-radius:2px;
          margin-right: 8px;
        }
      }
      .protection-plan {
        padding: 15px;

        .plan-item {
          display: flex;
          &:not(:last-child) {
            margin-bottom: 8px;
          }

          .desc {
            width: 84px;
            flex-shrink: 0;
            .font(14px, #999, right, 20px);
            margin-right: 25px;
          }
          .val-box {
            display: flex;
            p {
              .font(14px, #333, left, 20px);
            }
            span {
              height: 20px;
              padding: 0 8px;
              .font(12px, #ff8526, left, 20px);
              margin-right: 10px;
              .half-border(all, #ff8526, 2px);
            }
          }
        }
      }
      .protection-list {
        padding: 0 15px;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 12px;
          height: 40px;

          &:not(:last-child) {
            .half-border(bottom, #ddd);
          }
          .desc {
            .font-core(15px, #333);
          }
          .value {
            .font-core(15px, #666);
          }
        }
      }
      .pay-info {
        padding: 17px 27px 15px;
        li {
          display: flex;
          align-items: center;

          &:not(:last-child) {
            margin-bottom: 21px;
          }
          span {
            .font-core(15px, #333);
          }
          .desc {
            width: 60px;
            flex-shrink: 0;
            margin-right: 33px;
          }
          .price {
            color: #ff5d1b;
          }
        }
      }
    }
    footer {
      .wh(100%, 50px);

      .btn-box {
        .wh(100%, 50px);
        .half-border(top, #e5e5e6);
        .position2(fixed, bottom, 0, left, 0);
        display: flex;

        .btn-contact {
          flex-shrink: 0;
          .wh(60px, 50px);
          .half-border(right, #ddd);
          padding-top: 6px;
          background: #fff;

          .icon-contact {
            display: block;
            .square(24px);
            background: url("../../assets/images/gift/icon_kefu@2x.png") no-repeat center center;
            background-size: contain;
            margin: 0 auto;
          }
          p {
            .font(10px, #ff8526, center, 14px);
          }
        }
        .price {
          flex-grow: 1;
          height: 50px;
          padding-right: 20px;
          .font(22px, #fc6b47, right, 50px, bold);
          background: #fff;

          .unit {
            font-size: 18px;
            font-weight: normal;
          }
        }
        .btn-insurance {
          .wh(150px, 50px);
          @media screen and (max-width: 340px) {
            width: 120px;
          }
          flex-shrink: 0;
          background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
          .font-core(17px, #fff);
        }
      }
    }
  }
</style>
