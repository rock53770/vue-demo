<template>
  <div class="match-pop-icon-wrapper">
    <div class="img" @click="togglePop"></div>
    <van-popup v-model="show" position="bottom" :close-on-click-overlay="false">
      <div class="insurance-desc-box">
        <h2 class="van-hairline--bottom">服务保障</h2>
        <div class="desc-detail van-hairline--bottom">
          <div class="desc">
            <i class="icon blue"></i>
            <p>佣金保障：通过线上平台交易成功，平台将保障 佣金发放</p>
          </div>
          <div class="desc">
            <i class="icon orange"></i>
            <p>退保保障：客户退保，平台将协助追回佣金</p>
          </div>
          <p class="note">* 线下交易产生的一切纠纷，平台概不负责</p>
        </div>
        <div class="btn-box">
          <button @click="show = false">确认</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'popIcon',
  components: {},
  props: {
    showPop: { // 是否可以弹出保障详情
      type: Boolean,
      default: function () {
        return true;
      }
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    togglePop() {
      if (this.showPop) {
        this.show = !this.show;
      }
    }
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-pop-icon-wrapper {
    .img {
      .wh(108px, 107px);
      .bg-img-set('~@/assets/images/match/icon_baoxian@2x.png', '~@/assets/images/match/icon_baoxian@3x.png', 100%, 100%);
    }
    .insurance-desc-box {
      background: #fff;

      h2 {
        .font(18px, #464646, center, 46px, bold);
      }
      .desc-detail {
        padding: 15px 15px 19px;

        .desc {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          .icon {
            .wh(26px, 30px);
            margin-right: 11px;
            flex-shrink: 0;

            &.blue {
              .bg-img-set('~@/assets/images/match/icon_yongjin@2x.png', '~@/assets/images/match/icon_yongjin@3x.png', 100%, 100%);
            }
            &.orange {
              .bg-img-set('~@/assets/images/match/icon_tuibao@2x.png', '~@/assets/images/match/icon_tuibao@3x.png', 100%, 100%);
            }
          }
          p {
            .font(14px, #464646, justify, 20px);
          }
        }
        .note {
          padding-top: 6px;
          .font(12px, #999, left, 17px);
        }
      }
      .btn-box {
        padding: 10px;

        button {
          .wh(100%, 45px);
          background:linear-gradient(270deg,rgba(8,123,245,1) 0%,rgba(10,172,246,1) 100%);
          box-shadow:0 2px 4px 0 rgba(30,124,255,0.3);
          border-radius:23px;
          .font-core(16px, #fff);
        }
      }
    }
  }
</style>
