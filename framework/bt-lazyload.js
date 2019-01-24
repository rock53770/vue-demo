/**
 * 图片懒加载
 * @author ashaLiu
 * @since 2016/12/29
 */


/*
 * 延迟加载的原理：滚动时：待加载的资源相对于游览器顶端的距离 - threshold <= 可视区域相对于浏览器顶端的距离 true 就加载
 * 否则的话 不加载
 */

define(["jquery"], function($){
    var DEFAULT_CONFIG = {
            container:"window",  //懒加载的框，可以某个容器，默认是window
            imgTarget: "", //需要懒加载的图片，是个jquery的dom对象
            lazyFn: "",  //懒加载时候的回调函数
            threshold: 0,       // 离出现在视图多少像素开始加载渲染图片
            //effect: 'fadeIn',   // 默认为show 也可以为fadeIn, slideDown 等 jQuery 自带的效果
            lazyloadImgAttr: "defaultsrc",  //默认一开始把图片地址赋值在Img的defaultsrc属性上
            errSrc: "",//加载失败显示的图片
            autoLoad: true //当进入视角，是否自动加载图片
        },

        LOADING_CLASS = "loading",
        LOADED_CLASS = "loaded",
        ERR_CLASS = "loadError",

        Fn = function(oConfig){
            var _self = this;
            _self.oConfig = $.extend({}, DEFAULT_CONFIG, oConfig || {});

            _self._getContainerHeight();

            _self.init();
        },
        _lazyObjList = [],//懒加载对象数组
        scrollTimer //定时器
    ;

    //声明懒加载事件函数
    function lazyloadHandler(){
        if(scrollTimer){
            clearTimeout(scrollTimer);
        }

        scrollTimer = setTimeout(function(){
            if(_lazyObjList.length){
                for(var i = 0; i < _lazyObjList.length; i++){
                    if(_lazyObjList[i].invalid != true){
                        _lazyObjList[i].triggerHandler();
                    }
                    if(_lazyObjList[i].lazyList.length == 0){
                        _lazyObjList[i].invalid = true;
                        // _lazyObjList.splice(i, 1);//这个还不能删除，否则车辆列表页加载有的加载不出来，奇怪奇怪
                    }
                }
            }
            // if(_lazyObjList.length === 0){
            //     $(window).off('scroll resize', triggerHandler);
            // }
        }, 300);
    }

    $.extend(Fn.prototype, {
        lazyList: null,
        init: function(){
            var _self = this;
            _self._lazyload();
            if(!window.lazyloadHandler){
                window.lazyloadHandler = lazyloadHandler;
                $(window).on('scroll resize', window.lazyloadHandler);
            }
        },

        /**
         * 获取容器高度
         * @private
         */
        _getContainerHeight: function(){
            var _self = this;
            _self.nContainerHeight = _self.oConfig.container == "window" ? $(window).height() : $(_self.oConfig.container).height()
        },
        /**
         * 是否快要进入视图区域
         * @param  {[type]}  target [目标Img]
         * @return {Boolean}   
         */
        _isInView: function(target){
            var _self = this,
                nWinTop = _self.oConfig.container == 'window' ? _self.nContainerHeight + $(window).scrollTop() : $(_self.oConfig.container).offset().top + nContainerHeight;
            ;
            return target.offset().top <= nWinTop + _self.oConfig.threshold;
        },

        _lazyload: function() {
            var _self = this;
                
            _self.lazyList = $(_self.oConfig.imgTarget);

            //加上loading样式
            _self.lazyList.each(function(){
                var jThis = $(this);

                jThis.parent().addClass(LOADING_CLASS);
            });

            _lazyObjList.push(_self);

            _self.triggerHandler();
        },

        /**
         * 懒加载处理函数
         */
        triggerHandler: function(){
            var _self = this;
            _self._getContainerHeight();
            _self.lazyList.each(function(i){
                var jThis = $(this),
                    jParentBox = jThis.parent()
                ;

                if(_self._isInView(jParentBox) && !jParentBox.hasClass(LOADED_CLASS)){
                    //懒执行函数
                    _self.oConfig.lazyFn && _self.oConfig.lazyFn();
                    if(!_self.oConfig.autoLoad || !jThis.is("img")){//不执行
                        return _goToEnd();
                    }
                    
                    //懒加载图片
                    var img = new Image(),
                        sSrc = jThis.attr(_self.oConfig.lazyloadImgAttr)
                    ;
                    img.src = sSrc;

                    if(img.complete) {// 如果图片已经存在于浏览器缓存，直接调用回调函数
                        _fnLoadSuccess();
                        return _goToEnd(); // 直接返回，不用再处理onload事件
                    }

                    img.onload = function(){
                        _fnLoadSuccess();
                        return _goToEnd(); // 直接返回，不用再处理onload事件
                    }
                    img.onerror = function(){
                        _fnLoadError();
                        return _goToEnd();
                    }

                    function _fnLoadSuccess(){
                        jParentBox
                            .addClass(LOADED_CLASS)
                            .removeClass(LOADING_CLASS);

                        jThis.attr("src", sSrc);

                        _self.oConfig.onLoaded && _self.oConfig.onLoaded(jThis, img, sSrc);

                        img.onload = null;
                        img.onerror = null;
                        img = null;

                        /*jParentBox
                            .addClass(LOADED_CLASS)
                            .removeClass(LOADING_CLASS);
                        jThis
                            .hide()
                            .attr("src", sSrc)
                            .removeAttr(_self.oConfig.lazyloadImgAttr)
                            .fadeIn();
                        ;*/
                    }

                    function _fnLoadError(){
                        if(_self.oConfig.errSrc && _self.oConfig.errSrc != sSrc){
                            sSrc = _self.oConfig.errSrc;

                            img.src = sSrc;
                        }
                        jParentBox
                            .addClass(ERR_CLASS)
                            .removeClass(LOADING_CLASS);

                        jThis.attr("src", sSrc);
                        
                        img.onload = null;
                        img.onerror = null;
                        img = null;
                    }

                    function _goToEnd(){
                        _self.lazyList = _self.lazyList.not(jThis);
                    }
                }
            });
        }
    });

    return Fn;
});