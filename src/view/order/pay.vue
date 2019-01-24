
<template>
  <div class="box">
    <div class="pb10">
      <div class="bg-white p10 ta-c">
        <p class="cl-orange lh30 ft18"><b>保费总计：{{data.totalInsurancePremium|currency('￥','2')}}</b></p>
        <div class="" v-if="type==3">
          <div class="p10" v-if="payMethodInfo.userName">
            <img :src="payMethodInfo.userName" width="200" @click="preview(1, 0)">
          </div>
          <div class="mb5" v-if="payMethodInfo.userNo">
            <span>支付码：</span>
            <span v-text="payMethodInfo.userNo"></span>
          </div>
          <p class="ta-c ft13 cl-gray pb10 plr15"><span v-text="payMethodInfo.remark"></span></p>
          <p class="ta-c ft13 cl-orange "><span v-text="payMethodInfo.attention"></span></p>
          <!-- <div class="flex-center h40 w-100 mt20">
            <div @click="reFetchQr" class="flex-1 btn btn_gradient mlr10">重新获取支付码</div>
          </div> -->
        </div>
        <div class="ta-l lh20" v-if="type && type!=3">
          <p>收款账号：<span v-text="payMethodInfo.userNo"></span>
            <input type="text" v-model="payMethodInfo.userNo" class="w100 pos-a" style="top:-10000px;">
            <button type="button" class="bd1 lh20 plr5 bdr3 bg-orange cl-white ml10"
                    v-clipboard:copy="payMethodInfo.userNo"
                    v-clipboard:success="onCopy" v-if="isSupportedClipboard"
                    v-clipboard:error="onError">复制</button></p>
          <p>账户名<b class="invisible">称</b>：<span v-text="payMethodInfo.userName"></span></p>
          <p>收款机构：<span v-text="payMethodInfo.mechanism"></span></p>
          <p>操作说明：<span v-text="payMethodInfo.remark"></span></p>
          <p>注意事项：<span v-text="payMethodInfo.attention"></span></p>
        </div>
      </div>
    </div>
    <div class="bg-white">
      <span class="tit-tag ml10 lh40 ft14">上传支付凭证<span class="cl-orange">（最多上传9张）</span> </span>
      <div class="ml10 mt10">
        <ul class="clearfix pics">
          <li class="w-33 mb10 pr10 fl" v-show="pics.length<9">
            <div class="w-100 h100 bg-white van-hairline--surround">
              <upload class="wh-100 flex-center ta-c" :max="9" :pics="pics">
                <img src="~@/assets/icons/add@3x.png" class="w40 mt30 center-block">
                <!-- <p class="cl-gray mt10">添加图片</p> -->
              </upload>
            </div>
          </li>
          <li class="w-33 mb10 pr10 fl" v-for="(i,index) in pics" :key="index">
            <div class="w-100 h100 bg-white pos-r">
              <img :src="i.content" class="thumb-img" v-show="i.content" @click="preview(2, index)">
              <div class="pos-a icon-delete-box w30 h30 ta-r" v-show="i.content" @click="deletePic(index)">
                  <i class="icon-delete"></i>
              </div>
              <!-- <i class="pos-a icon-delete" v-show="i.content" @click="deletePic(index)"></i> -->
              <div class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                   v-show="i.content && i.status == 3">
                <span>上传失败，请删除重新上传</span>
              </div>
              <div class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5"
                   v-show="i.percent && i.percent!=100"
                   style="min-height:20px;"
                   :style="{'height':100-i.percent+'%'}">
                <span class="flex-1" v-show="i && i.percent">{{i.percent+"%"}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="mb10 pay-box">
      <div class="lh50 ft16 ta-c">
        <span class="line">保单默认开具普通发票</span>
      </div>
      <div class="plr10 lh50 flex-center bg-white van-hairline--bottom">
        <span class="flex-1 lh50 ft16">开具增值税专用发票</span>
        <van-switch size="24px" v-model="invoice"/>
      </div>
      <div v-show="invoice">
          <van-field v-model="invoiceData.name" clearable label="公司抬头：" placeholder="请输入准确抬头名称"/>
          <van-field v-model="invoiceData.no" clearable label="公司税号：" placeholder="请输入税号"/>
          <van-field v-model="invoiceData.phone" clearable label="电话号码：" placeholder="请输入电话号码"/>
          <van-field v-model="invoiceData.address" clearable label="单位地址：" placeholder="单位注册地址信息"/>
          <van-field v-model="invoiceData.bankname" clearable label="开户银行：" placeholder="代为开户行名称"/>
          <van-field v-model="invoiceData.bankNo" clearable label="银行帐号：" placeholder="单位银行账户"/>
      </div>
    </div>
    <!-- <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 w-100 zi10">
        <div class="bd1 ta-c flex-1 cl-orange h-100 mr10 lh50" style="border:1px solid #fc6b47;border-radius:25px" @click="reFetchQr">重新获取支付码</div>
        <van-button type="primary" class="flex-1" @click="pay" text="支付完成"></van-button>
      </div>
    </div> -->
    <div class="h70">
      <div class="flex-center pos-f b0 bg-white h70 p10 plr5 w-100 zi10">
        <van-button type="primary" round plain :class="['flex-1', 'mlr5', unclick?'unClick': '']" @click="reFetchQr" text="重新获取支付码"></van-button>
        <van-button type="primary" round :class="['flex-1', 'mlr5', unclick?'unClick': '']" @click="pay" text="支付完成"></van-button>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from '@/api/orderService'
import quoteService from '@/api/quoteService'
import upload from '@/components/Upload/index.vue'
import { Toast, Dialog } from 'vant';
export default {
    name: 'pay',
    data() {
        return {
          id:'',
          invoiceData: {
            name: '',// 抬头
            no: '',  // 税号
            phone: '', // 电话
            address: '', // 地址
            bankname: '',
            bankNo: ''
          },
          invoice: false,
          isSupportedClipboard:window.isSupportedClipboard,
          isShow:false,
          type:'',
          pics:[],
          data:{},
          unclick: false,
          isGoUnderwrite: false,
        };
    },
    computed: {
        payMethodInfo(){
            if(this.type !== '' && this.data.payIntroduceBos){

                var arr = [];
                arr = this.data.payIntroduceBos.filter((k,v)=>{
                    return k.status == this.type
                })
                return arr[0] ? arr[0] : {};
            } else {
              return {}
            }
        }
    },
    created() {
        this.id = this.$route.query.id;
        this.type = this.$route.query.type || '';
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration:0
        });
        orderService.paycheck({
            id:this.id,
        }).then((res) => {
            Toast.clear();
            if(res.code == 1){
                this.data = res.object;
                this.unclick = res.object.fresh ? false : true
            } else if ( res.code == 2 ) {
                Dialog.confirm({
                    message:'该报价已失效, 请重新核保',
                    confirmButtonText:'重新核保'
                }).then(()=>{
                    //确认
                    this.underWrite();
                }).catch(()=>{
                    //取消
                })
            } else {
                Toast(res.message)
            }
        })
    },
    methods: {
        gopage(url, query) {
            // this.$router.push({ path: url, query: query });
            btPage.open({
              url: url,
              container_style: 1,
              type: 3,
              params: query,
            })
        },
        preview(type, index) {
          let arr = [], $index
          arr.push(this.payMethodInfo.userName)
          if (type == 1) {
            $index = 0
          } else {
            this.pics.forEach(it => {
              arr.push(it.result.viewPath)
            })
            $index = index+1
          }

          ImagePreview({
            images: arr,
            startPosition: $index,
            onClose() {}
          })
        },
        // 提交核保
        underWrite() {
          this.isGoUnderwrite = true
          Toast.loading({
              mask: true,
              message: '提交核保中...'
          })
          orderService.postUnderwrit({ id: this.$route.query.id })
              .then((res) => {
                  this.isGoUnderwrite = false
                  if(res.code == 1) {
                      // this.$router.push({ path: '/order/order_detail', query: { id: this.$route.query.id} });
                      this.gopage('/order/order_detail', { id: this.$route.query.id})

                      Toast.clear()
                  } else {
                      Toast(res.message)
                  }
              })
              .catch((rej) => {
                  console.log(rej.data)
              })
        },
        onCopy(e) {
          Toast('已复制')
        },
        onError(type) {
          Toast('复制失败，请长按文字复制')
        },
        choose(type) {
            this.isShow = true;
            this.type = type;
        },
        reFetchQr() {
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration:0
            });
            orderService.payout({
                id:this.id,
            }).then((res) => {
                Toast.clear();
                if(res.code == 1){
                    this.$dialog.confirm({
                      title: '',
                      message: '重新获取申请已提交，大约需要2-3分钟请耐心等待！',
                      confirmButtonText:'知道了',
                      showCancelButton: false
                    }).then(() => {
                        this.unclick = true
                    }).catch(()=>{
                        this.unclick = true
                    })
                } else {
                    Toast(res.message)
                }
            })
        },
        onRead(files){
            this.pics = this.pics.concat(files);
            if(this.pics.length>9){
                this.pics.length = 9;
                Toast("最多可上传9张哦~")
            }
        },
        deletePic(index){
            this.pics.splice(index,1);
        },
        /**
         * 判定条件
         * 如果展开开局增资发票项则验证发票必填项
         * 否则，不验证
         */
        pay(){
            if (this.invoice) {
              if (this.invoiceData.name === '') {
                Toast('请输入准确抬头名称')
              } else if (this.invoiceData.no === '') {
                Toast('请输入税号')
              } else if (this.invoiceData.phone === '') {
                Toast('请输入电话号码')
              } else if (this.invoiceData.address === '') {
                Toast('请输入单位注册地址信息')
              } else if (this.invoiceData.bankname === '') {
                Toast('请输入代为开户银行名称')
              } else if (this.invoiceData.bankNo === '') {
                Toast('请输入单位银行账户')
              } else {
                  Dialog.confirm({
                    message: '是否确认支付完成？'
                  }).then(() => {
                    this.postPayok()
                  }).catch(() => {

                  });
              }
            } else {
              Dialog.confirm({
                message: '是否确认支付完成？'
              }).then(() => {
                this.postPayok()
              }).catch(() => {

              });
            }
        },
        postPayok() {
          const arr = [];
            this.pics.forEach(function(k,v){
                arr.push({
                    type:11,
                    fileId:k.result.id,
                    fileUrl:k.result.viewPath
                });
            })

          let picInfo = Util.stringify(arr);
          let param = {
            id: this.id,
            payType: this.type,
            certificate: picInfo,
            invoiceType: this.invoice ? 1 : 0,
            invoiceTitle: this.invoiceData.name,
            invoiceTaxNumber: this.invoiceData.no,
            invoicePhone: this.invoiceData.phone,
            invoiceAddress: this.invoiceData.address,
            openingBank: this.invoiceData.bankname,
            bankAccount: this.invoiceData.bankNo
          }
          orderService.postPayok(param)
            .then((res) => {
               if (res.code == 1) {
                //  this.$router.push({name:'payResult', query:{ id:this.$route.query.id, payType:this.type || 1 }})
                 this.gopage('/order/pay_result', { id:this.$route.query.id, payType:this.type || 1 })
               } else {
                 Toast(res.message)
               }
            })
        }
    },
    mounted() {
        setPageTitle('支付订单');
    },
    components: {upload}
};
</script>
<style lang="less" scoped>
.line {
  position: relative;
  &:before {
    content: '';
    display: block;
    width: 80px;
    height: 1px;
    background-color: #333;
    position: absolute;
    top: 50%;
    left: -90px;
  }
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 1px;
    background-color: #333;
    position: absolute;
    top: 50%;
    right: -90px;
  }
}
.unClick{
    color: #ffffff;
    border: 1px solid #D8D8D8;
    background: #D8D8D8;
    pointer-events: none;
  }
</style>

