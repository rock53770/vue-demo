<template>
	<div class="manage">
		<div class="bg-white pt15 pb10 plr12 mb5 pos-f l0 r0" :style="{ top: navHeight + 'px' }">
            <div class="flex-center justify-c ft16 cl-black bg-white ta-c">
                <div class="w-50">
                    <div class="mb10">本月增员</div>
                    <div class="cl-orange ft18 fw-b">{{ record.monthOfCount }}人</div>
                </div>
                <div class="w-50">
                    <div class="mb10">团队总人数</div>
                    <div class="cl-orange ft18 fw-b">{{ record.totalOfCount }}人</div>
                </div>
            </div>
		</div>

        <div class="info-srcoller flex-1 w-100" :style="{ top: (navHeight + 90) + 'px' }">
            <scroller :height="'100%'" :noDataText="'我是有底线的'" :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
                <div class="p15 bg-white ft14 bdr8 pos-r mt10" v-for="(item, index) in member" :key="index">
                    <div class="pos-a icon" style="top: -11px; left: 8px;">
                        <img src="../../assets/icons/team/icon_top1@3x.png" height="29" width="24" v-if="index == 0">
                        <img src="../../assets/icons/team/icon_top2@3x.png" height="29" width="24" v-else-if="index == 1">
                        <img src="../../assets/icons/team/icon_top3@3x.png" height="29" width="24" v-else-if="index == 2">
                        <div class="bg-dry" v-else>{{ index+1 }}</div>
                    </div>
                    <div class="flex justify-sb mb15">
                        <div class="flex-center">
                            <img :src="item.avatar" height="45" width="45" class="bdr-50">
                            <div class="ml10">
                                <p class="ft16 mb5">{{ item.nickName }}</p>
                                <p class="cl-gray">({{ item.phone }})</p>
                            </div>
                        </div>
                        <div>收入贡献 <span class="cl-orange ft18 ml10">{{ item.income | currency2('¥','2') }}</span></div>
                    </div>
                    <div class="flex-center h30 lh30">
                        <span>已推荐</span>
                        <div class="mlr5 ft0 h30" v-if="item.recommendedList.length">
                            <img v-for="(i, index) in item.recommendedList" :key="index" 
                                :src="i.avatar" width="25" height="25" class="bdr-50">
                        </div>
                        <span>{{ item.recommendedTotal | text }}</span>
                    </div>
                </div>
            </scroller>
        </div>
	</div>
</template>
<script>
import teamService from "../../api/teamService"

export default {
	// 团队成员
    name: 'teamManage',
    data() {
        return {
            navHeight:Util.getNavHeight(),
            member: [],
            pageIndex: 1,
            pageSize: 20,
            hasNextPage: false,
            record: {
                monthOfCount: 0,
                totalOfCount: 0
            }
        }
    },
    mounted() {
        setPageTitle('团队管理');
        this.teamRecord()
    },
    methods: {
        teamRecord() {
            Toast.loading({
				mask: true,
				message: '加载中...'
			});
            teamService.teamRecord()
            .then(res => {
                if (res.code == 1) {
                    this.renovate()
                    this.record = res.object
                } else {
                    Toast(res.message)
                }
            })
        },
        renovate() {
            let $promise
            $promise = teamService.teamMember({ pageIndex: 1, pageSize: 20 })
            $promise.then((res) => {
                Toast.clear()
                if (res.code == 1) {
                    Toast.clear()
                    this.member = res.object
                    this.hasNextPage = res.page.hasNextPage
                } else {
                    Toast(res.message)
                }
            })  
            return $promise
        },
        getData() {
            teamService.teamMember({ pageIndex: this.pageIndex, pageSize: this.pageSize })
                .then((res) => {
                    if (res.code == 1) {
                        this.member =[...this.member, ...res.object]
                        this.hasNextPage = res.page.hasNextPage
                    } else {
                        Toast(res.message)
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
                self.getData();
                self.$refs.scroller.finishInfinite(true);
            }
        }
    },
    filters: {
        text(n) {
            if (n > 3) {
                return `等${n}人`
            } else {
                return `${n}人`
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .manage {
        .info-srcoller {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: calc(100vh - 90px);
        }
        .t3 {
            top: 3px;
        }
        .icon {
            height: 29px;
            width: 24px;
        }
        .bg-dry {
            background: url(../../assets/icons/team/bg_topnomber@3x.png)  no-repeat;
            background-size: contain;
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
            color: white;
        }
        .info-srcoller {
            /deep/ .loading-layer .no-data-text {
                &:after {
                    position: absolute;
                    content: '';
                    left: 50%;
                    top: 50%;
                    transform: translate(60px, -50%);
                    height: 1px;
                    width: 40px;
                    background-color: rgb(170, 170, 170);
                }
                &:before {
                    position: absolute;
                    content: '';
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
