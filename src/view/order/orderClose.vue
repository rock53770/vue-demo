
<template>
    <div class="search-box pos-a l0 r0 b0" :style="{ top: navHeight + 'px'}">
        <div class="info-srcoller w-100 pos-r">
            <template v-if="tabs.way.items.length !== 0">
                <scroller :height="'100%'" :noDataText="'我是有底线的'" :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
                    <orderItem v-for="(item, index) in tabs.way.items" :key="index" :item="item" v-on:del="promptDel" :index="index"></orderItem>
                </scroller>
            </template>
            <template v-else>
                <div class="no-data-box">
                    <div class="info"></div>
                    <p class="mt20 cl-gray ft16">未查询到关闭订单记录</p>
                </div>
            </template>
        </div>

        <footerBar path="order"></footerBar>
    </div>
</template>

<script>
import footerBar from '@/components/Footer';
import orderItem from '@/components/orderItem/index.vue';
import orderService from '@/api/orderService';

export default {
    name: 'orderClose',
    data() {
        return {
            navHeight: Util.getNavHeight(),
            currentPage: 1,
            hasNextPage: null,
            pageSize: 20,
            items: [],
            tabs:  {
                title: '报价单',
                way: {
                    currentPage: 1,
                    pageSize: 20,
                    pageIndex: 1,
                    items: [],
                    isActive: false
                }
            },
            loadingType: 0,
            searchObject: {
                key: null
            },
            tabsIndex: 1,
            recodeScroll: {
                activeIndex: null,
                top: null
            },
            isNoData: true,
            searchDataType: 0, // 数据状态， 0：初始化无数据状态， 1：请求中loading  2: 请求成功渲染结果
        }
    },
    mounted() {
        setPageTitle('已关闭订单');
    },
    methods: {
        /**
         * 获取全部报价单
         * @param {Object}
         * { pageIndex: 当前页， pageSize: 每页条数， keyword: 搜索关键词 }
         * @explain promise 根据tabIndex的不同也会不同。为三项总的入口
         */
        getData () {
            let self, param, $promise
            self = this
            param = {
                pageIndex: this.tabs.way.pageIndex,
                pageSize: this.tabs.way.pageSize,
                status: 4,
                keyword: ''
            }
            $promise = orderService.getOrderLists(param)
            $promise.then((res) => {
                if (res.code == 1) {
                    if (self.tabs.way.currentPage == 1) {
                        self.tabs.way.items = res.object;
                        self.hasNextPage = res.page.hasNextPage
                    } else {
                        self.tabs.way.items = [
                            ...self.tabs.way.items,
                            ...res.object
                        ];
                        self.hasNextPage = res.page.hasNextPage
                    }
                } else {
                    Toast(res.message)
                }
            })

            return $promise
        },
        promptDel (obj) {
            Dialog.confirm({
                title: '关闭订单',
                message: '确认关闭该订单么？'
            }).then(() => {
                this.deleteItem(obj)
            }).catch(() => {

            });
        },
        deleteItem(obj) {
            let param = { id: obj.id }
            orderService.postDeleteQuote(param)
                .then((res) => {
                    if (res.code == 1) {
                        this.tabs[this.tabsIndex].way.items.splice(obj.index, 1)
                    } else {
                       Toast(res.message)
                    }
                })
        },
        // 上拉刷勋
        refresh(done) {
            this.getData()
                .then((res) => {
                    if (res.code == 1) {
                        done(true)
                    }
                })   
        },
        // 下拉加载
        infinite (done) {
            let self = this
            if (!self.hasNextPage) {
                done(true)
            } else {
                self.currentPage++
                self.getData()
                    .then((res)=> {
                        if (res.code == 1) {
                            self.$refs.scroller.finishInfinite(true)
                        }
                    })
            }
        }
    },
    created() {
        this.getData()
    },
    components: {
        footerBar,
        orderItem
    }
};
</script>
<style lang="less" scoped>
    .no-data-box {
        text-align: center;
        font-size: 15px;
        color: #666;
        padding-top: 25%;
        .info {
            height: 95px;
            width: 140px;
            margin: 0 auto;
            background: url('../../components/btScroller/data-no.png') no-repeat center;
            background-size: contain;
        }
    }

    .loading {
        margin-top: 50%;
        transform: translateY(-25%);
        /deep/ .van-loading {
            margin: 0 auto;
        }
    }
    .info-srcoller {
        height: calc(100% - 50px);
        /deep/ .loading-layer .no-data-text {
            &:after {
                position: absolute;
                content: '';
                left: 50%;
                top: 50%;
                transform: translate(60px, -50%);
                height: 1px;
                width: 40px;
                background-color: #666;
            }
            &:before {
                position: absolute;
                content: '';
                right: 50%;
                top: 50%;
                transform: translate(-60px, -50%);
                height: 1px;
                width: 40px;
                background-color: #666;
            }
        }
    }
</style>

