<template>
	<div class="teamOpen ft16 pos-r">
		<img src="../../assets/icons/team/img_ team_banner@3x.png" class="w-100">
		
		<div class="rules pos-a r0 ta-c cl-red ft14" @click="goRules">团队规则</div>

		<div class="plr10 content">
			<div class="van-hairline--bottom pt15 pb15 flex-center justify-sb" v-for="(item, index) in tasks" :key="index">
				<div class="flex">
					<img :src="item.icon" height="30" width="30" class="bdr-50">
					<div class="ml10">
						<h3 class="ft16">任务{{ index | sequence }}</h3>
						<h3 class="ft14 d-black fs-n mt5">{{ item.template }}</h3>
						<p class="cl-gray ft14 lh30">(还差 {{ (item.num - item.surplus) | surplus }} {{ item.type == 1 ? '位': '单' }})</p>
					</div>
				</div>		
				<van-button :type="item.course == 3? 'default': 'primary' " 
					round class="h28 lh20 ft14"  @click="doneTask(item)"
					:class="item.course !== 3 ? 'h-shadow': 'u-shadow' ">{{ item.btnText }}</van-button>
			</div>
			
			<div class="h100 pos-f b0 l0 r0 plr12">
				<p class="ta-c cl-gray ft14 mb10">以{{ createTime }}后实际推荐和出单业绩为准</p>
				<van-button round :type="canBecreated ? 'primary': ''" block :class="canBecreated ?  'h-shadow': 'u-shadow'" class="cl-white ft16" @click="goOpenTeam">立即开启团队模式</van-button>
			</div>
		</div>
		
		<van-popup v-model="dialog.show" class="w-85 bdr8">
			<!-- 达成任务1 -->
			<div style="background: #f8f8f8;" class="bdr8 pt20 pb20 plr15 ta-c pos-r" v-show="dialog.who == 1">
				<h3 class="d-black ft24 fw-n">{{ dialog.title }}</h3>
				<img src="../../assets/icons/team/img_Popup_success@3x.png" height="94" width="94" style="margin-top: 22px">
				<div v-html="dialog.text"></div>
				<van-button round type="primary" block class="cl-white ft16 h40 lh40" @click="confirm">确认</van-button>
				<van-icon name="close" size="30px" color="#ffffff" class="pos-a l0 r0" style="bottom: -0.5rem;" @click="confirm"/>
			</div>
			<!-- 达成任务2 -->
			<div class="topimg" v-show="dialog.who == 3"><img src="../../assets/icons/team/img_Popup_reward@3x.png" class="w-100"></div>
			<div style="background: #f8f8f8;" class="bdr8 pt20 pb20 plr15 ta-c pos-r openSucc" v-show="dialog.who == 3">
				<h3 class="d-black  ft24 fw-n">团队开启成功</h3>
				<div class="money mt20">
					<div class="reward flex-center justify-sb cl-white plr10">
						<div style="width: 77%;">
							<span class="ft45">100</span>
							<span class="ft20">元</span>
						</div>
						<div style="width: 13%;" class="wd ta-c">现金</div>
					</div>
				</div>
				<p class="lh40 cl-gray mt10 mb10">奖励将发放到您的团队账户中</p>
				<van-button round type="primary" block 
					class="cl-white ft16 h40 lh40" 
					@click="teamPage">确认
				</van-button>
			</div>			
		</van-popup>
	</div>
</template>
<script>
import teamService from '../../api/teamService'
import myService from '../../api/myService'
import { Toast } from 'vant';

export default {
	// 开启团队任务引导
	name: 'teamOpen',
	data() {
		return {
			popShow: false,
			tasks: [],
			canBecreated: false,
			userInfo: {},
			createTime: "",
			dialog: {
				show: false,
				who: 0,
				text: '',
				target: {}
			},
			$url: ''
		}
	},
	methods: {
		// getUserInfo
		getUserInfo() {
			const BASE_URL = "https://insuranceapixxb.bz-ins.com" // 生产
			// const BASE_URL = "http://prepinsuranceapixxb.bz-ins.com"  // 予发布
			// const BASE_URL = "http://wxtest.bz-ins.com"  // 测试
			myService.userAgent()
				.then((res) => {
					if (res.code == 1) {
						let result = res.object.userAgentInfoVo
						this.userInfo = result
						this.$url = BASE_URL + `/activity/page/share/receive.html?city=${result.cityCode?result.cityCode:""}&id=${result.userId ? result.userId : ""}`
						console.log(this.$url)
					}
				})
		},
		// 开启团队弹窗 跳转
		goOpenTeam() {
			if (this.canBecreated) {
				this.dialog = {
					show: true,
					who: 3,
					text: '',
					target: {},
					title: ''
				}
			}
		},
		// 跳转teampage
		teamPage() {
			teamService.teamCreated()
			.then((res) => {
				if (res.code == 1) {
					btPage.open({
						url: '/team',
						params: { type: 0},
						container_style: 1,
						type: 3
					});
				} else {
					this.dialog.show = false
					Toast(res.message)
				}
			})
		},
		// 获取任务列表，下面注释为任务列表返回参数
		/**
		 * @param { Number } id  任务唯一id, 完成任务回传参数
		 * @param { Number } num 需要完成任务总数
		 * @param { Number } surplus 剩余需要完成任务数
		 * @param { String } template 任务描述文案
		 * @param { Number } course 任务进程： 1:未完成，2:完成未领取，3:完成已领取
		 * @param { String } btnText 按钮文案，应对多样化产品
		 * @param { String}  icon 任务左上角icon url
		 * response: {
		 *   canBeCreated: false, // 是否可以开启团队模式 对应agent中的hadTeam 
		 *   task: [
		 * 	   {
		 *       id: 1,
		 * 		 num: 10,
		 * 		 surplus: 10,
		 * 	     template: "完成1单车辆保险订单",
		 *       course: 1,
		 *       btnText: "去推荐"
		 * 	   }
		 *   ]
		 * }
		*/
		getTask() {
			Toast.loading({
				mask: true,
				message: '加载中...'
			});
			teamService.teamTask()
				.then((res) => {
					Toast.clear()
					if (res.code == 1) {
						this.canBecreated = res.object.canBeCreated
						this.tasks = res.object.task
						this.createTime = Util.formatDate(res.object.createTime, "yyyy年MM月dd日")
						this.openDialog(res.object.task)
					} else {
						Toast(res.message)
					}
				})
		},
		// 去完成任务
		doneTask(data) {
			if (data.course == 3) {
				return
			}
			if (data.type == 1) {
				if (GConfig.isInApp) {
					this.shareWechat()
				}
				
			} else {
				btPage.open({
					url: '/quote',
					container_style: 1,
					type: 3
				});
			}
		},
		// 分享到微信通讯录
		shareWechat() {
            let param = {
                sharePhotos: 'http://cdnpubimg.bz-ins.com/PUBLIC/INSURANCE_PUBLIC/2018-11-15/7fc3fe06-21a7-45e5-b573-069768c9d548-YT.png',
                shareTitle: '新欣保向您发来邀请',
                shareDesc: '极速报价，便捷出单，专属客服，百万代理人放心之选',
                shareUrl: this.$url,
                sharePlatform: 3,
                shareInfoType: 3
			}
			console.log(param)
            wv.shareInfo(param, function(res) {
                if (res.status == 1) {
                    console.log("分享成功")
                } else {
                    console.log("分享失败")
                }
        	})
		},
		/**
		 * openDialog 开启规则
		 * 1. 任务列表任意单项任务完成(course == 2)即弹出对应id 弹窗
		 * 2. 如果两项任务同时完成则按照渲染顺序逐个弹窗，即重新请求接口
		 * 3. 点击确认 或者 关闭弹窗都视为已收到消息
		 */
		openDialog(arr) {
			let filterArray = [], len, target, innerHtml, innerTitle

			arr.filter(it => {
				if (it.course == 2) { filterArray.push(it) }
			})
			len = filterArray.length

			if (len == 0) {
				this.dialog.show = false
			} else {
				target = filterArray[0]
				innerHtml = target.type == 1 ? 
							`<p class="cl-gray mt8 mb20">已邀请<span class="cl-orange">${target.num}</span>人注册</p>` : 
							`<p class="cl-gray mt8 mb20">已完成<span class="cl-orange">${target.num}</span>单车辆保险</p>`
				innerTitle = target.type == 1 ? '恭喜成功达成任务一' : '恭喜成功达成任务二'
				this.dialog = {
					show: true,
					who: 1,
					text: innerHtml,
					target: target,
					title: innerTitle
				}
			}
		},
		/**
		 * 任务完成callback
		 */
		confirm() {
			teamService.teamTaskCb({ taskid: this.dialog.target.id })
				.then((res) => {
					if (res.code == 1) {
						this.getTask()
						this.dialog.show = false
					}
				})

		},
		goRules() {
			btPage.open({
				url: "/team/team_rules",
				container_style: 1,
				type: 3
			});
		},
		setHead() {
			var self = this;
			this.$store.dispatch("setHead", {
				menuContent: `<div class="menu"></div>`,
				needBack: true,
				back: () => {
					btPage.open({
						url: "/my",
						container_style: 1,
						type: 3
					});
				}
			});
		}
	},
	created() {
		this.getTask()
		this.getUserInfo()
	},
	mounted() {
		// document.body.classList.add("bg-white");
		setPageTitle('我的团队');
		
		this.setHead()
		
		wv.customBackAction(function() {
			btPage.open({
				url: "/my",
				container_style: 1,
				type: 3
			});
		});
		wv.setWebViewInfo({
			wvBackDisable:1
		})
	},
	// beforeDestroy: function() {
    //   	document.body.classList.remove("bg-white");
	// },
	filters: {
		sequence(n) {
			switch(n) {
				case 0:	
					return '一';
				case 1:
					return '二';
				case 2:
					return '三'
			}
		},
		surplus(n) {
			if (n <= 0) {
				return 0
			} else {
				return n
			}
		}
	}
}
</script>
<style lang="less" scoped>
.teamOpen {
	.h-shadow {
		box-shadow: 0 2px 4px 0 rgba(252,107,71, 0.5);
		/deep/ span {
			font-size: 14px;
			color: #ffffff;
		}
	}
	.u-shadow {
		box-shadow: 0 2px 4px 0 rgba(216,216,216, 0.5);
		background: linear-gradient(to bottom, #d8d8d8, #cfcfcf);
		/deep/ span {
			font-size: 14px;
			color: #ffffff;
		}
	}
	.rules {
		top: 8px;
		width: 70px;
		height: 30px;
		line-height: 30px;
		background: #FFE069;
		border-radius: 15px 0 0 15px;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
	.d-black {
		color: #444444;
	}
	.fs-n {
		font-weight: normal;
	}
	.w-85 {
		width: 85%;
		height: auto;
		background: transparent;
		overflow-y: visible;
	}
	.bdr8 {
		border-radius: 8px;
	}
	.reward {
		height: 90px;
		background-image: url(../../assets/icons/team/bg_quan@3x.png);
		background-repeat: no-repeat;
		background-size: 100% 90px;
	}
	.wd {
		writing-mode: vertical-lr;
		writing-mode: tb-lr;
		letter-spacing: 3px;
	}
	.topimg {
		z-index: 2011;
		position: relative;
	}
	.openSucc {
		z-index: 2010;
		transform: translateY(-0.256rem);
	}
}
</style>
