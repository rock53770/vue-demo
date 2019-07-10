<template>
  <div class="">
    <div>
      <form action="/">
        <van-search
          v-model="name"
          placeholder="请输入搜索关键词"
          @search="onSearch"
        />
      </form>
    </div>
    <div class="ml12 mr23" v-if="list.length && !loading">
      <div v-for="(i,index) in list" :key="index">
        <p v-text="i.pinyin" class="lh18 ft8 pb6 pt10" :ref="i.pinyin"></p>
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
    <div class="pos-f w20 ta-c r0 t0 b0 flex-center" style="top:80px">
      <ul class="">
        <li v-for="i in list" :key="i.pinyin" v-text="i.pinyin" class="lh20 w20 bdr-50 cl-primary" :class="{'bg-primary cl-white':letter == i.pinyin && 0}" @click="handleLetterClick"></li>
      </ul>
    </div>
    <div class="pos-f r0 mr20" style="bottom:80px">
     <div class="w40 icon-add2" @click="go()"></div>
    </div>
  </div>
</template>

<script>
import customService from '@/api/customService'
export default {
  name: 'customList',
  data() {
    return {
      id: null,
      name:'',
      type:1,
      list:[],
      alphabetList:[],
      letter:'',
      loading:true,
      rawList:[],
      rawList1:[{
        id:1,
        name:'李克勤',
        phone:18217065902,
        firstWorld:'L'
      },{
        id:2,
        name:'张三',
        phone:18217065902,
        firstWorld:'Z'
      },{
        id:3,
        name:'李克勤1',
        phone:18217065902,
        firstWorld:'L'
      },{
        id:4,
        name:'张三2',
        phone:18217065902,
        firstWorld:'Z'
      },{
        id:5,
        name:'李克勤4',
        phone:18217065902,
        firstWorld:'L'
      },{
        id:6,
        name:'王五',
        phone:18217065902,
        firstWorld:'W'
      },{
        id:4,
        name:'张三3',
        phone:18217065902,
        firstWorld:'Z'
      },{
        id:5,
        name:'李克勤2',
        phone:18217065902,
        firstWorld:'L'
      },{
        id:6,
        name:'王五3',
        phone:18217065902,
        firstWorld:'Z'
      },{
        id:6,
        name:'张',
        phone:18217065902,
        firstWorld:'Z'
      }],
    };
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
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.getList()
  },
  mounted() {
    setPageTitle('客户管理');
  },
  methods: {
    handleLetterClick(e){
      if (e.target.innerText) {
        // 通过ref定位到指定DOM结构
        const element = this.$refs[e.target.innerText][0];
        this.letter = e.target.innerText;
        $("html,body").animate({scrollTop:$(element).offset().top},100);
        // 将element传递后进行区块的滚动
        // this.scroll.scrollToElement(element)
      }
    },
    onSearch(){
      // this.getList()
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
      if(this.type == 2){ //非车选择客户
        btPage.goBack({
          args:j
        })
      } else {
        if(j && j.id){
          btPage.open({
            url: '/custom/custom_detail',
            container_style: 1,
            params:{
              id:j.id
            }
          })
        } else {
          btPage.open({
            url: '/custom/custom_edit',
            container_style: 1,
          })
        }

      }
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
      this.list = arr
    },
    call(j){
      wv.callUp(j.phone)
    }
  },
};
</script>
