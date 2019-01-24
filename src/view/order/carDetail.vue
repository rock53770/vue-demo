<template>
    <div class="carDetail-box" style="padding-bottom: 70px;">
        <template v-if="!isLoading">
            <div class="car-msg bg-white pt16 pb16 plr12">
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">车主姓名：</span><span class="cl-gray">{{ dataObject.ownerName }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">证件类型：</span><span class="cl-gray">{{ dataObject.ownerLicenseTypeContent }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">证件号码：</span><span class="cl-gray">{{ dataObject.ownerLicenseNo }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">车牌号码：</span><span class="cl-orange">{{ dataObject.plate }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">车架号(VIN)：</span><span class="cl-gray">{{ dataObject.vin}}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">发动机号：</span> <span class="cl-gray">{{ dataObject.engineNo }}</span> </p>
                <p class="lh22 ft14 mb16" v-if="dataObject.carModel"> <span class="w100 show-ib ta-r mr15">车辆类型：</span><span class="cl-gray">{{ dataObject.carModel }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">核定载人数：</span><span class="cl-gray">{{ dataObject.carSeatCount }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">注册日期：</span><span class="cl-gray">{{ $util.formatDate(dataObject.registrationTime, 'yyyy-MM-dd') }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">是否过户车：</span><span class="cl-gray">{{ dataObject.isTransfer ? '已过户' : '未过户' }}</span> </p>
                <p class="lh22 ft14 mb16" v-if="dataObject.transferDate"> <span class="w100 show-ib ta-r mr15">过户日期：</span><span class="cl-gray">{{ $util.formatDate(dataObject.transferDate, 'yyyy-MM-dd') }}</span> </p>
                <p class="lh22 ft14 mb16"> <span class="w100 show-ib ta-r mr15">是否按揭车：</span><span class="cl-gray">{{ dataObject.isMortgage ? '是' : '否' }}</span> </p>
                <p class="lh22 ft14" v-if="dataObject.firstBeneficiary"> <span class="w100 show-ib ta-r mr15">第一受益人：</span><span class="cl-gray">{{ dataObject.firstBeneficiary }}</span></p>
            </div>

            <div class="upload bg-white pt5 pl12 pr12 mt10">
                <div class="mt10">
                    <ul class="pics flex-center flex-w">
                        <li class="w-50 mb10 pr15" v-show="pics.length < max">
                            <div class="w-100 bg-white">
                                <upload  :pics="pics" :max="max" class="wh-100 flex-center h100 ta-c van-hairline--surround">
                                    <img src="../../assets/icons/add@3x.png" class="mt30" width="30">
                                    <!-- <p  class="ft14 cl-gray  mt10">添加图片</p> -->
                                </upload>
                                <p class="lh30 ta-c bg-white">其他</p>
                            </div>
                        </li>
                        <li class="w-50 mb10 pr15 pl0" v-for="(item, index) in hasImgs" :key="index">
                            <div class="bg-white">
                                <div class="h100 plr10 pos-r van-hairline--surround">
                                    <img :src="item.fileUrl" class="thumb-img" v-show="item.fileUrl" @click="imagePreview(1, index)">
                                </div>
                                <p class="lh30 ta-c">{{ item.type | fileName }}</p>
                            </div>
                        </li>
                        <li class="w-50 mb10 pr15 pl0" v-for="(i,index) in pics" :key="index">
                            <div class="bg-white pt10">
                                <div class="h100 plr10 bg-img-add pos-r van-hairline--surround">
                                    <img :src="i.content" class="thumb-img" v-show="i.content" @click="imagePreview(2, index)">
                                    <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="i.content" @click="deletePicOther(index)">
                                        <i class="icon-delete"></i>
                                    </div>
                                    <!-- <i class="pos-a icon-delete" @click="deletePicOther(index)"></i> -->
                                    <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                                        v-show="i.content && i.status == 3">
                                      <span>上传失败，请删除重新上传</span>
                                    </div>
                                </div>
                                <p class="lh30 ta-c">其他</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <div class="lh30 ft14 cl-gray ta-c">如有疑问请联系客服：<a href="tel:400-603-8787" class="cl-orange">400-603-8787</a></div> -->
            <div class="pos-f b0 l0 r0 h70 bg-white p10 zi10 van-hairline--top">
                <van-button round type="default" block class="cl-white ft16 van-button--primary" @click="againCommit">重新提交</van-button>
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
import upload from '@/components/Upload/index.vue'
import orderService from '@/api/orderService';
import { Toast } from 'vant';
import { setTimeout } from 'timers';

export default {
    name: 'carDetail',
    data() {
        return {
            dataObject:{},
            isLoading:true,
            pics: [],
            hasImgs: [],
            orderId: this.$route.query.id,
            max: '',
            all: [],
        };
    },
    mounted () {
      setPageTitle("车辆信息")
    },
    created () {
        this.getData();
    },
    components: { upload },
    methods: {
        async getData() {
            this.isLoading = true;
            let data = await orderService.getCarDetail({
                oId:this.$route.query.id
            })
            this.isLoading = false;
            if(data.code != 1){
              Toast(data.message || data.msg);
              return;
            }
            this.getHasImg()
            this.dataObject = data.object;

        },
        getHasImg() {
            let self = this
            orderService.getHasImgs({ id: self.orderId })
                .then((res) => {
                    if (res.code == 1) {
                        self.hasImgs = res.object
                        self.max = 20 - res.object.length
                    } else {
                        Toast(res.message)
                        // setTimeout(() => {
                        //     self.$router.push({ path: '/order', query:{ type: 0}})
                        // }, 3000)
                    }
                })
        },
        onRead(files) {
            this.pics = this.pics.concat(files);
            let max = 20 - this.hasImgs.length
            if (this.pics.length > max) {
                this.pics.length = max;
            }
        },
        deletePicOther(index) {
            this.pics.splice(index, 1);
        },
        /**
         * 重新提交证件照
         * @param {Object}
         * { picInfo: [], id: 订单id }
         * [] => {fileid: 图片上传id， fileUrl: 图片url， type: 8 }
         */
        againCommit () {
            Toast.loading({
                mask: true,
                message: '提交中...'
            });
            if (this.pics.length == 0) {
                Toast('请至少上传一张证件照！')
            } else {
                let param, self, arr = []
                self = this
                self.pics.forEach((it) => {
                    if(it.result && it.result.id){
                        let temp = {};
                        temp.fileId = it.result.id
                        temp.fileUrl = it.result.viewPath
                        temp.type = 8
                        arr.push(temp)
                    }
                })
                param = {
                    picInfo: JSON.stringify(arr),
                    id: this.orderId
                }
                orderService.postOrderPic(param)
                    .then((res) => {
                        if(res.code == 1) {
                            Toast.success('提交成功');
                            setTimeout(() =>{
                                btPage.open({
                                    url: '/order/quote_detail',
                                    container_style: 1,
                                    type: 3,
                                    params: { id: this.orderId }
                                })

                            }, 500)
                        } else {
                            Toast(res.message)
                        }
                    })
            }
        },
        imagePreview(type, index) {
            let arr = [],$index
            this.hasImgs.forEach(it => {
                arr.push(it.fileUrl)
            })
            this.pics.forEach(i => {
                arr.push(i.result.viewPath)
            })
            if (type == 2 && this.hasImgs.length !== 0) {
                $index = index + this.hasImgs.length
            } else {
                $index = index
            }
            ImagePreview({
                images: arr,
                startPosition: $index,
                onClose() {}
            })
        }
    },
    filters: {
        fileName(code) {
            switch(code) {
                case 1:
                    return '身份证'
                case 2:
                    return '身份证'
                case 3:
                    return '行驶证'
                case 4:
                    return '行驶证'
                case 5:
                    return '行驶证副本'
                case 6:
                    return '行驶证副本'
                case 7:
                    return '暂住证'
                case 8:
                    return '其他'
            }
        }
    }
};
</script>

<style lang="less" scoped>
.b70 {
    bottom: 70px;
}
</style>

