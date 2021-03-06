/**
 * native桥接调用
 *
 * @author dongxiaochai@163.com
 * @since 2015-10-10
 */
window.GConfig = window.GConfig || {};
import types from './types'

export default fnWebViewBridge();

// if (window.define) {
//     define(["say"], fnWebViewBridge);
// } else {
//     fnWebViewBridge();
// }

// if(window.WebViewJavascriptBridge == undefined){
//     alert("window.WebViewJavascriptBridge:" + window.WebViewJavascriptBridge);
// }

function fnWebViewBridge() {
    'use strict';

    //默认是安卓手机
    var isAndroid = new RegExp(/Android/ig).test(navigator.userAgent),
        isIOS = new RegExp(/iPhone/ig).test(navigator.userAgent),
        isWeChat = navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1,
        bridgeListenState = 0, //bridge注册状态（0未监听，1已注册，2注册失败）
        HANDLER_UNDEFINE = "undefinedHandler" //接口不支持的时候返回的关键词
        ;

    //IOSbridge注册
    (function() {
        /**
         * [connectWebViewJavascriptBridge description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        function connectWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                return callback(WebViewJavascriptBridge);
            } else if (window.WVJBCallbacks) {
                return window.WVJBCallbacks.push(callback);
            } else {
                //新的延迟注入的处理
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)

                //老的，延迟注入桥的处理
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    callback(WebViewJavascriptBridge);
                }, false);
            }
            // if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
            // if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
            // window.WVJBCallbacks = [callback];
            // var WVJBIframe = document.createElement('iframe');
            // WVJBIframe.style.display = 'none';
            // WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            // document.documentElement.appendChild(WVJBIframe);
            // setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
        }

        connectWebViewJavascriptBridge(function(bridge) {

            // alert("成功注册bridge");
            bridgeListenState = 1;
            window.bridge = bridge;
            // alert(window.bridge);
            if (!isAndroid) {
                try {
                    bridge.init && bridge.init(function(message, responseCallback) {//老的写法，新的不确定兼容不，处理一下
                        if (responseCallback) {
                            responseCallback("this is msg from html");
                        }
                    })

                    // bridge.registerHandler('JS Echo', function(data, responseCallback) {
                    //     console.log("JS Echo called with:", data)
                    //     responseCallback(data)
                    // })
                    // bridge.callHandler('ObjC Echo', {'key':'value'}, function responseCallback(responseData) {
                    //     console.log("JS received response:", responseData)
                    // })
                } catch (ex) {}
            }
        })
    })();
    /**
     * 显示错误信息
     * @param  {String} errMsg 错误消息
     * @return {void}
     */
    function sayError(errMsg) {
        if(window.Say !== undefined){
            new Say(errMsg);
        } else{
            alert(errMsg);
        }
    }

    /**
     * 随机生成一个函数名并注册到window下
     * @param  {Function} callback 函数体
     * @return {String}            函数名称
     */
    function _regRandomFn(callback) {
        if (callback === undefined || callback === "") {
            return "";
        }
        var sFnName = "appBackFn" + getGuid();//(+new Date() + Math.floor(Math.random() * 1000));//用唯一识别码替代原先的计算方式，原先的并发大的时候有一定的几率会生成一样的字符串

        _regJsHandle(sFnName, callback);

        return sFnName;
    }

    /**
     * 生成唯一识别码
     * @return {String} 识别码
     */
    function getGuid(){
        var guid = '';

        for (var i = 1; i <= 32; i++){
            var n = Math.floor(Math.random() * 16.0).toString(16);

            guid += n;

            if((i == 8) || (i == 12) || (i == 16) || (i == 20)){
                guid += '';
            }
        }

        return guid;
    }

    /**
     * 注册webview方法
     * @param  {String}   fnName   方法名称
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    function _regJsHandle(fnName, callback) {
        window[fnName] = callback;
        if (isAndroid) {
            window[fnName] = callback;
        } else {
            try{
                bridge.registerHandler(fnName, callback);
            }catch(ex){
            }

        }
    }

    var waitInterval = null,
        aOWaiting = [] //用来存放defer的队列数组
        ;
    /**
     * 循环等待bridge注册加载完毕
     * @return {void}
     */
    function _listenBridge() {
        var defer = $.Deferred();
        aOWaiting.push(defer);
        if (isWeChat || sessionStorage.isTest == 1) { //测试
            listenEnd(false);
            return defer.promise();
        }

        if (window.bridge) { //已加载就绪
            listenEnd(true);
        } else {
            if (bridgeListenState === 2) {
                // console.trace(324);
                // clearInterval(waitInterval);
                listenEnd(false);
            } else {
                if (waitInterval == null) {
                    var nTime = 0;
                    var timer1 = +new Date();
                    waitInterval = setInterval(function() {
                        nTime++;
                        // console.log("listenBridgeTime:"+ nTime);

                        if (window.bridge) { //已加载就绪
                            listenEnd(true);
                            // sayError("bridge监听了：" + (nTime) + "次");
                            var timer2 = +new Date();
                            // sayError("bridge监听用时："+ (timer2 - timer1) +"ms");
                        } else if (nTime >= 50) {
                            listenEnd(false);
                            // sayError("bridge监听超时");
                        }
                    }, 10);
                }
            }
        }

        return defer.promise();
    }

    /**
     * 监听结束
     * @param  {Boolean} isSuccess 是否监听成功
     * @return {void}
     */
    function listenEnd(isSuccess) {
        if(!isSuccess){//失败的话一定不在我们的app内，但是成功的话不能保证是在app内，因为像UC浏览器也是用了跟ios一样的wv框架
            _wv.setIsInApp(false);
        }
        waitInterval && clearInterval(waitInterval);
        if (bridgeListenState == 0) {
            bridgeListenState = isSuccess ? 1 : 2;
        }
        for (var i = aOWaiting.length - 1; i >= 0; i--) {
            if (isSuccess) {
                aOWaiting[i].resolve();
            } else {
                aOWaiting[i].reject();
            }
            aOWaiting.splice(aOWaiting.length - 1, 1);
        }
    }

    /**
     * 统一app处理程序调用
     *
     * @param  {string}   handlerName 处理程序名称
     * @param  {String|Object}   params       向服务端传的参数
     * @param  {Function} onFaild    失败回调函数
     * @return {Boolean}    该接口是否支持
     */
    function _callHandler(handlerName, params, onFaild) {
        onFaild = onFaild || "";
        var newCallback;
        if (params.callback) {
            newCallback = params.callback;
        } else if (onFaild) {
            newCallback = onFaild;
        }

        if (newCallback && typeof(newCallback) === "function") {
            //alert("begin to call " + handlerName);
            var newCallback111 = function(data) {
                console.warn("callbackData of handler(" + handlerName + "):", data);
                // alert("handlerName1:" + handlerName + "\r\n\r\n params:"+ params+"\r\n\r\n"+ data);
                // alert("callback of " + handlerName);
                newCallback(data);
            };

            var sFnName = _regRandomFn(newCallback111);

            params.callback = sFnName;
        }
        params = JSON.stringify(params);

        // console.log("handlerName:", handlerName, "params:", params);
        // alert("handlerName:" + handlerName + "\r\n\r\n params:"+ params);
        // if(handlerName === "fetchData"){
        //     alert(params);
        // }
        try {
            if (isAndroid) {
                if(window.bridge[handlerName]){
                    window.bridge[handlerName](params);
                }
            } else {
                // alert(handlerName +"\r\n" + params +"\r\n" + callback);
                window.bridge.callHandler(handlerName, params, onFaild); //2.4.0版本把最后这个callback去掉吧
            }
            return true;
        } catch (ex) {
            onFaild && onFaild();
            return false;
        }
    };

    /**
     * 服务端传送数据的标准格式
     */
    function ParamsModel(obj) {
        this.callback = ""; //延后执行的回调函数
        this.object = obj || ""; //参数对象
        this.code = 1; //状态（1成功，2失败）
        this.map = {}; //其它可配参数
    }

    //把服务器回传的字符串转化为对象
    function _parseData(data) {
        if (typeof(data) === "string") {
            try {
                data = JSON.parse(data);
            } catch (ex) {}
        }
        return data;
    }

    //最终要向外暴露的对象
    var _wv = {
		_listenBridge,
		_callHandler,
		_parseData,
		_regRandomFn,
		types: types,
        isInApp: null, //是否在app内，null未知，true是，false否
        /**
         * 设置当前是否在app内运行
         */
        setIsInApp: function(result) {
            GConfig.isInApp = this.isInApp = result;
        },
        appVersion: "", //app版本号，取前三个版本号,比如：2.5.0
        appInfo: {
            appVersion: "",
            isDebugMode: 0, //是否暗门模式
            scheme: "",	//表明APP所对应的协议头：车商端：btjf 员工端：akstaff
            appPrefix: GConfig.APP_PAGE_PREFIX || 'btjf://www.btjf.com' //url scheme前缀
        }, //app环境信息
        ParamsModel: ParamsModel,

        /**
         * 获取APP信息（版本号和app环境）
         * @param  {Function} callback 请求成功回调函数体
         * @param  {Function} onFaild 请求失败回调函数体（针对getIsInApp方法扩展的）
         * @return {void}
         */
        getAppInfo: function(callback, onFaild) {
            var dDate = +new Date();
            var _this = this,
                timer = null,
                nTime = 0,
                bIsEnd = false //临时处理ios老版本注册handler失败不抛异常的情况，等2.4.0升级以后这里改掉，牺牲掉老版本的ng执行时间了就会
                ;

            var newCallback = function(data) {
                if (_this.isInApp == null) {
                    _this.setIsInApp(true);
                }
                var sAppVersion = "";
                if (data === HANDLER_UNDEFINE) { //不支持该接口
                    // alert("不支持该接口");
                } else {
                    // if(window.nTimePick && !window.isInit11){
                    //     alert("wv初始化:" + (+new Date() - nTimePick));
                    //     window.isInit11 = 1;
                    // }
                    // var newDate = + new Date();
                    bIsEnd = true;
                    data = _parseData(data);
                    // alert("data:" + JSON.stringify(data));

                    if (data && data.object) {
                        var sVal = "";
                        if (data.object.appVersion) { //
                            var asVersion = data.object.appVersion.split(".");
                            for (var i = 0; i < asVersion.length; i++) {
                                if (i > 2) {
                                    break;
                                }
                                if (i > 0) {
                                    sVal += ".";
                                }
                                sVal += asVersion[i];
                            }
                        }
                        sAppVersion = sVal;

                        // alert("abc" + JSON.stringify(data.object) + "|" + data.object.priFileUrl);
                        _this.appVersion = sAppVersion;
                        _this.appInfo = $.extend({}, _this.appInfo, data.object, {
                            appVersion: sAppVersion
                        });

                        if(_this.appInfo.scheme){
							_this.appInfo.appPrefix = _this.appInfo.scheme + ":" + _this.appInfo.appPrefix.split(':')[1];
							GConfig.APP_PAGE_PREFIX = _this.appInfo.appPrefix;
                        }
                        // alert("ssss" + JSON.stringify(_this.appInfo));
                    }
                }
                // alert("getAppInfo:"+((newDate - dDate) / 1000) + "秒" + "," + _this.appVersion);

                callback && callback(data);
            }

            if (!_this.appVersion) {
                _listenBridge().then(
                    function() { //成功
                        // dDate = +new Date();
                        var model = new ParamsModel();
                        model.callback = newCallback;
                        if (onFaild == undefined) {
                            onFaild = function() {
                                _this.setIsInApp(false);
                                bridgeListenState = 2;
                                newCallback({
                                    object: {
                                        appVersion: "1.0.0"
                                    }
                                }); //桥失败的情况
                            }
                        }
                        var bResult = _callHandler("getAppInfo", model, onFaild);
                        // if(!bResult){//目前来说只有安卓会返回false的情况，ios要回调去处理
                        //     newCallback();
                        // } else if(!bIsEnd && isIOS) {
                        //     timer = setInterval(function(){
                        //         nTime++;
                        //         if(bIsEnd){
                        //             clearInterval(timer);
                        //         } else if(nTime >= 30){
                        //             newCallback();
                        //             clearInterval(timer);
                        //         }
                        //     }, 10);
                        // }
                    },
                    function() { //失败
                        _this.setIsInApp(false);
                        newCallback({
                            object: {
                                appVersion: "1.4.0"
                            }
                        }); //桥失败的情况
                    }
                );
            } else {
                newCallback({
                    object: _this.appInfo
                });
            }
            return _this;
        },


        /**
         * 获取当前用户登录信息
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        getUserInfo: function(callback) {
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel();
                    _callHandler("getUserInfo", model, newCallback);
                },
                function() { //失败，走测试调试流程
                    // console.log("enter test userInfo");
                    $.ajax({
                        url: "json/userInfo.txt",
                        type: "get",
                        data: {},
                        dataType: "json",
                        contentType: "application/json; charset=UTF-8"
                    })
                        .done(newCallback)
                        .fail(function(error) {
                            sayError("异常错误");
                        });
                }
            );
        },

        /**
         * 设置用户登录信息
         * @param  {Object} params 具体参数对象
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        setUserInfo: function(params, callback) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                model.callback = callback;
                _callHandler("setUserInfo", model, model.callback);
            }, function() {
                callback && callback();
            });
        },

        /**
         * 获取bridge注册状态
         * @return {Integer} bridge注册状态（0未监听，1已注册，2注册失败）
         */
        getBridgeListenState: function() {
            return bridgeListenState;
        },

        /**
         * 监听bridge注册
         * @return {void}
         */
        getIsInApp: function() {
            var defer = $.Deferred(),
                _this = this;

            if (_this.isInApp == true) {
                defer.resolve();
            } else if (bridgeListenState === 2) {
                _this.setIsInApp(false);
                defer.reject();
            } else {
                this.getAppInfo(function(data) { //尝试调用获取app信息的方法
                    if (_this.isInApp == true) {
                        defer.resolve();
                    } else {
                        defer.reject();
                    }
                }, function() {
                    bridgeListenState = 2; //目前通过尝试调用这个方法来验证是否
                    _this.setIsInApp(false);
                    defer.reject();
                });
            }

            return defer.promise();
        },

        /**
         * 打开页面，可能是原生的或者webview
         * @param  {String|Object} url  跳转的url地址
         *    当为Object时候各个传参说明如下：
         *	  {
         *    		url: "/index",   //必传, 跳转的地址
         *    	 	type: 1,         //跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开  2回退到栈的某个存在的页面(不刷新) 3回退到栈的某个存在的页面(刷新)
         *                      0, //  a-b-c-a   入栈b     ==> a-b-c-a-b
         *                      1, // a-b-c 入栈x ==> a-b-x
         *                      2, // a-b-c-a  入栈b  ==> 先清掉到靠近栈顶b之间的所有元素 （不包括b）, a-b
         *                      3, //  a-b-c-a  入栈b  ==>  先清掉到靠近栈顶b之间的所有元素（包括b）, 得a ,再入栈b, a-b
         *
         *          title: "标题",    //要打开的页面的标题
         *          jsOnResume: function(){  //页面返回时候执行的回掉
         *              alert('这是页面返回时候调用的');
         *          },
         *          params: {        //参数，注意如果打开的是native的页面，这个会拼凑在native路径地址上，如果是个web页面，会拼凑在web的path部分
         *              aa: 1,
         *              id: 2332
         *          },
		 * 			enter_animate: 0,	//0从右边推入（不传时默认），1不要动画，2从下面升上来
		 * 			leave_animate: 0,	//0往右边推出（不传时默认），1不要动画，2往下面掉下去
         *          closePageCount: 1   //关闭的页面数量
 		 *    }
         * @return {void}
         */
        openPage: function(url, type, title, jsOnResume) {
            var _this = this,
                obj = {};

            if (typeof(url) === "object") {
                obj = url;
                if(obj.type == undefined){
                    obj.type = 0;
                }
            } else {
                obj.url = url || "";		//跳转的地址
                obj.type = type || 0;		//跳转类型
                obj.title = title || "";	//标题
                obj.jsOnResume = jsOnResume || null; //针对登录加的，返回执行的脚本字符串
            }

            //关闭
            if(obj.closePageCount && obj.closePageCount > 0){
                _this.closePage(obj.closePageCount - 1);
                obj.type = 1;
            }

			//ios模态框的先关闭后打开特殊兼容处理
			let isIosDialog = false;
			if(isIOS && location.href.indexOf('isTransparentModal=1') > -1 && obj.type === 1){
				obj.type = 0;
				isIosDialog = true;
			}

            var newOnResume;
            if (obj.jsOnResume || window.jsOnResume) {
                newOnResume = function() {
                    obj.jsOnResume && obj.jsOnResume();

                    window.jsOnResume && window.jsOnResume();
                }
            }

            if (!obj.url) {
                return false;
            } else if(obj.url.indexOf("http://") == 0 || obj.url.indexOf("https://") == 0){//打开的是http地址，先去调用openWebPage
                return _this.openWebPage.apply(this, arguments);
            }
            if(GConfig.isInApp){
                if (obj.url.indexOf(_this.appInfo.appPrefix) === -1) {
                    obj.url = _this.appInfo.appPrefix + obj.url;
                }
            }else{
                obj.url = location.host + location.pathname + '#' + obj.url;
            }


            obj.url = obj.url.replace("{host}", window.location.host);

            // console.log("url:", obj.url, "title:", obj.title);
            var typeStr; //打开类型

            if (obj.type == "1") {
                typeStr = "WebAction_CloseAndOpen"; //关闭原页面再跳转
            } else {
                typeStr = "WebAction_Open"; //直接原窗口打开
            }

            if(!obj.isWeb && obj.url.indexOf('http') != 0){
                //统一再对url的param进行转码
                var urlSplit = obj.url.split('?'), urlParamObj = {};
                if(urlSplit.length > 1){
                    urlParamObj = Util.unparam(urlSplit[1]);
                }
                //拼凑参数
                if(obj.params != undefined){
                    $.extend(urlParamObj, obj.params);
                }
                var paramStr = "";
                for(var key in urlParamObj){
                    paramStr += paramStr == "" ? "?" : "&";
                    paramStr += key + "=" + urlParamObj[key];
                }
                obj.url = urlSplit[0] + paramStr;
            }
			// obj.container_style = 0;
			// obj.enter_animate = 2
			// obj.leave_animate = 2
			// obj.url = obj.url.replace('/common/web', '/common/web-dialog');
			let nativeParams = {
				task_mode: obj.type || 0,
				container_style: obj.container_style || 0,
				enter_animate: obj.enter_animate || 0,
				leave_animate: obj.leave_animate !== undefined ? obj.leave_animate : (obj.enter_animate || 0)//默认跟进入动画一致
			}
			let sUrl = obj.url + (obj.url.indexOf('?') > -1 ? '&' : '?') + $.param(nativeParams);

            var params = {
                action: typeStr,
                url: sUrl,
                //url: obj.url + 'task_mode=' + type,
                title: obj.title || "",
                jsOnResume: newOnResume || ""
            };

            if (params.jsOnResume) {
                var sFnName = _regRandomFn(params.jsOnResume);
                params.jsOnResume = "window." + sFnName + "()";
            }

// alert(JSON.stringify(params));
            _listenBridge().then(function() { //成功
                // alert(JSON.stringify(params));
                var model = new ParamsModel(params);
                var callback = function(data) {
                    if (data && data.object == 404) { //找不到该native页面
                        // _this.showAlertDialog('敬请期待');
                    }
                }
                // alert(JSON.stringify(model));
                model.callback = callback;
                // console.log(model)
                _callHandler("openPage", model, callback);
            }, function() {
                if(obj.isWeb){
                    obj.url = decodeURIComponent(obj.url);
                }

                if(obj.url.indexOf('#')){
                    obj.url = obj.url.substr(obj.url.lastIndexOf('#'));
                }
                location.href = obj.url;
            });

			if(isIosDialog){//type=1的情况关闭一下ios模态框
				wv.closePage();
			}
        },

        /**
         * 用webview打开网页
         * @param  {String} url  跳转的url地址
         * @param  {Integer} type 跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开
         * @param  {String} title 打开的页面的title，可不传
         * @return {void}
         */
        openWebPage: function(url, type, title, jsOnResume) {
            var _this = this, obj = {};
            if (typeof(url) === "object") {
                obj = url;
            } else {
                obj.url = url || "";
                obj.type = type || 0;
                obj.title = title || "";
                obj.jsOnResume = jsOnResume || null;
            }

            if (!obj.url) {
                return false;
            } else if(obj.url.indexOf(_this.appInfo.appPrefix) == 0){//直接填写的是native完整路径，直接调用openPage
                return _this.openPage.apply(this, arguments);
            }

            var nativePath,
                defaultEnterHtml = "index.html#",
                transpEnterHtml = GConfig.isSingleEnter ? "index.html#" : 'overlay.html#',//原先的overlay.html不要了，用参数去替代，始终保持只有一个入口页面，这里为了兼容旧的引用，增加一个判断，同时也需要增加一个配置，等所有项目都去掉了的话，可以删除这个配置判断
                entryHtml = obj.isTransparent ? transpEnterHtml : defaultEnterHtml;

            if(obj.isFullDialog){
                if(isIOS && obj.isTransparent == false){//不透明的ios，不用webfull，（需要判断版本）
                    nativePath = "/common/web?url=";
                    obj.container_style = 1;
                    // nativePath = "/common/web_full?url=";
                } else{
                    //这个容器在安卓下是个普通的栈内页面，ios下是个模态框，栈内操作需注意，详见：http://192.168.100.24:6262/assets/demo/dxc/btPage-intro/
					//增加个isTransparentModal传参是为了给目标页确认当前是不是ios模态框
					if(obj.isTransparent === true){
						obj.params = Object.assign({isTransparentModal: 1}, obj.params || {})
					}
                    nativePath = "/common/web-dialog?url=";
                }
            } else{
                nativePath = "/common/web?url=";
            }

            if (obj.url.indexOf("/") === 0) { //斜杠开头，默认加上
                obj.url = entryHtml + obj.url;
            } else if(location.href.indexOf("http") > -1 && obj.isTransparent){
                obj.url = obj.url.replace(defaultEnterHtml, transpEnterHtml).replace('/#/', '/' + transpEnterHtml);
            }

            //统一再对url的param进行转码
            var urlSplit = obj.url.split('?'), urlParamObj = {};
            if(urlSplit.length > 1){
                urlParamObj = Util.unparam(urlSplit[1]);
            }
            //拼凑参数
            if(obj.params != undefined){
                $.extend(urlParamObj, obj.params);
            }
            var paramStr = "";
            for(var key in urlParamObj){
                paramStr += paramStr == "" ? "?" : "&";
                paramStr += key + "=" + urlParamObj[key];
            }
            obj.url = urlSplit[0] + paramStr;

            if (obj.url.indexOf(nativePath) === -1) {
                obj.url = nativePath + encodeURIComponent(obj.url);

                obj.isWeb = true;
            }
            // console.log(obj)

            this.openPage(obj);
        },

        /**
         * 用webview打开全屏网页，默认为透明页
         * 全屏透明的页面
         * @param  {String|Object} url  跳转的url地址|参数对象
         * @return {void}
         */
        openFullPage: function(url) {
            var obj = {};
            if (typeof(url) === "object") {
                obj = url;
            } else {
                obj.url = url || "";
            }

            obj.isTransparent = obj.isTransparent == undefined ? true : obj.isTransparent;//透明
            obj.isFullDialog = obj.isFullDialog == undefined ? true : obj.isFullDialog;//全屏

            // console.log(obj)
            this.openWebPage(obj);
        },

        /**
         * 关闭当前页面
         *
         * @param  {Integer} count 往前关闭的数量(不包括当前页)
         * @return {void}
         */
        closePage: function(count) {
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel(count);
                    _callHandler("closePage", model, "");
                },
                function() {
                    // console.log("call closePage");
                }
            );
        },

        /**
         * 设置浏览器title
         * @param  {String}   title    title值
         * @return {void}
         */
        setTitle: function(title) {
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel(title);
                    _callHandler("showWebTitle", model, "");
                },
                function() {
                    $("title").text(title);
                }
            );
        },

        /**
         * 调用app接口请求数据
         * @param  {Object} params 具体参数对象
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        fetchData: function(params, callback) {
            var DEFAULT_OPTION = {
                    url: "",
                    method: "get", //multiPart的话表示有上传文件
                    data: {},
                    authorization: 0, 	//0不限，1需要登录
                    fileData: null, 	//如果有图片上传，这里传路径组合
                    requestType: 0 		//请求类型 0 java host， 1 .NET host
                },
                _this = this;

            params = $.extend({}, DEFAULT_OPTION, params || {});
            // isShowLoading = isShowLoading === undefined ? false : isShowLoading;

            // isShowLoading = false;//全站取消

            var newCallback = function(data) {
                // alert(params.url + "-----" + data);
                // if(isShowLoading){
                //     _this.hideSubmiting();
                // }
                // console.log("------------ begin ------------");
                // console.log(data);
                if (typeof(data) === "string") {
                    try {
                        // data = data.replace(/(?:\s*:\s*(['\"]))([^\1]*?)(?=\s*\1)/ig, function($1, $2, $3){
                        //     // console.log($1, $2, $3);
                        //     return $1.replace(/\r\n/ig, "\\r\\n").replace(/\t/ig, "");//替换换行符和制表符
                        // });
                        data = JSON.parse(data);

                        //解析分享数据格式
                        if (data.map && data.map.shareInfo && typeof(data.map.shareInfo) === "string") {
                            data.map.shareInfo = JSON.parse(data.map.shareInfo);
                        }

                    } catch (ex) {
                        if (_this.appInfo.isDebugMode == 1) { //暗门模式
                            sayError("数据格式错误，数据内容：" + data);
                        } else {
                            sayError("数据格式错误");
                        }
                    }
                }

                // if(data.code != 1){//app返回的错误状态，他们格式不正确，这里进行一下转化以统一处理
                //     data.message = data.message || data.object;
                // }
                // alert(JSON.stringify(data))
                // console.log("version: "+ window.GConfig.SITE_NAME +"，data submit:", params, "data callback:", data, "dateTime:", new Date());
                // console.log("------------ end ------------");
                // if(data && data.code == 1001){//modify by dongxiaochai@163.com  1001的类型native会拦截并耦合弹窗，就不执行回掉了
                // 	return;
                // }
                callback && callback(data);
            };

            // if(isShowLoading){
            //     _this.showSubmiting();
            // }

            function faildCallback() {
                setTimeout(function() {
                    $.ajax({
                        url: params.testUrl + "?t=" + new Date().getTime(),
                        type: "get",
                        data: params.data,
                        dataType: "text",
                        contentType: "application/json; charset=UTF-8"
                    })
                        .done(newCallback)
                        .fail(function(error) {
                            // if(isShowLoading){
                            //     _this.hideSubmiting();
                            // }
                            sayError("异常错误");
                        });
                }, 100);
            }
            if (GConfig.isTest) {
                faildCallback();
            } else {
                _listenBridge().then(
                    function() { //成功
                        if (params.testUrl) {
                            delete params.testUrl
                        }
                        // alert(JSON.stringify(params));
                        var model = new ParamsModel(params);
                        _callHandler("fetchData", model, newCallback);
                    }, faildCallback
                );
            }
        },

        /**
         * 显示loading或者error弹层
         * @param  {Object} params 具体参数对象
         * @return {void}
         */
        _showLoadingDialog: function(params) {
            var DEFAULT_OPTION = {
                message: "提交中..",
                type: 1 //1：加载中:2：错误:3：成功；4警告toast
            };

            params = $.extend({}, DEFAULT_OPTION, params || {});

            _listenBridge().then(
                function() { //成功
                    // console.log("succ");
                    var model = new ParamsModel(params);
                    // model.callback = params.callback;
                    // alert(JSON.stringify(model));
                    _callHandler("showLoadingDialog", model, null);
                    if(params.callback){
                        setTimeout(function(){
                            params.callback();
                        }, 1500);
                    }
                },
                function() { //失败
                    // console.log("faild");
                    require(["loading"], function(Loading) {
                        if (params.type == 1) {
                            Loading.show();
                        } else if (params.type == 2) {
                            sayError(params.message);
                        }
                    });
                }
            );
        },

        /**
         * 显示错误提示
         * @param  {String} message 提示消息
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        showError: function(message, callback) {
            this._showLoadingDialog({
                message: message,
                type: 2,
                callback: callback
            });
        },

        /**
         * 显示成功提示
         * @param  {String} message 提示消息
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        showSuccess: function(message, callback) {
            this._showLoadingDialog({
                message: message,
                type: 3,
                callback: callback
            });
        },

        /**
         * 显示警告提示（as6 toast弹窗）
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        showWarning: function(message, callback) {
            this._showLoadingDialog({
                message: message,
                type: 4,
                callback: callback
            });
        },

        /**
         * 显示提交中
         * @param  {String} message 提示消息
         * @return {void}
         */
        showSubmiting: function(message) {
            this._showLoadingDialog({
                message: message,
                type: 1
            });
        },

        /**
         * 取消提交中
         * @return {void}
         */
        hideSubmiting: function() {
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel();
                    _callHandler("dismissLoadingDialog", model, "");
                },
                function() { //失败
                    require(["loading"], function(Loading) {
                        setTimeout(function() {
                            Loading.hide();
                        }, 300);
                    });
                }
            );
        },

        /**
         * 加载中
         * @return {void}
         */
        _getLoading: function() {
            var _loading = {},
                isLoading = true, //是否加载中
                oTimer = null, //显示超时定时器
                instanceCount = 0 //当前弹出的实例数量
                ;

            /**
             * 显示loading效果
             * @return {void}
             */
            _loading.show = function() {
                isLoading = true;
                // if(!isLoading){
                _listenBridge().then(function() { //成功
                    var model = new ParamsModel();
                    _callHandler("showLoadingView", model, function() {
                        instanceCount++;
                        isLoading = true;
                        _setTimer();
                    });
                });
                // } else{
                //     instanceCount++;
                //     clearTimeout(oTimer);//清除之前的定时器
                //     _setTimer();
                // }
            };

            /**
             * 关闭loading效果
             * @param  {Function} failCallBack 失败的回调函数
             * @return {void}
             */
            _loading.hide = function(failCallBack) {
                var result = failCallBack === undefined ? 1 : 0;
                failCallBack = failCallBack || "";

                if (!isLoading) {
                    return;
                }
                // if(instanceCount > 0){
                _listenBridge().then(function() { //成功
                    var model = new ParamsModel();
                    model.code = !failCallBack ? 1 : 0;
                    model.callback = failCallBack;
                    // alert(JSON.stringify(model));
                    _callHandler("loadingFinish", model, "");
                    instanceCount--;
                });
                // }

                // if(_self.instanceCount == 0){
                //     jLoading && jLoading.remove();
                //     _self.isLoading = false;
                // }
            };

            /**
             * 关闭所有loading
             * @return {void}
             */
            function _hideAll() {
                if (isLoading) {
                    _clearTimer(); //清除还在等待的定时器
                    for (var i = 0; i < instanceCount; i++) {
                        _loading.hide();
                    }
                }
            }

            //设置定时器
            function _setTimer() {
                //设置超时定时器
                oTimer = setTimeout(function() {
                    if (isLoading) {
                        _hideAll();
                        sayError("请求超时");
                    }
                }, 10000);
            }

            //清除定时器
            function _clearTimer() {
                oTimer && clearTimeout(oTimer);
            }

            return _loading;
        },

        /**
         * loading实体私有对象
         */
        _loading: null,

        /**
         * loading对象
         * @return {Object} 提供show和hide两个方法
         */
        loading: function() {
            if (this._loading === null) {
                this._loading = this._getLoading();
            }

            return this._loading;
        },

        /**
         * 显示确认对话框
         * @param  {Object}   params    参数对象
         * @return {void}
         */
        showConfirmDialog: function(params) {
            var DEFAULT_OPTION = {
                title: "", //弹窗标题
                content: "", //弹窗内容
                cancelLabel: "取消", //取消按钮文本
                cancelCallback: null, //取消按钮的回调函数
                confirmLabel: "确定", //确定按钮文本
                confirmCallback: null //点击确定的回调函数
            };

            params = $.extend({}, DEFAULT_OPTION, params || {}, true);

            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                if (params.confirmCallback) {
                    model.callback = params.confirmCallback;
                    if (params.confirmCallback) {
                        params.confirmCallback = _regRandomFn(params.confirmCallback);
                    }
                    if (params.cancelCallback) {
                        params.cancelCallback = _regRandomFn(params.cancelCallback);
                    }
                    // delete params.confirmCallback;
                }

                _callHandler("showDialog", model, "");
            }, function() {
                require(["confirm"], function(Confirm) {
                    if (params.confirmLabel) {
                        new Confirm({
                            title: params.content || "提示",
                            onok: params.confirmCallback || null
                        });
                    } else { //只有一个确定按钮
                        new Confirm({
                            title: params.content || "提示",
                            cancelText: "",
                            onok: params.confirmCallback || null
                        });
                    }
                });
            });
        },

        // /**
        //  * 跳转聊天界面（已废）
        //  * @param  {String} imAccount 账号
        //  * @param  {String} nickName  昵称
        //  * @return {void}
        //  */
        // showChatView: function(imAccount, nickName) {
        // 	var params = {
        // 		imAccount: imAccount || "",
        // 		nickName: nickName || ""
        // 	};

        // 	_listenBridge().then(function() { //成功
        // 		var model = new ParamsModel(params);
        // 		_callHandler("showChatView", model, "");
        // 	});
        // },

        /**
         * 预览显示照片
         * @param  {Array} photoUrls        照片路径数组
         * @param  {Integer} selectedIndex  当前显示第几张
         * @param  {String} bottomPath      B2c1.4大图预览,底部浮层的path
         * @return {void}
         */
        showPhoto: function(photoUrls, selectedIndex, canSave, bottomPath) {
            // var newOnResume;
            // if (jsOnResume || window.jsOnResume) {
            //     newOnResume = function() {
            //         jsOnResume && jsOnResume();
            //         window.jsOnResume && window.jsOnResume();
            //     }
            // }

            var params = {
                photoUrls: photoUrls || [],
                selectedIndex: selectedIndex || 0,
                canSave: canSave || false
            };


            if (this.appVersion >= '1.4.0') {
                params.bottomPath = bottomPath || null;
                // if (newOnResume) {
                //     var sFnName = _regRandomFn(newOnResume);
                //     params.jsOnResume = "window." + sFnName + "()";
                // }
            }

            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                // alert(JSON.stringify(model));
                _callHandler("showPhoto", model, "");
            });
        },

        /**
         * 向webview动态注册函数以供native调用
         * @param  {String}   fnName   方法名称
         * @param  {Function} callback 函数体
         * @return {void}
         */
        regJSHandle: function(fnName, callback) {
            _listenBridge().then(function() { //成功
                _regJsHandle(fnName, callback);
            });
        },

        /**
         * 调用native方法（一般用于一些页面特定的私有方法）
         * @param  {String}   handlerName 方法名
         * @param  {Object}   obj         参数
         * @param  {Function} callback    回调
         * @return {void}
         */
        callNativeHandle: function(handlerName, data, callback) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(data);
                model.callback = callback || "";
                _callHandler(handlerName, model, callback);
            });
        },

        /**
         * 提交数据给native
         * @param  {All} 数据，不定类型
         * @return {void}
         */
        sendDataToNative: function(data) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(data);
                _callHandler("sendDataToNative", model, "");
            });
        },

        /**
         * 往前后退几页
         * @param page           后退的页数（请传正整数，不传的话默认后退一步）
         * @param callbackStr    返回的那个页面的回调脚本字符串
         */
        goBack: function(page, callbackStr) {
            if(page == undefined){//无参数
                page = 1;
            } else if(typeof(page) == "string"){//只有一个回调函数的情况
                callbackStr = page;
                page = 1;
            }

            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel(page);
                    model.callback = callbackStr;
                    _callHandler("goBack", model, "");
                },
                function() {
                    history.go(-page);
                    if (callbackStr) {
                        setTimeout(function() {
                            try {
                                eval(callbackStr);
                            } catch (ex) {}
                        }, 100);
                    }
                }
            );
        },

        // /**
        //  * 调用选择省份简称的弹框效果（已废）
        //  * @param  {Function} callback 回调函数体
        //  * @return {void}
        //  */
        // getProvincial: function(callback) {
        // 	_listenBridge().then(function() { //成功
        // 		var model = new ParamsModel();
        // 		model.callback = callback;
        // 		_callHandler("getProvincial", model, callback);
        // 	});
        // },

        /**
         * 拨打电话
         * @param  {String}   telNum    电话号码
         * @param  {Function} callback  点击拨打的回调函数
         * @param  {object} $event  当前的点击对象的e
         * @return {void}
         */
        callUp: function(telNum, callback, $event) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(telNum);
                model.callback = callback;
                _callHandler("callUp", model, callback);
            }, function() {
                /**
                 * QQ内置浏览器对location.href = "tel:" + telNum;不太感冒
                 * 我只能出此下策了
                 * modify by ashaLiu
                 * @type {string}
                 */
                var ua = navigator.userAgent,
                    isQQBrowserInApp = ua.indexOf('MQQBrowser') == -1 && ua.indexOf('QQ') > -1
                    ;
                if(isQQBrowserInApp && isIOS && !!$event){
                    $($event.currentTarget).attr({
                        href: "tel:" + telNum
                    });

                }else{
                    location.href = "tel:" + telNum;
                }
                callback && callback();
            });
        },

        /**
         * 拨打电话,专为400那种有主机号和分机号用的(目前只有线索产出这条线用到，其他地方慎用)
         * @param  {object}   电话号码(主机号和分机号)
         * @param  {Function} callback  点击拨打的回调函数
         * @param  {object} $event  当前的点击对象的e
         * @return {void}
         */
        callUp400: function(oTel, callback, $event) {
            if(!oTel){
                return false;
            }
            var sTel = (oTel && oTel.extCode) ? oTel.virtualNumber + "," + oTel.extCode : oTel.virtualNumber;
            if(isAndroid && oTel && oTel.virtualNumber){
                var sDesc = oTel.extCode ? oTel.virtualNumber + "，分机号：" + oTel.extCode : oTel.virtualNumber;
                new Confirm({
                    desc: sDesc,
                    okText: "拨打",
                    cancelText: "取消",
                    onok: function(){
                        call(sTel, callback);
                    }
                });
            }else if(isIOS){
                call(sTel, callback);
            }
            function call(telNum, callback) {
                _listenBridge().then(function() { //成功
                    var model = new ParamsModel(telNum);
                    model.callback = callback;
                    _callHandler("callUp", model, callback);
                }, function() {
                    /**
                     * QQ内置浏览器对location.href = "tel:" + telNum;不太感冒
                     * 我只能出此下策了
                     * modify by ashaLiu
                     * @type {string}
                     */
                    var ua = navigator.userAgent,
                        isQQBrowserInApp = ua.indexOf('MQQBrowser') == -1 && ua.indexOf('QQ') > -1
                        ;
                    if(isQQBrowserInApp && isIOS && !!$event){
                        $($event.currentTarget).attr({
                            href: "tel:" + telNum
                        });

                    }else{
                        location.href = "tel:" + telNum;
                    }
                    callback && callback();
                });
            }
        },

        /**
         * 发送邮件
         * @param  {String}   email    邮箱地址
         * @return {void}
         */
        sendMail: function(email) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(email);
                _callHandler("sendMail", model, "");
            }, function() {
                location.href = "mailto:" + email;
            });
        },

        /**
         * 重新设置webview窗体高度
         *
         * @params {Integer}    窗体高度，默认不用传
         */
        resizeWebViewHeight: function(height) {
            var nDocHeight = height || $(document).height(),
                nWinHeight = $(window).height();
            if (nDocHeight < $("body").height()) {
                nDocHeight = $("body").height();
            }
            // alert(nWinHeight + " | " + nDocHeight)
            // if (nWinHeight >= nDocHeight) { //比窗体小的情况就算了
            // 	return;
            // }
            // nDocHeight = nDocHeight * window.devicePixelRatio;//转化成物理像素
            /*var timer = null;
             if(timer){
             clearTimeout(timer);
             }*/
            //timer = setTimeout(function(){
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(nDocHeight);
                // alert(JSON.stringify(model));
                _callHandler("setWebViewHeight", model, "");
            }, function() {});
            //}, 300);

        },

        //打开url地址，用于打开下载地址或者拨号等等
        openUrl: function(url) {
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(url);
                _callHandler("openUrl", model, "");
            }, function() {
                location.href = url;
            });
        },

        //去更新app版本
        gotoUpdateVersion: function() {
            var _this = this;
            return this.openUrl(GConfig.APP_DOWNLOAD_URL);
        },

        /**
         * 调用拍照功能
         * @param  {Object}   params    参数对象
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        showImagePickDialog: function(params, callback) {
            var _this = this,
                DEFAULT_OPTION = {
                    maxCount: 1, //限制多选择数量，单选的
                    title: "",
                    firstSubtitle: "",
                    secondSubtitle: "",
                    type: 1, //拍照模式，1选行驶证那种带框框的模式，2普通拍照
                    openType: 0,//打开方式，默认0表示可选择拍照还是相册，1是直接打开拍照
                    transToBase64: false //是否转化成base64，如果是的话返回base64编码和图片的高宽
                };

            params = $.extend({}, DEFAULT_OPTION, params || {});
            var newCallback = function(data) {
                data = _parseData(data);
                // if(data && data.object  && data.object.length && params.transToBase64) {
                //     _this._showLoadingDialog({message: "处理中"});
                //     var nInitNum = 0;


                //     var _callback = function(item){
                //         nInitNum++;
                //         if(nInitNum >= data.object.length){
                //             _this.hideSubmiting();
                //             callback && callback(data);
                //         }
                //     }

                //     /**
                //      * 根据图片地址得到base64编码
                //      * @param  {String}   url          图片地址
                //      * @param  {Function} callback     回调函数
                //      * @return {void}
                //      */
                //     var _convertImgToBase64 = function(url, callback, params){
                //         var canvas = document.createElement('canvas'),
                //             dataURL,
                //             ctx = canvas.getContext('2d'),
                //             img = new Image()
                //         ;

                //         img.crossOrigin = 'Anonymous';
                //         img.onload = function(){
                //             canvas.height = img.height;
                //             canvas.width = img.width;
                //             ctx.drawImage(img, 0, 0);
                //             dataURL = canvas.toDataURL('image/jpeg');

                //             var outPutData = {
                //                 width: img.width,
                //                 height: img.height,
                //                 base64Str: dataURL
                //             };
                //             callback.call(this, outPutData, params);
                //             // Clean up
                //             canvas = null;
                //             img.onload = null;
                //             img = null;
                //         };
                //         img.onerror = function(){
                //             sayError("无法访问到该图片地址：" + url);
                //         }
                //         img.src = url;
                //     }

                //     for(var i = 0; i < data.object.length; i++){
                //         if(typeof(data.object[i]) === "string"){
                //             data.object[i] = {url: data.object[i]};
                //         }
                //         var item = data.object[i];
                //         if(!item.url) {
                //             _callback(item);
                //             continue;
                //         }
                //         _convertImgToBase64(item.url, function(result, item){
                //             item.base64Str = result.base64Str;
                //             item.width = result.width;
                //             item.height = result.height;
                //             _callback(item);
                //         }, item);
                //     }
                // } else{
                callback && callback(data);
                // }
            }
            // newCallback({
            //     object: [{
            //         url: "file:///E:/UED/assets/ak/app-carseller/img/baogao@3x.png"
            //     },{
            //         url: "file:///E:/UED/assets/ak/app-carseller/img/auth-banner.jpg"
            //     }]
            // })
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                model.callback = newCallback;
                _callHandler("showImagePickDialog", model, model.newCallback);
            }, function() {});
        },

        /**
         * 获取用户当前所在省市信息（自动定位的或者用户自选的城市）【只有首页可以用,这个callback是被动被app调用的】
         *
         * 返回格式：
         * provinceId provinceName cityId
         * @param  {Function} callback  回调函数
         * @return {void}
         */
        getCurrentUserCity: function(callback) {
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                _callHandler("getLocation", model, newCallback);
            }, function() {
                newCallback && newCallback();
            });

            return this;
        },

        /**
         * 获取用户当前GPS定位信息 详情见locationService app用app的定位  wap用百度api
         *  读取缓存
         * 返回格式：
         * @param  {Function} callback  回调函数
         * @return {void}
         */
        /**
         * 返回参数
         * longitude //经度
         * latitude //维度
         * address
         * type //1百度坐标，2火星坐标
         *
         * city
         * cityId
         * province
         * provinceId

         * userCity
         * userCityId
         * userProvince
         * userProvinceId
         * 前四个是定位的 后四个是车源页左上角用户自己设置的
         * @param callback
         * @returns {_wv}
         */
        getCurrentUserLocation: function(callback) {
            var newCallback = function(data) {
                // console.log(1222222)
                // console.log(data)

                if(!data) data = {object:{}}
                data = _parseData(data);
                if (isIOS) {
                    data.object.type = 2; //高德地图
                } else {
                    data.object.type = 1; //百度地图
                }

                data.object.longitude = data.object.longitude || -1;
                data.object.latitude = data.object.latitude || -1;
                if (data.object.longitude < 1 || data.object.latitude < 1) {
                    data.object.code = 0;
                } else {
                    data.object.code = 1;
                }

                callback && callback(data.object);
            }
            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                // console.log(model)
                _callHandler("getCurrentUserLocation", model, newCallback);
            }, function() {
                newCallback && newCallback({
                    code: 1,
                    object: {
                        longitude: 111,
                        latitude: 222,
                        userCity: '杭州',
                        userProvince: '浙江',
                        userProvinceCode: 310000,
                        userCityCode: 313100
                    }
                });
            });

            return this;
        },

        /**
         * 获取用户当前GPS定位信息 详情见locationService app用app的定位  wap用百度api
         *  实时获取
         * 返回格式：
         * @param  {Function} callback  回调函数
         * @return {void}
         */
        /**
         * 返回参数
         * longitude //经度
         * latitude //维度
         * address
         * type //1百度坐标，2火星坐标
         *
         * city
         * cityId
         * province
         * provinceId

         * userCity
         * userCityId
         * userProvince
         * userProvinceId
         * 前四个是定位的 后四个是车源页左上角用户自己设置的
         * @param callback
         * @returns {_wv}
         */
        getMomentUserLocation: function(callback) {
            var newCallback = function(data) {
                // console.log(1222222)
                // console.log(data)

                if(!data) data = {object:{}}
                data = _parseData(data);
                if (isIOS) {
                    data.object.type = 2; //高德地图
                } else {
                    data.object.type = 1; //百度地图
                }

                if(data.object.type = 1){
                    if(data.object.longitude == 4.9e-324 && data.object.latitude == 4.9e-324){
                        data.object.longitude = 1000
                        data.object.latitude = 1000
                    }
                }

                data.object.longitude = data.object.longitude || -1;
                data.object.latitude = data.object.latitude || -1;
                if (data.object.longitude < 1 || data.object.latitude < 1) {
                    data.object.code = 0;
                } else {
                    data.object.code = 1;
                }

                callback && callback(data.object);
            }
            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                // console.log(model)
                _callHandler("getMomentUserLocation", model, newCallback);
            }, function() {
                newCallback && newCallback({
                    code: 1,
                    object: {
                        longitude: 111,
                        latitude: 222,
                        userCity: '杭州',
                        userProvince: '浙江',
                        userProvinceCode: 310000,
                        userCityCode: 313100
                    }
                });
            });

            return this;
        },


        /**
         *  省市区联动选择
         *
         * @param  {Function} callback  回调函数
         * @param  {Integer}  deep      省市区级别：1省，2省市；3省市区
         * @return {void}
         */
        showAreaPicker: function(callback, deep) {
            var newCallback = function(data) {
                data = _parseData(data);
                var oReturn = {
                    provinceId: data.object.provinceID,
                    provinceName: data.object.provinceName,
                    cityId: data.object.cityID,
                    cityName: data.object.cityName,
                    countyId: data.object.countyID,
                    countyName: data.object.countyName
                };
                callback && callback(oReturn);
            }
            var config = {};
            if(typeof(deep) === "object"){
                config = deep;
            } else {
                config.deep = deep;
            }

            // if(model === undefined){
            //     model = {};
            // }

            _listenBridge().then(function() { //成功
                var model = new ParamsModel({
                    deep: config.deep || 2,
                    addAllForCity: config.addAllForCity || 0,
                    addAllForCounty: config.addAllForCounty || 0,
                    type: config.type || 0
                    // ,
                    // provinceID: model.provinceId || "",
                    // cityID: model.cityId || "",
                    // countyID: model.countyId || ""
                });
                model.callback = newCallback;
                _callHandler("showAreaPicker", model, newCallback);
            }, function() {
                newCallback && newCallback({
                    object: {}
                });
            });

            return this;
        },

        /**
         * 调用选择品牌厂商车型的组件
         * @param o
         * 返回的数据是 brandName,modelName,styleName,brandId,modelId,styleId,brandLogo
         * 其中ios返回如果选择了北京省  userCity等数据 字段会没有
         * 安卓返回 如果选择了北京省  userCity等数据会 null
         */
        showCarBrandPicker: function(o) {
            var params = {
                    hideHotBrand: o.hideHotBrand == undefined ? 0 : o.hideHotBrand,
                    hideSearchBar: o.hideSearchBar == undefined ? 0 : o.hideSearchBar, //是否隐藏搜索框 0否1是
                    type: o.type == undefined ? 0 : o.type,// 0销售业务(默认)  1评估业务  2消费贷业务
                    brandDeep: o.brandDeep == undefined ? 3 : o.brandDeep,// 选择品牌的深度 1品牌，2车型，3车款
                    showNotLimitBrand: o.showNotLimitBrand == undefined ? 0 : o.showNotLimitBrand, //是都展示品牌的不限制  0否 1是
                    showNotLimitModel: o.showNotLimitModel == undefined ? 0 : o.showNotLimitModel, //是都展示车型的不限制
                    showNotLimitStyle: o.showNotLimitStyle == undefined ? 0 : o.showNotLimitStyle //是都展示车款的不限制
                },
                newCallback = function(data) {
                    data = _parseData(data);
                    o.callback && o.callback(data);
                };
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                model.callback = newCallback;
                _callHandler("showCarBrandPicker", model, newCallback);
            }, function() {

                //if(GConfig.isInApp){
                //wv.openWebPage("index.html#/car_price/brand_list");
                window.showCarBrandPicker = function (brandId, brandName, modelId, modelName, styleId, styleName, brandLogo) {
                    var oData = {
                        brandId: brandId,
                        brandName: brandName,
                        modelId: modelId,
                        modelName: modelName,
                        styleId: styleId,
                        styleName: styleName,
                        brandLogo: brandLogo
                    }
                    newCallback(oData);
                    //$('.j-brand-choose').hide();
                    delete window.showCarBrandPicker;
                }
                //$('.j-brand-choose').show();

                //}else{
                //$scope.searchRoute.brandList.showState = 1;
                //$('.search-key').show();
                // }


            });
        },

        /**
         *  定制头部分享菜单按钮（右上角的分享）---须要改成用通用定制右上角按钮结合shareInfo实现
         *
         * @param  {Object} params 具体参数对象
         * @param  {Function} callback  回调函数
         * @return {void}
         */
        initShareMenuButton: function(params, callback) {
            var _self = this,
                shareCallback = function(){
                    _self.shareInfo(params, callback);
                },
                sFnName = _regRandomFn(shareCallback);

            return this.renderRightMenu({
                // text: "分享",					//显示按钮文字，跟icon二选一
                // 	color: "#f24545",				//按钮文字的颜色，可不传，native有默认值
                icon: "/img/share@3x.png",	//图标icon相对路径，跟text二选一
                callback: sFnName		//回调函数名称
            });

            //下面的代码调试用的，
            /*var _self = this,
             shareCallback1 = function(){
             alert("回调1");
             // _self.shareInfo(params, callback);
             },
             shareCallback2 = function(){
             alert("回调2");
             // _self.shareInfo(params, callback);
             },
             sFnName1 = _regRandomFn(shareCallback1),
             sFnName2 = _regRandomFn(shareCallback2);

             return this.renderRightMenu([{
             // text: "分享11",					//显示按钮文字，跟icon二选一
             // 	color: "#000",				//按钮文字的颜色，可不传，native有默认值
             icon: "/img/logo@2x.png",	//图标icon相对路径，跟text二选一
             callback: sFnName1		//回调函数名称
             }, {
             text: "分享分享",					//显示按钮文字，跟icon二选一
             color: "#f6e40f",				//按钮文字的颜色，可不传，native有默认值
             // icon: "/img/banner-default.png",	//图标icon相对路径，跟text二选一
             callback: sFnName2		//回调函数名称
             }]);*/
        },

        /**
         *  主动调用分享
         *
         * @param  {Object} params 具体参数对象
         * @param  {Function} callback  回调函数
         * @return {void}
         */
        shareInfo: function(params, callback) {
            var DEFAULT_OPTION = {
                sharePhotos: "",
                shareTitle: "",
                shareDesc: "",
                shareUrl: "",
                menuTitle: "",//(菜单标题):神车是(多多分享车源能够获得更多优质线索)
                menuType: 1, //分享弹窗样式 1-老式底部弹窗  2-神车底部弹窗样式 3-锚点弹窗样式,默认1
                anchorY: -1, //锚点Y坐标 webview顶部到按钮的上边界的高度
                anchorViewHeight: -1//锚点view 高度 例如：按钮的高度
            };

            params = $.extend({}, DEFAULT_OPTION, params || {});

            var newCallback = function(data) {
                data = _parseData(data);
                // {
                //     status: 1,      //分享状态，1成功，0失败
                //     platform: 1     //1微信好友；2微信朋友圈；3qq消息；4qq空间
                // }
                // ios跟我们反过来了   3，4，1，2
                var change = [0, 3, 4, 1, 2];
                if(isIOS && data.object && data.object.platform){
                    data.object.platform = change[data.object.platform];
                }
                callback && callback(data.object);
            }
            // console.log();
			_listenBridge().then(function() { //成功
				var model = new ParamsModel(params);
				model.callback = newCallback;
				_callHandler("shareInfo", model, newCallback);
			}, function() {
				newCallback && newCallback(1);
			});

			return this;
		},

		/**
		 * 定制头部导航右上角菜单(打算废弃，尽量不要调用)
		 * @param  {String}   menuName
		 * @param  {Function} callback 点击菜单的回调函数
		 * @return {void}
		 */
		showRightMenu: function(menuName, callback) {
			return this.renderRightMenu({
					text: menuName,
					callback: callback
				});
			// _listenBridge().then(function() { //成功
			// 	var model = new ParamsModel(menuName);
			// 	model.callback = callback;
			// 	_callHandler("showRightMenu", model, callback);
			// });
		},

		/**
		 * 定制头部导航右上角菜单
		 * @param  {Array}   menu按钮，可传对象或数组，格式如下：
		 *         [{
		 *         	text: "分享",					//显示按钮文字，跟icon二选一
		 *         	color: "#f24545",				//按钮文字的颜色，可不传，native有默认值
		 *         	icon: "/img/home-buycar@2x.png",	//图标icon相对路径，跟text二选一（40*40）
		 *         	callback: function(){}			//回调函数
		 *         }]
         * @return {void}
         */
        renderRightMenu: function(menu) {
            var menuArr = [];
            if(menu.length === undefined){//对象
                menuArr.push(menu);
            } else{
                menuArr = menu;
            }
            for(var i = 0; i < menuArr.length; i++){
                var menu = menuArr[i];
                if(menu.callback && typeof(menu.callback) === "function"){
                    menu.callback = _regRandomFn(menu.callback);
                }
            }
            // console.log(JSON.stringify(new ParamsModel(menuArr)));

            _listenBridge().then(function() { //成功
                var model = new ParamsModel(menuArr);
                // model.callback = callback;
                _callHandler("renderRightMenu", model, null);
            });
        },

        /**
         * 自定义左上角返回按钮点击事件
         * @param  {Function} callback 点击事件函数
         * @return {void}
         */
        customBackAction: function(callback) {
            _listenBridge().then(function() {
                var model = new ParamsModel();
                model.callback = callback;
                _callHandler("customBackAction", model, model.callback);
            }, function() {
                // callback && callback();
            });
        },

        /**
         * 获取app缓存数据 这个是持久化的 存在app里面的
         *
         * @param  {String} key 变量名
         * @return this
         *
         * CacheKeyForDeviceToken 获取deviceToken
         * HtmlCacheKeyForCarIndexHistory  足迹的变量
         */
        getAppCacheData: function(key, callback) {
            var params = key,
                newCallback = function(data) {
                    data = _parseData(data);
                    callback && callback(data);
                }
                ;
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                model.callback = newCallback;

                _callHandler("getAppCacheData", model, newCallback);
            }, function() {//失败，走测试调试流程
                $.ajax({
                    url: "json/appCache/"+ key +".json",
                    type: "get",
                    data: {},
                    dataType: "json",
                    contentType: "application/json; charset=UTF-8"
                })
                    .done(function(data){
                        newCallback && newCallback(data.object);
                    })
                    .fail(function(error) {
                        sayError("异常错误");
                    })
                ;
            });
            return this;
        },

        /**
         * 埋点
         *
         * @param  {Object} params 具体参数对象
         *           {
	     *            	actionId: 3333,             //事件ID，服务端预先生成的code
	     *              actionType: 1,             //报告类型（1点击，3页面浏览）
	     *            	extras: {}                  //所需参数map（如果必要的话）
		 *           }
         * @return {void}
         */
        bury: function(params){
            var DEFAULT_OPTION = {
                actionId: "",
                actionType: 1,
                extras: {}
            };

            params = $.extend(true, DEFAULT_OPTION, params);

            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);

                _callHandler("bury", model, null);
            }, function() {//失败，走测试调试流程
                console.log('记录埋点', params);
            });
            return this;
        },

        /**
         * 扫码(二维码或条形码)
         * @param  {Integer} type 0默认二维码 1条形码
         * @return {void}
         */
        showQRPage: function(type, callback){
            type = type || 0;
            var newCallback = function(data) {
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var model = new ParamsModel(type);
                model.callback = newCallback;
                _callHandler("showQRPage", model, newCallback);
            }, function() {//失败，走测试调试流程
                console.log('扫码', type);
            });
            return this;
        },//,

        /**
         * 查询用户开启的权限
         *
         * 1: GPS权限, 2:通讯录权限, 3:摄像头权限，4系统指纹人脸密码解锁
         *
         * @param {any} type
         */
        queryPermissions: function(type, callback){
            type = type || 0;
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var obj = {
                    permission: type
                }
                var model = new ParamsModel(obj);
                model.callback = newCallback;
                // console.log(model)
                _callHandler("queryPermissions", model, newCallback);
            }, function() {
                // console.log('获取权限', type)
                callback && callback({
                    code: 1,
                    object: {
                        success: 1
                    }
                });
            });

            return this
        },

        /**
         * 调用手机通讯录页面
         *
         * callback: 回调
         */
        showContacts: function(o){

            var newCallback = function(data) {
                data = _parseData(data);
                o.callback && o.callback(data);
            };

            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                // console.log(model)
                _callHandler("showContacts", model, newCallback);
            }, function() {
                // console.log('选择通讯录')
                o.callback && o.callback({
                    name: '去去去',
                    tel: '22222222222'
                });
            });
        },

        /**
         * 人脸识别
         *
         * callback: 回调
         */
        faceRecognition: function(o){

            var newCallback = function(data) {
                data = _parseData(data);
                o.callback && o.callback(data);
            };

            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                // console.log(model)
                _callHandler("faceRecognition", model, newCallback);
            }, function() {
                // console.log('选择通讯录')
                o.callback && o.callback({
                    success: 1
                });
            });
        },

        // /**
        //  * 截屏事件监听（晚点废除，已经没用了）
        //  * @param  {Object} config 配置
        //  *      例子：{
        //  *              data:
        //  *              {
        //  *                  code: 'A002',
        //  *                  staffID: 222,
        //  *                  realName: '小黄豆',
        //  *                  date: 1509699650592
        //  *              },
        //  *              callback: function(){
        //  *                  alert(3223);
        //  *              }
        //  *          }
        //  * @return {void}
        //  */
        // takeScreenshot: function(config) {
        //     var data = '',
        //         callback
        //     ;

        //     if(typeof config === 'function'){//之前老的调用，没有code
        //         callback = config;
        //     } else{
        //         data = config.data;
        //         callback = config.callback || function(){};
        //     }

        //     _listenBridge().then(function() {
        //         var model = new ParamsModel(data);
        //         model.callback = callback;
        //         _callHandler("takeScreenshot", model, model.callback);
        //     }, function() {
        //         // callback && callback();
        //     });
        // },

        /**
         * 刷新app页面的uuid   手动刷新requesttoken
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        refreshUUID: function(callback) {
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel();
                    _callHandler("refreshUUID", model, newCallback);
                },
                function() { //失败，走测试调试流程
                    // console.log("enter test userInfo");
                }
            );
        },

         /**
         * face++拍摄身份证
         *
         * 0正面 1反面
         *
         * @param {any} type
         */
        getIDCardImage: function(type, callback){
            type = type || 0;
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var obj = {
                    idCardSide: type
                }
                var model = new ParamsModel(obj);
                model.callback = newCallback;
                // console.log(model)
                _callHandler("getIDCardImage", model, newCallback);
            }, function() {
                // console.log('获取权限', type)
                callback && callback({
                    object: {
                        success: 1
                    }
                });
            });

            return this
        },

        /**
         * 调用选择地区控件
         *
         *
         *
         * @param {any}
         */
        chooseCity: function(callback){
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var model = new ParamsModel();
                model.callback = newCallback;
                // console.log(model)
                _callHandler("chooseCity", model, newCallback);
            }, function() {
                // console.log('获取权限', type)
                callback && callback({
                    cityName: '北京',
                    cityCode: '110100'
                });
            });

            return this
        },

        /**
         * 获取banner图
         *
         *   FID	FName
         *   1001	首页
         *   1002	取现页
         *   1003	办卡页
         *
         * @param {any} type
         */
        getAdvertisement: function(type, callback){
            type = type || 0;
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(function() { //成功
                var obj = {
                    locationType: type
                }
                var model = new ParamsModel(obj);
                model.callback = newCallback;
                // console.log(model)
                _callHandler("getAdvertisement", model, newCallback);
            }, function() {
                // console.log('获取权限', type)
                callback && callback({
                    object: []
                });
            });

            return this
        },

        /**
         * 点击选择城市位置
         * @param  {Function} callback 回调函数
         * @return {void}
         */
        showMapSearch: function(callback) {
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel();
                    _callHandler("showMapSearch", model, newCallback);
                },
                function() { //失败，走测试调试流程
                    // console.log("enter test userInfo");
                }
            );
        },

        /**
         * 滚动收起键盘
         * @return {void}
         */
        scrollHidenSoftKeyBoard: function() {
            _listenBridge().then(
                function() { //成功
                    var model = new ParamsModel();
                    _callHandler("scrollHidenSoftKeyBoard", model, "");
                },
                function() { //失败，走测试调试流程
                    // console.log("enter test userInfo");
                }
            );
        },

        /**
         * 日期控件
         * @return {void}
         */
        showDatePicker: function(o) {
            var params = {
                    startTime: o.startTime == undefined ? 1 : o.startTime, //起始时间
                    endTime: o.endTime == undefined ? 33071644800000 : o.endTime, //截至时间
                    title: o.title == undefined ? '请选择日期' : o.title //日期标题
                },
                newCallback = function(data) {
                    data = _parseData(data);
                    o.callback && o.callback(data);
                };

            _listenBridge().then(function() { //成功
                var model = new ParamsModel(params);
                model.callback = newCallback;
                _callHandler("showDatePicker", model, newCallback);
            },
            function() { //失败，走测试调试流程

            });
        },

		/**
		 * 注册native事件通知（2018-5-23新增方法）
		 *
         * @param  {String|Array} notifactionName 事件名称（这个事件不一定跟ios）
         * @param  {Function} callback 回调函数，执行格式：callback(data);其中data代表数据部分，有的话就传
         * @return {void}
		 */
		addNotifactionListener: function(notifactionName, callback){
			if(!notifactionName){
				return;
			}
			let notifactionArray = [notifactionName];
			if(typeof notifactionName === 'object' && notifactionName.length){
				notifactionArray = notifactionName;
			}

            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }

			_listenBridge().then(function() { //成功
				for(let i = 0; i < notifactionArray.length; i++){
					let nName = notifactionArray[i];
					if(typeof nName === 'function'){
						nName = nName();
						if(typeof nName === 'object'){//可能还是个数组
							for(let j = 0; j < nName.length; j++){
								execReg(nName[j]);
							}
						} else{
							execReg(nName);
						}
					}
				}

				function execReg(nName){
					let model = new ParamsModel(nName);
					model.callback = newCallback;
					_callHandler("addNotifactionListener", model, newCallback);
				}
            }, null);
		},

		/**
		 * 删除事件通知监听（2018-5-23新增方法）
		 */
		deleteNotifactionListener: function(notifactionName){
			if(!notifactionName){
				return;
			}
			let notifactionArray = [notifactionName];
			if(typeof notifactionName === 'object' && notifactionName.length){
				notifactionArray = notifactionName;
			}

			_listenBridge().then(function() { //成功
				for(let i = 0; i < notifactionArray.length; i++){
					let nName = notifactionArray[i];
					if(typeof nName === 'function'){
						nName = nName();
						if(typeof nName === 'object'){//可能还是个数组
							for(let j = 0; j < nName.length; j++){
								execReg(nName[j]);
							}
						} else{
							execReg(nName);
						}
					}
				}

				function execReg(nName){
					let model = new ParamsModel(nName);
					_callHandler("deleteNotifactionListener", model, null);
				}
            }, null);
		},

        /**
         * 设置webview窗体信息（2018-5-23新增方法）
		 *
         * @param  {Object} params 设置参数
         * @return {void}
         */
		setWebViewInfo: function(params){
			let DEFAULT_OPTION = {
				//wvxTclr: '#ffffff',	//控制顶部适配层颜色，默认黑色
				//wvxTFclr: 'white', 	//控制顶部安全区域字体颜色，只有black white两种
				//wvxBclr: '', 			//控制底部适配层颜色
				//bounces: 1,			//ios是否允许窗口超出回弹：1允许（默认），0不允许
				//disableLeftGesture: 0,//是否关闭ios页面侧滑的交互；1关闭，0开启（默认）
				//wvBackDisable: 1,		//控制返回是否禁用 0 不禁用（默认） 1 禁用
			}

			params = $.extend({}, DEFAULT_OPTION, params || {});

			//如果禁用返回的话，默认把ios的侧滑也一并禁用了
			if(params.wvBackDisable === 1 && params.disableLeftGesture === undefined){
				params.disableLeftGesture = 1;
			}

			_listenBridge().then(function() { //成功
				var model = new ParamsModel(params);
				// alert(JSON.stringify(model))
                _callHandler("setWebViewInfo", model, null);
            }, null);
		},

		/**
		 * app的指纹、人脸、密码解锁
		*/
		localAuthentication(params, callback){
			let DEFAULT_OPTION = {
				type: 1, 		//1.识别错误没有密码  2.有密码
				tip: ''			//touchID提示
			}
            var newCallback = function(data) {
                data = _parseData(data);
                callback && callback(data);
            }

            params = $.extend({}, DEFAULT_OPTION, params || {});

			_listenBridge().then(function() { //成功
				var model = new ParamsModel(params);
				model.callback = newCallback;
                _callHandler("localAuthentication", model, null);
            }, null);
		}
    };

    // _wv.getAppInfo();//读取app的版本号和环境
    // _wv.loading().hide();///隐藏webview的页面加载效果
    return window.wv = _wv;
}
