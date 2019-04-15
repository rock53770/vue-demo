<template>
  <!-- 订单详情页 -->
  <div class="life-order-detail-wrapper">
    <div class="content-box order-header-info"
         :class="{'l-mb': !showFooter, 'll-mb': showFooter}" :style="{ marginBottom: headerStatusMargin+'px'}">
      <p class="statu-detail">
        <i class="statu-icon"
           :class="{'right': !showFooter,
            'daizhifu': showFooter && orderData.handlerStatus===500,
             'daichudan': showFooter && orderData.handlerStatus===520,
             'success': showFooter && orderData.handlerStatus===605,
              'fail': showFooter && orderData.handlerStatus===-1,
               'close': showFooter && orderData.handlerStatus===-2}"></i>
        {{ showStatusName }}
        <span class="close-remark" v-if="orderData.handlerStatus === -2 && orderData.remark">({{ orderData.remark }})</span>
      </p>
      <div class="content handlerStatus-success"
           ref="statusSuccess"
           v-if="!showFooter">
        <div class="info-left">
          <p class="cost-desc">支付金额</p>
          <p class="cost">{{ orderData.premium | currency2('', 2) }}元</p>
        </div>
        <div class="info-right van-hairline--left">
          <p class="promot-fee-des">预计推广费</p>
          <p class="promot-fee">{{ orderData.promotionFee | currency2('', 2) }}元</p>
        </div>
      </div>
      <ul class="content handlerStatus-detail"
          :class="{ 'l-label': orderData.handlerStatus === -2}"
          ref="statusDetail1"
          v-if="showFooter && [500, 520, 605, -2].includes(orderData.handlerStatus)">
        <li class="pay">
          <span class="label">{{orderData.handlerStatus === -2 ? '待支付金额' : '支付金额' }}</span>
          <span class="val">{{ orderData.premium | currency2('', 2) }}元</span>
        </li>
        <li class="promotion">
          <span class="label">预计推广费</span>
          <span class="val">{{ orderData.promotionFee | currency2('', 2) }}元</span>
        </li>
        <li class="create-time">
          <span class="label">订单创建时间</span>
          <span class="val">{{ orderData.policyInformation.createTime | dataFormat('yyyy-MM-dd hh: mm')  }}</span>
        </li>
      </ul>
      <ul class="content handlerStatus-detail"
          ref="statusDetail2"
          v-if="showFooter && orderData.handlerStatus === -1">
        <li class="fail">
          已支付金额将原路退回，预计1-3个工作日到账
        </li>
        <li class="fail-reason">
          <span class="reason">失败原因：</span>
          <span>{{ orderData.remark }}</span>
        </li>
        <li class="fail-pay">
          <span class="amount-desc">支付金额：</span>
          <span class="amount">{{ orderData.premium | currency2('￥', 2) }}</span>
        </li>
      </ul>
    </div>
    <!--保单信息-->
    <div class="content-box order-info">
      <h2 class="title van-hairline--bottom">保单信息</h2>
      <ul class="content info-list" v-if="orderData.policyInformation">
        <li v-if="orderData.policyInformation.productName">
          <span class="info-label">产品名称</span>
          <p class="info-detail">{{ orderData.policyInformation.productName }}</p>
        </li>
        <li v-if="orderData.policyInformation.insuranceCompany">
          <span class="info-label">保险公司</span>
          <p class="info-detail">{{ orderData.policyInformation.insuranceCompany }}</p>
        </li>
        <li v-if="orderData.policyNo && orderData.policyNo.length && orderData.policyNo[0]">
          <span class="info-label">保单编号</span>
          <p class="info-detail">{{ orderData.policyNo[0] }}</p>
        </li>
        <li v-if="orderData.policyInformation.guaranteePlan && orderData.policyInformation.guaranteePlan.amountText">
          <span class="info-label">保障计划</span>
          <p class="info-detail">{{ orderData.policyInformation.guaranteePlan.amountText }}</p>
        </li>
        <li v-if="orderData.policyInformation.startTime">
          <span class="info-label">起保时间</span>
          <p class="info-detail">
            {{ orderData.policyInformation.startTime | dataFormat('yyyy年MM月dd日 hh: mm: ss') }}
          </p>
        </li>
        <li v-if="orderData.policyInformation.endTime">
          <span class="info-label">终止时间</span>
          <p class="info-detail">
            {{ orderData.policyInformation.endTime | dataFormat('yyyy年MM月dd日 hh: mm: ss') }}
          </p>
        </li>
        <li v-if="orderData.policyInformation.premium">
          <span class="info-label">保费合计</span>
          <p class="info-detail c-orange">
            {{ orderData.policyInformation.premium | currency2('￥',2) }}
          </p>
        </li>
      </ul>
    </div>
    <!--投保人信息-->
    <div class="content-box order-info">
      <h2 class="title van-hairline--bottom">投保人信息</h2>
      <ul class="content info-list" v-if="orderData.applicant">
        <li v-if="orderData.applicant.name">
          <span class="info-label">姓名</span>
          <p class="info-detail">
            {{ orderData.applicant.name }}
          </p>
        </li>
        <li v-if="orderData.applicant.licenseType">
          <span class="info-label">证件类型</span>
          <p class="info-detail">
            {{ orderData.applicant.licenseType }}
          </p>
        </li>
        <li v-if="orderData.applicant.licenseNo">
          <span class="info-label">证件号码</span>
          <p class="info-detail">
            {{ orderData.applicant.licenseNo }}
          </p>
        </li>
        <li v-if="orderData.applicant.birthday">
          <span class="info-label">出生日期</span>
          <p class="info-detail">
            {{ orderData.applicant.birthday | dataFormat('yyyy-MM-dd') }}
          </p>
        </li>
        <li v-if="orderData.applicant.gender">
          <span class="info-label">性别</span>
          <p class="info-detail">
            {{ orderData.applicant.gender }}
          </p>
        </li>
        <li v-if="orderData.applicant.phone">
          <span class="info-label">手机号</span>
          <p class="info-detail">
            {{ orderData.applicant.phone }}
          </p>
        </li>
        <li v-if="orderData.applicant.email">
          <span class="info-label">电子邮箱</span>
          <p class="info-detail">
            {{ orderData.applicant.email }}
          </p>
        </li>
        <li v-if="orderData.applicant.address">
          <span class="info-label">地址</span>
          <p class="info-detail">
            {{ orderData.applicant.address }}
          </p>
        </li>
      </ul>
    </div>
    <!--被保人信息-->
    <div class="content-box order-info"
         :class="{'last-content-box': !orderData.beneficiaryType}"
         v-for="(iItem, iIndex) in orderData.insured"
         :key="iIndex">
      <h2 class="title van-hairline--bottom">被保人信息</h2>
      <ul class="content info-list">
        <!--<li v-for="(iItem, iIndex) in orderData.insured" :key="iIndex">-->
          <!--<span class="info-label l-label">{{ iItem.label }}</span>-->
          <!--<p class="info-detail">{{ iItem.value }}</p>-->
        <!--</li>-->
        <li v-if="iItem.relationType">
          <span class="info-label">与投保人关系</span>
          <p class="info-detail">
            {{ iItem.relationType }}
          </p>
        </li>
        <li v-if="iItem.name">
          <span class="info-label">姓名</span>
          <p class="info-detail">
            {{ iItem.name }}
          </p>
        </li>
        <li v-if="iItem.licenseType">
          <span class="info-label">证件类型</span>
          <p class="info-detail">
            {{ iItem.licenseType }}
          </p>
        </li>
        <li v-if="iItem.licenseNo">
          <span class="info-label">证件号码</span>
          <p class="info-detail">
            {{ iItem.licenseNo }}
          </p>
        </li>
        <li v-if="iItem.birthday">
          <span class="info-label">出生日期</span>
          <p class="info-detail">
            {{ iItem.birthday | dataFormat('yyyy-MM-dd') }}
          </p>
        </li>
        <li v-if="iItem.gender">
          <span class="info-label">性别</span>
          <p class="info-detail">
            {{ iItem.gender }}
          </p>
        </li>
        <li v-if="iItem.phone">
          <span class="info-label">手机号</span>
          <p class="info-detail">
            {{ iItem.phone }}
          </p>
        </li>
        <li v-if="iItem.email">
          <span class="info-label">电子邮箱</span>
          <p class="info-detail">
            {{ iItem.email }}
          </p>
        </li>
        <li v-if="iItem.jobName">
          <span class="info-label">职业名称</span>
          <p class="info-detail">
            {{ iItem.jobName }}
          </p>
        </li>
        <li v-if="iItem.isInsurance !== null">
          <span class="info-label">是否有社保</span>
          <p class="info-detail">
            {{ iItem.isInsurance ? '有社保' : '无社保' }}
          </p>
        </li>
      </ul>
    </div>
    <!--受益人信息-->
    <div class="content-box order-info" :class="{'last-content-box': showFooter}" v-if="orderData.beneficiaryType">
      <h2 class="title van-hairline--bottom">受益人信息</h2>
      <ul class="content info-list">
        <li>
          <span class="info-label l-label">受益人</span>
          <p class="info-detail" v-if="orderData.beneficiaryType">法定受益人</p>
        </li>
      </ul>
    </div>
    <div class="footer" v-if="showFooter && orderData.quoteDetailBtn && orderData.quoteDetailBtn.length">
      <div class="two-btn" v-if="orderData.quoteDetailBtn.length > 1">
        <button v-for="(btn, btnIndex) in orderData.quoteDetailBtn"
                v-if="!(btn.type === 5 && !orderData.policyUrl)"
                :key="btnIndex"
                :class="{'btn-orange': btnIndex === orderData.quoteDetailBtn.length - 1,
                 'btn-white': btnIndex !== orderData.quoteDetailBtn.length - 1,
                  'w120': btn.type === 5}"
                @click="onBtnClick(btn)">
          {{ btn.text }}
        </button>
      </div>
      <div class="one-btn" v-if="orderData.quoteDetailBtn.length === 1">
        <button v-for="(btn, btnIndex) in orderData.quoteDetailBtn"
                :key="btnIndex"
                class="btn-long-white"
                @click="onBtnClick(btn)">
          {{ btn.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import lifeService from '@/api/lifeService';

/**
 * status 订单状态
 * 0: 默认 500: 待支付 520: 已支付(待出单) 605: 已出单 -1: 投保(出单)失败 -2: 关闭
 * */
export default {
  name: 'lifeOrderDetail',
  components: {},
  props: {},
  data() {
    return {
      success: 0,
      orderId: null,
      orderData: {},
      headerStatusMargin: 10
    };
  },
  computed: {
    showFooter() {
      return !this.success;
      // return !this.success && [500, 520, 605, -1, -2, 1].includes(this.orderData.handlerStatus);
    },
    showStatusName() {
      return this.success ? '支付成功' : this.orderData.handlerStatusName;
    }
  },
  created() {
    this.orderId = this.$route.query.id;
    this.success = parseInt(this.$route.query.success) || 0;
    this.pullData();
  },
  mounted() {
    setPageTitle('订单详情');
  },
  beforeDestroy() {
    // 支付成功状态时点击返回跳转到个险订单列表页
    if (this.success) {
      btPage.open({
        url: '/life',
        container_style:1
      })
    }
  },
  methods: {
    // 加载内容
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      lifeService.getOrderDetail({
        id: this.orderId
      }).then((data) => {
        Toast.clear();
        if (data.code == 1) {
          this.orderData = data.object;
          if (this.orderData.quoteDetailBtn && this.orderData.quoteDetailBtn.length) {
            this.orderData.quoteDetailBtn = this.orderData.quoteDetailBtn.reverse();
          }

          // 动态配一下高度
          setTimeout(() => {
            let headStatus = this.$refs.statusSuccess || this.$refs.statusDetail1 || this.$refs.statusDetail2;
            let headStatusHeight = getComputedStyle(headStatus, null).getPropertyValue('height');
            this.headerStatusMargin = parseFloat(headStatusHeight) - 25;
          }, 0);
        } else {
          Toast(data.message);
        }
      })
    },
    // 按钮点击
    onBtnClick(btnData) {
      switch (btnData.type) {
        case 1:
          this.doPay();
          break;
        case 2:
          this.call();
          break;
        case 3:
          this.doDelete();
          break;
        case 4:
          this.reInsure();
          break;
        case 5:
          this.showElecPolicy();
          break;
        default:
          break;
      }
    },
    // 立即付款
    doPay() {
      btPage.open({
        url: '/payment',
        container_style:1,
        params:{
          id: this.orderId
        }
      })
    },
    // 再次投保
    reInsure() {
      // 跳转到对应的产品详情页
      btPage.open({
        url: '/life/life_detail',
        container_style:1,
        params:{
          id: this.orderData.policyInformation.productId
        }
      })
    },
    // 删除订单
    doDelete() {
      Dialog.confirm({
        message: '确认删除订单？'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '删除中...',
          duration:0
        });
        lifeService.deleteOrder({
          id: this.orderId
        }).then((data) => {
          Toast.clear();
          if (data.code == 1) {
            Toast({
              message: '删除成功',
              duration: 1500,
              onClose: () => {
                // 去列表页
                btPage.open({
                  url: '/order',
                  container_style:1
                });
              }
            })
          } else {
            Toast(data.message);
          }
        })
      }).catch(() => {

      });
    },
    // 联系客服
    call() {
      wv.callUp('400-603-8787');
    },
    // 查看电子保单
    showElecPolicy() {
      location.href = this.orderData.policyUrl;
    }
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";

  @orange: #FC6B47;
  @lightOrange: #FF8526;
  .life-order-detail-wrapper {
    &:after {
      content: '';
      display: table;
    }
    .content-box {
      width: 100%;
      background: white;
      padding: 0 15px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .content {
        display: block;
      }
    }

    .order-header-info {
      position: relative;
      padding-top: 15px;
      .wh(100%, 0.95rem);
      .bg-img-set('~@/assets/images/life/bg_zhuangtai@2x.png', '~@/assets/images/life/bg_zhuangtai@3x.png');
      &.l-mb {
        margin-bottom: 50px;
      }
      &.ll-mb {
        margin-bottom: 60px;
      }

      .statu-detail {
        .font(18px, white, center, 25px, 500);
        display: flex;
        justify-content: center;
        align-items: center;

        .statu-icon {
          /*display: inline-block;*/
          .square(24px);
          /*vertical-align: bottom;*/
          margin-right: 10px;

          &.right {
            .bg-img-set('~@/assets/images/life/icon_right@2x.png', '~@/assets/images/life/icon_right@3x.png', 100%, 100%);
          }
          &.daizhifu {
            .bg-img-set('~@/assets/images/life/icon_daizhifu@2x.png', '~@/assets/images/life/icon_daizhifu@3x.png', 100%, 100%);
          }
          &.daichudan {
            .bg-img-set('~@/assets/images/life/icon_daichudan@2x.png', '~@/assets/images/life/icon_daichudan@3x.png', 100%, 100%);
          }
          &.fail {
            .bg-img-set('~@/assets/images/life/icon_Fail@2x.png', '~@/assets/images/life/icon_Fail@3x.png', 100%, 100%);
          }
          &.close {
            .bg-img-set('~@/assets/images/life/icon_close@2x.png', '~@/assets/images/life/icon_close@3x.png', 100%, 100%);
          }
          &.success {
            .bg-img-set('~@/assets/images/life/icon_success@2x.png', '~@/assets/images/life/icon_success@3x.png', 100%, 100%);
          }
        }
        .close-remark {
          .font-core(18px, #fff);
        }
      }
      .content {
        //.wh(3.45rem, 80px);
        width: 3.45rem;
        background: white;
        border-radius: 5px;
        box-shadow:0px 2px 6px 0px rgba(0,0,0,0.06);
        .position2(absolute, top, 0.55rem, left, 50%);
        transform: translateX(-50%);
      }
      .handlerStatus-success {
        display: flex;
        align-items: center;
        padding: 12px 0;

        .info-left {
          flex-grow: 1;
          .cost-desc {
            .font(16px, #333, center, 22px);
            margin-bottom: 6px;
          }
          .cost {
            .font(20px, @orange, center, 28px);
          }
        }
        .info-right {
          .wh(94px, 46px);
          flex-grow: 0;
          flex-shrink: 0;

          .promot-fee-des {
            .font(12px, #666, center, 17px);
            padding-top: 3px;
            margin-bottom: 4px;
          }
          .promot-fee {
            .font(13px, @lightOrange, center, 18px);
          }
        }
      }
      .handlerStatus-detail {
        /*height: 90px;*/
        padding: 10px 15px;

        &.l-label {
          li {
            .label {
              width: 90px;
            }
          }
        }
        li {
          display: flex;
          align-items: center;

          .label {
            width: 80px;
            flex-grow: 0;
          }
          .val {
            flex-grow: 1;
          }
          &.pay {
            margin-bottom: 4px;
            .label {
              .font(16px, #333, left, 22px);
            }
            .val {
              .font(20px, #fc6b47, left, 28px);
            }
          }
          &.promotion {
            margin-bottom: 6px;
            .label {
              .font(12px, #666, left, 17px);
            }
            .val {
              .font(13px, #ff8526, left, 18px);
            }
          }
          &.create-time {
            .label {
              .font(12px, #999, left, 15px);
            }
            .val {
              .font(12px, #999, left, 15px);
            }
          }
          &.fail {
            width: 100%;
            .font(15px, #333, left, 21px);
            margin-bottom: 7px;
          }
          &.fail-reason {
            width: 100%;
            .font(13px, #999, justify, 18px);
            margin-bottom: 6px;
            display: flex;
            align-items: flex-start;
            .reason {
              display: inline-block;
              width: 66px;
              flex-shrink: 0;
              flex-grow: 0;
            }
          }
          &.fail-pay {
            height: 15px;
            .amount-desc {
              .font(13px, #666, left, 15px);
            }
            .amount {
              .font(15px, #fc6b47, left, 15px);
              &:first-letter {
                font-size: 13px;
              }
            }
          }
        }
      }
    }
    .order-info {
      .title {
        .font(16px, #464646, left, 40px);
        padding-left: 12px;
        position: relative;

        &:before {
          content: '';
          display: block;
          .wh(4px, 16px);
          background: #ffa419;
          .position2(absolute, top, 12px, left, 0);
        }
      }
      .info-list {
        padding: 15px 0;

        li {
          display: flex;
          &:not(:last-child) {
            margin-bottom: 6px;
          }

          .info-label {
            width: 86px;
            .font(14px, #999, left, 20px);
            flex-shrink: 0;
            flex-grow: 0;

            &.l-label {
              width: 108px;
            }
          }
          .info-detail {
            .font(14px, #333, left, 20px);
            flex-grow: 1;

            &.c-orange {
              color: @orange;
            }
          }
        }
      }
    }
    .last-content-box {
      margin-bottom: 60px !important;
    }
    .footer {
      display: flex;
      width: 100%;
      .position2(fixed, bottom, 0, left, 0);

      .two-btn {
        background: white;
        .wh(100%, 50px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 15px;

        button {
          display: block;
          .wh(96px, 32px);
          border-radius: 16px;
          font-size: 15px;
          margin-left: 10px;

          &.btn-white {
            background: white;
            border: 1px solid #c0c0c0;
            color: #666;
          }
          &.btn-orange {
            background:linear-gradient(90deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
            color: white;
          }
        }
      }
      .one-btn {
        width: 100%;
        padding: 12px 15px;

        .btn-long-white {
          display: block;
          .wh(100%, 32px);
          border-radius: 16px;
          font-size: 15px;
          background: white;
          border: 1px solid #c0c0c0;
          color: #666;
        }
      }
    }
  }
</style>
