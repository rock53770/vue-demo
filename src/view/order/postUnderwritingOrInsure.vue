
<template>
    <div class="postUnderwritingOrInsure-box">
        <!-- 核保 -->
        <div v-if="$route.query.type == 1" class="underwriting">
            <van-cell-group>
                <van-field v-model="underwriting.applicantName" clearable label="投保人名称：" placeholder="请输入姓名" />
                <van-field v-model="underwriting.applicantLicenseNo" clearable label="投保人证件：" placeholder="请输入证件号" />
                <van-field v-model="underwriting.insurantName" clearable label="被投保人姓名：" placeholder="请输入姓名" />
                <van-field v-model="underwriting.insurantLicenseNo" clearable label="被投保人证件：" placeholder="请输入证件号" />
                <van-field v-model="underwritSwitch.invoice?'专票':'普票'" center disabled label="开票方式" placeholder="切换开票方式">
                    <van-switch slot="button" v-model="underwritSwitch.invoice" />
                </van-field>
                <van-field v-model="underwritSwitch.special?'特需':'非特需'" center disabled label="是否特需" placeholder="是否特需">
                    <van-switch slot="button" v-model="underwritSwitch.special" />
                </van-field>
                <van-field :disabled='!underwriting.special' v-model="underwriting.specialTxt" label="备注" type="textarea" placeholder="请输入备注" rows="1" autosize />
            </van-cell-group>
            <div class="clearfix pl15 pt20 pics">
                <div class="fl w-50 pr15 mb10 ta-c">
                    <div class="bg-white pt10">
                        <div class="h100 plr10 bg-img-add pos-r">
                            <upload v-on:after-select="onRead1" v-show="!identificationPhotoFront.content" class="w-100 h-100">
                            </upload>
                            <img :src="identificationPhotoFront.content" class="thumb-img" v-show="identificationPhotoFront.content">
                            <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="identificationPhotoFront.content" @click="deletePic(1)">
                                <i class="icon-delete"></i>
                            </div>
                            <!-- <i class="pos-a icon-delete" v-show="identificationPhotoFront.content" @click="deletePic(1)"></i> -->
                            <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5" v-show="identificationPhotoFront.content && identificationPhotoFront.status == 3">
                                <span>上传失败，请删除重新上传</span>
                            </div>
                            <div class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5" v-show="identificationPhotoFront.percent && identificationPhotoFront.percent!=100" style="min-height:20px;" :style="{'height':100-identificationPhotoFront.percent+'%'}">
                                <span class="flex-1" v-show="identificationPhotoFront && identificationPhotoFront.percent">{{identificationPhotoFront.percent+"%"}}</span>
                            </div>
                        </div>
                        <p class="lh30">车主证件正面</p>
                    </div>
                </div>
                <div class="fl w-50 pr15 mb10 ta-c">
                    <div class="bg-white pt10">
                        <div class="h100 plr10 bg-img-add pos-r">
                            <upload v-on:after-select="onRead2" v-show="!identificationPhotoOpposite.content" class="w-100 h-100">
                            </upload>
                            <img :src="identificationPhotoOpposite.content" class="thumb-img" v-show="identificationPhotoOpposite.content">
                            <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="identificationPhotoOpposite.content" @click="deletePic(2)">
                                <i class="icon-delete"></i>
                            </div>
                            <!-- <i class="pos-a icon-delete" v-show="identificationPhotoOpposite.content" @click="deletePic(2)"></i> -->
                            <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5" v-show="identificationPhotoOpposite.content && identificationPhotoOpposite.status == 3">
                                <span>上传失败，请删除重新上传</span>
                            </div>
                            <div class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5" v-show="identificationPhotoOpposite.percent && identificationPhotoOpposite.percent!=100" style="min-height:20px;" :style="{'height':100-identificationPhotoOpposite.percent+'%'}">
                                <span class="flex-1" v-show="identificationPhotoOpposite && identificationPhotoOpposite.percent">{{identificationPhotoOpposite.percent+"%"}}</span>
                            </div>
                        </div>
                        <p class="lh30">车主证件反面</p>
                    </div>
                </div>
            </div>
            <div class="p15">
                <div class="flex-center">
                    <div @click="postUnderwriting" class="flex-1 btn btn_gradient mlr10">提交核保</div>
                </div>
            </div>
        </div>
        <!-- 投保 -->
        <div v-if="$route.query.type == 2" class="insure">
            <van-cell-group>
                <van-field v-model="insureSwitch.invoice?'上传':'后补'" center disabled label="专票信息" placeholder="切换专票方式">
                    <van-switch slot="button" v-model="insureSwitch.invoice" />
                </van-field>
            </van-cell-group>

            <div v-show="insure.invoice" class="clearfix pl15 pt20 pics">
                <div class="fl w-100 pr15 mb10 ta-c">
                    <div class="bg-white pt10">
                        <div class="h100 plr10 bg-img-add pos-r">
                            <upload v-on:after-select="onRead3" v-show="!businessLicense.content" class="w-100 h-100">
                            </upload>
                            <img :src="businessLicense.content" class="thumb-img" v-show="businessLicense.content">
                            <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="businessLicense.content" @click="deletePic(3)">
                                <i class="icon-delete"></i>
                            </div>
                            <!-- <i class="pos-a icon-delete" v-show="businessLicense.content" @click="deletePic(3)"></i> -->
                            <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5" v-show="businessLicense.content && businessLicense.status == 3">
                                <span>上传失败，请删除重新上传</span>
                            </div>
                            <div class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5" v-show="businessLicense.percent && businessLicense.percent!=100" style="min-height:20px;" :style="{'height':100-businessLicense.percent+'%'}">
                                <span class="flex-1" v-show="businessLicense && businessLicense.percent">{{businessLicense.percent+"%"}}</span>
                            </div>
                        </div>
                        <p class="lh30">票据图片</p>
                    </div>
                </div>
            </div>
            <div class="p15">
                <div class="flex-center">
                    <div @click="postInsure" class="flex-1 btn btn_gradient mlr10">提交投保</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import upload from '@/components/Upload/index.vue';
import orderService from '@/api/orderService';
import { Toast } from 'vant';

export default {
    name: 'postUnderwritingOrInsure',
    data() {
        return {
            // 核保
            underwritSwitch: {
                invoice: false, //开票方式
                special: false //是否特需
            },
            underwriting: {
                id: this.$route.query.id,
                applicantName: decodeURI(this.$route.query.applicantName), //投保人名称
                applicantLicenseNo: decodeURI(this.$route.query.applicantLicenseNo), //投保人证件
                insurantName: decodeURI(this.$route.query.insurantName), //被投保人姓名
                insurantLicenseNo: decodeURI(this.$route.query.insurantLicenseNo), //被投保人证件
                invoice: 0, //开票方式
                special: 0, //是否特需
                specialTxt: null, //特需备注文本
                picInfo: [] //图片信息
            },
            identificationPhotoFront: {}, //车主证件正面
            identificationPhotoOpposite: {}, //车主证件反面
            insureSwitch: {
                invoice: false //票据
            },
            // 投保
            businessLicense: {}, //票据图片
            insure: {
                id: this.$route.query.id,
                invoice: 0, //票据
                businessLicense: [] //票据图片
            }
        };
    },
    watch: {
        underwritSwitch: {
            //深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                if (val.invoice) {
                    this.underwriting.invoice = 1;
                } else {
                    this.underwriting.invoice = 0;
                }
                if (val.special) {
                    this.underwriting.special = 1;
                } else {
                    this.underwriting.special = 0;
                    this.underwriting.specialTxt = '';
                }
            },
            deep: true
        },
        insureSwitch: {
            //深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                if (val.invoice) {
                    this.insure.invoice = 1;
                } else {
                    this.insure.invoice = 0;
                }
            },
            deep: true
        }
    },
    methods: {
        deletePic(type) {
            if (type == 1) {
                this.identificationPhotoFront = {};
            } else if (type == 2) {
                this.identificationPhotoOpposite = {};
            } else if (type == 3) {
                this.businessLicense = {};
            } else if (type == 4) {
            }
        },
        onRead1(files) {
            this.identificationPhotoFront = files[0];
        },
        onRead2(files) {
            this.identificationPhotoOpposite = files[0];
        },
        onRead3(files) {
            this.businessLicense = files[0];
        },
        postUnderwriting() {
            let _this = this;
            _this.underwriting.picInfo = [];
            if (JSON.stringify(_this.identificationPhotoFront) !== '{}') {
                _this.underwriting.picInfo.push({
                    type: 1,
                    fileId: _this.identificationPhotoFront.result.id,
                    fileUrl: _this.identificationPhotoFront.result.viewPath
                });
            }
            if (JSON.stringify(_this.identificationPhotoOpposite) !== '{}') {
                _this.underwriting.picInfo.push({
                    type: 2,
                    fileId: _this.identificationPhotoOpposite.result.id,
                    fileUrl: _this.identificationPhotoOpposite.result.viewPath
                });
            }

            let isInput = true;
            for (const key in _this.underwriting) {
                if (
                    _this.underwriting.hasOwnProperty(key) &&
                    key != 'specialTxt'
                ) {
                    const element = _this.underwriting[key];
                    if (
                        element === null ||
                        element === '' ||
                        JSON.stringify(element) === '[]'
                    ) {
                        isInput = false;
                        Toast('此表单都为必填项');
                        return;
                    }
                }
            }
            if (_this.underwriting.picInfo.length < 2) {
                isInput = false;
                Toast('此表单都为必填项');
            }
            if (isInput) {
                // 提交核保
                this.postUnderwritingApi();
            }
        },
        async postUnderwritingApi() {
            let _this = this;
            // this.underwriting.invoice = this.underwriting.invoice ? 1 : 0;
            // this.underwriting.special = this.underwriting.special ? 1 : 0;
            _this.underwriting.picInfo = JSON.stringify(_this.underwriting.picInfo);
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            let data = await orderService.postUnderwrit(this.underwriting);
            Toast.clear();
            if (data.code !== 1) {
                Toast(this.data.message);
                return;
            }
            Toast.success({
                message: '提交成功！',
                mask: true,
                duration: 2000
            });
            // _this.getData();
            setTimeout(() => {
                _this.$router.go(-1);
            }, 2000);
        },
        async postInsure() {
            let _this = this;
            _this.insure.businessLicense = [];
            if (JSON.stringify(_this.businessLicense) !== '{}') {
                _this.insure.businessLicense.push({
                    type: 8,
                    fileId: _this.businessLicense.result.id,
                    fileUrl: _this.businessLicense.result.viewPath
                });
            }

            if (
                this.insure.invoice &&
                JSON.stringify(this.insure.businessLicense) === '[]'
            ) {
                Toast('请上传图片');
                return;
            }
            this.insure.invoice = this.insure.invoice ? 1 : 0;
            _this.insure.businessLicense = JSON.stringify(_this.insure.businessLicense)
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            let data = await orderService.postInsure(this.insure);
            Toast.clear();
            if (data.code !== 1) {
                Toast(this.data.message);
                return;
            }
            Toast.success({
                message: '提交成功！',
                mask: true,
                duration: 2000
            });
            setTimeout(() => {
                this.gopage('/order/pay_method',{id:this.$route.query.id})
            }, 2000);
        },
        gopage(url, query) {
            this.$router.push({ path: url, query: query });
        }
    },
    mounted() {
        setPageTitle('核保');
    },
    components: {
        upload
    }
};
</script>
