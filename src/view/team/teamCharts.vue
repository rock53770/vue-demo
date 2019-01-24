<template>
	<div class="charts ft0">
		<img src="../../assets/icons/team/img_Ranking_banner@3x.png" height="120" class="w-100">
		<div class="flex-center ta-c ft15 bg-yew h40 lh40 cl-white">
			<div :class="['flex-1', linkType == 1 ? 'activeClass' : '']" @click="whitchLink(1)">月排行榜</div>
			<div :class="['flex-1', linkType == 2 ? 'activeClass' : '']" @click="whitchLink(2)">总排行榜</div>
		</div>
		<div class="ft16 plr10 bg-white ta-c">
			<div class="flex-center justify-sb van-hairline--bottom h40 lh40 cl-gray">
				<p class="w-10">排名</p>
				<p class="w-30">代理人ID</p>
				<p class="w-20">团队规模</p>
				<p class="w-30">总收入</p>
			</div>
			<!-- <div class="list bg-white" :style="{'top': (navHeight+200) + 'px'}"> -->
			<div class="bg-white">
				<div class="flex-center justify-sb van-hairline--bottom h60" v-for="(item, index) in lists" :key="index">
					<div class="w-10">
						<img src="../../assets/icons/team/icon_top1@3x.png" height="32" width="24" v-if="index == 0">
						<img src="../../assets/icons/team/icon_top2@3x.png" height="32" width="24" v-else-if="index == 1">
						<img src="../../assets/icons/team/icon_top3@3x.png" height="32" width="24" v-else-if="index == 2">
						<span v-else>{{ index+1 }}</span>
					</div>
					<div class="w-30">{{ item.userID }}</div>
					<div class="w-20">{{ item.teamSize ? item.teamSize : 0 }}</div>
					<div class="w-30 ft18 cl-orange">{{ item.teamIncome | currency2 }}</div>
				</div>
			</div>
		</div>
		
	</div>
</template>
<script>
import teamService from '../../api/teamService.js'

export default {
	// 团队排行榜
	name: 'teamCharts',
	data() {
		return {
			linkType: 1, // 排行榜项控制器 1:月排行；2:总排行
			lists: [], // 月排行
			pageConfig: {
				index: 1,
				size: 20
			},
			navHeight: Util.getNavHeight(),
		}
	},
	created() {
		setPageTitle('收入排行榜');
		this.getMonthList()	
	},
	methods: {
		// 切换控制器
		whitchLink(n) {
			if (n == 1) {
				this.getMonthList()
			} else {
				this.getTotalList()
			}
			this.linkType = n
		},
		// 月排行
		getMonthList() {
			Toast.loading({
                mask: true,
                message: "加载中..."
            })
			let param = {
				pageIndex: this.pageConfig.index,
				pageSize: this.pageConfig.size
			}
			teamService.teamMonthCharts(param)
				.then((res) => {
					Toast.clear()
					if (res.code == 1) {
						this.lists = res.object
					} else {
						Toast(res.message)
					}
				})
		},
		// 总排行
		getTotalList() {
			let param = {
				pageIndex: this.pageConfig.index,
				pageSize: this.pageConfig.size
			}
			teamService.teamTotalCharts(param)
				.then((res) => {
					if (res.code == 1) {
						this.lists = res.object
					} else {
						Toast(res.message)
					}
				})
		}
	},
}
</script>
<style lang="less" scoped>
	.charts {
		.bg-yew {
			background-color:#FC9F47;
			.activeClass {
				color: #FC6B47;
				background-color: #fff;
				border-radius: 8px 8px 0 0;
			}
		}
		.list {
			position: fixed;
			left: 0;
			right: 0;
			height: calc(100% - 200px);
			overflow: scroll;
		}
	}
</style>
