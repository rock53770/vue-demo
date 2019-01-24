/*
 * 全局应用管理
 *
 * @since 2017-05-10
 * @author dongxiaochai@163.com
 */
import Util from '../util'
let  isAndroid  =  new  RegExp(/Android/ig).test(navigator.userAgent);

/**
 * 判断是否在我们的app内
 * @return {Boolean}
 */
export function getIsInApp(){
    if(window.wv){
        return wv.getIsInApp();
    } else{
        return new Promise((resolve, reject) => {
            reject();
        })
    }
}

/**
 * 全局事件处理程序管理器
 * @type {Object}
 */
export let GHandlerManager = {
    /**
     * 跨页面参数管理
     * @type {Object}
     */
    crossArgs: {
        //全局跨页面参数键名
        _key: 'crossPageArgs',
        /**
         * 设置跨页面临时参数
         */
        setArgs: function(data) {
            Util.setLocalData(this._key, data);
        },

        /**
         * 取得跨页面临时参数
         */
        getArgs: function(){
            let crossPageArgs = Util.getLocalData(this._key);

            this.removeArgs();//只用一次，删除掉

            return crossPageArgs;
        },
        /**
         * 清楚跨页面临时参数
         */
        removeArgs: function(){
            Util.removeLocalData(this._key);//只用一次，删除掉
        }
    },

    /**
     * 模态框栈管理器
     * @type {Object}
     */
    modalManager: {
        /**
         * 模态框栈（这不是一个典型的栈）
         * @type {Array}
         */
        modalStack: [],

        // /**
        //  * 返回模态窗是否为空
        //  * @return {Boolean}
        //  */
        // getIsEmpty: function(){
        //     return this.modalStack.length === 0;
        // },

        /**
         * 推入一个模态窗
         * @param  {Object} webModal 窗口
         * @return {void}
         */
        push: function(webModal){
            GHandlerManager.crossArgs.removeArgs();//保险一点把旧的参数再移除一下
            this.modalStack.push(webModal);
        },

        /**
         * 取得对应的模态窗对象
         * @param  {Integer} num 离栈顶第几个
         * @return {Object} 模态窗对象
         */
        getModal: function(num){
            let _this = this;
            if(num > _this.modalStack.length){
                return null;
            }
            return _this.modalStack[_this.modalStack.length - num];
        },

        /**
         * 销毁对应的模态窗以及栈上面的模态窗
         * @param  {Integer} count 要销毁的数量
         */
        destory: function(count){
            let _this = this;
            if(_this.modalStack && _this.modalStack.length === 0){
                return;
            }

            for(let i = _this.modalStack.length - 1; i >= 0 && count > 0; i--){
                count--;
                let webModal = _this.modalStack[i];
                webModal.destory();//不管是angular声明的，还是以后的vue或者其它框架定义的模态类实例，请提供统一的destory方法
                _this.modalStack.splice(i, 1);
            }
        },

        /**
         * 销毁所有模态窗
         */
        destoryAll: function(){
            return this.destory(this.modalStack.length);
        }
    },

    /**
     * 事件函数数组
     * @type {Object}
     */
    _handlerList: {},

    /**
     * 获取当前编码之后的url地址
     * @returns {*|String}
     */
    _getCurrUrl: function () {
        let sPath = Util.encodeUri(window.location.href);
        return sPath.replace(/\./g, "_");
    },

    /**
     * 获取当前页面的管理器
     * @return {Object}
     */
    _getCurrPageManger: function(){
        let _this = this,
            sPath = this._getCurrUrl(),
            oCurrManager = _this._handlerList[sPath];

        return oCurrManager;
    },

    /**
     * 向当前页面填入一个函数 挂在_this._handlerList下 以当前路由的url作为key（针对app内的页面，webModal的模式挂在在自己的对象上）
     * @param fnName
     * @param fn
     */
    defineHandler: function (fnName, fn) {
        GHandlerManager.crossArgs.removeArgs();//保险一点把旧的参数再移除一下
        let _this = this,
            sPath = _this._getCurrUrl(),
            oCurrManage = _this._handlerList[sPath];

        if(oCurrManage === undefined){
            oCurrManage = _this._handlerList[sPath] = {};
        }

        //如果只传了一个匿名函数过来，则自己取一个随机函数名，并挂上去（这个比较鸡肋，后面去掉它）
        if(typeof fnName === 'function'){
            fn = fnName;
            // fnName = "backFn" + (+new Date() + Math.floor(Math.random() * 1000));
            oCurrManage.anonymHandler = fn;
        } else{
            oCurrManage[fnName] = fn;
        }
        // alert(fnName);
    },

    /**
     * 获取执行的事件句柄函数体字符串
     * @param {Object} obj 回调执行的参数
     */
    getHandler: function (obj) {
        if(!obj){
            obj = {};
        }

        let params = JSON.stringify(obj);

        return 'GHandlerManager.emitHandler('+ params +', true)';
    },

    /**
     * 执行前一个页面的函数
     * @param {Object}  obj
     *        {
     *            handlerName: "",  //函数名称，这是为了兼容老的写法暂时保留，以后要去掉
     *            args: {},         //函数参数
     *        }
     */
    emitHandler: function (obj, isOldStyle) {
        if(!obj){
            obj = {};
        }
        let _this = this,
            oParams = obj || {},
            sPath = this._getCurrUrl(),
            newCallbackStr,
            oCurrManager = _this._getCurrPageManger()
        ;

        oParams.args = oParams.args ? oParams.args : [];
        oParams.handlerName = oParams.handlerName || "anonymHandler";

        let args = oParams.args.join(',');

        if(oCurrManager && oCurrManager[oParams.handlerName]){
            try {
                oCurrManager[oParams.handlerName].apply(_this, oParams.args);
                if(!isOldStyle){//老的方式暂时不清除
                    delete oCurrManager[oParams.handlerName];//执行过了一定要销毁掉，否则会污染其它地方
                }
            } catch (ex){
                console.log('回调执行出错');
            }
        } else{
            console.log('回调方法不存在');
        }
    },

    /**
     * 返回前面第N个窗口
     * @param {Integer} step    后退的步数，如果，如果当前是模态窗，返回上一页即关闭当前模态窗（请传正整数，不传的话默认后退一步）
     * @return {Object} args    回到前面的页面需要带过去的参数
     */
    emitGoBack: function(step, args){
        let _this = this,
            callbackStr = _this.getHandler({
                args: [args]
            }),
            stackLength = _this.modalManager.modalStack.length,
            isTransparentModal = location.href.indexOf('overlay.html#') > -1 || location.href.indexOf('isTransparentModal=1')> -1//是否native的模态窗（针对ios）
        ;

        _this.crossArgs.setArgs(args);
        if(stackLength > 0){//先把模态窗关了
            // setTimeout(function(){
                let webModal = _this.modalManager.getModal(step);//如果关闭的最后是模态框，就执行回调
                if(webModal && webModal.jsOnResume){
                    webModal.jsOnResume(args);
                }
                _this.modalManager.destory(step);
            // }, 0);

            step = step - stackLength;
        }

        if(step > 0){
            getIsInApp().then(
                function(){
                    //透明弹窗ios不支持jsOnResume（安卓未知），所以只能通过传callbackStr去执行
					if(isTransparentModal || (isAndroid && step > 1)){//modify by dongxiaochai@163.com 2018-09-11 安卓的跨多个页面返回，只能用脚本执行的方式
                        wv.goBack(step, callbackStr);
                    } else{//普通页面，使用btPage重写的jsOnResume执行
                        wv.goBack(step);
                    }
                },
                function(){
                    history.go(-step);
                    if (callbackStr) {
                        setTimeout(function() {
                            try {
                                eval(callbackStr);
                            } catch (ex) {}
                        }, 100);
                    }
                }
            );
        }

        // //ios的callbackStr有几百毫秒的执行延时，确保ios执行了以后清除一下参数以免对其它栈函数调用造成异常
        // setTimeout(function(){
        //     GHandlerManager.crossArgs.removeArgs();
        // }, 1500);
    }
};

window.getIsInApp = getIsInApp;
window.GHandlerManager = GHandlerManager;
// export default {getIsInApp, GHandlerManager}