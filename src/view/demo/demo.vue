<template>
  <!-- 滚动试试 -->
  <div>
    <template v-if="false">
      <div class="page">{{ currentPage }}页码</div>
      <btScroller :getData="getData" :currentPage.sync="currentPage">
        <div v-for="(item, index) in articleList" :key="index">
          {{ index+1 }}我是一条数据<br> _________________________
        </div>
      </btScroller>
    </template>
    <template v-else>
      <skeleton></skeleton>
    </template>
  </div>
</template>

<script>
let testJson = {
  code: 1,
  message: '成功!',
  object: [
    {
      FNewsTitle: '键盘上的小红点 时代妥协的产物还是经典的传承',
      FNewsSrc:
        'http://www.baidu.com/home/news/data/newspage?nid=14961581456476460806&n_type=0&p_from=1&dtype=-1',
      FNewsPic: '//www.baidu.com/img/bd_logo1.png',
      FNewsReleaseTime: '2017-10-13 00:00',
      noticeID: 1,
      publishTime: '2015-13-15 00:01',
      title: '111完成授信送现金！第三方发的撒发生发达 ',
      buyerName: '张三',
      picture: '',
      linkUrl: '',
      isRead: 0,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 2,
      publishTime: '2015-08-15 16:00',
      title: '2完成授信送现金！',
      buyerName: '张三',
      picture: '',
      linkUrl: 'http://m.cheok.com',
      isRead: 0,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 3,
      publishTime: '2015-23-15 21:00',
      title: '3完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 0,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 4,
      publishTime: '2015-08-15 21:00',
      title: '4完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 0,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 5,
      publishTime: '2015-08-15 07:20',
      title: '5完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 6,
      publishTime: '2015-08-15 22:20',
      title: '6完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 7,
      publishTime: '2015-08-15 17:20',
      title: '7完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 8,
      publishTime: '2015-15-15 15:20',
      title: '8完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 9,
      publishTime: '2015-08-15 17:20',
      title: '7完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 10,
      publishTime: '2015-15-15 15:20',
      title: '8完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    },
    {
      noticeID: 11,
      publishTime: '2015-08-15 17:20',
      title: '7完成授信送现金！',
      buyerName: '张三',
      picture: '',
      isRead: 1,
      summary:
        '只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的'
    }
  ],
  map: {},
  page: {
    currentPage: 1,
    pageRecords: 20,
    totalPages: 5,
    totalRecords: 111,
    startRecord: 0,
    nextPage: 0,
    previousPage: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
};
import btScroller from '@/components/btScroller';
import skeleton from '@/components/Skeleton';

import quoteService from '@/api/quoteService.js';
export default {
  name: 'demo',
  data() {
    return {
      articleList: [],
      currentPage: 1,
      pageSize: 20
    };
  },
  methods: {
    getData() {
      console.log('currentpage' + this.currentPage);
      // alert('上拉加载')
      var _this = this;
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(testJson);
        }, 300);
      });

      // var promise = quoteService.getorderlists({
      // 	currentPage: _this.currentPage,
      // 	pageSize: _this.pageSize
      // });

      promise.then(function(result) {
        if (result.code != 1) {
          // Toast(result.message);
          Toast(result.message);
        } else {
          if (_this.currentPage == 1) {
            _this.articleList = result.object;
          } else {
            _this.articleList = [..._this.articleList, ...result.object];
          }
          _this.totalPages = result.page.totalPages;
          _this.isNoData = result.page.totalPages == 0;
        }
      });

      return promise;
    }
  },
  components: {
    btScroller,
    skeleton
  }
};
</script>

<style lang="less" scoped>
.page {
  position: fixed;
  z-index: 999;
  right: 0;
  top: 0;
  font-size: 48px;
}
</style>

