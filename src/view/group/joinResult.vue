<template>
  <div class="group-join-result-wrapper">
    <div class="group-info-box">
      <template>
        <div class="success-header" v-if="data.isSuccess">
          <i class="success-icon"></i>
          <p class="success-hint">拼团成功！</p>
          <p class="member-count" v-if="data.groupUserList && data.groupUserList.length > 5">
            团队成员：<span>{{ data.groupUserList.length }}人</span>
          </p>
        </div>
      </template>

      <template v-if="!(!data.isGroupLeader && data.isSuccess)">
        <ul class="team-info-box"
            :class="{'normal-flex': aGroupUserList.length > 5, 'center-flex': aGroupUserList.length <= 5}">
          <li class="team-member" v-for="(gItem, gIndex) in aGroupUserList" :key="gIndex">
            <template v-if="!gItem.type">
              <div class="member-pic">
                <div class="img-box">
                  <img :src="gItem.portrait || defaultHeadPortrait" alt="">
                </div>
                <span class="leader-icon" v-if="gItem.isLeader">团长</span>
              </div>
              <p class="name">{{ gItem.userName }}</p>
            </template>
            <template v-else-if="gItem.type === 'add'">
              <div class="add-member"></div>
            </template>
            <template v-else-if="gItem.type === 'omit'">
              <div class="omit-member" @click="isShowAllGroupMember = true">
                <i></i><i></i><i></i>
              </div>
            </template>
          </li>
        </ul>
        <p class="invite-more" v-if="!data.isSuccess">还差<span class="cl-orange">{{ lackCount }}</span>人，赶快邀请好友来拼单吧</p>
        <button class="btn-invite" @click="doShare">{{ data.isSuccess ? '邀请更多好友' : '邀请好友拼单' }}</button>
        <template>
          <p class="share-benefit" v-if="!data.isSuccess && data.isGroupLeader">分享好友，更有抽奖好礼</p>
          <p class="share-benefit" v-else-if="!data.isSuccess && !data.isGroupLeader">开团成功，赢抽奖机会</p>
          <p class="share-benefit" v-else>每分享领取成功<span>1</span>人，多<span>1</span>次抽奖机会</p>
        </template>
      </template>

      <ul class="order-info">
        <li>
          <span class="desc">保险名称</span>
          <p class="content">{{ data.productName }}</p>
        </li>
        <li>
          <span class="desc">拼单时间</span>
          <p class="content">{{ data.createTime | dataFormat('yyyy/MM/dd hh:mm:ss')}}</p>
        </li>
        <li>
          <span class="desc">拼单提示</span>
          <p class="content">{{ data.tips }}</p>
        </li>
      </ul>
    </div>
    <!-- 产品推荐 -->
    <div class="product-recommend" v-if="!data.isSuccess && products && products.length">
      <h2>产品推荐</h2>
      <goods-item v-for="(gItem, gIndex) in products"
                  :key="gIndex"
                  :item-data="gItem"
                  :no-rebate="true"
                  @click="goToDetail"/>
    </div>
    <!-- 砸金蛋 -->
    <div v-if="data.isSuccess">
      <lottery/>
    </div>
  </div>
</template>

<script>
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import groupService from '@/api/groupService';
import lifeService from '@/api/lifeService';
import GoodsItem from  '@/components/GoodsItem.vue';
import lottery from '@/components/lottery';
import defaultHeadPortrait from '../../assets/images/group/img_boy@2x.png';
export default {
  name: 'joinResult',
  components: {GoodsItem, lottery},
  props: {},
  data() {
    return {
      groupId: null,
      data: {},
      defaultHeadPortrait: defaultHeadPortrait,
      lackCount: 0,
      isShowAllGroupMember: false,
      products: [],
      config: {
        shareUrl: '',
        // sharePhotos: location.origin + sharePic,
        shareTitle: "拼团免费领，百万医疗险免费送",
        shareDesc: "安心百万医疗·药神版免费领"
      }
    };
  },
  computed: {
    aGroupUserList() {
      let groupList = [];
      if (this.data.groupUserList && this.data.groupUserList.length) {
        groupList = [...this.data.groupUserList];
      }

      const addItem = { type: 'add' };
      const omitItem = { type: 'omit' };
      if (groupList.length < 3) {
        this.lackCount = 3 - groupList.length;
        // 不足3个队员，补充空位
        for(let i = 0; i < this.lackCount; i++) {
          groupList.push(addItem);
        }
      } else if (groupList.length <= 5 || this.isShowAllGroupMember) {
        groupList.push(addItem);
      } else {
        groupList.splice(5, groupList.length - 5, omitItem);
      }

      return groupList;
    }
  },
  methods: {
    // 设置微信分享
    wxconfig() {
      if (Util.userAgentType() == "wechat") {
        const btWechat = new WechatRegistrar();
        const shareConfig = {
          link: this.config.shareUrl,
          title: this.config.shareTitle,
          desc: this.config.shareDesc,
          // imgUrl: this.config.sharePhotos
        };

        btWechat
          .setConfig()
          .then(() => {
            wxShare(shareConfig);
          }).catch(e => {
            Toast(JSON.stringify(e));
        });
      }
    },
    pullData(id) {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      groupService.getGroupDetail({
        groupId: id || this.groupId
      }).then((data) => {
        Toast.clear();
        if (data.code === 1) {
          this.wxconfig();
          // console.log(data.object);
          this.data = data.object;

          if (!this.data.isSuccess) {
            this.getProducts();
          }
        } else {
          Toast(data.message);
        }
      });
    },
    getProducts() {
      const sendData = {
        tagId: 0,
        pageIndex: 1,
        pageSize: 3
      };
      lifeService.getGoodsList(sendData).then((data) => {
        if (data.code == 1) {
          // console.log(data);
          this.products = data.object || [];
        } else {
          Toast(data.message);
        }
      })
    },
    goToDetail(itemData) {
      const goodId = itemData.id;
      if (itemData.jumpType) {
        location.href = itemData.jumpAddress;
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
    },
    doShare () {
      Toast('点击右上角分享');
    },
    getGroup() {
      Toast.clear(); // 新账号第一次进的时候有个不知道哪来的toast，这里清一下
      groupService.getGroup().then((data) => {
        if (data.code == 1) {
          if (data.object && data.object.groupId) {
            // 当前账号的groupId和结果页的id不一致
            if (data.object.groupId != this.groupId) {
              this.config.shareUrl = location.protocol + '//' + location.host + '/group/join_group?groupId=' + data.object.groupId;
              this.pullData(data.object.groupId)
            } else {
              this.pullData();
            }
          } else { // 没有返回当前账号的groupId,去参团页
            if (this.groupId) {
              btPage.open({
                url: '/group/join_group',
                container_style: 1,
                type: 1,
                params: {
                  groupId: this.groupId,
                }
              });
            } else {
              this.$router.replace({ name: "groupEmpty"});
            }
          }
        } else {
          Toast(data.message);
        }
      });
    }
  },
  created() {
    this.groupId = this.$route.query.id || null;
    this.config.shareUrl = location.protocol + '//' + location.host + '/group/join_group?groupId=' + this.groupId;
    this.getGroup();
  },
  mounted() {
    setPageTitle('开团');
  },
  beforeDestroy() {
    // this.endCountDown();
  }
};
</script>

<style lang="less">
  @import "../../assets/less/global";
  .group-join-result-wrapper {
    max-width: 100vw;
    overflow-x: hidden;

    .group-info-box {
      background: #fff;
      border-radius: 5px;
      margin: 12px 12px 10px;
      padding: 0 10px 12px;

      .success-header {
        &:before {
          content: '';
          display: table;
        }
        .success-icon {
          display: block;
          .wh(61px, 74px);
          margin: 15px auto 8px;
          .bg-img-set('~@/assets/images/group/icon_right@2x.png', '~@/assets/images/group/icon_right@3x.png', 100%, 100%);
        }
        p.success-hint{
          .font(18px, #333, center, 25px);
        }
        p.member-count {
          margin-top: 15px;
          .font(16px, #666, center, 22px);

          span {
            color: #333;
          }
        }

      }
      .team-info-box {
        padding-top: 20px;
        padding-bottom: 5px;

        &.center-flex {
          .flex-h-center;

          .team-member {
            &:not(:last-child) {
              margin-right: 15px;
              @media screen and (max-width: 360px) {
                margin-right: 5px;
              }
            }
          }
        }
        &.normal-flex {
          display: flex;
          flex-wrap: wrap;

          .team-member {
            &:not(:nth-child(6n)) {
              margin-right: 15px;
              @media screen and (max-width: 360px) {
                margin-right: 4px;
              }
            }
          }
        }

        .team-member {
          margin-bottom: 15px;

          .member-pic {
            position: relative;
            .square(42px);
            margin-bottom: 15px;

            .img-box {
              display: block;
              box-sizing: content-box;
              .square(40px);
              border-radius: 50%;
              border: 1px solid #ffd050;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }
            .leader-icon {
              display: block;
              .wh(40px, 17px);
              .font(11px, #7f3300, center, 17px);
              background: #ffd14f;
              border-radius:9px;
              border:1px solid rgba(255,255,255,1);
              .position2(absolute, top, 36px, left, 1px);
            }
          }
          .name {
            max-width: 42px;
            .font(12px, #666, center, 17px);
          }
          .add-member {
            .square(42px);
            border-radius: 50%;
            border:1px dashed rgba(199,199,199,1);
            .bg-img-set('~@/assets/images/group/wenhao@2x.png', '~@/assets/images/group/wenhao@3x.png', 13px, 22px);
          }
          .omit-member {
            height: 42px;
            .flex-v-center;
            i {
              display: inline-block;
              .square(6px);
              border-radius: 50%;
              background: #d8d8d8;

              &:not(:last-child) {
                margin-right: 5px;
              }
            }
          }
        }
      }
      .invite-more {
        .font(16px, #464646, center, 22px);
        margin-bottom: 20px;
      }
      .btn-invite {
        display: block;
        width: 100%;
        height: 45px;
        background:linear-gradient(270deg,rgba(255,90,25,1) 0%,rgba(253,167,57,1) 100%);
        box-shadow:0 2px 4px 0 rgba(246,124,40,0.3);
        border-radius:25px;
        margin-bottom: 15px;
        .font-core(16px, #fff);
      }
      .share-benefit {
        .font(16px, #666, center, 22px);

        span {
          color: #fc6b47;
        }
      }
      .order-info {
        .half-border(top, #ddd);
        padding-top: 15px;
        margin-top: 20px;

        li {
          display: flex;
          &:not(:last-child) {
            margin-bottom: 10px;
          }

          .desc {
            width: 56px;
            flex-shrink: 0;
            .font(14px, #666, left, 20px);
            margin-right: 10px;
          }
          .content {
            flex-grow: 1;
            .font(14px, #333, right, 20px);
          }
        }
      }
    }
    .product-recommend {
      h2 {
        padding: 10px 15px 0;
        .font(17px, #464646, left, 24px);
        background: #fff;

        &:before {
          content: '';
          display: inline-block;
          .wh(3px, 14px);
          background: #fd9239;
          border-radius: 2px;
          margin-right: 8px;
          position: relative;
          top: 1px;
        }
      }
    }
  }
</style>
