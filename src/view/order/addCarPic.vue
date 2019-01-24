
<template>
  <div class="box">
    <div class="">

    </div>
    <div class="">
      order
    </div>
  </div>
</template>

<script>
    import popupSelect from '@/components/PopupSelect.vue'
    import quoteService from '@/api/quoteService'
    export default {
        name: 'order',
        data () {
            return {
                company: '',
                companys:[{name:'1.2L'},{name:'1.8L'},{name:'2.0L'}],
                area: '',
                areas:[{name:'3'},{name:'4'},{name:'5'}],
            }
        },
        computed:{

        },
        methods:{
            quote(){
                // this.$router.push({name:'carPic'})
                btPage.open({
                    url: '/quote/carPic',
                    container_style: 1
                });
            },
        },
        mounted () {
            setPageTitle("订单")
            quoteService.quote().then(function(res){
                console.log(res)
            })
        },
        components :{
            popupSelect
        }
    }
</script>
