
<template>
    <div class="order-box pos-a w-100" :style="{ top: navHeight + 'px' }">
        <div class="search-name-box plr10 pos-r">
            <van-search v-model="searchObject.key" background="#ffffff" placeholder="请输入姓名或车牌" show-action @search="onSearch">
                <div slot="action" @click="onSearch" v-show="searchObject.key">搜索</div>
            </van-search>
        </div>
        <div class="flex-1 w-100 pos-r bg-white">
            <van-tabs v-model="tabsIndex" :swipe-threshold="3">
                <van-tab v-for="(item,index) in tabs" :title="item.title" :key="index">
                    <btScroller :ref="'scroll_box_'+index" :getData="getData" :currentPage.sync="item.way.currentPage" :propType="tabsIndex">
                        <orderItem v-for="(item, index) in item.way.items" v-on:del="promptDel"
                            :key="index" :index="index" :item="item" :type="tabsIndex" :getfn="getData">
                        </orderItem>
                        <div class="no-data-box empty" slot="empty" :class="tabsIndex === 1 ? '' : 'transaction'">
                            <div class="info"></div>
                            <p class="mt20 cl-gray ft16" v-if="tabsIndex === 1">您还没有交易中订单，就差您了<br>现在下单可享优惠购车险福利哦~</p>
                            <p class="mt20 cl-gray ft16" v-if="tabsIndex === 0">未找到报价单哦，赶紧去报价吧</p>
                            <p class="mt20 cl-gray ft16" v-if="tabsIndex === 2">您还没有完成的订单</p>
                        </div>
                    </btScroller>
                </van-tab>
            </van-tabs>
        </div>
        <footerBar path="order"></footerBar>
    </div>
</template>

<script>
// import popupSelect from '@/components/PopupSelect.vue';
import footerBar from '@/components/Footer';
import btScroller from '@/components/btScroller';

import orderItem from '@/components/orderItem/index.vue';
import orderService from '@/api/orderService';
export default {
    name: 'order',
    data() {
        return {
            count:1,
            isInApp:GConfig.isInApp,
            navHeight:Util.getNavHeight(),
            currentPage: 1,
            pageSize: 20,
            items: [],
            tabs: [
                {
                    title: '报价中',
                    way: {
                        currentPage: 1,
                        pageIndex: 1,
                        pageSize: 20,
                        items: [],
                        isActive: false
                    }
                },
                {
                    title: '交易中',
                    way: {
                        currentPage: 1,
                        pageIndex: 1,
                        pageSize: 20,
                        items: [],
                        isActive: false
                    }
                },
                {
                    title: '已完成',
                    way: {
                        currentPage: 1,
                        pageIndex: 1,
                        pageSize: 20,
                        items: [],
                        isActive: false
                    }
                }
            ],
            searchObject: {
                key: null,
                status: 0 //顶部不同的状态
            },
            tabsIndex: 0,
            recodeScroll: {
                activeIndex: null,
                top: null
            }
        };
    },
    mounted() {
        setPageTitle('订单管理')
        wv.customBackAction(()=> {
          if(this.count == 2){
            btPage.goBack(100);
          } else {
            Toast("再按返回退出")
            this.count++;
            setTimeout(()=>{
              this.count = 1;
            },2000)
          }
        });
        wv.setWebViewInfo({
          wvBackDisable:1
        })
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
                pageIndex: this.tabs[self.tabsIndex].way.pageIndex,
                pageSize: this.tabs[self.tabsIndex].way.pageSize,
                status: this.tabsIndex + 1,
                keyword: ''
            }
            $promise = orderService.getOrderLists(param)
            $promise.then((res) => {
                if (res.code == 1) {
                    if (self.tabs[self.tabsIndex].way.currentPage == 1) {
                        self.tabs[self.tabsIndex].way.items = res.object;
                    } else {
                        self.tabs[self.tabsIndex].way.items = [
                            ...self.tabs[self.tabsIndex].way.items,
                            ...res.object
                        ];
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
        onSearch() {
            if (this.searchObject.key) {
                btPage.open({
                    url: '/order/order_search',
                    container_style: 1,
                    params: { key: encodeURI(this.searchObject.key) },
                    jsOnResume: () => {
                      if(GConfig.isInApp){
                        this.getData()
                      }
                    }
                })
            } else {
                Toast('请输入搜索内容')
            }
        }
    },
    created () {
        this.tabsIndex = this.$route.query.type ? this.$route.query.type  : 0
    },
    beforeRouteEnter1(to, from, next) {
        let _this = this;
        // 更新订单状态
        if (
            from.path !== '/my'
        ) {
            next(vm => {
                if(to.query.type === undefined || parseInt(to.query.type) > 4){
                    vm.search();
                    // _this.$refs.scroll_box_0[0].$base.scrollTo(0, 0, false);
                    return;
                }
                vm.tabsIndex = parseInt(to.query.type)
            });
        }else {
        // if (from.path == '/') {
        //     // 当前页面刷新不需要切换位置
        //     next();
        // }
            next(vm => {
                if (
                    vm.recodeScroll.activeIndex == 0 &&
                    vm &&
                    vm.$refs.scroll_box_0
                ) {
                    setTimeout(function() {
                        vm.$refs.scroll_box_0[0].$base.scrollTo(
                            0,
                            vm.recodeScroll.top,
                            false
                        );
                    }, 0);
                }
                if (
                    vm.recodeScroll.activeIndex == 1 &&
                    vm &&
                    vm.$refs.scroll_box_1
                ) {
                    setTimeout(function() {
                        vm.$refs.scroll_box_1[0].$base.scrollTo(
                            0,
                            vm.recodeScroll.top,
                            false
                        );
                    }, 0);
                }
                if (
                    vm.recodeScroll.activeIndex == 2 &&
                    vm &&
                    vm.$refs.scroll_box_2
                ) {
                    setTimeout(function() {
                        vm.$refs.scroll_box_2[0].$base.scrollTo(
                            0,
                            vm.recodeScroll.top,
                            false
                        );
                    }, 0);
                }
                if (
                    vm.recodeScroll.activeIndex == 3 &&
                    vm &&
                    vm.$refs.scroll_box_3
                ) {
                    setTimeout(function() {
                        vm.$refs.scroll_box_3[0].$base.scrollTo(
                            0,
                            vm.recodeScroll.top,
                            false
                        );
                    }, 0);
                }
                if (
                    vm.recodeScroll.activeIndex == 4 &&
                    vm &&
                    vm.$refs.scroll_box_4
                ) {
                    setTimeout(function() {
                        vm.$refs.scroll_box_4[0].$base.scrollTo(
                            0,
                            vm.recodeScroll.top,
                            false
                        );
                    }, 0);
                }
            });
        }
    },
    beforeRouteLeave1(to, from, next) {
        // sessionStorage.homeActive_item = this.active_type;
        // 记录离开时的位置
        if (this.tabsIndex == 0) {
            this.recodeScroll.activeIndex = this.tabsIndex;
            this.recodeScroll.top =
                this.$refs.scroll_box_0[0].$base &&
                this.$refs.scroll_box_0[0].$base.getPosition() &&
                this.$refs.scroll_box_0[0].$base.getPosition().top;
        }
        if (this.tabsIndex == 1) {
            this.recodeScroll.activeIndex = this.tabsIndex;
            this.recodeScroll.top =
                this.$refs.scroll_box_1[0].$base &&
                this.$refs.scroll_box_1[0].$base.getPosition() &&
                this.$refs.scroll_box_1[0].$base.getPosition().top;
        }
        if (this.tabsIndex == 2) {
            this.recodeScroll.activeIndex = this.tabsIndex;
            this.recodeScroll.top =
                this.$refs.scroll_box_2[0].$base &&
                this.$refs.scroll_box_2[0].$base.getPosition() &&
                this.$refs.scroll_box_2[0].$base.getPosition().top;
        }
        if (this.tabsIndex == 3) {
            this.recodeScroll.activeIndex = this.tabsIndex;
            this.recodeScroll.top =
                this.$refs.scroll_box_3[0].$base &&
                this.$refs.scroll_box_3[0].$base.getPosition() &&
                this.$refs.scroll_box_3[0].$base.getPosition().top;
        }
        if (this.tabsIndex == 4) {
            this.recodeScroll.activeIndex = this.tabsIndex;
            this.recodeScroll.top =
                this.$refs.scroll_box_4[0].$base &&
                this.$refs.scroll_box_4[0].$base.getPosition() &&
                this.$refs.scroll_box_4[0].$base.getPosition().top;
        }
        next();
    },
    components: {
        // popupSelect,
        btScroller,
        footerBar,
        orderItem
    }
};
</script>
<style lang="less" scoped>
.order-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    top: 0;
    background-color: #ffffff;
    .search-name-box {
        /deep/ .van-search {
            .van-cell {
                background-color: #f4f4f4;
                .van-field__control {
                    background-color: #f4f4f4;
                }
            }
        }
    }
    .van-cell-group {
        border-radius: 17px;
        overflow: hidden;
        .van-cell {
            padding: 5px 17px;
        }
    }
    .van-tabs {
        display: flex;
        flex-direction: column;
        position: absolute;
        height: 100%;
        width: 100%;
        .van-tab__pane {
            background: #f5f5f5;
            position: absolute;
            left: 0;
            right: 0;
            width: 100%;
            height: calc(~'100% - 44px');
            .scroller-box {
                flex: 1;
            }
        }
        /deep/ .van-tabs__wrap  {
            .van-tabs__nav {
                .van-tab {
                    font-size: 16px;
                }
                .van-tab--active {
                    font-weight: bold;
                    color: #FC6B47;
                }
                .van-tabs__line {
                    background-color: #FC6B47;
                }
            }
        }
    }
}

</style>
