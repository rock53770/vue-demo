<template>
  <div class="group-home-wrapper">
    <header class="group-info">
      <p class="received-count">
        <van-icon name="volume-o" size="12px" color="#fff"/>已有<span>{{ receivedCount }}</span>人拼团成功，免费领取赠险
      </p>
      <p class="rule-entry" @click="isShowRule = true">活动<br>规则</p>
      <div>
        <div class="welfare" v-for="(wItem, wIndex) in welfares" :key="wIndex">
          <h4><span>{{ wItem.index }}</span>{{ wItem.title }}</h4>
          <p>{{ wItem.desc }}</p>
        </div>
        <div class="welfare prize-box">
          <h3>抽奖奖品</h3>
          <ul class="prize-list">
            <li>
              <img src="../../assets/images/group/pz1.png" alt="">
              <h5>一等奖</h5>
              <p>安心百万医疗·药神版全年免费券</p>
            </li>
            <li>
              <img src="../../assets/images/group/pz2.png" alt="">
              <h5>二等奖</h5>
              <p>港澳游旅游卡</p>
            </li>
            <li>
              <img src="../../assets/images/group/pz3.png" alt="">
              <h5>三等奖</h5>
              <p>安心百万医疗·药神版1月免费券</p>
            </li>
          </ul>
        </div>
      </div>
      <h2 class="gift-detail-title">保障详情</h2>
    </header>
    <section class="gift-detail">
      <div class="gift-item">
        <h3 class="title">安心1号·百万医疗</h3>
        <p class="val-detail val-detail-title">
          <span class="desc">保障计划</span>
          <a href="https://m.95303.com/health/desc/plandetail/ysb_dianshang/11" class="value">查看详情</a>
        </p>
        <p class="val-detail" v-for="(dItem, dIndex) in anxinDetail" :key="dIndex">
          <span class="desc">{{ dItem.desc }}</span>
          <span class="value">{{ dItem.value }}</span>
        </p>
        <p class="note">
          *<a v-for="(gItem, gIndex) in giftAgreements" :key="gIndex" :href="gItem.url">《{{ gItem.name }}》</a>
        </p>
      </div>
      <div class="gift-features">
        <h3>保障特点</h3>
        <ul>
          <li v-for="(fItem, fIndex) in giftFeatures" :key="fIndex">
            <h4 v-html="fItem.title"></h4>
            <p v-html="fItem.desc"></p>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class="btn-box">
        <a href="/quote" class="btn-home">
          <van-icon name="wap-home" size="16px" color="#666"/>
          <p>首页</p>
        </a>
        <a href="tel:4006038787" class="btn-contact">
          <van-icon name="service-o" size="16px" color="#666"/>
          <p>客服</p>
        </a>
        <div class="btn-book" @click="goGetInsurance">
          开团发起拼单
          <p>（￥154.00元起/首月保费免费送）</p>
        </div>
      </div>
    </footer>

    <!-- 活动规则 -->
    <div class="rule-box" v-if="isShowRule" @click.self="isShowRule = false">
      <div class="rule-content">
        <h2>活动规则</h2>
        <ul class="rule-list">
          <li>本次赠险活动，3人以上组团即可免费领取，满3人后可继续领取，无人数限制；</li>
          <li>组团成功后，继续分享个人专属赠险链接，每多一个人领取，团长即送一次抽奖机会；</li>
          <li>通过团长邀请链接领取赠险的用户，后续有购买保险的，团长可享受8%以上的推广奖励，上不封顶，领取出单奖励需通过保险代理人备案<a href="/my">（戳我去认证）</a></li>
          <li>本次活动赠送产品为安心1号·百万医疗药神版，最高保障额度630.5万，赠险期限1个月，具体保障范围以产品条款为准； </li>
          <li>本次活动最终解释权归所有，活动咨询：18667908773（微信同号）。 </li>
        </ul>
      </div>
    </div>

    <div class="my-group-icon" @click="getGroup"></div>
  </div>
</template>

<script>
import groupService from '@/api/groupService';
export default {
  name: 'groupHome',
  data() {
    return {
      receivedCount: 0, // 已拼团成功人数
      isShowRule: false,
      welfares: [
        {
          index: '福利一',
          title: '朋友免费领 团长抽大奖',
          desc: '3人以上组团即可免费领取，每多一个人领取，团长即送一次抽奖机会，最高享全年保费免单机会。'
        },{
          index: '福利二',
          title: '团员买保险 团长拿奖励',
          desc: '通过团长邀请链接领取赠险的用户，后续购买保险，团长可享8%以上的推广奖励，上不封顶。'
        },{
          index: '福利三',
          title: '专业客服 保险买卖更简单',
          desc: '团长通过赠险发现有保险需求的用户，专业客服实时解答用户疑问，将合适的保险推荐给需要的用户。'
        }
      ],
      anxinDetail: [
        { desc: '一般医疗保险金', value: '300万' },
        { desc: '恶性肿瘤医疗保险金', value: '300万' },
        { desc: '院外靶向药报销', value: '30万' },
        { desc: '异地转诊交通费', value: '5000元' },
      ],
      giftAgreements: [
        { name: '投保须知', url: 'https://m.95303.com/health/desc/page/6/ysb_dianshang'},
        { name: '保险条款', url: 'https://static.95303.com/pdf/common/pdf/pdf.html?file=https://static.95303.com/pdf/terms/ysb/ysbbxtk2018.pdf'},
        { name: '投保声明', url: 'https://m.95303.com/health/desc/page/4/ysb_dianshang'},
        { name: '常见问题', url: 'https://m.95303.com/health/desc/commenqa/ysb_dianshang'}
      ],
      giftFeatures: [
        {
          title: '大病小病<br/>全覆盖',
          desc: '年度保额630.5万<br/>不限病种<br/>恶性肿瘤0元起赔'
        },
        {
          title: '市场领先<br/>院外靶向药报销',
          desc: '院外购买靶向药费用<br/>年度最高可报销30万<br/>治疗更安心'
        },
        {
          title: '恶性肿瘤住院不用<br/>愁专人垫付医药费',
          desc: '覆盖全国25个省市<br/>207家医院，恶性肿瘤住院治疗可享受直付服务'
        },
        {
          title: '异地就医<br/>看病更省心',
          desc: '恶性肿瘤异地就医转诊交通费5000元/年，社保异<br/>地就医也可100%赔付'
        }
      ]
    };
  },
  methods: {
    initReceivedCount() {
      let oReceived = Util.getLocalData('__p_group_received__');
      if (oReceived) {
        const oldTime = new Date(oReceived.updateTime);
        const newTime = new Date();
        const updateDays = ((newTime.getTime() - oldTime.getTime()) / (24 * 60 * 60 * 1000)) ^ 0;
        if (updateDays) {
          // 过去好几天
          oReceived.count += updateDays * ((Math.random() * 100 + 100) ^ 0);
        } else {
          // 同一天内, 每次增加3~12人
          oReceived.count += (Math.random() * 9 + 3) ^ 0;
        }
        oReceived.updateTime = newTime.getTime();
      } else {
        oReceived = {
          updateTime: new Date().getTime(),
          count: (Math.random() * 100 + 300) ^ 0
        };
      }

      this.receivedCount = oReceived.count;
      Util.setLocalData('__p_group_received__', oReceived);
    },
    goGetInsurance() {
      btPage.open({
        url: '/group/leader',
        container_style:1
      })
    },
    getGroup() {
      btPage.open({
        url: '/group/join_result',
        container_style: 1
      });
      // Toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration: 0,
      // });
      //
      // groupService.getGroup().then((data) => {
      //   Toast.clear();
      //   if (data.code == 1) {
      //     if (data.object && data.object.groupId) {
      //       btPage.open({
      //         url: '/group/join_result',
      //         container_style: 1,
      //         params: {
      //           id: data.object.groupId,
      //         }
      //       });
      //     } else {
      //       btPage.open({
      //         url: '/group/empty',
      //         container_style: 1
      //       });
      //     }
      //   } else {
      //     Toast(data.message);
      //   }
      // });
    }
  },
  created() {
    this.initReceivedCount();
    // this.getGroup();
  },
  mounted() {
    setPageTitle('拼团保险免费领');
  },
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  @c_orange: #FA553C;
  .group-home-wrapper {
    .group-info {
      height: auto;
      padding: 340px 17px 0;
      background: #FDE282 url("../../assets/images/group/index_banner.png") no-repeat top left;
      background-size: 100% auto;
      position: relative;

      .received-count {
        width: 100%;
        .font-core(12px, #fff);
        .position2(absolute, top, 6px, left, 0);
        .flex-all-center;

        i {
          margin-right: 5px;
        }
        span {
          color: #fef28a;
        }
      }
      .rule-entry {
        width: 42px;
        border-top-left-radius: 18px;
        border-bottom-left-radius: 18px;
        padding: 5px 0 5px 13px;
        background:linear-gradient(90deg,rgba(245,82,49,1) 0%,rgba(255,110,20,1) 100%);
        .font(12px, #fff, left, 12px);
        .position2(absolute, top, 13px, right, 0);
      }
      .welfare {
        background: #fff;
        border-radius: 5px;
        padding-top: 11px;

        &:not(:last-child) {
          margin-bottom: 10px;
        }
        h4 {
          .flex-v-center;
          .font-core(16px, @c_orange);
          margin-bottom: 14px;

          span {
            width:60px;
            height:25px;
            margin-right: 12px;
            background:linear-gradient(-90deg,rgba(252,80,41,1) 0%,rgba(254,188,61,1) 100%);
            border-radius: 0 5px 5px 0;
            .font(15px, #fff, center, 25px, bold);
          }
        }
        >p {
          padding: 0 20px 16px;
          .font(14px, #464646, justify, 21px);
        }
      }
      .prize-box {
        position: relative;
        margin-top: 16px;

        h3 {
          .wh(137px, 40px);
          background:linear-gradient(90deg,rgba(245,82,49,1) 0%,rgba(255,110,20,1) 100%);
          box-shadow:0 4px 6px 0 rgba(0,0,0,0.08);
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          .font(20px, #fff, center, 40px);
          .position2(absolute, top, -6px, left, 50%);
          transform: translateX(-50%);
        }
        .prize-list {
          display: flex;
          justify-content: space-around;
          padding: 40px 0 10px;

          li {
            width: 104px;
            @media screen and (max-width: 340px) {
              width: 90px;
            }

            img {
              display: block;
              .wh(100%, 65px);
              @media screen and (max-width: 340px) {
                height: 56px;
              }
              border-radius: 5px;
              margin-bottom: 7px;
            }
            h5 {
              .font(13px, #fa553c, center, 13px, bold);
              margin-bottom: 5px;
            }
            p {
              .font(10px, #666, center, 14px);
            }
          }
        }
      }
      .gift-detail-title {
        .wh(100%, 50px);
        .flex-all-center;
        .font-core(20px, @c_orange);

        &:before, &:after {
          content: '';
          .wh(33px, 12px);
          margin: 0 15px;
        }
        &:before {
          background: url("../../assets/images/gift/bg_dot_left.png") no-repeat center center;
          background-size: 100% 100%;
        }
        &:after {
          background: url("../../assets/images/gift/bg_dot_right.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    .gift-detail {
      background-color: #fff;

      .gift-item {
        .title {
          .font(19px, #333, center, 19px, bold);
          padding: 15px 0 8px;
        }
        .val-detail {
          .flex-v-center;
          justify-content: space-between;
          margin: 0 15px;
          .half-border(bottom, #ddd);
          height: 32px;

          .desc {
            .font-core(14px, #999);
          }
          .value {
            .font-core(14px, #333);
          }

          &.val-detail-title {
            height: 35px;
            .desc {
              .font-core(15px, #333);
              font-weight: bold;
            }
            .value {
              .font-core(15px, #3e9cff);
            }
          }
        }
        .note {
          .font(12px, #fd9239, justify, 16px);
          padding: 10px 15px 20px;
          a {
            color: #fd9239;
          }
        }
      }
      .gift-features {
        padding: 0 17px;

        >h3 {
          .font-core(18px, #333);
          margin-bottom: 15px;
        }
        ul {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          li {
            width: 47.8%;
            flex-shrink: 0;
            box-shadow:0 0 7px 1px rgba(190, 190, 190, 0.35);
            border-radius: 8px;
            margin-bottom: 15px;

            h4 {
              .font(17px, #ff6633, center, 21px);
              padding: 20px 0 17px;
            }
            p {
              .font(13px, #666, center, 18px);
              padding: 0 5px 22px;
            }
            &:nth-child(2), &:nth-child(3) {
              h4 {
                color: #1bc5e0;
              }
            }
          }
        }
      }
    }
    footer {
      .wh(100%, 50px);

      .btn-box {
        .wh(100%, 50px);
        background: #fff;
        .position2(fixed, bottom, 0, left, 0);
        .flex-v-center;

        a {
          p {
            .font-core(12px, #666);
            margin-top: 5px;
          }
          &.btn-home {
            width: 50px;
            flex-shrink: 0;
            text-align: center;
            .half-border(right, #ddd);
            p {
              text-align: center;
            }
          }
          &.btn-contact {
            flex-grow: 1;
            i {
              margin-left: 15px;
            }
            p {
              margin-left: 12px;
            }

          }
        }
        .btn-book {
          flex-shrink: 0;
          .wh(187px, 50px);
          background:linear-gradient(90deg,rgba(253,167,57,1) 0%,rgba(255,90,25,1) 100%);
          padding-top: 7px;
          .font(17px, #fff, center, 18px);

          p {
            padding-top: 6px;
            .font(12px, #fff, center, 12px);
          }
        }
      }
    }
    .rule-box {
      .wholeScreen(100);
      background: rgba(0, 0, 0, 0.5);
      .flex-all-center;

      .rule-content {
        width: 340px;
        @media screen and (max-width: 340px) {
          width: 290px;
        }
        background: #fff;
        border-radius: 15px;
        position: relative;

        h2 {
          .wh(137px, 40px);
          background:linear-gradient(90deg,rgba(245,82,49,1) 0%,rgba(255,110,20,1) 100%);
          box-shadow:0 4px 6px 0 rgba(0,0,0,0.08);
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          .font(20px, #fff, center, 40px);
          .position2(absolute, top, -6px, left, 50%);
          transform: translateX(-50%);
        }
        .rule-list {
          padding: 54px 20px 4px 25px;

          li {
            .font(14px, #666, justify, 19px);
            margin-bottom: 13px;
            position: relative;

            &:before {
              content: '';
              display: block;
              .square(4px);
              background: #f86a30;
              border-radius: 50%;
              .position2(absolute, top, 6px, left, -12px);
            }
            a {
              color: #318eff;
            }
          }
        }
      }
    }
    .my-group-icon {
      .square(62px);
      .bg-img-set("../../assets/images/group/icon_chexian@2x.png", "../../assets/images/group/icon_chexian@3x.png", 100%, 100%);
      .position2(fixed, bottom, 100px, right, 10px);
    }
  }
</style>
