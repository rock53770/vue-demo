<template>
    <div class="container">
        <div class="bg-white pt15 pb10 plr12 pos-f l0 r0 mb10" :style="{ top: navHeight + 'px' }">
            <div class="flex-center justify-c ft16 cl-black bg-white ta-c mb15">
                <div class="w-50">
                    <div class="mb10">本月收入</div>
                    <div class="cl-orange ft18 fw-b">{{ count.month }}</div>
                </div>
                <div class="w-50">
                    <div class="mb10">总收入</div>
                    <div class="cl-orange ft18 fw-b">{{ count.total }}</div>
                </div>
            </div>
            <div class="m-search flex-center justify-c">
                <div class="time-ipt ft16 u-btn mr10" @click="select(1)">
                {{ $util.formatDate(new Date(timer.startDate ),
                "yyyy-MM-dd") }}
                </div>
                <span>至</span>
                <div class="time-ipt ft16 u-btn ml10" @click="select(2)">{{ timer.endDate }}</div>
                <div class="u-sch ft16 cl-white u-btn ml10" @click="renovate">查询</div>
            </div>
        </div>
        <div class="info-srcoller flex-1 w-100 pos-f l0 r0 b0 mt10" :style="{ top: (navHeight + 130) + 'px' }">
            <template v-if="list.length">
                <scroller :height="'100%'" :noDataText="'我是有底线的'" :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
                    <div class="plr15 bg-white" v-for="(item, index) in list" :key="index">
                        <div class="pt12 pb12 van-hairline--bottom flex-center justify-sb">
                            <div class="flex-center">
                                <img :src="item.teamIcon" height="45" width="45" class="bdr-50">
                                <div class="ml15">
                                    <p class="ft16 fw-b mb5">{{ item.name }}</p>
                                    <p class="ft14 mb5"><span>{{ item.relationType | type }}</span><span v-if="item.relationType !== 4" class="ml10">{{ item.orderAmount | currency2 }}元</span></p>
                                    <p class="ft12 cl-gray mb5">{{ $util.formatDate(item.createTime, 'yyyy-MM-dd HH:mm') }}</p>
                                </div>
                            </div>
                            <div class="ft18 cl-orange">{{ 0>item.contributionAmount ? '': '+' }}{{ item.contributionAmount | currency2() }}</div>
                        </div>
                    </div>
                </scroller>
            </template>
            <template v-else>
                <div class="ta-c" style="padding-top: 80px;">
                    <img src="../../assets/icons/team/img_results@3x.png" style="width:140px;height:95px;">
                    <div class="cl-gray ft16 mt15">还没有业绩明细哟，快去开团赚奖励吧~</div>
                </div>
            </template>
        </div>

        <van-popup v-model="show" position="bottom" :overlay="true">
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            @cancel="closePop"
            @confirm="confirmDate"
        />
        </van-popup>
    </div>
</template>
<script>
import myService from "../../api/myService.js";
import teamService from "../../api/teamService";

export default {
    name: "teamAchieve",
    data() {
        return {
            count: {},
            list: [],
            timer: {
                startDate: null,
                endDate: Util.formatDate(new Date(), "yyyy-MM-dd")
            },
            hasNextPage: false,
            pageIndex: 1,
            pageSize: 20,
            isLoad: false,
            show: false,
            currentDate: new Date(),
            userInfo: {},
            registe: "",
            navHeight:Util.getNavHeight(),
        };
    },
    methods: {
        renovate() {
            Toast.loading({
				mask: true,
				message: '加载中...'
			});
            let self = this;
            let param = {
                startTime: this.timer.startDate,
                endTime: this.timer.endDate,
                pageIndex: 1,
                pageSize: 20
            };
            let $promises = teamService.teamAchieve(param);
            $promises.then(res => {
                Toast.clear();
                if (res.code == 1) {
                    self.list = res.object.page.rows;
                    self.hasNextPage = res.object.page.hasNextPage;
                    self.count = {
                        month: res.object.monthIncome,
                        total: res.object.totalIncome
                    }
                } else {
                    Toast(res.message);
                }
            });
            return $promises;
        },
        getList() {
            let self = this;
            let param = {
                startTime: this.timer.startDate,
                endTime: this.timer.endDate,
                pageIndex: this.pageIndex,
                pageSize: 20
            };
            let $promises = teamService.teamAchieve(param);
            $promises.then(res => {
                if (res.code) {
                    self.list = [...self.list, ...res.object.page.rows];
                    self.hasNextPage = res.object.page.hasNextPage;
                } else {
                    Toast(res.message);
                }
            });
            return $promises;
        },
        select(n) {
            this.show = true;
            this.timer.id = n;
        },
        closePop() {
            this.show = false;
        },
        confirmDate(e) {
            let picker = +new Date(e), // 选择日期
                str = Util.formatDate(picker, "yyyy-MM-dd"), // 日期格式化
                pickerDate = +new Date(str), // 选择日期utc
                star = +new Date(this.registe), // 开始时间utc
                end = +new Date(),
                timerStart = +new Date(this.timer.startDate),
                timerEnd = +new Date(this.timer.endDate);

            if (this.timer.id == 1) {
                if (pickerDate >= star) {
                    if (pickerDate > end || pickerDate > timerEnd) {
                        Toast("起始时间不可晚于结束时间");
                    } else {
                        this.timer.startDate = str;
                    }
                } else {
                    Toast("起始时间不早于团队创建日期！");
                }
            } else {
                if (pickerDate <= end) {
                    if ((pickerDate < star) && (pickerDate < timerStart)) {
                        Toast("结束时间不可早于起始时间");
                    } else {
                        this.timer.endDate = str;
                    }
                } else {
                    Toast("结束时间不可晚于今天");
                }
            }
            this.show = false;
        },
        getUserInfo() {
            myService.userAgent()
                .then((res) => {
                    if (res.code == 1) {
                        this.userInfo = res.object.userAgentInfoVo
                        this.timer.startDate = Util.formatDate(this.userInfo.teamCreatedTime, "yyyy-MM-dd");
                        this.registe = Util.formatDate(this.userInfo.teamCreatedTime, "yyyy-MM-dd");
                        this.renovate();
                    }
                })
        },
        refresh(done) {
            setTimeout(() => {
                this.renovate()
                done();
            }, 1000);
        },
        infinite(done) {
            let self = this;
            if (!self.hasNextPage) {
                done(true);
            } else {
                self.pageIndex++;
                self.getList();
                self.$refs.scroller.finishInfinite(true);
            }
        }
    },
    filters: {
        type(data) {
            switch(data) {
                case 1:
                    return '[寿险出单]';
                case 2:
                    return '[车险出单]';
                case 3:
                    return '[个险出单]';
                case 4:
                    return '[团队创建活动]';
            }
        }
    },
    created() {
        this.getUserInfo();
        Toast.loading({
                mask: true,
                message: "加载中..."
            });
        setPageTitle("团队业绩");
    }
};
</script>
<style lang="less">
.time-ipt {
  width: 120px;
  color: #97999b;
  border: 1px solid #e7e7e7;
}

.u-sch {
  width: 65px;
  background: linear-gradient(to right, #fc6b47, #ff8526);
}

.u-btn {
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  text-align: center;
}

.avatar {
  height: 45px;
  width: 45px;
  border: 1px solid #f5f5f5;
}

.info-srcoller {
  height: calc(100vh - 130px);
  .loading-layer {
    .no-data-text {
      &::after {
        position: absolute;
        content: "";
        left: 50%;
        top: 50%;
        transform: translate(60px, -50%);
        height: 1px;
        width: 40px;
        background-color: rgb(170, 170, 170);
      }
      &::before {
        position: absolute;
        content: "";
        right: 50%;
        top: 50%;
        transform: translate(-60px, -50%);
        height: 1px;
        width: 40px;
        background-color: rgb(170, 170, 170);
      }
    }
  }
}
</style>
