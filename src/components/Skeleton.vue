<template>
  <div class="skeleton_tem-wrapper">
    <div v-if='skeletonType === 0' class="skeleton-index">
      <!-- 首页 -->
      <div class="skeleton-banner"></div>
      <div class="skeleton-title-two"></div>
      <div class="skeleton-item-twoline">
        <div class="skeleton-box1">
          <!-- 横向盒子 -->
          <div class="title"></div>
          <div class="content"></div>
        </div>
        <div class="skeleton-box1">
          <div class="title"></div>
          <div class="content"></div>
        </div>
        <div class="skeleton-box1">
          <div class="title"></div>
          <div class="content"></div>
        </div>
        <div class="skeleton-box1">
          <div class="title"></div>
          <div class="content"></div>
        </div>
        <div class="skeleton-box1">
          <div class="title"></div>
          <div class="content"></div>
        </div>
      </div>
      <div class="skeleton-list-box">
        <!-- 列表 -->
        <div class="skeleton-head"></div>
        <div class="skeleton-body">
          <div class="skeleton-title"></div>
          <div class="skeleton-content"></div>
        </div>
      </div>
      <div class="skeleton-item2">
        <div class="skeleton-title-one"></div>
        <div class="skeleton-item-oneline">
          <div class="skeleton-box2">
            <!-- 纵向盒子 -->
            <div class="title"></div>
            <div class="content"></div>
          </div>
          <div class="skeleton-box2">
            <!-- 纵向盒子 -->
            <div class="title"></div>
            <div class="content"></div>
          </div>
          <div class="skeleton-box2">
            <!-- 纵向盒子 -->
            <div class="title"></div>
            <div class="content"></div>
          </div>
          <div class="skeleton-box2">
            <!-- 纵向盒子 -->
            <div class="title"></div>
            <div class="content"></div>
          </div>
          <div class="skeleton-box2">
            <!-- 纵向盒子 -->
            <div class="title"></div>
            <div class="content"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="skeletonType === 1" v-for="(item,index) in dataList" :key="index" class="skeleton-list-box">
      <!-- 列表 -->
      <div class="skeleton-head"></div>
      <div class="skeleton-body">
        <div class="skeleton-title"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton_tem',
  props: {
    // 骨架类型
    skeletonType: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      dataList: [{}, {}, {}, {}, {}, {}]
    };
  }
};
</script>
<style lang="less" scoped>
.skeleton_tem-wrapper {
  background-color: #fff;
  z-index: 9999;
  padding: 10px 10px 0;
  height: 100vh;
  .skeleton-item-twoline {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .skeleton-item-oneline {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .skeleton-list-box {
    /* // 列表骨架 */
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .skeleton-head {
      height: 80px;
      width: 80px;
      margin-right: 10px;
    }
    .skeleton-body {
      flex: 1;
      .skeleton-title {
        height: 20px;
      }
      .skeleton-content {
        margin-top: 10px;
        height: 50px;
      }
    }
  }
  .skeleton-index {
    .skeleton-banner {
      height: 100px;
    }
  }
  .skeleton-title-two {
    height: 40px;
    padding: 10px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 20px;
      width: 60px;
      left: 10px;
      top: 10px;
    }
    &::before {
      content: '';
      position: absolute;
      height: 20px;
      width: 40px;
      right: 10px;
      top: 10px;
    }
  }
  .skeleton-title-one {
    height: 40px;
    padding: 10px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 20px;
      width: 60px;
      left: 10px;
      top: 10px;
    }
  }
  .skeleton-box1 {
    width: 50%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .content {
      height: 20px;
      flex: 1;
    }
  }
  .skeleton-box2 {
    flex: 1;
    margin: 0 10px;
    box-sizing: border-box;
    .title {
      height: 30px;
      width: 30px;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    .content {
      height: 10px;
      width: 20px;
      margin: 0 auto;
    }
  }
  .skeleton-head,
  .skeleton-title,
  .skeleton-content,
  .skeleton-banner,
  .skeleton-title-one::after,
  .skeleton-title-two::after,
  .skeleton-title-two::before,
  .skeleton-box1 .title,
  .skeleton-box1 .content,
  .skeleton-box2 .title,
  .skeleton-box2 .content {
    background: #e5e5e5;
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%
    );
    background-size: 20rem 20rem;
    animation: skeleton-stripes 1s linear infinite;
  }
}

@keyframes skeleton-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20rem 0;
  }
}
</style>
