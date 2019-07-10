<template>
  <div class="match-entry-wrapper">
    <header>
      <div class="top-box">
        <header></header>
        <p class="desc-wrap">严选大家帮供应商，报价多， 价格优</p>
        <p>平台提供交易担保，佣金有保障</p>
      </div>
      <div class="entry-box">
        <div class="entry" @click="goToBill">
          <div class="entry-img send"></div>
          <p class="entry-name">我要出单</p>
          <p class="entry-desc">比价出单价更优</p>
        </div>
        <div class="entry" @click="goToReceipt">
          <div class="entry-img receipt"></div>
          <p class="entry-name">我要收单</p>
          <p class="entry-desc">海量用户线索挑选</p>
        </div>
      </div>
    </header>
    <div class="rule-list-box">
      <h3>大家帮交易规则</h3>
      <ul class="rule-list">
        <li>车险大家帮入口发起的报价，将收到平台严选的诚信 供应商提供的多个报价</li>
        <li>可以自由选择其中一个供应商的价格出单</li>
        <li>推荐用户从平台出单，平台将提供交易保障，确保佣 金发放</li>
        <li>线下交易产生的任何纠纷平台概不负责</li>
        <li>退保、批单请及时联系平台，平台将协助处理，确保 交易双方利益</li>
        <li>有任何疑问请及时联系客服，电话：<span class="cl-orange">0571-28208124</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import receiptService from '@/api/receiptService';
export default {
  name: 'entry',
  data() {
    return {
      canReceive: false,
      canSend: false
    };
  },
  methods: {
    getEntryPremission() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getEntryPremission({}).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.canReceive = data.object.canReceive || false;
          this.canSend = data.object.canSend || false;
        } else {
          Toast(data.message);
        }
      })
    },
    goToBill() {
      if (!this.canSend) {
        Toast('您暂时没有相应业务权限，请联系客服开通');
        return;
      }
      btPage.open({
        url: '/release_item/car_pic',
        container_style: 1
      });
    },
    goToReceipt() {
      if (!this.canReceive) {
        Toast('您暂时没有相应业务权限，请联系客服开通');
        return;
      }
      btPage.open({
        url: '/receipt/purchase_list',
        container_style: 1
      });
    }
  },
  mounted() {
    setPageTitle('车险大家帮');
  },
  created() {
    this.getEntryPremission();
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-entry-wrapper {
    background: #fff;
    header {
      height: auto;
      position: relative;

      .top-box {
        .bg-img-set('~@/assets/images/match/img_banner_cuohe_small@2x.png', '~@/assets/images/match/img_banner_cuohe_small@3x.png', 100%, 100%);
        .wh(100%, 190px);
        &:before {
          content: '';
          display: table;
        }

        header {
          .bg-img-set('~@/assets/images/match/banner-wenzi_small@2x.png', '~@/assets/images/match/banner-wenzi_small@3x.png', 100%, 100%);
          .wh(153px, 36px);
          margin: 20px 15px 10px;
        }
        p {
          .font(14px, #fff, left, 20px);
          margin: 0 0 5px 15px;

          &.desc-wrap {
            width: 182px;
          }
        }
      }
      &:after {
        content: '';
        display: block;
        height: 386px;
      }
      .entry-box {
        .wh(3.45rem, 404px);
        background: #fff;
        box-shadow:0 0 10px 0 rgba(255,182,131,0.2);
        border-radius:8px;
        padding-top: 20px;
        .position2(absolute, top, 145px, left, 50%);
        transform: translateX(-50%);

        .entry {
          .wh(190px, 170px);
          margin: 0 auto;
          box-shadow:0px 0px 8px 0px rgba(253,233,225,1);
          border-radius:25px;
          padding-top: 15px;

          &:first-child {
            margin-bottom: 24px;
          }
          .entry-img {
            .wh(140px, 86px);
            margin: 0 auto 8px;

            &.send {
              .bg-img-set('~@/assets/images/match/icon_Send@2x.png', '~@/assets/images/match/icon_Send@3x.png', 100%, 100%);
            }
            &.receipt {
              .bg-img-set('~@/assets/images/match/icon_Self_taking@2x.png', '~@/assets/images/match/icon_Self_taking@3x.png', 100%, 100%);
            }
          }
          .entry-name {
            .font(17px, #087bf5, center, 24px, bold);
            margin-bottom: 4px;
          }
          .entry-desc {
            .font(13px, #666, center, 18px);
          }
        }
      }
    }
    .rule-list-box {
      padding: 0 28px 15px;
      h3 {
        position: relative;
        .font(17px, #464646, center, 24px, bold);
        margin-bottom: 10px;

        &:before, &:after {
          content: '';
          display: block;
          .wh(90px, 1px);
          background: #ccc;
          position: absolute;
          top: 50%;
        }
        &:before {
          left: 0;
        }
        &:after {
          right: 0;
        }
      }
      .rule-list {
        li {
          position: relative;
          padding-left: 15px;
          .font(13px, #777, justify, 18px);
          &:not(:last-child) {
            margin-bottom: 6px;
          }

          &:before {
            content: '';
            display: block;
            .square(5px);
            border-radius: 50%;
            background: #ff9363;
            .position2(absolute, left, 2px, top, 6px);
          }
        }
      }
    }
  }
</style>
