<template>
<div class="pos-r">
    <img src="http://pubimg.bz-ins.com/PUBLIC/h5/static/miniprogram/images/concat.png" class="top"/>
    <div class="pos-a box">
        <div class="mt10 mb20 cl-white ft12 ta-c" @click="previewImage">
            <!-- <div class="mb15 ft17" v-if="serviceNickName">{{serviceNickName}}</div> -->
            <img :src="url" class="qrcode" v-if="url"/>
            <div class="mt10">长按识别二维码添加客服好友</div>
        </div>
        <div class="ta-c ft16 cl-white">工作时间：上午9：00-下午17：30</div>
    </div>
    <div class="pos-a bottom">
        <img src="~@/assets/icons/logots.png" style="width: 92px;height: 29px;"/>
    </div>
</div>
</template>
<script>
    export default {
        name: 'contact',
        data () {
            return {
                url:"",
                serviceNickName:""
            }
        },
        created() {
          if(Util.getLocalData("Qrcode")){
            this.url = Util.getLocalData("Qrcode").code;
            this.serviceNickName = Util.getLocalData("Qrcode").name;
          }
        },
        methods:{
            previewImage(){
                ImagePreview({
                  images:[this.url],
                })
            }
        },
        mounted () {
            setPageTitle('联系客服');
        },
    }
</script>
<style lang="less" scoped>
.top {
    width: 100%;
    height: 100vh;
    display: block;
}
.box {
    left: 0;
    right: 0;
    bottom: 135px;
}
.bottom {
    left: 0;
    right: 0;
    bottom: 20px;
    text-align: center;
}
.qrcode {
    width: 170px;
    height: 170px;
}
</style>
