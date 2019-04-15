
const errorComponent = {
  data () {
    return {
    }
  },
  mounted(){
    console.log("errorComponent")
  },
  methods:{
    retry(){
      location.reload()
    }
  },
  template: `
  <div class="ta-c pt40 pos-a wh-100" @click="retry">
    <div class="pb40">网络超时</div>
    <div>点击页面任意位置重试</div>
  </div>
  `
}
export default errorComponent
