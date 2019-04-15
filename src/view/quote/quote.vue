<template>
    <div class="quote">

        <div>
            <div class="banner pt10 pl15 pr15">
                <van-swipe :autoplay="3000" indicator-color="#fff">
                    <van-swipe-item v-for="(i, index) in bannerList" :key="index">
                        <img v-lazy="i.fileUrl" class="w-100" style="height:130px;"/>
                    </van-swipe-item>
                </van-swipe>
            </div>

            <div class="place pt10 pb10 mb10 plr15 bg-white">
                <div class="bg-white bdr5 plr12 info-shadow">
                    <div class="flex-center justify-sb h50 ft16 van-hairline--bottom" @click="showSite">
                        <span class="bd-left">投保城市</span>
                        <div class="flex-center">
                            <span class="cl-orange mr8">{{ activeArea[1].name }}</span>
                            <van-icon name="arrow-down" color="#CBCBCB"/>
                        </div>
                    </div>

                    <div class="mt10" v-if="products.length">
                        <van-checkbox-group v-model="product" @change="change">
                            <div class="flex-center justify-sb flex-w">
                                <div v-for="(i,index) in showProducts" class="mb12 bdr5 info-shadow p5 flex-center justify-sb compony" :key="index" @click="toggle(index)">
                                        <div class="of-hide bd-gray bdr-50 logo">
                                            <img :src="i.logo" v-show="i.logo" class="logo"/>
                                            <img src="~@/assets/icons/insurance-company.png"
                                                v-show="!i.logo" class="logo"/>
                                        </div>
                                        <p v-text="i.companyName" class="fz16 cl-black"></p>
                                        <van-checkbox :name="i.id" ref="checkboxes"/>
                                </div>
                            </div>
                        </van-checkbox-group>
                        <div class="h20 ta-c lh20" v-if="products.length > 4" @click="checkShowList">
                            <van-icon name="arrow-down" class="showMoreList" color="#CBCBCB" :style="{ transform: isShowPro ? 'rotate(-180deg)' : 'rotate(0deg)' }"/></div>
                        <div class="h50 flex-center justify-sb van-hairline--top">
                            <p class="cl-gray ft13 mr10 van-ellipsis"><i class="cl-orange">*</i> 仅支持9座以下的非运营私家车</p>
                            <van-button type="primary" class="h30 lh30 w100 bt-shadow p0" round
                                :disabled="loading || !checked" :loading="loading"
                                @click="quote" text="立即投保">
                            </van-button>
                        </div>
                    </div>
                    <div class="mt10 unList ta-c" v-else>
                        <img src="../../assets/images/img_empty_city@3x.png" width="140" height="111">
                        <p class="cl-gray mt12">该地区暂未开通服务，去其他地区报 价成功也可出单哦～</p>
                    </div>
                </div>
            </div>

            <div class="w-100 bg-white plr15 mt10 mb10 pb12" v-if="hotgood && hotgood.length == 4">
                <h3 class="pt10 pb10 ft17">保险特卖<span class="fw-n ml8 ft14 cl-gray">超值推荐</span></h3>
                <div class="flex-center" style="height: 1.68rem;">
                    <div class="flex-1 h-100 mr8 info-shadow" v-if="hotgood[0]" @click="goOrderDetail(hotgood[0])">
                        <img :src="hotgood[0].picUrl" class="w-100 h-100 bdr5">
                    </div>
                    <div class="w-60 h-100 flex-column">
                        <div class="w-100 h-50 info-shadow mb8" v-if="hotgood[1]"  @click="goOrderDetail(hotgood[1])">
                            <img :src="hotgood[1].picUrl" class="w-100 h-100 bdr5">
                        </div>
                        <div class="flex-center justify-sb h-50" v-if="hotgood[2]">
                            <div class="w-50 h-100 info-shadow mr8" v-if="hotgood[2]" @click="goOrderDetail(hotgood[2])">
                                <img :src="hotgood[2].picUrl" class="w-100 h-100 bdr5">
                            </div>
                            <div class="w-50 h-100 info-shadow" v-if="hotgood[3]"  @click="goOrderDetail(hotgood[3])">
                                <img :src="hotgood[3].picUrl" class="w-100 h-100 bdr5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-100 bg-white pb12 lists" v-if="goods.list.length">
            <div :class="sticky? 'sticky': 'normal'">
                <div class="good-title flex-center justify-sb van-hairline--bottom plr15 bg-white">
                    <div class="flex-center pt10 pb10 ft17">
                        <h3 class="mr35 ft17">产品列表</h3>
                        <div @click="selectShow" class="flex-center">
                            <span class="ft14 cl-gray mr4">全部</span>
                            <van-icon name="arrow-down" color="#CBCBCB"/>
                        </div>
                    </div>
                    <div class="cl-dgray showMore ft12 lh20"  @click="goList">更多</div>
                </div>
            </div>
            <div class="pl15 pr15" :style="{padding: sticky ? '48px': '0px'}">
                <div class="van-hairline--bottom flex-center pt12 pb10" v-for="(item, index) in goods.list" :key="index" @click="goOrderDetail(item)">
                    <div class="mr12">
                        <img :src="item.picUrl" height="90" width="90" class="bdr5">
                    </div>
                    <div class="flex-1">
                        <h3 class="ft16 mb5">{{ item.title }}</h3>
                        <p class="cl-gray ft12" v-for="(i, index) in item.mainPointList" :key="index">{{ i }}</p>
                        <div class="flex-center mt8 ft14 justify-sb">
                            <div class="cl-orange ft18"><span class="ft13">￥</span>{{ item.minPrice | currency2 }}<span class="ft13">起</span></div>
                            <p class="ft13" style="color:#ff8526;" v-if="item.rebatePointContent">推广费{{ item.rebatePointContent }}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 地区选择 -->
        <van-popup v-model="isShowSite" position="bottom" :overlay="true">
            <van-area :area-list="areaList" v-if="areaList" :loading="false" :height="'180'" :columns-num="2" title="选择城市"  @cancel="onCancel" @confirm="onConfirm" :value="code"/>
        </van-popup>

        <!-- 寿险标签选择 -->
        <van-popup v-model="select.show" position="top" :overlay="true">
            <div class="van-hairline--bottom good-title flex-center justify-sb plr15">
                <div class="flex-center pt10 pb10 ft17">
                    <h3 class="mr35 ft17">产品列表</h3>
                    <div class="flex-center"  @click="selectShow">
                        <span class="ft14 cl-gray mr4">全部</span>
                        <van-icon name="arrow-up" color="#CBCBCB"/>
                    </div>
                </div>
                <div class="cl-dgray showMore ft12 lh20" @click="goList">更多</div>
            </div>
            <div class="tags flex-center flex-w">
                <div v-for="(item, index) in tags" :key="index" class="bg bdr5 tag lh30 ta-c w-30" @click="selectTag(item,index)">{{ item.name }}</div>
            </div>
        </van-popup>

        <footerBar path="quote"></footerBar>
    </div>
</template>
<script>
// import wx from 'weixin-js-sdk'
import popupSelect from '@/components/PopupSelect.vue';
import footerBar from '@/components/Footer';
import quoteService from '@/api/quoteService';
import lifeService from '@/api/lifeService';
import loginService from '@/api/loginService.js';
// loginService
import {getLocation,WechatRegistrar,wxShare} from '@/lib/wechat';
export default {
    name: 'quote',
    data() {
        return {
            loading:false,
            isLogin:false,
            checked:true,
            unreadNum:0,
            areaList: null, //省市json
            maxProductsNum:3,
            activeArea: [{code:'330000', name: '浙江省' }, {code:'330100', name: '杭州市' }],
            // bannner在这里配
            bannerList: [{
              fileID: 233,
              fileUrl: 'http://cdnpubimg.bz-ins.com/PUBLIC/INSURANCE_PUBLIC/2019-03-25/4d641834-adf9-46b7-b812-b88d1e6f716f.png',
              id: 1,
              type: 0,
              target: '/activity/page/tax_quiz_game/hot.html'
            }],

            loadingFinish:false,
            product: [],
            products: [],
            showProducts: [], // 展示的投保列表
            baseProducts: [], // 基础的投标列表
            isShowPro: false,
            area: '',
            orderList: '',
            isShowSite: false,
            count:1,
            hotgood: [], // 热卖商品
            goods: {
                list: [],
                type: 1,
                text: '全部',
                size: 5,
                index: 1
            },
            select: {
                show: false
            },
            tags: [],
            tagId: "",
            sticky: false,
            isLogined: false,
        };
    },
    computed: {
        code() {
            if(this.activeArea[1].code){
                return '' + this.activeArea[1].code;
            } else {
                return '';
            }
        }
    },
    mounted(){
        setPageTitle('询价');
        window.addEventListener('scroll', this.viewScroll, false)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.viewScroll, false)
        this.sticky = false
    },
    deactivated() {
        window.removeEventListener('scroll', this.viewScroll, false)
        this.sticky = false
    },
    created() {
        var that = this;
        // quoteService.bannerQuery().then((res) => {
        //     if(res.code == 1){
        //         this.bannerList = res.object||[];
        //     }
        // });

        if(Util.getLocalData("activeArea")){
            this.activeArea = Util.getLocalData("activeArea");
        } else {

        }
        if (Util.getCookie("userInfo")) {
          this.isLogined = true;
        }

        // this.getProducts(this.activeArea);
        // 获取可投保城市
        Toast.loading({
            duration:0,
            forbidClick:false,
            message: '努力加载中..'
        });
        quoteService.area().then((res) => {
            if(res.code == 1){
                that.areaList = res.object;
                if(Util.userAgentType() == "wechat"){
                  var btWechat = new WechatRegistrar();
                  btWechat.setConfig().then(()=>{
                      setCity()
                  }).catch(()=>{
                    this.getProducts(this.activeArea);
                  });
                } else {
                  setCity()
                }
            } else {
              Toast.clear();
            }
        });
        this.hotGoods()
        this.goodsList()
        this.getLifeTags()
        // return
        function setCity(){
            getLocation().then((obj) => {
                Toast.clear();
                var activeArea = [{
                  code:obj.provinceCode, name: obj.provinceName
                }, {
                    code:obj.cityCode, name: obj.cityName
                }]
                let isvalidAddress = false;
                Object.keys(that.areaList.city_list).forEach(function(k,v){
                    if(k == obj.cityCode){
                        isvalidAddress = true;
                    }
                })
                if(isvalidAddress){//有效地址
                    if(Util.getLocalData("positionArea")){//有历史地址
                        if(obj.cityCode == Util.getLocalData("positionArea")[1].code ||
                        obj.cityCode == Util.getLocalData("activeArea")[1].code){
                          Util.setLocalData("positionArea",activeArea);
                          that.getProducts(that.activeArea);
                        } else {
                          Dialog.confirm({
                            title: '定位到您在 ' + obj.cityName,
                            message: '是否切换至该城市？'
                          }).then(() => {
                            Util.setLocalData("positionArea",activeArea);
                            Util.setLocalData("activeArea",activeArea);
                            that.activeArea = activeArea;
                            that.getProducts(activeArea);
                          }).catch(() => {
                            Util.setLocalData("positionArea",activeArea);
                            that.getProducts(that.activeArea);
                          });
                        }
                    } else {//无历史地址，首次进入
                      Util.setLocalData("positionArea",activeArea);
                      Util.setLocalData("activeArea",activeArea);
                      that.activeArea = activeArea;
                      that.getProducts(activeArea);
                    }
                } else {//无效地址
                  if(Util.getLocalData("activeArea")){//已经有选择过地址，直接用之前选择过的地址

                  } else {
                      var cityCode = ("" + obj.cityCode).substr(0,2) + "0100";
                      var hasSh = false;
                      Object.keys(that.areaList.city_list).forEach(function(k,v){
                          if(k == cityCode){
                              that.activeArea = [{
                                code:obj.provinceCode, name: obj.provinceName
                              }, {
                                  code:parseInt(cityCode), name: that.areaList.city_list[cityCode]
                              }];
                              hasSh = true;
                          }
                      })
                      Util.setLocalData("positionArea",that.activeArea);
                      Util.setLocalData("activeArea",that.activeArea);
                  }
                  that.getProducts(that.activeArea);
                }
            }).catch(()=>{
              that.getProducts(that.activeArea);
            })
        }
    },
    methods: {
        change(v){
          if(this.product.length > this.maxProductsNum){
            this.product.splice(this.maxProductsNum,1)
            Toast("最多选"+this.maxProductsNum+"个同时报价")
          } else {
            // this.$router.replace({ name: 'quote', query:{
            //     cids:JSON.stringify(this.product),
            //     cityCode:this.activeArea[1].code
            // }});
          }
        },
        toggle(index) {
          this.$refs.checkboxes[index].toggle();
        },
        quote(){
            if(!this.product.length ){
                Toast("请选择保险公司")
                return
            }
            // this.$router.push({ name: 'carPic', query:{
            //     cids:JSON.stringify(this.product),
            //     cityCode:this.activeArea[1].code
            // }});
            btPage.open({
              url: '/quote/car_pic',
              container_style:1,
              params:{
                cids:JSON.stringify(this.product),
                cityCode:this.activeArea[1].code
              }
            })
        },
        choose(i) {
            this.product = i;
        },
        showSite() {
            this.isShowSite = true;
        },
        onCancel() {
            this.isShowSite = false;
        },
        getProducts(value){

            this.activeArea = value;
            this.product = [];
            this.loadingFinish = false;
            Toast.loading({
                duration:0,
                forbidClick:false,
                message: '加载中..'
            });
            let cityCode = this.activeArea[1].code;
            quoteService.orderCompany({citycode:cityCode}).then((res) => {
                Toast.clear();
                this.loadingFinish = true;
                if(res.code == 1){
                    this.products = res.object.companys||[];
                    this.maxProductsNum = res.object.selectCount || 1;
                    this.handleProducts()
                } else if(res.code === 0){
                    Toast(res.message)
                    this.products = res.object||[];
                } else {
                  Toast(res.message)
                }
            });
        },
        handleProducts() { // 处理展示列表
            let list = Object.assign([] ,this.products)
            var showList
            if (list.length >= 4) {
                showList = list.splice(0, 4)
            } else {
                showList = list
            }
            this.showProducts = showList
            this.baseProducts = showList

        },
        onConfirm(value) {
            this.isShowSite = false;
            if(this.activeArea[1].code ==  value[1].code){
                return
            }
            this.getProducts(value);
            Util.setLocalData("activeArea",value);
        },
        goProtocal(){
          btPage.open({
            url: '/common/agreement',
            container_style:1,
            params:{
              id:0
            }
          })
        },
        getNotice(){
          quoteService.noticeInfo().then((res) => {
              if(res.code == 1 && res.object){
                  this.unreadNum = res.object.unreadNum;
                  if(this.unreadNum){
                    this.setHead(1)
                  } else {
                    this.setHead()
                  }
              }
          });
        },
        setHead(isActive){
          var self = this;
          this.$store.dispatch("setHead", {
            menuContent:`<div class="menu notice${isActive?'-active':''}"></div>`,
            needBack:false,
            menuClick:()=>{
              btPage.open({
                url: '/notice',
                container_style:1,
                jsOnResume:()=>{
                  this.getNotice();
                }
              })
            }
          });
        },
        checkShowList() {  // 展示更多投保公司
            this.isShowPro = !this.isShowPro
            if (this.isShowPro) {
                this.showProducts = this.products
            } else {
                this.showProducts = this.baseProducts
            }
        },
        hotGoods() { // 获取热卖商品
            lifeService.hotGoods()
                .then((res) => {
                    if (res.code == 1) {
                        this.hotgood = res.object || []
                    } else {
                        Toast(res.message)
                    }
                })
        },
        goodsList() { // 获取产品列表
            let param = {
                tagId: this.tagId,
                pageSize: 6,
                pageIndex: 1
            }
            lifeService.getGoodsList(param)
                .then((res) => {
                    if (res.code) {
                        this.goods.list = res.object || []
                        this.select.show = false
                    } else {
                        Toast(res.message)
                    }
                })
        },
        selectShow() { // 开启选择产品类型
            this.select.show = !this.select.show
            this.sticky = false
        },
        getLifeTags() { // 获取寿险tags
            lifeService.getTags()
                .then((res) => {
                    if (res.code == 1) {
                        this.tags = res.object
                    } else {
                        Toast(res.message)
                    }
                })
        },
        selectTag(obj, index) {
            this.tagId = obj.id
            btPage.open({
                url: '/life/life_product_list',
                params: { tag: index },
                container_style: 1
            })
        },
        goOrderDetail(obj) {
            if (obj.jumpType) {
              if (!this.isLogined) {
                btPage.open({
                  url: '/login',
                  enter_animate:2,
                  type:3,
                  container_style:1
                })
              } else {
                location.href = obj.jumpAddress;
              }
              return;
            }
            btPage.open({
                url: '/life/life_detail',
                container_style:1,
                params:{ id: obj.id, type: 'normal' }
            })
        },
        goList() {
            btPage.open({
                url: '/life/life_product_list',
                params: { tag: 0 },
                container_style: 1
            })
        },
        viewScroll() {
            let viewOffsetTop = document.querySelector('.lists')
            let top = viewOffsetTop ? viewOffsetTop.offsetTop: ""
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTop >= top) {
				this.sticky = true
            } else {
                this.sticky = false
            }
        }
    },
    activated(){
        window.addEventListener('scroll', this.viewScroll, false)
      setPageTitle('询价');
      wv.customBackAction(()=> {
        if(this.count == 2){
          btPage.goBack(100);
        } else {
          Toast("再按返回退出")
          this.count++;
          setTimeout(()=>{
            this.count = 1;
          },2000)
        }
      });
      wv.setWebViewInfo({
        wvBackDisable:1
      })
      if(GConfig.isInApp){
        this.getNotice();
        this.setHead()
      }
      // wv.addNotifactionListener("viewDidAppear",(res)=>{
      //   alert(1111)
      // })
    },
    components: {
        popupSelect,
        footerBar
    }
};
</script>
<style lang="less" scope>
.quote {
    .banner {
        height: 140px;
        background: linear-gradient(#FC6B47 105px, white 35px);
        .van-swipe {
            width: 100%;
            height: 130px;
            border-radius: 6px;
        }
    }
    .bd-left {
        position: relative;
        padding-left: 8px;
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            height: 14px;
            width: 3px;
            background-color: #FC6B47;
        }
    }
    .bd-gray {
        border: 1px solid #e5e5e5;
    }
    .info-shadow {
        box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.08);
    }
    .bt-shadow {
        box-shadow: 0 2px 4px 0px rgba(252,107,71, 0.5);
    }
    .showMore {
        border: 1px solid #bcbcbc;
        padding: 0 12px;
        border-radius: 12px;
    }
    .compony {
        width: 49%;
        .logo {
            height: 28px;
            width: 28px;
            box-sizing: content-box;
            @media screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2){
                height: 0.3rem;
                width: 0.3rem;
            }
        }
        .fz16 {
            font-size: 16px;
            text-overflow: ellipsis;
            white-space: nowrap;
            @media screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2){
                font-size: 0.154rem;
            }
        }
    }
    .unList {
        padding: 14px 60px;
    }

    .normal {
        position: static;
    }
    .sticky {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }
    .showMoreList {
        transition: transform .3s ease
    }
    .tags {
        padding: 0 15px 15px 15px;
        .tag {
            margin-left: 5%;
            margin-top: 15px;
            height: 30px;
        }
        & :nth-child(3n - 2) {
            margin-left: 0;
        }
    }
}
</style>

