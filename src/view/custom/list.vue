<template>
  <div class="">
    <div>
      <form action="/">
        <van-search
          v-model="name"
          placeholder="请输入搜索关键词"
        />
      </form>
    </div>
    <div class="ml12 mr23" v-if="list.length && !loading">
      <div v-for="(i,index) in list" :key="index" >
        <p v-text="i.pinyin" class="lh18 ft8 pb6 pt10" :ref="i.pinyin" :id="i.pinyin"></p>
        <div class="bdr3 bg-white ">
          <div v-for="(j,index2) in i.list" @click="go(j)" :key="index2" class="flex-center pt13 pb13 plr10 van-hairline--bottom">
            <div class="flex-1 lh20">
              <span v-text="j.name" class="mr5"></span>
              <span v-text="j.phone"></span>
            </div>
            <div class="icon-tel p10" @click.stop="call(j)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt40 ta-c" v-if="!list.length && !loading">
      <img src="~@/assets/images/empty/data-no.png"  width="180">
      <div class="mt10 cl-gray">暂无客户</div>
    </div>
    <!-- <div class="pos-f w20 ta-c r0 t0 b0 flex-center alphabet-list" style="top:80px">
      <ul class="">
        <li v-for="i in list" :key="i.pinyin" v-text="i.pinyin" class="lh20 w20 bdr-50 cl-primary" :class="{'bg-primary cl-white':letter == i.pinyin && 0}" @click="handleLetterClick"></li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import Vue from 'vue'

var component
import customService from '@/api/customService'
export default {
  name: 'list',
  data() {
    return {
      id: null,
      name:'',
      loading:true,
      type:1,
      list:[],
      alphabetList:[],
      letter:'',
      rawList:[]
    };
  },
  props:{
    show:false,
  },
  computed: {
  },
  watch: {
    name() {
      if (this.name) {
        var tmpList = this.rawList.filter(k => {
          return k.name.indexOf(this.name) > -1
        })
        this.handleList(tmpList)
      } else {
        this.handleList(this.rawList)
      }
    }
  },
  created() {
    var MyComponent = Vue.extend({
      template: '<div class="pos-f w20 ta-c r0 t0 b0 flex-center alphabet-list" style="top:80px;z-index:3000">\
          <ul class="">\
            <li v-for="i in list" :key="i.pinyin" v-text="i.pinyin" class="lh20 w20 bdr-50 cl-primary"  @click="handleLetterClick($event)"></li>\
          </ul>\
        </div>',
      props:{
        list:Array
      },
      created(){

      },
      methods:{
        handleLetterClick(e){
          if (e.target.innerText) {
            const element = document.getElementById(e.target.innerText);
            $(".grade-list").animate({scrollTop:$(element).offset().top + $(".grade-list").scrollTop()},100);
          }
        }
      }
    })
    component = new MyComponent({ el: document.createElement('div') })
    document.body.appendChild(component.$el)
    this.getList()
  },
  mounted() {
    // setPageTitle('客户管理');
  },
  beforeDestroy: function() {
    document.body.removeChild(component.$el)
  },
  methods: {
    handleLetterClick(e){
      if (e.target.innerText) {
        // 通过ref定位到指定DOM结构
        const element = this.$refs[e.target.innerText][0];
        this.letter = e.target.innerText;
        $(".grade-list").animate({scrollTop:$(element).offset().top + $(".grade-list").scrollTop()},100);
      }
    },
    onCancel(){

    },
    getList(){
      // this.handleList(this.rawList)
      // return
      Toast.loading({
        message: '加载中...',
        duration:0
      });
      customService.customerList({name:this.name}).then(res => {
        Toast.clear()
        this.loading = false;
        if(res.code == 1){
          this.rawList = res.object;
          this.handleList(this.rawList)
        } else {
          Toast(res.message)
        }
      })
    },
    go(j) {
      this.$emit("click-item",j)
      // if(this.type == 2){ //非车选择客户
      //   btPage.goBack({
      //     args:j
      //   })
      // } else {
      //   btPage.open({
      //     url: '/custom/custom_detail',
      //     container_style: 1,
      //     params:{
      //       id:j.id
      //     }
      //   })
      // }
    },
    handleList(rawList){
      var arr = [];
      rawList.sort(function(a,b) {
        if (a.firstWorld < b.firstWorld ) {
          return -1;
        }
        if (a.firstWorld > b.firstWorld ) {
          return 1;
        }
        return 0;
      })
      rawList.forEach(k => {
        var obj = {
          pinyin:k.firstWorld,
          list:[k]
        };
        var found = arr.find(k2 => k2.pinyin == k.firstWorld);
        if(found){
          found.list.push(k)
        } else {
          arr.push(obj)
        }
      })
      this.list = arr;
      Object.assign(component, {
        list:this.list
      });
    },
    call(j){
      wv.callUp(j.phone)
    }
  },
};
</script>
