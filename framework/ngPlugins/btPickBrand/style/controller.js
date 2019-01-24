/* 车款选择
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-28 09:37:38
 * @Last Modified by:   dongxiaochai@163.com
 * @Last Modified time: 2018-04-28 09:37:38
 */
import provinceData from '../../../libs/area';
import '../../../util';

define([
], function(){
	return ["$scope", "$stateParams", "btPage", "brandService",
	function ($scope, $stateParams, btPage, brandService) {
		$scope.prevData = Util.parseJson(Util.decodeUri($stateParams.params));
		$scope.originData;//记录源
		$scope.searchObj = {
			gearBox: '',
			emission: ''
		};

		brandService.getStyleList($scope.prevData.modelId).then((data) => {
            if(data.code != 1){
                new Say(data.message);
            } else{
				$scope.yearList = data.yearList;
				$scope.originData = $scope.yearList;
				$scope.gearBoxGroup = data.gearBoxGroup;
				$scope.emissionGroup = data.emissionGroup;

				$scope.$watch("searchObj", (newData, oldData) => {
					let _yearList = angular.copy($scope.originData);

					for(let i = _yearList.length - 1; i >= 0; i--){
						let yearItem = _yearList[i];
						for(let j = yearItem.styleList.length - 1; j >= 0; j--){
							let styleItem = yearItem.styleList[j];

							if($scope.searchObj.gearBox !== '' && styleItem.isGearBox !== $scope.searchObj.gearBox){
								yearItem.styleList.splice(j, 1);
							} else if($scope.searchObj.emission !== '' && styleItem.emission !== $scope.searchObj.emission){
								yearItem.styleList.splice(j, 1);
							}
						}
						if(yearItem.styleList.length === 0){
							_yearList.splice(i, 1);
						}
					}
					$scope.yearList = _yearList;
				}, true);
			}
		});

		$scope.choseStyle = (item) => {
            btPage.goBack({
				step: 2,
				args: Object.assign({}, $scope.prevData, item)
			});
	 	}
        //取消搜索
        $scope.goBack = () => {
            btPage.goBack();
		};
	}];
});