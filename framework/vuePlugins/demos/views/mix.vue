<template>
    <div class="mix-wrapper">
		<x-header :left-options='{preventGoBack:true}' @on-click-back="$btPage.goBack()">混合demo页面</x-header>
		<box gap="10px 10px">
			<divider>头部字体颜色</divider>
			<x-button @click.native="setWebViewInfo({wvxTFclr:'white'})">头部字体白色</x-button>
			<x-button type="primary" @click.native="setWebViewInfo({wvxTFclr:'black'})" style="background-color:#000">头部字体黑色</x-button>

			<divider>设置头部背景色</divider>
			<x-button type="primary" @click.native="setWebViewInfo({wvxTclr:'#f3e709'})" style="background-color:#f3e709">头部黄色</x-button>
			<x-button type="warn" @click.native="setWebViewInfo({wvxTclr:'#f00f00'})">头部红色</x-button>

			<divider>设置底部背景色</divider>
			<x-button type="primary" @click.native="setWebViewInfo({wvxBclr:'#dad3d3'})" style="background-color:#dad3d3">底部灰色</x-button>
			<x-button type="warn" @click.native="setWebViewInfo({wvxBclr:'#f00f00'})">底部红色</x-button>
			<x-button @click.native="setWebViewInfo({wvxBclr: ''})">底部不占位</x-button>

			<divider>事件监听</divider>
			<x-button type="primary" @click.native="addNotifactionListener()">开启页面唤起监听</x-button>
			<x-button @click.native="deleteNotifactionListener()">取消监听</x-button>

			<divider>系统指纹人脸识别</divider>
			<x-button type="primary" @click.native="localAuthentication({type: 1})">指纹人脸识别</x-button>
			<x-button type="warn" @click.native="localAuthentication({type: 2})">如果不成功调用密码解锁</x-button>

			<div style="text-align:center;margin-top:15px;">
				<group>
					<x-switch title="是否开启指纹识别" prevent-default v-model="isUserOpen" @on-click="changeLocalAuthentication"></x-switch>
				</group>
			</div>
		</box>
    </div>
</template>
<script>
import { XHeader, XButton, Box, Divider, XSwitch, Group } from 'vux';
const localKey = 'IS_OPEN_LOCAL_AUTHENTICATION_KEY';
export default {
    data() {
        return {
			isUserOpen: Util.getLocalData(localKey) || false//用户设置是否开启
		}
	},
    methods: {
		//系统页面唤起事件监听
		addNotifactionListener(){
			this.$wv.addNotifactionListener(this.$wv.types.notifactionType.PAGE_AWAKE, (data) => {
				setTimeout(function(){
					new Say('页面被唤起了' + data);
				}, 500)
			})
		},
		//注销系统页面唤起事件监听
		deleteNotifactionListener(){
			this.$wv.deleteNotifactionListener(this.$wv.types.notifactionType.PAGE_AWAKE)
		},
		//设置webview窗体信息
		setWebViewInfo(options){
			// let options = {
			// 	wvx: 0,				//控制 全屏网页 适配行为
			// 	wvxTclr: '#cccccc',	//控制顶部适配层颜色
			// 	wvxTFclr: 'black', 	//控制顶部安全区域字体颜色
			// 	wvxBclr: 'red', 	//控制底部适配层颜色
			// };
			this.$wv.setWebViewInfo(options)
		},
		//执行指纹和人脸解锁
		localAuthentication(options){
			return new Promise((resolve, reject) => {
				this.$wv.localAuthentication(options, function(data){
					new Say(data)
				})
			});
		},
		//修改是否开启指纹识别
		changeLocalAuthentication(newVal, oldVal){
			let _this = this;
			_this.getHasAuthenticationPermissions().then((isHasPermission) => {
				if(isHasPermission){
					_this.localAuthentication({type: 1}).then(() => {
						_this.isUserOpen = !_this.isUserOpen;
						Util.setLocalData(localKey, _this.isUserOpen);//全局设置
					});
				} else if(_this.isUserOpen === true){
					_this.isUserOpen = false;
					Util.setLocalData(localKey, _this.isUserOpen);//全局设置
					alert('请先去系统设置');
				}
			})
		},
		//读取系统是否开启指纹人脸系别权限
		getHasAuthenticationPermissions(){
			let _this = this;
			return new Promise((resolve, reject) => {
				_this.$wv.queryPermissions(4, function(data){
				alert(JSON.stringify(data))
					if(!data.result){
						Util.setLocalData(localKey, false);
						_this.isUserOpen = false;
					}
					resolve(data.result);
				});
			});
		}
	},
    beforeMount() {
		this.$setTitle('混合demo页面');
		this.$wv.setWebViewInfo({
			wvxTclr: '#cccccc',		//控制顶部适配层颜色
			wvxTFclr: 'black', 		//控制顶部安全区域字体颜色
			wvxBclr: '#008000', 	//控制底部适配层颜色
			bounces: 1				//ios是否允许窗口超出回弹
		})

		//查询系统解锁权限
		this.getHasAuthenticationPermissions()
    },
    components: {
		Box,
		XHeader,
		XButton,
		Divider,
		XSwitch,
		Group
    }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
@import "~@/less/variables.less";
.mix-wrapper{
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: @bgColorDefault;
}
</style>
