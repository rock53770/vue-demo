
<template>
  <div>
      <van-uploader :after-read="onRead" :before-read="beforeRead" result-type="text" class="w-100 h-100" v-if="!multiple">
          <slot></slot>
      </van-uploader>
      <van-uploader :after-read="onRead" :before-read="beforeRead" result-type="text" class="w-100 h-100" v-if="multiple" multiple="multiple">
          <slot></slot>
      </van-uploader>
  </div>
</template>

<script>
  import {Popup} from 'vant';
  import './lrz.all.bundle';
  export default {
    name: 'upload',
    data(){
        return {
          show: false,
        }
    },
    computed:{
      option:function(){
          var defaultOption = {
            position: 'bottom',
            getContainer: function () {
              return document.getElementsByTagName("body")[0];
            }
          };
          return {...defaultOption,...this.popupOption}
      }
    },
    props: {
      multiple: {
        type: String|Boolean,
        default: false
      },
      needCompress:{
        type: Boolean,
        default: true
      },
    },
    methods: {
      beforeRead(a){
        // console.log(a)
        Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '正在处理'
        });
        return false
      },
      onRead(file){
        console.log(file)
        var _this = this;
        var files = [];
        var queue = [];//压缩后需要上传的文件
        if (!Util.isArray(file)){
            files[0] = file;
        } else {
            files = file;
        }
        var len = files.length;
        var i = 0;
        // Toast.loading({
        //     duration: 0,       // 持续展示 toast
        //     forbidClick: true, // 禁用背景点击
        //     loadingType: 'spinner',
        //     message: '正在处理'
        // });
        files.forEach(function(k,v){
            // k.percent = 0;
            // k.status = 1;
            // k.result = {};
            // delete k.content;
            lrz(k.file)
                .then(function (rst) {
                    console.log(rst)
                    i++;
                    queue.push(rst);
                    _this.$emit('after-select',[{
                      content:rst.base64
                    }]);
                    upload(rst,v,len)
                })
                .catch(function (err) {
                    console.log(err);
                    var type = typeof err;
                    _hmt.push(['_trackEvent', 'carPic','upload',type])
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        _convertImgToBase64(e.target.result, getBase64Callback);
                    };
                    reader.readAsDataURL(k.file);
                    function getBase64Callback(base64Str){
                        i++;
                        var blob =  getBlob(base64Str);
                        var rst = {
                          base64:base64Str,
                          file:blob,
                          origin:{
                            name:k.file.name
                          }
                        }
                        queue.push(rst);
                        upload(rst,v,len)
                    }
                }).always(function(){
                  _hmt.push(['_trackEvent', 'carPic','upload','upload-always'])
                })
        })
        // setTimeout(()=>{
        //   this.$emit('after-select',files);
        // },0)

        function upload(k,index,len){
          var URL = "/api/m/insurance/common/file/upload",
              TEST_URL = "/rap/api/m/insurance/common/file/upload?bust=" + (+new Date());
          var fd = new FormData();
          fd.append('file', k.file,k.origin.name);
          Toast.loading({
              duration: 0,       // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: 'spinner',
              message: '正在上传'
          });
          var xhr = new XMLHttpRequest();
          // xhr.upload.addEventListener("progress", function (e) {
          //     files[index].percent = Math.floor(e.loaded * 100 / e.total);
          // }, false);
          xhr.onreadystatechange = function(){
              if(xhr.readyState == 4){
                  if (xhr.status == 200 && xhr.responseText){

                      Toast.clear()
                      var data = xhr.responseText;
                      if(typeof data == "string"){
                          try{
                              data = JSON.parse(data);
                          } catch(ex){
                          }
                      }
                      if(data.code == 1){
                          files[index].status = 2;
                          files[index].result = data.object;
                          // if(index == len-1){
                          //   Toast("上传成功")
                          // }
                          // _this.$emit('after-select',[{
                          //   content:data.object.viewPath
                          // }]);
                          // _this.$emit('success-item',k,data.object);
                      } else if(data.code == 1000){
                          files[index].status = 3;
                          Toast(data.message);//登出
                      } else{
                          files[index].status = 3;
                          Toast(data.message);
                      }
                  } else {
                      files[index].status = 3;
                      Toast("上传失败");
                  }
              }
          };
          if(sessionStorage.isTest || GConfig.isTest){
              xhr.open("post", TEST_URL);
          } else{
              xhr.open("POST", URL);
          }
          xhr.setRequestHeader('AccessToken',Util.getCookie("AccessToken"));
          xhr.setRequestHeader('clientType',Util.userAgentType());
          xhr.setRequestHeader('isXxb',1);
          xhr.send(fd);
        }

        function getBlob(base64Str){
          var asFileArr = base64Str.split(','),
              data = asFileArr[1]
          ;
          data = window.atob(data);
          var ia = new Uint8Array(data.length);
          for (var i = 0; i < data.length; i++) {
              ia[i] = data.charCodeAt(i);
          };

          var blob = new Blob([ia], {
              type: "image/jpeg"
          });

          return blob;
        }
        function _convertImgToBase64(url, callback){
            var DEFAULT_CONFIG = {
                    maxWidth: 800,
                    maxHeight: 800,
                    quality: 1//16
                },
                config
            ;
            if(typeof(url) === "object"){//url, callback, maxWidth, maxHeight, quality
                config = url;
            } else{
                config = {
                    url: url,
                    callback: callback
                }
            }

            Object.assign(config, DEFAULT_CONFIG);
            // config = $.extend({}, DEFAULT_CONFIG, config);

            var dataURL,
                img = new Image(),
                nMaxWidth = config.maxWidth,    //等比压缩最大宽度
                nMaxHeight = config.maxHeight    //等比压缩最大高度
            ;
            // img.width = 100;
            // img.height=100;

            //                                 alert( config.url);
            // img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var nCanvasWidth = img.width,
                    nCanvasHeight = img.height
                ;
                //尺寸控制
                if(img.width > nMaxWidth || img.height > nMaxHeight){//宽度或者高度有超出的情况
                    if(img.width / img.height >= nMaxWidth / nMaxHeight){//宽高比例偏大
                        nCanvasHeight = img.height * (nMaxWidth / img.width);
                        nCanvasWidth = nMaxWidth;
                    } else{//高宽比例偏大
                        nCanvasWidth = img.width * (nMaxHeight / img.height);
                        nCanvasHeight = nMaxHeight;
                    }
                }

                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d')
                ;

                canvas.width = nCanvasWidth;
                canvas.height = nCanvasHeight;
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, nCanvasWidth, nCanvasHeight);

                dataURL = canvas.toDataURL('image/jpeg', config.quality);

                config.callback.call(this, dataURL);
                // Clean up
                canvas = null;
                img.onload = null;
                img = null;
            };

            img.onerror = function(ex){
                // var str = "{";
                // for(var i in ex){
                //     str += i + ":" + ex[i] + ", ";
                // }
                // str += "}";
                // alert(str);
                new Say("无法访问到该图片");
            }
            img.src = config.url;
        }
        function upload1(k,index,len){
          setTimeout(function(){
              console.log(index + '/' + len)
              files[index].percent = 0.2;
          },1000)
        }
      },
      upload(i) {

      },
    },
  };
</script>

