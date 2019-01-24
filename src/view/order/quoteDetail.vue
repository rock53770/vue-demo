<template>
    <div class="quoteDetail">
        <template v-if="!isLoading">
             <div class="notice-bar plr20 flex-center justify-sb">
                <span>标黄险种为已选不计免赔</span>
            </div>
            <div class="h65 bg-white flex-center plr5 arrow-block-right" @click="gopage('/order/car_detail',{id:dataObject.id})">
                <img src="../../assets/icons/car-icon.png" width="50" class="mr15">
                <div class="ft14 lh22">
                    <p>{{ hasUserCarMsg ? dataObject.ownerName : '暂无车牌信息' }}</p>
                    <p class="cl-dgray">{{ hasUserCarMsg ? dataObject.plate : '暂未获取到车型信息' }}</p>
                </div>
            </div>
            <div class="lists wh-100 plr12 pt10 outer-over">
                <div class="bg-white mt10 pt12 bdr3 outer-shadow" v-for="(item, index) in dataObject.orderQuotationVos" :key="index"
                    @click="goOrderDetail(item.showDetails, item.id)" :style="{ 'pointer-events': item.showDetails ?'auto':'none'}">
                    <div class="flex pl12 pr5 pb10 van-hairline--bottom">
                        <img :src="item.icon" width="54" height="54" class="bdr-50" style="border: 1px solid #eeeeee;">
                        <section class="ft16 flex-1 ml10">
                            <div :class="['flex-center','justify-sb','ft16','lh30', item.showDetails ? 'arrow-block-right ': '', 'name']">
                                <div class="ft16">
                                    <span>{{ item.companyName }}</span>
                                    <span class="cl-orange" v-if="item.price">{{ item.price|currency('￥','2') }}</span>
                                </div>
                                <div class="cl-orange mr20 ft14 type ta-r">{{ item.handlerStatusName }}</div>
                            </div>
                            <div v-if="!item.isRemark">
                                <span :class="['ft13', i.additionalInsuranceType ? 'yellow': 'cl-gray']" v-for="(i, x) in item.quoteInsurances" :key="x">
                                    <span>{{ i.insuranceName }}</span>
                                    <span v-if="i.coverageText !== '0万'">{{ i.coverageText }}</span>;
                                </span>
                            </div>
                            <div v-else>
                                <span class="cl-gray">{{ item.remark }}</span>
                            </div>
                        </section>
                    </div>
                    <div class="flex-center justify-sb h45 plr12">
                        <p class="cl-gray">{{ $util.formatDate(item.handlerTime, 'yyyy-MM-dd HH:mm') }}</p>
                        <button v-if="item.actionType" class="w65 h28 ft13 cl-white bdr3 van-button--primary" @click="goOrderDetail(item.action, item.id)">{{ item.actionType == 1? '立即核保':'立即投保' }}</button>
                    </div>
                </div>
            </div>

            <div class="pos-f b0 l0 r0 h70 bg-white p10 btn-shadow" v-if="dataObject.showAdd">
                <van-button round type="default" block class="cl-white ft16 van-button--primary" @click="addNewObject()">新增报价单</van-button>
            </div>

            <van-popup v-model="addObjectShow" position="bottom" :overlay="true" :lock-scroll="true">
                <div style="background:#f5f5f5;">
                    <div @click="goChooseInsType(item.id)"
                        v-for="(item, index) in orderCompany" :key="index"
                        class="bg-white van-hairline--bottom h50 lh50 pl12">
                        <p class="h50 lh50 ft16">{{ item.companyName }}</p>
                    </div>
                    <div class="h50 bg-white lh50 ft16 ta-c cl-gray mt10" @click="addObjectShow = false">取消</div>
                </div>
            </van-popup>
        </template>
        <!-- animation Loading -->
        <template v-if="isLoading">
            <div class="Gspinner" >
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </template>
    </div>
</template>
<script>
import orderService from '@/api/orderService';
import quoteService from '@/api/quoteService';
import { setTimeout } from 'timers';

export default {
    name: 'quoteDetail',
    data () {
        return {
            dataObject: {},
            hasUserCarMsg: null, // 是否存车辆信息
            // isProduceShow: false, //产品选择,
            // products: '',
            // getProductsLoading: true,
            // product: '',
            // activeArea: null,
            addressMap: '', // response object.map
            isLoading: true,
            addObjectShow: false, // 弹出层控制
            orderId: this.$route.query.id,
            orderCompany: [], // 城市报价单
        }
    },
    methods: {
        gopage(url, query) {
            // this.$router.push({ path: url, query: query });
            btPage.open({
              url: url,
              container_style: 1,
              params: query,
              jsOnResume: () => {
                if(GConfig.isInApp){
                  this.getData()
                }
              }
            })
        },
        initialAddress (id) {
            this.addressMap = {
                oid: this.orderId,
                citycode: id
            }
        },
        async getData() {
            let $promise
            this.isLoading = true
            $promise = await orderService.getQuoteLists({ id: this.orderId })
            this.isLoading = false;

            if ($promise.code != 1) {
                // this.condationRouterGo($promise)
                Toast($promise.message)
                // setTimeout(() => {
                //     this.$router.go(-1);
                // }, 2000)
                return
            } else {
                //  初始化地址数据
                this.initialAddress($promise.object.cityCode)
                // 是否存在用户车辆信息
                 this.hasUserCarMsg = ($promise.object.ownerName !== '' && $promise.object.plate !== '') ? true : false

                this.dataObject = $promise.object
                this.getOrderCompany()
            }
        },
        /**
         * 根据条件判断跳转
         * @param { Object } 请求结果
         */
        condationRouterGo(data) {
            Toast(data.message)

            let self, path
            self = this
            path =
                data.code == 2 ? '/quote/car_pic' :
                data.code == 3 ? '/quote/choose_ins_type' : ''
            if (path !== '') {
                setTimeout(() => {
                    self.gopage(path, self.addressMap)
                })
            }
        },
        // 获取城市报价单
        getOrderCompany() {
            quoteService.orderCompany({ citycode: this.addressMap.citycode })
                .then((res) => {
                    if(res.code == 1) {
                        this.orderCompany = res.object.companys
                    }
                })
        },
        /**
         * 添加保单选择
         * 选择可选保险公司后跳转至选择险种
         * 需要携带信息待确定，暂时携带险种id
         */
        addNewObject (n) {
            if (this.dataObject.orderQuotationVos) {
                this.addObjectShow = true
                // this.gopage('/quote/choose_ins_type', {
                //
                // });
            } else {
                Toast('暂无可投保的保险公司！')
            }

        },
        /**
         * 跳转订单详情
         * @param code 1: 去投保， 2: 去核保
         */
        goOrderDetail(code, id) {
            if (!code) {
                return
            } else {
                this.gopage('/order/order_detail', { id: id })
            }
        },
        goChooseInsType(id) {
            this.gopage('/quote/choose_ins_type',{ cids: id, oid: this.orderId, cityCode: this.addressMap.citycode })
            this.addObjectShow = false
        }
    },
    created () {
        this.getData();
    },
    mounted () {
        setPageTitle('报价结果');
    }
}
</script>
<style lang="less" scoped>
.outer-shadow {
    box-shadow: 0px 4px 4px 1px #e0e0e0;
}
.flex {
    display: flex;
}
.btn-shadow {
   box-shadow: 0px 0px 3px 0px #e0e0e0;
}
.yellow {
    color:#FFAF10;
}
.lists {
    padding-bottom: 90px !important;
}
</style>
<style>
@media screen and (max-width: 350px)  {
    .name span {
        display: block;
    }
}
</style>



