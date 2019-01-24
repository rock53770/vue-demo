/**
 * 混合demo
 */
define([
    "webViewBridge"
], function(){
    return ["$scope", "$rootScope", "$stateParams","$timeout", "btPage",
    function ($scope, $rootScope, $stateParams, $timeout, btPage) {
        $scope.setPageTitle("全屏展示demo");

        $scope.num = parseInt($stateParams.num || "1");

        $scope.count = 0;
        $scope.testStr = "123";

        //页面后退回调
        function resumeFunc (data) {
            if(data){
                // console.log(data);
                $scope.param1 = data.aa;
                $scope.param2 = data.bb;

                if(data.testStr){
                    $scope.testStr += data.testStr;
                }

                if(data.skipPath){
                    btPage.open(data.skipPath);
                }
            } else{
                new Say('没有传参');
            }
            $scope.count++;
        }

        $scope.openPhotoDialog1 = function(){
            btPage.open({
                url: "/demo/btPage/modal",
                jsOnResume: resumeFunc
            });
        }

        //openFull---全屏方式打开窗口
        $scope.openPhotoDialog4 = function(){
            btPage.openFull({
                url: "/demo/btPage/modal?test_param=abc",
                jsOnResume: resumeFunc,
                isTransparent: true
            });//默认就是弹层形式，不用传isModal
        }

        //openFull---全屏方式打开窗口
        $scope.openPhotoDialog5 = function(){
            btPage.openFull({
                url: "/demo/btPage/modal?test_param=abc",
                jsOnResume: resumeFunc,
                isTransparent: false
            });//默认就是弹层形式，不用传isModal
        }

        //openModal---传url
        $scope.openPhotoDialog2 = function(){
            btPage.openModal({
                url: '/demo/btPage/modal',
                params: {
                    test_param: "abc"
                },
                jsOnResume: resumeFunc,
                animateClass: 'an-slideDown'
            })//h5模态窗口
        }


        //openModal---传控制器和模板打开模态弹层
        $scope.openPhotoDialog3 = function(){
            require([
                './modal/view.html',
                "./modal/controller"
            ], function(tmpl, ctrl){
                btPage.openModal({
                    controller: ctrl,
                    template: tmpl,
                    params: {
                        test_param: $scope.testStr
                    },
                    jsOnResume: resumeFunc
                });
            });
        }
    }];
});

