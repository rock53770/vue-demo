/**
 * 实用操作封装 。
 *
 * @author dongxiaochai@weiba66.com
 * @since 2015-04-23
 */

/*
 * 注册模块。
 *
 * @date 2015-03-31
 * @author dongxiaochai@weiba66.com
 */
import $ from 'jquery'

//对数组的扩展
(function(){
	//Object.assign注册
	if (typeof Object.assign != 'function') {
		Object.assign = function(target) {
			'use strict';
			if (target == null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			target = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source != null) {
					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		};
	}
	/**
	 * 数组指定位置插入元素
	 * @param  {Integer} index 	位置索引
	 * @param  {All} item  		要插入的元素
	 * @return {Array} 			新生成的数组
	 */
	Array.prototype.insert = function(index, item){
		this.splice(index, 0, item);
	};

	/**
	 * 数组指定位置插入元素
	 * @param  {Integer} index 	位置索引
	 * @param  {Array} itemList 要插入的数组
	 * @return {Array} 			新生成的数组
	 */
	Array.prototype.insertBatch = function(index, itemList){
		if(itemList == null || itemList.length == 0){
			return;
		}
		for(var i = 0; i < itemList.length; i++){
			this.splice(index + i, 0, itemList[i]);
		}
	};

	/**
	 * 数组末尾插入元素
	 * @param  {Array} itemList 要插入的数组
	 * @return {Array} 			新生成的数组
	 */
	Array.prototype.pushBatch = function(itemList){
		if(itemList == null || itemList.length == 0){
			return;
		}
		for(var i = 0; i < itemList.length; i++){
			this.push(itemList[i]);
		}
	};

	/**
	 * 字符串首部匹配
	 */
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (prefix){
			return this.slice(0, prefix.length) === prefix;
		};
	}
	/**
	 * 字符串尾部匹配
	 */
	if (typeof String.prototype.endsWith != 'function') {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}
	//var asList = [11,22,33,44,55];
	//asList.insertBatch(2, [221,222,223]);
})();

let _obj = {
	REGEXP: {
		/**
		 * 手机。
		 */
		PHONE: /^(\+\d+)?1[3456789]\d{9}$/,///^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/,

		/**
		 * 邮编。
		 */
		ZIPCODE: /^[1-9][0-9]{5}$/,

		/**
		 * 邮箱。
		 */
		EMAIL: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

		/**
		 * 日期。
		 */
		DATE: /^(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/,

		/**
		 * 身份证。
		 */
		IDCARD: /(^\d{18}$)|(^\d{15}$)|(^\d{17}(\d|X|x)$)/
	},

	/**
	 * 将时间转换成指定格式。
	 *
	 * @param {String|Date|Number} sDateTime
	 * @param {String} sFormat 格式化字符串
	 * @return {Date}
	 */
	formatDate: function (sDateTime, sFormat) {
		if (!sDateTime) {
			return "";
		}
		var dDate = null,
			sDateType = $.type(sDateTime)
			;

		if (sDateType === "date") {	// 日期对象。
			dDate = sDateTime;
		} else if (sDateType === "number") {	// 毫秒值类型。
			dDate = new Date(Number(sDateTime));
		} else if (sDateType === "string") {	// 字数串类型。
			dDate = new Date(sDateTime.replace(/[-.]/g, "/"));
		}

		var oFormat = {
			"M+": dDate.getMonth() + 1, //月份
			"d+": dDate.getDate(), //日
			"h+": dDate.getHours() % 12 == 0 ? 12 : dDate.getHours() % 12, //小时
			"H+": dDate.getHours(), //小时
			"m+": dDate.getMinutes(), //分
			"s+": dDate.getSeconds(), //秒
			"q+": Math.floor((dDate.getMonth() + 3) / 3), //季度
			"S": dDate.getMilliseconds() //毫秒
		};
		var oWeek = {
			"0": "/u65e5",
			"1": "/u4e00",
			"2": "/u4e8c",
			"3": "/u4e09",
			"4": "/u56db",
			"5": "/u4e94",
			"6": "/u516d"
		};
		if (/(y+)/.test(sFormat)) {
			sFormat = sFormat.replace(RegExp.$1, (dDate.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(sFormat)) {
			sFormat = sFormat.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + oWeek[this.getDay() + ""]);
		}
		for (var k in oFormat) {
			if (new RegExp("(" + k + ")").test(sFormat)) {
				sFormat = sFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ? (oFormat[k]) : (("00" + oFormat[k]).substr(("" + oFormat[k]).length)));
			}
		}
		return sFormat;
	},
	/**
	 * 将时间转化成Long型
	 *
	 * @param {String|Date|Number} sDateTime
	 * @return {Date}
	 */
	transDateToLong: function (sDateTime) {
		if (!sDateTime) {
			return null;
		}
		var dDate = null,
			sDateType = $.type(sDateTime)
			;

		try {
			if (sDateType === "date") { // 日期对象。
				dDate = sDateTime;
			} else if (sDateType === "number") {    // 毫秒值类型。
				dDate = new Date(Number(sDateTime));
			} else if (sDateType === "string") {    // 字数串类型。
				dDate = new Date(sDateTime.replace(/[-.]/g, "/"));
			}
			return +dDate;
		} catch (ex) {
			return null;
		}
	},
	/**
	 * 四舍五入保留小数
	 * @param  {Number}  num            需要转化的数值
	 * @param  {Integer}  cutNum        保留的小数位数
	 * @param  {Boolean} isRemoveZero    是否移除末尾的0，默认不需要
	 * @return {Number}
	 */
	toFixed: function (num, cutNum, isRemoveZero) {
		var sReturn = '0';
		num = parseFloat(num);
		if (isNaN(num)) {
			num = 0;
		}
		cutNum = cutNum || 0;
		if (num.toString() == "NaN") {
			num = 0;
		} else {
			num = num.toFixed(cutNum);
		}

		sReturn = num.toString();
		if (isRemoveZero) {
			// console.log(sReturn);
			// console.log(typeof sReturn);
			while (sReturn.indexOf('.') > -1 && sReturn.endsWith('0')) {
				sReturn = sReturn.substr(0, sReturn.length - 1);
			}
			if (sReturn.endsWith(".")) {
				sReturn = sReturn.substring(0, sReturn.length - 1);
			}
		}
		return sReturn;
	},

	/**
	 * 加载样式文件到 head 中。
	 * 如果某样式在 3 秒钟内未能加载成功，则会主动以超时处理，并主动调用回调函数。
	 *
	 * @param {String} sSrc
	 * @param {Function|undefined} fnSuccess 仅非 IE 浏览器仅支持较新版本的。
	 * @param {Boolean} 返回当前是 load 调用的回调还是超时主动调用的， load: true, timeout: false。
	 * @return {jQuery} 创建的 link 对象。
	 */
	getStyle: function (sSrc, fnSuccess) {
		var bIsLoad = false,
			nTimeout = setTimeout(function () {
				if (!bIsLoad) {
					fnSuccess && fnSuccess(false); // timeout 方式回调。
					bIsLoad = true;
				}
			}, 3 * 1000)
			;

		return $('<link href="' + sSrc + '" rel="stylesheet" />')
			.appendTo("head")
			// onload 事件非 IE 浏览器仅较新的版本才支持。
			.on("load", function () {
				if (!bIsLoad) {
					clearTimeout(nTimeout);
					fnSuccess && fnSuccess(true); // load 方式回调。
					bIsLoad = true;
				}
			})
			;
	},

	/**
	 * 将字数符反参数解决成对象。
	 * 与 $.param 相对。
	 *
	 * @method
	 * @param {String} sParams
	 * @return {Object}
	 */
	unparam: function (sParams) {
		var asParams = (sParams || "").split("&"),
			oParams = {},
			asSplitedParam = []
			;

		for (var i = asParams.length - 1; i >= 0; i--) {
			asSplitedParam = asParams[i].split("=");
			oParams[asSplitedParam[0]] = asSplitedParam[1] || "";
		}

		return oParams;
	},

	/**
	 * 从 URL 中读取某个参数值。
	 *
	 * @method getParam
	 * @param {String} sName
	 * @param {String|undefined} sHref ({location.href})
	 * @return {String}
	 */
	getParam: function (sName, sHref) {
		return this.decodeUri((this.unparam((sHref || location.href).split("?")[1] || "")[sName] || "")).replace(/#*?/g, "");
	},

	/**
	 * 占位符替换工厂。
	 *
	 * @method
	 * @param {String} sContent 含占位符的字符串。
	 *    当要被替换的内容中含未知替换数据，则会保留当前点位符。
	 * @param {Object} oData 要替换的点位符数据，依据对象的键名与点位符一一对应，功能类似 KISSY.substitute。
	 * @return {String} 返回替换后的字符串。
	 */
	substitute: function (sContent, oData) {
		if (!oData) {
			return sContent;
		}

		for (var p in oData) {
			sContent = sContent.replace(new RegExp("\\{" + p + "\\}", "g"), oData[p]);
		}

		return sContent;
	},

	/**
	 *
	 * @param src 2倍图的图片名称
	 * @returns {src}
	 */
	getDprImg: function(src){
		var nDpr = window.devicePixelRatio;
		if(!src){
			return "";
		} else if(nDpr >= 3){//3倍图
			var nIndex = src.lastIndexOf("@2x.");
			if(nIndex > -1){
				src = src.substr(0, nIndex) + "@3x" + src.substr(nIndex + 3, src.length - nIndex);
			}else{
				var nIndex = src.lastIndexOf(".");
				src = src.substr(0, nIndex) + "@3x" + src.substr(nIndex, src.length - nIndex);
			}
		}
		return src;
	},

	/**
	 * 设置图片size
	 * @param src
	 * @param size
	 * @returns {src}
	 */
	setImgSize: function (src, size) {
		if (!src) {
			return "";
		} else if (!size) {
			return src;
		} else {
			var nIndex = src.lastIndexOf(".");
			if (nIndex > -1) {
				src = src.substr(0, nIndex) + "-" + size + src.substr(nIndex, src.length - nIndex);
			}
		}
		return src;
	},

	/**
	 * url进行编码
	 * @param  {String} str 编码字符串
	 * @return {String} 编码后的值
	 */
	encodeUri: function (str) {
		return encodeURIComponent(str);
	},

	/**
	 * url进行解码
	 * @param  {String} str 解码字符串
	 * @return {String} 解码后的值
	 */
	decodeUri: function (str) {
		return decodeURIComponent(str);
	},

	//是否支持本地存储
	_supportStorageState: null,

	//测试是否支持本地存储
	_testIsSupportStorage: function(){
		var _this = this;
		if(_this._supportStorageState == null){
			try{
				var a = "1";
				localStorage.setItem('a', a);
				_this._supportStorageState = !!localStorage.getItem('a') ? 1 : 0;
			} catch(ex){//ios 的safari浏览器无痕模式会禁用本地存储，而且会报错
				_this._supportStorageState = -2;
			}
		}

		if(_this._supportStorageState == -2){
			new Say('请关闭当前浏览器无痕浏览模式，以保证当前页面正常浏览。');
		} else if(_this._supportStorageState == 0){//不支持方法的调用模式，重写常用的几个方法，经测试傻逼UC就不支持下面这些方法，只能直接赋值
			try{
				localStorage.setItem = function(key, value){
					localStorage[key] = value;
					localStorage.length++;
				}
				localStorage.getItem = function(key){
					return localStorage[key];
				}
				localStorage.removeItem = function(key, value){
					delete localStorage[key];
					localStorage.length--;
				}

				sessionStorage.setItem = function(key, value){
					sessionStorage[key] = value;
					sessionStorage.length++;
				}
				sessionStorage.getItem = function(key){
					return sessionStorage[key];
				}
				sessionStorage.removeItem = function(key, value){
					delete sessionStorage[key];
					sessionStorage.length--;
				}
			} catch(ex){
				console.log('操蛋浏览器');
			}
		}

		return _this._supportStorageState;
	},

	/**
	 * 获得本地存储数据
	 * @param  {String} key       存储关键词
	 * @param  {Integer} storeTime    有效期（单位：分钟）
	 * @return {Object}
	 */
	getLocalData: function (key, storeTime) {
		var _this = this;
		if (!key) {
			return null;
		}
		_this._testIsSupportStorage();

		var oStore;
		try {
			oStore = localStorage.getItem(key);
		} catch (ex) {
		}
		if (oStore) {
			oStore = JSON.parse(oStore);
		}

		if (!oStore) {
			return null;
		} else if (storeTime && (!oStore.time || +new Date > oStore.time + storeTime * 60 * 1000)) {
			_this.removeLocalData(key);
			return null;
		} else {
			return oStore.data;
		}
	},

	/**
	 * 获得本地存储数据
	 * @param  {String} key        存储关键词
	 * @param {void}
	 */
	setLocalData: function (key, data) {
		var _this = this,
			oStore = {
			time: +new Date(),
			// validDate: +new Date + (storeTime || 10000000) * 1000 * 60,
			data: data
		};
		_this._testIsSupportStorage();

		try {
			localStorage.setItem(key, JSON.stringify(oStore));
		} catch (ex) {
		}
	},

	/**
	 * 删除本地存储数据
	 * @param  {String} key       存储关键词
	 * @return {void}
	 */
	removeLocalData: function (key) {
		var _this = this;
		_this._testIsSupportStorage();
		try {
			localStorage.removeItem(key);
		} catch (ex) {
		}
	},

	/**
	 * 获得本地存储数据
	 * @param  {String} key       存储关键词
	 * @return {Object}
	 */
	getSessionData: function (key) {
		var _this = this;
		if (!key) {
			return null;
		}
		_this._testIsSupportStorage();

		var oStore;
		try {
			oStore = sessionStorage.getItem(key);
		} catch (ex) {
		}
		if (oStore) {
			oStore = JSON.parse(oStore);
		}

		if (!oStore) {
			return null;
		} else {
			return oStore.data;
		}
	},

	/**
	 * 获得本地存储数据
	 * @param  {String} key       存储关键词
	 * @param {void}
	 */
	setSessionData: function (key, data) {
		var _this = this,
			oStore = {
			data: data
		}
		_this._testIsSupportStorage();
		try {
			sessionStorage.setItem(key, JSON.stringify(oStore));
		} catch (ex) {
		}
	},

	/**
	 * 删除本地存储数据
	 * @param  {String} key       存储关键词
	 * @return {void}
	 */
	removeSessionData: function (key) {
		var _this = this;
		_this._testIsSupportStorage();
		try {
			sessionStorage.removeItem(key);
		} catch (ex) {
		}
	},

	//是否安卓
	isAndroid: navigator.userAgent.indexOf('Android') > -1,

	//是否ios
	isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),

	/**
	 * 是否性能不好的安卓，可用于针对性地进行降级的处理和体验（，别处拷的，还未验证）
	 */
	isBadAndroid: (function () {
		var appVersion = window.navigator.appVersion;

		if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
			var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
			if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
				return parseFloat(safariVersion[1]) < 535.19;
			} else {
				return true;
			}
		} else {
			return false;
		}
	})(),
	/**
	 * 按名称读取cookie值
	 * @param  {String} name cookie名
	 * @return {void}
	 */
	getCookie: function(name) {
		var cookieValue = "";
		var search = name + "=";
		if (document.cookie.length > 0) {
			var offset = document.cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				var end = document.cookie.indexOf(";", offset);
				if (end == -1) {
					end = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.substring(offset, end))
			}
		}

		/**
		 * Parse JSON cookie string.
		 *
		 * @param {String} str
		 * @return {Object} Parsed object or undefined if not json cookie
		 * @public
		 */
		function JSONCookie(str) {
			if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
				return str;
			}
			try {
				return JSON.parse(str.slice(2));
			} catch (err) {
				return str;
			}
		}

		return JSONCookie(cookieValue);
	},

	/**
	 * 写cookie
	 * @param  {String} name       cookie名
	 * @param  {All} value
	 * @param  {Integer} storeTime  有效期（单位：分钟）
	 * @return {void}
	 */
	setCookie: function(name, value, storeTime) {
		storeTime = storeTime || 60 * 24 * 30;//如果不传，默认一个月
		var exdate = new Date();
		exdate = exdate.getTime() + storeTime * 60 * 1000;
		exdate = (new Date(exdate)).toGMTString();

		//object类型的处理下结果
		if(typeof value === 'object'){
			value = "j:" + JSON.stringify(value);
		}

		// 使设置的有效时间正确。增加toGMTString()
		document.cookie = name + "=" + encodeURIComponent(value) + ((storeTime == null) ? "" : ";expires=" + (new Date(exdate)).toGMTString()) + ";path=/";
	},

	/**
	 * 删除cookie
	 * @param  {String} name cookie名
	 * @return {void}
	 */
	removeCookie: function(name) {
		return this.setCookie(name, "", -1);
	},
	/**
	 * JSON转成字符串
	 * @param  {Object} json json对象
	 * @return {String}     转化后字符串
	 */
	stringify: function(json) {
		var _this = this;
		if (json === null || json === undefined) {
			return json;
		}
		if (JSON && JSON.stringify) {
			return JSON.stringify(json);
		} else {
			var str = "";
			if (json.length != undefined) { //数组
				for (var i in json) {
					var item = json[i],
						sType = typeof(item);

					if (item === undefined) {
						str += null + ",";
					} else if (sType === "object") {
						str += _this.stringify(item) + ",";
					} else if (sType === "string") {
						str += "\"" + item + "\"" + ",";
					} else if (sType === "function") {
						str += null + ",";
					} else {
						str += item + ",";
					}
				}
				if (str) {
					str = str.substr(0, str.length - 1);
				}
				str = "[" + str + "]";
			} else { //对象
				for (var key in json) {
					var item = json[key],
						sType = typeof(item),
						sFormat = '"{key}":{val},';

					if (item === undefined || sType === "function") {
						continue;
					}
					if (sType === "object") {
						item = _this.stringify(item);
					} else if (sType === "string") {
						item = '"' + item + '"';
					}
					str += _this.substitute(sFormat, { key: key, val: item });
				}
				if (str) {
					str = str.substr(0, str.length - 1);
				}
				str = "{" + str + "}";
			}
			return str;
		}
	},

	/**
	 * 字符串转成json对象
	 * @param  {String} str     要转化的字符串
	 * @return {Object}
	 */
	parseJson: function(str) {
		if (!str) {
			return {};
		}
		if(typeof str === "object"){
			return str;
		}
		if (window.JSON && JSON.parse) {
			return JSON.parse(str);
		} else {
			try {
				return eval("a=" + str);
			} catch (ex) {
				console.log("格式转化出错");
				return {};
			}
		}
	},

	/**
	 * 生成唯一识别码
	 * @return {String} 识别码
	 */
	getGuid: function(){
		var guid = '';

		for (var i = 1; i <= 32; i++){
			var n = Math.floor(Math.random() * 16.0).toString(16);

			guid += n;

			if((i == 8) || (i == 12) || (i == 16) || (i == 20)){
				guid += '-';
			}
		}

		return guid;
	},

	/**
	 * 判断对象是否数组
	 * @return {Boolean}
	 */
	isArray : function(object){
		return  object && typeof object==='object' &&
			typeof object.length==='number' &&
			typeof object.splice==='function' &&
			//判断length属性是否是可枚举的 对于数组 将得到false
			!(object.propertyIsEnumerable('length'));
	},

	/**
	 * 获取移动坐标信息
	 *
	 * @method
	 * @reurn {void}
	 */
	getTouchPosition: function(e) {
		e = e.originalEvent || e;
		var event = e.originalEvent || e,
			point = (e.touches && e.touches.length) ? e.touches[0] : (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0] : e,
			oMove = {
				x: point.pageX || 0,
				y: point.pageY || 0,
				pageX: point.pageX || 0,
				pageY: point.pageY || 0,
				touches: e.touches || [],
				changedTouches: e.changedTouches
			}
		;
		return oMove;
	},

	/**
	 * 同步加载脚本集。
	 *
	 * @param {Array} asUrls 要加载的脚本地址列表。
	 * @param {Function|undefined} fnSuccess 全部成功回调。
	 * @param {Object|undefined} oSettings 其它配置。
	 * @return {void}
	 */
	getScripts: function(asUrls, fnSuccess, oSettings) {
		var oThis = this,
			abLoaded = []
		;

		if (typeof asUrls === 'string') {   // 如果是单个字符串参数，转换成数组。
			asUrls = [asUrls];
		}

		$.each(asUrls, function(nIndex, sUrl) {
			abLoaded[nIndex] = false;
			// 发起同步加载。
			ajaxGetScript(sUrl, function () {
				abLoaded[nIndex] = true;
				checkLoaded(fnSuccess); // 验证加载情况。
			}, oSettings);
		});

		/**
		 * 检测是否都加载成功了，如果都成功后则再调用成功函数。
		 *
		 * @param {Function|undefined} fnSuccess 全部成功后的回调函数。
		 * @return {void}
		 */
		function checkLoaded(fnSuccess) {
			for (var i = abLoaded.length - 1; i >= 0; i--) {
				if (!abLoaded[i]) {
					return;
				}
			}

			fnSuccess && fnSuccess();
		}

		/**
		 * 同步加载脚本。
		 *
		 * @param {String} sUrl 要加载的脚本地址。
		 * @param {Function|undefined} fnSuccess 成功回调。
		 * @param {Object|undefined} oSettings 其它配置。
		 * @return {jQuery}
		 */
		function ajaxGetScript(sUrl, fnSuccess, oSettings) {
			// 参数合并。
			oSettings = $.extend({
				url: sUrl,
				dataType: "script",
				async: true,
				success: fnSuccess,
				cache: true // 启用缓存功能。
			}, oSettings || {});

			return $.ajax(oSettings);
		}
	},

	/**
	 * 备胎信用版本大小比较
	 *
	 * @method
	 * @return {void}
	 */
	versionJudge: function(txt1,txt2) {
		if(txt1.length == 1){
			txt1 = txt1 + '.0.0';
		}else if(txt1.length == 3){
			txt1 = txt1 + '.0';
		}

		if(txt2.length == 1){
			txt2 = txt2 + '.0.0';
		}else if(txt2.length == 3){
			txt2 = txt2 + '.0';
		}

		var version1pre = parseFloat(txt1);
		var version2pre = parseFloat(txt2);
		var version1next =  txt1.replace(version1pre + ".","");
		var version2next =  txt2.replace(version2pre + ".","");

		if(version1pre > version2pre){
			return 1;
		}else if(version1pre < version2pre){
			return -1;
		}else{
			if(version1next == version2next){
				return 0;
			}else if(version1next > version2next){
				return 1;
			}else if(version1next < version2next){
				return -1;
			}
		}
	},

	/*
	* 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
	* @param fn {function}  需要调用的函数
	* @param delay  {number}    延迟时间，单位毫秒
	* @param mustRunDelay  {bool} 是否延迟执行，给mustRunDelay参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}实际调用函数
	*/
	throttle: function(fn, delay, mustRunDelay, debounce) {
		var curr = +new Date(),//当前事件
			last_call = 0,
			last_exec = 0,
			timer = null,
			diff, //时间差
			context,//上下文
			args,
			exec = function () {
				last_exec = curr;
				fn.apply(context, args);
			}
		;

		if(mustRunDelay == undefined){
			mustRunDelay = true;
		}
		return function () {
			curr = +new Date();
			context = this,
			args = arguments,
			diff = curr - (debounce ? last_call : last_exec) - delay;
			clearTimeout(timer);
			if (debounce) {
				if (mustRunDelay) {
					timer = setTimeout(exec, delay);
				} else if (diff >= 0) {
					exec();
				}
			} else {
				if (diff >= 0) {
					exec();
				} else if (mustRunDelay) {
					timer = setTimeout(exec, -diff);
				}
			}
			last_call = curr;
		}
	},

	/*
	* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
	* @param fn {function}  要调用的函数
	* @param delay   {number}    空闲时间
	* @param mustRunDelay  {bool} 是否延迟执行，给mustRunDelay参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}实际调用函数
	*/
	debounce: function(fn, delay, mustRunDelay) {
		return _obj.throttle(fn, delay, mustRunDelay, true);
	}
};

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = _obj;
} else if ( typeof define == 'function' && define.amd ) {
	define( function () { return _obj; } );
}

export default _obj;
window.Util = _obj;
