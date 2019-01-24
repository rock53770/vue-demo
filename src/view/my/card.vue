<template>
  <div class="withdraw-box">
    <div class v-if="isshowaddcard">
      <van-notice-bar text="*需要绑定您本人的储蓄卡" color="#FC6B47" background="#FDE7D8"/>
      <van-cell-group :border="true">
        <van-field v-model="newcard.name" clearable label="持卡人" placeholder="请输入持卡人"/>
        <van-field v-model="newcard.cardNo" clearable label="身份证号" placeholder="请输入身份证号"/>
        <van-field
          v-model="newcard.bankCardNo"
          @blur="onblur"
          type="tel"
          clearable
          label="储蓄卡号"
          placeholder="请输入卡号"
        />
        <van-field v-model="newcard.bank" clearable label="开户银行" placeholder="请选择银行">
          <popup-radio
            slot="button"
            @click-item="clickItem"
            class="float-module"
            :popupOption="popupOption"
            popupClass="w-50 h-100"
            :cur-column.sync="banktypeselect"
            :columns="banktypelist"
            popupRadioClass="h-100 m-h-none"
          >
            <!--<span class="icon-right1" v-text="newcard.bank||'请选择银行'"></span>-->
          </popup-radio>
        </van-field>
        <van-field v-model="newcard.phone" type="tel" clearable label="预留手机" placeholder="请输入手机号"/>
      </van-cell-group>
      <div class="flex-center mlr10 mt24">
        <van-button type="primary flex-1" round @click="onAddSub" text="提交"></van-button>
      </div>
    </div>
    <div v-else>
      <div class="h10"></div>
      <div class="plr10 bg-white">
        <div class="flex-center h45 van-hairline--bottom">
          <span class="w100">持卡人</span>
          <div class="flex-1" v-text="bankInfo.name"></div>
        </div>
        <div class="flex-center h45 van-hairline--bottom">
          <span class="w100">身份证号</span>
          <div class="flex-1" v-text="bankInfo.encryCardNo"></div>
        </div>
        <div class="flex-center h45 van-hairline--bottom">
          <span class="w100">开户银行</span>
          <div class="flex-1" v-text="bankInfo.bank"></div>
        </div>
        <div class="flex-center h45 van-hairline--bottom">
          <span class="w100">储蓄卡号</span>
          <div class="flex-1" v-text="bankInfo.encryBankCardNo"></div>
        </div>
      </div>
      <!-- <div class="plr10 lh20 ft12 cl-gray mt10">
            <p>
              提示:<br>1.目前，银行卡信息暂不支持在线<br>2.有问题请拨打客服热线：<a href="tel:4006038787">400-603-8787</a>
            </p>
      </div>-->
    </div>
  </div>
</template>

<script>
import PopupRadio from "@/components/PopupRadio.vue";
import myService from "@/api/myService";
import { Toast } from "vant";
export default {
  name: "card",
  data() {
    return {
      isshowaddcard: true,
      popupOption: {
        position: "right"
      },
      isshowsite: false,
      isshowbanktype: false,
      banktypeselect: "",
      banktypelist: [
        {
          id: "1",
          name: "中国银行"
        },
        {
          id: "2",
          name: "中国农业银行"
        },
        {
          id: "3",
          name: "中国建设银行"
        },
        {
          id: "4",
          name: "中国工商银行"
        },
        {
          id: "5",
          name: "招商银行"
        },
        {
          id: "6",
          name: "兴业银行"
        },
        {
          id: "7",
          name: "交通银行"
        },
        {
          id: "8",
          name: "中国邮政储蓄银行"
        },
        {
          id: "9",
          name: "中国民生银行"
        },
        {
          id: "10",
          name: "浦发银行"
        },
        {
          id: "11",
          name: "平安银行"
        },
        {
          id: "12",
          name: "中信银行"
        }
      ],
      list: "",
      newcard: {
        name: "",
        bankCardNo: "",
        cardNo: "",
        bank: "",
        phone: ""
      },
      type: ""
    };
  },
  created() {
    this.isshowaddcard = true;
    this.getUserBank();
  },
  methods: {
    getUserBank() {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });
      myService.getUserBank().then(res => {
        Toast.clear();
        if (res.code != 1) {
          // Toast(res.message)
        } else {
          if (res.object && res.object.bankCardNo) {
            setPageTitle("更改银行卡");
            // this.bankInfo = res.object;
            // this.isshowaddcard = false;
            this.newcard.name = res.object.name || "";
            this.newcard.bank = res.object.bank || "";
            this.newcard.bankCardNo = res.object.bankCardNo || "";
            this.newcard.cardNo = res.object.cardNo || "";
            this.newcard.phone = res.object.phone || "";
          }
        }
      });
    },
    clickItem() {
      this.newcard.bank = this.banktypeselect.name;
    },
    onAddSub() {
      if (!this.newcard.name) {
        Toast("请输入持卡人");
        return;
      }
      if (!this.newcard.cardNo) {
        Toast("请输入身份证号");
        return;
      }
      if (!this.newcard.bankCardNo) {
        Toast("请输入卡号");
        return;
      }
      if (!this.newcard.phone || !/^1[0-9]{10}$/.test(this.newcard.phone)) {
        Toast("请输入正确的手机号");
        return;
      }

      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });
      var params = this.newcard;
      myService.bankSave(params).then(res => {
        Toast.clear();
        if (res.code == 1) {
          // this.getUserBank();
          let url = this.type == 1 ? "/team/team_with_draw" : "/my/cash"
          btPage.open({
            url: url,
            container_style: 1,
            type: 3
          })
          this.isshowsite = false;
        } else {
          Toast(res.message);
        }
      });
    },
    onblur() {
      this.searchBankName();
    },
    searchBankName() {
      if (this.newcard.bankCardNo.length < 16) {
        this.newcard.bank = "";
        return;
      }
      myService
        .bankBin({
          code: this.newcard.bankCardNo
        })
        .then(res => {
          if (res.code == 10000) {
            if (res.object && res.object.code === 0) {
              this.newcard.bank = res.object.object.bank_name;
            } else {
              Toast(res.object.message);
            }
          } else {
            Toast(res.message);
          }
        });
    }
  },
  mounted() {
    setPageTitle("添加银行卡");
    this.type = this.$route.query.type
  },
  components: {
    PopupRadio
  }
};
</script>

<style lang="less">
.withdraw-box {
  .card-item {
    background: #c7162e;
    border-radius: 10px;
    color: #fff;
  }
  .van-cell .van-cell__value .van-field__body {
    position: relative;
    .van-field__button {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      .float-module {
        position: absolute;
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>

