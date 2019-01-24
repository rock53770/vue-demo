<template>
  <div>
    <p class="cl-orange mlr10 pt7 pb7 lh20">*提现需要实名认证，请上传您的身份证件</p>
    <div class="mb10 pt10">
      <div class="pl10 clearfix pics">
        <div class="fl w-50 pr10 mb10 ta-c">
          <div class="h100 bg-img-sample1 pos-r bdr5">
            <upload
              :pics="idFrontPic"
              v-show="!idFrontPic[0] || !idFrontPic[0].content"
              class="w-100 h-100"
              max="1"
            >
              <div class="w-100 h-100 flex-center justify-c">
                <span class="plr10 lh24 bdr10 bg-o5 cl-white">点击上传</span>
              </div>
            </upload>
            <img
              :src="idFrontPic[0] && idFrontPic[0].content"
              class="thumb-img"
              v-show="idFrontPic[0] && idFrontPic[0].content"
              max="1"
              @click="imagePreview(3)"
            >
            <div
              class="pos-a icon-delete-box w30 h30 ta-r"
              v-show="idFrontPic[0] && idFrontPic[0].content"
              @click="deletePic(3)"
            >
              <i class="icon-delete"></i>
            </div>
            <!-- <i class="pos-a icon-delete" v-show="idFrontPic.content" @click="deletePic(3)"></i> -->
            <div
              class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
              v-show="idFrontPic[0] && idFrontPic[0].content && idFrontPic[0].status == 3"
            >
              <span>上传失败，请删除重新上传</span>
            </div>
          </div>
          <p class="lh30">身份证正面</p>
        </div>
        <div class="fl w-50 pr15 mb10 ta-c">
          <div class="h100 bg-img-sample2 pos-r bdr5">
            <upload
              :pics="idBackPic"
              v-show="!idBackPic[0] && !idBackPic.content"
              class="w-100 h-100"
              max="1"
            >
              <div class="w-100 h-100 flex-center justify-c">
                <span class="plr10 lh24 bdr10 bg-o5 cl-white">点击上传</span>
              </div>
            </upload>
            <img
              :src="idBackPic[0] && idBackPic[0].content"
              class="thumb-img"
              v-show="idBackPic[0] && idBackPic[0].content"
              @click="imagePreview(4)"
            >
            <div
              class="pos-a icon-delete-box w30 h30 ta-r"
              v-show="idBackPic[0] && idBackPic[0].content"
              @click="deletePic(4)"
            >
              <i class="icon-delete"></i>
            </div>
            <!-- <i class="pos-a icon-delete" v-show="idBackPic.content" @click="deletePic(4)"></i> -->
            <div
              class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
              v-show="idBackPic[0] && idBackPic[0].content && idBackPic[0].status == 3"
            >
              <span>上传失败，请删除重新上传</span>
            </div>
          </div>
          <p class="lh30">身份证反面</p>
        </div>
      </div>
    </div>
    <div class="h70 mt10">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <van-button type="primary" round :block="true" @click="submit" text="提交"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import upload from "@/components/Upload/index.vue";
import myService from "@/api/myService";
export default {
  name: "auth",
  data() {
    return {
      idFrontPic: [],
      idBackPic: []
    };
  },
  methods: {
    submit() {
      if (!this.idFrontPic[0] || !this.idFrontPic[0].result.viewPath) {
        Toast("请上传身份证正面照片");
        return;
      }
      if (!this.idBackPic[0] || !this.idBackPic[0].result.viewPath) {
        Toast("请上传身份证反面照片");
        return;
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中..."
      });

      myService
        .validRealName({
          cardFrontFileUrl: JSON.stringify({
            type: 1,
            fileId: this.idFrontPic[0].result.id,
            fileUrl: this.idFrontPic[0].result.viewPath
          }),
          cardBackFileUrl: JSON.stringify({
            type: 2,
            fileId: this.idBackPic[0].result.id,
            fileUrl: this.idBackPic[0].result.viewPath
          })
        })
        .then(res => {
          Toast.clear();
          if (res.code == 1) {
            if(GConfig.isInApp){
              btPage.open({
                url: '/my/cash',
                type:1,
                container_style: 1
              })
            } else {
              this.$router.replace({ name: "cash" });
            }
          } else {
            Toast(res.message);
          }
        });
    },
    onRead3(files) {
      this.idFrontPic = files[0];
    },
    onRead4(files) {
      this.idBackPic = files[0];
    },
    imagePreview(type) {
      var arr = [];
      if (type == 3) {
        this.idFrontPic[0] && arr.push(this.idFrontPic[0].content);
      } else {
        this.idBackPic[0] && arr.push(this.idBackPic[0].content);
      }

      ImagePreview({
        images: arr,
        startPosition: 0,
        onClose() {
          // do something
        }
      });
    },
    deletePic(type) {
      if (type == 1) {
        this.driveIdPic = [];
      } else if (type == 2) {
        this.driveIdVicePic = [];
      } else if (type == 3) {
        this.idFrontPic = [];
      } else if (type == 4) {
        this.idBackPic = [];
      }
    }
  },
  mounted() {
    setPageTitle("实名认证");
  },
  components: {
    upload
  }
};
</script>
