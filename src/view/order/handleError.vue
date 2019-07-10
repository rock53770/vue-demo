<template>
  <div>
    <van-notice-bar background="#FFEEE3" color="#FC6B47" class="pos-f l0 r0 zi10" :style="{ top: navHeight + 'px' }">
      提交资料或备注，协助处理异常，加速出单进度
    </van-notice-bar>
    <div class="bg-white ft15 mb10 pt40">
      <div class="pt10 pb10 van-hairline--bottom flex-center">
        <div class="w120 ta-c">异常类型</div>
        <div class="flex-1 pr15">{{ detail.exceptionType | errorType }}</div>
      </div>
      <div class="pt10 pb10 van-hairline--bottom flex-center">
        <div class="w120 ta-c">异常备注</div>
        <div class="flex-1 pr15">{{ detail.exceptionRemark }}</div>
      </div>
    </div>
    <div class="bg-white ft16 mb10" style="padding-bottom: 70px;">
      <h3 class="h50 lh50 bold_bd_left fw-n van-hairline--bottom">异常处理</h3>
      <div class="plr15 ft15">
        <p class="lh50">添加异常处理备注</p>
        <div class="remark van-hairline--surround h100">
          <van-field v-model="remark" type="textarea"  class="w-100 h-100"/>
        </div>
        <p class="lh50">上传图片资料</p>
        <div>
          <ul class="pics flex-center flex-w">
            <li class="w-50 mb10 pr15" v-show="pics.length < max">
                <div class="w-100 bg-white">
                    <upload  :pics="pics" :max="max" class="wh-100 flex-center h100 ta-c van-hairline--surround">
                        <img src="../../assets/icons/add@3x.png" class="mt30" width="30">
                        <p  class="ft14 cl-white mt10 context w-60">添加图片</p>
                    </upload>
                </div>
            </li>
            <li class="w-50 mb10 pr15 pl0" v-for="(i, index) in pics" :key="index">
              <div class="bg-white">
                <div class="h100 plr10 bg-img-add pos-r van-hairline--surround">
                  <img :src="i.content" class="thumb-img" v-show="i.content" @click="imagePreview(1, index)">
                  <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="i.content" @click="deletePicOther(index)">
                    <i class="icon-delete"></i>
                  </div>
                  <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                    v-show="i.content && i.status == 3">
                    <span>上传失败，请删除重新上传</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pos-f b0 l0 r0 h70 bg-white p10 zi10 van-hairline--top">
      <van-button round type="default" block class="cl-white ft16 van-button--primary" @click="handleErrorData">确认提交</van-button>
    </div>
  </div>
</template>
<script>
import orderService from "@/api/orderService";
import upload from '@/components/Upload/index.vue'

export default {
  name: "handleError",
  data() {
    return {
      navHeight: Util.getNavHeight(),
      remark: "",
      pics: [],
      max: 4,
      detail: {}
    };
  },
  components: { upload },
  methods: {
    getData() {
      let param = { id: this.$route.query.id }
      let service
      if (this.$route.query.type === "quote") {
        service = orderService.errorDetail
      }
      if (this.$route.query.type === "order") {
        service = orderService.errorOrderDetail
      }
        service(param).then((res) => {
          if (res.code == 1) {
            this.detail = res.object
          } else {
            Toast(res.message)
          }
        })
    },
    gopage(url, query) {
      btPage.open({
        url: url,
        container_style: 1,
        params: query,
        type: 3
      })
    },
    deletePicOther(index) {
      this.pics.splice(index, 1);
    },
    imagePreview(type, index) {
      let arr = []
      this.pics.forEach(i => {
        arr.push(i.result.viewPath)
      })
      ImagePreview({
          images: arr,
          startPosition: index
      })
    },
    handleErrorData() {
      if (!this.remark && !this.pics.length) {
        Toast('请输入异常处理备注或上传照片')
        return
      }
      if(this.remark.length > 250){
        Toast('异常备注最多输入250字')
        return
      }
      let service
      if (this.$route.query.type === "quote") {
        service = orderService.errorHandle
      }
      if (this.$route.query.type === "order") {
        service = orderService.errorOrderHandle
      }

      let pic = []
      this.pics.forEach(i => {
        pic.push(i.result.id)
      })

      let param = {
        id: this.$route.query.id,
        remark: this.remark,
        fileIds: pic,
        exceptionType: this.detail.exceptionType
      }

      Toast.loading({
        mask: false,
        message: '提交中...'
      });

      service(param).then((res) => {
        if (res.code == 1) {
          Toast.clear()
          Toast.success('提交成功');
          setTimeout(() => {
            this.gopage('/order', { type: 0 })
          }, 1000)
        } else {
          Toast(res.message)
        }
      })

    }
  },
  filters: {
    errorType(code) {
      switch (code) {
        case 0:
          return "录单异常"
        case 1:
          return "报价异常"
        case 2:
          return "核保异常"
        case 3:
          return "出单异常"
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    setPageTitle("报价单详情")
  }
};
</script>
<style lang="less" scoped>
.context {
  background-color: #dddddd;
  margin: 0 auto;
  border-radius: 10px;
}
</style>


