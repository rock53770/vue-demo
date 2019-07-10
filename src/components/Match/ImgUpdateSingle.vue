<template>
  <!-- 单图更新 -->
  <div class="img-update-single-wrapper">
    <div class="clearfix pics">
      <div class="w-100 mb10 pr10 fl" v-if="!disable">
        <div class="w-100 h105 bg-white pos-r van-hairline--surround">
          <upload :pics="pics"  class="wh-100 flex-center ta-c" :max="1" @upload-success="uploadSuccess">
            <img :src="pic.content" class="wh-100 center-block">
            <p class="add-desc" v-if="addDesc">{{ addDesc }}</p>
          </upload>
        </div>
      </div>
      <div class="w-100 mb10 pr10 fl" v-else>
        <div class="w-100 h105 bg-white pos-r van-hairline--surround">
          <img :src="pic.content" class="wh-100 center-block">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '@/components/Upload/index.vue'
export default {
  name: 'imgUpdateSingle',
  components: { upload },
  props: {
    pic: { // 照片，格式参照注释
      type: Object,
      default() {
        return{
          // content: 'imgurl',
          // file: File,
          // percent: 0,
          // result: {
          //   id: 'imgId',
          //   viewPath: 'imgUrl'
          // },
          // status: 2
        }
      }
    },
    addDesc: { // 添加说明
      type: String,
      default() {
        return '';
      }
    },
    index: { // 图片序号
      type: Number,
      default() {
        return 0;
      }
    },
    disable: { // 是否禁用更新功能
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      pics: [],
      // picInit: true
    };
  },
  // watch: {
    // pics: function () {
    //   if (this.picInit) {
    //     this.picInit = false;
    //     return;
    //   }
    //
    //   let newImg = this.pics[0];
    //   if (newImg.status !== 3) {
    //     // newImg.index = this.index;
    //     // this.$emit('img-update', newImg);
    //   } else {
    //     console.log('falied');
    //     Toast('图片上传失败，请重新上传');
    //     this.picInit = true; // 避免死循环
    //     this.pics = [this.pic];
    //   }
    // }
  // },
  methods: {
    uploadSuccess() {
      let newImg = this.pics[0];
      if (newImg.status !== 3) {
        newImg.index = this.index;
        this.$emit('img-update', newImg);
      }
    }
  },
  created() {
    this.pics = [this.pic];
  }
};
</script>

<style scoped lang="less">
  .img-update-single-wrapper {
    display: inline-block;
    width: 105px;
    .h105 {
      height: 105px;
    }
    .add-desc {
      display: inline-block;
      height: 20px;
      border-radius: 13px;
      background: rgba(0, 0, 0, 0.15);
      padding: 2px 8px;
      white-space: nowrap;
      font-size: 11px;
      color: #fff;
      line-height: 16px;
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
