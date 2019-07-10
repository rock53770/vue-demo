<template>
  <!-- 老用户补充认证资料 -->
  <div class="agent-add-info-wrapper">
    <div class="apply-title">
      <div class="content-left">
        <h2>补充认证资料</h2>
        <p>根据监管要求，请补充展业证件照和常驻地</p>
      </div>
      <div class="content-right"></div>
    </div>
    <!-- 步骤2 -->
    <div class="step2-box ft16 mb10">
      <!-- 展业证件照 -->
      <div class="box bg-white">
        <h2 class="van-hairline--bottom">展业证件照</h2>
        <div class="exhibition-photo-box pics">
          <div class="pic-box">
            <div class="h-100 pos-r">
              <upload :pics="exhibitionPhoto" v-show="!(exhibitionPhoto[0] && exhibitionPhoto[0].content)" class="w-100 h-100" max="1">
                <div class="w-100 h-100 clear">
                  <div class="plus-icon">
                    <van-icon name="plus" color="#fff" size="23px"/>
                  </div>
                  <p class="ft16 ta-c lh25 cl-primary">点击上传</p>
                </div>
              </upload>
              <img :src="exhibitionPhoto[0] && exhibitionPhoto[0].content" class="thumb-img"
                   v-show="exhibitionPhoto[0] && exhibitionPhoto[0].content" max="1" @click="imagePreview(5)">
              <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="exhibitionPhoto[0] && exhibitionPhoto[0].content"
                   @click="deletePic(5)">
                <i class="icon-delete"></i>
              </div>
              <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                   v-show="exhibitionPhoto[0] && exhibitionPhoto[0].content && exhibitionPhoto[0].status == 3">
                <span>上传失败，请删除重新上传</span>
              </div>
            </div>
          </div>
          <div class="pic-box">
            <div class="h-100 pos-r bdr5" @click="imagePreview(6)">
              <img :src="tempPic" class="thumb-img">
              <span class="example">示例</span>
              <span class="show-detail">点击查看大图</span>
            </div>
          </div>
        </div>
        <p class="note">图片要求：半身、免冠、正面、白底、彩色照片</p>
      </div>
      <!-- 常驻地址 -->
      <div class="box bg-white">
        <h2 class="van-hairline--bottom">常驻地址</h2>
        <div class="lh50 plr15 flex-center van-hairline--bottom" @click="isShowSite = true">
          <span class="flex-1">常驻地省/市/区</span>
          <div class="">
            <span class="flex-center justify-end"
                  :class="{ 'c-gray': !reciverProvinceCityCount}">
              {{ reciverProvinceCityCount||'请选择' }}
              <van-icon class="ml10" name="arrow" color="#cbcbcb" size="14px"/>
            </span>
          </div>
        </div>
        <div class="lh50 plr15 flex-center van-hairline--bottom">
          <div class="flex-1">
            <van-field
              class="w-100 ft16 address pr25"
              v-model="agent.address"
              label="详细地址"
              type="textarea"
              placeholder="请输入地址"
              rows="1"
              autosize
            />
          </div>
        </div>
        <div class="lh50 plr15 flex-center van-hairline--bottom" @click="isShowCompanyPicker = true">
          <span class="flex-1">申请加入公司</span>
          <div class="">
            <span class="flex-center justify-end"
                  :class="{ 'c-gray': !agent.company.name}">
              {{ agent.company.name||'请选择' }}
              <van-icon class="ml10" name="arrow" color="#cbcbcb" size="14px"/>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 省市选择器 -->
    <van-popup v-model="isShowSite" position="bottom" :overlay="true">
      <van-area :area-list="areaList"
                :loading="false"
                :height="'180'"
                title="选择城市"
                :value="countyCode.toString()"
                @cancel="isShowSite = false"
                @confirm="onConfirm"/>
    </van-popup>
    <!-- 公司选择器 -->
    <van-popup v-model="isShowCompanyPicker" position="bottom" :overlay="true">
      <van-picker :columns="companyList"
                  :show-toolbar="true"
                  value-key="name"
                  :default-index="agent.company.index"
                  @cancel="isShowCompanyPicker = false"
                  @confirm="onCompanyConfirm"/>
    </van-popup>

    <div class="h65">
      <div class="flex-center pos-f b0 bg-white h65 p10 w-100 zi10 van-hairline--top">
        <van-button type="primary flex-1" :block="true" round  @click="submit" text="确认提交"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import PopupRadio from '@/components/PopupRadio.vue';
import upload from '@/components/Upload/index.vue';
import myService from '@/api/myService';
import Area from './../../lib/area.js';
import tempPic from '../../assets/images/agent/download-7@2x.png';

export default {
  name: 'agentAddInfo',
  components: {
    upload, PopupRadio,
  },
  data() {
    return {
      isShowSite: false,
      reciverProvinceCityCount: '',
      provinceCode: '',
      cityCode: '',
      countyCode:"",
      provinceName: '',
      cityName: '',
      countyName:"",
      agent: {
        company: {
          id: null,
          name: null
        }
      },
      exhibitionPhoto: [],
      tempPic: tempPic,
      companyList: [],
      isShowCompanyPicker: false,
    };
  },
  created() {
    this.areaList = Area;
    this.getAllCenters();
    this.pullData();
  },
  methods: {
    // 初始化数据
    pullData() {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
      });
      myService.userAgent().then((res) => {
        Toast.clear();
        if (res.code == 1 && res.object && res.object.userAgentInfoVo) {
          // this.$router.back();
          let userAgentInfoVo = res.object.userAgentInfoVo || {};
          this.agent.address = userAgentInfoVo.address || '';
          this.agent.company.name = userAgentInfoVo.serviceCentresName || '';
          this.agent.company.id = userAgentInfoVo.serviceCentres || '';

          this.provinceCode = userAgentInfoVo.provinceId;
          this.cityCode = userAgentInfoVo.cityId;
          this.countyCode = userAgentInfoVo.countyId;
          this.provinceName = userAgentInfoVo.provinceName;
          this.cityName = userAgentInfoVo.cityName;
          this.countyName = userAgentInfoVo.countyName;
          this.reciverProvinceCityCount = userAgentInfoVo.provinceName + ' ' + userAgentInfoVo.cityName + ' ' + userAgentInfoVo.countyName;

          this.exhibitionPhoto[0] = {};
          this.exhibitionPhoto[0].content = userAgentInfoVo.acquisitionFileUrl || '';
          this.exhibitionPhoto[0].result = { viewPath: userAgentInfoVo.acquisitionFileUrl || '' };

          // 老用户 && 展业证件照为空 去补充信息
          if (!userAgentInfoVo.areOldUser) {
            Toast('请直接申请成为代理人');
            setTimeout(() => {
              this.$router.replace({ name: "my"});
            }, 1000);
            return;
          }
          if (userAgentInfoVo.acquisitionFileUrl) {
            Toast('您已提交过补充认证资料');
            setTimeout(() => {
              this.$router.replace({ name: "agent"});
            }, 1000);
          }
        } else if (res.code === 0) {

        } else {
          Toast(res.message);
        }
      });
    },
    // 获取所有子公司
    getAllCenters() {
      myService.getAllCenters({}).then((res) => {
        if (res.code === 1) {
          if (res.object && res.object.length) {
            let companyList = [];
            for (let [index, ele] of res.object.entries()) {
              companyList.push({
                ...ele,
                index
              })
            }
            this.companyList = companyList;
          }
        } else {
          Toast(res.message);
        }
      });
    },
    submit() {
      if (!(this.exhibitionPhoto[0] && this.exhibitionPhoto[0].result && this.exhibitionPhoto[0].result.viewPath)) {
        Toast('请上传展业证件照');
        return;
      }
      if(!this.countyCode){
        Toast("请选择常驻地省/市/区");
          return
      }
      if(!this.agent.address){
        Toast("请输入详细地址");
        return
      }
      if(!this.agent.company.id){
        Toast("请选择申请加入公司");
        return
      }

      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
      });
      let agent = this.agent;
      myService.addOldInfo({
        provinceId: this.provinceCode || '',
        cityId: this.cityCode || '',
        countyId: this.countyCode || '',
        address: agent.address || '',
        acquisitionFileUrl: JSON.stringify({
          type: 8,
          fileId: this.exhibitionPhoto[0].result.id,
          fileUrl: this.exhibitionPhoto[0].result.viewPath,
        }),
        serviceCentres: agent.company.id
      }).then((res) => {
        Toast.clear();
        if (res.code == 1) {
          btPage.open({
            url: '/my',
            type: 3,
            container_style: 1,
          });
        } else {
          Toast(res.message);
        }
      });
    },
    imagePreview(type) {
      let arr = [];
      if (type === 5) {
        this.exhibitionPhoto[0] && arr.push(this.exhibitionPhoto[0].content);
      } else if (type === 6) {
        arr.push(this.tempPic);
      }

      ImagePreview({
        images: arr,
        startPosition: 0,
        onClose() {
          // do something
        },
      });
    },
    deletePic(type) {
      if (type === 5) {
        this.exhibitionPhoto = [];
      }
    },
    onConfirm(value) {
      this.isShowSite = false;
      this.reciverProvinceCityCount = value[0].name + ' ' + value[1].name + ' ' + value[2].name ;
      this.provinceCode = value[0].code;
      this.cityCode = value[1].code;
      this.countyCode = value[2].code;
    },
    onCompanyConfirm(data) {
      this.agent.company = data;
      this.isShowCompanyPicker = false;
    }
  },
  mounted() {
    setPageTitle('补充认证资料');
  }
};
</script>
<style lang="less">
  @import "../../assets/less/global";

  .address {
    padding: 10px 0;
    .van-field__control {
      text-align: right;
    }
  }
  .c-gray {
    color: #97999b;
  }

  .agent-add-info-wrapper {
    .apply-title {
      padding: 9px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      margin-bottom: 10px;

      .content-left {
        h2 {
          .font(20px, #333, left, 28px, bold);
          margin-bottom: 8px;
        }
        p {
          /*max-width: 182px;*/
          .font(14px, #999, justify, 20px);
        }
      }
      .content-right {
        flex-shrink: 0;
        .wh(124px, 88px);
        .bg-img-set('~@/assets/images/agent/images_yewu@2x.png', '~@/assets/images/agent/images_yewu@3x.png', 100%, 100%);
      }
    }
    .step2-box {
      .box {
        margin-bottom: 10px;
        >h2 {
          height: 45px;
          display: flex;
          align-items: center;
          padding: 0 15px;
          .font(16px, #464646, left, 22px, bold);

          &:before {
            content: '';
            display: block;
            .wh(4px, 14px);
            background: #087bf5;
            border-radius: 2px;
            margin-right: 8px;
          }
        }
      }
      .exhibition-photo-box {
        padding: 12px 0;
        display: flex;
        justify-content: space-around;

        .pic-box {
          .wh(150px, 186px);
          box-shadow:0 0 6px 0 rgba(0,0,0,0.06);
          border:1px solid rgba(221,221,221,1);

          .plus-icon {
            .square(40px);
            border-radius: 50%;
            background: #087bf5;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 57px auto 10px;
          }
          .example {
            .font(15px, #666, left, 21px);
            .position2(absolute, top, 6px, right, 6px);
          }
          .show-detail {
            display: block;
            .wh(100px, 26px);
            background:rgba(0,0,0,0.2);
            border-radius:13px;
            .font(13px, #fff, center, 26px);
            .position2(absolute, bottom, 40px, left, 50%);
            transform: translateX(-50%);
          }
        }
      }
      .note {
        padding: 0 24px 12px;
        .font(13px, #666, left, 18px);

        &:before {
          content: '*';
          .font(13px, #fc6b47, left, 18px);
          margin-right: 5px;
        }
      }
    }
  }
</style>


