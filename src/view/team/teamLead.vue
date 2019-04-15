<template>	
	<div class="teamlead">
		<img src="../../assets/icons/team/bg_guide@3x.png" class="w-100">
		<div class="pos-f b0 l0 r0 plr12 pb10">
			<van-button round type="default" block @click="goTeamOpen" class="gradient-bg cl-white ft16 plr12">立即前往</van-button>
		</div>
	</div>
</template>
<script>
export default {
	// 团队引导页
	name: 'teamLead',
	data() {
		return {
			navHeight: Util.getNavHeight(),
		}
	},
	methods: {
		goTeamOpen() {
			btPage.open({
                url: '/team/team_open',
                container_style: 1
			});
			// this.$router.push({ path: '/team/team_open' })
		},
		setHeader() {
			this.$store.dispatch("setHead", {
				showHeader: false
			});
		}
	},
	mounted() {
		setPageTitle('团队政策引导');
		this.setHeader()
		document.body.style.backgroundColor = "#fb6226"
	},
	beforeDestroy: function() {
      	document.body.style.backgroundColor = ""
	},
}
</script>
<style lang="less" scoped>
	.teamlead {
		.gradient-bg {
			background: linear-gradient(to right, #FF8526, #FCDC47);
			border: transparent;
		}		
	}
</style>