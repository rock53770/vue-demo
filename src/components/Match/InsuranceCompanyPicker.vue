<template>
  <div class="insurance-company-picker-wrapper">
    <div class="loading" v-show="loading">
      <van-loading/>
    </div>
    <header class="nav-bar van-hairline--bottom">
      <van-icon color="#909090" name="arrow-left" @click="goBack"/>
      <h3>保险公司</h3>
      <van-icon color="#909090" name="cross" @click="goBack"/>
    </header>
    <div class="search-box van-hairline--bottom">
      <van-search placeholder="搜索保险公司" v-model="searchKey" show-action @clear="pullData">
        <div slot="action" v-show="searchKey" class="cl-primary" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <div class="company-list-container">
      <ul class="search-result-list">
        <li v-for="(item, index) in companyList"
            :key="index"
            @click="selectCompany(item)">{{ item.companyName }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import receiptService from '../../api/receiptService';
export default {
  name: 'insuranceCompanyPicker',
  components: {},
  props: {
    currCompany: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      searchKey: null,
      companyList: [],
      loading: false
    };
  },
  computed: {},
  methods: {
    pullData(searchKey = null) {
      this.loading = true;
      receiptService.getInsuranceCompany({
        name: searchKey
      }).then(data => {
        this.loading = false;
        if (data.code === 1) {
          this.companyList = data.object;
        } else {
          Toast(data.message);
        }
      })
    },
    onSearch() {
      this.pullData(this.searchKey);
    },
    selectCompany(companyData) {
      if (companyData.id !== this.currCompany.id) {
        this.$emit('selectCompany', companyData);
      } else {
        this.goBack();
      }
    },
    goBack() {
      this.$emit('close');
    }
  },
  created() {
    this.pullData();
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .insurance-company-picker-wrapper {
    width: 224px;
    height: 100vh;
    background: #fff;

    .nav-bar {
      height: auto;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        .font(16px, #464646, left, 22px);
      }
    }
    .search-box {
      /deep/ .van-search {
        padding: 6px 0 6px 12px;
      }
    }
    .company-list-container {
      height: calc(~'100% - 88px');
      overflow-y: auto;
      .search-result-list {
        padding-left: 16px;
        li {
          .font(14px, #464646, left, 43px);
          &:not(:last-child) {
            .half-border(bottom, #ddd);
          }
        }
      }
    }
    .loading {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
