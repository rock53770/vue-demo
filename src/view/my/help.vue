
<template>
  <div class="help-box">
    <van-cell-group>
        <van-cell v-for="(item, index) in helplist" :key="index" @click="gopage(index+1)" :title="item" is-link/>
    </van-cell-group>
  </div>
</template>

<script>
    import quoteService from '@/api/quoteService'
    export default {
        name: 'help',
        data () {
            return {
                helplist:['如何创建订单询价','如何提交核保','如何支付订单','如何获取保单','如何实名认证','如何绑定银行卡','如何提现']
            }
        },
        computed:{
        },
        methods:{
            gopage(id){
                // this.$router.push({name:'helpDetail',query:{id:id}})
                btPage.open({
                    url: '/my/helpDetail',
                    container_style: 1,
                    params: { id: id }
                });
            }
        },
        mounted() {
            setPageTitle('帮助');
        },
        components :{
        }
    }
</script>
