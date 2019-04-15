
const LoadingComponent = {
  data () {
    return {

    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  mounted(){
    console.log("LoadingComponent")
  },
  template: `
  <div class="ta-c pt40">努力加载中...</div>
  `
}
export default LoadingComponent
