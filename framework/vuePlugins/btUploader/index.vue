<template>
    <form class="bt-uploader-box" method="post" ref="uploaderBox" :id="eleId">
		<!-- <div v-if="isWapDeal"> -->
			<!-- <input type="hidden" v-for="(val, key) in additionalData" :key="val" :name="key" :value="val" /> -->
			<input v-if="isWapDeal" :multiple="limit>1" type="file" name="file" :accept="acceptType" />
		<!-- </div> -->
		<slot ref="uploaderBox">
		</slot>
    </form>
</template>
<script>
import Loading from 'loading';
import Util from 'util';
export default {
    props: {
		//限选张数
		limit: {
			type: Number,
			default: 1
		},
		//文件类型（目前只支持图片）
		acceptType: {
			type: String,
			default: 'image/gif,image/jpeg,image/png,image/jpg,image/bmp'
		},
		// //是否选择就自动上传
		// autoUpload: {
		// 	type: Boolean,
		// 	default: true
		// },
		// //是否上传选中图片
		// isUpload: {
		// 	type: Boolean,
		// 	default: true
		// },
		// //附加需要提交到服务端的数据
		// additionalData: {
        //     type: Object
		// },
		//选择了图片回调
		onChosed: {
            type: Function,
		},
		// //上传回调事件
		// onUpload: {
        //     type: Function,
      	// 	required: true
		// },
		// //文件上传接口地址，如果不传，取全局配置文件中的值
		// apiUrl: {
		// 	type: String,
		// 	default: GConfig.UPLOAD_URL || ''
		// }
    },
    data() {
        return {
			eleId: Util.getGuid(),
			btnEl: null,
			isWapDeal: !(GConfig.isAppProject && GConfig.isInApp) //是否通过wap方式实现
        }
    },
    methods: {
		//app内事件绑定
		bindAppEvent(){
			let _this = this;
			_this.btnEl.on('click', function(){
				let uploadImgs = [];
				let limit = _this.limit || 1;

				wv.showImagePickDialog({
					maxCount: limit, //最多可以上传的张数
					title: "",
					firstSubtitle: "",
					secondSubtitle: "",
					type: 2, //普通拍照模式
					openType: 0 //打开方式，默认0表示可选择拍照还是相册，1是直接打开拍照
				}, function(data) {
					_this.onChosed && _this.onChosed(data);

					if (data.object && data.object.length) {
						let imgList = [];
						angular.forEach(data.object, function(item){
							imgList.push(item.url);
						});

						// if(!_this.autoUpload){
						// 	_this.isUpload = false;
						// 	// _this.setWatcher()
						// } else{

						// }
						// fileService.upload(imgList).then(function(ids){
						// 	for(let i = 0; i < ids.length; i++){
						// 		uploadImgs.push({
						// 			fileId: ids[i].id,
						// 			fileUrl: ids[i].url,
						// 			// fileSource: imgList[i]
						// 		})
						// 	}

						// 	let emitResult = _this.onUpload(uploadImgs, _this.additionalData);
						// 	if(typeof emitResult === 'function'){
						// 		emitResult(uploadImgs);
						// 	}
						// });
					}
				});
			});
			// setWatcher:
		},
		        /**
         * 根据图片地址得到base64编码
         * @param  {String}   url          图片地址
         * @param  {Function} callback     回调函数
         * @return {void}
         */
        convertImgToBase64(url, callback){
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
            config = $.extend({}, DEFAULT_CONFIG, config);

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
        },
		//wap事件绑定
		bindWapEvent(){
			let _this = this;
			let inputElem = _this.btnEl.find("input[type=file]");

			require.ensure([], function(require){
				let lrz = require('../../libs/lrz.all.bundle');

				inputElem.on("click", function(e){
					e && e.stopPropagation();
				});

				inputElem.on("change", function(e){
					let limit = _this.limit || 1;//change的时候重新取
					let aFiles = e.target.files,
						nChosedLength = e.target.files.length
					;
					let uploadImgs = [];
					let beforeUploadImgs = [];//选择图片以后返回的数据结构保持跟app返回的格式一致(多一个name)

					if(aFiles == null || aFiles.length == 0){
						return;
					}

					// Loading.show();
					let index = 0;
					function getNextPic(){
						let file = aFiles[index],
							fileName = file.name
						;

						if(index > limit - 1 || index > aFiles.length - 1){
							return;
						}

						if (!file.type.match('image.*')) {
							getNextPic(++index);
							return;
						}

						lrz(file)
						.then(function (rst) {
							// console.log(rst);
							getBase64Callback(rst.base64);
						})
						.catch(function (err) {//失败就调用自己的方法
							let reader = new FileReader();
							reader.onload = function(e) {
								_this.convertImgToBase64(e.target.result, getBase64Callback);
							};

							reader.readAsDataURL(file);
						})
						//base64转化
						function getBase64Callback(base64Str){
							if(!base64Str){
								return;
							}
							if(beforeUploadImgs.length < limit){
								beforeUploadImgs.push({
									url: base64Str,
									name: fileName
								});
							}

							getIsEnd()
						}
					}

					getNextPic();

					//是否上传完毕
					function getIsEnd(){
						if(beforeUploadImgs.length < limit && beforeUploadImgs.length < aFiles.length && index < aFiles.length - 1){
							++index;
							getNextPic()
						} else{
							// Loading.hide();
							_this.onChosed && _this.onChosed({
								code: 1,
								object: beforeUploadImgs
							});

							inputElem.val('');
						}
					}
				});
			}, "lrz");
		}
    },
    mounted() {
		let _this = this;
		_this.$nextTick(() => {
			_this.btnEl = $(this.$refs.uploaderBox);

			if(_this.isWapDeal){
				_this.bindWapEvent();
			} else{
				_this.bindAppEvent();
			}
		})
    },
    components: { }
}

</script>
<style lang="less">
    @import "~@/less/mixin.less";
	@import "~@/less/variables.less";
	.bt-uploader-box{
		position: relative;
		input[type="file"]{
			position: absolute;
			opacity: 0;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			z-index: 100;
		}
	}
</style>
