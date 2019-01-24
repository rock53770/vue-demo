/**
 * 弹层调用
 */
define([], function(){
    return ["$scope", "$rootScope", "$stateParams", "$location", "$timeout",
    function ($scope, $rootScope, $stateParams, $location, $timeout) {
        $scope.setPageTitle("弹层调用demo");

        //加载中
        $scope.clickHandler1 = function(){
            Loading.show("提交中");
            
            $timeout(function(){
                Loading.hide();
            }, 2000);
        };

        //as1
        $scope.clickHandler2 = function(){
            new Confirm({
                desc: "体现卡只能奥迪法师打发士大夫是当时大士大夫士大夫是大法师的发送到发送到",
                okText: "留在本页", //默认文案是确定，这里要改的话
                cancelText: "退出",
                onok: function(){//
                    alert("执行确定回调");
                }
            });
        };

        //as2
        $scope.clickHandler3 = function(){
            new Confirm({
                title: "有标题的弹出层",
                desc: "体现卡只能奥迪法师打发士大夫是当时大士大夫士大夫是大法师的发送到发送到",
                onok: function(){
                    alert("执行确定回调");
                },
                oncancel: function(){//取消也需要绑定事件的情况，请传
                    alert("执行取消回调");
                }
            });
        };

        //as3
        $scope.clickHandler4 = function(){
            //方式1
            // new Confirm({
            //     desc: "体现卡只能奥迪法师打发士大夫是当时大士大夫士大夫是大法师的发送到发送到",
            //     onok: function(){
            //         alert("执行确定回调");
            //     },
            //     "cancelText": ""//去掉取消按钮
            // });

            //方式2（不需要传确定回调的情况）
            new Confirm("体现卡只能奥迪法师打发士大夫是当时大士大夫士大夫是大法师的发送到发送到");
        };

        //as4
        $scope.clickHandler5 = function(){
            new Confirm({
                title: "有标题的弹出层",
                desc: "体现卡只能奥迪法师打发士大夫是当时大士大夫士大夫是大法师的发送到发送到",
                onok: function(){
                    alert("执行确定回调");
                },
                "cancelText": ""//默认会有取消按钮，这里去掉取消按钮
            });
        };

        //ls1
        $scope.clickHandler6 = function(){
            new Say({
                title: "提交成功",
                type: "success"
            });
        };

        //ls2
        $scope.clickHandler7 = function(){
            new Say({
                title: "提交失败",
                type: "error"
            });
        };

        //as6
        $scope.clickHandler8 = function(){
            new Say("请输入VIN码fdsafdsf鬼斧神工讽德诵功的是法国顺丰大概 ");//默认一个String型参数的调用就是as6
        };
    }];
});