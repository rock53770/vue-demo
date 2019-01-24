/*
 * 全局应用管理
 * 
 * @since 2017-05-10
 * @author dongxiaochai@163.com
 */

import {getIsInApp, GHandlerManager} from './btPage/handlerManager'
import 'jquery'

/**
 * jquery的扩展
 */
$.fn.extend({
    tap: function(fn){
        var jThis = $(this);

        var startX = 0, startY = 0, isMove = false, isSupportTouch = false,startTime;

        jThis.on('touchstart', function(e) {
            startTime = new Date().getTime();
            isSupportTouch = true;
            isMove = false; 
            var oMove = Util.getTouchPosition(e);
            startX = oMove.x;
            startY = oMove.y;    
        });
        jThis.on('touchmove', function(e) { 
            // e.stopPropagation();
            var oMove = Util.getTouchPosition(e),
                nDistance = 10
            ;

            if(Math.abs(oMove.x - startX) > nDistance || Math.abs(oMove.y - startY) > nDistance){
                isMove = true;
            }
        });
        jThis.on('touchend', function(e) {
            var endTime = new Date().getTime();
            if(!isMove && endTime - startTime < 200){
                e.preventDefault();
                // e.stopPropagation(); //阻止冒泡不能随便加
                fn.apply(this, arguments);
            }
        });

        //兼容PC端不支持touch的时候
        jThis.on('click', function(e) {
            if(!isSupportTouch){
                e.preventDefault();
                // e.stopPropagation();
                fn.apply(this, arguments);
            }
        })
    }
});