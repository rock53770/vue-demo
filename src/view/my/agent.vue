

<template>
  <div>
    <div class="cl-orange ta-l plr15" style="background-color:#FDE7D8;line-height:32px;">
      <span class="icon-tip pl20">余额提现银行卡实际持有人需和认证身份一致</span>
    </div>
    <div class="mb10 pt10">
      <div class="pl10 clearfix pics">
        <div class="fl w-50 pr10 mb10 ta-c ">
            <div class="h100 bg-img-sample1 pos-r bdr5">
              <upload :pics="idFrontPic" v-show="!(idFrontPic[0] && idFrontPic[0].content)" class="w-100 h-100" max="1">
                <div class="w-100 h-100 flex-center justify-c">
                    <span class="plr10 lh24 bdr10 bg-o5 cl-white">点击上传</span>
                </div>
              </upload>
              <img :src="idFrontPic[0] && idFrontPic[0].content" class="thumb-img" v-show="idFrontPic[0] && idFrontPic[0].content" max="1" @click="imagePreview(3)">
              <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="idFrontPic[0] && idFrontPic[0].content" @click="deletePic(3)">
                  <i class="icon-delete"></i>
              </div>
              <!-- <i class="pos-a icon-delete" v-show="idFrontPic.content" @click="deletePic(3)"></i> -->
              <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                   v-show="idFrontPic[0] && idFrontPic[0].content && idFrontPic[0].status == 3">
                <span>上传失败，请删除重新上传</span>
              </div>
            </div>
            <p class="lh30">身份证正面</p>
        </div>
        <div class="fl w-50 pr15 mb10 ta-c">
            <div class="h100 bg-img-sample2 pos-r bdr5">
              <upload :pics="idBackPic" v-show="!(idBackPic[0] && idBackPic[0].content)" class="w-100 h-100" max="1" >
                <div class="w-100 h-100 flex-center justify-c">
                    <span class="plr10 lh24 bdr10 bg-o5 cl-white">点击上传</span>
                </div>
              </upload>
              <img :src="idBackPic[0] && idBackPic[0].content" class="thumb-img" v-show="idBackPic[0] && idBackPic[0].content"  @click="imagePreview(4)">
              <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="idBackPic[0] && idBackPic[0].content" @click="deletePic(4)">
                  <i class="icon-delete"></i>
              </div>
              <!-- <i class="pos-a icon-delete" v-show="idBackPic.content" @click="deletePic(4)"></i> -->
              <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                   v-show="idBackPic[0] && idBackPic[0].content && idBackPic[0].status == 3">
                <span>上传失败，请删除重新上传</span>
              </div>
            </div>
            <p class="lh30">身份证反面</p>
        </div>
      </div>
    </div>
    <div class="bg-white ft16 mb10">
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="star pos-r">姓名</span>
        <div class="flex-1">
            <input class="w-100 ta-r" type="text" v-model="agent.name" placeholder="请输入身份证姓名">
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="star pos-r">身份证号码</span>
        <div class="flex-1">
            <input class="w-100 ta-r" type="text" v-model="agent.licenseNo" placeholder="请输入身份证号">
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="star pos-r">民族</span>
        <div class="flex-1 ta-r">
            <popup-radio  :popupOption="popupOption" cancelText=""
              popupClass="w-100 h-100" :cur-column.sync="agent.nation" :columns="nationList" popupRadioClass="h-100 m-h-none">
              <span class="icon-right" v-text="agent.nation.name||'请选择'"></span>
            </popup-radio>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="star pos-r">政治面貌</span>
        <div class="flex-1 ta-r">
            <popup-radio :cur-column.sync="agent.political" :columns="politicList" cancelText="取消">
              <span class="icon-right w-100 ta-r" v-text="agent.political.name||'请选择'"></span>
            </popup-radio>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="star pos-r">文化程度</span>
        <div class="flex-1 ta-r">
            <popup-radio :cur-column.sync="agent.degree" :columns="degreeList" cancelText="取消">
              <span class="icon-right w-100 ta-r" v-text="agent.degree.name||'请选择'"></span>
            </popup-radio>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span>毕业院校</span>
        <div class="flex-1">
            <input class="w-100 ta-r" type="text" v-model="agent.school" placeholder="请输入您的毕业学院">
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="">所在公司</span>
        <div class="flex-1 ta-r">
            <popup-radio :cur-column.sync="agent.company" :columns="companyList" cancelText="取消">
              <span class="icon-right w-100 ta-r" v-text="agent.company.name||'选择您所在的公司类型'"></span>
            </popup-radio>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span>职位</span>
        <div class="flex-1">
            <input class="w-100 ta-r" type="text" v-model="agent.position" placeholder="请输入您的职位">
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <span class="flex-1" @click="showSite">省/市/区</span>
        <div class="">
            <span class="icon-right w-100 ta-r" v-text="reciverProvinceCityCount||'请选择'" @click="showSite"></span>
        </div>
      </div>
      <div class="lh50 plr10 flex-center van-hairline--bottom">
        <!-- <span>详细地址</span> -->
        <div class="flex-1">
            <van-field
              class="w-100 ft16 address"
              v-model="agent.address"
              label="详细地址"
              type="textarea"
              placeholder="请输入地址"
              rows="1"
              autosize
            />
            <!-- <input class="w-100 ta-r" type="textarea" autosize v-model="agent.address" placeholder="请输入地址"> -->
        </div>
      </div>

    </div>
    <!-- <div class="ft10 mlr10 pb10">
      <van-checkbox v-model="checked" shape="square" class=""></van-checkbox>
      <span class="" @click="checked = !checked">我已经阅读并同意签署</span><span class="cl-orange" @click="goProtocal">《星利保险经纪有限公司代理合同》</span>
    </div> -->
    <van-popup v-model="isShowSite" position="bottom" :overlay="true">
        <van-area :area-list="areaList" :loading="false" :height="'180'" title="选择城市" :value="countyCode"  @cancel="onCancel" @confirm="onConfirm"/>
    </van-popup>
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10 van-hairline--top">
        <van-button type="primary flex-1" :block="true" round  @click="submit" text="提交认证"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
    import PopupRadio from '@/components/PopupRadio.vue'
    import upload from '@/components/Upload/index.vue'
    import myService from '@/api/myService'
    import Area from './../../lib/area.js'
    // const  Area = r => require.ensure( [], () => r (require('./../../lib/area.js')))
    // const  Area = import('./../../lib/area.js')
    export default {
        name: 'auth',
        data () {
            return {
                checked:true,
                arr:[],
                popupOption:{
                    position:'right',
                },
                isShowSite:false,
                reciverProvinceCityCount:'',
                provinceCode:"",
                cityCode:"",
                countyCode:"",
                provinceName:"",
                cityName:"",
                countyName:"",
                agent:{
                  name:'',
                  licenseNo:'',
                  political:{name:""},
                  degree:{name:""},
                  school:'',
                  position:'',
                  company:{name:""},
                  nation:{name:""},
                },
                nationList:[{id:1,name:"汉族"},{id:2,name:"蒙古族"},{id:3,name:"满族"},{id:4,name:"朝鲜族"}
                    ,{id:5,name:"赫哲族"},{id:6,name:"达斡尔族"},{id:7,name:"鄂温克族"},{id:8,name:"鄂伦春族"}
                    ,{id:9,name:"回族"},{id:10,name:"东乡族"},{id:11,name:"土族"},{id:12,name:"撒拉族"}
                    ,{id:13,name:"保安族"},{id:14,name:"裕固族"},{id:15,name:"维吾尔族"},{id:16,name:"哈萨克族"}
                    ,{id:17,name:"柯尔克孜族"},{id:18,name:"锡伯族"},{id:19,name:"塔吉克族"},{id:20,name:"乌孜别克族"}
                    ,{id:21,name:"俄罗斯族"},{id:22,name:"塔塔尔族"},{id:23,name:"藏族"},{id:24,name:"门巴族"}
                    ,{id:25,name:"珞巴族"},{id:26,name:"羌族"},{id:27,name:"彝族"},{id:28,name:"白族"}
                    ,{id:29,name:"哈尼族"},{id:30,name:"傣族"},{id:31,name:"僳僳族"},{id:32,name:"佤族"}
                    ,{id:33,name:"拉祜族"},{id:34,name:"纳西族"},{id:35,name:"景颇族"},{id:36,name:"布朗族"}
                    ,{id:37,name:"阿昌族"},{id:38,name:"普米族"},{id:39,name:"怒族"},{id:40,name:"德昂族"}
                    ,{id:41,name:"独龙族"},{id:42,name:"基诺族"},{id:43,name:"苗族"},{id:44,name:"布依族"}
                    ,{id:45,name:"侗族"},{id:46,name:"水族"},{id:47,name:"仡佬族"},{id:48,name:"壮族"}
                    ,{id:49,name:"瑶族"},{id:50,name:"仫佬族"},{id:51,name:"毛南族"},{id:52,name:"京族"}
                    ,{id:53,name:"土家族"},{id:54,name:"黎族"},{id:55,name:"畲族"},{id:56,name:"高山族"}
                    ,{id:57,name:"无法认定"}
                    ,{id:58,name:"外籍入国"}],
                politicList:[{id:1,name:"群众"},{id:2,name:"共青团员"},{id:3,name:"中共预备党员"},{id:4,name:"中共党员"},
                    {id:5,name:"九三学社社员"},{id:6,name:"民革会员"},{id:7,name:"民盟会员"},{id:8,name:"民建会员"}
                    ,{id:9,name:"民进会员"},{id:10,name:"农工党会员"},{id:11,name:"台盟盟员"},{id:12,name:"致公党党员"},
                    {id:13,name:"无党派人士"}],
                degreeList:[{id:1,name:"博士"},{id:2,name:"硕士"},{id:3,name:"本科"},{id:4,name:"大专"},
                    {id:5,name:"高中及同等学历"},{id:6,name:"初中及同等学历"},{id:7,name:"初中以下学历"}],
                companyList:[{id:1,name:"产险"},{id:2,name:"寿险"},{id:3,name:"经代公司"},{id:4,name:"保险公估"},
                    {id:5,name:"汽车经销商"},{id:6,name:"汽车后市场（二手车、维修保养）"},{id:7,name:"其他"}],
                idFrontPic:[],
                idBackPic:[]
            }
        },
        created() {
          this.areaList = Area;
          if(this.$route.query.noApply){
            return
          }
          Toast.loading({
              duration:0,
              forbidClick:true,
              message: '加载中...'
          });
          myService.userAgent().then((res) => {
              Toast.clear();
              if(res.code == 1 && res.object && res.object.userAgentInfoVo){
                  // this.$router.back();
                  var userAgentInfoVo = res.object.userAgentInfoVo || {};

                  this.agent.name = userAgentInfoVo.name;
                  this.agent.licenseNo = userAgentInfoVo.licenseNo;
                  if("-1" == userAgentInfoVo.auditStatus ){
                    return
                  }
                  this.agent.nation.name = userAgentInfoVo.nation;
                  this.agent.political.name = userAgentInfoVo.political;
                  this.agent.degree.name = userAgentInfoVo.degree;
                  this.agent.company.name = userAgentInfoVo.company || '';

                  this.agent.position = userAgentInfoVo.position || '';
                  this.agent.school = userAgentInfoVo.school || '';
                  this.agent.address = userAgentInfoVo.address || '';

                  this.provinceCode = userAgentInfoVo.provinceId;
                  this.cityCode = userAgentInfoVo.cityId;
                  this.countyCode = "" + userAgentInfoVo.countyId;
                  this.provinceName = userAgentInfoVo.provinceName;
                  this.cityName = userAgentInfoVo.cityName;
                  this.countyName = userAgentInfoVo.countyName;
                  this.reciverProvinceCityCount = userAgentInfoVo.provinceName + ' ' + userAgentInfoVo.cityName + ' ' + userAgentInfoVo.countyName;

                  this.idFrontPic[0] = {};
                  this.idBackPic[0] = {};
                  this.idFrontPic[0].content = userAgentInfoVo.idCardFrontPicture || '';
                  this.idFrontPic[0].result = {viewPath:userAgentInfoVo.idCardFrontPicture || ''};

                  this.idBackPic[0].content = userAgentInfoVo.idCardBackPicture || '';
                  this.idBackPic[0].result = {viewPath:userAgentInfoVo.idCardBackPicture || ''};
              } else if (res.code === 0){

              } else {
                Toast(res.message)
              }
          })
        },
        methods:{
            submit(){
                if(!(this.idFrontPic[0] && this.idFrontPic[0].result && this.idFrontPic[0].result.viewPath)){
                    Toast("请上传身份证正面照片")
                    return
                }
                if(!(this.idBackPic[0] && this.idBackPic[0].result && this.idBackPic[0].result.viewPath)){
                    Toast("请上传身份证反面照片")
                    return
                }
                if(!this.agent.name){
                    Toast("请输入姓名")
                    return
                }
                if(!this.agent.licenseNo){
                    Toast("请输入身份证号")
                    return
                }
                if(!this.agent.nation.name){
                    Toast("请选择民族")
                    return
                }
                if(!this.agent.political.name){
                    Toast("请选择政治面貌")
                    return
                }
                if(!this.agent.degree.name){
                    Toast("请选择文化程度")
                    return
                }
                // if(!this.agent.school){
                //     Toast("请输入毕业院校")
                //     return
                // }
                // if(!this.agent.company.name){
                //     Toast("请选择所在公司")
                //     return
                // }
                // if(!this.agent.position){
                //     Toast("请输入职位")
                //     return
                // }
                // if(!this.countyCode){
                //     Toast("请选择省市区")
                //     return
                // }
                // if(!this.agent.address){
                //     Toast("请输入详细地址")
                //     return
                // }

                Toast.loading({
                    duration:0,
                    forbidClick:true,
                    message: '加载中...'
                });
                var agent = this.agent;
                myService.applyAgent({
                    name:agent.name,
                    licenseNo:agent.licenseNo,
                    nation:agent.nation.name,
                    political:agent.political.name,
                    degree:agent.degree.name,
                    school:agent.school||"",
                    company:agent.company.name||"",
                    position:agent.position||"",
                    provinceId:this.provinceCode||"",
                    cityId:this.cityCode||"",
                    countyId:this.countyCode||"",
                    address:agent.address||"",
                    cardFrontFileUrl:JSON.stringify({
                        type:1,
                        fileId:this.idFrontPic[0].result.id,
                        fileUrl:this.idFrontPic[0].result.viewPath
                    }),
                    cardBackFileUrl:JSON.stringify({
                        type:2,
                        fileId:this.idBackPic[0].result.id,
                        fileUrl:this.idBackPic[0].result.viewPath
                    })
                }).then((res) => {
                    Toast.clear();
                    if(res.code == 1){
                        btPage.open({
                            url: '/my',
                            type:3,
                            container_style: 1
                        })
                    } else {
                        Toast(res.message)
                    }
                })
            },
            onRead3(files){
                this.idFrontPic = files[0];
            },
            onRead4(files){
                this.idBackPic = files[0];
            },
            imagePreview(type){
                var arr = [];
                if(type == 3 ){
                    this.idFrontPic[0] && arr.push(this.idFrontPic[0].content)
                } else {
                    this.idBackPic[0] && arr.push(this.idBackPic[0].content)
                }

                ImagePreview({
                  images:arr,
                  startPosition:0,
                  onClose() {
                    // do something
                  }
                })
            },
            deletePic(type){
                if(type == 1){
                    this.driveIdPic = [];
                } else if(type == 2){
                    this.driveIdVicePic = [];
                } else if(type == 3){
                    this.idFrontPic = [];
                }else if(type == 4){
                    this.idBackPic = [];
                }
            },
            showSite() {
                this.isShowSite = true;
            },
            onCancel() {
                this.isShowSite = false;
            },
            onConfirm(value) {
                this.isShowSite = false;
                this.reciverProvinceCityCount = value[0].name + ' ' + value[1].name + ' ' + value[2].name;
                this.provinceCode = value[0].code;
                this.cityCode = value[1].code;
                this.countyCode = value[2].code;
            },
            goProtocal(){
              btPage.open({
                url: '/common/agreement',
                container_style:1,
                params:{
                  id:0
                }
              })
            },
        },
        mounted () {
            setPageTitle('成为保险代理人');
        },
        components :{
            upload,PopupRadio
        }
    }
</script>
<style lang="less">
.address{
  padding:10px 0;
  .van-field__control{
    text-align:right;
  }
}
</style>


