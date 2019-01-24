
<template>
  <div class="bg-white">
      <!-- <div class="marquee">*请在光线良好的地方拍摄，确保重要信息清晰，无反光</div> -->
      <van-notice-bar
        text="*请在光线良好的地方拍摄，确保重要信息清晰，无反光"
        color="#FC6B47"
        background="#FDE7D8"
      />
      <div class="mlr10 ft16 lh22 pb20 mt10">
          <p class="">身份证示例图</p>
          <img class="w-100 mt20 pl15 pr15" src="~@/assets/images/sample/1@2x.png">
          <img class="w-100 mt10 pl15 pr15" src="~@/assets/images/sample/2@2x.png">
      </div>
      <div class="mlr10 ft16 lh22 pb20">
          <p>行驶证示例图</p>
          <img class="w-100 mt20 pl15 pr15" src="~@/assets/images/sample/3@2x.png">
          <img class="w-100 mt10 pl15 pr15" src="~@/assets/images/sample/4@2x.png">
      </div>
      <div class="mlr10 ft16 lh22 pb20">
          <p>登记证示例图</p>
          <img class="w-100 mt20 pl15 pr15" src="~@/assets/images/sample/6@2x.png">
      </div>
      <div class="mlr10 ft16 lh22 pb20">
          <p>暂住证示例图</p>
          <img class="w-100 mt10 pl15 pr15" src="~@/assets/images/sample/7@2x.png">
      </div>
  </div>
</template>

<script>
  export default {
    name: 'sample',
    data () {
      return {
          loading:false,
      }
    },
    mounted() {
      setPageTitle('上传资料示例图')
    }
  }
</script>

