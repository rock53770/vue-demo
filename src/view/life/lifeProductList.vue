<template>
  <!--产品列表页-->
  <div class="life-product-list-wrapper">
    <van-tabs v-model="activeTab"
              v-if="tabs && tabs.length"
              :swipe-threshold="7"
              sticky>
      <van-tab v-for="(item, index) in tabs" :title="item.label" :key="index">
        <van-pull-refresh v-model="item.loading" @refresh="onRefresh(item)">
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            :error.sync="item.error"
            error-text="请求失败，点击重新加载"
            finished-text="没有更多了"
            @load="onLoad(item)"
          >
            <goods-item v-for="(gItem, gIndex) in item.listData" :key="gIndex" :item-data="gItem" @click="goToDetail"/>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import lifeService from '@/api/lifeService';
import GoodsItem from  '@/components/GoodsItem.vue';

export default {
  name: 'lifeProductList',
  components: { GoodsItem },
  data() {
    return {
      activeTab: 0,
      tabs: [],
      isLogined: false
    };
  },
  computed: {},
  created() {
    this.activeTab = this.$route.query.tag ? parseInt(this.$route.query.tag) || 0 : 0;
    this.initTags();
    if (Util.getCookie("userInfo")) {
      this.isLogined = true;
    }
  },
  methods: {
    // 初始化商品标签
    initTags() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      lifeService.getTags().then((data) => {
        Toast.clear();
        if (data.code == 1) {
          this.tabs = [];
          for (let [index, item] of data.object.entries()) {
            this.tabs.push({
              label: item.name,
              tagId: item.id,
              loading:false,
              finished: false,
              listData: [],
              error: false,
              pageSize: 10,
              pageIndex: 0
            })
          }
        } else {
          Toast(data.message);
        }
      })
    },
    // 下拉刷新列表
    onRefresh(curTab) {
      curTab.pageIndex = 0;
      curTab.finished = false;
      curTab.error = false;
      this.onLoad(curTab);
    },
    onLoad(curTab) {
      const sendData = {
        tagId: curTab.tagId,
        pageIndex: curTab.pageIndex + 1,
        pageSize: curTab.pageSize
      };
      // console.log(sendData);
      curTab.error = false;
      lifeService.getGoodsList(sendData).then((data) => {
        if (data.code == 1) {
          // console.log(data);
          curTab.loading = false;
          // 加载成功后再加1，避免错误后直接请求下一页
          curTab.pageIndex++;
          if (curTab.pageIndex === 1) {
            curTab.listData = data.object;
          } else {
            for (let i = 0; i < data.object.length; i++) {
              curTab.listData.push(data.object[i]);
            }
          }

          if (!data.page.hasNextPage) {
            curTab.finished = true;
          }
        } else {
          curTab.error = true;
          Toast(data.message);
        }
      }).catch(() => {
        curTab.error = true;
      })
    },
    goToDetail(itemData) {
      const goodId = itemData.id;
      if (itemData.jumpType) {
        if (!this.isLogined) {
          btPage.open({
            url: '/login',
            enter_animate:2,
            type:3,
            container_style:1,
            params: {redirect: this.$route.fullPath}
          })
        } else {
          location.href = itemData.jumpAddress;
        }
        return;
      }
      // console.log(goodId);
      btPage.open({
        url: '/life/life_detail',
        container_style:1,
        params:{
          id: goodId,
          type: 'normal'
        }
      })
    }
  },
};
</script>

<style lang="less">
  .van-tab {
    font-size: 15px;
  }
</style>
