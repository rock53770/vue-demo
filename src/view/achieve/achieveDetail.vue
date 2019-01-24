
<template>
    <div class="achieveDetail">
        <div class="bg-white ft16 mb10">
            <div class="h70 flex-center ta-c pt10 pb6">
                <div class="flex-1 h-100 line-r">
                    <p class="ft14 cl-gray mb10">总保费(元)</p>
                    <p class="cl-orange">{{totalData.premium}}</p>
                </div>
                <div class="flex-1 h-100">
                    <p class="ft14 cl-gray mb10">总单数(单)</p>
                    <p class="cl-orange ft18">{{totalData.number}}</p>
                </div>
            </div>
            <div class="h50 van-hairline--top-bottom flex-center plr12 justify-sb ta-c">
                <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(0)">{{ $util.formatDate(start, 'yyyy-MM-dd') }}</div>
                <span class="cl-gray">至</span>
                <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(1)">{{ $util.formatDate(end, 'yyyy-MM-dd') }}</div>
                <button class="bg-orange cl-white w60 h30 bdr3">查询</button>
            </div>
        </div>
        <btScroller :getData="getData" :currentPage.sync="pageIndex">
            <div v-if="dataList.length>0">
                <!-- 列表主体 -->
                <div class="container bg-white mt10" v-for="item in dataList" :key="item.id">
                    <div>
                        <div class="item-user-name flex-center justify-sb h45 van-hairline--bottom plr12">
                            <p>被保人：李先生</p>
                            <!-- <span class="cl-gray f12">{{ $util.formatDate(item.createTime, 'yyyy-MM-dd hh:mm') }}</span> -->
                            <span class="cl-gray f12">{{item.time}}</span>
                        </div>
                        <div class="van-hairline--bottom plr12 ft14 pt8 pb8 ft14">
                            <p class="flex-center justify-sb mb8"><span>保险名称：{{item.insName}}</span><span>¥{{item.insMoney}}</span></p>
                            <p class="flex-center justify-sb"><span>投保车辆：{{item.car}}</span><span class="cl-orange">{{item.money}}</span></p>
                        </div>
                    </div>
                    <div class="h45 plr12 ta-l">
                        <p class="lh45 cl-orange">{{item.status}}</p>
                    </div>
                </div>
            </div>
            <!-- 无结果 -->
            <div class="ta-c bg cl-gray" style="padding-top: 50px;" v-else>
                <img src="../../assets/images/order_no_list.png" height="95" width="140">
                <p class="mt20">您还没有完成的订单</p>
            </div>
        </btScroller>
        <van-popup v-model="dateShow" position="bottom" :overlay="true">
            <van-datetime-picker v-model="currentDate" type="date" @confirm="confirm" @cancel="cancel"/>
        </van-popup>
    </div>
</template>

<script>
import btScroller from "@/components/btScroller";
import achieveService from "@/api/achieveService";

export default {
    name: 'achieveDetail',
    data() {
        return {
            dateShow: false,
            timeSelect: null, // 0：start | 1: end
            currentDate: new Date(),
            start: new Date(),
            end: null,
            now: new Date(),
            pageIndex:1,
            pageSize:5,
            totalData:this.$route.query,
            dataList:[
                {
                    id:'1111',
                    type:'1',//收入1 or 支出2
                    name:'李先生',
                    time:'2017-03-12',
                    insName:'阳光保险',
                    insMoney:'23456',
                    car:'苏KW027D',
                    money:'3000.00+500.00',
                    status:'已完成'
                },
                {
                    id:'2222',
                    type:'2',//收入1 or 支出2
                    name:'李先生',
                    time:'2017-03-14 11:35',
                    insName:'阳光保险',
                    insMoney:'23456',
                    car:'苏KW027D',
                    money:'1234.00',
                    status:'处理中'
                }
            ]
        }
    },
    components:{
        btScroller
    },
    methods: {
        /**
         * 时间选择
         * @target 为得知当前选择为开始/结束时间
         * @return 开启datepicker & 确认时间状态
         */
        selectTime (n) {
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
                endtype = value - this.start >= 0 ? true : false

            this.dateShow = false
            if (this.timeSelect) {
                if (endtype) {
                    this.end = this.currentDate
                } else {
                    Toast('结束时间不可晚于今天。'); 
                }
            } else {
                if (starttype) {
                    this.start = this.currentDate
                } else {
                    Toast('起始时间不可晚于今天。');
                }
            }
        },
        cancel() {
            this.dateShow = false
        },
        getData(){
            return achieveService.balanceFlow({
                startTime:this.start,
                endTime:this.end,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize,
            }).then((res)=>{
                if(res.code && res.code === 1){
                    if(res.object && res.object.BalanceFlowDetailBo){
                        Toast('来自前端---接口还在开发');
                        return res;
                    }
                }else{
                    Toast(res.message);
                }
            })
        }

    },
    mounted() {
        setPageTitle('业绩明细');
    }
}
</script>

<style lang="less" scoped>
.achieveDetail {
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
    .scroller-box {
        flex: 1;
        top: 120px;
    }
}
</style>

