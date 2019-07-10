<template>
  <div class="car-insurance-demand-detail-wrapper">
    <div class="insurance" v-if="commercialInsurance.length">
      <div class="header">
        <h3 class="insurance-type">
          商业险
          <span
            class="start-time"
            v-if="commercialStartTime "
          >(起保时间 {{ commercialStartTime | dataFormat('yyyy.MM.dd hh: mm')}}）</span>
        </h3>
        <p class="list-desc van-hairline--bottom">
          <span>险种</span>
          <span>明细</span>
        </p>
      </div>
      <ul class="insurance-list van-hairline--bottom">
        <li v-for="(cItem, cIndex) in commercialInsurance" :key="cIndex">
          <p class="insurance-name">{{ cItem.insuranceName}}</p>
          <span class="icon" v-if="cItem.additionalInsuranceType">不计免赔</span>
          <p class="val">{{ cItem.coverageText }}</p>
        </li>
      </ul>
    </div>
    <div class="insurance" v-if="strongInsurance.length">
      <div class="header">
        <h3 class="insurance-type">
          交强险
          <span
            class="start-time"
            v-if="compulsoryStartTime"
          >(起保时间 {{ compulsoryStartTime | dataFormat('yyyy.MM.dd hh: mm')}}）</span>
        </h3>
        <p class="list-desc van-hairline--bottom">
          <span>险种</span>
          <span>明细</span>
        </p>
      </div>
      <ul class="insurance-list van-hairline--bottom">
        <li v-for="(sItem, sIndex) in strongInsurance" :key="sIndex">
          <p class="insurance-name">{{ sItem.insuranceName}}</p>
          <span class="icon" v-if="sItem.additionalInsuranceType">不计免赔</span>
          <p class="val">{{ sItem.coverageText }}</p>
        </li>
      </ul>
      <!-- 特殊有备注即显示 -->
      <div v-if="remark" class="p15">
        <p class>发单备注</p>
        <p class="mt6 ft13 cl-gray">{{ remark }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarInsuranceDemandDetail",
  components: {},
  props: {
    insurances: {
      type: Array,
      default: function() {
        return [];
      }
    },
    remark: {
      //备注
      type: String
    },
    commercialStartTime: {
      type: Number
    },
    compulsoryStartTime: {
      type: Number
    }
  },
  data() {
    return {
      commercialInsurance: [], // 商业险
      strongInsurance: [] // 交强险
    };
  },
  methods: {
    initInsurances() {
      this.insurances.forEach(ele => {
        if (ele.insuranceType === 2) {
          // 商业险
          this.commercialInsurance.push(ele);
        }
        if (ele.insuranceType === 1 || ele.insuranceType === 3) {
          // 交强险
          this.strongInsurance.push(ele);
        }
      });
    }
  },
  created() {
    this.initInsurances();
  }
};
</script>

<style scoped lang="less">
@import "../../assets/less/global";
.car-insurance-demand-detail-wrapper {
  .insurance {
    .header {
      .insurance-type {
        display: flex;
        align-items: center;
        padding: 10px 15px 3px;
        .font(15px, #333, left, 21px, bold);

        &:before {
          content: "";
          display: inline-block;
          .wh(10px, 4px);
          border-radius: 2px;
          background: #ff8526;
          margin-right: 8px;
        }
        .start-time {
          .font(13px, #999, left, 18px);
          margin-left: 6px;
        }
      }
    }
    .list-desc {
      padding: 0 15px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        .font-core(14px, #666);
      }
    }
  }
  .insurance-list {
    padding: 13px 15px 11px;
    li {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 12px;
      }

      .insurance-name {
        width: 204px;
        .font(15px, #333, left, 21px);
        @media screen and (max-width: 340px) {
          width: 175px;
        }
      }
      .icon {
        .wh(57px, 22px);
        border-radius: 4px;
        border: 1px solid #087bf5;
        .font(12px, #087bf5, center, 20px);
      }
      .val {
        flex-grow: 1;
        flex-shrink: 0;
        .font(16px, #333, right, 22px);
      }
    }
  }
}
</style>
