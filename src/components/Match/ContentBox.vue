<template>
  <div class="content-box-wrapper">
    <div class="header van-hairline--bottom" v-if="title">
      {{ title }}<span v-if="titleDesc" class="title-desc">{{ titleDesc }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  components: {},
  props: {
    title: String,
    titleDesc: String
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
  .content-box-wrapper {
    background: white;
    margin-bottom: 10px;

    .header {
      height: 45px;
      font-size: 16px;
      color: #464646;
      font-weight: bold;
      padding-left: 15px;
      display: flex;
      align-items: center;

      &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 14px;
        background: #087BF5;
        border-radius: 2px;
        margin-right: 7px;
      }
      .title-desc {
        font-size: 13px;
        color: #999;
        font-weight: normal;
        margin-left: 5px;
      }
    }
  }
</style>
