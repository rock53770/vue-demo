
<template>
    <div class="order-box w-100 pos-a l0 r0 b0" :style="{ top: navHeight + 'px' }">
        <div class="search-name-box pos-r">
            <van-search v-model="searchObject.key"
                        background="#FC6B47"
                        placeholder="请输入姓名或车牌"
                        @search="onSearch"
                        show-action>
                <div slot="action" v-show="searchObject.key" class="cl-white" @click="onSearch">搜索</div>
            </van-search>
        </div>
        <div class="w-100 pos-r bg-white dryTab">
                <div class="dry-tab">
                  <div class="tabs">
                    <van-tabs v-model="tabsIndex" @change="selecTab" :line-width="30">
                      <van-tab title="全部询价">全部询价</van-tab>
                      <van-tab title="报价中">报价中</van-tab>
                    </van-tabs>
                  </div>
                    <!--<div class="tabs">-->
                        <!--<div class="tabs-head"-->
                            <!--:class="['flex-center', 'justify-sb', 'h-100', 'van-hairline&#45;&#45;bottom', 'pos-r']">-->
                            <!--<div class="tabs-left"-->
                                <!--:class="['flex-center', 'justify-sb', 'h-100', 'pos-r']">-->
                                <!--<div v-for="(item,index) in tabs" :key="index"-->
                                    <!--class="tab h-100 ft16" @click="selecTab(index)"-->
                                    <!--:class="[ index == tabsIndex ? 'active': '' ]">{{ item.title }}</div>-->
                                <!--<div class="tab-line"-->
                                    <!--:class="['pos-a']" :style="{transform : 'translateX('+ transX +'px)'}">-->
                                <!--</div>-->
                            <!--</div>-->

                            <!--<div class="tabs-right" :class="['ta-c', 'h-100']" @click="other = !other">-->
                                <!--<van-icon name="arrow" color="#cbcbcb" class="inner-icon" :style="{ transform: other ?'rotate(-90deg)':'rotate(90deg)'}"/>-->
                            <!--</div>-->
                            <!--<div class="tabs-other pos-a l0 r0 of-hide" :style="{ height: other ? '55px': 0 }">-->
                                <!--<div class="w-100 h-100 plr15 pt12 pb12 ta-r">-->
                                    <!--<van-button round type="default"  @click="goCloseOrder" class="other-btn">已关闭订单</van-button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <div class="tabs-view">
                        <div v-for="(item, index) in tabs" :key="index">
                            <div v-if="index == tabsIndex" class="tabs-pane">
                                <btScroller :ref="'scroll_box_'+index" :getData="getData" :currentPage.sync="item.way.currentPage" :propType="tabsIndex">
                                    <orderItem v-for="(item, index) in item.way.items" v-on:del="promptDel"
                                        :key="index" :index="index" :item="item" :type="tabsIndex" :getfn="getData">
                                    </orderItem>
                                    <div class="no-data-box empty" slot="empty">
                                        <div class="info"></div>
                                        <p class="mt20 cl-gray ft16" v-if="tabsIndex == 1">您还没有报价中订单，就差您了<br>现在下单可享优惠购车险福利哦~</p>
                                        <p class="mt20 cl-gray ft16" v-if="tabsIndex == 0">未找到报价单哦，赶紧去报价吧</p>
                                        <!--<p class="mt20 cl-gray ft16" v-if="tabsIndex == 2">您还没有完成的订单</p>-->
                                    </div>
                                </btScroller>
                            </div>
                        </div>
                    </div>
                    <div class="overlay"
                        :style="{ transform: other?'translate3d(0, 0, 0)':'translate3d(0, 100%, 0)'}"
                        @click="other = false"></div>
            </div>
        </div>

        <div class="tagIcon bdr-50 ta-c pos-f" @click="goLifeOrder" style="right:10px; bottom: 100px;">
            <img src="../../assets/icons/icon_people.png" class="w-100 h-100"/>
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
            count: 1,
            isInApp: GConfig.isInApp,
            navHeight: Util.getNavHeight(),
            currentPage: 1,
            pageSize: 20,
            items: [],
            tabs: [
                {
                    title: '全部询价',
                    way: {
                        currentPage: 1,
                        pageIndex: 1,
                        pageSize: 20,
                        items: [],
                        isActive: false
                    }
                },
                {
                    title: '报价中',
                    way: {
                        currentPage: 1,
                        pageIndex: 1,
                        pageSize: 20,
                        items: [],
                        isActive: false
                    }
                }
                // {
                //     title: '已完成',
                //     way: {
                //         currentPage: 1,
                //         pageIndex: 1,
                //         pageSize: 20,
                //         items: [],
                //         isActive: false
                //     }
                // }
            ],
            searchObject: {
                key: null,
                status: 0 //顶部不同的状态
            },
            tabsIndex: 0,
            other: false,
            recodeScroll: {
                activeIndex: null,
                top: null
            }
        };
    },
    mounted() {
        setPageTitle('个险订单')
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
    computed: {
        // 每个tab宽度
        targetWidth: function () {
            let $width = document.querySelector('body')
            return ($width.clientWidth - 44)/ 3
        },
        // 计算位置
        transX: function () {
            let w = (this.targetWidth - 34) / 2
            if (this.tabsIndex == 0) {
                return w
            } else if (this.tabsIndex == 1) {
                return w + this.targetWidth
            } else {
                return w + this.targetWidth*2
            }
        }
    },
    methods: {
        /**
         * 获取全部报价单
         * @param {Object}
         * { currentPage: 当前页， pageSize: 每页条数， keyword: 搜索关键词 }
         * @explain promise 根据tabIndex的不同也会不同。为三项总的入口
         */
        getData () {
            let self, param, $promise
            self = this
            param = {
                pageIndex: this.tabs[self.tabsIndex].way.currentPage,
                pageSize: this.tabs[self.tabsIndex].way.pageSize,
                status: Number(this.tabsIndex) + 1,
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
                title: '关闭询价',
                message: '确认关闭该询价么？'
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
        },
        selecTab(n) {
            this.tabsIndex = n
        },
        goCloseOrder() {
            btPage.open({
            url: "/order/order_close",
                container_style: 1,
                jsOnResume: () => {
                    if(GConfig.isInApp){
                        this.getData()
                    }
                }
          });
        },
        goLifeOrder() {
            btPage.open({
                url: "/life",
                    container_style: 1,
                    jsOnResume: () => {
                        if(GConfig.isInApp){
                            this.getData()
                        }
                    }
            });
        }
    },
    created () {
        this.tabsIndex = this.$route.query.type ? this.$route.query.type : 0
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
    background-color: #f5f5f5;
    .search-name-box {
        /deep/ .van-search {
          .van-search__content {
            background: #fff;
            border-radius: 4px;
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
    .dryTab {
        height: calc(100% - 44px);
    }
    .tabs {
        height: 44px;
        .tabs-head {
            border-bottom: 1px solid #f5f5f5;
            .tabs-left {
                width: calc(100% - 44px);
                .tab {
                    flex: 1;
                    text-align: center;
                    line-height: 44px;
                }
                .active {
                    color: #FC6B47;
                }
                .tab-line {
                    width: 34px;
                    height: 3px;
                    background-color: #FC6B47;
                    border-radius: 1.5px;
                    bottom: 0;
                    left: 0;
                    transition: transform;
                    transition-duration: 0.3s;
                }
            }
            .tabs-right {
                width: 44px;
                padding-top: 15px;
                transition: transform .3s ease-in-out;
                position: relative;
                .inner-icon {
                    transition: transform .3s ease-in-out;
                }
                &:before {
                    content: "";
                    height: 16px;
                    width: 1px;
                    background-color: #cbcbcb;
                    position: absolute;
                    top: 14px;
                    left: 0;
                }
            }
            .tabs-other {
                background-color: #f5f5f5;
                top: 44px;
                transition: height 0.3s ease-in-out;
                z-index: 12;
                .other-btn {
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;
                    padding: 0 10px;
                    border-color: #333333;
                }
            }
        }
    }
    .overlay {
        position: fixed;
        top: 88px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        z-index: 11;
        transition: all 0.3s ease-in-out;
    }
    .tabs-view {
        display: flex;
        flex-direction: column;
        position: absolute;
        height: 100%;
        width: 100%;
        .tabs-pane {
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
    }
    .tagIcon {
        height: 0.7rem;
        width: 0.7rem;
    }
}

</style>
