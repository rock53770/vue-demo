/**
 * 混合demo
 */
define([
    "webViewBridge"
], function(){
    return ["$scope", "$rootScope", "$stateParams", "btPage",
    function ($scope, $rootScope, $stateParams, btPage) {
        $scope.setPageTitle("全屏弹框展示demo");
        $scope.moduleClass = "s4Query-wrapper";
        console.log("$stateParams:", $stateParams);

        $scope.test_param = $stateParams.test_param;

        // $scope.callBack = function(step, args){
        //     btPage.goBack({
        //         step: step,
        //         args: args
        //     });
        // }
        $scope.call1 = function () {
            btPage.goBack({
                args: {aa: 111, bb: "小黄豆111", testStr: "豆"}
            });
        };

        $scope.call2 = function () {
            btPage.goBack({
                args: {aa: 222, bb: "小黄豆222"}
            });
        };

        $scope.call3 = function () {
            btPage.goBack({
                step: 2,
                args: {aa: 222, bb: "小黄豆222"}
            });
        };

        $scope.skipToOther = function(){
            btPage.goBack({
                step: 1,
                args: {skipPath: '/car_appraisal/query'}
            });
        }

        $scope.openAnther = function () {
            btPage.openModal({
                url: "/demo/btPage/modal?test_param=def",
                jsOnResume: function(data){
                    new Say("来自modal页面的回调提示：" + JSON.stringify(data));
                }
            });//默认就是弹层形式，不用传isModal
        };

        //取消
        $scope.cancel = function(){
            btPage.goBack();

            // btPage.close();
        };
    }];
});

