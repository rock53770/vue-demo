<template>
    <div class="balanceIn">
        <btScroller :getData="getData" :currentPage.sync="pageIndex" ref="bIn">
            <div>
                <!-- 列表主体 -->
                <div class="container bg-white mt10" v-for="item in dataList" :key="item.id">
                    <div class=" flex-center justify-sb h45 van-hairline--bottom plr12 cl-orange ft16">
                        <p class="flex-center justify-sb">{{item.flowVoTypeContent}}</p>
                        <p class="flex-center justify-sb" v-if="item.money">{{item.money|currency2('￥',2)}}</p>
                    </div>
                    <div class="cl-gray van-hairline--bottom" v-if="item.flowVoTypeValue!==8">
                        <div class="item-user-name flex-center justify-sb h45 plr12">
                            <p>车主姓名：{{item.ownerName}}</p>
                        </div>
                        <div class="plr12 pt8 pb8">
                            <p class="flex-center justify-sb mb8"><span>车牌号：{{item.plate}}</span></p>
                        </div>
                    </div>
                    <div class="cl-gray van-hairline--bottom" v-else>
                        <div class="item-user-name flex-center justify-sb h45 plr12">
                            <p>投保人姓名：{{item.ownerName}}</p>
                        </div>
                        <div class="plr12 pt8 pb8">
                            <p class="flex-center justify-sb mb8"><span>产品名：{{item.goodsName}}</span></p>
                        </div>
                    </div>
                    <div class=" flex-center justify-sb h45 plr12 cl-gray">
                        <p class="flex-center justify-sb">{{$util.formatDate(item.createTime, 'yyyy-MM-dd HH:mm')}}</p>
                        <p class="flex-center justify-sb lh45" :class="cl(item)">{{item.stateContent}}</p>
                    </div>
                </div>
            </div>
            <!-- 无结果 -->
            <div class="no-data-box empty" slot="empty">
                <img src="../../components/btScroller/data-no.png" height="95" width="140">
                <p class="mt20">还没有收支记录哟，快去下单赚奖励吧~</p>
            </div>
        </btScroller>
    </div>
</template>
<script>
import btScroller from "@/components/btScroller";
import achieveService from "@/api/achieveService";

export default {
    name:'balanceIn',
    data() {
        return{
            name:'balanceIn',
            pageIndex:1,
            pageSize:5,
            flowType:1,
            dataList:[]
        }
    },
    props:['start','end'],
    components:{
        btScroller
    },
    methods:{
        cl(item){
            let className = '';
            switch(item.state){
                case 3: className = 'cl-darkblue';break;
                case 5: className = 'cl-red';break;
                case 6: className = 'cl-lightorange';break;
                default:className = '';
            }
            return className
        },
        sch(){
            this.pageIndex = 1;
            this.$refs.bIn.triggerRefresh();
        },
        getData(curPage){
            let $promise = achieveService.balanceFlow({
                startTime:parseInt(+this.start),
                endTime:parseInt(+this.end),
                pageIndex:this.pageIndex,//当前页面传参
                pageSize:this.pageSize,
                flowType:this.flowType,
            });
            $promise.then((res)=>{
                if(res.code && res.code === 1){
                    if(res.object){
                        if(this.pageIndex==1){
                            this.dataList = res.object;
                        }else{
                            this.dataList = this.dataList.concat(res.object);
                        }
                    }
                }else{
                    Toast(res.message);
                }
            })
            return $promise;
        }
    }
}
</script>
<style lang="less" scoped>
    .scroller-box {
        flex: 1;
    }
    .cl-darkblue{
        color: #0099FF;
    }
    .cl-lightorange{
        color: #FF9933;
    }
</style>
