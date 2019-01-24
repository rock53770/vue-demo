/* 分页滚动器
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-28 13:30:57
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-06-29 13:15:37
 */
import {$module, $router} from '../index';
import './style.less'

let _isInstall = false;//插件是否已经install
// alert('这个组件还没写好，不要调用！');
//注册服务
export default function install(){
	if(_isInstall){//不要重复注册了
		return $module;
	}
	_isInstall = true;

	//注册指令
	$module.directive('btScroller', ["$timeout", 'btRefs', function($timeout, btRefs) {
		let LOADING_TOP_HTML =
				'<div id="pullDown" class="flip loading">'+
					'<span class="pullDownIcon"></span><span class="pullDownLabel"></span>'+
				'</div>',
			LOADING_BOTTOM_HTML =
				'<div id="pullUp" class="loading">'+
					'<span class="pullUpIcon"></span><span class="pullUpLabel"></span>'+
				'</div>'
		;

		return {
			restrict:"E",
			scope: {
				getData: "&",             	//必需，数据初始化回调(必须是个promise)
				// loadMark: "=",              //必需，加载标示计数，用来识别加载结束事件（请动态加1）
				canInfinite: "@",           //非必需，是否可上拉无限加载(默认支持)
				canRefresh: "@",            //非必需，是否可下拉刷新（默认支持）（非固定模式默认是可以下拉的）
				// targetElement: "@",         //非必需，目标元素（用来存放上下加载拉节点的）
				// isValid: "=",            //非必需，是否无效，默认有效(这个已去掉，请结合ng-if和ng-show控制)
				currentPage: '=',			//当前页数
				// beginPage: "@",             //非必需，第一页是从几开始，默认0是第一页
				onScrolling: "&",           	//非必需，滚动中事件
				ref: '@'					//关联名称（如果设置了，后面可以通过btRefs对象返回该指令对象）
			},
			link: function ($scope, element, attrs) {
				let base = this;
				let beginPage = ($scope.beginPage || GConfig.beginPage || 0) >> 0;
				let canInfinite = ($scope.canInfinite === 'false' || $scope.canInfinite === '0') ? false : true;
				let canRefresh = ($scope.canRefresh === 'false' || $scope.canRefresh === '0') ? false : true;

				let jTop,
					jBottom,
					sTargetElement = $scope.targetElement || ">*:first",
					jWrapper = element,
					jScrollBody = jWrapper.find(">*:first").css("minHeight", "100.1%"),//第一个元素如果不比容器大，内容少的时候会导致无法滚动
					jMainBody = jWrapper.find(sTargetElement),
					sTopHtml = LOADING_TOP_HTML,
					sBottomHtml = LOADING_BOTTOM_HTML,
					myScroll,
					topOffset = 0
				;

				if(jWrapper.is("ul")){
					sTopHtml = sTopHtml.replace(/div/ig, "li");
					sBottomHtml = sBottomHtml.replace(/div/ig, "li");
				}

				require.ensure([], function(require){
					let iScroll = require('iscroll5');
					let config = {
							disableMouse: true, //是否关闭鼠标事件探测
							disablePointer: false,//是否关闭指针事件探测
							// bounce: false,//是否支持回弹
							mouseWheel: false,//是否监听鼠标滚轮事件
							scrollbars: true,//是否显示默认滚动条
							fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
							click: false,
							topOffset: 0,//顶部距离
							probeType: Util.isBadAndroid || attrs.onScrolling === undefined ? 1 : 2   //这个属性是调节在scroll事件触发中探针的活跃度或者频率。有效值有：1, 2, 3。数值越高表示更活跃的探测（性能越差）。
						}
					;

					//阻止移动默认事件 不加这个的话有的机型卡顿（不要用jq的方式绑定，否则会导致touch事件都被拦截）
					element.get(0).addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

					//顶部渲染判断
					if(canRefresh !== false){
						if(!jTop){
							jTop = $(sTopHtml).prependTo(jScrollBody);
						}

						topOffset = jTop.outerHeight();
						config.topOffset = topOffset;
					}

					/**
					 * 返回真实分页号（1开始）
					*/
					function getPageIndex(){
						return $scope.currentPage - beginPage + 1;
					}
					/**
					 * 刷新当前列表，读取第一页
					 * @return this
					 */
					function resetPage(){
						if(base.isLoading){
							return;
						}

						//如果有底部，先隐藏，否则会出现两个滚轮显示不友好
						jBottom && jBottom.hide();


						$timeout(() => {
							$scope.currentPage = beginPage;

							getDataFn();
						}, 0);

						return base;
					}
					/**
					 * 加载下一页
					 * @return this
					 */
					function getNextPage(){
						// console.log(base.hasNextPage)
						if(base.isLoading || !base.hasNextPage){
							return;
						}

						$timeout(() => {
							$scope.currentPage++;

							getDataFn();
						}, 0);

						return base;
					}
					//数据调取
					function getDataFn(){
						let fetchDataCallback = (result) => {
							base.isLoading = false;
							let pageCount = 0;

							if(result && result.length){//数组那种，约定第一项做为判断依据吧
								result = result[0];
							}

							if (result.code === 1 && result.page) {
								pageCount = result.page.totalPages;
								base.hasNextPage = pageCount > getPageIndex();
								base.isShowNoData = result.page.totalPages == 0;
								// console.log(base.hasNextPage, result.page.totalPages, getPageIndex())
								// base.isShowAnomaly = false;
							} else if(result.code === 0){
								base.hasNextPage = false;
								base.isShowNoData = false;
								base.isShowAnomaly = true;
							} else {
								base.hasNextPage = false;
								base.isShowNoData = true;
								base.isShowAnomaly = false;
							}

							//底部的渲染判断
							function bottomRender(){
								if(canInfinite !== false){
									if(pageCount === 0){//无数据
										jBottom && jBottom.remove();
									} else{//有数据
										if(!jBottom){
											jBottom = $(sBottomHtml).appendTo(jMainBody);
										}
										jBottom.show();
										if(!base.hasNextPage){//已经到底
											jBottom.find(".pullUpIcon").hide().end().find(".pullUpLabel").html("已经到底啦~");
										} else{
											jBottom.find(".pullUpIcon").show().end().find(".pullUpLabel").html("");
										}
									}
								}
							}
							//刷新scroller
							function refreshScroller(){
								setTimeout(function(){//保证渲染结束，需要加一点延时
									if (jTop && jTop.is('.loading')) {
										jTop.removeClass("flip").removeClass("loading");//find(".pullDownLabel").html("下拉刷新");

										myScroll && myScroll.scrollTo(0, -topOffset, 500);
									} else if(jBottom){
										jBottom.removeClass("flip");
									}
									myScroll && myScroll.refresh();

									shouldGetNext();//判断要不要加载下一页
								}, 200);
							}

							//是否需要获取下一页数据
							function shouldGetNext(){
								// console.log('我判断一下要不要加载下一页', myScroll.maxScrollY, topOffset, jBottom.outerHeight())
								if (jBottom && 0 < myScroll.maxScrollY + topOffset + jBottom.outerHeight()) {
									jBottom.addClass("loading");//.find('.text').html("加载中");

									getNextPage();
								}
							}

							bottomRender();
							refreshScroller();
						}

						base.isLoading = true;
						$scope.getData().then(fetchDataCallback);
					}

					//扩展基础方法和
					angular.extend(base, {
						isLoading: false,       //是否请求加载中，如果还在请求中，需要拦截重复请求
						hasNextPage: true,     //是否有下一页
						//主动触发下拉刷新
						triggerRefresh: () => {
							//滚动到顶部
							myScroll && myScroll.scrollTo(0, 0, 0);
							jTop && jTop.addClass("loading");
							resetPage();
						},
						/**
						 * 滚动到顶部
						*/
						scrollToTop: () => {
							myScroll && myScroll.scrollTo(0, -topOffset, 500);
						}
					})

					myScroll = new iScroll(jWrapper.css("overflow", "hidden").get(0), config);
					/**
					 * 产品要求第一次加载列表的时候
					 * 主动实现顶部pullDown loading不出现
					 */
					myScroll.scrollTo(0, -topOffset, 0);
					myScroll.on('scroll', function(){
						let _this = this,
							moveY = _this.y + topOffset
						;

						if(base.isLoading){
							return;
						}

						if (jTop && moveY > topOffset && !jTop.is('.flip')) {
							jTop.addClass("flip");//.find(".pullDownLabel").html("释放刷新");
							_this.minScrollY = 0;
						} else if(jBottom && base.hasNextPage && moveY < 0 && !jBottom.is(".flip")){
							if (moveY < _this.maxScrollY + topOffset + jBottom.outerHeight()) {
								// _this.maxScrollY = topOffset;
								jBottom.addClass("flip");
							}
						}

						$scope.onScrolling && $scope.onScrolling();
					});

					/**
					 * 滚动结束事件
					 */
					myScroll.on("scrollEnd", function(){
						let _this = this,
							moveY = _this.y + topOffset
						;
						if(base.isLoading){
							return;
						}

						if (jTop && jTop.is('.flip')) {
							jTop.addClass("loading");//.find('.pullDownLabel').html("加载中...");

							resetPage();
						} else if(jBottom && base.hasNextPage){
							// console.log('scrollEnd', moveY, _this.maxScrollY, topOffset, jBottom.outerHeight())
							if ((moveY < 0 && moveY < _this.maxScrollY + topOffset + jBottom.outerHeight()) || jBottom.is(".flip")) {
								jBottom.addClass("loading");//.find('.text').html("加载中");

								getNextPage();
							}
						}

						$scope.onScrolling && $scope.onScrolling();
						window.lazyloadHandler && window.lazyloadHandler();//主动触发懒加载验证
					});

					getDataFn();
					// myScroll._execEvent('scrollEnd', true);
					// base.scroller = myScroll;
				}, 'lib/iscroll5');

				//添加指令关联
				let refName = $scope.ref;
				if(refName){
					btRefs.set(refName, this);
					$scope.$on("$destroy", function() {
						btRefs.remove(refName);
					});
				}
			}
		}
	}]);

	return $module;
}