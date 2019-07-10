<template>
  <div class="h50 safe-bottom">
    <div class="footer safe-bottom half-border-top">
      <div class="flex-1 ta-c clue pos-r"
           :class="{'active':path==='pruchase_list'}"
           @click="changeTab('/receipt/purchase_list', path==='pruchase_list')">
        <div class="icon-box">
          <i class="icon"></i>
        </div>
        <span class="icon-word ft12">线索大厅</span>
      </div>
      <div class="flex-1 ta-c receipt pos-r"
           :class="{'active':path==='my_receipt'}"
           @click="changeTab('/receipt/my_receipt', path==='my_receipt')">
        <div class="icon-box">
          <i class="icon"></i>
        </div>
        <span class="icon-word ft12">我的收单</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'receiptFooter',
  components: {},
  props: {
    path: String
  },
  data() {
    return {};
  },
  methods: {
    changeTab(path, isActive) {
      if (!isActive) {
        this.$router.replace(path)
      }
    }
  },
};
</script>

<style scoped lang="less">
  .safe-bottom{
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing:content-box;
  }
  .footer{
    height:50px;
    position:fixed!important;
    left:0;
    bottom:0;
    z-index:10;
    width:100%;
    background-color: white;
    display:flex;
    .icon-box{
      position:absolute;
      left:0;
      right:0;
      bottom:16px;
    }
    i.icon{
      background:url(~@/assets/images/match/icon_menu_sd@2x.png) no-repeat center;
      background: -webkit-image-set(url(~@/assets/images/match/icon_menu_sd@2x.png) 2x, url(~@/assets/images/match/icon_menu_sd@3x.png) 3x) no-repeat center;
      background-size:48px 48px;
      display:inline-block;
      width:24px;
      height:24px;
    }
    span.icon-word{
      height:12px;
      display: block;
      margin-top:30px;
      color:#444;
    }
    .active {
      .icon-word{
        color:#087BF5;
      }
    }
    .clue{
      i{
        background-position:0 0;
      }
      &.active{
        i{
          background-position:0 -24px;
        }
      }
    }
    .receipt{
      i{
        background-position:-24px 0;
      }
      &.active{
        i{
          background-position:-24px -24px;
        }
      }
    }

  }
</style>
