
<template>
  <!--<div>-->
    <van-popup v-model="currentValue" position="bottom" :get-container="con">
      <slot name="popup-header"></slot>
      <div class="popup-select">
        <ul>
          <li class="van-hairline--bottom" :class="{'chosed':i[name] === currentSelect[name]}"
              v-for="(i, index) in selectDatas" :key="index" @click="onClickItem(i)">
              <slot name="each-item" :i="i">
                <span v-text="i[name]"></span>
              </slot>
              <i></i>
          </li>
        </ul>
        <input type="text" :value="value" style='display:none;'>
      </div>
    </van-popup>
  <!--</div>-->
</template>

<script>
  import {Popup} from 'vant';
  export default {
    name: 'popupSelect',
    data(){
        return {
          showPopup: false,
          currentValue: this.value
        }
    },
    props: {
      value: Boolean,
      cancelText: String,
      name: String,
      currentSelect: {
        type: Object|String,
        default: () => {}
      },
      selectDatas: {
        type: Array,
        default: () => []
      },
      overlay: {
        type: Boolean,
        default: true
      },
      closeOnClickOverlay: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      con(){
          return document.getElementsByTagName("body")[0];
      },
      onClickItem(i) {
        if (i.disabled) {
          Toast("不可选")
          return;
        } else {
          this.currentValue = false;
          this.$emit('update:currentSelect', i);
          this.$emit('click-item', i);
        }
      },
    },
    watch: {
      value (val) {
        this.currentValue  = val
      },
      currentValue  (val) {
        this.$emit('input', val)
      }
    },
  };
</script>
<style lang="less">
.popup-select {
  max-height:200px;
  ul {
    li {
      position: relative;
      padding-left: 10px;
      height: 50px;
      line-height: 50px;
      i {
        position: absolute;
        right: 10px;
        top: 15px;
        width: 20px;
        height: 20px;
      }
      &.chosed {
        i {
          background: url('~@/assets/icons/elect.png') left center no-repeat;
          background-size: 20px auto;
        }
      }
    }
  }
  .cancel {
    margin-top: 10px;
    background: #fff;
    display: block;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>
