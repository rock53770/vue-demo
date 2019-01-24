<template>	
	<div class="teamlead pos-a t0 l0 r0 b0">
		<div class="pos-f b0 l0 r0 plr12 pb10">
			<van-button round type="default" block @click="goTeamOpen" class="gradient-bg cl-white ft16 plr12">立即前往</van-button>
		</div>
	</div>
</template>
<script>
export default {
	// 团队引导页
	name: 'teamLead',
	methods: {
		goTeamOpen() {
			btPage.open({
                url: '/team/team_open',
                container_style: 1
            });
		}
	},
	mounted() {
		setPageTitle('团队政策引导');
	},
}
</script>
<style lang="less" scoped>
	.teamlead {
		background-image: url('../../assets/icons/team/bg_guide@3x.png');
		background-size: contain;
		background-origin: center center;
		.gradient-bg {
			background: linear-gradient(to right, #FF8526, #FCDC47);
			border: transparent;
		}		
	}
</style>