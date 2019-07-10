<template>
  <div class="agent-change-location-wrapper">
    <p class="note">
      <van-icon name="warning-o" color="#999" size="16px"/>
      <span>变更所属的星利分公司，方便您开展相关业务</span>
    </p>
    <div class="content-input van-hairline--bottom">
      <span>原归属公司</span>
      <p>{{ oldCompanyName }}</p>
      <van-icon name="arrow" color="#cbcbcb" size="16px"/>
    </div>
    <div class="content-input" @click="isShowCompanyPicker = true">
      <span>新归属公司</span>
      <p :class="{'c-gray': !newCompany.name}">{{ newCompany.name ? newCompany.name : '请输入新地址' }}</p>
      <van-icon name="arrow" color="#cbcbcb" size="16px"/>
    </div>

    <van-popup v-model="isShowCompanyPicker" position="bottom" :overlay="true">
      <van-picker :columns="companyList"
                  :show-toolbar="true"
                  value-key="name"
                  :default-index="newCompany.index"
                  @cancel="isShowCompanyPicker = false"
                  @confirm="onConfirm"/>
    </van-popup>

    <div class="h65">
      <div class="flex-center pos-f b0 bg-white h65 p10 w-100 zi10 van-hairline--top">
        <van-button type="primary flex-1" :block="true" round  @click="doChange" text="确认"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import myService from '@/api/myService';

export default {
  name: 'agentChangeLocation',
  components: {},
  props: {},
  data() {
    return {
      companyList: [],
      isShowCompanyPicker: false,
      oldCompanyName: '',
      newCompany: {
        id: null,
        name: null
      }
    };
  },
  computed: {},
  methods: {
    pullData() {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
      });
      myService.userAgent().then((res) => {
        Toast.clear();
        if (res.code == 1 && res.object && res.object.userAgentInfoVo) {
          // this.$router.back();
          let userAgentInfoVo = res.object.userAgentInfoVo || {};

          this.oldCompanyName = userAgentInfoVo.serviceCentresName;
        } else if (res.code === 0) {

        } else {
          Toast(res.message);
        }
      });
    },
    getAllCenters() {
      myService.getAllCenters({}).then((res) => {
        if (res.code === 1) {
          if (res.object && res.object.length) {
            let companyList = [];
            for (let [index, ele] of res.object.entries()) {
              companyList.push({
                ...ele,
                index
              })
            }
            this.companyList = companyList;
          }
        } else {
          Toast(res.message);
        }
      });
    },
    onConfirm(data) {
      this.newCompany = data;
      this.isShowCompanyPicker = false;
    },
    doChange() {
      if (!this.newCompany.id) {
        Toast('请输入新地址');
        return;
      }

      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '上传中...',
      });
      myService.doChangeCentre({
        centreId: this.newCompany.id
      }).then((res) => {
        Toast.clear();
        if (res.code === 1) {
          Toast.success('成功');
          setTimeout(() => {
            btPage.goBack();
          }, 1000);
        } else {
          Toast(res.message);
        }
      });
    }
  },
  created() {
    this.pullData();
    this.getAllCenters();
  },
  mounted() {
    setPageTitle('变更归属地');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .agent-change-location-wrapper {
    .note {
      display: flex;
      padding: 12px 15px;
      .font(14px, #999, justify, 20px);

      /deep/ .van-icon {
        margin-right: 6px;
        margin-top: 2px;
      }
    }
    .content-input {
      background: #fff;
      display: flex;
      padding: 15px;

      span, p {
        .font-core(16px, #333);
      }
      span, /deep/ .van-icon {
        flex-shrink: 0;
      }
      p {
        flex-grow: 1;
        text-align: right;
        &.c-gray {
          color: #97999b;
        }
      }
      /deep/ .van-icon {
        margin-left: 8px;
        margin-top: 1px;
      }
    }
  }
</style>
