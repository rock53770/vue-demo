/**
 * 通知列表控制器
 *
 * @author dongxiaochai @163.com
 * @since 2015-11-13
 */
import app from 'js/app';
import BtScrollerPlugin from 'framework/ngPlugins/btScroller';
app.use(BtScrollerPlugin);

let testJson = {
    "code": 1,
    "message": "成功!",
    "object": [{
        "noticeID": 1,
        "publishTime": "2015-08-15",
        "title": "1完成授信送现金！",
        "buyerName": "张三",
        "picture": "./img/test/test1.png",
        "linkUrl": "akstaff://www.btjf.com/index/wallet",
        "isRead": 0,
        "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    },{
        "noticeID": 2,
        "publishTime": "2015-08-15",
        "title": "2完成授信送现金！",
        "buyerName": "张三",
        "picture": "",
        "isRead": 1,
        "summary": "只要在2015年9月30日之前通过授信认证，送50元现金！名额有限，先来先得哦~asdasdasdasdasdad收到了卡洛斯的解放拉萨法律框架的"
    }],
    "map": {},
    "page": {
        "currentPage": 0,
        "pageRecords": 20,
        "totalPages": 2,
        "totalRecords": 1,
        "startRecord": 0,
        "nextPage": 0,
        "previousPage": 0,
        "hasNextPage": false,
        "hasPreviousPage": false
    }
};
define(["say"
], function(Say){
    return ["$scope", '$q', '$timeout', 'btRefs',
    function ($scope, $q, $timeout, btRefs) {
		$scope.moduleClass = "demo-wrapper";

        //列表请求查询条件
        $scope.pagerParams = {
            currentPage: 0, //当前页
            pageSize: 10   //每页显示条数
        };
        $scope.dataList = [];

        //加载列表信息
        $scope.pullData = function(){
			let deferred = $q.defer();
			let promise = deferred.promise;

			$timeout(() => {
				deferred.resolve(testJson);
			}, 500);

			promise.then(function(result) {
				// console.log('getData', $scope.pagerParams.currentPage)
			  	if (result.code != 1) {
					new Say(result.message);
			  	} else {
					if ($scope.pagerParams.currentPage == 0) {
						$scope.dataList = result.object;
					} else {
						$scope.dataList = [...$scope.dataList, ...result.object];
					}
					$scope.showNoData = result.page.totalPages == 0;
				  }
			});

			return promise;
		};

		//主动触发刷新列表
		$scope.refresh = () => {
			btRefs.get('scroller1').triggerRefresh();
		}
		//滚动到顶部
		$scope.scrollToTop = () => {
			btRefs.get('scroller1').scrollToTop();
		}

		//异步获取指令的注入引用
		btRefs.getAsync('scroller1').then(function(scroller1){
			console.log(scroller1);
		});
    }];
});