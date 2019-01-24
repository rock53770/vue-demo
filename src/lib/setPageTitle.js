/**
 * 更改标题
 *
 */

(function(){

  window.setPageTitle = function(title){
    document.title = title;
    var h1 = document.querySelector("h1");
    if(h1){
      h1.innerHTML = title;
    }
    var isWeChat = navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1

    if (GConfig && GConfig.isInApp) { //app内
        wv.setTitle(title);
    } else if (isWeChat && 1 == 2) { //微信浏览器(这个黑科技无效了)
        setTimeout(function() {
            var jTitleIframe = $(".ifTitle");
            if (!jTitleIframe.length) {
                jTitleIframe = $('<iframe class="ifTitle"></iframe>')
                    .hide()
                    .attr("src", "./favicon.ico")
                    .appendTo($('body'));
            }

            jTitleIframe.on('load', function() {
                setTimeout(function() {
                    jTitleIframe.off("load").remove();
                }, 0)
            })
        }, 100)
    } else {
        document.title = title
    }
  };
})();

