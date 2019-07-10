<template>
  <div class="match-car-detail-wrapper">
    <content-box>
      <ul class="car-info">
        <li>
          <span class="desc">车主姓名</span>
          <p class="val">{{ data.ownerName }}</p>
        </li>
        <li>
          <span class="desc">证件类型</span>
          <p class="val">{{ data.ownerLicenseType }}</p>
        </li>
        <li>
          <span class="desc">证件号码</span>
          <p class="val">{{ data.ownerLicenseNo }}</p>
        </li>
        <li>
          <span class="desc">车牌号码</span>
          <p class="val cl-primary">{{ data.plate }}</p>
        </li>
        <li>
          <span class="desc">车架号(VIN)</span>
          <p class="val">{{ data.vin }}</p>
        </li>
        <li>
          <span class="desc">发动机号</span>
          <p class="val">{{ data.engineNo }}</p>
        </li>
        <li>
          <span class="desc">车型</span>
          <p class="val">{{ data.brandInfo }}</p>
        </li>
        <li>
          <span class="desc">核定载人数</span>
          <p class="val">{{ data.carSeatCount }}</p>
        </li>
        <li>
          <span class="desc">注册日期</span>
          <p class="val">{{ data.registrationTime | dataFormat('yyyy-MM-dd')}}</p>
        </li>
        <li>
          <span class="desc">是否过户车</span>
          <p class="val">{{ data.isTransfer ? '是' : '否'}}</p>
        </li>
        <li>
          <span class="desc">是否按揭车</span>
          <p class="val">{{ data.isMortgage ? '是' : '否'}}</p>
        </li>
      </ul>
    </content-box>
    <content-box>
      <ul class="car-imgs">
        <li v-for="(imgData, index) in data.picList" :key="index">
          <img :src="imgData.fileUrl" alt="" @click="imagePreview(index)">
          <p class="img-type">{{ imgData.type }}</p>
        </li>
      </ul>
    </content-box>
  </div>
</template>

<script>
import ContentBox from "@/components/Match/ContentBox";
import receiptService from '../../api/receiptService';
export default {
  name: 'receiptCarDetail',
  components: {
    ContentBox
  },
  props: {},
  data() {
    return {
      id: null,
      data: {}
    };
  },
  methods: {
    pullData() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration:0
      });
      receiptService.getCarDetail({
        id: this.id
      }).then(data => {
        Toast.clear();
        if (data.code === 1) {
          this.data = data.object;
        } else {
          Toast(data.message);
        }
      })
    },
    imagePreview(index){
      let arr = [];
      this.data.picList.forEach(function(k,v){
        arr.push(k.fileUrl)
      });
      ImagePreview({
        images:arr,
        startPosition:index,
        onClose() {
          // do something
        }
      })
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.pullData();
  },
  mounted() {
    setPageTitle('车辆信息');
  }
};
</script>

<style scoped lang="less">
  @import "../../assets/less/global";
  .match-car-detail-wrapper {
    .car-info {
      padding: 15px;

      li {
        display: flex;
        margin-bottom: 8px;
        .desc {
          flex-shrink: 0;
          width: 78px;
          margin-right: 22px;
          .font(14px, #999, right, 20px);
        }
        .val {
          .font(14px, #333, justify, 20px);
        }
      }
    }
    .car-imgs {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 12px 15px 0;
      li {
        flex-shrink: 0;
        width: 50%;
        padding-bottom: 15px;

        img {
          display: block;
          width: 100%;
          height: 98px;
          margin-bottom: 8px;
          object-fit: cover;
        }
        .img-type {
          .font(14px, #979797, center, 20px);
        }
      }
    }
  }
</style>
