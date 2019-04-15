
<template>
  <div @click="onClick">
      <slot></slot>
    <van-popup v-model="show" v-bind="option" class="" :class="popupClass">
      <slot name="popup-header"></slot>
      <div class="lh40 pl10 van-hairline--bottom bg cl-gray ft15" v-if="title" v-text="title"></div>
      <div class="popup-radio" :class="popupRadioClass">

        <ul>
          <li class="van-hairline--bottom" :class="{'chosed':i[valueKey] === curColumn[valueKey],'disabled':i.disabled}"
              v-for="(i,index) in columns" :key="index" @click="onClickItem(i)">
              <slot name="each-item" :i="i">
                <span v-text="i[nameKey]"></span>
              </slot>
              <i></i>
          </li>
        </ul>
        <!-- <div v-if="needCancel">
          <div class="h5 bg"></div>
          <div class="lh50 ta-c" @click="onClickCancel" v-text="cancelText||'取消'"></div>
        </div> -->
      </div>
      <div v-if="cancelText" class="h55">
        <!-- <div  class="pos-f b0 w-100"> -->
          <div class="h5 bg"></div>
          <div class="lh50 ta-c ft16" @click="onClickCancel" v-text="cancelText"></div>
        <!-- </div> -->
      </div>

    </van-popup>
  </div>
</template>

<script>
  import {Popup} from 'vant';
  export default {
    name: 'popupRadio',
    data(){
        return {
          show: false,
        }
    },
    computed:{
      option:function(){
          var defaultOption = {
            position: 'bottom',
            getContainer: function () {
              return document.getElementsByTagName("body")[0];
            }
          };
          return {...defaultOption,...this.popupOption}
      }
    },
    props: {
      valueKey: {
        type: String,
        default: 'id'
      },
      nameKey: {
        type: String,
        default: 'name'
      },
      curColumn: {
        type: Object|String,
        default: () => {}
      },
      columns: {
        type: Array,
        default: () => []
      },
      popupOption: {
        type: Object,
      },
      title: String,
      cancelText: String,
      popupClass:String,
      popupRadioClass:String,
      disabled:{
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClick(){
        if(!this.disabled){
          this.show = true;
        }
      },
      onClickCancel(){
        this.show = false;
        this.$emit('click-cancel');
      },
      onClickItem(i) {
        if (i.disabled) {
          Toast("不可选")
          return;
        } else {
          this.show = false;
          this.$emit('update:curColumn', i);
          if (i[this.valueKey] !== this.curColumn[this.valueKey]) {
            this.$emit('click-item-change');
          }
          this.$emit('click-item', i);
        }
      },
    },
  };
</script>
<style lang="less">
.popup-radio {
  max-height:300px;
  overflow:auto;
  font-size:16px;
  // flex:1;
  -webkit-overflow-scrolling:touch;
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
      &.disabled {
        opacity:0.7;
        color:#97999b;
      }
    }
  }
}
</style>
