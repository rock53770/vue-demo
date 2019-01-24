
<template>
  <div :style="{ 'top': navHeight + 'px' }" class="pos-a l0 h-100 w-100">
    <btScroller :getData="getData" :currentPage.sync="pageIndex" class="">
        <div class="pt12 mlr15">
          <div class="bg-white p10 bdr5 ft12" v-for="(i,index) in noticeList" :key="index">
            <div class="flex-center h35">
              <span class="w35 h35 mr10">
                <img src="~@/assets/icons/icon_notice@2x.png" class="w-100">
              </span>
              <span class="flex-1 fw-b ft16" v-text="i.title"></span>
              <span>{{i.createTime|dataFormat('MM/dd hh:mm')}}</span>
            </div>
            <div class="pl35 ml10"  @click="go(i)">
              <span class="cl-gray" v-text="i.content"></span>
              <span class="cl-orange ft12" style="text-decoration:underline">前往查看详情</span>
            </div>
          </div>
        </div>
        <div class="no-data-box empty" slot="empty">
            <div class="info no-notice"></div>
            <p class="mt20 cl-gray ft16">您暂时没有消息通知哦</p>
        </div>
    </btScroller>
  </div>
</template>
<script>
import btScroller from '@/components/btScroller';
import quoteService from '@/api/quoteService';
export default {
  name: 'notice',
  data () {
    return {
      navHeight:Util.getNavHeight(),
      pageIndex:1,
      noticeList:[],
    }
  },
  created(){
    // this.$store.dispatch("setHead", {
    //   needBack:false
    // });
  },
  components: {
    btScroller
  },
  methods:{
    getData () {
        let self, param, $promise
        self = this
        param = {
            pageIndex: this.pageIndex,
            pageSize: 20,
            // status: this.tabsIndex + 1,
        }
        $promise = quoteService.notice(param)
        $promise.then((res) => {
            if (res.code == 1) {
                if (res.page && res.page.currentPage > 1) {
                    self.noticeList = [
                        ...self.noticeList,
                        ...res.object
                    ];
                } else {
                    self.noticeList = res.object;
                }
            } else {
                Toast(res.message)
            }
        })
        return $promise
    },
    go(i){
      // var a = "bzinsurance://www.bz-ins.com/order?type=0"
      // var i = {
      //   linkUrl:"/order?type=1"
      // }
      var params = {};
      var url = "";
      if(i.linkUrl  && i.linkUrl.indexOf("?") != -1){
        params = getAllUrlPram(i.linkUrl.split("?")[1])
        url = i.linkUrl.split("?")[0]
      } else {
        url = i.linkUrl
      }
      if(i.linkUrl){
        btPage.open({
          url: url,
          params: params,
          container_style:1,
        })
      }

      function getAllUrlPram(url){
          var arr = url.split("&");  //将字符串以&为分隔符转化为数组
          var obj = {};  //定义一个空对象

          for(var i=0;i<arr.length;i++){
              var str0 = arr[i].split("=")[0],      //将获得数组中的每一个元素字符串转换成用"="分割的数组，数组第一个元素即为key
                    str1 = arr[i].split("=")[1];      //将获得数组中的每一个元素字符串转换成用"="分割的数组，数组第一个元素即为value
              obj[str0] = decodeURI(str1);     //由于url中使用的是转义后的字符，因此必须使用decodeURI进行解码
          }

          return obj;
      }
    }
  },
  beforeDestroy: function() {
      // document.body.classList.remove("bg-white");
  },
  mounted () {
      setPageTitle('消息中心');
  },
}
</script>

