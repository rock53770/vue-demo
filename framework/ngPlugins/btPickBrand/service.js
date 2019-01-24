/* 品牌车系车款接口服务（注意如果要重写传入，方法和返回格式要保证一致，否则逻辑会有问题）
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-21 18:54:34
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-04-27 14:55:11
 */
export default function(appService){
	return ["$q", "$ajaxJson", function($q, $ajaxJson) {
		let STORAGE_TIME = -1;//缓存分钟
        let services = {
            /**
             * 获取品牌列表接口
             * @return {data}
             */
            getBrandList() {
                let deferred = $q.defer(),
                    _this = this,
                    TEST_URL = "/json/brand/brandList.json",
                    URL = '/xyapi/XLoanQuotaAssessment/GetCarBrands',
                    STORAGE_KEY = "_global_brand"
                ;
				let _localData = Util.getLocalData(STORAGE_KEY, STORAGE_TIME);

                if(!_localData){
					$ajaxJson({
						method: 'get',
						testUrl: TEST_URL,
						url: URL,
						data: {
						},
						requestType: 1
					}).then(function(data) {
						transferData(data);

						_localData = data;
						Util.setLocalData(STORAGE_KEY, _localData);
						deferred.resolve(_localData); //成功
					});
                } else{
                    deferred.resolve(_localData);
                }

				//消费贷数据处理，为了跟好车保持一致
				function transferData(data){
					if(data.code == 1){
						let list = [];
						angular.forEach(data.object, (item, index) =>{
							let newItem = {
								brandId: item.FID,
								brandName: item.FName,
								isHot: item.IsHot,
								logoUrl: item.FUrl
							}
							list.push(newItem);
						})

						data.object = list;
					}

					return data;
				}
                return deferred.promise;
			},

			//根据ID获取品牌
			getBrandDetail(brandId){
				let deferred = $q.defer();
				services.getBrandList().then(data => {
					data = data.object;
					let brand = null;
					for(let i = 0; i < data.length; i++){
						if(data[i].brandId == brandId){
							brand = data[i];
							break;
						}
					}
					deferred.resolve(brand);
				})
				return deferred.promise;
			},

            /**
             * 获取车型列表接口
             * @param  {Integer} brandId 品牌ID（为空时返回全部的车型）
             * @return {data}
             */
            getModelList(brandId) {
                let deferred = $q.defer(),
                    _this = this,
                    TEST_URL = "/json/brand/modelList.json",
                    URL = '/xyapi/XLoanQuotaAssessment/GetCarSeries',
                    STORAGE_KEY = "_global_model"
                ;
				let _localData = Util.getLocalData(STORAGE_KEY, STORAGE_TIME);

                if(!_localData){
					$ajaxJson({
						method: 'get',
						testUrl: TEST_URL,
						url: URL,
						data: {
							brandId: brandId
						},
						requestType: 1
					}).then(function(data) {
						transferData(data)
						_localData = data;
						Util.setLocalData(STORAGE_KEY, _localData);
						deferred.resolve(_localData); //成功
					});
                } else{
                    deferred.resolve(_localData);
                }

				//消费贷数据处理，为了跟好车保持一致
				function transferData(data){
					if(data.code == 1){
						let list = [];
						let factoryList = [];

						//排序
						data.object.sort((a, b) => {
							return a.FFactory + a.FName > b.FFactory + b.FName ? 1 : -1;
						})

						angular.forEach(data.object, (item, index) =>{
							let newItem = {
								brandId: item.FBrandID,
								modelId: item.FID,
								modelName: item.FName,
								factoryName: item.FFactory
							};
							list.push(newItem);

							//产商组合
							(() => {
								let isNewGroup = true;
								for(var i = 0; i < factoryList.length; i++){
									if(factoryList[i].factoryName === newItem.factoryName){
										factoryList[i].modelList.push(newItem);
										isNewGroup = false;
										break;
									}
								}
								if(isNewGroup){
									factoryList.push({
										factoryName: newItem.factoryName,
										modelList: [newItem]
									})
								}
							})();
						})
						data.factoryList = factoryList;
						data.object = list;
					}

					return data;
				}

                // //返回最终的车型数据格式
                // function _getList(){
				// 	console.log(_localData, brandId)
                //     if(!brandId){
                //         return _localData;
                //     } else{
                //         let _aoList = [];
                //         for(let i = 0; i < _localData.object.length; i++){
                //             if(_localData.object[i].brandID == brandId){
                //                 _aoList.push(_localData.object[i]);
                //             }
                //         }
                //         if(_aoList && _aoList.length){
                //             _aoList.sort(function(a, b){
                //                 return a.factoryName + a.modelName > b.factoryName + b.modelName ? 1 : -1;
                //             });
                //         }
				// 		_localData.object = _aoList;
                //         return _localData;
                //     }
                // }

                return deferred.promise;
            },

            /**
             * 获取车型列表接口
             * @return {data}
             */
            getStyleList(modelId) {
                let deferred = $q.defer(),
                    _this = this,
                    TEST_URL = "/json/brand/styleList.json",
                    URL = '/xyapi/XLoanQuotaAssessment/GetCarModels',
                    STORAGE_KEY = "_global_style"
                ;
				let _localData = Util.getLocalData(STORAGE_KEY, STORAGE_TIME);

                if(!_localData){
					$ajaxJson({
						method: 'get',
						testUrl: TEST_URL,
						url: URL,
						data: {
							seriesId: modelId
						},
						requestType: 1
					}).then(function(data) {
						transferData(data)
						_localData = data;
						Util.setLocalData(STORAGE_KEY, _localData);
						deferred.resolve(_localData); //成功
					});
                } else{
                    deferred.resolve(_localData);
                }

				//消费贷数据处理，为了跟好车保持一致
				function transferData(data){
					if(data.code == 1){
						let list = [];
						let yearList = [];
						let gearBoxGroup = [];//手自动分组
						let emissionGroup = [];//排量分组

						//排序
						data.object = data.object.sort((a, b) => {
							return a.FYear + a.FName > b.FYear + b.FName ? -1 : 1;
						})

						angular.forEach(data.object, (item, index) => {
							let newItem = {
								styleId: item.FID,
								styleName: item.FName,
								year: item.FYear,
								modelId: item.FModelsID,
								isGearBox: item.IsGearBox, //是否自动挡
								gearBox: item.FGearBox,//手自动
								emission: item.FEmission, //排量
								newPrice: item.FNewCarPrice
							};
							list.push(newItem);

							//年限
							(() => {
								let isNewGroup = true;
								for(var i = 0; i < yearList.length; i++){
									if(yearList[i].year === newItem.year){
										yearList[i].styleList.push(newItem);
										isNewGroup = false;
										break;
									}
								}
								if(isNewGroup){
									yearList.push({
										year: newItem.year,
										styleList: [newItem]
									})
								}
							})();

							//手自动
							(() => {
								let isNewGroup = true;
								for(var i = 0; i < gearBoxGroup.length; i++){
									if(gearBoxGroup[i] === newItem.isGearBox){
										isNewGroup = false;
										break;
									}
								}
								if(isNewGroup){
									gearBoxGroup.push(newItem.isGearBox)
								}
							})();
							//排量
							(() => {
								let isNewGroup = true;
								for(var i = 0; i < emissionGroup.length; i++){
									if(emissionGroup[i] === newItem.emission){
										isNewGroup = false;
										break;
									}
								}
								if(isNewGroup){
									emissionGroup.push(newItem.emission)
								}
							})();
						})

						data.yearList = yearList;
						data.gearBoxGroup = gearBoxGroup;
						data.emissionGroup = emissionGroup;
						data.object = list;
					}

					return data;
				}

                // //返回最终的车型数据格式
                // function _getList(){
                //     if(!modelId){
                //         return _localData;
                //     } else{
                //         let _aoList = [];
                //         for(let i = 0; i < _localData.object.length; i++){
                //             if(_localData.object[i].modelId == modelId){
                //                 _aoList.push(_localData.object[i]);
                //             }
                //         }
                //         if(_aoList && _aoList.length){
                //             _aoList.sort(function(a, b){
                //                 return a.year + a.styleName > b.year + b.styleName ? 1 : -1;
                //             });
				// 		}
				// 		_localData.object = _aoList;
                //         return _localData;
                //     }
                // }

                return deferred.promise;
			},

			// //获取热门品牌
			// getHotBrandList(){
            //     let deferred = $q.defer(),
            //         _this = this,
            //         TEST_URL = "/json/brand/hotBrandList.json",
            //         URL = '/car/hotBrandList',
            //         STORAGE_KEY = "_global_hot_brand"
            //     ;
			// 	let _localData = Util.getLocalData(STORAGE_KEY, STORAGE_TIME);

            //     if(!_localData){
			// 		$ajaxJson({
			// 			method: 'get',
			// 			testUrl: TEST_URL,
			// 			url: URL,
			// 			data: {
			// 			},
						// requestType: 1
			// 		}).then(function(data) {
			// 			_localData = data;
			// 			Util.setLocalData(STORAGE_KEY, _localData);
			// 			deferred.resolve(_localData); //成功
			// 		});
            //     } else{
            //         deferred.resolve(_localData);
            //     }

            //     return deferred.promise;
			// },

			//关键词搜索
			searchByKey(key){
                let deferred = $q.defer(),
                    _this = this,
                    TEST_URL = "/json/brand/searchByKey.json",
                    URL = '/xyapi/XLoanQuotaAssessment/SearchCars'
                ;
				$ajaxJson({
					method: 'get',
					testUrl: TEST_URL,
					url: URL,
					data: {
						FName: key
					},
                    requestType: 1
				}).then(function(data) {
					deferred.resolve(data); //成功
				});

                return deferred.promise;
			}
		}

        return services;
    }];
};
