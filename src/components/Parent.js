const Parent = {
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    // const toDepth = to.path.split('/').length
    // const fromDepth = from.path.split('/').length
    // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },
  template: `
  <router-view class=""></router-view>
  `
}
export default Parent
