/* 省市选择
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-28 09:37:12
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-02 16:20:27
 */
import 'say';
import provinceData from '../../../libs/area';
import '../../../util';
import {initLetterPosition, bindSwipeHandler} from '../../_pickBase';

define([
], function(){
	return ["$scope", "$rootScope", "$stateParams", "$timeout", "$q", "$ajaxJson", "btPage", "locationService",
	function ($scope, $rootScope, $stateParams, $timeout, $q, $ajaxJson, btPage, locationService) {
		let provinceList = provinceData.provList;

		let vm = this;
		$scope.vm = vm;

		$scope.loadMark1 = 1;//滚动识别号
		$scope.loadMark2 = 1;//滚动识别号

		function stopBodyScroll(t) {
			window.stopBodyScroll && window.stopBodyScroll(t);
		}
		stopBodyScroll(true);

		$scope.deep = $stateParams.deep || 2;
		$scope.showHot = $stateParams.showHot === undefined || $stateParams.showHot.toString() === 'false' || $stateParams.showHot == '0' ? false : true;
		$scope.showLocation = $stateParams.showLocation === undefined || $stateParams.showLocation.toString() === 'false' || $stateParams.showLocation == '0' ? false : true;
		$scope.required = $stateParams.required === undefined || $stateParams.required.toString() === 'true' || $stateParams.required == '1' ? true : false;

		$scope.cityList = [];

        $scope.currLocation = null;
        //获取当前定位信息
        $scope.getLocation = function(){
            $scope.isLoadingCity = true;
            //读取地理位置
            locationService.getLocation(true).then(
                function(data){
                    $scope.isLoadingCity = false;
                    $scope.currLocation = data;
					// console.log(data,"data");
					$scope.loadMark1++;//刷新scroller
                }
            );
        }

		//初始化热门城市
		$scope.getHotCity = () => {
			$scope.hotCity = [];
			locationService.getHotCitys().then(function(data){
				if(data.code != 1){
					new Say(data.message);
				}else{
					angular.forEach(data.object, function(item, index){
						$scope.hotCity.push(new Array(item.cityId, item.provinceId, item.cityName));
					});
					$scope.loadMark1++;//刷新scroller
				}
			});
		}

        //初始化字母和省份
        function initData(){
            $scope.letters = {};
            let letterCharCode = 65;
            for(let i = 0; i < 26; i++){
				let sLetter = String.fromCharCode(letterCharCode + i);
				let letterItem = {
                    letter: sLetter,
					items: []
				};

				angular.forEach(provinceList, function(item, index){
					var firstLetter = item[3].substr(0,1).toUpperCase();
					if(firstLetter === sLetter){
						letterItem.items.push(item);
					}
				});

				if(letterItem.items.length){
					$scope.letters[sLetter] = letterItem;
				}
            };
			initLetterPosition('.scroll-box1', $scope, $timeout);
			bindSwipeHandler(() => {
				$scope.$apply(function(){
					$scope.cityList = [];
				})
			});
        }
        initData();

		$scope.currProvince = null;
		$scope.currCity = null;
        //选择省份
        $scope.choseProvince = function(id, name){
			if(id){//非全国
				$scope.currProvince = {
					provinceId: id,
					provinceName: name
				};
                $scope.cityList = provinceData.getCityList(id);
            } else{
                submitSearch({
					provinceId: null,
					provinceName: '全国'
				});
            }
        };

        //选择城市
        $scope.choseCity = function(item){
			$scope.currCity = Object.assign({
				cityId: item[0],
				cityName: item[2]
			}, $scope.currProvince);

			if($scope.deep > 2){
				btPage.$openFull({
					url: "/pick_area/country",
					animateClass: 'an-slideRight',
					isTransparent: false,
					params: {
						params: Util.encodeUri(Util.stringify(Object.assign({}, $scope.currProvince, $scope.currCity)))
					},
					jsOnResume: (data) => {
						if(data){
							submitSearch(data);
						}
					}
				});//默认就是弹层形式，不用传isModal
			}else{
				submitSearch($scope.currCity);
			}
		}

		//直接选择城市
		$scope.choseCityDirect = (item) => {
			$scope.currProvince = getProvince(item[1]);
			$scope.choseCity(item);
		}

		function getProvince(provinceId) {
			for(let i = 0; i < provinceList.length; i++){
				if(provinceList[i][0] === provinceId){
					return {
						provinceId: provinceList[i][0],
						provinceName: provinceList[i][2]
					}
				}
			}
			return null;
		}

        vm.matchKey = "";
        $scope.showKeyMatch = false;
        $scope.matchCitys = [];
        //关键词匹配聚焦
        $scope.searchfocus = function(){
            if(!$scope.showKeyMatch){
                $scope.showKeyMatch = true;
                $scope.matchCitys = [];
            }
        }


        //关键词匹配失焦
        $scope.searchBlur = function(){
            $scope.showKeyMatch = false;
        };

        let watcher = $scope.$watch("vm.matchKey", function(newData, oldData){
            $scope.matchCitys = locationService.getCityByKey(newData);
        }, true);

        //提交搜索 将选择城市存储在本地
        function submitSearch(data){
			if(data){
				data = Object.assign({}, $scope.currProvince, $scope.currCity, data);
			}
            let str = ''
			stopBodyScroll(false);

            btPage.goBack({
				args: data
			})
            // //区别下估价和列表页进来，$scope.pagerParams 这里是有参数的。估价的页面多一个entraType==1，估价选择城市不记录浏览城市
            // if ( $scope.pagerParams == undefined  ||  $scope.entraType != 1) {

            //     $scope.browseCityList =  JSON.parse(Util.getLocalData("_g_city_history_")) || [];
            //     if ($scope.browseCityList.length < 3) {
            //         $scope.browseCityList.unshift(data);
            //         $scope.browseCityList =removal($scope.browseCityList);
            //         str = JSON.stringify($scope.browseCityList);
            //         Util.setLocalData("_g_city_history_",str);
            //         //同时改变本地的设置的城市setCurrCity
            //         Util.setLocalData("currCityInfo",$scope.browseCityList[0]);
            //     }else {
            //         //删除第一个。并用新的替代
            //         $scope.browseCityList.pop();
            //         $scope.browseCityList.unshift(data);
            //         $scope.browseCityList = removal($scope.browseCityList);
            //         str = JSON.stringify($scope.browseCityList);
            //         Util.setLocalData("_g_city_history_",str);
            //         //同时改变本地的设置的城市setCurrCity
            //         Util.setLocalData("currCityInfo",$scope.browseCityList[0]);
            //     }
            // }
        };

        //本地存储调取
        // $scope.browseCityList =  JSON.parse(Util.getLocalData("_g_city_history_")) || [];

        //对象数组去重
        function removal(array){
            let tmp = array;
            let result = [], hash = {};
            for (let i = 0; i<tmp.length; i++) {
                let pId = tmp[i][0];
                if (!hash[pId]) {
                        result.push(tmp[i]);
                    hash[pId] = true;
                }
            }
            return result;
        }

        //取消搜索
        $scope.cancelSearch = function(){
            if($scope.showKeyMatch){
                vm.matchKey = "";
                $scope.showKeyMatch = false;
            } else{
                btPage.goBack();
            }
            stopBodyScroll(false);
        };
	}];
});