<template>
    <div>
		<x-header v-if="$root.isShowHead">文件上传</x-header>
		<div class="uploader-container">
        	<bt-uploader v-if="limit>0" :limit="limit" :onChosed="onChosed">选择图片</bt-uploader>
			<div class="img-box" v-for="(item, index) in uploadImgs" :key="item.$index">
				<img :src="item.url" />
				<i class="close" @click="deleteImg(index)">—</i>
			</div>
		</div>
    </div>
</template>
<script>
import { XHeader } from 'vux';
import BtUploader from 'btPlugins/btUploader'
// import commonService from '@/api/common'//这里牵扯到具体业务，容易使打包不成功，demo这里最好注释掉了就
export default {
    data() {
        return {
			otherData: {//其它需要一起上传的参数
				fileType: 1,
				aaa: 'fdaf'
			},
			limit: 3,
			uploadImgs: []
        }
    },
    methods: {
		//选择图片后的回调
		onChosed(imgData){
			let _this = this;
			_this.uploadImgs = _this.uploadImgs.concat(imgData.object);

			_this.limit = _this.limit - imgData.object.length;

			_this.upload(imgData.object);
		},
		//上传文件
		upload(imgs){
			try{//注意这里纯粹是因为demo作为公共插件，不应该直接引入具体业务相关的服务，所以加的异常捕获
				commonService.upload(imgs, this.otherData);
			} catch(ex){
				alert('如想查看接口服务上传，请先引入commonService！')
			}
		},
		deleteImg(index){
			this.uploadImgs.splice(index, 1)
			this.limit++;
		}
    },
	beforeMount() {
		this.$setTitle("文件上传");
	},
    components: { BtUploader }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
@import "~@/less/variables.less";
.uploader-container{
	padding: 10px;
	.bt-uploader-box{
		width: 100px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		border: 1px solid #ccc;
		border-radius: 3px;
		background: #fff;
		margin-bottom: 10px;
	}
	.img-box{
		border: 1px solid #ccc;
		border-radius: 3px;
		display: table-cell;
		vertical-align: middle;
		margin-right: 10px;
		width: 100px;
		height: 100px;
		position: relative;
		img{
			max-width: 100%;
			max-height: 100%;
			margin: 0 auto;
		}
		.close{
			position: absolute;
			width: 20px;
			height: 20px;
			border-radius: 20px;
			line-height: 20px;
			right: -5px;
			top: -5px;
			border: 1px solid #ccc;
			font-style: normal;
			color: #fff;
			text-align: center;
			background: red;
			z-index: 10;
		}
	}
}
</style>
