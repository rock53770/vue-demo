/**
 * 全局配置文件
 * @type {Object}
 */
//默认配置，这个不准乱改！！！你们开发的时候改配置，请改envConfig.development下的，要是改坏了见一次打一次！！
let isApp = false;
if(process.env){
  isApp = process.env.IS_APP === undefined ? false : process.env.IS_APP;
}

let DEFAULT_CONFIG = {
		isTest: false,	//用于开发阶段使用，全部启用测试通道，慎用再慎用

    openLog: true,	//是否开启控制台日志console
    isInApp:null,
    isAppProject: isApp, //当前系统类型，是否App。true是app，false是wap
		pageSize: 20,	//分页条数

		verifyWeChat: true, //微信登录授权验证

    appId: 'wx3000c783b31e6ddd', //微信公众号

    wechatDebug: false, //微信jsapi是否调试模式

    jsApiList: [
        'getLocation',
        'chooseImage',
        'getLocalImgData',
        'uploadImage',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'updateAppMessageShareData',
        'updateTimelineShareData'
    ] //需要使用的微信JS接口列表
	},
	envConfig = {
	    //开发环境
	    development: {
        	// appId: 'wxecc8b92540f58725', //开发微信公众号
            appId: 'wx3000c783b31e6ddd', //开发微信公众号
          isTest: false || sessionStorage.isTest,
        //   isTest: true,
          verifyWeChat:true, //微信登录授权验证
          wechatDebug: true //微信jsapi是否调试模式
	    },
	    // //预发布环境
	    // preproduction: {
        // 	appId: 'wx44cbc301c81c5381' 	//测试微信公众号
	    // },
	    //生产环境
	    // production: {
        	// appId: 'wxecc8b92540f58725' 	//测试微信公众号
	    // }
	},

	config = Object.assign({}, DEFAULT_CONFIG);

try{
	if(process.env.NODE_ENV){
		Object.assign(config, envConfig[process.env.NODE_ENV]);
		config.env = process.env.NODE_ENV;
	}
	if(location.host === 'wxtest.bz-ins.com'){//测试环境
		config.appId = 'wxf57af8f59a52c59a'
	} else if (location.host === 'prepinsuranceapixxb.bz-ins.com'){
		config.appId = 'wx22904344508fbb5f'
  }
}catch(ex){}
// alert(config.appId)
// console.log(config);
window.GConfig = config;
export default config
