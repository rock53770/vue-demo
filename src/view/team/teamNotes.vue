<template>
	<div class="notes bg-white">
		<div class="container plr12" v-if="note.length !== 0">
			<div class="ft14 van-hairline--bottom pt12 pb12" v-for="(item, index) in note" :key="index">
				<div class="ft16 flex-center justify-sb mb8">
					<span>{{ $util.formatDate(item.createTime, 'yyyy-MM-dd') }}</span>
					<span class="cl-orange">-{{  item.amount | currency2  }}</span>
				</div>
				<div class="mb8 cl-gray flex-center justify-sb">
					<span>{{ item.bankName }}（尾号{{ item.cardCode }}）</span>
					<span :class="item.status == 3?'cl-orange':''">{{ item.statusName }}</span>
				</div>
				<div class="cl-gray" v-if="item.status == 3">失败原因：{{ item.remark }}</div>
			</div>
		</div>
		<div v-else class="bg undate ta-c">
			<img src="../../assets/icons/team/img_tixian@3x.png" height="94" width="140">
			<p class="cl-gray ft16 mt15">还没有提现记录哟，快去开团赚奖励吧~</p>
		</div>
	</div>
</template>
<script>
import teamService from '../../api/teamService'
import { Toast } from 'vant';

export default {
	// 团队提现记录
	name: 'teamNotes',
	data() {
		return {
			note: []
		}
	},
	methods: {
		getData() {
			Toast.loading({
				mask: true,
				message: '加载中...'
			});
			teamService.cashFLow()
				.then((res) => {
					Toast.clear()
					if (res.code == 1) {
						this.note = res.object
					} else {
						Toast(res.message)
					}
				})
		}	
	},
	created() {
		this.getData()
	},
	mounted() {
		setPageTitle('团队账户提现记录');
	},
}
</script>
<style lang="less" scoped>
	.undate {
		padding-top: 50%;
	}
</style>

