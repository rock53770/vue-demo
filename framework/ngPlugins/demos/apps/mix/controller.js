/**
 * 混合demo
 */
// 如果在全局没引入插件，这里主动引入一下（已经引入就不需要了）
import app from 'js/app';
import BtPickAreaPlugin from 'framework/ngPlugins/btPickArea';
import BtPickBrandPlugin from 'framework/ngPlugins/btPickBrand';
app.use(BtPickAreaPlugin);
app.use(BtPickBrandPlugin);

define([//"services/locationService", "services/memberService"
], function(){
    return ["$scope", "$rootScope", "$stateParams", "$location", "btPage", "btPickArea", "btPickBrand",
    function ($scope, $rootScope, $stateParams, $location, btPage, btPickArea, btPickBrand) {
        $scope.setPageTitle("hybird混合demo");
        $scope.imgList = [];

        var oShareObj = {
            sharePhotos: "http://public.upload.cheok.com/PUBLIC/CAR_IMAGE/2016-08-24/989c1146-f759-412f-92f4-78630ff99ec8-300.jpg",
            shareTitle: "备胎金服",
            shareDesc: "备胎金服就是牛",
            shareUrl: "http://m.cheok.com"
        };

        //定制分享按钮
        window.wv && wv.initShareMenuButton(oShareObj, function(data){
            alert(data.status == 1 ? "分享成功1" : "分享失败1");
        });

        //主动调用分享
        $scope.sharePage = function(){
            wv.shareInfo(oShareObj, function(data){
                alert(data.status == 1 ? "分享成功2" : "分享失败2");
            });
        };

        //上传图片
        $scope.uploadPic = function(){
            wv.showImagePickDialog({
                maxCount: 3,    //最多上传张数
                type: 2         //普通拍照模式（非行驶证）
            }, function(data) {
                if (data.object && data.object.length) {
                    $scope.$apply(function() {
                        angular.forEach(data.object, function(item){
                            $scope.imgList.push(item);
                        });
                    });
                }
            });
        };

        // //获取当前定位信息
        // $scope.getLocationInfo = function(){
        //     locationService.getLocationInfo().then(function(data){
        //         console.log(data);
        //         $scope.locationInfo = data;
        //     }, function(){
	       //      new Confirm({
		      //       title: "定位未开启",
		      //       desc: "您未授权定位权限，请至设置 - 隐私 - 定位服务中找到备胎好车商家版并开启定位权限。",
		      //       onok: function(){
		      //       },
		      //       "cancelText": ""
	       //      });
        //     });
        // };



        //登录信息
        $scope.userInfo = null;

        // //去登录
        // $scope.goToLogin = function(){
        //     var oOption = {
        //         url: "/system/login",
        //         type: 0,
        //         jsOnResume: function(data){//登录成功后相应的回调
        //             memberService.getLoginUserInfo().then(function(data){
        //                 $scope.userInfo = data;
        //             });
        //         }
        //     };

        //     btPage.open(oOption);
        // };

        //登录返回调用
        $scope.loginGoBack = function(){

        };



        //省市信息
        $scope.cityInfo = {
            // provinceId: 1,
            // provinceName: "浙江省",
            // cityId: 2,
            // cityName: "杭州"
        };

        //选择省市区
        $scope.pickArea = function(){
            wv.showAreaPicker(function(data){
                $scope.$apply(function(){
                    $scope.cityInfo = data;
                });
            }, 2);
        }

        $scope.skip = function(){
            wv.openPage({
                url: "/home",
                closePageCount: 2
            });
        }

        $scope.bury = function(){
            wv.bury({
                actionId: "c_abcd",
                actionType: 1,
                extras: {
                    a: 123,
                    bbbs: "小黄豆"
                }
            });
        }

        //选择省市区
        $scope.pickArea = function(){
            btPickArea({
				deep: 2,//选择的层级
				useH5: true,//是否强制使用h5(默认否，根据app还是web端进行适配)
				showHot: true,//是否显示热门
				showLocation: true,//是否显示当前定位，默认否
				required: true //是否必选，如果否的话，就显示全国和所有城市，默认是
			}).then(function(data){
        		$scope.areaInfo = data;
				console.log(data);
            });
		}

        //选择品牌车型车款
        $scope.pickBrand = function(){
            btPickBrand({
				deep: 3,//选择的层级
				useH5: true,//是否强制使用h5(默认否，根据app还是web端进行适配)
				showHot: true,//是否显示热门，默认否
				required: true //是否必选，如果否的话，就显示全国和所有城市，默认是
			}).then(function(data){
        		$scope.brandInfo = data;
				console.log(data);
            });
		}
    }];
});