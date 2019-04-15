<template>
  <!-- 订单确认页 -->
  <div class="life-confirm-order-wrapper">
    <div class="content-box order-header-info">
      <div class="content">
        <div class="info-left">
          <p class="cost-desc">订单待支付金额</p>
          <p class="cost">{{ orderData.price | currency2('', 2) }}元</p>
        </div>
        <div class="info-right van-hairline--left" v-if="!uid">
          <p class="promot-fee-des">预计推广费</p>
          <p class="promot-fee">{{ orderData.promotionFee | currency2('', 2) }}元</p>
        </div>
      </div>
    </div>
    <!--保障详情-->
    <div class="content-box order-info">
      <h2 class="title van-hairline--bottom">保单详情</h2>
      <ul class="content info-list">
        <li v-if="orderData.goodsName">
          <span class="info-label">产品名称</span>
          <p class="info-detail">{{ orderData.goodsName }}</p>
        </li>
        <li v-if="orderData.protectName">
          <span class="info-label">保障计划</span>
          <p class="info-detail">{{ orderData.protectName }}</p>
        </li>
        <li v-if="orderData.protectRangeContent">
          <span class="info-label">保障期间</span>
          <p class="info-detail">{{ orderData.protectRangeContent }}</p>
        </li>
        <li v-if="orderData.startTime">
          <span class="info-label">起保时间</span>
          <p class="info-detail">{{ orderData.startTime | dataFormat('yyyy年MM月dd日 hh: mm: ss')}}</p>
        </li>
        <li v-if="orderData.endTime">
          <span class="info-label">终止时间</span>
          <p class="info-detail">{{ orderData.endTime | dataFormat('yyyy年MM月dd日 hh: mm: ss')}}</p>
        </li>
        <li v-if="orderData.price">
          <span class="info-label">保费合计</span>
          <p class="info-detail c-orange">{{ orderData.price | currency2('￥', 2) }}</p>
        </li>
      </ul>
    </div>
    <!--投保人信息-->
    <div class="content-box order-info">
      <h2 class="title van-hairline--bottom">投保人信息</h2>
      <ul class="content info-list">
        <!--<li v-for="(aItem, aIndex) in orderData.applicant" :key="aIndex">-->
          <!--<span class="info-label">{{ aItem.label }}</span>-->
          <!--<p class="info-detail">{{ aItem.value }}</p>-->
        <!--</li>-->
        <li v-if="orderData.name">
          <span class="info-label">姓名</span>
          <p class="info-detail">{{ orderData.name }}</p>
        </li>
        <li v-if="orderData.idType">
          <span class="info-label">证件类型</span>
          <p class="info-detail">{{ orderData.idType.content }}</p>
        </li>
        <li v-if="orderData.idNumber">
          <span class="info-label">证件号码</span>
          <p class="info-detail">{{ orderData.idNumber }}</p>
        </li>
        <li v-if="showGender">
          <span class="info-label">性别</span>
          <p class="info-detail">{{ showGender }}</p>
        </li>
        <li v-if="orderData.phone">
          <span class="info-label">手机号</span>
          <p class="info-detail">{{ orderData.phone }}</p>
        </li>
        <li v-if="orderData.email">
          <span class="info-label">邮箱</span>
          <p class="info-detail">{{ orderData.email }}</p>
        </li>
      </ul>
    </div>
    <!--被保人信息-->
    <div class="content-box order-info" :style="{'margin-bottom': orderData.legalBeneficiary ? '':'60px'}">
      <h2 class="title van-hairline--bottom">被保人信息</h2>
      <ul class="content info-list">
        <li v-if="orderData.insuredName">
          <span class="info-label">姓名</span>
          <p class="info-detail">{{ orderData.insuredName }}</p>
        </li>
        <li v-if="orderData.insuredIDType">
          <span class="info-label">证件类型</span>
          <p class="info-detail">{{ orderData.insuredIDType.content }}</p>
        </li>
        <li v-if="orderData.insuredIDNumber">
          <span class="info-label">证件号码</span>
          <p class="info-detail">{{ orderData.insuredIDNumber }}</p>
        </li>
        <li v-if="orderData.insuredPhone">
          <span class="info-label">手机号</span>
          <p class="info-detail">{{ orderData.insuredPhone }}</p>
        </li>
        <li v-if="orderData.insuredEmail">
          <span class="info-label">邮箱</span>
          <p class="info-detail">{{ orderData.insuredEmail }}</p>
        </li>
        <li v-if="orderData.insuredSocialInsurance !== undefined">
          <span class="info-label">社保</span>
          <p class="info-detail">
            {{ orderData.insuredSocialInsurance ? '有社保' : '无社保' }}
          </p>
        </li>
        <li v-if="orderData.insuredCareer">
          <span class="info-label">职业</span>
          <p class="info-detail">
            {{ orderData.insuredCareer.name }}
          </p>
        </li>
        <li v-if="orderData.insuredBirthday ">
          <span class="info-label">出生日期</span>
          <p class="info-detail">
            {{ orderData.insuredBirthday | dataFormat('yyyy-MM-dd') }}
          </p>
        </li>
      </ul>
    </div>
    <!--受益人信息-->
    <div class="content-box order-info last-content-box" v-if="orderData.legalBeneficiary">
      <h2 class="title van-hairline--bottom">受益人信息</h2>
      <ul class="content info-list">
        <li v-if="orderData.legalBeneficiary">
          <span class="info-label">受益人</span>
          <p class="info-detail">法定受益人</p>
        </li>
      </ul>
    </div>
    <div class="footer">
      <p class="total-cost">
        {{ orderData.price | currency2('￥', 2) }}
      </p>
      <button class="btn-insure" @click="doInsure">立即投保</button>
    </div>
  </div>
</template>

<script>
import lifeService from '@/api/lifeService';

export default {
  name: 'lifeConfirmOrder',
  components: {},
  props: {},
  data() {
    return {
      uid: null,
      orderData: {}
    };
  },
  computed: {
    showGender() {
      if (this.orderData.idType && this.orderData.idType.content === '身份证' && this.orderData.idNumber) {
        let genderNum = parseInt(this.orderData.idNumber.substr(-2, 1));
        return !!(genderNum % 2) ? '男' : '女';
      }
      return null;
    }
  },
  created() {
    this.uid = this.$route.query.uid || null; // 分享的页面上会带
    let data = Util.getSessionData('__p_insure__');
    if (data) {
      // Util.removeSessionData('__p_insure__');
      this.orderData = data;
    }
    // console.log(data);
    // this.orderData = {
    //   email: "dddd@163.com",
    //   goodsId: "720",
    //   idNumber: "33210121451",
    //   idType: "mock",
    //   insuredEmail: "jdjj@163.com",
    //   insuredIDNumber: "210214512415",
    //   insuredIDType: "mock",
    //   insuredName: "abbb",
    //   insuredPhone: "13522141215",
    //   insuredRelation: "mock",
    //   name: "balll",
    //   phone: "13588251421",
    //   legalBeneficiary: true,
    //   insuredBirthday: 946656000000
    // }
  },
  mounted() {
    setPageTitle('订单确认');
    // 重置页面到顶部
    window.scrollTo(0, 0);
  },
  methods: {
    // 立即投保
    doInsure() {
      const orderData = this.orderData;
      let sendData = {
        id: orderData.goodsId || null,
        userId: this.uid,
        startTime: orderData.startTime || null,
        endTime: orderData.endTime || null,
        plan: orderData.plan,
        applicant: { // 投保人信息
          name: orderData.name || null,
          cardType: orderData.idType.value || null,
          cardNo: orderData.idNumber || null,
          phone: orderData.phone || null,
          email: orderData.email || null,
        },
        insurant: [{ // 被保人信息
          relationship: orderData.insuredRelation.value || null,
          name: orderData.insuredName || null,
          phone: orderData.insuredPhone || null,
          email: orderData.insuredEmail || null,
          socialSecurity: orderData.insuredSocialInsurance === undefined ? null : !!orderData.insuredSocialInsurance,
          careerId: orderData.insuredCareer ? orderData.insuredCareer.id : null,
          cardType: orderData.insuredIDType ? orderData.insuredIDType.value : null,
          cardNo: orderData.insuredIDNumber || null,
          price: orderData.price || null,
          num: orderData.count || null,
          sex: null,
          birthday: orderData.insuredBirthday || null,
          startTime: null,
          endTime: null
        }]
      };
      // let sendData = {
      //   "id":710,
      //   "userId":30043,
      //   "plan":[
      //     {"ruleId":658,"value":5081},
      //     {"ruleId":659,"value":5083},
      //     {"ruleId":661,"value":5087},
      //     {"ruleId":662,"value":5091}
      //    ],
      //   "applicant":{
      //     "name":"\u6d4b\u8bd5\u6d4b\u8bd5",
      //     "phone":"13003007789",
      //     "email":"ceshi@qq.com",
      //     "cardType":"1",
      //     "cardNo":"130221199512082444"},
      //   "insurant":[
      //     {"name":"\u6d4b\u8bd5\u6d4b\u8bd5",
      //       "phone":"13003007789",
      //       "email":"ceshi@qq.com",
      //       "cardType":"1",
      //       "cardNo":"130221199512082444",
      //       "socialSecurity":1,
      //       "careerId":3,
      //       "birthday":"818352000000",
      //       "relationship":1
      //     }
      //   ],
      //   "startTime":"1553406330000"
      // };

      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      // console.log(sendData);
      lifeService.createOrder({
        jsonString: JSON.stringify(sendData)
      }).then((data) => {
        Toast.clear();
        if (data.code == 1) {
          let orderId = data.object.oid;
          // console.log(orderId);

          // 删除上个页面的填写内容
          Util.removeSessionData('__p_input_data__');
          // 订单创建成功，跳转到收银台
          btPage.open({
            url: '/payment',
            container_style:1,
            params:{
              id: orderId,
              uid: this.uid || null
            }
          })
        } else {
          Toast(data.message);
        }
      });
    }
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";

  @orange: #FC6B47;
  @lightOrange: #FF8526;
  .life-confirm-order-wrapper {
    &:after {
      content: '';
      display: table;
    }

    .mb60 {
        margin-bottom: 60px;
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
      padding: 17px 0;

      .content {
        display: flex;

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
          .wh(94px, 52px);
          flex-grow: 0;
          flex-shrink: 0;

          .promot-fee-des {
            .font(12px, #666, center, 17px);
            padding-top: 6px;
            margin-bottom: 4px;
          }
          .promot-fee {
            .font(13px, @lightOrange, center, 18px);
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
      background: white;
      width: 100%;
      .position2(fixed, bottom, 0, left, 0);

      .total-cost {
        flex-grow: 1;
        .font(24px, #fc6b47, left, 46px);
        padding-left: 15px;

        &:first-letter {
          font-size: 20px;
        }
      }
      .btn-insure {
        .wh(150px, 50px);
        flex-shrink: 0;
        flex-grow: 0;
        background:linear-gradient(90deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
        .font-core(17px, white);
      }
    }
  }
</style>
