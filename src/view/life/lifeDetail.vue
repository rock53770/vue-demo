<template>
    <div class="lifeDetail pb60">
        <van-swipe :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(item, index) in resData.bannerPictureList" :key="index">
                <img :src="item" class="h180 w-100"/>
            </van-swipe-item>
        </van-swipe>
        <div class="pt15 pb15 plr12 bg-white">
            <h3 class="ft17 mb5">{{ resData.title }}</h3>
            <div class="flex-center">
                <div class="cl-gray ft13">{{ resData.mainPointList | point }}</div>
            </div>
        </div>
        <!-- 投保方案 -->
        <div class="mt10 bg-white">
            <h3 class="bold_bd_left_l lh40 ft16 van-hairline--bottom">投保方案</h3>
            <div class="plr15">
                <div v-for="(item, index) in rules" :key="index">
                    <!-- 被保人年龄 -->
                    <div class="van-hairline--bottom flex-center justify-sb pl7 pb10" v-if="item.isAge">
                        <span class="ft15">{{ item.ruleTitle }}</span>
                        <div class="flex-center flex-w justify-end" style="max-width: 200px">
                            <button class="dryBtn cellSpace" :class="(item.value == btn.ruleItemId)?'link cl-orange' : ''"
                                v-for="(btn, index) in item.items" :key="index" @click="selecAgeRoute(item, btn)">
                                {{ btn.ruleItemContent }}
                            </button>
                        </div>
                    </div>

                    <!-- 出生日期 -->
                    <div class="van-hairline--top-bottom h45 flex-center justify-sb pl7" v-else-if="item.isDatePicker">
                        <span class="ft15">{{ item.ruleTitle }}</span>
                        <div class="flex-center" @click="openDatePop(item.value)">
                            <span class="mr10">{{ $util.formatDate(new Date(Number(item.value)),"yyyy-MM-dd") }}</span>
                            <img src="../../assets/icons/icon_calendar@3x.png" height="18" width="18">
                        </div>
                    </div>

                    <!-- 附加 -->
                    <div class="van-hairline--bottom h45 flex-center justify-sb pl7" v-else-if="item.isAdditional">
                        <span class="ft15">{{ item.ruleTitle }}</span>
                        <div class="flex-center">
                            <button class="dryBtn mr5" :class="(item.value == 1)?'link cl-orange' : ''" @click="addtional(item,1)">附加</button>
                            <button class="dryBtn" :class="(item.value == 0)?'link cl-orange' : ''" @click="addtional(item,0)">不附加</button>
                        </div>
                    </div>

                    <div class="van-hairline--bottom flex-center justify-sb pl7 pb10" v-else>
                        <span class="ft15">{{ item.ruleTitle }}</span>
                        <div class="flex-center">
                            <div class="flex-center justify-end flex-w plans" style="max-width: 200px">
                                <button class="dryBtn cellSpace" :class="(item.value == btn.ruleItemId)?'link cl-orange' : ''"
                                    v-for="(btn, index) in item.items" :key="index" @click="selecItem(item, index)">
                                    {{ btn.ruleItemContent }}
                                </button>
                            </div>
                            <div class="cl-orange ft14 ml5 mt10" @click="searchOcc(item)" v-if="item.canQueryCareer">查询</div>
                        </div>
                    </div>
                </div>

                <div class="van-hairline--bottom h45 flex-center justify-sb pl7">
                    <span>购买份数</span>
                    <div class="flex-center">
                        <img src="../../assets/icons/icon_Minus@3x.png" height="28" width="28" @click="reduceCount" v-show="count == 1">
                        <img src="../../assets/icons/icon_Minus_hover@3x.png" height="28" width="28"  @click="reduceCount" v-show="count > 1">
                        <span class="mlr10">{{ count }}</span>
                        <img src="../../assets/icons/icon_Plus@3x.png" height="28" width="28" @click="addCount">
                    </div>
                </div>

                <div class="van-hairline--bottom h45 flex-center justify-sb pl7">
                    <span class="cl-orange ft18" v-if="price">{{ price | currency2('￥','2') }}元</span>
                    <span class="cl-orange ft15" v-else>无匹配价格</span>
                    <span class="cl-yellow" v-if="type !== 2">推广费{{ plan.rebatePoint }}%</span>
                </div>
            </div>
        </div>
        
        <div class="mt10 bg-white" v-if="benefitList.length">
            <h3 class="bold_bd_left_l lh40 ft16 van-hairline--bottom">保障权益/保额</h3>
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item :title="item.title" :name="index" :value="item.value"
                    v-for="(item, index) in benefitList" :key="index">{{ item.content }}
                </van-collapse-item>
            </van-collapse>
        </div>
        
        <div class="mt10 bg-white">
            <van-tabs v-model="active" sticky :line-width="40">
                <van-tab v-for="(item,index) in describeList" :title="item.title" :key="index">
                    <div v-html="item.content" class="w-100 of-hide mce-content-body"></div>
                </van-tab>
            </van-tabs>
        </div>
        <!-- tools -->
        <div class="pos-f b0 l0 r0 van-hairline--top zi100">
            <div class="h50 bg-white flex-center justify-sb pl15">
                <div class="cl-orange ft24" v-if="price">{{ price | currency2('￥','2') }}</div>
                <div class="cl-orange ft18" v-else>无匹配价格</div>
                <van-button type="default" class="btn_gradient cl-white w150" @click="createDeliverData(1)">立即投保</van-button>
            </div>
        </div>

        <van-popup v-model="occPopShow" position="right" :overlay="true" class="grade h-100">
            <occ v-on:getOcc="getOcc" v-on:hide="hidePopup" :compare="true" :minGrade="occ.min" :maxGrade="occ.max" :companyId="companyId"></occ>
        </van-popup>
        <van-popup v-model="datePopShow" position="bottom" :overlay="true">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                :minDate="minDate"
                @cancel="closeDatePop"
                @confirm="confirmDate"
            />
        </van-popup>
        <van-popup v-model="safeAttionShow" position="right" :overlay="true" class="w-100 h-100">
            <section class="attion">
                <div class="cl-orange ft14 bg plr15 pt12 pb12">为保证被保险人的保险权益在理赔时不受影响，请确认 被保险人健康状况是否符合以下投保条件</div>
                <div class="plr15 pt12 pb12 ft15 mce-content-body of-hide" v-html="safeRemark"></div>
            </section>
            <div class="van-hairline--top">
                <div class="h50 bg-white flex-center ft16">
                    <button class="flex-1 bg-white h-100" @click="unAccordWith">不符合</button>
                    <button class="btn_gradient cl-white flex-1 h-100" @click="isAccordWith">符合，立即投保</button>
                </div>
            </div>
        </van-popup>

        <van-popup v-model="sharePop" position="bottom" :overlay="true">
            <mobileShare :config="config" v-on:CLOSE_SHARE="closeShare"></mobileShare>
        </van-popup>
    </div>
</template>
<script>
import lifeService from '@/api/lifeService'
import occ from '@/components/occupation'
import { WechatRegistrar, wxShare } from "@/lib/wechat";
import mobileShare from '@/components/mobileShare/index'

export default {
    name: 'lifeDetail',
    data() {
        return {
            id: "",
            uid: "",
            type: "",
            resData: {},
            activeName: "",
            active: 0,
            plan: {},
            rules: [],
            occPopShow: false,
            occ: {
                min: "",
                max: ""
            },
            datePopShow: false,
            safeAttionShow: false,
            currentDate: "",
            selecDate: 1553137441200,
            grade: 0,
            // ages: [],
            // ageIndex: 0,
            currentItem: {},
            benefitList: [],
            count: 1,
            companyId: "",
            benefitListReady: [],
            describeList: [],
            deliverData: {},
            paramList: [],
            safeRemark: "",
            minDate: new Date('1900/1/1'),
            sharePop: false,
            config: {
                sharePhotos: "http://cdnpubimg.bz-ins.com/PUBLIC/INSURANCE_PUBLIC/2018-11-15/7fc3fe06-21a7-45e5-b573-069768c9d548-YT.png",
                shareTitle: "",
                shareDesc: "",
                shareUrl: ""
            },
        }
    },
    computed: {
        price() {
            return  this.plan.price ? this.plan.price * this.count : 0
        }
    },
    methods: {
        getDetail() {
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration:0
            });
            let param = { id: this.id }
            let service = (this.type == 1) ? lifeService.goodsDetail(param) : 
                          (this.type == 2) ? lifeService.goodsShareDetail(param) : lifeService.goodsPreDetail(param)
            
            service.then((res) => {
                    Toast.clear()
                    if (res.code == 1) {
                        this.resData = res.object
                        this.plan = res.object.plan
                        this.companyId = res.object.companyId
                        this.rules = res.object.plan.rules
                        this.benefitListReady = res.object.benefitList
                        this.attachmentList = res.object.attachmentList
                        this.benefit()
                        this.describe()
                        setPageTitle(this.resData.title)

                        this.wxconfig()
                    } else {
                        Toast(res.message)
                    }
                })
        },
        benefit() {
            this.benefitList = []
            let list = [], hasOne, data = this.benefitListReady
			this.rules.forEach(it => {
                if (it.fitItemId) {
                    list.push(it.fitItemId)
                }
            })
            for (let i = 0; i < data.length; i++) {
                hasOne = list.findIndex(it => {
                    if (it == data[i].ruleItemId) {
                        return true
                    }
                })
                if (hasOne !== -1) {
                    this.benefitList.push(data[i])
                }
            }

        },
        describe() {
			let list = this.resData.describeList
            let hasOne = list.find((it, index) => {
                if (it.type == 5) {
                    this.safeRemark = it.content
                    return list.splice(index, 1)[0].content
                }
            })
            

            for(let i = 0; i < list.length; i++) {   
                if(list[i].type) {
                    let temp = {
                        title: list[i].type == 1 ? "产品特色":
                               list[i].type == 2 ? "投保须知":
                               list[i].type == 3 ? "理赔服务": "常见问题",
                        type: list[i].type,
                        content: list[i].content
                    }
                    this.describeList.push(temp)
                }
            }
            
        },
        getOcc(obj) { // emit 获取选择职业
            console.log(obj)
        },
        hidePopup() { // emit 关闭职业pop
            this.occPopShow = false
        },
        closeDatePop() { // 关闭日期pop
            this.datePopShow = false
        },
        openDatePop(data) {
            this.currentDate = new Date(+data)
            this.datePopShow = true
        },
        confirmDate(e) { // 选定date日期
            this.datePopShow = false
            this.rules.forEach(it => {
                if (it.isDatePicker) {
                    it.value = +e
                    this.benefit()
                }
            })
            this.createdParam(1)
        },
        selecItem(obj, n) { // 选择内容
            obj.value = obj.items[n].ruleItemId
            this.createdParam(1)
            this.benefit()
        },
        benefitPreview(id, title) {
            this.resData.benefitList.forEach(it => {
                if (it.ruleItemId == id) {
                    this.benefitList.push(it)
                }
            })
        },
        addtional(obj, n) { // 附加项选择
            obj.value = n
            this.benefit()
            this.createdParam(1)
        },
        selecAgeRoute(obj, btn) { // 选择投保年龄区间
            obj.value = btn.ruleItemId
            this.createdParam(1)
            this.benefit()
        },
        searchOcc(obj) { // 查询准备
            let $id = obj.value
            obj.items.forEach((it,index) => {
                if (it.ruleItemId == $id) {
                    this.occ.min = Number(obj.items[index].startValue)
                    this.occ.max = Number(obj.items[index].endValue)
                }
            })
            this.occPopShow = true
        },
        createDeliverData(n) {
            let deliverData = []
            let $obj = {}
            let $data = {}
            this.rules.map(it => {
                let $index = it.value
                $obj.title = it.ruleTitle
                $obj.ruleId = it.ruleId
                if (it.isDatePicker) {
                    $obj.select = +$index
                } else if (it.isAdditional) {
                    $obj.select = $index == 1 ? true: false
                } else  {
                    $obj.select = it.items.find(iner => {
                        if (iner.ruleItemId == $index) return true
                    })
                }
                deliverData.push($obj)
                $obj = {}
            })
            this.createdParam(0)
            $data = {
                attachmentList: this.attachmentList,
                selecList: deliverData,
                title: this.resData.title,
                count: this.count,
                companyId: this.companyId,
                companyName: this.resData.companyName,
                price: this.plan.price,
                paramList: this.paramList
            }
            this.deliverData = $data

            if (n) {
                this.insure(deliverData)
            }

        },
        insure(data) { // 立即投保
            if (!this.price) {
                Toast('规则项不匹配，无法为您继续投保。')
                return
            }

            let text = "", value = ""
            for(let i = 0; i < data.length; i++) {
                text+= `<p class="ta-l">${ data[i].title }：`

                if (typeof data[i].select === "number") {
                    value = Util.formatDate(new Date(data[i].select),"yyyy-MM-dd")
                } else if (typeof data[i].select === "boolean") {

                    value = data[i].select ? '附加': '不附加'
                } else {
                    value = data[i].select.ruleItemContent
                }
                text+= `${ value }</p>`
            }

            Dialog.confirm({
                title: '确认投保方案',
                messageAlign: 'left',
                cancelButtonText: '返回修改',
                message: text
            }).then(() => {
                if (this.safeRemark) {
                    this.safeAttionShow = true    
                } else {
                    let param = {}
                    if (this.type == 2) {
                        param = {
                            id: this.id,
                            uid: this.uid
                        }
                    } else {
                        param = { id: this.id }
                    }

                    Util.setSessionData('ruleConfig', this.deliverData)
                    btPage.open({
                        url: '/life/life_insure',
                        container_style: 1,
                        params: param
                    })
                }
            }).catch(() => {
                console.log(`dialog is closed!`)
            });
        },
        unAccordWith() {
            Dialog.confirm({
                messageAlign: 'center',
                cancelButtonText: '看看其他产品',
                confirmButtonText: '选错了',
                message: '被保人不符合健康要求暂时无法为您投保'
            }).then(() => {
                this.safeAttionShow = false
            }).catch(() => {
                btPage.open({
                    url: '/life/life_product_list',
                    container_style: 1
                })
            });
        },
        isAccordWith() { // 是否符合规则
            this.createDeliverData(0)
            Util.setSessionData('ruleConfig', this.deliverData)
            let param = {}
            if (this.type == 2) {
                param = {
                    id: this.id,
                    uid: this.uid
                }
            } else {
                param = { id: this.id }
            }
            btPage.open({
                url: '/life/life_insure',
                container_style: 1,
                params: param
            })
        },
        createdParam(n) {
            this.paramList = []
            let list = [], temp = {}
            for(let i = 0; i < this.rules.length; i++) {
                temp = {
                    ruleId: this.rules[i].ruleId,
                    value: this.rules[i].value.toString()
                }
                list.push(temp)
            }
            this.paramList = list
            if (n) {
                this.getTotalPrice(list)
            }

        },
        getTotalPrice(obj) {  // 频繁事件，获取价格
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration:0
            });
            let param = {
                goodsId: this.id,
                queryPlanList: obj
            }
            lifeService.calculate({json: JSON.stringify(param)})
                .then((res) => {
                    Toast.clear()
                    if (res.code == 1) {
                        this.plan = res.object
                        this.rules = res.object.rules
                        this.benefit()
                    } else {
                        Toast(res.message)
                    }
                })
        },
        addCount() {
            this.count++
        },
        reduceCount() {
            if (this.count > 1) {
                this.count--
            }
        },
        showSharePop() {
            this.sharePop = true
        },
        closeShare(data) {
            this.sharePop = data
        },
        wxconfig() {
            var id = this.$route.query.id;
            var doc = this.resData.mainPointList ? this.resData.mainPointList.join(' / ') : ""
            var title = this.resData.title
            var $cookie = Util.getCookie('userInfo')
            this.$cookie = $cookie
            const BASE_URL = "https://insuranceapixxb.bz-ins.com/life/life_detail" // 生产
            // const BASE_URL = "http://prepinsuranceapixxb.bz-ins.com/life/life_detail"  // 予发布
			// const BASE_URL = "http://wxtest.bz-ins.com/life/life_detail"  // 测试
            var $url = `${ BASE_URL }?id=${id}&type=share&uid=${ $cookie.uid }`

            this.$url = $url;
            this.config.shareUrl = $url
            this.config.shareTitle = title
            this.config.shareDesc = doc
            var ua;
            if (typeof window !== "undefined") {
                ua =
                ("navigator" in window &&
                    "userAgent" in navigator &&
                    navigator.userAgent.toLowerCase()) ||
                "";
            }

            if (ua.indexOf("micromessenger") !== -1) {
                this.shareShow = false;
                var btWechat = new WechatRegistrar();

                btWechat
                .setConfig()
                .then(function() {
                    wxShare({
                        title: title,
                        desc: doc,
                        link: $url
                    });
                })
                .catch(rej => {
                    btWechat.setConfig().then(function() {
                    wxShare({
                        title: title,
                        desc: doc,
                        link: $url
                    });
                    });
                });
            } else if (GConfig.isInApp) {
                this.shareShow = true;
            } else {
                this.shareShow = false;
            }
        },
    },
    created() {
        this.id = this.$route.query.id
        this.type = this.$route.query.type === "normal" ? 1 : 
                    this.$route.query.type === "share" ? 2 : 3
        this.getDetail()
    },
    mounted() {
        if (this.type == 2) {
            this.uid = this.$route.query.uid    
        }
    },
    components: {
        occ
    },
    filters: {
        point(arr) {
            return arr ? arr.join(' / ') : ""
        }
    }
}
</script>
<style lang="less" scoped>
.h180 {
    height: 180px;
}
.pb60 {
    padding-bottom: 60px;
}

.dryBtn {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    background-color: #fff;
    outline: none;
    border-radius: 3px;
    border: 1px solid #97999b;
    color: #97999b;
    padding: 0 5px;
    min-width: 50px;
}

.cellSpace {
    margin: 10px 0 0 5px;
}
.attion {
    height: calc(100% - 50px);
    overflow-y: scroll;
}

.plans :first-child {
    margin-left: 0;
}
.plans :nth-child(4n) {
    margin-left: 0;
}
.grade {
    width: calc(100% - 50px);
}
.link {
    border-color: #FC6B47;
}
.van-collapse-item {
    /deep/ .van-cell__title {
        white-space: nowrap;
    }
}
</style>
