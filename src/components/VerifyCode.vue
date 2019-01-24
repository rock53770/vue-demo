
<template>
  <!--<div>-->
  <input class="ft11 plr5 lh28 cl-white bg-orange bdr3" type="button" :value="value" @click="getCode" :disabled="tel.length!=11 || !canClick" />
  <!--</div>-->
</template>

<script>
import loginService from '../api/loginService';
export default {
    name: 'verifyCode',
    data() {
        return {
            value: '获取验证码',
            canClick: true
        };
    },
    props: {
        tel: String,
        codeType:String
    },
    methods: {
        async getCode() {
            if (!this.canClick) return;

            this.canClick = false;
            let params = {
                phone: this.tel,
                type: this.codeType
            };
            let data = await loginService.verifyCode(params);
            if (data.code != '1') {
                Toast(data.message);
                this.canClick = true;
                this.value = '重新发送';
                return;
            }
            this.value = '正在获取...';
            var count = 60;
            var stopTime = setInterval(() => {
                count--;
                if (count === 50) {
                    this.$emit('unGetMsg', true)
                }
                if (count === 0) {
                    clearInterval(stopTime);
                    this.canClick = true;
                    this.value = '重新发送';
                    // this.$emit('unGetMsg', false)
                } else {
                    this.value = count + 's后重新获取';
                }
            }, 1000);
        }
    }
};
</script>
