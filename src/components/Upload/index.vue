
<template>
  <div  v-if="isWx || isInApp">
    <div class="wh-100 cl-orange" @click="chooseImage()">
      <slot></slot>
    </div>
  </div>
  <div v-else>
      <!-- <div> -->
        <van-uploader :after-read="onRead" class="w-100 h-100" v-if="max>1" multiple="multiple">
            <slot></slot>
        </van-uploader>
        <van-uploader :after-read="onRead" class="w-100 h-100" v-else>
            <slot></slot>
        </van-uploader>
      <!-- </div> -->
  </div>
</template>

<script>
// const isWx = Util.userAgentType() == "wechat"
import { Popup } from "vant";
import commonService from '@/api/commonService'
import "./lrz.all.bundle";
import {WechatRegistrar, wxShare} from '@/lib/wechat'
export default {
  name: "upload",
  data() {
    return {
      show: false,
      isWx:Util.userAgentType() == "wechat" && Util.isMobile(),
      isInApp:GConfig.isInApp,
      localData:[]
    };
  },
  computed: {
    option: function() {
      var defaultOption = {
        position: "bottom",
        getContainer: function() {
          return document.getElementsByTagName("body")[0];
        }
      };
      return { ...defaultOption, ...this.popupOption };
    }
  },
  mounted() {
      if(!this.isWx){
          return
      }
      var btWechat = new WechatRegistrar();
      setTimeout(function(){//为了保证这个时候路由切换完成
          btWechat.setConfig().then(function(){
              wxShare({
                link: location.origin
              })
          });
      }, 0);
  },
  props: {
    multiple: {
      type: String | Boolean,
      default: false
    },
    needCompress: {
      type: Boolean,
      default: true
    },
    pics: {
        type: Array|Object,
        default: () => []
    },
    max: {
        type: Number|String,
        default: () => 9
    }
  },
  methods: {
    onRead(file, content) {
      var self = this;
      var files = [];
      var queue = []; //压缩后需要上传的文件

      if (!Util.isArray(file)) {
        files[0] = file;
      } else {
        files = file;
      }

      var len = files.length;
      var i = 0;

      files.forEach(function(k, v) {
        k.percent = 0;
        k.status = 1;
        k.result = {};

        lrz(k.file, 0.7)
          .then(function(rst) {
            console.log(rst);
            i++;
            queue.push(rst);
            upload(rst, v, len);
          })
          .catch(function(err) {
            console.log(err);
          });
          if(Util.isArray(self.pics)){
            if(self.max == 1){
              self.pics.unshift(k)
            } else {
              self.pics.push(k)
            }
            if(self.pics.length > self.max){
              self.pics.length = self.max;
            }
          } else {
            // self.pics = k;
            // self.$emit('update:pics', k);
            // console.log(JSON.stringify(self.pics))
            // console.log(self.pics)
          }
      });
      function upload(k, index, len) {
        var fd = new FormData();
        fd.append("file", k.file, k.origin.name);
        //  fd.append('fileType', index);

        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          message: "正在上传"
        });

        commonService.upload(fd).then((data)=>{
          Toast.clear();
          if (data.code == 1) {
            files[index].status = 2;
            files[index].result = data.object;
            self.$emit("upload-success")
          } else if (data.code == 1000) {
            files[index].status = 3;
            Toast(data.message); //登出
          } else {
            files[index].status = 3;
            Toast(data.message);
          }
        })
      }
      function upload1(k, index, len) {
        setTimeout(function() {
          console.log(index + "/" + len);
          files[index].percent = 0.2;
        }, 1000);
      }
    },
    chooseImage(isWx){//微信和APP中
      var self = this;
      if(this.isWx){
        this.chooseImageWx();
      } else {
        wv.showImagePickDialog({
					maxCount: Math.min(this.max - this.pics.length,9), //最多可以上传的张数
					title: "",
					firstSubtitle: "",
					secondSubtitle: "",
					type: 2, //普通拍照模式
					openType: 0 //打开方式，默认0表示可选择拍照还是相册，1是直接打开拍照
				}, function(data) {
          console.log(file)
          // if(!data.object.length) return
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            message: "正在上传"
          });
          var file = data.object;
          var files = [];
          if (!Util.isArray(file)) {
            files[0] = file;
          } else {
            files = file;
          }
          var len = files.length;
          var i = 0;

          files.forEach(function(k, v) {
            k.content = k.url;
            k.percent = 0;
            k.status = 1;
            k.result = {};
            if(self.max == 1){
              self.pics.unshift(k)
            } else {
              self.pics.push(k)
            }
          });
          var j = 0, length = files.length;
          upload();
          function upload() {
            if(j >= length){
              Toast.clear();
              self.$emit("upload-success")
              return
            }
            var arr = [];
            arr[0] = files[j].url;
            commonService.uploadApp(arr).then((data)=>{
              Toast.clear();
              if (data.code == 1) {
                files[j].status = 2;
                files[j].result = data.object;
                files[j].content = data.object && data.object.viewPath;
              } else if (data.code == 1000) {
                files[j].status = 3;
                // Toast(data.message); //登出
              } else {
                files[j].status = 3;
                // Toast(data.message);
              }
              j++;
              upload()
            })
          }

				});
      }
    },
    chooseImageWx(){
      var self = this;
      wx.chooseImage({
          count: Math.min(self.max - self.pics.length,9), // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              if(!res.localIds.length) return
              Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: "spinner",
                message: "正在上传"
              });
              var localData = res.localIds.slice(0);
              var files = [];
              for (var i = 0; i < res.localIds.length; i++) {
                // self.localIds.push(res.localIds[i]);
                files[i] = {};
                files[i].percent = 0;
                files[i].status = 1;
                files[i].isWx = 1;
                files[i].result = {
                  id:"",
                  viewPath:""
                };
                files[i].content = localData[i];
                if(self.max == 1){
                  self.pics.unshift(files[i])
                } else {
                  self.pics.push(files[i])
                }
              }
              //兼容ios wkwebview
              // if(window.__wxjs_is_wkwebview && localData.length){
              //     var i = 0,
              //         len = localData.length;
              //     showImg();
              //     function showImg(){
              //       if(i >= len){
              //         self.$emit("after-select", files);
              //         return
              //       }
              //       wx.getLocalImgData({
              //         localId: localData[i], // 图片的localID
              //         success: function (res) {
              //               files[i].content = res.localData; // localData是图片的base64数据，可以用img标签显示
              //               i++;
              //               showImg();
              //           }
              //       });
              //     }
              // } else {
              //   self.$emit("after-select", files);
              // }
              // self.$emit("after-select", files);
              // self.pics = self.pics.concat(files);
              var serverId = [];
              if (res.localIds.length) {
                  var localIds = res.localIds;
                  var j = 0, length = localIds.length;

                  function upload() {
                    if(j >= length){
                      Toast.clear();
                      self.$emit("upload-success")
                      return
                    }
                    wx.uploadImage({
                      localId: localIds[j].toString(),
                      isShowProgressTips: 0,
                      success: function (res) {
                        // alert(res.serverId)
                        files[j].result.id = res.serverId;
                        files[j].result.viewPath = files[j].content;
                        files[j].status = 2;
                        j++;
                        upload();
                      },
                      fail: function (res) {
                        alert(JSON.stringify(res))
                        files[j].status = 3;
                        j++;
                        upload();
                      }
                    });
                  }
                  upload();
              }
          }
      });
    }
  }
};
</script>

