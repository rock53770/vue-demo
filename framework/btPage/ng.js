/*
 * baseService的angular版本
 *
 * @Author: dongxiaochai@163.com
 * @Date: 2018-04-02 14:16:25
 * @Last Modified by: dongxiaochai@163.com
 * @Last Modified time: 2018-05-29 15:33:28
 */

import {getIsInApp, GHandlerManager} from './handlerManager'
import baseService from './index'
import {setConfig as _setConfig} from './index'
import Util from '../util'

let _btPage = function($compile, $timeout, $controller, $location) {
    /**
     * h5模态窗口类
     */
    function BtWebModal(config){
        let _this = this;
        _this.modalScope = config.modalScope;
        _this.template = config.template;
        _this.controller = config.controller;
        _this.appendScope = config.appendScope;
        _this.modalId = Util.getGuid();//分配一个独立id
        _this.animateClass = config.animateClass || 'an-fadeInOut';

        _this._init();

        GHandlerManager.modalManager.push(_this);
    }
    BtWebModal.prototype = {
        /**
         * 初始化
         * @return {void}
         */
        _init: function(){
            let _this = this;

            let ctrlInstance,
                ctrlLocals = {}
            ;

            _this.modalScope.modalId = _this.modalId;
            //服务挂载给控制器
            ctrlLocals.$scope = _this.modalScope;
            // ctrlLocals.$modalInstance = _this;
            ctrlLocals.$stateParams = _this.appendScope || {};

            ctrlInstance = $controller(_this.controller, ctrlLocals);

            //移除
            _this.modalScope.$on('$stateChangeStart', function() {
                _this.destory();
                GHandlerManager.modalManager.destoryAll();
            });

            _this.open();
        },

        /**
         * 打开模态窗
         * @return {void}
         */
        open: function(){
            let _this = this, angularDomEl;

            // console.log(_this);
            angularDomEl = angular.element('<div class="ks-fixed" ng-class="moduleClass"></div>')
                .css({
                    position: 'fixed',
                    left: "0px",
                    top: "0px",
                    width: "100%",
					height: "100%",
					zIndex: 100
                })
                .append(angular.element(_this.template).addClass(_this.animateClass).attr('ng-if', 'isShow'))
            ;

            $timeout(function(){
                _this.modalDomEl = $compile(angularDomEl)(_this.modalScope);
                $("body").append(_this.modalDomEl);
                _this.modalScope.isShow = true;
            }, 0);
        },

        /**
         * 关闭模态窗
         * @return {void}
         */
        destory: function(){
            let _this = this;
            $timeout(function() {
                if(_this.modalScope && _this.animateClass){
                    _this.modalScope.isShow = false;
                    setTimeout(_destory, 300);//等动画结束再销毁
                } else{
                    _destory();
                }
            }, 0);

            function _destory() {
                _this.modalScope && _this.modalScope.$destroy();
                _this.modalScope = null;
                _this.modalDomEl.remove();
            }
        }
    }

    //重写这两个函数（主要是针对ng的扩展）
    baseService.$timeout = $timeout;
    // baseService.$changeLocation = url => {
    //     $location.url(url)
    // };

    let baseOpenModal = baseService.openModal;

    //重写_getArgu函数
    let oldGetArgus = baseService._getArgus;
    baseService._getArgus = (config) => {
        config = oldGetArgus(config);

        //保证保证angular项目的这个方法注入（暂时这么实现）
        if(!baseService._getState && window.getState){
            baseService._getState = window.getState;
        }

        return config;
    }

    /**
     * 打开H5模态窗口（不管是不是app内，都以h5的模态弹层形式加载），暂时不支持更多跟open方法一样的更多的配置，以后有需要再扩展
     * @return {void}
     */
    baseService.openModal = function(config = {
        url: '',                //打开的url，可以只传相对路径
        controller: tmpl,       //控制器
        template: ctrl,         //模板
        params: null,           //其它
    }) {
        let isRender = baseOpenModal.apply(this, arguments);

        if(isRender){
            return;
        }
        let _this = this,
            appElement = angular.element("#ng-app"),
            $parentScope = appElement.scope(),
            $modalScope = $parentScope.$new()
        ;

        if(config.url){
            let stateConfig = window.getState && getState(config.url);

            if(!stateConfig){
                console.error('找不到路由: ' + config.url);
                return;
            }

            config.params = config.params || {};
            if(config.url.indexOf('?') >= 0){
                angular.extend(config.params, Util.unparam(config.url.split('?')[1]));
            }

            if(typeof stateConfig.template === 'function'){
                stateConfig.template().then(function(t){
                    renderModal(t);
                });
            } else if( typeof stateConfig.template === 'string'){
                renderModal(stateConfig.template);
            }

            function renderModal(t){
                if(stateConfig.controller){
                    stateConfig.controller().then(function(c){
                        initModal(t, c);
                    });
                } else{
                    initModal(t);
                }
            }
        } else{
            initModal(config.template, config.controller);
        }

        function initModal(t, c){
            let btWebModal = new BtWebModal({
                modalScope: $modalScope,
                template: t,
                controller: c || function(){},
                appendScope: config.params,
                animateClass: config.animateClass
            });
            btWebModal.jsOnResume = config.jsOnResume;
        }
    }
    return baseService;
}

export let setConfig = _setConfig;
export default window.btPage = _btPage;