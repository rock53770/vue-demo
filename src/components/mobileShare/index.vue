<template>
    <div class="mobileShare">
        <div class="container bg-white pt15 pl10 ta-c">
            <div class="ft14 mb30  cl-gray"><span class="title">分享到</span></div>
            <div class="flex-center mb12">
                <div class="flex-1" @click="shareWechat(3)">
                    <img src="./weixin@3x.png" width="48" height="48" class="bdr-50">
                    <p class="cl-gray mt10">微信好友</p>
                </div>
                <div class="flex-1" @click="shareWechat(4)">
                    <img src="./pengyouquan@3x.png" width="48" height="48" class="bdr-50">
                    <p class="cl-gray mt10">朋友圈</p>
                </div>
            </div>
            <div class="h50 lh50 van-hairline--top ft16" @click="closeShare">取消</div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'mobileShare',
    props: {
        config: { // 分享参数，必传
            type: Object
        }
    },
    methods: {
        // 分享到朋友圈
        shareWechat(n) {
            let param = {
                sharePhotos: this.config.sharePhotos,
                shareTitle: this.config.shareTitle,
                shareDesc: this.config.shareDesc,
                shareUrl: this.config.shareUrl,
                sharePlatform: n,
                shareInfoType: 3
            };
            wv.shareInfo(param, function(res) {
                if (res.status == 1) {
					console.log('​shareWechat -> 分享success')
                } else {
                    console.log('​shareWechat -> 分享成功error')
                }
            });
        },
        // 关闭分享
        closeShare() {
            this.$emit('CLOSE_SHARE', false)
        }
    },
}
</script>
<style lang="less" scoped>
    .title {
        position: relative;
        &:before {
            content: '';
            display: block;
            width: 20px;
            height: 1px;
            background-color: #dddddd;
            position: absolute;
            top: 50%;
            left: -30px;
        }
        &:after {
            content: '';
            display: block;
            width: 20px;
            height: 1px;
            background-color: #dddddd;
            position: absolute;
            top: 50%;
            right: -30px;
        }
    }
</style>