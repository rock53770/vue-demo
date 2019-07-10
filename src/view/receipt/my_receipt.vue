<template>
  <div class="match-my-receipt-wrapper">
    <div class="search-name-box pos-r">
      <van-search show-action
                  v-model="keyword"
                  background="#ffffff"
                  placeholder="请输入车牌搜索"
                  @search="onSearch"
                  @clear="onClearSearch">
        <div slot="action" v-show="keyword" class="cl-primary" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <van-tabs v-model="active"
              color="#087bf5"
              title-active-color="#087bf5"
              title-inactive-color="#333"
              :line-width="40"
              @change="activeChange">
      <van-tab v-for="(listItem, lIndex) in lists" :key="lIndex" :title="listItem.title">
        <!--<p class="promp">待支付订单客户已确认出单意向，费用变动请及时联系客服</p>-->
        <!--<receipt-item @buttonClick="doReceiptItemEvent"/>-->
        <!--<receipt-item/>-->
        <div class="scroller-view" :class="{'in-app': isInApp, 'is-ios': isIOS}">
          <btScroller :ref="'scroll_box_'+lIndex" :getData="getData" :currentPage.sync="listItem.currentPage">
            <p class="promp" v-if="active === 0">待支付订单客户已确认出单意向，请及时跟进确保出单成功</p>
            <receipt-item v-for="(rItem, rIndex) in listItem.dataList"
                          :key="rIndex"
                          :item-data="rItem"
                          @buttonClick="doReceiptItemEvent"/>
            <div class="no-data-box empty" slot="empty">
              <div class="info"></div>
              <p class="mt20 cl-gray ft16">未找到报价单哦，赶紧去收单吧</p>
            </div>
          </btScroller>
        </div>
      </van-tab>
    </van-tabs>
    <receipt-footer path="my_receipt"/>
  </div>
</template>

<script>
import btScroller from '@/components/btScroller';
import ReceiptItem from "@/components/Match/ReceiptItem";
import ReceiptFooter from '@/components/Match/ReceiptFooter';
import receiptService from '../../api/receiptService';
export default {
  name: 'myReceipt',
  components: { btScroller, ReceiptItem, ReceiptFooter },
  props: {},
  data() {
    return {
      keyword: null,
      isGetDataWidthSearch: false,
      isSearchChange: false,
      active: 0,
      lists: [{
        title: '待处理',
        type: 1,
        currentPage: 1,
        pageSize: 10,
        dataList: []
      },{
        title: '全部收单',
        type: 0,
        currentPage: 1,
        pageSize: 10,
        dataList: []
      }],
      isIOS: new RegExp(/iPhone/ig).test(navigator.userAgent),
      isInApp:GConfig.isInApp,
      // isInApp: true,
    };
  },
  computed: {},
  methods: {
    activeChange() {
      let targetList = this.lists[this.active];
      if (this.isSearchChange) {
        this.isSearchChange = false;
        targetList.currentPage = 1;
        this.$refs['scroll_box_'+this.active][0].triggerRefresh();
      }
    },
    getData() {
      let targetList = this.lists[this.active];
      let sendData = {
        pageIndex: targetList.currentPage,
        pageSize: targetList.pageSize,
        type: targetList.type,
        keyword: this.isGetDataWidthSearch ? this.keyword : null
      };
      let $promise = receiptService.getMyReceiptList(sendData);
      $promise.then(data => {
        if (data.code === 1) {
          if (targetList.currentPage === 1) {
            targetList.dataList = data.object;
          } else {
            targetList.dataList = [
              ...targetList.dataList,
              ...data.object
            ];
          }
        } else {
          Toast(data.message)
        }
      });

      return $promise;
    },
    onSearch() {
      if (this.keyword) {
        this.isGetDataWidthSearch = true;
        // 刷新当前列表
        this.$refs['scroll_box_'+this.active][0].triggerRefresh();
        this.isSearchChange = !this.isSearchChange;
      } else {
        Toast('请输入搜索内容');
      }
    },
    onClearSearch() {
      this.isGetDataWidthSearch = false;
      this.$refs['scroll_box_'+this.active][0].triggerRefresh();
      this.isSearchChange = !this.isSearchChange;
    },
    doReceiptItemEvent(data) {
      switch (data.buttonType) {
        case 0:
          this.goToQupteDetail(data);
          break;
        case 1:
          this.makeSurePaid(data);
          break;
        case 2:
          this.doBilling(data);
          break;
        case 3:
          this.showInvoice(data);
          break;
        case 4:
          this.addInfor(data);
          break;
        case 5:
          this.doPrePay(data);
          break;
        default:
          break;
      }
    },
    // 展示详情
    goToQupteDetail(data) {
      if (data.isShowDetail) {
        btPage.open({
          url: '/receipt/receipt_detail',
          container_style: 1,
          params: {
            id: data.quoteId,
            oid: data.orderId
          },
        });
      }
    },
    // 确认支付
    makeSurePaid(data) {
      Dialog.confirm({
        cancelButtonText: "取消",
        confirmButtonText: "确定出单",
        message: "确认出单佣金将支付给代理人"
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '确认中...',
          duration:0
        });
        receiptService.confirmPay({
          quoteId: data.quoteId
        }).then(data => {
          Toast.clear();
          if (data.code === 1) {
            // 确认保费已支付成功 --> 刷新数据
            Toast.success('成功');
            setTimeout(() => {
              Toast.clear();
              this.$refs['scroll_box_'+this.active][0].triggerRefresh();
            }, 1000);
          } else {
            Toast(data.message);
          }
        })
      }).catch(() => {});
    },
    // 确认出单
    doBilling(data) {
      this.goToQupteDetail(data);
    },
    // 发票
    showInvoice(data) {
      btPage.open({
        url: '/receipt/invoice',
        container_style: 1,
        params: { id: data.quoteId },
      });
    },
    // 补充保单信息
    addInfor(data) {
      btPage.open({
        url: '/receipt/add_info',
        container_style: 1,
        params: { id: data.quoteId },
      });
    },
    doPrePay(data) {
      btPage.open({
        url: '/receipt/payment',
        container_style: 1,
        params: {
          id: data.quoteId,
          oid: data.orderId
        }
      })
    },
  },
  created() {},
  mounted() {
    setPageTitle('车险收单');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-my-receipt-wrapper {
    .search-name-box {
      height: 42px;
      background: #fff;

      /deep/ .van-search {
        padding: 4px 0 4px 15px;
      }
    }
    .promp {
      padding: 7px 12px;
      background: #ffeee3;
      .font(13px, #fc6b47, left, 18px);
    }
    .scroller-view {
      .position2(fixed, top, 86px, left, 0);
      .wh(100%, calc(~'100% - 86px'));

      &.in-app {
        top: 131px;

        &.is-ios {
          top: 151px;
        }
      }
    }
    /deep/ .van-tabs {
      .van-tab {
        .van-ellipsis {
          font-size: 16px;
        }
      }
    }
  }
</style>
