
<template>
    <div class="balanceDetail h-100">
        <div class="h-100">
            <div class="h50 flex-center plr12 justify-sb ta-c bg-white">
                <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(0)">{{ $util.formatDate(start, 'yyyy-MM-dd') }}</div>
                <span class="cl-gray">至</span>
                <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(1)">{{ $util.formatDate(end, 'yyyy-MM-dd') }}</div>
                <button class="bg-orange cl-white w60 h30 bdr3 u-sch" @click="search()">查询</button>
            </div>
            <van-tabs v-model="tabsIndex" :swipe-threshold="3" @click="tabChange">
                <van-tab v-for="(item,index) in tabs" :title="item.title" :key="index">
                    <keep-alive>
                        <component :is="cmpName" :start="start" :end="end" ref="keepC"></component>
                    </keep-alive>
                </van-tab>
            </van-tabs>
        </div>
        <van-popup v-model="dateShow" position="bottom" :overlay="true">
            <van-datetime-picker v-model="currentDate" type="date" @confirm="confirm" @cancel="cancel"/>
        </van-popup>
    </div>
</template>

<script>
import achieveService from "@/api/achieveService";
import balanceAll from "@/view/achieve/balanceAll.vue";//全部
import balanceOut from "@/view/achieve/balanceOut.vue";//支出
import balanceIn from "@/view/achieve/balanceIn.vue";//收入

export default {
    name: 'balanceDetail',
    data() {
        return {
            tabs: [
                { title: "全部"},
                { title: "收入"},
                { title: "支出"}
            ],
            tabName:"All",
            tabsIndex: 0,
            timeSelect: null, // 0：start | 1: end
            dateShow: false,
            currentDate: new Date(),
            start: new Date(+new Date()-1000*60*60*24*30),
            end: new Date(),
            now: new Date(),
            refresh:[false,false,false]//控制tab切换是否刷新数据
        }
    },
    computed: {
        cmpName(){
            return 'balance'+this.tabName;
        }
    },
    components:{
        balanceAll,
        balanceOut,
        balanceIn
    },
    methods: {
        tabChange(index, title){//tab切换走请求
            if(this.refresh[index]){
                this.$nextTick(function () {//确保子组件dom加载完成
                    this.$refs.keepC[0].sch();
                })
                this.refresh[index]=false;
            }
            switch(index){
                case 1: this.tabName = "In";
                    break;
                case 2: this.tabName = "Out";
                    break;
                default:this.tabName = "All";
            }
        },
        /**
         * 时间选择
         * @target 为得知当前选择为开始/结束时间
         * @return 开启datepicker & 确认时间状态
         */
        selectTime (n) {
            if(n){
                this.currentDate = this.end;
            }else{
                this.currentDate = this.start;
            }
            this.dateShow = true
            this.timeSelect = n
        },
        /**
         * 时间确认
         * @target 当前日期不可大于今天，结束时间不可早于起始时间
         * @param [Date] picker所选中的日期对象
         */
        confirm(value) {
            let starttype = this.now - value >= 0 ? true : false,
                endtype = this.now - value >= 0 ? true : false;
            this.dateShow = false
            if (this.timeSelect) {//结束时间
                if (endtype) {
                    if(this.currentDate<this.start){
                        Toast('结束时间不可早于起始时间');
                    }else{
                        this.end = this.currentDate
                    }
                } else {
                    Toast('结束时间不可晚于今天');
                }
            } else {//开始时间
                if (starttype) {
                    if(this.currentDate>this.end){
                        Toast('起始时间不可晚于结束时间');
                    }else{
                        this.start = this.currentDate
                    }
                } else {
                    Toast('起始时间不可晚于今天');
                }
            }
        },
        cancel() {
            this.dateShow = false
        },
        search(){//点击查询全部子组件重新请求接口
            let keepChild = this.$refs.keepC;
            this.$nextTick(function () {//确保子组件dom加载完成
               keepChild[0].sch();
            })
            for(let i=0;i<3;i++){
                if(i!=this.tabsIndex){
                    this.refresh[i] = true;
                }
            }
        }
    },
    mounted() {
        setPageTitle('收支明细')
    }
}
</script>

<style lang="less" scoped>
.balanceDetail {
    .van-tabs {
        display: flex;
        flex-direction: column;
        position: absolute;
        height: calc( 100vh - 50px);
        width: 100%;
        /deep/ .van-tabs__line{
            background-color: #fc6b47;
        }
        /deep/ .van-tab span.van-ellipsis{
            font-size: 16px;
        }
        /deep/ .van-tab.van-tab--active span.van-ellipsis{
            color: #fc6b47;
            font-weight: bold;
        }
        .van-tab__pane {
            position: absolute;
            left: 0;
            right: 0;
            width: 100%;
            height: calc(~'100% - 44px');
        }
    }
    .line-r {
        position: relative;
        &::after {
            content: '';
            display: block;
            position: absolute;
            top: 10px;
            right: 0;
            height: 30px;
            width: 1px;
            background-color: #e0e0e0;
        }
    }
    .u-sch{
        background:linear-gradient(270deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
    }
}
</style>

