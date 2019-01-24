<template>
    <div class="btPage-wrapper">
		<x-header v-if="$root.isShowHead">btPage调用案例</x-header>
        <p>这只是一个普通的vue demo页面，没有引入router，router应用的demo请用对应项目的demo页面进行查看</p>
        <p style="color:red;">非router的页面不建议使用传url的方式加载，因为是用iframe方式去加载，对体验会有影响，当然，实在要用我也已经实现了</p>
        <div class="wrapper">
            <!-- <h2>当前第{{num}}个页面<span bt-sref="/demo/webDialog/index?num={{num + 1}}">再开个页面</span></h2> -->
            <ol>
                <li>
                    <span @click="openPhotoDialog1()">open--普通跳转(该方式wap端无法回调)</span>
                </li>
                <li>
                    <span @click="openPhotoDialog4()">openFull--全屏（这在wap端表现也是一个webModel）</span>
                </li>
                <li>
                    <span @click="openPhotoDialog5()">openFull--全屏入栈方式打开窗口（不透明）</span>
                </li>
                <li>
                    <span @click="openPhotoDialog2()">openModal--传url</span>
                    <div></div>
                    <!-- <div>如果不是router应用，btPage暂时不支持这样调用。因为需要iframe去实现，回调也是个问题，so没实现的意义，如果一定要分建议用require去引入对应的controller和view进行调用</div> -->
                </li>
                <li>
                    <span @click="openPhotoDialog3()">openModal--传组件</span>
                </li>
            </ol>
            <div>
                <p>子级页面取得的值1：{{param1}}</p>
                <p>子级页面取得的值2：{{param2}}</p>
            </div>
            <div>
                <p>模态窗的传参--字符串：{{testStr}}</p>
                <p>回调了：{{count}}次</p>
            </div>
        </div>
    </div>
</template>
<script>
import { XHeader } from 'vux';
import modalComponent from './modal.vue'
export default {
    data() {
        return {
            param1: '',
            param2: '',
            testStr: '',
            count: 0
        }
    },
	beforeMount() {
		this.$setTitle("btPage调用案例");
	},
    mounted: () => {
    },
    methods: {
        //页面后退回调
        resumeFunc (data) {
            var _this = this;
            if(data){
                // console.log(data);
                _this.param1 = data.aa;
                _this.param2 = data.bb;

                if(data.testStr){
                    _this.testStr += data.testStr;
                }

                if(data.skipPath){
                    _this.$btPage.open(data.skipPath);
                }
            } else{
                alert('没有传参');
            }
            _this.count++;
        },
        openPhotoDialog1(){
            var _this = this;
            _this.$btPage.open({
                url: "/demo/btPage/modal",
                jsOnResume: _this.resumeFunc
            });
        },
        //openFull---全屏方式打开窗口
        openPhotoDialog4(){
            var _this = this;
            _this.$btPage.openFull({
                url: "/demo/btPage/modal?test_param=4342",
                jsOnResume: _this.resumeFunc,
                isTransparent: true
            });
        },
        //openFull---全屏入栈方式打开窗口（不透明）
        openPhotoDialog5(){
            var _this = this;
            _this.$btPage.openFull({
                url: "/demo/btPage/modal?test_param=abc",
                jsOnResume: _this.resumeFunc,
                isTransparent: false//可以不传，默认不透明
            });
        },
        // openModal---传url
        openPhotoDialog2(){
            var _this = this;
            _this.$btPage.openModal({
                url: "/demo/btPage/modal",
                params: {
                    test_param: "abc",
                    fdsaf: '324'
                },
                jsOnResume: _this.resumeFunc,
                animateClass: 'an-slideDown'
            })//h5模态窗口
        },

        openPhotoDialog3(){
            let _this = this;

            // //这个也可以单独写到某个文件引入，如果有打包器的话
            // var subComponent = {
            //     data:{
            //         param1: 'aaa'
            //     },
            //     mounted(){
            //         console.log("ffffffff",  this.param1)
            //     },
            //     template: `<div style="background:red;>
            //         哈哈哈哈哈
            //     </div>`,
            //     // render: () => {

            //     // }
            // };

            _this.$btPage.openModal({
                component: modalComponent,
                params: {
                    test_param: "abc",
                    fdsaf: '324'
                },
                jsOnResume: _this.resumeFunc,
                animateClass: 'an-slideDown'
            })//h5模态窗口
        }
    }
}
</script>
<style lang="less">
	.btPage-wrapper{
		padding: 10px;
		background: #F8F8F8;
		h2{
			/* padding-bottom: 30px; */
		}
		h2 a{
			margin-left:10px;
		}
		ol{
			padding-left: 25px;
		}
		p{
			margin: 15px 0;
		}
		ol li{
			margin-bottom: 15px;
		}
		a{
			text-decoration: none;
			color: #558EC4;
			font-size: 14px;
		}
		.wrapper{
			margin-top: 10px;
		}
		.webDialog-wrapper .tip{
			width: 100%;
			padding: 13px 15px;
			line-height: 1.5;
			color: #333333;
			font-size: 12px;
			position: relative;
			z-index: 1;
		}
		.webDialog-wrapper .action-btns{
			width: 100%;
		}
		.webDialog-wrapper .action-btns .btn{
			display: block;
			text-align: center;
			line-height: 45px;
			border-top: 1px solid #e2e2e2;
		}
	}
</style>
