/* 品牌车型选择
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-28 09:36:36
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-02 16:19:13
 */

import 'say';
import '../../../util';
import pinyin from 'framework/libs/pinyin';
import {initLetterPosition, bindSwipeHandler} from '../../_pickBase';

define([
], function(){
	return ["$scope", "$rootScope", "$stateParams", "$timeout", "$q", "$ajaxJson", "btPage", "brandService",
	function ($scope, $rootScope, $stateParams, $timeout, $q, $ajaxJson, btPage, brandService) {
		let vm = this;

		$scope.vm = vm;
		$scope.brandList;

		$scope.loadMark1 = 1;//滚动识别号
		$scope.loadMark2 = 1;//滚动识别号

        $scope.defaultBrandImg = require('../../_pickBase/brandIcon.png');

		function stopBodyScroll(t) {
			window.stopBodyScroll && window.stopBodyScroll(t);
		}
		stopBodyScroll(true);

		$scope.deep = $stateParams.deep || 2;
		$scope.showHot = $stateParams.showHot === undefined || $stateParams.showHot.toString() === 'false' || $stateParams.showHot == '0' ? false : true;
		$scope.required = $stateParams.required === undefined || $stateParams.required.toString() === 'true' || $stateParams.required == '1' ? true : false;

		// $scope.modelList = [];
		$scope.factoryList = [];

        $scope.hotBrand = [];
        // brandService.getHotBrandList().then(function(data){
		// 	console.log(data)
        //     if(data.code != 1){
        //         new Say(data.message);
        //     }else{
        //         $scope.hotBrand = data.object;
        //     }
        // });

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

				angular.forEach($scope.brandList, function(item, index){
					var firstLetter = pinyin.getCamelChars(item.brandName).substr(0,1).toUpperCase();
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
					// $scope.modelList = [];
					$scope.factoryList = [];
				})
			});
		}

		//获取品牌
        brandService.getBrandList().then(data => {
            if(data.code != 1){
                new Say(data.message);
            }else{
				$scope.brandList = data.object;

				angular.forEach($scope.brandList, (item, index) => {
					// console.log(item)
					if(item.isHot == 1){
						$scope.hotBrand.push(item);
					}
				});
            }
			initData();
		});

		$scope.currBrand = null;
		$scope.currModel = null;
        //选择品牌
        $scope.choseBrand = function(item){
			$scope.currBrand = item;
			brandService.getModelList(item.brandId).then(data => {
				if(data.code != 1){
					new Say(data.message);
				} else{
					// $scope.modelList = data.object;
					$scope.factoryList = data.factoryList;
				}
			});
			vm.matchKey = "";
			$scope.showKeyMatch = false;
		};

        //选择车型
        $scope.choseModel = function(item){
			$scope.currModel = item;

			if($scope.deep > 2){
				btPage.$openFull({
					url: "/pick_brand/style",
					animateClass: 'an-slideRight',
					isTransparent: false,
					params: {
						params: Util.encodeUri(Util.stringify(Object.assign({}, $scope.currBrand, $scope.currModel)))
					},
					jsOnResume: (data) => {
						if(data){
							submitSearch(data);
						}
					}
				});//默认就是弹层形式，不用传isModal
			}else{
				submitSearch($scope.currModel);
			}
		}

		//直接选择车型
		$scope.choseModelDirect = (item) => {
			brandService.getBrandDetail(item.brandId).then((data) => {
				$scope.currBrand = data;
				$scope.choseModel(item);
			});
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

		//频率控制
		var debounceFn = Util.debounce(function(newData, oldData){
			if(newData){
				brandService.searchByKey(newData).then((data) => {
					$scope.matchCitys = data.object;
				});
			} else{
				$scope.matchCitys = null;
			}
        }, 500)
        let watcher = $scope.$watch("vm.matchKey", debounceFn, true);

        //提交搜索 将选择城市存储在本地
        function submitSearch(data){
			if(data){
				data = Object.assign({}, $scope.currBrand, $scope.currModel, data);
			}
            let str = ''
			stopBodyScroll(false);

            btPage.goBack({
				args: data
			})
        };

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