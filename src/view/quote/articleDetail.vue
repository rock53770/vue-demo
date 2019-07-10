<template>
  <div class="article-detail-wrapper">
    <div class="section">
      <h2 class="article-head">{{articleDetail.title}}</h2>
      <p class="create-time" v-if="articleDetail.createTime">{{articleDetail.createTime | dataFormat('M月d日') }}</p>
      <div class="tags" v-if="tags">
        <span class="tag" v-for="(tag, index) in tags" :key="index">{{tag}}</span>
      </div>
      <div class="news-content of-hide mce-content-body" v-html="articleDetail.content"></div>
    </div>
    <div class="footer-gap" v-if="!isPreview"></div>
    <div class="article-footer" v-if="!isPreview">
      <div class="like" @click="changeLike">
        <i class="icon" :class="{'liked': articleDetail.isLike}"></i>点赞<span v-if="articleDetail.likeNum">({{articleDetail.likeNum}})</span>
      </div>
      <div class="share" @click="shareWechat">
        <i class="icon"></i>分享
      </div>
    </div>
  </div>
</template>

<script>
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import articleService from '../../api/articleService';
export default {
  name: 'articleDetail',
  data() {
    return {
      id: null,
      articleDetail: {},
      config: {
        sharePhotos: "",
        shareTitle: "",
        shareDesc: "",
        shareUrl: ""
      },
      isInWx: false,
      isWxShareReady: false,
      isPreview: false // 是否预览模式
    };
  },
  computed: {
    tags: function () {
      if (this.articleDetail.keywords && this.articleDetail.keywords.length) {
        return this.articleDetail.keywords.split(',');
      }
      return null;
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.isPreview = !!parseInt(this.$route.query.isPreview);
    this.getDetail();
  },
  mounted() {
    setPageTitle('文章详情');
  },
  methods: {
    // 设置微信分享
    wxconfig() {
      let ua;
      if (typeof window !== "undefined") {
        ua =
          ("navigator" in window &&
            "userAgent" in navigator &&
            navigator.userAgent.toLowerCase()) ||
          "";
      }
      if (ua.includes("micromessenger")) {
        this.isInWx = true;
        const btWechat = new WechatRegistrar();
        const shareConfig = {
          title: this.config.shareTitle,
          desc: this.config.shareDesc,
          link: this.config.shareUrl,
          imgUrl: this.config.sharePhotos
        };

        btWechat
          .setConfig()
          .then(() => {
            // console.log('wx config success');
            wxShare({ ...shareConfig });
            this.isWxShareReady = true;
          })
          .catch(rej => {
            // console.log('wx config failed, try again');
            btWechat.setConfig().then(() => {
              // console.log('wx config success, 1');
              wxShare({ ...shareConfig });
              this.isWxShareReady = true;
            });
          });
      }
    },
    getDetail() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      let $promise = null;
      if (this.isPreview) {
        // console.log('is preview');
        $promise = articleService.getPreviewDetail({ id: this.id });
      } else {
        $promise = articleService.getDetail({
          id: this.id,
          terraceId: 2 // 1:新欣保 2:星利
        });
      }

      $promise.then(data => {
        Toast.clear();
        if (data.code == 1) {
          // console.log(data);
          const obj = data.object;
          this.articleDetail = obj;
          this.config = {
            sharePhotos: obj.sharePhotos,
            shareTitle: obj.shareTitle,
            shareDesc: obj.shareDesc,
            shareUrl: obj.shareUrl
          };
          !this.isPreview && this.wxconfig();
        } else {
          Toast(data.message);
        }
      })
    },
    changeLike() {
      if (this.articleDetail.isLike) {
        this.cancelLike();
      } else {
        this.doLike();
      }
    },
    doLike() {
      Toast.loading({
        mask: true,
        message: '点赞中...',
        duration:0
      });
      articleService.doLike({
        articleId: this.id,
        terraceId: 2
      }).then(data => {
        Toast.clear();
        if (data.code == 1) {
          this.articleDetail.isLike = !this.articleDetail.isLike;
          this.articleDetail.likeNum = data.object;
          Toast.success('成功');
        } else {
          Toast(data.message);
        }
      })
    },
    cancelLike() {
      Toast.loading({
        mask: true,
        message: '取消中...',
        duration:0
      });
      articleService.cancelLike({
        articleId: this.id,
        terraceId: 2
      }).then(data => {
        Toast.clear();
        if (data.code == 1) {
          this.articleDetail.isLike = !this.articleDetail.isLike;
          this.articleDetail.likeNum = data.object;
          Toast('已取消');
        } else {
          Toast(data.message);
        }
      })
    },
    // 分享到朋友圈
    shareWechat() {
      if (GConfig.isInApp) {
        let param = {
          ...this.config,
          // sharePhotos: this.config.sharePhotos,
          // shareTitle: this.config.shareTitle,
          // shareDesc: this.config.shareDesc,
          // shareUrl: this.config.shareUrl,
          sharePlatform: 4,
          shareInfoType: 3
        };
        wv.shareInfo(param, function(res) {
          if (res.status == 1) {
            // console.log('​shareWechat -> 分享success')
          } else {
            // console.log('​shareWechat -> 分享成功error')
          }
        });
      } else if (this.isInWx && this.isWxShareReady) {
        Toast('请点击右上角进行分享');
      } else if (!this.isInWx) {
        Toast('请在微信中分享');
      } else {
        Toast('暂时无法分享，请刷新页面或稍后再试');
      }
    },
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .article-detail-wrapper {
    background: white;

    .section {
      .article-head {
        padding: 20px 15px;
        .font(22px, #464646, justify, 30px, bold);
      }
      .create-time {
        .font(14px, #999, left, 20px);
        margin:0 15px 15px;
      }
      .tags {
        padding: 0 15px 24px;
        .tag {
          display: inline-block;
          padding: 0 15px;
          height: 30px;
          border-radius: 15px;
          background: #f5f5f5;
          margin-right: 8px;
          .font(14px, #4c4c4c, center, 30px);
        }
      }
      .news-content {
        padding: 0 20px;
      }
    }
    .footer-gap {
      height: 50px;
    }
    .article-footer {
      background-color: white;
      .wh(100%, 50px);
      .position2(fixed, bottom, 0, left, 0);
      display: flex;
      justify-content: center;

      .like, .share {
        height: 50px;
        display: flex;
        align-items: center;
        .font-core(16px, #666);
      }
      .like {
        margin-right: 40px;
        .icon {
          margin-right: 6px;
          .square(20px);
          .bg-img-set('~@/assets/icons/icon_fenxiang_zan@2x.png','~@/assets/icons/icon_fenxiang_zan@3x.png', 100%, 100%);

          &.liked {
            .bg-img-set('~@/assets/icons/icon_fenxiang_zan_blue@2x.png','~@/assets/icons/icon_fenxiang_zan_blue@3x.png', 100%, 100%);
          }
        }
      }
      .share {
        .icon {
          margin-right: 6px;
          .square(24px);
          .bg-img-set('~@/assets/icons/icon_pengyouquan@2x.png','~@/assets/icons/icon_pengyouquan@3x.png', 100%, 100%);
        }
      }
    }
  }
</style>
