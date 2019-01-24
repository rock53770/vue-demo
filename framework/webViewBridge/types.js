/* 枚举定义
 * @Author: dongxiaochai@163.com
 * @Date: 2018-05-29 15:50:13
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-06-21 15:54:02
 */
let isAndroid = new RegExp(/Android/ig).test(navigator.userAgent);
let isIOS = new RegExp(/iPhone/ig).test(navigator.userAgent);

export default {
	//页面进入动画(0从右边推入（不传时默认），1不要动画，2从下面升上来)
	pageEnterAnimate: {
		SLIDE_FROM_RIGHT: 0,	//从右边进入⬅️(默认)
		NONE: 1,				//不要动画
		SLIDE_FROM_BOTTOM: 2	//️从下面进入⬆️
	},
	//页面退出动画(0往右边推出（不传时默认），1不要动画，2往下面掉下去)
	pageLeaveAnimate: {
		SLIDE_TO_RIGHT: 0,		//向右边退出➡️(默认)
		NONE: 1,				//不要动画
		SLIDE_TO_BOTTOM: 2		//向下面退出⬇️
	},
	/**
	 * 事件通知类型
	 * ios事件：
	 * 		1. viewWillAppear//页面将要出现
	 * 		2. viewDidAppear//页面已经出现
	 * 		3. viewWillDisappear//页面将要消失
	 * 		4. viewDidDisappear//页面已经消失
	 * 		5.UIApplicationDidBecomeActiveNotification   触发时机：程序进入前台并处于活动状态时调用。
	 * 		6.UIApplicationDidEnterBackgroundNotification          触发时机：程序进入后台时调用
	 * android事件:
	 * 		onAppForeground //程序进入前台并处于活动状态时调用
	 * 		onResume //页面创建的时候会调一次，页面返回也会回调一次
	 * 		onPause//离开页面
	 * */
	notifactionType: {
		//页面唤起，这个事件回调的时候会传回上次进入后台的时间戳：callback({backgroundTime: 1527486989335})
		PAGE_AWAKE: () => {
			if(isIOS){
				return "UIApplicationDidBecomeActiveNotification";
				// return ["UIApplicationDidBecomeActiveNotification", "viewDidAppear"];
			} else if(isAndroid){
				return 'onAppForeground';
			}
			return null;
		},
		//页面即将出现（栈之前切换，或者后台唤起）
		PAGE_APPEAR: () => {
			if(isIOS){
				return "viewDidAppear";
			} else if(isAndroid){
				return 'onResume';
			}
			return null;
		},
		//网络变化
		NETWORK_CHANGE: ''
	}
}