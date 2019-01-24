<template>
    <div class="container">
        <div class="bg-white pt15 pb10 plr12">
            <div class="flex-center justify-c ft16 cl-black bg-white ta-c mb15">
                <div class="w-50">
                    <div class="mb10">本月推荐</div>
                    <div class="cl-orange ft18 fw-b">{{ count.monthOfCount }}人</div>
                </div>
                <div class="w-50">
                    <div class="mb10">总推荐</div>
                    <div class="cl-orange ft18 fw-b">{{ count.totalOfCount }}人</div>
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

        <div class="info-srcoller flex-1 w-100 pos-r">
            <template v-if="list.length">
                <scroller
                :height="'100%'"
                :noDataText="'我是有底线的'"
                :on-refresh="refresh"
                :on-infinite="infinite"
                ref="scroller"
                >
                    <div
                        class="mt10 plr15 pt12 pb12 bg-white ft14 cl-gray"
                        style="display: flex;"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <div class="w-50 flex-center">
                            <img v-if="item.avatar" :src="item.avatar" class="bdr-50 avatar">
                            <img v-else src="../../assets/images/user-name@3x.png" class="bdr-50 avatar">
                            <div class="ml15">
                                <div class="ft16 cl-black mb5">{{ item.nickName }}</div>
                                <div>{{ item.phone }}</div>
                            </div>
                        </div>
                        <div class="w-50 ta-r">{{ $util.formatDate(new Date(item.createTime), "yyyy-MM-dd") }}</div>
                    </div>
                </scroller>
            </template>
            <template v-else>
                <div class="ta-c" style="padding-top: 80px;">
                    <img src="../../assets/images/no-people.png" style="width:140px;height:95px;">
                    <div class="cl-gray ft16 mt15">您还没有推荐人哦，快去邀请吧</div>
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

import { promises } from "fs";

export default {
    name: "history",
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
            registe: ""
        };
    },
    methods: {
        countNum() {
            let self = this;
            myService.historyTotal().then(res => {
                if (res.code == 1) {
                self.count = res.object;
                } else {
                Toast(res.message);
                }
            });
        },
        renovate() {
            Toast.loading({
                mask: true,
                message: "加载中..."
            });
            let self = this;
            let param = {
                startTime: this.timer.startDate,
                endTime: this.timer.endDate,
                pageIndex: 1,
                pageSize: 20
            };
            let $promises = myService.historyList(param);
            $promises.then(res => {
                Toast.clear();
                if (res.code) {
                self.list = res.object;
                self.hasNextPage = res.page.hasNextPage;
                } else {
                Toast(res.message);
                }
            });
            return $promises;
        },
        getList() {
            Toast.loading({
                mask: true,
                message: "加载中..."
            });
            let self = this;
            let param = {
                startTime: this.timer.startDate,
                endTime: this.timer.endDate,
                pageIndex: this.pageIndex,
                pageSize: 20
            };
            let $promises = myService.historyList(param);
            $promises.then(res => {
                Toast.clear();
                if (res.code) {
                self.list = [...self.list, ...res.object];
                self.hasNextPage = res.page.hasNextPage;
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

            // console.log(
            //   "pikerDate:",pickerDate,
            //   "star:",star,
            //   "end:",end,
            //   "timerStart",timerStart,
            //   "timerEnd",timerEnd
            // )

            if (this.timer.id == 1) {
                if (pickerDate >= star) {
                    if (pickerDate > end || pickerDate > timerEnd) {
                        Toast("起始时间不可晚于结束时间");
                    } else {
                        this.timer.startDate = str;
                    }
                } else {
                    Toast("起始时间不早于注册日期！");
                }
            } else {
                if (pickerDate <= end) {
                    if (pickerDate < star && pickerDate > timerStart) {
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
                        this.timer.startDate = Util.formatDate(this.userInfo.registeTime, "yyyy-MM-dd");
                        this.registe = Util.formatDate(this.userInfo.registeTime, "yyyy-MM-dd");
                        this.countNum();
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
    created() {
        this.getUserInfo();
        setPageTitle("历史推荐");
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
        background-color: #666;
      }
      &::before {
        position: absolute;
        content: "";
        right: 50%;
        top: 50%;
        transform: translate(-60px, -50%);
        height: 1px;
        width: 40px;
        background-color: #666;
      }
    }
  }
}
</style>
