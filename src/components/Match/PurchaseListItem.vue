<template>
  <div class="match-purchase-item-wrapper">
    <div class="item-top mb5">
      <div class="car-info">
        <div class="car-icon"></div>
        <span class="license-plate">{{ itemData.plate }}</span>
        <span class="location">{{ itemData.cityName }}</span>
      </div>
      <div class="date">
       {{ itemData.createTime | dataFormat('MM-dd hh:mm') }}
      </div>
    </div>
    <div class="item-bottom">
      <div class="tags">
        <span v-for="(item, index) in itemData.tags" :key="index">{{ item }}</span>
      </div>
      <button class="btn-detail" @click="showDetail">查看详情</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseListItem',
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
  methods: {
    showDetail() {
      this.$emit('showDetail', this.itemData.id);
    }
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-purchase-item-wrapper {
    margin: 10px 12px;
    background: white;
    box-shadow:0 4px 6px 0 rgba(0,0,0,0.06);
    border-radius:5px;
    padding: 14px 12px 12px;

    .item-top, .item-bottom {
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
    .date {
      .font-core(12px, #999);
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      span {
        display: flex;
        align-items: center;
        height:18px;
        border-radius:2px;
        padding: 0 5px;
        margin: 2px 5px 2px 0;
        .font-core(12px, #ff8526);
        .half-border(all, #ff8526, 2px);
      }
    }
    .btn-detail {
      flex-grow: 0;
      flex-shrink: 0;
      .wh(75px, 28px);
      background: white;
      .font-core(13px, #087bf5);
      border-radius:14px;
      border:1px solid #087bf5;
    }
  }
</style>
