<template>
  <div class="img-upload-wrapper">
    <ul class="clearfix pics">
      <li class="w-33 mb10 pr10 fl" v-show="isAllowAdd && pics.length<max">
        <div class="w-100 h105 bg-white van-hairline--surround">
          <upload :pics="pics"  class="wh-100 flex-center ta-c" :max="max" @upload-success="uploadSuccess">
            <img src="~@/assets/icons/add@3x.png" class="w25 mt35 center-block">
             <p class="add-desc" v-if="addDesc">{{ addDesc }}</p>
          </upload>
        </div>
      </li>
      <li class="w-33 mb10 pr10 fl" v-for="(i,index) in pics" :key="index">
        <div class="w-100 h105 bg-white pos-r">
          <img :src="i.content" class="thumb-img" v-show="i.content" @click="imagePreview(index)">
          <div class="pos-a icon-delete-box w30 h30 ta-r"
               v-show="isAllowDelete && i.content"
               @click="deletePic(index)">
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
</template>

<script>
import upload from '@/components/Upload/index.vue'
export default {
  name: 'imgUpload',
  components: { upload },
  model: {
    prop: 'picList',
    event: 'update'
  },
  props: {
    isAllowAdd: { // 是否允许新增图片
      type: Boolean,
      default() {
        return true;
      }
    },
    isAllowDelete: { // 是否允许删除图片
      type: Boolean,
      default() {
        return true;
      }
    },
    isAllowPreview: { // 是否允许预览图片
      type: Boolean,
      default() {
        return true;
      }
    },
    max: { // 最大照片数
      type: Number,
      default: function () {
        return 20
      }
    },
    picList: { // 照片数组，格式参照注释
      type: Array,
      default() {
        return [
          // {
          //   content: 'imgurl',
          //   file: File,
          //   percent: 0,
          //   result: {
          //     id: 'imgId',
          //     viewPath: 'imgUrl'
          //   },
          //   status: 2
          // }
        ]
      }
    },
    addDesc: { // 添加说明
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      pics: []
    };
  },
  // watch: {
  //   pics: function () {
  //     this.$emit('update', this.pics);
  //   }
  // },
  methods: {
    uploadSuccess() {
      // alert('upload-success');
      this.$emit('update', this.pics);
      this.$emit('imgAdd');
    },
    imagePreview(index){
      if (!this.isAllowPreview) return;
      let arr = [];
      this.pics.forEach(function(k,v){
        arr.push(k.content)
      });
      ImagePreview({
        images:arr,
        startPosition:index,
        onClose() {
          // do something
        }
      })
    },
    deletePic(index){
      this.pics.splice(index,1);
      this.$emit('update', this.pics);
      this.$emit('imgDelete');
    }
  },
  created() {
    this.pics = this.picList;
  }
};
</script>

<style scoped lang="less">
  .img-upload-wrapper {
    .h105 {
      height: 105px;
    }
    .add-desc {
      display: inline-block;
      margin: 20px auto 0;
      height: 20px;
      border-radius: 13px;
      background: rgba(0, 0, 0, 0.15);
      padding: 2px 8px;
      font-size: 11px;
      color: #fff;
      line-height: 16px;
    }
  }
</style>
