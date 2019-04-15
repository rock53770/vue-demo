<template>
  <div class="pt10 bg">
    <div @click="opationsRout" class="bg-white">
      <div
        :class="['item-user-name','flex-center','justify-sb','h45','half-border-bottom','plr12','ft14', item.showDetail ? 'arrow-block-right': '']">
        <!--<p v-if="type !== 3" class="cl-black ft16">被保人：{{ item.ownerName }}</p>-->
        <p class="cl-black ft16">被保人：{{ item.ownerName }}</p>
        <!--<p v-else :class="[item.showDetail?'cl-black':'cl-dgray', 'ft16']">被保人：{{ item.ownerName }}</p>-->
        <!--<span :class="['cl-gray',item.showDetail?'mr10':'']">{{ item.handlerName }}</span>-->
      </div>
      <div class="half-border-bottom pt10 pb10 plr12 ft14">
        <div v-for="(i, index) in item.quoteList" :key="index" class="lh45">
          <!--<div v-if="type == 1">-->
          <div class="ft16">
            <img :src="i.icon" width="36" height="36" class="ver-align-mid mr5 bdr-50"
                 style="border: 1px solid #eeeeee;">
            <span>{{ i.companyName }}：</span>
            <span class="cl-orange" v-if="i.price">{{ i.price |currency2('￥','2') }}</span>
            <em v-if="i.handlerName" class="fs-n cl-666">&nbsp;{{ i.handlerName }}</em>
          </div>

          <!--<div class="cl-black" v-else-if="type == 2">-->
          <!--<p class="flex-center justify-sb"><span>保险名称：{{ i.companyName }}</span><span v-if="i.price" class="cl-orange fw-b ft18">{{ i.price|currency2('￥','2') }}</span></p>-->
          <!--<p v-if="item.plate">投保车辆：{{ item.plate }}</p>-->
          <!--</div>-->

          <!--<div :class="[item.showDetail?'cl-black':'cl-dgray']" v-else>-->
          <!--<div class="flex-center" v-if="i.handlerStatus !== -2">-->
          <!--<p class="w-50 ta-l">保险名称：{{ i.companyName }}</p>-->
          <!--<p class="w-50 ta-r ft16 cl-orange" v-if="i.price">{{ i.price|currency2('￥','2') }}</p>-->
          <!--</div>-->
          <!--<p v-if="i.handlerStatus !== -2 && item.plate">投保车辆：{{ item.plate }}</p>-->
          <!--<div class="flex-center" v-else>-->
          <!--<div :class="[item.target == 1 ? '': 'w-50', 'ta-l']">-->
          <!--<span v-if="item.target == 2">保险名称：</span>{{ i.companyName }}<span v-if="item.target == 1">：</span>-->
          <!--</div>-->
          <!--<div class="w-50 ta-r ft16 fw-b cl-orange" v-if="i.price && item.target == 2">{{ i.price|currency2('￥','2') }}</div>-->
          <!--<div v-if="item.target == 1">报价单已关闭</div>-->
          <!--</div>-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <div
      :class="['h45','plr12', 'flex-center', 'justify-sb','van-hairline--bottom','bg-white','ta-r']">
      <span class="cl-gray f12">{{ $util.formatDate(item.handlerTime, 'yyyy-MM-dd HH:mm') }}</span>
      <div>
        <button class="h28 plr12 bg-white cl-666 bdc bdr14" @click="deleteItem" v-if="item.delete">关闭询价</button>
        <!--<button class="h28 plr12 cl-white bdr14 ft12 van-button&#45;&#45;primary" v-if="item.pay" @click="goPay">立即支付</button>-->
        <!--<button class="h28 plr5 cl-white bdr14 van-button&#45;&#45;primary" v-if="item.address" @click="selectAddress">选择取件方式</button>-->
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 说明，props内type对应三种不同的状态，分别为全部，交易中，已完成  新欣保改造后无效，统一跳转到/order/quote_detail
 * @item, 订单对象
 * @index, 当前列表渲染下标值
 */
export default {
  name: 'orderDetail',
  props: ['item', 'index', 'getfn'],
  data() {
    return {
      type: this.item.tag,
    };
  },
  methods: {
    gopage(url, query) {
      btPage.open({
        url: url,
        container_style: 1,
        params: query,
        jsOnResume: () => {
          this.getfn();
        },
      });
    },
    /**
     * 删除该项保单
     */
    deleteItem() {
      this.$emit('del', { id: this.item.id, index: this.index });
    },
    opationsRout() {
      this.gopage('/order/quote_detail', { id: this.item.id });
      // if (this.item.showDetail) {
      //     if (this.type === 1) {
      //         this.gopage('/order/quote_detail',{ id: this.item.id })
      //     } else if(this.type === 2) {
      //         this.gopage('/order/order_detail',{ id: this.item.quoteList[0].quoteId })
      //     } else {
      //         this.gopage('/order/order_detail_done',{ id: this.item.quoteList[0].quoteId })
      //     }
      // } else {
      //     return
      // }

    },
    selectAddress() {
      this.gopage('/order/choose_address', { id: this.item.quoteList[0].quoteId, active: 0 });
    },
    goPay() {
      this.gopage('/order/pay_method', { id: this.item.quoteList[0].quoteId });
    },
  },
};
</script>
<style lang="less" scoped>
  .bdc {
    border: 1px solid #c6c6c6;
  }

  .bdr14 {
    border-radius: 14px;
  }

  .fs-n {
    font-style: normal;
  }

  .showDetail {
    pointer-events: auto;
  }

  .unDetail {
    pointer-events: none;
  }
</style>


