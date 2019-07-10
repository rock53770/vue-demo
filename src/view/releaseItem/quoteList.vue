<template>
  <div class="quoteDetail">
    <template v-if="!isLoading">
      <div class="notice-bar plr20 flex-center justify-sb">
        <span>标黄险种为已选不计免赔</span>
        <span @click="call">联系客服</span>
      </div>
      <div class="bg-white" style="padding:0 7px 0 12px">
        <div
          class="h65 flex-center arrow-block-right"
          @click="gopage('/order/car_detail',{id:dataObject.orderId,type:2})"
        >
          <img src="../../assets/icons/car-icon.png" width="50" class="mr15">
          <div class="ft14 lh22">
            <p>{{ hasUserCarMsg ? dataObject.ownerName : '暂无车牌信息' }}</p>
            <p class="cl-dgray">{{ hasUserCarMsg ? dataObject.plate : '暂未获取到车型信息' }}</p>
          </div>
        </div>
      </div>
      <div class="lists wh-100 plr12 pt10 outer-over">
        <div
          class="bg-white mt10 pt12 bdr3 outer-shadow item-box"
          v-for="(item, index) in dataObject.quoteInfoList"
          :key="index"
          @click="goOrderDetail(item, item.showInsured?1:item.showPay?2:item.showDetails?3:0)"
          :style="{ 'pointer-events': item.showDetails ?'auto':'none'}"
        >
          <div class="flex pl12 pr5 pb10 van-hairline--bottom">
            <img
              :src="item.companyLogoUrl"
              width="54"
              height="54"
              class="bdr-50"
              style="border: 1px solid #eeeeee;"
            >
            <section class="ft16 flex-1 ml10">
              <div
                :class="['flex-center','justify-sb','ft16','lh30', item.showDetails ? 'arrow-block-right ': '', 'name']"
              >
                <div class="ft16">
                  <span>{{ item.companyName }}</span>
                  <span
                    class="cl-orange"
                    v-if="item.totalPremium"
                  >{{ item.totalPremium|currency('￥','2') }}</span>
                </div>
                <div class="cl-primary mr20 ft14 type ta-r">{{ item.quoteStatusContent }}</div>
              </div>

              <!-- 详细险种 -->
              <div v-if="item.insuranceDetailList && item.insuranceDetailList.length">
                <span
                  :class="['ft13', i.additionalInsuranceType ? 'yellow': 'cl-gray']"
                  v-for="(i, x) in item.quoteInsurances"
                  :key="x"
                >
                  <span>{{ i.insuranceName }}</span>
                  <span v-if="i.coverageText !== '0万'">{{ i.coverageText }}</span>;
                </span>
              </div>
              <!-- 佣金 -->
              <div v-else class="mt3">
                <span class="cl-gray ft14">佣金:<span class="cl-lead">{{ item.rebateAmount|currency('￥','2') }}</span></span>
              </div>

              <p class="tips ft12 mt5">{{ item.isPlatformQuote?'该报价平台提供，仅供参考':'该报价由大家帮供应商提供' }}</p>
            </section>
          </div>
          <div class="flex-center justify-sb h45 plr12">
            <p class="cl-gray">{{ $util.formatDate(item.createTime, 'yyyy-MM-dd HH:mm') }}</p>
            <button
              v-if="item.showPay || item.showInsured || item.showDetails"
              class="h28 ft13 plr10 cl-white bdr14 van-button--primary"
            >{{ item.showPay?'立即支付':item.showInsured?'发起出单':item.showDetails?'查看详情':'' }}</button>
          </div>
        </div>
      </div>

      <!-- <div class="pos-f b0 l0 r0 h70 bg-white p10 btn-shadow">
        <van-button
          round
          type="primary"
          block
          class="cl-white ft16"
          @click="addNewObject()"
        >新增报价单</van-button>
      </div> -->
    </template>
    <!-- animation Loading -->
    <template v-if="isLoading">
      <div class="Gspinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>
<script>
import orderService from "@/api/orderService";
import quoteService from "@/api/quoteService";
import releaseItemService from "@/api/releaseItemService";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      dataObject: {},
      hasUserCarMsg: false, // 是否存车辆信息
      addressMap: "", // response object.map
      isLoading: true,
      addObjectShow: false, // 弹出层控制
      orderId: this.$route.query.id,
      orderType: this.$route.query.type,
      orderCompany: [] // 城市报价单
    };
  },
  created() {
    this.init();
  },
  mounted() {
    setPageTitle("车险报价详情");
  },
  methods: {
    init() {
      this.getData();
    },
    //  联系客服
    call() {
      wv.callUp("0571-28208124");
    },
    gopage(url, query) {
      // this.$router.push({ path: url, query: query });
      btPage.open({
        url: url,
        container_style: 1,
        params: query,
        jsOnResume: () => {
          if (GConfig.isInApp) {
            this.getData();
          }
        }
      });
    },
    async getData() {
      this.isLoading = true;
      // let $promise = await orderService.getQuoteLists({ id: this.orderId });
      let $promise = await releaseItemService.quoteItemList({
        orderId: this.orderId
      });

      this.isLoading = false;

      if ($promise.code != 1) {
        Toast($promise.message);
      } else {
        // 是否存在用户车辆信息
        this.hasUserCarMsg =
          $promise.object.ownerName !== "" && $promise.object.plate !== ""
            ? true
            : false;

        this.dataObject = $promise.object;
      }
    },

    addNewObject() {
      this.gopage('/order', {});
      // if (this.dataObject.orderQuotationVos) {
      //   this.gopage('/quote/choose_ins_type', {});
      // } else {
      //   Toast("暂无可投保的保险公司！");
      // }
    },
    /**
     * 跳转订单详情
     */
    goOrderDetail(item,type) {
      if (!type) {
        return;
      } else {
        // if(item.showConfirmPay){
        //   this.gopage("/release_item/quote_detail", { id: item.quoteId, type:9});
        // }else {
          this.gopage("/release_item/quote_detail", { id: item.quoteId, type});
        // }
      }
    },
    // goChooseInsType(id) {
    //   this.gopage("/quote/choose_ins_type", {
    //     cids: id,
    //     oid: this.orderId,
    //     cityCode: this.addressMap.citycode
    //   });
    //   this.addObjectShow = false;
    // }
  }
};
</script>
<style lang="less" scoped>
.outer-shadow {
  box-shadow: 0px 4px 4px 1px #e0e0e0;
}
.flex {
  display: flex;
}
.btn-shadow {
  box-shadow: 0px 0px 3px 0px #e0e0e0;
}
.yellow {
  color: #ffaf10;
}
.bdr14 {
  border-radius: 14px;
}
.lists {
  padding-bottom: 75px;
}
.item-box .tips {
  color: #ff4141;
}
</style>
<style>
@media screen and (max-width: 350px) {
  .name span {
    display: block;
  }
}
</style>



