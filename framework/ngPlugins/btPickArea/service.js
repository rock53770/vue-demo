/* 省市区服务（注意如果要重写传入，方法和返回格式要保证一致，否则逻辑会有问题）
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-23 14:46:02
 * @Last Modified by:   dongxiaochai@163.com
 * @Last Modified time: 2018-04-23 14:46:02
 */

import provinceData from '../../libs/area';

export default function(appService){
	return ["$q", "$ajaxJson", function($q, $ajaxJson) {
		var _cityInfo = null,
			LOCATION_STORAGE_KEY = "locationInfo",
			CURR_CITY_STORAGE_KEY = "currCityInfo",
			_cityDefault = [null, null, "全国"]
		;
		var _services = {
			/**
			 * 获取当前用户信息
			 * @return {Object}
			 */
			getLocationInfo: function(){
				var deferred = $q.defer(),
					_this = this,
					_locationInfo = null
				;

				if(GConfig.isInApp){
					wv.getCurrentUserLocation(function(data){
						if(data.code != 0){
							deferred.resolve(data);
						} else{
							deferred.reject(data);
						}
					});
				} else{
					var oOption = {
							// 指示浏览器获取高精度的位置，默认为false
							enableHighAccuracy: true,
							// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
							timeout: 5000,
							// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
							maximumAge: 0
							// ,
							// addrType: "all"
						},
						oReturn = {
							longitude: null, //经度
							latitude: null,  //纬度
							// province: "",
							// city: "",
							// district: "",
							// address: "",
							code: 1,    //1成功，0失败
							type: 1//1百度坐标，2火星坐标
						}
					;

					// if(navigator.geolocation){//支持h5获取地理位置
					//     navigator.geolocation.getCurrentPosition(function(r){
					//         oReturn.longitude = r.coords.longitude;
					//         oReturn.latitude = r.coords.latitude;
					//         oReturn.type = 1;

					//         deferred.resolve(oReturn);
					//     }, function(error){//h5获取失败的话调用百度
					//         // alert("h5 faild");
					//        _getBaiduMapLocation(deferred);
					//     }, oOption);
					// } else{
						_getBaiduMapLocation(deferred);
					// }


					//调用百度地图获取地理位置
					function _getBaiduMapLocation(){
						Util.getScripts(GConfig.BAIDU_MAP_API, function(){
							var geolocation = new BMap.Geolocation();
							geolocation.getCurrentPosition(function(r){
								if(this.getStatus() == BMAP_STATUS_SUCCESS){
									oReturn = {
										longitude: r.point.lng, //经度
										latitude: r.point.lat,  //纬度
										province: r.address.province,
										city: r.address.city,
										// district: r.address.district,
										// address: r.address.province + r.address.city + r.address.district + r.address.street + r.address.street_number,
										type: 1
									};

									var pt = r.point;
									var myGeo = new BMap.Geocoder();
									myGeo.getLocation(pt, function(result){
										oReturn.address = result.address;
										$.extend(oReturn, result.addressComponents);
										deferred.resolve(oReturn);
									});
									// deferred.resolve(oReturn);
								} else{
									oReturn.code = 0;
									deferred.reject(oReturn);
								}
							}, oOption);
						});
					}
				}

				return deferred.promise;
			},

			/**
			 * 读取热门城市
			 * @return {Object}
			 */
			getHotCitys: function(){
				var deferred = $q.defer(),
					URL = "/city/hotCity",   //正式接口地址
					TEST_URL = "/json/getHotCitys.json"   //测试接口地址
				;

				$ajaxJson({
					method: "get",
					testUrl: TEST_URL,
					url: URL,
					data: {
					}
				}).then(function(data){
					deferred.resolve(data);//成功
				});

				return deferred.promise;
			},
			/**
			 * 获取当前用户信息
			 * @param {Boolean} isForce 是否强制获取
			 * @return {Object}
			 */
			getLocation: function(isForce){
				var deferred = $q.defer(),
					_this = this,
					_locationInfo = null
				;
				if(isForce == undefined){
					isForce = false;
				}

				if(!isForce){
					_locationInfo = Util.getSessionData(LOCATION_STORAGE_KEY);
				}
				if(!_locationInfo){
					Util.getScripts(GConfig.BAIDU_MAP_API, function(){
						// var oOption = {
						//     // 指示浏览器获取高精度的位置，默认为false
						//     enableHighAccuracy: true,
						//     // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
						//     timeout: 5000,
						//     // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
						//     maximumAge: 3000
						// };
						// var geolocation = new BMap.Geolocation();
						// geolocation.getCurrentPosition(function(r){
						//     if(this.getStatus() == BMAP_STATUS_SUCCESS){
						//         // var mk = new BMap.Marker(r.point);
						//         // map.addOverlay(mk);
						//         // map.panTo(r.point);
						//         console.log(r);
						//         // alert('您的位置：'+r.point.lng+','+r.point.lat);
						//     }
						//     else {
						//         // alert('failed'+this.getStatus());
						//     }
						// },oOption);


						//根据IP定位地理位置
						var myCity = new BMap.LocalCity();
						myCity.get(function(r){
							var asCity = provinceData.getCityByBaiduCode(r.code);//根据百度cityID返回城市对象
							_locationInfo = asCity;
							Util.setSessionData(LOCATION_STORAGE_KEY, _locationInfo);

							deferred.resolve(_locationInfo);
						}, function(){
							// alert("无权限");
						});
					});
				}
				if(_locationInfo){
					deferred.resolve(_locationInfo);
				}
				return deferred.promise;
			},

			/**
			 * 获取用户所在城市
			 * @param {Boolean} isStrict 是否读取(是的话如果本地存储没有则返回null，否则本地存储没有的话返回全国)
			 * @return {Object}
			 */
			getCurrCity: function(isStrict){
				if(_cityInfo === null){
					_cityInfo = Util.getSessionData(CURR_CITY_STORAGE_KEY);
				}

				if(!_cityInfo){
					if(isStrict){
						return null;
					} else{
						return _cityDefault;
					}
				}
				return _cityInfo;
			},

			/**
			 * 设置所在区域城市
			 * @param {Object} cityArr 所在城市对象
			 */
			setCurrCity: function(cityArr){
				_cityInfo = cityArr;
				Util.setSessionData(CURR_CITY_STORAGE_KEY, _cityInfo);
			},

			/**
			 * 根据provinceId获取省份数组对象
			 * @return {Array} 省份
			 */
			getProvinceById: function(provinceId){
				if(provinceId == 0){
					return [null, null, ""];
				}
				for(var i = 0; i < provinceData.provList.length; i++){
					if(provinceData.provList[i][0] == provinceId){
						return provinceData.provList[i];
					}
				}
				return [];
			},

			/**
			 * 根据cityId获取城市数组对象
			 * @return {Array} 城市
			 */
			getCityById: function(cityId){
				/**
				 * 如果city没传或者等于0或者等于null或者等于'',都返回默认的_cityDefault
				 * modify by ashaLiu 2016-10-12
				 */
				if(!cityId){
					return _cityDefault;
				}
				for(var i = 0; i < provinceData.cityList.length; i++){
					if(provinceData.cityList[i][0] == cityId){
						return provinceData.cityList[i];
					}
				}
				return [];
			},

			/**
			 * 根据关键词匹配城市
			 * @param {String} key 关键词
			 * @return {Array} 城市
			 */
			getCityByKey: function(key){
				if(!key){
					return [];
				}
				var aoDataList = [];
				for(var i = 0; i < provinceData.cityList.length; i++){
					var asItem = provinceData.cityList[i];
					if(_fnCompare(asItem[2], key) || _fnCompare(asItem[3], key) || _fnCompare(asItem[4], key)){
						aoDataList.push(asItem);
					}
				}

				function _fnCompare(str1, str2){
					return str1.toUpperCase().indexOf(str2.toUpperCase()) == 0;
				}

				return aoDataList;
			}
		}

		//扩展服务
		if(appService){
			Object.assign(_services, appService);
			// console.log('新的service', _services);
		}

		// console.log('第一次注册', _services);
		return _services;
	}];
};
