<template>
    <div>
        <transition name="vux-pop-up">
            <div v-if="show" class="full-wrapper region-wrapper">
                <x-header :left-options="{preventGoBack:true}" @on-click-back="chooseCity(null)">
                    <search
                    @on-change="onSearchChange"
                    placeholder="请输入城市名搜索"
                    v-model="searchKey"
                    position="absolute"
                    auto-scroll-to-top
                    @on-submit="onsearchSubmit" ref="search">
                        <scroller class="city-list" v-if="searchKey">
                            <group v-if="searchedCitys.length">
                                <cell is-link :title="city.cityName" v-for="city in searchedCitys" :key="city.cityId" @click.native="chooseCity(city)">
                                </cell>
                            </group>
                            <div class="search-no-result" v-else>无匹配结果</div>
                        </scroller>
                    </search>
                </x-header>
                <scroller class="province-list">
                    <group>
                        <cell v-if="locationInfo" is-link class="location-city" @click.native="chooseCity(locationInfo)">
                            <div slot="default">
                                当前定位城市：
                                <i class="location-icon"></i>
                                <b>{{locationInfo.cityName}}</b>
                            </div>
                        </cell>
                        <cell v-else-if="isGettingLocation" class="location-city">
                            <div slot="default">
                                当前定位城市：
                                <img src="../_pickBase/loading.gif" />
                            </div>
                        </cell>
                        <cell v-else class="location-city">
                            <div slot="default">
                                <!-- <i class="location-icon"></i> -->获取定位失败，点击右上角刷新获取位置
                            </div>
                        </cell>
                        <cell v-if="chooseDeep<=1" is-link :title="'全国'" @click.native="chooseCity({
                                provinceId: '',
                                provinceName: '',
                                cityId: '',
                                cityName: ''})">
                        </cell>
                        <cell is-link :title="province.provinceName" v-for="province in provinceData" :key="province.provinceId" @click.native="chooseProvince(province)">
                        </cell>
                    </group>
                </scroller>
            </div>
        </transition>
        <transition name="vux-pop-in">
            <div class="full-wrapper city-wrapper" v-if="show && currProvince">
                <scroller class="city-list">
                    <group>
                        <cell v-if="chooseDeep<=2" is-link :title="'全省'" @click.native="chooseCity({
                                provinceId: currProvince.provinceId,
                                provinceName: currProvince.provinceName,
                                cityId: '',
                                cityName: ''})">
                        </cell>
                        <cell is-link :title="city.cityName" v-for="city in currProvince.children" :key="city.cityId" @click.native="chooseCity(city)">
                        </cell>
                        <cell class="stance"></cell>
                    </group>
                </scroller>
                <div class="bottom-action">
                    <x-button plain type="warn" @click.native="returnProvince">返回上一页</x-button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Pinyin from '../../libs/pinyin'
import {getFormatRegion} from '../../libs/area'
import { XButton, Group, Cell, CellBox, Search, XHeader } from 'vux'

let regionData = getFormatRegion();

export default {
    name: 'region',
    props: {
        show: Boolean,
        chooseDeep: {//最低选择级别，1国家，2省份，3城市
            type: Number,
            default: 3
        },
        deep: {
            type: Number,
            default: () => 2
        },
        callback: {
            type: Function
		},
		/**
		 * 是否移除省市
		 */
		isRemoveSuffix: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            provinceData: [],
            locationInfo: null, //当前定位城市
            isGettingLocation: true, //是否正在获取当前定位
            currProvince: null,
            searchKey: '',//搜索关键词
            searchedCitys: []//关键词匹配的城市
        }
    },
    methods: {
        // cancel(){
        //     this.show =
        //     this.$emit('update:show', false)
        // },
        //选择省份
        chooseProvince(province) {
            this.currProvince = province;
        },
        //选择城市
        chooseCity(city) {
            let returnObj = null;

			if(city){
				returnObj = {
					provinceId: city.parent.provinceId,
					provinceName: (city.parent.provinceName || ""),
					cityId: city.cityId,
					cityName: (city.cityName || "")
				};

				if(this.isRemoveSuffix){
					returnObj.provinceName = returnObj.provinceName.replace('省', '');
					returnObj.cityName = returnObj.cityName.replace('市', '');
				}
			}

            this.callback && this.callback(returnObj);

            // this.show = false;
            // this.$emit('update:show', false)
        },
        //返回上一级
        returnProvince() {
            this.currProvince = null;
        },
        //搜索框内容修改
        onSearchChange(key){
            var _this = this;
            _this.searchedCitys = [];
            if(key){
                key = key.toUpperCase();
                regionData.cities.forEach((item) => {
                    if(item.cityName.indexOf(key) > -1 || item.fullChars.indexOf(key) == 0 || item.camelChars.indexOf(key) == 0){
                        _this.searchedCitys.push(item);
                    }
                })
            }
        },
        //搜索框回车
        onsearchSubmit () {
            this.$refs.search.setBlur()
        }
    },
    watch: {
        show(isShow) {
            if(isShow){
                this.currProvince = null;
            } else{
                this.searchKey = '',//搜索关键词
                this.searchedCitys = []//关键词匹配的城市
                this.$refs.search.setBlur()
            }
            this.$emit('update:show', isShow)
        },
    },
    mounted() {
		console.log('暂时只实现了最基础版本，有调用需要再优化！')
        let _this = this;
        _this.provinceData = regionData.provinces;

        //输入频率控制
        let fn = _this.onSearchChange;
        _this.onSearchChange = Util.debounce(fn, 300)

		//城市的全拼和英文简写生成
        regionData.cities.forEach((item) => {
            item.fullChars = Pinyin.getFullChars(item.cityName).toUpperCase()//全拼
            item.camelChars = Pinyin.getCamelChars(item.cityName).toUpperCase()//首字母
        })

        // getLocation().then((res) => {
        //     _this.locationInfo = res;
        //     _this.isGettingLocation = false;
        // }, (err) => {
        //     _this.locationInfo = null;
        //     _this.isGettingLocation = false;
        // })
    },
    components: { XButton, Group, Cell, CellBox, Search, XHeader }
}

</script>
<style lang="less">
    @import "~@/less/mixin.less";
    @import "~@/less/variables.less";
    .weui-cells {
        margin-top: 0 !important;
        &:after {
            display: none;
        }
    }

    .full-wrapper{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
    }

    .region .region-wrapper{
        z-index: 100;
    }
    .region-wrapper{
        .vux-header{
            padding: 0;
            background-color: #EFEFF4;
            height: 44px;
            .vux-header-left{
                .vux-header-back{
                    color: #333;
                }
            }
            .vux-header-title{
                margin: 0 0 0 62px;
                color: #333;
                text-align: left;
            }
        }
    }
    .province-list{
        height: auto !important;
        top: 44px !important;
        bottom: 0;
        .location-city{
            font-size: 15px;
            display: block;
            .weui-cell__ft{
                color: #333 !important;
                text-align: left !important;
            }
            line-height: 30px;
            // vertical-align: middle;
            i.location-icon{
                background: url(../_pickBase/location@2x.png);
                background-size: 12px auto;
                width: 12px;
                height: 15px;
                display: inline-block;
                margin: 0 0px 0 0;
                // margin-right: 8px;
                position: relative;
                top: 2px;
            }
            b{
                color: @primaryColor;
                font-weight: normal;
            }
            img{
                width: 18px;
                display: inline;
                vertical-align: middle;
            }
        }
    }
    .city-wrapper {
        @bottonHeight: 70px;
        z-index: 100;
    /*    overflow-y: scroll;
        -webkit-overflow-scrolling: touch;*/
        /*transform: translate3d(0,0,0);*/
        /*.city-list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            bottom: @bottonHeight;
        }*/
        .stance {
            height: @bottonHeight + 5px;
        }
        .bottom-action {
            transform: translate3d(0,0,0);
            position: absolute;
            bottom: 0;
            height: @bottonHeight;
            left: 0;
            width: 100%;
            z-index: 999;
            padding: 10px 15px;
            box-shadow: 0 0 7px 3px #e2e2e2;
            background: #f8f8f8;
        }
        &.vux-pop-in-leave-active {
          transform: translate3d(0, 0, 0);/*退出的时候不要动画了*/
        }
    }
    .weui-cells.vux-search_show{
        width: 100%;
        height: 100%;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        .city-list{
            background-color: #fff;
            .search-no-result{
                text-align: center;
                padding-top: 100px;
                color: #999;
                font-size: 16px;
            }
            .weui-cell:last-child{
                margin-bottom: 44px;
            }
        }
    }
    .weui-search-bar{
        z-index: 100;
        .weui-search-bar__label{
            line-height: 28px;
            font-size: 0;
        }
    }
</style>
