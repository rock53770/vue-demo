<template>
    <div class="orderDetail pos-r ft16 of-hide">
        <template v-if="!isLoading">
            <div class="address bg-white p12 mb10 ft14" v-if="dataObject.invoice">
                <p v-if="dataObject.invoice">发票信息：{{ dataObject.invoice }}</p>
            </div>
            <!-- 险种名称 总额 -->
            <div class="h100 bg-white ta-c pt16 pb16 mb10">
                <h3 class="fw-n ft16 mb8">{{ dataObject.companyName }}</h3>
                <p class="ft30 cl-orange">{{(dataObject.commercialInsurancePremium+dataObject.compulsoryInsurancePremium+dataObject.vehicleVesselTax) |currency('￥','2')}}</p>
            </div>
            <!-- 商业险 -->
            <div class="bg-white mb10" v-if="commercialInsurance.length">
                <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
                    <p class="ft16 mr10 fw-b">商业险</p>
                    <span class="cl-orange ft14 fw-b">(生效日期：{{ $util.formatDate(dataObject.commercialInsuranceDate, 'yyyy-MM-dd') }})</span>
                </div>
                <div class="van-hairline--bottom">
                    <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
                        <p class="ta-l" style="width: 34%">险种</p>
                        <p style="width: 22%;">保额</p>
                        <p style="width: 22%;">不计免赔</p>
                        <p style="width: 22%;" class="ta-r">保费</p>
                    </div>
                    <div class="ta-c plr12 ft14 flex-center"
                        v-for="(item, index) in commercialInsurance" :key="index">
                        <p class="ta-l pt10 pb10" style="width: 34%">{{ item.insuranceName }}</p>
                        <p style="width: 22%;" class="pt10 pb10">{{ item.coverageText }}</p>
                        <p style="width: 22%;" class="pt10 pb10"><van-icon name="success" color="#FC7453" v-if="item.additionalInsuranceType"/></p>
                        <p style="width: 22%;" class="pt10 pb10 ta-r">{{ item.mainPremium|currency('￥','2')}}</p>
                    </div>
                    <div class="ta-c plr12 ft14 flex-center">
                        <p class="ta-l pt10 pb10" style="width: 34%">不计免赔总计</p>
                        <p style="width: 22%;" class="pt10 pb10"></p>
                        <p style="width: 22%;" class="pt10 pb10"></p>
                        <p style="width: 22%;" class="pt10 pb10 ta-r">{{ dataObject.noneDeductiblePremium|currency('￥','2') }}</p>
                    </div>
                    <div class="h60 pt8 plr12 van-hairline--top van-hairline--bottom">
                        <p class="ta-r ft14 mb8">合计：{{ dataObject.commercialInsurancePremium|currency('￥','2') }}</p>
                        <p class="ta-l ft12 cl-gray">注：因保险公司承保政策等原因，部分险种不可投保</p>
                    </div>
                </div>
            </div>
            <!-- 交强险 -->
            <div class="bg-white mb10" v-if="strongInsurance.length">
                <div class="h40 lh40 bold_bd_left flex-center van-hairline--bottom">
                    <p class="ft16 mr10 fw-b">交强险</p>
                    <span class="cl-orange ft14 fw-b">(生效日期：{{ $util.formatDate(dataObject.compulsoryInsuranceDate, 'yyyy-MM-dd') }})</span>
                </div>
                <div class="van-hairline--bottom">
                    <div class="h40 lh40 ta-c van-hairline--bottom plr12 cl-gray ft14 flex-center">
                        <p class="ta-l" style="width: 34%;">险种</p>
                        <p style="width: 22%;">保额</p>
                        <p style="width: 22%;"></p>
                        <p style="width: 22%;" class="ta-r">保费</p>
                    </div>
                    <div class="h40 lh40 ta-c plr12  ft14 flex-center"
                        v-for="(item, index) in strongInsurance" :key="index">
                        <p class="ta-l" style="width: 34%;">{{ item.insuranceName }}</p>
                        <p class="cl-orange" style="width: 22%;">{{ item.premium ? '投保' : '未投保' }}</p>
                        <p style="width: 22%;"></p>
                        <p style="width: 22%;" class="pt10 pb10 ta-r">{{ item.premium|currency('￥','2')}}</p>
                    </div>
                    <div class="h40 plr12 van-hairline--top van-hairline--bottom">
                        <p class="ta-r lh40 ft14 fw-b cl-orange">合计：{{ (dataObject.compulsoryInsurancePremium +  dataObject.vehicleVesselTax)|currency('￥','2') }}</p>
                    </div>
                </div>
            </div>
            <!-- 用户信息 -->
            <div class="bg-white ft16">
                <div class="h50 lh50 bold_bd_left pr12 van-hairline--bottom">
                    <p class="fw-b">车主信息</p>
                </div>
                <div class="info plr12 mb10">
                    <div class="lh50 van-hairline--bottom">
                        <span class="show-ib w80 mr30" style="letter-spacing: 4px;">姓名</span>
                        <span class="cl-gray">{{ carOwner.ownerName }}</span>
                    </div>
                    <!-- <div class="lh50 van-hairline--bottom">
                        <span class="show-ib w80 mr30">手机号</span>
                        <span class="cl-gray">{{ carOwner.ownerPhone }}</span>
                    </div> -->
                    <div class="lh50 van-hairline--bottom">
                        <span class="show-ib w80 mr30">身份证</span>
                        <span class="cl-gray">{{ carOwner.ownerCardId }}</span>
                    </div>
                </div>
            </div>
            <!-- 车辆信息 -->
            <div class="bg-white mt10 ft16">
                <div class="h50 bold_bd_left pr12 flex-center fw-b van-hairline--bottom">车辆信息</div>
                <div class="info plr12">
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">车牌号码</p>
                        <span class="cl-gray">{{ carInfo.plate }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">品牌型号</p>
                        <span class="cl-gray">{{ carInfo.brandInfo }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">车辆类型</p>
                        <span class="cl-gray">{{ carInfo.carModel }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">车架号</p>
                        <span class="cl-gray">{{ carInfo.vin }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">发动机号</p>
                        <span class="cl-gray">{{ carInfo.engineNo }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">注册日期</p>
                        <span class="cl-gray">{{ $util.formatDate(carInfo.registrationTime, 'yyyy-MM-dd') }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center">
                        <p class="w100 mr20">是否过户</p>
                        <span class="cl-gray">{{ carInfo.isTransfer ? '是' : '否' }}</span>
                    </div>
                    <div class="lh50 van-hairline--bottom flex-center" v-if="carInfo.isTransfer">
                        <p class="w100 mr20">过户日期</p>
                        <span class="cl-gray">{{ $util.formatDate(carInfo.transferDate, 'yyyy-MM-dd') }}</span>
                    </div>
                    <div class="lh50 flex-center">
                        <p class="w100 mr20">是否为按揭车</p>
                        <span class="cl-gray">{{ carInfo.isMortgage ? '是': '否' }}</span>
                    </div>
                </div>
            </div>
            <!-- 订单完成状态 -->
            <div v-if="dataObject.isInsuranceOk" :class="['type', dataObject.handlerStatus == -2 ? 'close': 'success']"
                :style="{ 'top': dataObject.invoice ? '157px':'60px' }">
                {{ dataObject.handlerStatus == -2 ? '订单关闭': '投保成功' }}
            </div>

        </template>
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
import popupSelect from '@/components/PopupSelect.vue';
import orderService from '@/api/orderService';
import { Toast } from 'vant';
// import { nextTick } from 'async';

export default {
    name: 'detailShare',
    data () {
        return {
            dataObject: {},  // 返回数据
            commercialInsurance:[], //商业险
            strongInsurance: [] , //交强险
            isLoading: true,
            carInfo: {}, // 车辆信息
            carOwner: {}, // 信息
            // isGoUnderwrite: false,
            toolsBtn: {
                text: '立即支付', // 按钮文案  { 1: '去核保',2: '核保中',3: '立即支付',4: '异常', 5: '立即支付' }
                light: true,  // 是否可点击
                type: null
            }
        }
    },
    methods: {
        gopage(url, query) {
            // this.$router.push({ path: url, query: query });
            btPage.open({
              url: url,
              container_style: 1,
              params: query
            })
        },
        async getOrderDetail() {
            this.isLoading = true;
            let data = await orderService.shareDetail({
                id: this.$route.query.id
            })

            this.isLoading = false;

            if(data.code != 1){
                Toast(data.message)
                return;
            } else {
                this.dataObject = data.object;
                this.commercialInsurance = [];
                this.carInfo = data.object.carInfo
                this.carOwner = data.object.carOwner
                this.toolsBtn = data.object.toolsBtn
                this.strongInsurance = [];
                this.dataObject.quoteInsurances.forEach(element => {
                    if (element.insuranceType == 2) {
                        // 商业险
                        this.commercialInsurance.push(element);
                    }
                    if (element.insuranceType == 1 || element.insuranceType == 3) {
                        // 交强险
                        this.strongInsurance.push(element);
                    }
                })
            }
        },
    },
    filters: {
        errorText (code) {
            switch(code) {
                case 0:
                    return '无异常'
                case 1:
                    return '报价异常'
                case 2:
                    return '核保异常'
                case 3:
                    return '出单异常'
            }
        },
        phone (str) {
            return str.replace(/(\d{3})\d*(\d{4})/,'$1****$2');
        }
    },
    mounted() {
        setPageTitle('报价单详情');
        this.getOrderDetail();
    }
}
</script>
<style lang="less" scoped>
.icon_right {
    top: 17px;
    right: 8px;
}
.type {
    position: absolute;
    right: 17px;
    background-color: transparent;
    height: 87px;
    width: 87px;
    border-radius: 50%;
    line-height: 87px;
    text-align: center;
    transform: rotate(-50deg);
}

.success {
    color: #14BC84;
    border: 1px #14BC84 dashed;
}
.close {
    color: #fc6b47;
    border: 1px #fc6b47 dashed;
}
</style>


