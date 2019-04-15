<template>
  <!-- 产品列表显示单元 -->
  <div class="life-goods-list-item-wrapper" @click="onClick">
    <div class="content van-hairline--bottom">
      <div class="item-left">
        <img v-lazy="itemData.picUrl">
      </div>
      <div class="item-right">
        <h3 class="company-name">{{ itemData.title }}</h3>
        <p class="main-point" v-for="(item, index) in itemData.mainPointList" :key="index">{{ item }}</p>
        <div class="footer-info">
          <p class="min-price">
            {{ itemData.minPrice | currency2('￥','2') }}<span>起</span>
          </p>
          <p class="rebate-point">推广费{{ itemData.rebatePointContent }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultPic from '@/assets/icons/insurance-company.png'
export default {
  name: 'goodsItem',
  components: {},
  props: {
    itemData: {
      type: Object,
      default() {
        return {
          id: null,
          mainPointList: [],
          minPrice: null,
          name: null,
          picUrl: null,
          rebatePoint: null
        }
      }
    }
  },
  data() {
    return {
      defaultPic
    };
  },
  computed: {},
  methods: {
    onClick() {
      this.$emit('click', this.itemData);
    }
  },
};
</script>

<style scoped lang="less">
  @import "../assets/less/global";
  .life-goods-list-item-wrapper {
    width: 100%;
    background: white;
    padding: 12px 15px 0;

    .content {
      display: flex;
      padding-bottom: 10px;
      .item-left {
        .square(90px);
        flex-grow: 0;
        flex-shrink: 0;
        margin-right: 13px;
        border-radius: 5px;
        overflow: hidden;

        img {
          .wh(100%, 100%);
        }
      }
      .item-right {
        flex-grow: 1;
        flex-shrink: 1;

        .company-name {
          .font(16px, #333, left, 22px, 500);
          margin-bottom: 5px;
        }
        .main-point {
          .font(12px, #999, left, 17px, 400);
        }
        .footer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;

          .min-price {
            .font(18px, #fc6b47, left, 20px);
            letter-spacing: 0px;

            &:first-letter {
              font-size: 14px;
            }
            span {
              font-size: 13px;
            }
          }
          .rebate-point {
            .font(13px, #ff8526, left, 18px);
          }
        }
      }
    }

  }
</style>
