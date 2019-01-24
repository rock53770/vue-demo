<template>
    <div class="container">
		<div class="demo-wrapper">
			<h3 class="half-border">vue demo页 <a class="official" href="https://vux.li/#/zh-CN/components" target="_blank">查看vux官方</a></h3>
			<group>
				<cell title="首页" value="value" is-link link="/">
				</cell>
				<cell-box is-link @click.native="openMix()">
					综合调试mix
				</cell-box>
				<cell-box link="/demo/btPage">
					btPage演示
				</cell-box>
				<cell-box link="/demo/btScroller">
					滚动列表页
				</cell-box>
				<cell-box is-link link="/demo/btPickArea">
					省市区选择
				</cell-box>
				<cell-box is-link link="/demo/btUploader">
					文件上传
				</cell-box>
			</group>
			<div class="see-box">
				<p>计数：{{num}}<button @click="addNum">增加</button></p>
			</div>
		</div>
    </div>
</template>
<script>
import { Group, Cell, CellBox } from 'vux'
export default {
//     name: 'HelloWorld',
    data() {
        return {
			num: 1
		}
    },
//     computed: {
//         isIndex() {
//             return true;
//         }
//     },
    methods: {
		addNum(){
			this.num++;
		},
		openMix(){
			this.$btPage.openFull({
				url: '/demo/mix'
			});
		}
	},
    beforeMount() {
        this.$setTitle('vue demo页')
    },
//     beforeMount() {
//         this.$setTitle('demo')
//     },
//     mounted() {},

    components: {
        Group,
        Cell,
        CellBox
    }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
@import "~@/less/variables.less";
.demo-wrapper {
    padding: 10px;
    h3 {
        background-color: #fff;
        padding: 10px;
    }
	.see-box{
		padding: 15px;
		button{
			margin-left: 10px;
			border: 1px solid #ccc;
			border-radius: 2px;
			padding: 3px 10px;
			background: #fff;
		}
	}
}
</style>
