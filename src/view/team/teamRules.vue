<template>
	<div class="teamRules">
        <img src="../../assets/icons/team/bg_rule@3x.png" class="w-100">
        <div class="plr12 moveTop">
            <div class="bg-white bdr5 plr20 pt15 pb15">
                <div class="flex-center justify-c mb20">
                    <img src="../../assets/icons/team/icon_rule_line@3x.png" height="18" width="18">
                    <span class="plr12">团队管理津贴</span>
                    <img src="../../assets/icons/team/icon_rule_line@3x.png" height="18" width="18">
                </div>
                <img src="../../assets/icons/team/images_rule_character@3x.png" class="w-100">
                <div class="mt10 flex-center bd">
                    <div class="grow-1 ta-c">
                        <img src="../../assets/icons/team/icon_rule_hb@3x.png" width="40">
                        <p>我的奖励</p>
                    </div>
                    <div class="grow-3 ft13 bd-l">
                        <section class="pl10 pt4 pb4 bd-b">
                            <p class="cl-blue">一级推荐出单</p>
                            <p>获得商业险报废<span class="cl-red fw-b">1.0%</span>奖励</p>
                        </section>
                        <section class="pl10 pt4 pb4">
                            <p class="cl-blue">一级推荐出单</p>
                            <p>获得商业险报废<span class="cl-red fw-b">1.0%</span>奖励</p>
                        </section>
                    </div>
                </div>
            </div>
            <div class="bg-white bdr5 plr20 pt15 pb15 mt12">
                <div class="flex-center justify-c mb20">
                    <img src="../../assets/icons/team/icon_rule_line@3x.png" height="18" width="18">
                    <span class="plr12">团队奖励规则</span>
                    <img src="../../assets/icons/team/icon_rule_line@3x.png" height="18" width="18">
                </div>
                <section class="cl-dgre ft13">
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">1</span></div>
                        <p>本奖励规则，从2018年12月13日起正式实施，新欣保有权对奖励规则进行完善和提升。</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">2</span></div>
                        <p>开启团队需要完成两项任务： <br>任务一：新增推荐10位新用户完成注册 <br>任务二：完成1单商业险出单（以XXXX日后实际车险出单为准）</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">3</span></div>
                        <p>团队人数不设上限，成团奖励仅限领取一次，团队管理津贴（成员出单提成）为长期激励。本级成员出单，团长可获商业险保费1.0%奖励；下级成员出单，团长可获商业险保费0.5%奖励。</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">4</span></div>
                        <p>成团奖励和出单奖励实时到账，团队账户金额超过100.00元可提现，1-2个工作日内可到账。</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">5</span></div>
                        <p>同一登录账号、同一手机号、同张提现银行卡等系统判定为同一用户的情形，均视为同一用户。</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">6</span></div>
                        <p>如果存在但不限于以下行为：恶意邀请、刷单、作弊等，一经发现立即取消资格，并追回已获得奖励。</p>
                    </div>
                    <div class="flex mb10">
                        <div class="mr10"><span class="show h20 w20 lh20 ta-c bg-orange cl-white bdr-50">7</span></div>
                        <p>本奖励规则最终解释权归新欣保所有。若有疑问，可致电客服咨询400-603-8787。</p>
                    </div>
                </section>
            </div>
        </div>
	</div>
</template>
<script>
import teamService from '../../api/teamService'
export default {
    name: "teamRule"
}
</script>
<style lang="less" scoped>
.teamRules {
    background-color: #FDCA89;
    .moveTop {
        transform: translateY(-10px)
    }
    .bd {
        border: 1px solid #F0B688;
    }
    .bd-l {
        border-left: 1px solid #F0B688;
    }
    .bd-b {
        border-bottom: 1px solid #F0B688;
    }
    .cl-dgre {
        color: #666666;
    }
}
</style>

