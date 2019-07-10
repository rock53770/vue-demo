
<template>
  <div class="pay-wrapper">
    <div class="pb10">
      <div class="bg-white p10 ta-c">
        <p class="cl-orange lh30 ft24 pt10 pb10">
          <b>{{dataSoure.totalPremium|currency('￥','2')}}</b>
        </p>
        <div class="QRcode">
          <div class="p10">
            <van-swipe>
              <van-swipe-item v-for="(image, index) in dataSoure.qrCodeUrl" :key="image">
                <img class="img" v-lazy="image" @click="preview(1, index)" />
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="tips mb5">
            <p>请确认该二维码的收款信息，收款商户为保险公司！</p>
            <p class="light">
              如支付码已过期请点击
              <!-- @click="reFetchQr" :class="[{'unclick':unClick}]" -->
              <span>“重新获取”</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white">
      <span class="tit-tag ml10 lh40 ft16">
        上传支付凭证
        <span class="tips">(最多上传9张)</span>
      </span>
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
              <div
                class="pos-a icon-delete-box w30 h30 ta-r"
                v-show="i.content"
                @click="deletePic(index)"
              >
                <i class="icon-delete"></i>
              </div>
              <!-- <i class="pos-a icon-delete" v-show="i.content" @click="deletePic(index)"></i> -->
              <div
                class="pos-a ft12 cl-red t0 l0 w-100 p5 bg-o5"
                v-show="i.content && i.status == 3"
              >
                <span>上传失败，请删除重新上传</span>
              </div>
              <div
                class="pos-a ft16 cl-white b0 l0 w-100 flex-center bg-o5"
                v-show="i.percent && i.percent!=100"
                style="min-height:20px;"
                :style="{'height':100-i.percent+'%'}"
              >
                <span class="flex-1" v-show="i && i.percent">{{i.percent+"%"}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="mb10 pay-box">
      <div class="lh30 ft13 pl12">
        <span class="cl-gray">提示:保单默认开具普通发票</span>
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

    <!-- v-if="dataSoure.showRegainPayCode || dataSoure.showCompletePay" -->
    <div class="flex-center pos-f b0 bg-white h65 p10 plr5 w-100 zi10">
      <!-- v-if="dataSoure.showRegainPayCode" -->
      <van-button
        type="primary"
        round
        plain
        :class="['flex-1', 'mlr5',{'unclick':unClick || !dataSoure.showRegainPayCode}]"
        @click="reFetchQr"
        :text="(unClick || !dataSoure.showRegainPayCode)?'新二维码获取中...':'重新获取支付码'"
      ></van-button>
      <!-- v-if="dataSoure.showCompletePay" -->
      <van-button
        type="primary"
        round
        :class="['flex-1', 'mlr5',{'unclick':unClick || !dataSoure.showCompletePay}]"
        @click="payOk"
        text="支付完成"
      ></van-button>
    </div>
  </div>
</template>

<script>
import orderService from "@/api/orderService";
import quoteService from "@/api/quoteService";
import releaseItemService from "@/api/releaseItemService.js";

import upload from "@/components/Upload/index.vue";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      id: "",
      invoice: false, // 是否填写发票信息
      invoiceData: {
        name: "", // 抬头
        no: "", // 税号
        phone: "", // 电话
        address: "", // 地址
        bankname: "",
        bankNo: ""
      },
      isSupportedClipboard: window.isSupportedClipboard,
      isShow: false,
      type: "",
      pics: [],
      dataSoure: {},
      unClick: false,
      isGoUnderwrite: false,
    };
  },
  components: { upload },
  computed: {
    // payMethodInfo() {
    //   if (this.type !== "" && this.dataSoure.payIntroduceBos) {
    //     var arr = [];
    //     arr = this.dataSoure.payIntroduceBos.filter((k, v) => {
    //       return k.status == this.type;
    //     });
    //     return arr[0] ? arr[0] : {};
    //   } else {
    //     return {};
    //   }
    // }
  },
  created() {
    this.id = this.$route.query.quoteId;
    this.type = this.$route.query.type || "";

    this.init();
  },
  mounted() {
    setPageTitle("扫码支付");
  },
  methods: {
    async init() {
      Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });

      let params = {
        quoteId: this.$route.query.quoteId
      };

      let data = await releaseItemService.getPayInfo(params);
      Toast.clear();

      if (data.code !== 1) {
        Toast(data.message);
      } else {
        this.dataSoure = data.object;
      }

      // if (data.code == 1) {
      //   this.data = data.object;
      //   this.unClick = data.object.fdatah ? false : true;
      // } else if (data.code == 2) {
      //   Dialog.confirm({
      //     message: "该报价已失效, 请重新核保",
      //     confirmButtonText: "重新核保"
      //   })
      //     .then(() => {
      //       //确认
      //       this.underWrite();
      //     })
      //     .catch(() => {
      //       //取消
      //     });
      // } else {
      //   Toast(data.message);
      // }
    },
    gopage(url, query) {
      // this.$router.push({ path: url, query: query });
      btPage.open({
        url: url,
        container_style: 1,
        type: 3,
        params: query
      });
    },
    preview(type, index) {
      let arr = [],
        $index;
      this.dataSoure.qrCodeUrl && this.dataSoure.qrCodeUrl.forEach(ele => {
        arr.push(ele);
      });
      this.pics && this.pics.forEach(it => {
        arr.push(it.result.viewPath);
      });

      if (type == 1) {
        $index = index;
      } else {
        // this.pics.forEach(it => {
        //   arr.push(it.result.viewPath);
        // });
        $index = index + this.dataSoure.qrCodeUrl?this.dataSoure.qrCodeUrl.length:0;
      }

      ImagePreview({
        images: arr,
        startPosition: $index,
        onClose() {}
      });
    },
    // // 提交核保
    // underWrite() {
    //   this.isGoUnderwrite = true;
    //   Toast.loading({
    //     mask: true,
    //     message: "提交核保中..."
    //   });
    //   orderService
    //     .postUnderwrit({ id: this.$route.query.id })
    //     .then(res => {
    //       this.isGoUnderwrite = false;
    //       if (res.code == 1) {
    //         // this.$router.push({ path: '/order/order_detail', query: { id: this.$route.query.id} });
    //         this.gopage("/order/order_detail", { id: this.$route.query.id });

    //         Toast.clear();
    //       } else {
    //         Toast(res.message);
    //       }
    //     })
    //     .catch(rej => {
    //       console.log(rej.data);
    //     });
    // },
    reFetchQr() {
      Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });

      let params = {
        quoteId:this.$route.query.quoteId
      };
      releaseItemService.reGetQRcode(params).then(res => {
        Toast.clear();
        if (res.code !== 1) {
          Toast(res.message);
        } else {
          this.unClick = true;
          Dialog.confirm({
            title: "",
            message: "重新获取申请已提交，大约需要2-3分钟请耐心等待！",
            confirmButtonText: "知道了",
            showCancelButton: false
          })
            .then(() => {
              // this.$router.go(-1);
            })
            .catch(() => {});
        }
      });
    },
    onRead(files) {
      this.pics = this.pics.concat(files);
      if (this.pics.length > 9) {
        this.pics.length = 9;
        Toast("最多可上传9张哦~");
      }
    },
    deletePic(index) {
      this.pics.splice(index, 1);
    },

    /**
     * 判定条件
     * 如果展开开局增资发票项则验证发票必填项
     * 否则，不验证
     */
    payOk() {
      if (this.invoice) {
        if (this.invoiceData.name === "") {
          Toast("请输入准确抬头名称");
        } else if (this.invoiceData.no === "") {
          Toast("请输入税号");
        } else if (this.invoiceData.phone === "") {
          Toast("请输入电话号码");
        } else if (this.invoiceData.address === "") {
          Toast("请输入单位注册地址信息");
        } else if (this.invoiceData.bankname === "") {
          Toast("请输入代为开户银行名称");
        } else if (this.invoiceData.bankNo === "") {
          Toast("请输入单位银行账户");
        } else {
          Dialog.confirm({
            message: "是否确认支付完成？"
          })
            .then(() => {
              this.postPayok();
            })
            .catch(() => {});
        }
      } else {
        Dialog.confirm({
          message: "是否确认支付完成？"
        })
          .then(() => {
            this.postPayok();
          })
          .catch(() => {});
      }
    },
    postPayok() {
      const arr = [];
      this.pics.forEach(function(k, v) {
        arr.push({
          type: 11,
          fileId: k.result.id,
          fileUrl: k.result.viewPath
        });
      });

      let picInfo = Util.stringify(arr);
      let params = {
        orderId: this.dataSoure.orderId,
        quoteId: this.dataSoure.quoteId,
        payType: this.type,
        picInfo: picInfo,
        invoiceType: this.invoice ? 1 : 0,
        invoiceTitle: this.invoiceData.name,
        invoiceTaxNumber: this.invoiceData.no,
        invoicePhone: this.invoiceData.phone,
        invoiceAddress: this.invoiceData.address,
        openingBank: this.invoiceData.bankname,
        bankAccount: this.invoiceData.bankNo
      };

      releaseItemService.payFinish(params).then(res => {
        if (res.code !== 1) {
          Toast(res.message);
        } else {


          // if(){
          this.gopage("/release_item/pay_result", {
            orderId: this.dataSoure.orderId,
            quoteId: this.dataSoure.quoteId
          });
          // }else {
          //   this.$router.replace({ path: '/release_item/pay_result', query: {
          //     orderId: this.dataSoure.orderId,
          //     quoteId: this.dataSoure.quoteId
          //   }});
          // }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.pay-wrapper {
  padding-bottom: 70px;
}
.QRcode {
  .tips {
    font-size: 13px;
    color: #87999b;
    text-align: center;
    p {
      margin-top: 5px;
    }
    p.light {
      color: #087bf5;
    }
  }
  .img{
    display: block;
    width: 220px;
    height: 220px;
    margin: 0 auto;
    object-fit: contain;
  }
}
</style>

