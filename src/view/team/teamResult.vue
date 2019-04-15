<template>
	<div class="result">
		<div class="">
			<div class="bg-white ta-c pt35 pb30">
				<img src="../../assets/icons/team/icon_right@3x.png" height="95" width="76">
				<p class="fw-b ft22 mt20 mb10">提交成功！</p>
				<p class="cl-gray ft15">提现申请已提交，预计2个工作日内到账</p>
			</div>
			<div class="mt40 plr25">
				<van-button round type="primary" block @click="goTeam">返回团队首页</van-button>
			</div>
			<p class="cl-orange ft14 pos-f l0 r0 ta-c" style="bottom: 23px;"><span @click="goNotes">提现记录</span></p>
		</div>
	</div>
</template>
<script>
export default {
	// 团队成员
	name: 'teamResult',
	methods: {
		goTeam() {
			btPage.open({
				url: '/team',
				params: { type: 1 },
				container_style: 1,
				type: 3
            });
		},
		goNotes() {
			btPage.open({
                url: '/team/team_note',
				container_style: 1,
				type: 3
            });
		},
		setHead() {
			var self = this;
			this.$store.dispatch("setHead", {
				menuContent: `<div class="menu"></div>`,
				needBack: false,
				back: () => {
					btPage.open({
						url: "/team",
						container_style: 1,
						type: 3
					});
				}
			});
		}
	},
	mounted() {
		setPageTitle('提交成功');
		
		this.setHead()
		wv.customBackAction(function() {
			btPage.open({
				url: "/team",
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