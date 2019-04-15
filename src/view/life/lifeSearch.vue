
<template>
    <div :class="['search-box', 'pos-a', 'l0', 'r0', searchDataType==2?'h-100':'']" :style="{ top: navHeight + 'px'}">
        <div class="search-name-box pos-r bg-white van-hairline--bottom" :style="{ top: 0 }">
            <van-search v-model="searchObject.key" background="#ffffff" placeholder="投保人或被保人姓名" show-action @search="search">
                <div slot="action" @click="search" v-show="searchObject.key">搜索</div>
            </van-search>
        </div>
        <div class="info-srcoller flex-1 w-100 pos-r">
            <template v-if="searchDataType == 2">
                <scroller :height="'100%'" :noDataText="'我是有底线的'" :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
                    <lifeItem v-for="(item, index) in tabs.way.items" :key="index" :index="index" 
                        :item="item" :type="tabsIndex" v-on:del="promptDel" :getfn="getData"></lifeItem>
                </scroller>
            </template>
            <template v-else-if="searchDataType == 0">
                <div class="no-data-box">
                    <div class="info"></div>
                    <p class="mt20 cl-gray ft16">未搜索到对应数据，请检查关<br>键词是否正确</p>
                </div>
            </template>
        </div>

        <footerBar path="order"></footerBar>
    </div>
</template>

<script>
import footerBar from '@/components/Footer';
import lifeItem from '@/components/lifeItem/index.vue';
import lifeService from '@/api/lifeService';

export default {
    name: 'orderSearch',
    data() {
        return {
            navHeight:Util.getNavHeight(),
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
        setPageTitle('搜索');
    },
    methods: {
        // 全部
        getData() {
            Toast.loading({
                mask: true,
                message: '加载中...'
            });
            
            let _this = this;
            let param = {
                pageIndex: this.tabs.way.pageIndex,
                pageSize: this.tabs.way.pageSize,
                keyword: this.searchObject.key,
            }
            let promise = lifeService.lifeOrder( param );
            promise.then(function(result) {
                _this.tabs.way.isActive = true;
                Toast.clear()
                if (result.code != 1) {
                    Toast(result.message);
                } else {
                    if (result.object.length == 0) {
                        _this.searchDataType = 0
                    } else {
                        _this.searchDataType = 2
                        if (_this.tabs.way.currentPage == 1) {
                            _this.tabs.way.items = result.object;
                            _this.hasNextPage = result.page.hasNextPage
                        } else {
                            _this.tabs.way.items = [
                                ..._this.tabs.way.items,
                                ...result.object
                            ];
                        }
                    }
                }
            });
            return promise;
        },
        search() {
            let _this = this;
            if (!this.searchObject.key) {
                Toast('请输入搜索内容');
            } else {
                _this.searchDataType = 1
                _this.getData()
            }
        },
        // 上拉刷勋
        refresh(done) {
            if (!this.searchObject.key) {
                done()
                return
            } else {
                setTimeout(() => {
                    this.getData()
                        .then((res) => {
                            if (res.code == 1) {
                                done()
                            }
                        })
                }, 1000)
            }
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
        },
        promptDel (obj) {
            Dialog.confirm({
                title: '删除订单',
                message: '确认删除该订单么？'
            }).then(() => {
                this.deleteItem(obj)
            }).catch(() => {

            });

        },
        deleteItem(obj) {
            let param = { oid: obj.id }
            lifeService.deleteOrder(param)
                .then((res) => {
                    if (res.code == 1) {
                        this.tabs.way.items.splice(obj.index, 1)
                    } else {
                       Toast(res.message)
                    }
                })
        }
    },
    created() {
        let key = this.$route.query.key
        this.searchObject.key = key
        if (key) {
            this.getData()
        }
    },
    components: {
        footerBar,
        lifeItem
    }
};
</script>
<style lang="less" scoped>
    .search-box {
        display: flex;
        flex-direction: column;
    }
    .no-data-box {
        text-align: center;
        font-size: 15px;
        color: #666;
        padding-top: 25%;
        .info {
            height: 95px;
            width: 140px;
            margin: 0 auto;
            background: url('../../assets/images/no-search-data.png') no-repeat center;
            background-size: contain;
        }
    }

    .search-name-box /deep/ .van-search .van-field {
        background: #f5f5f5;
    }
    .loading {
        margin-top: 50%;
        transform: translateY(-25%);
        /deep/ .van-loading {
            margin: 0 auto;
        }
    }
    // .bg-none {
    //     background: url('../../assets/images/search_undata.png') no-repeat center;
    //     background-size: 140px 92px;
    // }
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

