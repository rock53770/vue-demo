<template>
  <div class="receipt-add-info-wrapper">
    <content-box>
      <header>
        <div class="top-left">
          <h2>业务提示</h2>
          <p>补充保单相关信息非必填</p>
        </div>
        <div class="top-right"></div>
      </header>
    </content-box>
    <content-box>
      <div class="add-box">
        <h2>
          {{ data.companyName }}
          <span><i class="car-icon"></i>{{ data.plate }}</span>
        </h2>
        <div class="input-item" v-if="data.isInsuredCommercial">
          <p>商业险保单编号</p>
          <div class="input-container van-hairline--bottom">
            <input type="text" v-model="data.commercialPolicyNo">
          </div>
        </div>
        <div class="input-item" v-if="data.isInsuredCompulsory">
          <p>交强险保单编号</p>
          <div class="input-container van-hairline--bottom">
            <input type="text" v-model="data.compulsoryPolicyNo">
          </div>
        </div>
        <div class="input-item">
          <p>保单照片</p>
          <div>
            <img-upload add-desc="添加照片" v-if="isPicInit" v-model="picList"/>
          </div>
        </div>
      </div>
    </content-box>
    <div class="footer-gap"></div>
    <div class="footer">
      <button @click="doSave">保存</button>
    </div>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import ImgUpload from "@/components/Match/ImgUpload";
import receiptService from '../../api/receiptService';
export default {
  name: 'addInfo',
  components: { ContentBox, ImgUpload },
  props: {},
  data() {
    return {
      id: null,
      data: {},
      picList: [
        // {
        //   content: 'imgurl',
        //   file: File,
        //   percent: 0,
        //   result: {
        //     id: 'imgId',
        //     viewPath: 'imgUrl'
        //   },
        //   status: 2
        // }
      ],
      isPicInit: false
    };
  },
  computed: {},
  methods: {
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getPolicyInfo({
        quoteId: this.id
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
          this.initPicList();
        } else {
          Toast(data.message);
        }
      })
    },
    initPicList() {
      this.picList = [];
      if (this.data.policyList && this.data.policyList.length) {
        let list = [];
        this.data.policyList.forEach(item => {
          list.push({
            content: item.fileUrl,
            percent: 0,
            result: {
              id: item.fileId,
              viewPath: item.fileUrl
            },
            status: 2
          })
        });
        this.picList = list;
      }
      this.isPicInit = true;
    },
    doSave() {
      let oPics = this.getPolicyFileIds();
      let policyFileIds = [];
      if (oPics.code === 0) {
        Toast(oPics.msg);
        return;
      } else {
        policyFileIds = oPics.policyFileIds
      }

      Toast.loading({
        mask: true,
        message: '保存中...',
        duration:0
      });
      receiptService.sendAddPlicyInfo({
        quoteId: this.id,
        commercialPolicyNo: this.data.commercialPolicyNo,
        compulsoryPolicyNo: this.data.compulsoryPolicyNo,
        policyFileIds
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          Toast.success('保存成功');
          btPage.goBack();
        } else {
          Toast(data.message);
        }
      })
    },
    getPolicyFileIds() {
      let policyFileIds = [];
      this.picList.forEach(item => {
        if (item.result && item.result.id) {
          policyFileIds.push(item.result.id);
        } else {
          return {
            code: 0,
            msg: '请确保照片都已成功上传'
          };
        }
      });

      return {
        code: 1,
        policyFileIds
      };
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.pullData();
  },
  mounted() {
    setPageTitle('保单信息');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .receipt-add-info-wrapper {
    width: 100%;
    overflow-x: hidden;
    header {
      height: auto;
      padding: 10px 15px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .top-left {
        h2 {
          .font(20px, #333, left, 28px, bold);
          margin-bottom: 8px;
        }
        p {
          width: 208px;
          .font(13px, #999, justify, 20px);
        }
      }
      .top-right {
        .wh(124px, 88px);
        .bg-img-set('~@/assets/images/match/images_yewu@2x.png', '~@/assets/images/match/images_yewu@3x.png', 100%, 100%);
      }
    }
    .add-box {
      padding: 15px;

      h2 {
        .font(17px, #464646, left, 24px, bold);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        span {
          color: #333;
          display: flex;
          align-items: center;

          .car-icon {
            margin-right: 10px;
            .wh(38px, 28px);
            .bg-img-set('~@/assets/images/match/download@2x.png', '~@/assets/images/match/download@3x.png', 100%, 100%);
          }
        }
      }
      .input-item {
        margin-bottom: 20px;
        p {
          .font(15px, #464646, left, 21px);
          margin-bottom: 6px;
        }
        .input-container {
          height: 45px;

          input {
            .font(26px, #333, left, 45px);
          }
        }
      }
    }
    .footer-gap {
      height: 65px;
    }
    .footer {
      .wh(100%, 65px);
      padding: 10px;
      background: white;
      .position2(fixed, bottom, 0, left, 0);

      button {
        display: block;
        .wh(100%, 100%);
        border-radius: 23px;
        background:linear-gradient(270deg,rgba(8,123,245,1) 0%,rgba(10,172,246,1) 100%);
        box-shadow:0 2px 4px 0 rgba(30,124,255,0.3);
        .font-core(16px, white);
      }
    }
  }
</style>
