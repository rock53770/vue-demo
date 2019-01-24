
<template>
  <div>
    <van-notice-bar
      text="*身份证明可使用身份证（正反面）或单位营业执照"
      color="#FC6B47"
      background="#FDE7D8"
    />
    <div class="bg-white">
      <span class="tit-tag ml10 lh40 ft14">请上传清晰证件<span class="cl-orange ft12">（资料越完整报价越快）</span></span>
      <div class="ml10 mt10">
        <ul class="clearfix pics">
          <!-- <li class="w-33 mb10 pr10 fl" v-for="(i,index) in hasUploadPics" :key="index">
            <div class="w-100 h100 bg-white pos-r">
              <img :src="i.fileUrl" class="thumb-img" v-show="i.fileUrl">
              <i class="pos-a icon-delete"  @click="deletePic(index)"></i>
            </div>
          </li> -->
          <li class="w-33 mb10 pr10 fl" v-for="(i,index) in pics" :key="index">
            <div class="w-100 h100 bg-white pos-r">
              <img :src="i.content" class="thumb-img" v-show="i.content" @click="imagePreview(index)">
              <i class="pos-a icon-delete" v-show="i.content" @click="deletePic(index)"></i>
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
          <li class="w-33 mb10 pr10 fl" v-show="pics.length<20">
            <div class="w-100 h100 bg-white van-hairline--surround">
              <upload v-on:after-select="onRead" class="wh-100 flex-center ta-c" :multiple="true">
                <img src="~@/assets/icons/add@2x.png" class="w40 mt15 center-block">
                <p class="cl-gray mt10">添加图片</p>
              </upload>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" :block="true" :disabled="!!!pics.length" :loading="loading" @click="next" text="下一步"></van-button>
      </div>
    </div>
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
          cids:'',
          citycode:'',
          hasUploadPics:[],
          pics:[],
      }
    },
    created(){
        this.cids = this.$route.query.cids;
        this.cityCode = this.$route.query.cityCode;
        this.pics = Util.getSessionData("hasUploadPics") || [];
    },
    methods:{
      goSample(){
        this.$router.push({name:'sample'})
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
          this.pics = this.pics.concat(files);
          if(this.pics.length>20){
              this.pics.length = 20;
          }
      },
      deletePic(index){
          this.pics.splice(index,1);
      },
      next(){

        // var pics = [];
        // this.pics.forEach(function(k,v){
        //     if(k.result && k.result.viewPath){
        //       pics.push({
        //         content:k.result.viewPath,
        //         result:k.result
        //       })
        //     }
        // })
        if(!pics.length){
           Toast("请上传证件")
           return
        }
      },
    },
    mounted() {
      setPageTitle('上传');
    },
    components :{
        upload
    }
  }
</script>
