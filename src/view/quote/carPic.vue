
<template>
  <div>
    <van-notice-bar
      text="*身份证明可使用身份证（正反面）或单位营业执照"
      color="#FC6B47"
      background="#FDE7D8"
    />
    <div class="bg-white pb5 pt10 plr10 mb10">
      <p class="lh30 cl-gray">正常车：行驶本(正副本)、身份证明;<br>过户车：行驶本(正副本)/登记证书、身份证明;<br>新车：合格证/登记证书、身份证明</p>
    </div>
    <div class="bg-white">
      <span class="tit-tag ml10 lh40 ft16 fw-b">请上传清晰证件<span class="cl-orange ft12 fw-n">（资料越完整报价越快）</span></span>
      <div class="ml10 mt10">
        <ul class="clearfix pics">
          <!-- <li class="w-33 mb10 pr10 fl" v-for="(i,index) in hasUploadPics" :key="index">
            <div class="w-100 h100 bg-white pos-r">
              <img :src="i.fileUrl" class="thumb-img" v-show="i.fileUrl">
              <i class="pos-a icon-delete"  @click="deletePic(index)"></i>
            </div>
          </li> -->
          <li class="w-33 mb10 pr10 fl" v-show="pics.length<20">
            <div class="w-100 h100 bg-white van-hairline--surround">
              <upload :pics="pics"  class="wh-100 flex-center ta-c" :max="20">
                <img src="~@/assets/icons/add@3x.png" class="w40 mt30 center-block">
                <!-- <p class="cl-gray mt10">添加图片</p> -->
              </upload>
            </div>
          </li>
          <li class="w-33 mb10 pr10 fl" v-for="(i,index) in pics" :key="index">
            <div class="w-100 h100 bg-white pos-r">
              <img :src="i.content" class="thumb-img" v-show="i.content" @click="imagePreview(index)">
              <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="i.content" @click="deletePic(index)">
                  <i class="icon-delete"></i>
              </div>
              <!-- <i class="pos-a icon-delete" v-show="i.content" @click="deletePic(index)"></i> -->
              <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                   v-show="i.content && i.status == 3">
                <span>上传失败，请删除重新上传</span>
              </div>
              <div class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5"
                   v-show="i.percent && i.percent!=100"
                   style="min-height:20px;"
                   :style="{'height':100-i.percent+'%'}">
                <span class="flex-1" v-show="i && i.percent">{{i.percent+"%"}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="p20">
      {{pics[0] && pics[0].result.id}}
    </div> -->
    <div class="h30 mt5">
      <div class="lh30 fr cl-orange mr10" @click="goSample">不会拍？查看示例图</div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" round :block="true" :disabled="!!!pics.length" :loading="loading" @click="next" text="下一步"></van-button>
      </div>
    </div>
    <!-- <div class="" v-if="a">

    </div> -->
    <van-popup v-model="isShowSample" :overlay="true" class="w-80">
        <div class="">
          <p class="lh22 mt16 mb8 ft16 ta-c">证件照上传规范</p>
          <p class="cl-orange pl25 pr25 pb14">确保信息拍摄清楚，避免强光下拍摄，保证红款内信息清晰可见</p>
          <ul class="pl25 ">
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/1@2x.png" class="w-100">
              <p class="ta-c lh20">身份证正面</p>
            </li>
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/2@2x.png" class="w-100">
              <p class="ta-c lh20">身份证背面</p>
            </li>
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/3@2x.png" class="w-100">
              <p class="ta-c lh20">行驶证正面</p>
            </li>
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/4@2x.png" class="w-100">
              <p class="ta-c lh20">行驶证背面</p>
            </li>
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/6@2x.png" class="w-100">
              <p class="ta-c lh20">登记证书</p>
            </li>
            <li class="fl w-50 pr25 mb14">
              <img src="~@/assets/images/sample/7@2x.png" class="w-100">
              <p class="ta-c lh20">暂住证</p>
            </li>
          </ul>
          <div class="ml25 mr25 pt30 pb16">
            <van-button type="primary" class="" round :block="true" @click="isShowSample=false" text="知道了"></van-button>
          </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
  import upload from '@/components/Upload/index.vue'
  import quoteService from '@/api/quoteService'
  export default {
    name: 'carPic',
    data () {
      return {
          loading:false,
          isShowSample:true,
          cids:'',
          citycode:'',
          hasUploadPics:[],
          pics:[],
      }
    },
    created(){

        this.cids = this.$route.query.cids;
        this.cityCode = this.$route.query.cityCode;
        // wv.addNotifactionListener("viewWillDisappear",()=>{
        //   var pics = [];
        //   this.pics.forEach(function(k,v){
        //       if(k.result && k.result.viewPath){
        //         pics.push({
        //           content:k.result.viewPath,
        //           result:k.result
        //         })
        //       }
        //   })
        //   if(pics.length){
        //     Util.setLocalData("hasUploadPics",pics);
        //   }
        // })
        if(GConfig.isInApp){
          this.pics = Util.getLocalData("hasUploadPics") || [];
        } else {
          this.pics = Util.getSessionData("hasUploadPics") || [];
        }

        if(Util.getLocalData("hasShowSample")){
          this.isShowSample = false
        } else {
          this.isShowSample = true
          Util.setLocalData("hasShowSample",1);
        }
        // alert(JSON.stringify(this.pics))
    },
    methods:{
      goSample(){
        this.isShowSample = true
        // this.$router.push({name:'sample'})
      },
      imagePreview(index){

          var arr = [];
          this.pics.forEach(function(k,v){
            arr.push(k.content)
          })
          ImagePreview({
            images:arr,
            startPosition:index,
            onClose() {
              // do something
            }
          })
      },
      onRead(files){
        return
        // alert(JSON.stringify(files))
          this.pics = this.pics.concat(files);
          // this.max = 9 - this.pics.length;
          if(this.pics.length>20){
              this.pics.length = 20;
          }
      },
      deletePic(index){
          this.pics.splice(index,1);
      },
      next(){

        var pics = [];
        this.pics.forEach(function(k,v){
            if(k.result && k.result.viewPath){
              pics.push({
                content:k.result.viewPath,
                result:k.result
              })
            }
        })
        // alert(JSON.stringify(pics))
        // return
        if(!pics.length){
           Toast("请上传证件")
           return
        }

        // this.$router.push({name:'chooseInsType', query:{
        //     cids: this.cids,
        //     cityCode:this.cityCode,
        // }})
        if(GConfig.isInApp){
          Util.setLocalData("hasUploadPics",pics);
        }
        btPage.open({
          url: '/quote/choose_ins_type',
          container_style:1,
          params:{
            cids:this.cids,
            cityCode:this.cityCode
          }
        })
      },
    },
    beforeRouteLeave(to, from, next) {
        var pics = [];
        this.pics.forEach(function(k,v){
            if(k.result && k.result.viewPath){
              pics.push({
                content:k.result.viewPath,
                result:k.result
              })
            }
        })
        if(pics.length){
          Util.setSessionData("hasUploadPics",pics);
        }
        next()
    },
    activated(){
      // if(!Util.getSessionData("hasUploadPics")){
      //   this.pics = [];
      // }
    },
    mounted() {
      setPageTitle('上传车辆信息');
    },
    components :{
        upload
    }
  }
</script>
