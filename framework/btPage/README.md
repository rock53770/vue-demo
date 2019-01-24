#btPage通用性调用封装

## Build Setup

**Requires Node.js 7+**

``` bash
# install dependencies
npm install # or yarn

# build for production
npm run build

# serve in production mode
npm start
```

## License

MIT

## v1.1版本修改说明
```
1.openFull在app内默认的调用改成了非透明模式了，主要为了解决ios下的页面栈间处理的科学性。如果为了已有项目功能的健全性，可以在其暴露的setConfig方法进行全局默认设置，或者调用的时候传个isTransparent: true参数，让其继续保持透明打开；
2.这一版本较大的改变是openModal增加了iframe方式，判断逻辑btPage内部判断实现，无需多余传参，适用于活动等轻框架项目；
3.像活动等轻框架项目，不想引入angular-router,vue-router的框架的，可以直接用script标签引入dist中对应的js文件，文件说明参照下面；
4.这一版本对ng和vue还有基础版的进入动画和统一背景没有比较好的一致的统一实现方案，因为还需要考虑有些是web模态框覆盖和跨页面(app内的openFull和iframe都属于跨页面)，暂时为了保证openFull和openModel的一致性，背景由自己控制；
5.增加对子项目模块的支持，子工程不需要关心当前是作为子工程还是主工程，正常的path跳转调用即可，btPage会自行判断并且组合目标path（不需要像以往，子工程需要关心当前在app内是作为子工程，并且需要为自己提供特定的跳转方法和指令）
```
## 目录说明

### dist说明
目录为直接构建好的文件，可以直接通过script引入对应js（适用于活动等轻框架型项目）

### index.js
基础版本的，支持open，openFull，还有iframe方式的基础openModal。

### ng.js
angular版本实现，这期调整对于老调用有一个影响的地方就是openFull默认是非透明弹窗，如果有影响的按上面所说调整。
如果不通过webpack，可直接引入dist/btPageNg.js
### vue
vue版本实现，请使用插件模式引入到引用中，
例：
```
import {BtPagePlugin} from 'framework/btPage/vue/index'
Vue.use(BtPagePlugin, router)
```
调用：
```
this.$btPage.open({
    url: "/demo/bt_page/modal",
    params: {
        test_param: "abc",
        fdsaf: '324'
    },
    jsOnResume: function(data){
        console.log(data)
    }
})
```
如果不通过webpack，可直接引入dist/btPageVue.js