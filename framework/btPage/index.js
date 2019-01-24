/*
 * 基础页面跳转控制实现（如果没有调用web模态框的场景，引用这个也就够了）
 * 重要改动点：openFull方法现在默认为不透明的打开方式了，如果需要用透明模态框形式打开，调用本脚本暴露的setConfig方法设置默认值
 *
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-02 14:13:44
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-09-11 19:12:27
 */
import {getIsInApp, GHandlerManager} from './handlerManager'
import './style.less'

let DEFAULT_CONFIG = {
	fullDefaultTransparent: false,	//针对openFull是否默认透明的，为了给老项目兼容用的
	subProjectPath: '',     //当前app内子工程的path前缀
};
let baseConfig = {};

export let setConfig = (config) => {
	if(config){
		baseConfig = Object.assign({}, DEFAULT_CONFIG, baseConfig, config)
	}
}

//实现$.param功能
function $param(obj){
    let str = '';
    for(let key in obj){
        str += `${key}=${obj[key]}&`;
    }

    if(str){
        str = str.substr(0, str.length -1);
    }
    return str;
}

let baseModel = {
    /**
     * 转化参数为对象
     * @param  {Object|String} config或者url
     */
    _getArgus: function(config){
    	if(typeof config === 'string'){
            config = {
                url: config
            };
        }

        return config;
    },

    //定时器（主要是针对ng的扩展）
    $timeout: (fn, time) => {
        window.setTimeout(fn, time);
    },
    //页面跳转函数（主要是针对框架路由跳转的扩展）
    $changeLocation: null,
    _getState: window.getState || null,
    /**
     * 网页location跳转的时候，组合跳转地址和参数
     */
    _getWebUrl(config){
        let _this = this;
        if(config.params !== undefined && typeof(config.params) === 'object'){
            let paramsStr = $param(config.params);

            config.url += config.url.indexOf('?') > -1 ? "&" : "?";
            config.url += paramsStr;
        }

        if(config.url.indexOf("/") === 0 && _this._getState && location.href.indexOf("#") > -1){ //如果有注册getState函数，并且带#，认识为hash模式的应用
            config.url = "#" + config.url;
        }
    },

    /**
     * app内openPage跳转，当当前为wap形式访问的时候（包括app内html5调试模式），如果传递跳转的url是相对路径，转化成完整url(其中getState函数需要自行实现)
     */
    _getWapFullUrl(config){
        let _this = this;
        let configUrl = config.url;
        if(configUrl.startsWith('http')){
            return '';
        } else if(location.href.startsWith('http') === false){ //当前页面不是以http形式访问（即file形式，就不转化了）
            return '';
        }

		//如果有路由数组
		let isExistRoute;
        if(_this._getState){
            isExistRoute = _this._getState(configUrl);//当前h5应用是否存在要跳转的这个path
            if(!isExistRoute){
                return '';
            }

            let originPrev;
            if(location.href.indexOf('#') > -1){
                originPrev = location.href.substr(0, location.href.indexOf('#') + 1);
            } else{
                originPrev = location.origin;
            }
            configUrl = originPrev + configUrl;
        } else{
            if(configUrl.startsWith('/')){//http的页面，拼个完整的
                configUrl = location.origin + configUrl
            }
        }

		//当前是非内网ip调试模式的wap
		let isUsePathRule = true;
		let isAppProject = true;
		if(window.GConfig !== undefined){
			if(GConfig.isUsePathRule !== undefined){
				isUsePathRule = GConfig.isUsePathRule;
			}
			if(GConfig.isAppProject !== undefined){
				isAppProject = GConfig.isAppProject;
			}
		}
        if(isAppProject && isUsePathRule){//走path化的配置
			//如果配置了当前是子工程，path化跳转的时候，增加子工程的目录层级
			if(isExistRoute && baseConfig.subProjectPath && config.url.indexOf(baseConfig.subProjectPath) === -1){
				config.url = baseConfig.subProjectPath + config.url;
			}
			config.fullPath = configUrl;
            return '';
        } else{
            config.url = configUrl;
            return configUrl;
        }

        // if(window.GConfig && GConfig.isAppProject == true)
    },
    /**
     * 重写jsOnResume
     * @param  {Function} jsOnResume
     * @return {Function}
     */
    _rewriteJsOnResume: function(jsOnResume){
        let _this = this;
        let newJsOnResume = function(){
            try{
                let args = GHandlerManager.crossArgs.getArgs();
                _this.$timeout(function(){
                    jsOnResume(args);
                }, 0);
            } catch(ex){
                setTimeout(function(){alert(ex.toString());}, 300);
            }
        };

        return newJsOnResume;
    },

	/**
	 * open钩子
	 */
	_openHooks: [],
	/**
	 * 注册全局open钩子
	 * @param {Function} hookFn
	 */
	addHook(hookFn){
		this._openHooks.push(hookFn);
		return this;
	},

	/**
	 * 删除全局open钩子
	 * @param {Function} hookFn
	 */
	deleteHook(hookFn){
		let _this = this;
		for(let i = 0; i < _this._openHooks.length; i ++){
			if(_this._openHooks[i] === hookFn){
				_this._openHooks.splice(i, 1);
				break;
			}
		}
		return _this;
	},

    /*
        * 统一的页面跳转服务
        * @param  {Object|String} config或者url
        * @return {void}
        */
    open: function(config){
    	let DEFAULT_CONFIG = {
	        url: '',            //打开的url，可以只传相对路径
	        type: 0,            //跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开
	        title: "",       //要打开的页面的标题
	        params: null,       //其它
	        closePageCount: 0,  //关闭的前面几页（包括自己，传这个的话type必须为0）
	        jsOnResume: null    //页面返回时候执行的回掉
    	}
        let _this = this;
        config = _this._getArgus(config);
        config = Object.assign({}, DEFAULT_CONFIG, config);

		let hookNum = 0;
		let next = () => {
			if(_this._openHooks.length > hookNum + 1){
				next = () => {

				}
			} else{
				next = doOpen;
			}
			_this._openHooks[hookNum].call(_this, config, next);
		}

		if(_this._openHooks.length > 0){
			next = () => {
				if(_this._openHooks.length > hookNum + 1){
					_this._openHooks[++hookNum].call(_this, config, next);
				} else{
					doOpen();
				}
			}

			_this._openHooks[hookNum].call(_this, config, next);
		} else{
			doOpen();
		}

		function doOpen(){
			getIsInApp().then(
				function(){
					let fullUrl = _this._getWapFullUrl(config);

					//定义返回回调
					if(config.jsOnResume){
						config.jsOnResume = _this._rewriteJsOnResume(config.jsOnResume);
						GHandlerManager.defineHandler(config.jsOnResume);
					}

					if(fullUrl){
						wv.openWebPage(config);
					} else{
						wv.openPage(config);
					}
				},
				function(){
					_this._getWebUrl(config);

					//子模块，并且定义返回回调
					if(config.jsOnResume && (location.pathname + location.hash).indexOf(config.url > -1)){
						config.jsOnResume = _this._rewriteJsOnResume(config.jsOnResume);
						GHandlerManager.defineHandler(config.jsOnResume);
					}

					if(_this.$changeLocation && (config.url.startsWith('/') || config.url.startsWith('#/'))){//相对的，用$locatoin去跳转(针对angular的处理，为什么我忘了)
						_this.$timeout(function(){
							_this.$changeLocation(config.url.replace('#', ''));
						}, 0);
					} else{
						location.href = config.url;
					}
				}
			);
		}
    },

    /**
     * 打开全屏网页，ios下默认是透明弹窗
     * @param  {Object|String} config 或者url参数参考openPage方法
     * @return {void}
     */
    openFull: function(config){
    	let DEFAULT_CONFIG = {
	        url: '',                //打开的url，可以只传相对路径
	        type: 0,                //跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开
	        title: "",              //要打开的页面的标题
	        params: null,           //其它
	        closePageCount: 0,      //关闭的前面几页（包括自己，传这个的话type必须为0）
	        isTransparent: baseConfig.fullDefaultTransparent != undefined ? baseConfig.fullDefaultTransparent : false,   //是否透明（该属性的定义让我特别别扭，主要因为ios当时埋下的大坑，把全屏透明的定义成模态框，会导致窗口间后退和打开有太多限制。注意版本兼容问题，目前员工端和信用端已支持，其它应用不保证）
	        jsOnResume: null        //页面返回时候执行的回掉
    	}
        let _this = this;
        let isTransparentModal = location.href.indexOf('overlay.html#') > -1 || location.href.indexOf('isTransparentModal=1')> -1

        config = _this._getArgus(config);
        config = Object.assign({}, DEFAULT_CONFIG, config);

        getIsInApp().then(
            function(){
                if(isTransparentModal && config.isTransparent){//ios不支持打开多个模态窗，所以有需要多个fullPage的情况，就以webmodal实现
                    _this.openModal(config);//非app内，用模态窗口方式打开
                } else{
                    _this._getWapFullUrl(config);

                    //定义返回回调
                    if(config.jsOnResume){
                        config.jsOnResume = _this._rewriteJsOnResume(config.jsOnResume);
                        GHandlerManager.defineHandler(config.jsOnResume);
                    }

                    if(config.fullPath){
                        config.url = config.fullPath;//openFullPage这种反正也只能一定用全地址了
                    }
                    // alert(config.jsOnResume);
                    wv.openFullPage(config);
                }
            },
            function(){
                _this.openModal(config);//非app内，用模态窗口方式打开
            }
        );
    },

    /**
     * 强制打开H5模态窗口（不管是不是app内，都以h5的模态弹层形式加载），暂时不支持更多跟open方法一样的更多的配置，以后有需要再扩展
     * @return {void}
     */
    openModal: function(config) {
    	let DEFAULT_CONFIG = {
	        url: '',                //打开的url，可以只传相对路径
	        params: null,           //其它
    	}
        let _this = this;
        config = _this._getArgus(config);
        config = Object.assign({}, DEFAULT_CONFIG, config);

        if(config.url){
            _this._getWebUrl(config);
            config.url = config.url.replace('#', '')
        }

        //定义返回回调
        if(config.jsOnResume){
            config.jsOnResume = _this._rewriteJsOnResume(config.jsOnResume);
            // GHandlerManager.defineHandler(config.jsOnResume);
        }

        //iframe形式实现
        if(config.url && !_this._getState && !config.component){
            let iframe = document.createElement('iframe');

            iframe.name = "bt-frame-modal"

            iframe.src = config.url;
            iframe.frameborder = 0;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.scrolling = 'yes';

            iframe.style.position = 'fixed'
            iframe.style.left = '0px';
            iframe.style.top = '0px';
            iframe.style.border = '0px';

            top.document.getElementsByTagName('body')[0].appendChild(iframe);

            let iframeModel = {
                destory: () => {
                    //移除iframe
                    iframe.parentNode.removeChild(iframe);
                },
                jsOnResume: config.jsOnResume
            }

            top.GHandlerManager.modalManager.push(iframeModel);

            return true;
        }
        return false;
    },

    /**
     * 提供wv.goBack的封装，如果需要回调js，要求前一个页面都用GHandlerManager提前注册方法
     * @param {Object} config
     * @return {void}
     */
    goBack: function(config = {
        step: 1,            //后退的步数，如果，如果当前是模态窗，返回上一页即关闭当前模态窗（请传正整数，不传的话默认后退一步）
        args: null          //回到前面的页面需要带过去的参数
    }){
		if(typeof config === 'number'){
			config = {
				step: config
			}
		}
        config = config || {};
        let step = config.step || 1,
            args = config.args
        ;

        parent.GHandlerManager.emitGoBack(step, args);
	},
	/**
	 * 设置app内后退页面携带的参数数据，
	 * 针对ios右滑，或者左上角返回这种非js可定制的回退事件的向前传参
	 * 不建议用该方法替代goBack的传参
	 * @param {*} data 要设置的值
	 */
	setResumeData(data){
		return GHandlerManager.crossArgs.setArgs(data);
	}
};

//下面这几个扩展是为了一些子项目的跳转，有时候需要扩展特定的跳转，比如wap-xiaofeidai项目需要扩展一个openXfd和openXfdFull
baseModel.$open = baseModel.open;
baseModel.$openFull = baseModel.openFull;
baseModel.$openModal = baseModel.openModal;

export default window.btPage = baseModel;