<template>
	<div class="modal-wrapper">
    	<div class="mask"></div>
		<div class="content">
			<p>我只是一个很普通的jquery页面</p>
			<p>test_param传参值：{{test_param}}</p>
			<div class="photo"></div>
			<div class="action-btns">
				<a class="btn" @click="call1()">返回1步，传参数111</a>
				<a class="btn" @click="call2()">返回1步，传参数222</a>
				<a class="btn" @click="call3()">返回2步，传参数222</a>
				<!-- <a class="btn" @click="skipToOther()">关闭模态窗，并且跳转到其它页面</a> -->
				<a class="btn" @click="openAnther()">再弹个webModal</a>
				<a class="btn" @click="cancel()">取消</a>
			</div>
		</div>
	</div>
</template>
<script>
export default {
    data() {
        return {
            test_param: this.$route.query.test_param
        }
    },
    methods: {
        call1() {
            btPage.goBack({
                args: {aa: 111, bb: "小黄豆111", testStr: "豆"}
            });
        },
        call2() {
            btPage.goBack({
                args: {aa: 222, bb: "小黄豆222"}
            });
        },
        call3() {
            btPage.goBack({
                step: 2,
                args: {aa: 222, bb: "小黄豆222"}
            });
        },
        // skipToOther(){
        //     btPage.goBack({
        //         step: 1,
        //         args: {skipPath: '/'}
        //     });
        // },
        //,
        cancel(){
            btPage.goBack();

            // btPage.close();
        },
        //再打开,
        openAnther(){
            btPage.openModal({
                url: "/demo/bt_page/modal",
                jsOnResume: function(data){
                    alert("来自modal页面的回调提示：" + JSON.stringify(data));
                }
            });
        }
    },
    mounted(){
    }
}
</script>
<style lang="less">
    .modal-wrapper{
		.content{
			position: absolute;
			z-index: 999;
			top: 50%;
			left: 50%;
			background: #ffffff;
			border-radius: 13px;
			width: 280px;
			margin-left: -140px;
			margin-top: -200px;
		}
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			background: rgba(0, 0, 0, 0.5);
		}
		.tip{
			width: 100%;
			padding: 13px 15px;
			line-height: 1.5;
			color: #333333;
			font-size: 12px;
			position: relative;
			z-index: 1;
		}
		.action-btns{
			width: 100%;
		}
		.action-btns .btn{
			display: block;
			text-align: center;
			line-height: 45px;
			border-top: 1px solid #e2e2e2;
		}
		p{
			padding: 10px;
		}
	}
</style>
