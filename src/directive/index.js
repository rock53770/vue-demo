import Vue from 'vue';
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
})
Vue.directive('height', {
  inserted: function (el,binding) {
    if(binding.value === '100%'){
      el.style.height = document.documentElement.clientHeight + 'px';
    } else {
      el.style.height = binding.value;
    }
  }
});

Vue.directive('scroll', {
  inserted: function (el) {
    function GetSlideAngle(dx, dy) {
      return Math.atan2(dy, dx) * 180 / Math.PI;
    }
//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    function GetSlideDirection(startX, startY, endX, endY) {
      var dy = startY - endY;
      var dx = endX - startX;
      var result = 0;

      //如果滑动距离太短
      if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
      }

      var angle = GetSlideAngle(dx, dy);
      if(angle >= -45 && angle < 45) {
        result = 4;
      }else if (angle >= 45 && angle < 135) {
        result = 1;
      }else if (angle >= -135 && angle < -45) {
        result = 2;
      }
      else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
      }

      return result;
    }
    var botScroll = parseInt(window.getComputedStyle(el.children[0], null).height) - parseInt(window.getComputedStyle(el, null).height);
    var scrollTop;
    var direction;
    var startX, startY;
    el.addEventListener('touchstart',function (e) {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    }, false);
    el.addEventListener('touchmove',function (e) {
      var endX, endY;
      endX = e.changedTouches[0].pageX;
      endY = e.changedTouches[0].pageY;
      direction = GetSlideDirection(startX, startY, endX, endY);
      scrollTop = el.scrollTop;
      if((scrollTop === 0 && direction === 2) || (scrollTop === botScroll && direction === 1)){
        e.preventDefault();
      }
    }, false);
  }
});



