<template>
  <div>
    <div>
      <div class="h10"></div>
      <div class="plr10 lh50 flex-center bg-white van-hairline--bottom" v-if="!queryData.oid">
        <span class="flex-1 lh50 ft16 fw-b">是否为过户车</span>
        <van-switch size="26px"  v-model="isTransferCar"/>
      </div>
      <div class="plr10 lh50 flex-center bg-white">
        <span class="flex-1 tit-tag lh50 ft16 fw-b">交强险车船税</span>
        <van-switch size="26px"  v-model="isCompulsory"/>
      </div>
    </div>
    <div class="bg-white mt10">
      <div class="plr10 lh50 flex-center van-hairline--bottom">
        <span class="flex-1 tit-tag ft16 fw-b">商业险</span>
        <van-switch size="26px" :value="commercialSwitch"  @input="onInput"/>
      </div>
      <div class="bg-white plr10">
        <div class="flex-center h50 van-hairline--bottom" v-for="i in commercialList" @click="showTip(i)" :key="i.insuranceCoverageId">


          <popup-radio value-key="insuranceCoverageId" name-key="insuranceCoverageText" cancelText="取消"
                       :cur-column.sync="i.insuranceCatagory" :columns="i.insuranceCoverages" :title="i.insuranceName"
                       @click-item="choose(i)" :disabled="i.disabled" class="flex-center wh-100 ">

            <div class="flex-1">
              <span v-text="i.insuranceName"></span>
            </div>
            <div class="h-100 pt17 pb17" @click="disregard(i,$event)"  v-show="i.additionalInsuranceId && !i.disabled">
              <span class="disregard lh16 ft12 mr10" :class="{active:i.isAdditionalInsuranceSelected}"
                    >不计免赔</span>
            </div>
            <div class="h-100 pt17 pb17"  v-show="i.additionalInsuranceId && i.disabled">
              <span class="disregard lh16 ft12 mr10 cl-gray">不计免赔</span>
            </div>

            <div class="w100 ta-r" v-show="!i.disabled">
              <span v-text="i.insuranceCatagory.insuranceCoverageText||'请选择'"></span>
              <van-icon name="arrow-down" color="#CBCBCB" class="ver-align-mid"/>
            </div>
            <span class="w100 ta-r" v-show="i.disabled" :class="{'cl-gray':i.disabled}" >不投保</span>
          </popup-radio>

        </div>
      </div>
    </div>
    <!-- <div class="bg-white mt10">
      <div class="lh40 flex-center plr10 ">
        <span class="flex-1 ft16 fw-b">备注<span class="cl-gray ft14 fw-n">（非必填）</span></span>
      </div>
      <div class="">
          <van-field
                  v-model="requirement"
                  type="textarea"
                  placeholder="请输入备注"
                  rows="1"
                  autosize
                  class="van-hairline--surround"
          />
      </div>
    </div> -->
    <div class="h70 mt10">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10 van-hairline--top">
        <van-button type="primary" round :block="true" :disabled="!isCompulsory && !commercialSwitch"  @click="next" text="立即询价"></van-button>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 说明： 选择险种
 */
import PopupRadio from '@/components/PopupRadio.vue'
import releaseItemService from '@/api/releaseItemService'

export default {
    name: 'selectInsurance',
    data () {
      return {
        insuranceCoverage:0,
        pid:'',
        oid:'',
        citycode:'',
        isCompulsory:true,
        commercialSwitch:true,
        isTransferCar:false,
        requirement:'',
        carLose:false,
        commercialList:[],
        tempCommercialList:[]
      }
    },
    components: { PopupRadio },
    methods: {
        // 解析返回对象，并在此基础上添加，选责控制项
        parseData(data) {
            var that = this;
            if(data.code == 1) {
                let commercialList = data.object && data.object.commercialInsurances;
                commercialList.forEach(function(k,v) {
                    if(k.insuranceCoverages && k.insuranceCoverages.length) {

                        k.insuranceCoverages.forEach(function(k2,v2){
                            if(k2.insuranceCoverageId === null){
                                k.insuranceCoverages.splice(v2,1);
                            }
                        })
                        if(k.normalInsuranceId == 26){
                            k.insuranceCoveragesList = Util.deepClone(k.insuranceCoverages);
                            k.insuranceCoverages = k.insuranceCoveragesList.filter((k3)=>{
                                return k3.insuranceCoverage == that.insuranceCoverage
                            })
                        }
                        k.insuranceCoverages.push({
                            insuranceCoverageRemark: '不投保',
                            insuranceCoverageText: '不投保',
                            insuranceCoverageId: 0,
                        })

                        k.disabled = false;

                        let selectArr = k.insuranceCoverages.filter(function(k2,v2) {
                            return k2.isSelected == 1
                        })

                        if (selectArr.length && k.isNormalInsuranceSelected) {
                            k.insuranceCatagory = selectArr[0];
                        } else {
                            k.insuranceCatagory = {
                                insuranceCoverageRemark: '不投保',
                                insuranceCoverageText: '不投保',
                                insuranceCoverageId: 0,
                            }
                        }
                    }
                })

                this.commercialList = commercialList;
                commercialList.forEach((k) => {
                    this.linkage(k)
                })
            } else {
                Toast(data.message)
            }
        },
        onInput(commercialSwitch){
            let that = this;
            if(commercialSwitch){
              this.commercialList = this.tempCommercialList;
              // this.commercialList = Util.deepClone(this.tempCommercialList);
            } else {
              this.tempCommercialList = Util.deepClone(this.commercialList);
              this.commercialList.forEach(function(k,v){
                  let selectArr = k.insuranceCoverages.filter(function(k2,v2) {
                      return k2.insuranceCoverageId === 0
                  })
                  k.insuranceCatagory = selectArr[0];
                  that.choose(k);
              })
            }
            this.commercialSwitch = commercialSwitch;
        },
        showTip(i){
            if(i.disabled){
              Toast("请投保附加险相应主险")
            }
        },
        disregard(i,e) {
            if (i.insuranceCatagory.insuranceCoverageId === 0 || i.disabled){
                // Toast("请先投保对应险种")
                return
            }
            e.stopPropagation();
            i.isAdditionalInsuranceSelected = !!!i.isAdditionalInsuranceSelected;
        },
        choose(i) {
            if(i.insuranceCatagory.insuranceCoverageId === 0){
                i.isAdditionalInsuranceSelected = false;
            } else {
                i.isAdditionalInsuranceSelected = true;
            }
            this.linkage(i)
        },
        linkage(i){
            var list = this.commercialList;
            var that = this;
            var spiritualSolacet = 0;//
            var carLoseSelect = 0;//车损险是否选中
            var thirdSelect = 0;//第三者责任险是否选中  法定节假日责任限额翻倍险
            if(i.normalInsuranceId >= 1 && i.normalInsuranceId <= 4){
                list.forEach(function(k,v){
                  if(k.normalInsuranceId == 1){
                    if(k.insuranceCatagory.insuranceCoverageId !== 0){
                        carLoseSelect++
                    }
                  } else if(k.normalInsuranceId >= 2 && k.normalInsuranceId <= 4){
                    if(k.normalInsuranceId == 2 && k.insuranceCatagory.insuranceCoverageId !== 0){
                        that.insuranceCoverage = k.insuranceCatagory.insuranceCoverage;
                        thirdSelect++
                    }
                    if(k.insuranceCatagory.insuranceCoverageId !== 0){
                        spiritualSolacet++
                    }
                }
            })
            for(var j = 0; j < list.length; j++){
                if(list[j].normalInsuranceId == 6 || list[j].normalInsuranceId == 13 || list[j].normalInsuranceId == 14
                || list[j].normalInsuranceId == 15 || list[j].normalInsuranceId == 16 || list[j].normalInsuranceId == 21
                || list[j].normalInsuranceId == 23 || list[j].normalInsuranceId == 24){
                  if(carLoseSelect === 0){
                      list[j].disabled = true;
                  } else {
                      list[j].disabled = false;
                  }
                } else if(list[j].normalInsuranceId == 26){
                    // if(thirdSelect === 0){
                    //     list[j].disabled = true;
                    // } else {
                    //     list[j].disabled = false;
                    // }
                    if(thirdSelect === 0){
                      list[j].disabled = true;
                  } else {
                      list[j].disabled = false;
                    //   list[j].insuranceCoverage = that.data.
                      var insuranceCoverage = list[j].insuranceCoveragesList.filter((k3)=>{
                          return k3.insuranceCoverage == that.insuranceCoverage
                      })
                      if(list[j].insuranceCatagory.insuranceCoverageId === 0){//不投保时法定节假日当前选择不跟随第三者联动

                      } else {
                        list[j].insuranceCatagory = insuranceCoverage[0];//投保时法定节假日当前选择保额跟随第三者联动
                      }

                      list[j].insuranceCoverages = insuranceCoverage;
                      list[j].insuranceCoverages.push({
                        insuranceCoverageRemark: '不投保',
                        insuranceCoverageText: '不投保',
                        insuranceCoverageId: 0,
                      })
                  }
                } else if(list[j].normalInsuranceId == 27){
                    if(spiritualSolacet === 0){
                        list[j].disabled = true;
                    } else {
                        list[j].disabled = false;
                    }
                  }
                }
            }
            var commercialSwitch = false;
            list.forEach(function(k,v){
              if(k.insuranceCatagory.insuranceCoverageId !== 0 && k.disabled === false){
                  commercialSwitch = true;
              }
            })
            this.commercialSwitch = commercialSwitch;
        },
        next(){
          // Util.removeLocalData("hasUploadPics")
          // this.$router.push({name:'result'});


            var selectInsuranceInfo = [];
            this.commercialList.forEach(function(k,v) {
                if(!k.disabled){
                    if(k.insuranceCatagory && k.insuranceCatagory.insuranceCoverageId) { //0代表不投保
                        var obj = {
                        insuranceId:k.normalInsuranceId,
                        insuranceCoverageId:k.insuranceCatagory.insuranceCoverageId,
                        additionalInsuranceId:0,//0代表不计免赔未选中
                        }
                        if(k.isAdditionalInsuranceSelected){
                        obj.additionalInsuranceId = k.additionalInsuranceId
                        }
                        selectInsuranceInfo.push(obj)
                    }
                }
            })

            // if(selectInsuranceInfo.length === 0){
            //     Toast("请至少选择一个商业险")
            //     return
            // }

            Toast.loading({
                duration:0,
                forbidClick:true,
                message: '加载中...'
            });

            var provinceCode =  "";
            var cityCode = "";
            var cids = "" + this.queryData.cids;
            if(this.queryData.cityCode){
                cityCode = "" + this.queryData.cityCode;
                provinceCode = cityCode.substring(0,2) + "0000";
            }
            if(cids.charAt(0) !== "["){
                cids = "[" + cids + "]"
            }

            if(this.queryData.oid){

            } else {
                var picInfo = [];
                var picInfo1 = [];
                var remark = '';
                picInfo1 = Util.getLocalData("hasUploadPicsRelease") || [];
                remark =  Util.getLocalData("hasRemarkRelease") || '';

                picInfo1.forEach(function(k,v){
                    picInfo.push({
                      type:8,
                      fileId:k.result.id,
                      fileUrl:k.result.viewPath
                    })
                })
            }
            var params = {
                picInfo:Util.stringify(picInfo),
                remark:remark,
                isTransferCar:this.isTransferCar?1:0,
                isCompulsory: this.isCompulsory?1:0,
                isCommercial:this.commercialSwitch?1:0,
                selectInsuranceInfo:Util.stringify(selectInsuranceInfo),
            };
            console.log(params)
            // return
            releaseItemService.createOrder(params).then((res) => {
                Toast.clear();
                if(res.code == 1){
                    Util.removeLocalData("hasUploadPicsRelease")
                    Util.removeLocalData("hasRemarkRelease")
                    Toast(res.message)
                    btPage.open({
                      url: '/order',
                      container_style:1,
                      type: 3
                    })
                } else {
                    Toast(res.message)
                }
            });

        }
    },
    created() {
        this.queryData = this.$route.query
        Toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中...'
        })
        releaseItemService.getInsurance()
            .then((res) => {
                Toast.clear();
                this.parseData(res)
        })
    },
    mounted() {
      setPageTitle('选择险种');
    }
}
</script>
<style lang="less" scoped>
    .textarea {
        resize: none;
        border: 1px solid #F1F1F1;
        outline: none;
        height: 140px;
    }
</style>

