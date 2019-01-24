
<template>
    <div class="quote-box">
        <div class="banner" style="height:1.5rem">
            <!--<swiper :options="swiperOption" ref="mySwiper" v-if="swiperSlides.length">-->
                <!--<swiper-slide v-for="(slide, index) in swiperSlides" :key="index">-->
                    <!--<img :src="slide" width="100%" style="object-fit: cover;">-->
                <!--</swiper-slide>-->
                <!--<div class="swiper-pagination" slot="pagination"></div>-->
            <!--</swiper>-->
            <van-swipe :autoplay="3000" class="w-100">
                <van-swipe-item v-for="(i, index) in bannerList" :key="index" class="w-100">
                    <img v-lazy="i.fileUrl" class="" style="object-fit:cover;height:1.5rem;width:3.75rem"/>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="ml15 mr15 pos-r bdr5 bg-white" style="margin-top:-.48rem">
            <div class="flex-center lh55 plr15 ft16 van-hairline--bottom" @click="showSite">
              <div class="flex-1">
                <span>投保城市</span>
                <span class="cl-orange ml15">{{activeArea[1].name}}</span>
              </div>
              <span class="icon-right"></span>
            </div>
            <div class="">
                <div class="lh40 plr15 cl-gray">
                    <span>选择保险公司<span class="ml5">(最多选{{maxProductsNum}}个同时报价)</span></span>
                </div>
                <div class="ft16">
                    <!-- <ul class="">
                        <li class="" v-for="(item,index) in products" :key="index">
                            <div class="van-hairline--bottom bdr10 h50 flex-center plr10" @click="choose(item)">
                                <div class="mlr5 w40 h40">
                                    <img :src="item.logo" v-show="item.logo" class="w-100 h-100">
                                    <img src="~@/assets/images/insurance-company.png" v-show="!item.logo" class="w-100 h-100">
                                </div>
                                <div class="">
                                    <span v-text="item.name" class="cl-orange"></span>
                                    <p v-if="item.specialRemark" v-text="item.specialRemark" class="ft12 mt5"></p>
                                </div>
                                <div class="pos-a r0 b0 mb5 mr5" v-show="item.id == product.id">
                                    <img src="~@/assets/icons/elect.png" width="14">
                                </div>
                            </div>
                        </li>
                    </ul> -->
                    <van-checkbox-group v-model="product" @change="change">
                      <van-cell-group>
                        <van-cell
                          v-for="(i,index) in products"
                          clickable
                          :key="index"
                          @click="toggle(index)"
                        >
                          <div class="h55 plr15 flex-center">
                              <div class="mr10 w30 h30 of-hide">
                                  <img :src="i.logo" v-show="i.logo" class="w-100 h-100 bdr-50" style="border:1px solid #eee;">
                                  <img src="~@/assets/icons/insurance-company.png" v-show="!i.logo" class="w-100 h-100  bdr-50">
                              </div>
                              <div class="flex-1">
                                  <p v-text="i.companyName" class="ft16 lh22"></p>
                                  <p v-if="i.companyCode" v-text="'[产品码：' + i.companyCode + ']'" class="ft13 cl-orange lh18"></p>
                              </div>
                              <van-checkbox :name="i.id" ref="checkboxes"/>
                          </div>
                        </van-cell>
                      </van-cell-group>
                    </van-checkbox-group>
                    <div class="plr15 ta-c pt20 pb20" v-if="!products.length && loadingFinish">
                      <img src="~@/assets/images/smile@2x.png" width="143">
                      <div class="cl-gray ft13 w200 mc mt10">该地区暂未开通服务，去其它地区报价成功也可出单哦~</div>
                    </div>
                    <div class="plr15 cl-gray ft14 lh20 mt15">注：仅支持9座以下的非运营私家车</div>
                    <div class="plr15 pb10 pt17">
                      <van-button type="primary" :block="true" round :disabled="loading || !checked" :loading="loading" @click="quote" text="下一步"></van-button>
                      <div class="mt15 ft12 cl-gray flex-center">
                        <van-checkbox v-model="checked" shape="square" class="mr5">
                          <i class="check-box-bz-gray" slot="icon" slot-scope="obj" :class="{'active':obj.checked}"></i>
                        </van-checkbox>
                        <span class="" @click="checked = !checked">我已经阅读并同意</span>
                        <span class="cl-orange" @click="goProtocal">车险服务协议</span>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white plr15 mb10 mt10">
            <div class="pos-r h35 flex-center pt10 plr15">
                <div class="flex-1 h1 bg-lgray"></div>
                <span class="plr10">合作伙伴</span>
                <div class="flex-1 h1 bg-lgray"></div>
            </div>
            <div class="mt10 pb5 ta-c pl2 pr2">
                <img src="http://pubimg.bz-ins.com/PUBLIC/h5/static/miniprogram/images/partner@3x.png" class="w-100">
            </div>
        </div>
        <!-- 地区选择 -->
        <van-popup v-model="isShowSite" position="bottom" :overlay="true">
            <van-area :area-list="areaList" :loading="false" :height="'180'" :columns-num="2" title="选择城市"  @cancel="onCancel" @confirm="onConfirm" :value="code"/>
        </van-popup>
        <footerBar path="quote"></footerBar>
    </div>
</template>

<script>
// import wx from 'weixin-js-sdk'
import popupSelect from '@/components/PopupSelect.vue';
import footerBar from '@/components/Footer';
import quoteService from '@/api/quoteService';
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
            // icon: {
            //   normal: '//img.yzcdn.cn/icon-normal.png',
            //   active: '//img.yzcdn.cn/icon-active.png'
            // },
            areaList: null, //省市json
            maxProductsNum:3,
            activeArea: [{code:'330000', name: '浙江省' }, {code:'330100', name: '杭州市' }],
            bannerList: [],
            loadingFinish:false,
            product: [],
            products: [],
            area: '',
            orderList: '',
            isShowSite: false,
            count:1,
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

    },
    created() {
        var that = this;
        quoteService.bannerQuery().then((res) => {
            if(res.code == 1){
                this.bannerList = res.object||[];
            }
        });
        if(Util.getLocalData("activeArea")){
            this.activeArea = Util.getLocalData("activeArea");
        }

        this.getProducts(this.activeArea);
        // return
        function setCity(){
            getLocation().then((obj) => {
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

                            that.activeArea = Util.getLocalData("activeArea");
                            Util.setLocalData("positionArea",activeArea);
                            // that.getProducts(that.activeArea);
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
                            that.activeArea = Util.getLocalData("activeArea");
                            // that.getProducts(that.activeArea);
                          });
                        }
                    } else {//无历史地址，首次进入
                      Util.setLocalData("positionArea",activeArea);
                      Util.setLocalData("activeArea",activeArea);
                      that.activeArea = activeArea;
                      // that.getProducts(activeArea);
                    }
                } else {//无效地址
                  if(Util.getLocalData("activeArea")){

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
                      if(hasSh){
                        that.getProducts(that.activeArea);
                      }

                  }
                  // that.getProducts(that.activeArea);
                }
            }, (err) => {
                // that.getProducts(that.activeArea);
            })
        }

        // 获取可投保城市
        quoteService.area().then((res) => {
            if(res.code == 1){
                that.areaList = res.object;
                if(Util.userAgentType() == "wechat"){
                  var btWechat = new WechatRegistrar();
                  btWechat.setConfig().then(function(){
                      setCity()
                  });
                } else {
                  setCity()
                }
            }
        });
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
                } else if(res.code === 0){
                    Toast(res.message)
                    this.products = res.object||[];
                } else {
                  Toast(res.message)
                }
            });
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
        }
    },
    activated(){
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
<style lang="less">
.quote-box{
  .van-cell{
    padding:0;
  }
  .quote-checked{
    .van-checkbox__icon{
      line-height:12px;
      // margin-top:2px;
    }
    .van-checkbox__icon .van-icon{
      width:12px;
      height:12px;
    }
  }

}
</style>

