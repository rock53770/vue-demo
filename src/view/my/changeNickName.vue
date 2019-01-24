<template>
    <div class="changeNickName pt10">
        <van-cell-group>
            <van-field v-model="name"  label-align="left" label="昵称" placeholder="请输入新的昵称" clearable/>
        </van-cell-group>
        <div style="margin: 90px 15px 0 15px;">
            <van-button round type="primary" :block="true" :disabled="loading" :loading="loading" @click="submit" text="完成">
            </van-button>
        </div>
    </div>
</template>

<script>
import myService from '@/api/myService';
export default {
    name: 'changeNickName',
    data() {
        return {
            name: '',
            loading: false
        };
    },
    methods: {
        submit() {
            this.loading = true
            let param = {
                nickname: this.name
            }
            myService.changeNickName(param)
                .then((res) => {
                    console.log(res)
                    this.loading = false

                    if (res.code == 1) {  
                        Toast.success('修改成功')
                        setTimeout(() => {
                            btPage.goBack()
                        }, 1000)
                    } else {
                        Toast(res.message)
                    }
                })
        }
    },
    mounted() {
        setPageTitle('修改昵称');
    }
};
</script>
<style lang="less" scoped>
.changeNickName {
    .van-cell-group {
        height: 50px;
        .van-field {
            line-height: 30px;
            font-size: 16px; 
            /deep/ .van-cell__title {
                font-weight: bold;
            }
        }
    }
} 
</style>