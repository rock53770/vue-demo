<template>
    <div class="recomposephone-box pt10">
        <van-cell-group>
            <van-field v-model="tel"   label="手机号" placeholder="请输入新的手机号" clearable/>
            <van-field v-model="code"  label="验证码" placeholder="请输入验证码" clearable>
              <verify-code :tel="tel" slot="button" code-type="2"></verify-code>
            </van-field>
        </van-cell-group>
        <div class="mlr15 mt40">
          <van-button type="primary" :block="true" round :disabled="loading" :loading="loading" @click="submit" text="绑定新手机号"></van-button>
        </div>
    </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode.vue';
import loginService from '@/api/loginService';
export default {
    name: 'recomposephone',
    data() {
        return {
            tel: '',
            code: '',
            loading:false,
        };
    },
    methods: {
        submit() {

            if(!this.tel || !this.code){
                Toast('用户名或验证码不能为空！');
                return;
            }
            
            let params = {
                phone: this.tel,
                code: this.code,
            }
            this.loading = true;
            
            let data = loginService.updatePhone(params)
                .then((res) => {
                    this.loading = false;
                    if(res.code != 1) {
                        Toast(res.message);
                    } else {
                        btPage.goBack()
                    }
            })
        },
    },
    mounted() {
        setPageTitle('绑定新手机号');
    },
    components: {
      verifyCode: VerifyCode
    }
};
</script>

<style lang="less">
.recomposephone-box {
    .van-cell-group {
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

