/* 基础实现
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-22 20:18:44
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-02 16:19:38
 */
// import iScroll from 'iscroll';

//字母和位置移动事件
export function initLetterPosition(elStr, $scope, $timeout){
	// let scroller;
	$scope.isTouch = false;
	let fixedHeight = '';
	$timeout(function(){//确保dom已经渲染
		let el = angular.element(elStr);
		// scroller = new iScroll(el.get(0), {});
		// scroller.refresh();

		$timeout(function(){
			fixedHeight = el.offset().top;
			fnDistanceInit();
		}, 500);

		let aDistances = {};
		function fnDistanceInit(){
			let jCodeItems = el.find(".codeItem");
			let nLen = jCodeItems.length;
			for(let i = 0; i < nLen; i++){
				let top = $(jCodeItems[i]).offset().top - fixedHeight;
				aDistances[$(jCodeItems[i]).html()] = top;
			}
		}
		//字母点中
		$("body")
			.on("touchstart", ".letterNav li:not(.start)", fnNavStartHandler)
			.on("touchmove", ".letterNav ul", fnNavChangeHandler)
			.on("touchend", ".letterNav ul,.letterNav li", fnEndHandler)
		;

		//字母切换start处理事件
		function fnNavStartHandler(e){
			e && e.stopPropagation();
			e && e.preventDefault();
			let jThis = $(this);

			getLetter($(this));
		}

		//字母切换move处理事件
		let timer = null;
		function fnNavChangeHandler(e){
			e && e.stopPropagation();
			e && e.preventDefault();

			//加个延时，取消字母的显示，解决安卓的兼容问题。
			if (timer) {
				$timeout.cancel(timer);
			}
			timer = $timeout(function(){
				$scope.isTouch = false;
			}, 200);

			let nPositionY = _fnGetTouchPosition(e.originalEvent).y, //最后一个滑动的Y值
				nBoxTop = $('.letterNav').offset().top,  //字母盒子的距离顶部的高度
				nItemHeight = $('.letterNav li')[0].clientHeight,  //每个字母的高度
				nIndex = parseInt((nPositionY - nBoxTop) / nItemHeight), //滑动了字母个数
				nboxHight =  $('.letterNav')[0].clientHeight//字母盒子本身的高度
			;

			//超出字母盒子的 极限控制
			if (nPositionY - nBoxTop < 0 || nIndex == 0) {
				nIndex = 1;//去掉第一个#号字母
			} else if (nPositionY - nBoxTop > nboxHight) {
				nIndex = $('.letterNav li').length - 1;
			}

			let jLetterNavItem = $('.letterNav li').eq(nIndex);

			getLetter(jLetterNavItem);
		}

		//获取当前的字母后的各种操作
		function getLetter(jLetterItem) {
			//当前选择的字母
			let currLetter = jLetterItem.find('.letter1').html();
			let jWrapper = el.find("> *");
			let sStyle = jWrapper.attr("style");
			let nTop = jWrapper.find(".codeItem[data-id='" + currLetter + "']").offset().top;

			$scope.$apply(function(){
				$scope.currLetter =  currLetter;
				$scope.isTouch = true;
			});

			sStyle = sStyle.replace(/translate\([^,\)]*?(,[^\)]*?)\)/ig, function($1, $2){
				let moveDistance = -aDistances[currLetter];
				let maxDistance = Math.abs(jWrapper.outerHeight() - el.outerHeight()) ;
				if (Math.abs(moveDistance) > maxDistance) {
					moveDistance = -maxDistance;
				}
				return $1.replace($2, "," + moveDistance + "px");
			});

			jWrapper.attr("style", sStyle);
		}

		/**
		 * 获取移动坐标信息
		 *
		 * @method
		 * @reurn {void}
		 */
		function _fnGetTouchPosition(e) {
			//初始位置，
			let touches = e.changedTouches,
				oMove = {
					x: e.pageX,
					y: e.pageY
				}
			;
			if(e.type.indexOf("touch") > -1){
				oMove.x = touches[touches.length - 1].pageX;
				oMove.y = touches[touches.length - 1].pageY;
			}

			return oMove;
		}

		//touch 结束之后事件。气泡圆圈消失
		function fnEndHandler(e){
			e.stopPropagation();
			e.preventDefault();
			$scope.$apply(function(){
				$scope.isTouch = false;
			})
		}
	}, 200);
	// return scroller;
}

//页面左滑动事件
export function bindSwipeHandler(callback){
	let startX = '';
	let moveEndX = '';
	let moveX = '';
	$("body").on("touchstart",function(e) {
		startX = e.originalEvent.changedTouches[0].pageX;
	});
	$("body").on("touchmove",function(e){
		moveEndX = e.originalEvent.changedTouches[0].pageX;
		moveX = moveEndX - startX;
		if (moveX > 100) {
			callback && callback();
		}
	})

}
