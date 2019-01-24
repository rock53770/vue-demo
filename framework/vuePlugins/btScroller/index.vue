<template>
  <div class="scroller-box" :class="{'no-data': isShowNoData||isShowAnomaly, 'hide-bottom': !canInfinite}">
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      :height="height"
      ref="myscroller"
    >
		<slot v-if="isHasResize"></slot>
		<slot name="empty" v-if="isShowNoData && isHasResize">
			<div class="no-data-box empty">
				<i></i>
				抱歉，暂无数据
			</div>
		</slot>
		<slot name="anomaly" v-if="isShowAnomaly && isHasResize">
			<div class="no-data-box anomaly">
				<i></i>
				请求异常，请检查您的网络
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
      default: () => GConfig.pageSize
	},
	//分页从第几页开始
	beginPage: {
		type: Number,
      	default: () => (GConfig.beginPage !== undefined ? GConfig.beginPage : 1) >> 0
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
  },
  data() {
    return {
	  isHasResize: false,//是否已经计算了容器的高度
	  isShowNoData: false,//是否显示无数据
	  isShowAnomaly: false,//是否显示网络异常
      height: "100%",
      // marker: 0,
      // totalPages: -1,
	  hasNextPage: true, //是否有下一页
	  base: null,//把scroller的源组件暴露给外一级以供调用
	  resizeFn: null,
	  isLoading: false, //是否加载中
	  firstPull: true	//是不是请求第一页
    };
  },
  computed: {
	//真实分页号（1开始）
    pageIndex() {
      return this.currentPage - this.beginPage + 1;
	}
  },
  created() {
	let _this = this;

	if(!_this.canRefresh){
		_this.refresh = null;
	}

	_this.resizeFn = Util.debounce(() => {
		_this.resizeHeight();
	}, 300)
	$(window).on('resize', _this.resizeFn);
  },
  destroyed(){
	let _this = this;
	$(window).off('resize', _this.resizeFn);
  },
  mounted(){
	  let _this = this;
	  _this.$base = _this.$refs.myscroller;
	  _this.$nextTick(() => {
		_this.resizeFn();
	  });
  },
  methods: {
	//重新计算高度
	resizeHeight(){
	  let _this = this;
	  let myscroller = this.$refs.myscroller;
	  if(myscroller){
		let el = $(myscroller.$el);
		let jParent = el.parent();
		let nParentHeight = 0;
		while(!jParent.is('html') && (jParent.css('position') === undefined || jParent.css('position') === 'static')){
			jParent = jParent.parent();
		}
		if(!jParent.height()){
			jParent = $(window);
		}
		nParentHeight = jParent.height();

		let refreshHeight = _this.canRefresh ? 58 : 0;
		let nHeight = parseFloat((nParentHeight + refreshHeight) / nParentHeight * 100) + "%";
		el.css('height', nHeight);

		myscroller.resize();
		//保证内容的渲染再高度计算之后
		setTimeout(() => {
			_this.isHasResize = true;
		},0)
	  }
	},
    //下拉刷新
    refresh(done) {
	  	let _this = this;
	  	if(_this.isLoading){
		  	return;
	 	}
      	this.$emit("update:currentPage", this.beginPage); //双向更新分页号
		this.firstPull = true;

      	_this.hasNextPage = true;
		_this.fetchData(done);
	},
    //加载更多
    infinite(done) {
	  let _this = this;

	  if(_this.isLoading){
		  return;
	  }

      if (!_this.hasNextPage) {
        setTimeout(() => {
          done(true);//done()表示这次异步加载数据完成，加载下一次
        });
        return;
      }
		//不能无限获取
		if(!this.canInfinite){
			this.infinite = function(){};
		}

		//取下一页，分页号增1
		if(!this.firstPull){
			this.$emit("update:currentPage", this.currentPage + 1);
		}
		_this.fetchData(done);
	},
	//重新渲染
	rerender(){
		this.$emit("update:currentPage", this.beginPage); //双向更新分页号
		this.firstPull = true;
		this.fetchData(this.$refs.myscroller.finishInfinite);
	},
	//请求数据
	fetchData(done){
		let _this = this;
	  	_this.isLoading = true;
      	return _this.getData().then(result => {
			_this.fetchDataCallback(result, done);
			return result;
      	}).finally(() => {
	  		_this.isLoading = false;
			_this.firstPull = false;
		});
	},
    //加载结束回调
    fetchDataCallback(result, done) {
	  	let _this = this;

	 	if(result && result.length){//数组那种，约定第一项做为判断依据吧
			result = result[0];
	 	}
      	if (result.code === 1) {
			if(result.page){
				_this.hasNextPage = result.page.totalPages > _this.pageIndex;
				_this.isShowNoData = result.page.totalPages == 0;
				_this.isShowAnomaly = false;
		  	} else{//不返回分页的情况
				_this.hasNextPage = false;
				_this.isShowNoData = (!result.object || (result.object.length !== undefined && result.object.length === 0)) ? true : false;
				_this.isShowAnomaly = false;
			}
	  	} else{//请求失败
        	_this.hasNextPage = false;
        	_this.isShowNoData = false;
        	_this.isShowAnomaly = true;
      	}

		//刷新的情况，还需要调用结束加载
		if(done === this.$refs.myscroller.finishPullToRefresh){
			done();
			done = this.$refs.myscroller.finishInfinite;
		}
		if (!_this.hasNextPage) {
			done(true);
		} else {
			done();
		}
	},
	//主动触发刷新
	triggerRefresh(){
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
  .pull-to-refresh-layer {
    position: relative;
    z-index: 100;
    background-image: url(./pull-down.gif);
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: 109px 50px;
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
    transition: all 0.15s linear;
    -webkit-transition: all 0.15s linear;

    .spinner-holder {
      visibility: hidden;
    }

    &.active {
      -webkit-transform: scale(1.35);
      transform: scale(1.35);
      opacity: 1;
    }
  }
}
.scroller-box.no-data {
  .no-data-text {
    display: none;
  }
  ._v-container > ._v-content {
    min-height: 100%;
  }
	.no-data-box{
		text-align: center;
		font-size: 15px;
		color: #666;
		position: absolute;
		top: 50%;
		width: 100%;
		margin-top: -10px;
		i{
		}
		//重新加载
		.refresh{
			margin-top: 10px;
			font-size: 15px;
			color: #ED514B;
		}
	}
}
//不可加载更多，隐藏底部
.scroller-box.hide-bottom{
	.loading-layer{
		height: 0px !important;
		opacity: 0;
	}
}

.pull-to-refresh-layer,
.loading-layer {
  /* background-color: red;
    height: 50px !important;
    line-height: 50px !important;*/
}
.pull-to-refresh-layer {
}
.loading-layer {
}
</style>
