<template>
    <div class="withdraw-box">
        <p class="top-tips ta-c pt10 pb10">暂时只支持绑定银联储蓄卡！</p>
        <ul class="card-items">
            <li class="card-item flex-center mlr15 pt20 pb20 mb20" v-for="(i,index) in list" :key="index">
                <div class="bg-white bdr-50 mlr10">
                    <img src="~@/assets/images/bank_0.png" width="40" alt="">
                </div>
                <div class="center-detail flex-1 lh24">
                    <p class="bank" v-text="i.bank"></p>
                    <!--<p class="card-type">储蓄银行</p>-->
                    <p class="card-num ft20" v-text="i.encryBankCardNo"></p>
                </div>
                <div class="right-btn mr10">
                    <span @click="unBind(i)">解绑</span>
                </div>
            </li>
        </ul>
        <div class="ft16 ta-c p10" v-if="list && !list.length">
            暂无银行卡，赶快去添加吧
        </div>
        <div class="h40 mb20 mt10">
            <div class="flex-center pos-f b0 h40 w-100 mb20 mt10 zi10">
              <van-button type="primary flex-1 mlr15" :block="true"  @click="onAdd" text="绑定新卡"></van-button>
            </div>
        </div>
        <van-popup class="h-100" v-model="isshowaddcard" position="top" :overlay="true">

            <van-cell-group :border="true">
                <van-field v-model="newcard.name" clearable label="持卡人" placeholder="请输入持卡人" :error='newcard_error.name' />
                <van-field v-model="newcard.cardNo" clearable label="身份证号" placeholder="请输入身份证号" :error='newcard_error.cardNo' />
                <van-field v-model="newcard.bankCardNo" @blur="onblur" type="tel" clearable label="储蓄卡号" placeholder="请输入卡号" :error='newcard_error.bankCardNo' />
                <van-field v-model="newcard.bank" clearable label="银行"  placeholder="请选择银行" :error='newcard_error.bank'>
                    <!--<div slot="button" class="float-module">-->
                      <popup-radio slot="button" @click-item="clickItem" class="float-module"  :popupOption="popupOption" popupClass="w-50 h-100"
                                   :cur-column.sync="banktypeselect" :columns="banktypelist" popupRadioClass="of-visible">
                        <!--<span class="icon-right1" v-text="newcard.bank||'请选择银行'"></span>-->
                      </popup-radio>
                    <!--</div>-->
                </van-field>
                <!--<div class="van-cell van-hairline van-field">-->
                    <!--<div class="van-cell__title">-->
                        <!--<span>银行</span>-->
                    <!--</div>-->
                    <!--<div class="van-cell__value1 ta-l cl-gray">-->
                        <!--<popup-radio @click-item="clickItem"  :popupOption="popupOption" popupClass="w-50 h-100"-->
                                     <!--:cur-column.sync="banktypeselect" :columns="banktypelist" popupRadioClass="of-visible">-->
                            <!--<span class="icon-right1" v-text="newcard.bank||'请选择银行'"></span>-->
                        <!--</popup-radio>-->
                        <!--&lt;!&ndash;<span v-text="newcard.bank" @click="showBankTypeSelect"></span>&ndash;&gt;-->
                    <!--</div>-->
                <!--</div>-->

                <!--<van-field v-model="newcard.bank" disabled label="银行" placeholder="" :error='newcard_error.bank' />-->
                <van-field v-model="newcard.phone" type="tel" clearable label="预留手机" placeholder="请输入手机号" :error='newcard_error.phone' />

            </van-cell-group>
            <p class="tips ta-c mt15 mlr30 ft12">开户人为实名认证姓名，不可更改，请绑定与实名认证一致姓名的储蓄卡，否则会打款失败哦！</p>
            <div class="flex-center mlr15 mt24">
              <van-button type="primary flex-1 mlr15" @click="isshowaddcard=false" text="取消"></van-button>
              <van-button type="primary flex-1 mlr15" @click="onAddSub" text="绑定"></van-button>
            </div>
        </van-popup>
        <van-popup v-model="isshowsite" position="bottom" :overlay="false">
            <van-area :area-list="areaList" title="标题" @change="onChange" @cancel="onCancel" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>

<script>

import PopupRadio from '@/components/PopupRadio.vue'
import Area from './../../lib/area.js'
import myService from '@/api/myService'
export default {
    name: 'cardList',
    data() {
        return {
            isshowaddcard: false,
            popupOption:{
                position:'right',

            },
            isshowsite: false,
            isshowbanktype: false,
            banktypeselect:'',
            banktypelist: [
                {
                    id: '1',
                    name: '中国银行'
                },
                {
                    id: '2',
                    name: '中国农业银行'
                },
                {
                    id: '3',
                    name: '中国建设银行'
                },
                {
                    id: '4',
                    name: '中国工商银行'
                },
                {
                    id: '5',
                    name: '招商银行'
                },
                {
                    id: '6',
                    name: '兴业银行'
                },
                {
                    id: '7',
                    name: '交通银行'
                },
                {
                    id: '8',
                    name: '中国邮政储蓄银行'
                },
                {
                    id: '9',
                    name: '中国民生银行'
                },
                {
                    id: '10',
                    name: '浦发银行'
                },
                {
                    id: '11',
                    name: '平安银行'
                },
                {
                    id: '12',
                    name: '中信银行'
                }
            ],
            list:'',
            newcard: {
                name: '',
                bankCardNo: '',
                cardNo: '',
                bank: '',
                phone: ''
            },
            newcard_error: {
                name: null,
                bankCardNo: null,
                cardNo: null,
                bank: null,
                phone: null
            }
        };
    },
    created() {
        this.areaList = Area;
        this.banktypeselect = this.banktypelist[0].id;
        this.getList()
    },
    methods: {
        getList(){
            myService.bankList().then((res) => {
                if(res.code == 1){
                    if(res.object){
                        this.list = res.object||[];
                    }
                } else {
                    Toast(res.message)
                }
            })
        },
        clickItem() {
            this.newcard.bank = this.banktypeselect.name;
        },
        onAdd() {
            this.isshowaddcard = true;
        },
        onAddSub() {
            if(!this.newcard.name){
                Toast("请输入持卡人")
                return
            }
            if(!this.newcard.bankCardNo){
                Toast("请输入卡号")
                return
            }
            if(!this.newcard.cardNo){
                Toast("请输入身份证号")
                return
            }
            if(!this.newcard.phone || !/^1[0-9]{10}$/.test(this.newcard.phone)){
                Toast("请输入正确的手机号")
                return
            }

            Toast.loading({
                duration:0,
                forbidClick:true,
                message: '加载中...'
            });
            var params = this.newcard;
            myService.bankSave(params).then((res) => {
                Toast.clear();
                if(res.code == 1){
//                    params.id = res.object;
//                    this.list.push(params);
                    this.getList();
                    this.isshowaddcard = false;
                    this.isshowsite = false;

                } else {
                    Toast(res.message)
                }
            })
        },
        unBind(i) {
            myService.bankDelete({bankCardId:i.id}).then((res) => {
                if(res.code == 1){
                    this.list = this.list.filter(function(j){
                        return j.id !== i.id
                    })
                }
                Toast(res.message)
            })
        },
        onblur(){
            this.searchBankName()
        },
        searchBankName(){
            if(this.newcard.bankCardNo.length < 16){
                this.newcard.bank = '';
                return;
            }
            myService.bankBin({
                code:this.newcard.bankCardNo
            }).then((res)=>{
                if(res.code == 10000){
                    if(res.object && res.object.code === 0){
                        this.newcard.bank = res.object.object.bank_name;
                    } else {
                        Toast(res.object.message);
                    }
                } else {
                    Toast(res.message);
                }
            })
        },
        selectsite() {
            this.isshowsite = true;
        },
        onChange(value, index) {
            console.log(`当前值：${value}, 当前索引：${index}`);
        },
        onCancel() {
            console.log('取消');
            this.isshowsite = false;
        },
        onConfirm(value) {
            console.log(value);
            this.newcard.cardsite =
                value[0].name + ' ' + value[1].name + ' ' + value[2].name;
            this.isshowsite = false;
        }
    },
    mounted () {
        setPageTitle('银行卡管理');
    },
    components:{
        PopupRadio
    }
};
</script>

<style lang="less">

.withdraw-box {
    .card-item {
        background: #c7162e;
        border-radius: 10px;
        color: #fff;
    }
    .van-cell .van-cell__value .van-field__body {
        position: relative;
        .van-field__button {
            position: absolute;
            height: 100%;
            width: 100%;
            left:0;
            .float-module {
              position: absolute;
              height: 100%;
              width: 100%;
            }
        }
    }
}
</style>

