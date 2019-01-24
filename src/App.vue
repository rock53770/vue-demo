<template>
  <div id="app">
    <header v-if="page.showHeader && isInApp" class="pos-r zi10 cl-white" :style="{ height: navHeight + 'px' }">
      <div class="pos-f t0 w-100 l0" style="background-color:rgba(252,107,71,0.95)">
        <div class="" :style="{ height: navHeight - 44 + 'px' }"></div>
        <div class="h44 flex-center" id="header">
          <div class="w30 h44 pos-r">
            <div class="back" @click="page.back" v-if="page.needBack">
            </div>
          </div>
          <div class="flex-1 ta-c ellipsis">
            <h1 class="ft14 ellipsis">首页</h1>
          </div>
          <div class="w30 h44 pos-r">
            <div class="pos-a r0 t0 w70 h44 ta-r pr10" v-if="page.menuContent"  @click="page.menuClick" v-html="page.menuContent">

            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- <keep-alive include="quote">
      <router-view></router-view>
    </keep-alive> -->
    <!-- <transition name="fade" mode="out-in"> -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->

  </div>
</template>

<script>

// import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';11
export default {
  name: 'app',
  data() {
    return {
      navHeight:Util.getNavHeight(),
      isInApp:GConfig.isInApp,
    };
  },
  computed: {
    page () {
      return this.$store.state.head.page
    },
    transNa(){
      return this.$store.state.transNa.transNa
    }
  },
  created() {
    // this.changePage();
  },
  mounted() {
  },
  methods: {
    changePage (page) {

    },
    back() {
      btPage.goBack();
    }
  }
};
</script>

