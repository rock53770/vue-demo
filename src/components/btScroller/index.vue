<template>
    <div class="scroller-box" :class="{'no-data': isShowNoData||isShowAnomaly, 'hide-bottom': !canInfinite}">
        <scroller :on-refresh="refresh" :on-infinite="infinite" :height="'100%'" :noDataText="'我是有底线的'" ref="myscroller">
            <slot name="keep"></slot>
            <slot v-if="!isShowNoData && !isShowAnomaly"></slot>
            <slot name="empty" v-if="isShowNoData">
                <div class="no-data-box empty">
                    <i></i>
                    抱歉，暂无数据
                </div>
            </slot>
            <slot name="anomaly" v-if="isShowAnomaly">
                <div class="no-data-box anomaly">
                    <i></i>
                    请求异常
                    <p class="refresh" @click="triggerRefresh()">重新加载</p>
                </div>
            </slot>
        </scroller>
    </div>
</template>

<script>
export default {
    props: {
        getData: {
            type: Function,
            default: () => () => {}
        },
        //当前页数
        currentPage: {
            type: Number,
            default: () => 0
        },
        //页容量
        pageSize: {
            type: Number,
            default: () => 20
        },
        //分页从第几页开始
        beginPage: {
            type: Number,
            default: () => 1
        },
        //是否可上拉无限加载
        canInfinite: {
            type: Boolean,
            default: true
        },
        //是否可下拉刷新
        canRefresh: {
            type: Boolean,
            default: true
        },
        propType: {
            tyoe: Number,
            default: true
        }
    },
    data() {
        return {
            isShowNoData: false, //是否显示无数据
            isShowAnomaly: false, //是否显示网络异常
            hasNextPage: true, //是否有下一页
            base: null, //把scroller的源组件暴露给外一级以供调用
            resizeFn: null,
            isLoading: false, //是否加载中
            firstPull: true //是不是请求第一页
        };
    },
    created() {
        let _this = this;

        if (!_this.canRefresh) {
            _this.refresh = null;
        }
        // _this.resizeFn = Util.debounce(() => {
        //     _this.resizeHeight();
        // }, 300);
        // $(window).on('resize', _this.resizeFn);
    },
    mounted() {

        let _this = this;
        _this.$base = _this.$refs.myscroller;
        // _this.$nextTick(() => {
        // _this.resizeFn();
        // });
    },
    computed: {
        //真实分页号（1开始）
        pageIndex() {
            return this.currentPage - this.beginPage + 1;
        }
    },
    methods: {
        //下拉刷新
        refresh(done) {
            let _this = this;
            if (_this.isLoading) {
                return;
            }
            this.$emit('update:currentPage', this.beginPage); //双向更新分页号
            this.firstPull = true;
            _this.hasNextPage = true;
            _this.fetchData(done);
        },
        //加载更多
        infinite(done) {
            let _this = this;
            // console.log('进入加载更多，isLoading的状态:'+_this.isLoading)
            if (_this.isLoading) {
                return;
            }
            if (!_this.hasNextPage) {
                setTimeout(() => {
                    done(true); //done()表示这次异步加载数据完成，加载下一次
                }, 0);
                return;
            }
            //不能无限获取
            if (!this.canInfinite) {
                this.infinite = function() {};
            }

            //取下一页，分页号增1
            if (!this.firstPull) {
                this.$emit('update:currentPage', this.currentPage + 1);
            }
            _this.fetchData(done);
        },
        //请求数据
        fetchData(done) {
            let _this = this;
            _this.isLoading = true;
            return _this.getData().then(result => {
                // _this.isLoading = false;
                _this.fetchDataCallback(result, done);
                // setTimeout(() => {
                    _this.isLoading = false;
                    _this.firstPull = false;
                // }, 0);
                // return result;
            });
            // .finally(() => {
            //     _this.isLoading = false;
            //     _this.firstPull = false;
            // });
        },
        //请求加载结束进行回调
        fetchDataCallback(result, done) {
			// console.log('TCL: fetchDataCallback -> result', result)
            let _this = this;

            if (result && result.length) {
                //数组那种，约定第一项做为判断依据吧
                result = result[0];
            }
            if (result.code == 1) {
                if (result.page) {
                    _this.hasNextPage =
                        result.page.totalPages > _this.pageIndex;
                    _this.isShowNoData = result.page.totalPages == 0;
                    // _this.isShowNoData = result.page.totalPages <= 1;
                    _this.isShowAnomaly = false;
                } else {
                    //不返回分页的情况
                    _this.hasNextPage = false;
                    _this.isShowNoData =
                        !result.object ||
                        (result.object.length !== undefined &&
                            result.object.length === 0)
                            ? true
                            : false;
                    _this.isShowAnomaly = false;
                }
            } else {
                //请求失败
                _this.hasNextPage = false;
                _this.isShowNoData = false;
                _this.isShowAnomaly = true;
            }

            //刷新的情况，还需要调用结束加载
            if (done === this.$refs.myscroller.finishPullToRefresh) {
                done();
                done = this.$refs.myscroller.finishPullToRefresh;
            }
            if (!_this.hasNextPage) {
                done(true);
            } else {
                done();
            }
        },
        //主动触发刷新
        triggerRefresh() {
            this.$refs.myscroller.triggerPullToRefresh();
        }
    }
};
</script>


<style lang="less">
.scroller-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    .loading-layer .no-data-text {
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
.scroller-box.no-data {
    background: #f5f5f5;
    .no-data-text {
        display: none;
    }
    ._v-container > ._v-content {
        min-height: 100%;
    }
    .no-data-box {
        text-align: center;
        font-size: 15px;
        color: #666;
        position: absolute;
        top: 40%;
        width: 100%;
        i {
            display: block;
            height: 104px;
            width: 113px;
            margin: 0 auto;
        }
        //重新加载
        .refresh {
            margin-top: 10px;
            font-size: 15px;
            color: #ed514b;
        }
    }
    .no-data-box.empty {
        .info {
            height: 95px;
            width: 140px;
            margin: 0 auto;
            background: url('./data-no.png') no-repeat center;
            background-size: contain;
        }
        .no-notice{
          background-image:url('../../assets/images/no-message.png');
          background-size: contain;
        }
    }
    // .no-data-box.transaction {
        // .info {
            // height: 95px;
            // width: 140px;
            // margin: 0 auto;
            // background: url('./transaction.png') no-repeat center;
            // background-size: contain;
        // }
    // }

    .no-data-box.anomaly {
        i {
            background: url('./nonet.png') no-repeat center;
            background-size: 113px 104px;
            background-size: contain;
        }
    }
}
</style>
