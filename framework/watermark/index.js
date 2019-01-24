/**
 * 元素水印
 *
 * @author dongxiaochai@163.com
 * @since 2017-11-03
 */
import './watermark.less';
import $ from 'jquery';
// define(['jquery'], function($){
    /**
     * 增加水印
     * @param  {Object} config 
     *         {
     *             keys: ['2121', 'fff是多少'], 用来遍历的关键词数组
     *             fixed: position是否为fixed，如果是，z-index会被设置成-1，默认是absolute,盖在最上面
     *         }
     */
	$.fn.watermark = function(config){
        var jThis = $(this),
            style = 1, //0:画布,1:html
            deg = 15, //旋转度数
            fontSize = 13,//文字大小
            lineHeight = 98,//行高
            textPaddingRight = 60,//文字间距离
            jContainer = $('<div class="watermark-container"></div>'),
            x, y, X, Y
        ;

        if(!config.keys || config.keys.length == 0){
        	return;
        }

        jContainer.appendTo(jThis);

        //native无法实现分层级显示，所以简单点实现
        jContainer.css({
            position: 'fixed',
            zIndex: '999'
        })
        // if(config.fixed){
        //     jContainer.css({
        //         position: 'fixed',
        //         zIndex: '-1'
        //     })
        // } else{
        //     //如果内容比当前设置的还要高，设置当前容器为基容器
        //     if(jContainer.outerHeight() < jThis.height() && jThis.css('position') == 'static'){
        //         jThis.css('position', 'relative')
        //     }
        // }

        // x = jContainer.outerWidth();
        // y = jContainer.outerHeight(); 
        //native无法实现分层级显示，所以直接去窗口的大小，否则又梗
        x = $(window).width();
        y = $(window).height();

        var maxLen = Math.max(x, y)
        X = Math.sqrt(maxLen * maxLen * 2);
        // X = Math.sqrt(x * x + y * y);
        Y = X;

        // console.log(x, y,X, Y);
        if(style == 1){
            var sText = '', jTransBox = $('<div class="trans-box"></div>'), 
                singleWidth = 0,//重复一次需要的长度
                singleHeight = lineHeight
            ;

            for(var i = 0; i < config.keys.length; i++){
                sText += '<span>'+ config.keys[i] +'</span>';
                singleWidth += fontSize * config.keys[i].length + textPaddingRight;
            }
           
            //计算需要重复多少次。
            var repeatCount = Math.ceil(X * Y / (singleWidth * singleHeight)),
            	tranX = (x - X) / 2,
                tranY = (y - Y) / 2,
                allText = ''
            ;

            for(var i = 0; i < repeatCount; i++){
            	allText += sText;
            }

            jTransBox.append(allText).css({
                width: X + 'px',
                height: Y + 'px',
                lineHeight: lineHeight + 'px',
                fontSize: fontSize + 'px',
                transform: 'rotate(-15deg) translate3D('+ tranX +'px, '+ tranY +'px, 0px)',
                webkitTransform: 'rotate(-15deg) translate3D('+ tranX +'px, '+ tranY +'px, 0px)'
            }).appendTo(jContainer);
        } else{//画布，会模糊，还得引入dpr插件实现，太麻烦，暂时不实现
//                         var canvas = document.createElement('canvas'),
//                             ctx = canvas.getContext('2d')
//                         ;

//                         canvas.width = X; 
//                         canvas.height = Y;
//                         ctx.rotate(-15 * Math.PI / 180);


// // ctx.font="13px Arial";
// //                         var yy = 20, beginX = 0;
// //                         for(var i = 0; i < config.keys.length; i++){
// //                             ctx.fillText(config.keys[i], beginX, 10);
// //                             beginX = ctx.measureText(config.keys[i]).width + 60;
// // console.log(config.keys[i], ctx.measureText(config.keys[i]));
// //                         }
// // // ctx.fillText("Hello World!",0,10);
// // ctx.fillText("Hello World!",0,50);
// // ctx.fillText("Hello World!",0,70);
            

//                         jThis.append(canvas) 
        }
	}
// });