/* 地区选择
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-28 09:36:57
 * @Last Modified by:   dongxiaochai@163.com
 * @Last Modified time: 2018-04-28 09:36:57
 */
import provinceData from '../../../libs/area';
import '../../../util';

define([
], function(){
	return ["$scope", "$stateParams", "btPage",
	function ($scope, $stateParams, btPage) {
		let provinceList = provinceData.provList;

		$scope.prevData = Util.parseJson(Util.decodeUri($stateParams.params));
		$scope.countryList = provinceData.getCountryList($scope.prevData.cityId);

		$scope.choseDistrict = function (item) {
            btPage.goBack({
				step: 2,
				args: Object.assign({
					countryId: item[0],
					countryName: item[2]
				}, $scope.prevData)
			});
	 	}
        //取消搜索
        $scope.goBack = function(){
            btPage.goBack();
        };
	}];
});