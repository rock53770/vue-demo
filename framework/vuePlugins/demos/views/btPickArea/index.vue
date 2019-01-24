<template>
    <div>
		<x-header v-if="$root.isShowHead">省市区选择demo</x-header>
        <div><a class="get-link" @click="isShowRegion=true">{{regionName||'获取城市'}}</a></div>
        <bt-pick-area :deep="2" :callback="getRegion" :show="isShowRegion"></bt-pick-area>
    </div>
</template>
<script>
import { XHeader } from 'vux';
import BtPickArea from 'btPlugins/btPickArea'
export default {
    data() {
        return {
            isShowRegion: false,
            regionName: ''
        }
    },
    methods: {
        getRegion(obj){
            let _this = this;
            this.isShowRegion = false;
            if(obj){
                if(!obj.cityName && !obj.provinceName){
                    _this.regionName = '全国'
                } else if(!obj.cityName){
                    _this.regionName = obj.provinceName
                } else{
                    _this.regionName = obj.provinceName + obj.cityName
                }
            }
        }
    },
    beforeMount() {
        this.$setTitle('省市区选择demo')
    },
    mounted() {
    },
    components: { BtPickArea }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
@import "~@/less/variables.less";
.get-link{
    padding: 15px;
    line-height: 50px;
    font-size: 25px;
}
</style>
