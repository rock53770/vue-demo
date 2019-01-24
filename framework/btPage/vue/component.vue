<template>
  <div class="ks-fixed" v-show="isShow">
    <div class="webDialog-wrapper">
        <div class="mask"></div>
        <div ref="content" style="z-index:2;"></div>
    </div>
  </div>
</template>
<script>
//这一层组件的意义在于，到时候可能把透明背景啥的统一实现。
export default {
  name: 'bt-modal',
  // model: {
  //   prop: 'show'
  // },
  data() {
    return {
      isShow: false,
      vm: null,
      vmList: []
    }
  },
  props: {
    transition: {//暂时没用
      type: String,
      default: 'an-fadeInOut'
    },
    showBg: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    //打开模态框
    open(Component, option){
      let _this = this;
      if(!Component){
        return null;
      }

      let el = document.createElement('div')
      _this.$refs.content.appendChild(el)

      let vm = new Component(option).$mount(el);

      _this.vmList.push(vm)

      _this.isShow = true;
      return vm;
    },
    //关闭
    close(vm){
      let _this = this;
      for(let i = 0; i < _this.vmList.length; i++){
        if(_this.vmList[i] === vm){
			_this.vmList[i].$el.remove();
          	_this.vmList[i].$destroy();
          	_this.vmList.splice(i, 1);
          	break;
        }
      }
      if(this.vmList.length === 0){
        this.isShow = false;
      }
    },
    closeAll(){
      for(let i = 0; i < _this.vmList.length; i++){
        _this.vmList[i].close();
      }
    }
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.closeAll();
    GHandlerManager.modalManager.destoryAll();
  }
}
</script>

<style lang="less">
.ks-fixed{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.webDialog-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	.mask{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-color: transparent;
	}
}
</style>
