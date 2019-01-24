<template>
  <div class="list-wrapper">
		<x-header v-if="$root.isShowHead">滚动列表</x-header>
		<div class="scroller-container">
			<bt-scroller
			:getData="getData"
			:currentPage.sync="currentPage"
			:beginPage="1" ref="scroller">
				<h2>当前第{{currentPage}}页，一共有{{totalPages}}页<button @click="refresh()">触发下拉刷新</button></h2>
				<div v-for="(item, index) in articleList" :key="index">
				{{ item.noticeID }}.{{item.title}}
				</div>
				<div slot="empty">
					<div class="no-data">
						<div class="img"></div>
						<div>没有记录</div>
					</div>
				</div>
			</bt-scroller>
		</div>
  	</div>
</template>
<script>
import BtScroller from "btPlugins/btScroller";
import { XHeader } from 'vux';

let testJson = {
  code: 1,
  message: "成功!",
  object: [
    {
      FNewsTitle: "键盘上的小红点 时代妥协的产物还是经典的传承",
      FNewsSrc:
        "http://www.baidu.com/home/news/data/newspage?nid=14961581456476460806&n_type=0&p_from=1&dtype=-1",
      FNewsPic: "//www.baidu.com/img/bd_logo1.png",
      FNewsReleaseTime: "2017-10-13 00:00",
      noticeID: 1,
      publishTime: "2015-13-15 00:01",
      title: "111完成授信送现金！第三方发的撒发生发达 ",
      buyerName: "张三",
      picture: "",
      linkUrl: "",
      isRead: 0,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
      // },{
      //     "noticeID": 2,
      //     "publishTime": "2015-08-15 16:00",
      //     "title": "2完成授信送现金！",
      //     "buyerName": "张三",
      //     "picture": "",
      //     "linkUrl": "http://m.cheok.com",
      //     "isRead": 0,
      //     "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
      // },{
      //     "noticeID": 3,
      //     "publishTime": "2015-23-15 21:00",
      //     "title": "3完成授信送现金！",
      //     "buyerName": "张三",
      //     "picture": "",
      //     "isRead": 0,
      //     "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
      // },{
      //     "noticeID": 4,
      //     "publishTime": "2015-08-15 21:00",
      //     "title": "4完成授信送现金！",
      //     "buyerName": "张三",
      //     "picture": "",
      //     "isRead": 0,
      //     "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
      // },{
      //     "noticeID": 5,
      //     "publishTime": "2015-08-15 07:20",
      //     "title": "5完成授信送现金！",
      //     "buyerName": "张三",
      //     "picture": "",
      //     "isRead": 1,
      //     "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 6,
      publishTime: "2015-08-15 22:20",
      title: "6完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 7,
      publishTime: "2015-08-15 17:20",
      title: "7完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 8,
      publishTime: "2015-15-15 15:20",
      title: "8完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 9,
      publishTime: "2015-08-15 17:20",
      title: "7完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 10,
      publishTime: "2015-15-15 15:20",
      title: "8完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },
    {
      noticeID: 11,
      publishTime: "2015-08-15 17:20",
      title: "7完成授信送现金！",
      buyerName: "张三",
      picture: "",
      isRead: 1,
      summary:
        "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
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

export default {
  data() {
    return {
      isNoData: false, //无数据
      currentPage: 1,
      pageSize: GConfig.pageSize,
      totalPages: 0,
      articleList: []
    };
  },
  methods: {
    //读取数据
    getData() {
	  var _this = this;
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(testJson);
        }, 300);
      });

      // var promise = articleService.getArticleList({
      // 	currentPage: _this.currentPage,
      // 	pageSize: _this.pageSize
      // });

      promise.then(function(result) {
        if (result.code != 1) {
          new Say(result.message);
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
	},
	refresh(){
	  this.$refs.scroller.$base.triggerPullToRefresh();
	}
  },
  beforeMount() {
    this.$setTitle("滚动列表");
  },
  mounted() {
  },
  components: {
    BtScroller
  }
};
</script>
<style lang="less">
@import "~@/less/mixin.less";
@import "~@/less/variables.less";
.list-wrapper {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.vux-header{
	}
	.scroller-container {
		position: relative;
		flex: 1;
		h2 {
			//   float: right;
			color: #ff7c00;
			font-size: 18px;
			text-align: center;
		}
		.no-data {
			text-align: center;
		}
		button{
			border: 1px solid #ccc;
			text-align: center;
			padding: 3px 10px;
			border-radius: 3px;
			background: #fff;
			margin-left: 15px;
		}
	}
}
</style>
