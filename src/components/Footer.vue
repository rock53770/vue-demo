<template>
    <div class="h50">
        <div class="footer half-border-top">
            <div class="flex-1 ta-c quote pos-r" :class="{'active':path=='quote'}" @click="changeTab('/quote')">
                  <div class="icon-box">
                      <i class="icon"></i>
                  </div>
                  <span class="icon-word ft12">首页</span>
            </div>
            <div class="flex-1 ta-c order pos-r"  :class="{'active':path=='order'}" @click="changeTab('/order')">
                <div class="icon-box">
                    <i class="icon"></i>
                </div>
                <span class="icon-word ft12">订单</span>
            </div>
            <div class="flex-1 ta-c achieve pos-r"  :class="{'active':path=='achieve'}" @click="changeTab('/achieve')">
                <div class="icon-box">
                    <i class="icon"></i>
                </div>
                <span class="icon-word ft12">业绩</span>
            </div>
            <div class="flex-1 ta-c my pos-r"  :class="{'active':path=='my'}" @click="changeTab('/my')">
                <div class="icon-box">
                    <i class="icon"></i>
                </div>
                <span class="icon-word ft12">我的</span>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                show: false,
            }
        },
        props: {
            path: String
        },
        methods:{
            changeTab(path) {
                this.$router.replace(path)
            }
        }
    }
</script>
<style lang="less">
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
        background:url('~@/assets/icons/tab-bar.png') no-repeat center;
        background-size:192px 24px;
        display:inline-block;
        width:24px;
        height:24px;
    }
    span.icon-word{
        height:12px;
        display: block;
        margin-top:30px;
        color:#bbb;
    }
    .active {
      .icon-word{
        color:#fc6b47;
      }
    }
    .quote{
        i{
            background-position:-120px 0;
        }
        &.active{
            i{
                background-position:-96px 0;
            }
        }
    }
    .order{
        i{
            background-position:-168px 0;
        }
        &.active{
            i{
                background-position:-144px 0;
            }
        }
    }
    .achieve{
        i{
            background-position:-24px 0;
        }
        &.active{
            i{
                background-position:0 0;
            }
        }
    }
    .my{
        i{
            background-position:-72px 0;
        }
        &.active{
            i{
                background-position:-48px 0;
            }
        }
    }

}
</style>
