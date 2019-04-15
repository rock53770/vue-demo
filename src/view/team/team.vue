<template>
	<div class="team">
		<div class="team-top pos-r ta-c pt8 cl-white pb25">
			<div class="h60 w60 mc"><img :src="detail.teamAvatar" class="avatar w-100 h-100 bdr-50"></div>
			<p class="mt10 ft16">{{ detail.teamName }}</p>
			<p class="ft14 mt5 ">（{{ detail.teamPhone }}）</p>
			<div class="size bg-white cl-orange ft14" @click="goPage('/team/team_manage')">团队规模{{ detail.teamSize }}人</div>
			<img src="../../assets/images/achieve_bg.png" class="w-100 pos-a b0 l0 r0">
		</div>
		<div class="flex-center h40 lh40 ft16 fw-b ta-c bg-white van-hairline--top mb10">
			<div class="flex-1 afterline" @click="goPage('/team/team_manage')">团队管理</div>
			<div class="flex-1" @click="goPage('/team/team_achieve')">业绩明细</div>
		</div>

		<div class="mlr5 bdr8 bg-white ft14 pt12 pb12 plr15 mb10">
			<div class="flex-center justify-sb mb10">
				<strong class="ft16">团队钱包</strong>
				<van-button type="primary" round class="h28 lh28 ft14" @click="goPage('/team/team_with_draw')">提取余额</van-button>
			</div>
			<div class="flex-center ft14">
				<div class="mr15">余额：<strong class="cl-orange ft20">{{ detail.balance|currency2 }}</strong></div>
				<div class="ft16">总收入：{{ detail.grossIncome|currency2 }}</div>
			</div>
		</div>
		<div class="mlr5 bdr8 bg-white ft16 pt14 pb12 plr15 mb10 ta-c flex-center justify-sa">
			<div class="grow-1 afterline">
				<p class="cl-orange ft18 mb5">{{ detail.nowInsuranceCount ? detail.nowInsuranceCount : 0 }}笔</p>
				<p>今日保单</p>
			</div>
			<div class="grow-1 afterline">
				<p class="cl-orange ft18 mb5">{{ detail.nowIncome|currency2 }}元</p>
				<p>今日收入</p>
			</div>
			<div class="grow-1">
				<p class="cl-orange ft18 mb5">{{ detail.nowRecommendedCount }}人</p>
				<p>今日增员</p>
			</div>
		</div>
		<div class="mlr5 bdr8 bg-white pt15  mb15 ta-c">
			<h3 class="ft16 ta-l pl15 mb15">团队动态</h3>
			<Chart :config="personalAdd"/>
			<Chart :config="profit"/>
		</div>
	</div>
</template>
<script>
import teamService from '../../api/teamService.js'
import Chart from '../../components/Chart/index'


export default {
	// 团队主页
	name: 'team',
	data() {
		return {
			detail: {},
			personalAdd: { 
				date: [], 
				num: [], 
				title: '七日增员', 
				height: 200, 
				id: 'personal'
			},
			profit: { 
				date: [], 
				num: [], 
				title: '七日收益', 
				height: 200, 
				id: 'profit' 
			},
			backShow: true
		}
	},
	components: { Chart },
	methods: {
		// 页面跳转方式
		goPage(path) {
			// this.$router.push({ path: path});
            btPage.open({
                url: path,
                container_style: 1,
                jsOnResume: () => {
                    this.getData()
                }
            })
		},
		/**
		 * 获取团队详细信息
		 */
		getData() {
			Toast.loading({
				mask: true,
				message: '加载中...'
			});
			teamService.teamDetail()
				.then((res) => {
					Toast.clear()
					if (res.code == 1) {
						this.detail = res.object
						this.getPersonalAdd()
						this.getProfit()
					} else {
						Toast(res.message)
					}
				})
		},
		// 七日增员
		getPersonalAdd() {
			teamService.addPersonal()
				.then((res) => {
					if (res.code == 1) {
						let data = { date: [], num: []}
						res.object.forEach(it => {
							data.date.push(it.date)
							data.num.push(it.num)
						});
						this.personalAdd.num = data.num
						this.personalAdd.date = data.date
					} else {
						Toast(res.message)
					}
				})
		},
		// 七日收益
		getProfit() {
			teamService.addProfit()
				
				.then((res) => {
					if (res.code == 1) {
						let data = { date: [], num: []}
						res.object.forEach(it => {
							data.date.push(it.date)
							data.num.push(it.num)
						});
						this.profit.num = data.num
						this.profit.date = data.date
					} else {
						Toast(res.message)
					}
				})
		},
		setHeader() {
			var self = this;
			console.log(self.backShow)
			this.$store.dispatch("setHead", {
				menuContent: `<div class="cl-white" style="line-height: 44px">排行榜</div>`,
				needBack: self.backShow,				
				menuClick: () => {
					btPage.open({
						url: "/team/team_charts",
						container_style: 1
					});
				}
			});
		}
	},
	created() {
		this.getData()
	},
	mounted() {
		this.backShow = this.$route.query.type == 1 ? true : false 
		setPageTitle('我的团队');
		this.setHeader()
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
}
</script>
<style lang="less" scoped>
.team {
	.team-top {
		background: url(../../assets/icons/team/bg_team_banner@3x.png) no-repeat;
		background-size: cover;
		.avatar {
			box-shadow: 0 0 0 3px rgba(255,255,255, 0.35);
		}
		.size {
			padding: 0 10px;
			height: 30px;
			line-height: 30px;
			font-size: 13px;
			text-align: center;
			position: absolute;
			top: 8px;
			right: 0px;
			border-radius: 15px 0 0 15px;
		}
	}
	.afterline {
		position: relative;
		&:after {
			content: " ";
			position: absolute;
			width: 1px;
			height: 32px;
			top: 50%;
			transform: translateY(-50%);
			right: 0;
			background-color: #eeeeee;
		}
	}
}
</style>