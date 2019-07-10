<template>
  <div class="match-purchase-list-wrapper" :class="{'in-app': isInApp, 'is-ios': isIOS}">
    <div class="filter-tab flex-center justify-sb">
      <div class="flex-center" @click="isShowSite = true">
        <span class="filter-desc mr8">{{ showCity }}</span>
        <van-icon name="arrow-down" color="#CBCBCB"/>
      </div>
      <popup-radio title="车辆种类"
                   class="flex-center"
                   cancel-text="取消"
                   value-key="value"
                   name-key="content"
                   :cur-column.sync="carType"
                   :columns="carTypeList"
                   @click-item-change="carTypeChange"
      >
        <span class="filter-desc mr8">{{ showCarType }}</span>
        <van-icon name="arrow-down" color="#CBCBCB"/>
      </popup-radio>
      <popup-radio title="使用性质"
                   class="flex-center"
                   cancel-text="取消"
                   value-key="value"
                   name-key="content"
                   :cur-column.sync="userNature"
                   :columns="userNatureList"
                   @click-item-change="userNatureChange"
      >
        <span class="filter-desc mr8">{{ showUseNature }}</span>
        <van-icon name="arrow-down" color="#CBCBCB"/>
      </popup-radio>
    </div>
    <div class="scroll-view">
      <!--<purchase-list-item @showDetail="showDetail"/>-->
      <btScroller :getData="getData" :currentPage.sync="currentPage" ref="scroller">
        <purchase-list-item v-for="(item, index) in purchaseList"
                            :key="index"
                            :item-data="item"
                            @showDetail="showDetail"/>
        <div class="no-data-box empty" slot="empty">
          <div class="info"></div>
          <p class="mt20 cl-gray ft16">未找到报价单哦，赶紧去报价吧</p>
        </div>
      </btScroller>
    </div>

    <!-- 地区选择 -->
    <van-popup v-model="isShowSite" position="bottom" :overlay="true">
      <van-area
        v-if="areaList"
        :area-list="areaList"
        :loading="false"
        :height="'180'"
        :columns-num="2"
        title="选择城市"
        @cancel="isShowSite = false"
        @confirm="onSiteConfirm"
        :value="cityCode"
      />
    </van-popup>

    <receipt-footer path="pruchase_list"/>
  </div>
</template>

<script>
import PurchaseListItem from '@/components/Match/PurchaseListItem';
import ReceiptFooter from '@/components/Match/ReceiptFooter';
import btScroller from '@/components/btScroller';
import PopupRadio from '@/components/PopupRadio.vue';
import quoteService from '@/api/quoteService';
import { getLocation, WechatRegistrar } from '@/lib/wechat';
import receiptService from '../../api/receiptService';
import Area from './../../lib/area.js'

export default {
  name: 'purchaseList',
  components: { PurchaseListItem, ReceiptFooter, btScroller, PopupRadio },
  props: {},
  data() {
    return {
      carType: {
        content: null,
        value: null,
      },
      carTypeList: [],
      userNature: {
        content: null,
        value: null,
      },
      userNatureList: [],
      isShowSite: false,
      areaList: {}, //省市json
      activeArea: [
        // { code: '330000', name: '浙江省' },
        // { code: '330100', name: '杭州市' },
      ],
      currentPage: 1,
      pageIndex: 1,
      pageSize: 10,
      purchaseList: [],
      isIOS: new RegExp(/iPhone/ig).test(navigator.userAgent),
      isInApp:GConfig.isInApp,
      // isInApp: true,
    };
  },
  computed: {
    showCity: function () {
      if (this.activeArea && this.activeArea.length && this.activeArea[1].code) {
        return this.activeArea[1].name;
      } else {
        return '车牌所在城市';
      }
    },
    cityCode: function () {
      if (this.activeArea && this.activeArea.length && this.activeArea[1].code) {
        return '' + this.activeArea[1].code;
      } else {
        return '';
      }
    },
    showCarType: function () {
      if (this.carType && this.carType.content) {
        return this.carType.content;
      }
      return '车辆种类';
    },
    showUseNature: function () {
      if (this.userNature && this.userNature.content) {
        return this.userNature.content;
      }
      return '使用性质';
    }
  },
  methods: {
    // 获取车辆种类和使用性质枚举
    getPremission() {
      receiptService.getPremissionEnum({}).then(data => {
        if (data.code === 1) {
          if (data.object.carType && data.object.carType.length) {
            this.carTypeList = data.object.carType;
            this.carTypeList.unshift({
              content: '不限',
              value: null
            })
          }
          if (data.object.userNature && data.object.userNature.length) {
            this.userNatureList = data.object.userNature;
            this.userNatureList.unshift({
              content: '不限',
              value: null
            })
          }
        } else {
          Toast(data.message);
        }
      });
    },
    getData() {
      let sendData = {
        cityCode: this.cityCode === '100100' ? '' : this.cityCode,
        carType: this.carType.value,
        userNature: this.userNature.value,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
      };
      let $promise = receiptService.getPurchaseList(sendData);
      $promise.then(data => {
        if (data.code == 1) {
          if (this.currentPage === 1) {
            this.purchaseList = data.object;
          } else {
            this.purchaseList = [
              ...this.purchaseList,
              ...data.object,
            ];
          }
        } else {
          Toast(data.message);
        }
      });
      return $promise;
    },
    showDetail(id) {
      btPage.open({
        url: '/receipt/purchase_detail',
        container_style: 1,
        params: { id },
      });
    },
    // 选中城市
    onSiteConfirm(value) {
      this.isShowSite = false;
      if (this.activeArea[1] && this.activeArea[1].code == value[1].code) {
        return;
      }
      this.activeArea = value;
      this.refreshScroller();
    },
    // 刷新列表
    refreshScroller() {
      this.currentPage = 1;
      this.$refs.scroller.triggerRefresh();
    },
    carTypeChange() {
      this.refreshScroller();
    },
    userNatureChange() {
      this.refreshScroller();
    },
  },
  created() {
    Area.province_list['100000'] = '全国';
    Area.city_list['100100'] = '全国';
    this.areaList = Area;
    this.getPremission();
  },
  mounted() {
    setPageTitle('车险收单');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";

  .match-purchase-list-wrapper {
    .filter-tab {
      height: 43px;
      background: white;
      padding: 0 15px;

      .filter-desc {
        .font-core(15px, #333);
      }
    }
    .scroll-view {
      .position2(fixed, top, 43px, left, 0);
      .wh(100%, calc(~'100% - 43px'));

      /deep/ .scroller-box {
        .loading-layer {
          .no-data-text {
            font-size: 13px;
            &:before, &:after {
              background-color: #ddd;
            }
          }
        }
      }
    }

    &.in-app {
      /*.filter-tab {*/
        /*margin-top: 44px;*/
      /*}*/
      .scroll-view {
        top: 87px;
      }

      &.is-ios {
        /*.filter-tab {*/
          /*margin-top: 64px;*/
        /*}*/
        .scroll-view {
          top: 107px;
        }
      }
    }
  }
</style>
