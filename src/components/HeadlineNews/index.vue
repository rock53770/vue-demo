<template>
  <div class="quote-headline-wrapper">
    <h3 class="pt10 pb10 plr15 ft17">星利头条</h3>
    <section>
      <van-list v-model="loading"
                :finished="finished"
                :error.sync="error"
                finished-text="没有更多了"
                error-text="请求失败，点击重新加载"
                @load="getData">
        <div class="news-item van-hairline--bottom"
             v-for="(item, index) in articleList"
             :key="index"
             @click="goToDetail(item.id)">
          <div class="left-item">
            <h3 class="news-title">{{item.title}}</h3>
            <p class="interaction">
            <span class="watched">
              <van-icon class="icon" name="eye-o" />{{item.readNum}}
            </span>
              <span class="liked">
              <i class="icon"></i>{{item.likeNum}}
            </span>
            </p>
          </div>
          <div class="right-item" v-if="item.imgSrc">
            <img :src="item.imgSrc" height="70" width="110" class="bdr5 img-cov">
          </div>
        </div>
      </van-list>
    </section>
  </div>
</template>

<script>
import articleService from '../../api/articleService';

export default {
  name: 'headlineNews',
  components: {},
  props: {},
  data() {
    return {
      articleList: [],
      currentPage: 0,
      pageSize: 8,
      loading: false,
      finished: false,
      error: false
    };
  },
  computed: {},
  created() {},
  methods: {
    getData() {
      let sendData = {
        pageIndex: this.currentPage + 1,
        pageSize: this.pageSize,
        terraceId: 2 // 1:新欣保 2:星利
      };

      articleService.getList(sendData).then(data => {
        this.loading = false;
        if (data.code == 1) {
          if (this.currentPage == 1) {
            this.articleList = data.object;
          } else {
            this.articleList = [
              ...this.articleList,
              ...data.object
            ];
          }
          if(!data.page.hasNextPage) {
            this.finished = true;
          }
        } else {
          this.error = true;
          Toast(data.message);
        }
      }).catch(() => {
        this.loading = false;
        this.error = true;
      })
    },
    goToDetail(id) {
      btPage.open({
        url: '/article/detail',
        container_style: 1,
        params: { id },
      })
    }
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";

  @c46: #464646;
  .quote-headline-wrapper {
    background: white;
    margin-bottom: 10px;
    header {
      height: 34px;
      padding: 0 15px;
      .font(17px, @c46, left, 34px, bold);
    }
    section {
      position: relative;

      .news-item {
        display: flex;
        padding: 14px 0;
        margin: 0 15px;

        .left-item {
          flex-grow: 1;

          .news-title {
            .font(16px, @c46, justify, 20px, bold);
            margin-bottom: 15px;
          }
          .interaction {
            .font(12px, #999, left, 17px);

            .icon {
              margin-right: 4px;
              font-size: 14px;
            }
            .watched {
              margin-right: 15px;
              .icon {
                position: relative;
                top: 2px;
              }
            }
            .liked {
              .icon {
                display: inline-block;
                .square(12px);
                background: url("~@/assets/icons/icon_zan@2x.png") no-repeat center center;
                background-size: 100% 100%;
              }
            }
          }
        }
        .right-item {
          margin-left: 24px;
          flex-shrink: 0;
          flex-grow: 0;
          .wh(110px, 70px);
          border-radius: 5px;
          overflow: hidden;
        }
      }
    }
  }
</style>
