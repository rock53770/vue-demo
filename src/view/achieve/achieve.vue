<template>
    <div class="achieve">
        <div class="m-list pos-r">
            <btScroller :getData="getData" :currentPage.sync="pageIndex" ref="ach">
                <div slot="keep">
                    <div class="m-header cl-white ta-c pos-r">
                        <div class='u-total'>
                            <span>总收入(元)</span>
                            <p>{{mainData.amountTotalIncome|currency2('',2)||"0.00"}}</p>
                        </div>
                        <div class="u-other flex-center">
                            <div class="u-insFee line-r w-50">
                                <span>总保费(元)</span>
                                <p class="ft16">{{mainData.premiumTotalOrder|currency2('',2)||"0.00"}}</p>
                            </div>
                            <div class="u-insDeal w-50">
                                <span>总保单(单)</span>
                                <p class="ft16">{{mainData.numberTotalOrder||"0"}}</p>
                            </div>
                        </div>
                        <img src="~@/assets/images/Group6@3x.png" alt="" class="w-100">
                    </div>
                    <div class="h50 bg-white pos-r">
                        <div class="h50 bg-white flex-center plr12 justify-sb ta-c w-100 m-date">
                            <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(0)">{{ $util.formatDate(start, 'yyyy-MM-dd') }}</div>
                            <span class="cl-gray">至</span>
                            <div class="lh30 h30 w100 van-hairline--surround cl-gray" @click="selectTime(1)">{{ $util.formatDate(end, 'yyyy-MM-dd') }}</div>
                            <button class="bg-orange cl-white w60 h30 bdr3 u-sch" @click="sch()">查询</button>
                        </div>
                    </div>
                </div>
                <div>
                    <!-- 列表主体 -->
                    <div class="container bg-white mt10" v-for="item in dataList" :key="item.orderId">
                        <div class=" flex-center justify-sb h45 van-hairline--bottom plr12 cl-orange ft16 fw-b">
                            <p class="flex-center justify-sb">车险投保奖励</p>
                            <p class="flex-center justify-sb" v-if="item.rebateAmount">{{(item.orderType==1||item.orderType==2||item.orderType==3)&&item.rebateAmount?"+":""}}{{item.rebateAmount|currency2('',2)}}</p>
                        </div>
                        <div class="cl-gray f14" v-if="!item.word">
                            <div class="item-user-name flex-center justify-sb h30 plr12">
                                <p class="flex-center justify-sb">保单详情:{{item.companyName}}</p>
                                <p class="flex-center justify-sb" v-if="item.totalPremium">{{item.totalPremium|currency2('',2)}}</p>
                            </div>
                            <div class="item-user-name flex-center justify-sb h30 plr12">
                                <p class="flex-center justify-sb">投保人：{{item.insurantName}}</p>
                            </div>
                            <div class="item-user-name flex-center justify-sb h30 plr12">
                                <p class="flex-center justify-sb">车牌号:{{item.plate}}</p>
                            </div>
                        </div>
                        <div class="cl-gray f14" v-else>
                            <div class="item-user-name flex-center justify-sb h45 van-hairline--bottom plr12">
                                <p class="flex-center justify-sb">{{item.word}}</p>
                            </div>
                        </div>
                        <div class=" flex-center justify-sb h45 van-hairline--top plr12">
                            <p class="flex-center justify-sb cl-gray">{{$util.formatDate(item.insuredTime, 'yyyy-MM-dd HH:mm')}}</p>
                            <p class="flex-center justify-sb lh45 s-status">{{item.isFrozen?"已冻结":"已发放"}}</p>
                        </div>
                    </div>
                </div>
                <!-- <div class="no-data-box anomaly" style="padding-top: 26%;z-index:-1;" v-else-if="netError" slot="anomaly">
                    <img src="../../components/btScroller/nodata.png" height="113" width="104">
                    <p>网络超时</p>
                    <p class="refresh" @click="sch()">重新加载</p>
                </div> -->
                <div class="ta-c bg cl-gray mt40" slot="empty">
                    <img src="../../assets/images/order_no_list.png" height="95" width="140">
                    <p class="mt20">您还没有订单成交哟，快去下单吧～</p>
                </div>
            </btScroller>
        </div>
        <van-popup v-model="dateShow" position="bottom" :overlay="true">
            <van-datetime-picker v-model="currentDate" type="date" @confirm="confirm" @cancel="cancel"/>
        </van-popup>
        <footerBar path="achieve"></footerBar>
    </div>
</template>
<script>
    import footerBar from "@/components/Footer";
    import achieveService from "@/api/achieveService";
    import btScroller from "@/components/btScroller";

    export default {
        name: "achieve",
        data() {
            return {
                count:1,
                dateShow: false,
                timeSelect: null, // 0：start | 1: end
                currentDate: new Date(),
                start: new Date(+new Date()-1000*60*60*24*30),
                end: new Date(),
                now: new Date(),
                pageIndex:1,
                pageSize:5,
                totalData:this.$route.query,
                mainData:{},
                dataList:[],
                netError:false,
            }
        },
        components:{
            btScroller,
            footerBar
        },
        methods:{
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
            getHomeData(){
                achieveService.home()
                    .then((res)=>{
                    if(res.code && res.code===1){
                        if(res.object && res.object.achievementVo) {

                            for(let [k,v] of Object.entries(res.object.achievementVo)){
                                this.$set(this.mainData, k, v)
                            }
                            this.mainData.amountTotalIncome=res.object.achievementVo.amountTotalIncome;
                            this.mainData.premiumTotalOrder=res.object.achievementVo.premiumTotalOrder;
                            this.mainData.numberTotalOrder=res.object.achievementVo.numberTotalOrder;
                        }
                    }else{
                        Toast(res.message)
                    }
                })
            },
            sch(){
                this.pageIndex = 1;
                this.$refs.ach.triggerRefresh();

            },
            getData(){
                let $promise = achieveService.achieveFlow({
                    startTime:parseInt(+this.start),
                    endTime:parseInt(+this.end),
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize,
                });
                $promise.then((res)=>{
                    if(res.code && res.code === 1){
                        this.netError = false;
                        if(res.object && res.object){
                            if(this.pageIndex==1){
                                this.dataList = res.object;
                            }else{
                                this.dataList = this.dataList.concat(res.object);
                            }
                        }
                    }else{
                        this.netError = true;
                        Toast(res.message);
                    }
                })
                return $promise
            }
        },
        mounted(){
            setPageTitle('业绩');
            wv.customBackAction(()=> {
              if(this.count == 2){
                btPage.goBack(100);
              } else {
                Toast("再按返回退出")
                this.count++;
                setTimeout(()=>{
                  this.count = 1;
                },2000)
              }
            });
            wv.setWebViewInfo({
              wvBackDisable:1
            })
            this.getHomeData();
        }
    }
</script>
<style lang="less" scoped>
    .achieve{
        height: calc(100vh - 50px);
        .m-header{
            box-sizing: border-box;
            background: url(~@/assets/images/achieve_bg@3x.png) no-repeat top center;
            background-size: 100%;
            height: 204px;
            padding-top:24px;
            .u-total{
                margin-bottom: 26px;
                span{
                    color:#FFFFCFC4;
                }
                p{
                    font-size: 40px;
                }
            }
            .u-other{
                >div{
                    width: 50%;
                }
                span{
                    color:#FFFFCFC4;
                    font-size: 11px;
                }
                .line-r {
                    position: relative;
                    &::after {
                        content: '';
                        display: block;
                        position: absolute;
                        top: 5px;
                        right: 0;
                        height: 30px;
                        width: 1px;
                        background-color:#FFFFCFC4;
                    }
                }
            }
            img{
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
        .m-date{
            margin-bottom: 10px;
        }
        .m-list{
            height: 100%;
            .s-status{
                color: #FF9933;
            }
        }
        .s-fixed{
            position: fixed!important;
            left: 0;
            right:0;
            z-index: 99;
        }
        .u-sch{
            background:linear-gradient(270deg,rgba(255,133,38,1) 0%,rgba(252,107,71,1) 100%);
        }
    }
</style>

