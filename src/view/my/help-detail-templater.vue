<template>
    <div class="help-detail">
        <div class="content" v-html="word"></div>
    </div>
</template>

<script>
export default {
    name: 'helpDetail',
    data() {
        return {
            word: ''
        };
    },
    created() {
        this.setContent();
    },
    mounted() {},
    methods: {
        setContent() {
            let _id = parseInt(this.$route.query.id);
            switch (_id) {
                case 1:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p style="white-space: normal;">一、提单询价</p><p style="white-space: normal;">进入平台首页，输入车牌号与车主姓名，如果是新车，输入车主，选择未上牌即可，然后点击立即询价</p><p style="white-space: normal;"><img src="http://storage.xinxinb.com/image/201806/editor1528431941539845.png" title="editor1528431941539845.png" alt="WX20180608-122329.png"></p><p style="white-space: normal;"><br></p><p style="white-space: normal;">二、上传行驶证等图片，行驶证正本必须上传，其他可在提交核保时补充。</p><p style="white-space: normal;"><img src="http://storage.xinxinb.com/image/201806/editor1528432161631185.png" title="editor1528432161631185.png" alt="WX20180608-122835.png"></p><p style="white-space: normal;"><br></p><p style="white-space: normal;">三、选择投保方案，根据自己需求可选择投保险种与保额。</p><p style="white-space: normal;"><img src="http://storage.xinxinb.com/image/201806/editor1528432235198481.png" title="editor1528432235198481.png" alt="WX20180608-123008.png"></p><p style="white-space: normal;"><br></p><p style="white-space: normal;">四、选择所需投保的保险公司</p><p style="white-space: normal;"><img src="http://storage.xinxinb.com/image/201806/editor1528432275600755.png" title="editor1528432275600755.png" alt="WX20180608-123104.png"></p><p>选好保险公司后，点击申请询价，申请询价完成，大约几分钟后即可报价完成，系统会以短信或微信的形式通知您。</p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 2:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、首先我们找到需要申请核保的订单，点击平台底部 订单 这个菜单，进入订单列表。进入列表后可以根据车牌号或者车主进行模糊搜索，例如需要找到皖A12345这个车的订单，输入123即可搜索到，找到订单后点击进去订单界面。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474224259990.png" title="editor1529474224259990.png" alt="WX20180620-135424.png"></p><p>2、进入订单界面后找到需要申请核保的保险公司，继续点击进入报价界面。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474283578155.png" title="editor1529474283578155.png" alt="WX20180620-135445.png"></p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474297954650.png" title="editor1529474297954650.png" alt="WX20180620-135458.png"></p><p>3、点击底部 去核保&nbsp; 菜单，即可进入重要资料核对界面。</p><p>由于核保需要对资料真实性与准确性进行核对，需要行驶证与车主身份证等照片，如报价时未上传完整，可进行补充，同时也可以补充其他图片资料。</p><p>如果对该订单有特殊需求，例如特约等，可以打开特需开关，进行补充。如下图：</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474406536211.png" title="editor1529474406536211.png" alt="WX20180620-135522.png"></p><p>4、资料补充完毕后，点击 提交核保 ，则提交成功，等待短信或者微信通知即可。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474506305865.png" title="editor1529474506305865.png" alt="WX20180620-135539.png"></p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 3:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、首先进入订单列表页，找到该订单，查看是否已经核保通过，只有核保通过的订单才可以进行支付哦。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474888242882.png" title="editor1529474888242882.png" alt="WX20180620-140615.png"></p><p>点击订单进入订单界面</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474893280099.png" title="editor1529474893280099.png" alt="WX20180620-140624.png"></p><p>2、找到核保通过的订单，点击进入报价界面</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529474930207628.png" title="editor1529474930207628.png" alt="WX20180620-140632.png"></p><p>3、点击报价界面底部的 去确认 按钮确认投保信息。</p><p><br></p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475076387857.png" title="editor1529475076387857.png" alt="WX20180620-141002@2x.png"></p><p>4、资料核对无误后点击同意协议并支付进入支付界面获取支付码。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475139205644.png" title="editor1529475139205644.png" alt="WX20180620-140658.png"></p><p>5、使用支付码进行支付后可以点击 确认已经支付&nbsp; 按钮进行确认，平台工作人员会尽快对保单支付结果进行核对</p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 4:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、订单支付完成后，点击订单支付界面 确认已经支付 按钮。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475286254251.png" title="editor1529475286254251.png" alt="WX20180620-140658.png"></p><p>2、进入保单获取方式界面后，可以使用<span style="color: rgb(255, 0, 0);">自取</span>或者<span style="color: rgb(255, 0, 0);">快递</span>两种方式获取保单，自取直接联系平台专属客服获取离您最近的自取点，如果是快递，选择收件地址或者添加新地址，添加地址需要填写准确哦，否则可能会影响收取保单的时间。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475398570086.png" title="editor1529475398570086.png" alt="WX20180620-141401.png"></p><p>3、点击此页面底部的确认按钮，此保单则进入后台审核阶段，等待支付确认结果通知即可。</p><p><br></p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 5:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、进入 我的 界面，点击实名认证菜单进入资料上传界面</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475694215179.png" title="editor1529475694215179.png" alt="WX20180620-141919.png"></p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475700662087.png" title="editor1529475700662087.png" alt="WX20180620-141933.png"></p><p>2、资料上传完毕后系统会进行资料识别验证，如果资料无误，系统会自动通过实名认证。</p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 6:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、进入 我的 界面，点击 资料管理&nbsp; 菜单，进去账户管理界面</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475875150430.png" title="editor1529475875150430.png" alt="WX20180620-142346.png"></p><p>2、点击提现账户菜单，进去绑卡界面</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475880803883.png" title="editor1529475880803883.png" alt="WX20180620-142400.png"></p><p>3、绑定的银行卡开户人必须与实名认证，并且准确选择银行与开户行，信息错误的话会打款失败。</p><p>每一张只需绑定一次即可，后续可自动使用。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529475933142417.png" title="editor1529475933142417.png" alt="WX20180620-142413.png"></p><p><br></p>            </div>
                                    </div>
                                </div>`;
                    break;
                case 7:
                    this.word = `<div class="card">
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <p>1、个人中心点击&nbsp; 去提现&nbsp; 菜单</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529477423230287.png" title="editor1529477423230287.png" alt="WX20180620-142659.png"></p><p>2、选择想提现订单与活动奖励等，并选择收款银行卡账户。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529477467749511.png" title="editor1529477467749511.png" alt="WX20180620-145059.png"></p><p>3、点击个人中心 提现明细 即可查看提现进度。</p><p><img src="http://storage.xinxinb.com/image/201806/editor1529477527996230.png" title="editor1529477527996230.png" alt="WX20180620-145148.png"></p><p><img src="http://storage.xinxinb.com/image/201806/editor1529477534247793.png" title="editor1529477534247793.png" alt="WX20180620-145155.png"></p>            </div>
                                    </div>
                                </div>`;
                    break;
                default:
                    this.word = `<h4>请联系管理员</h4>`
                    break;
            }
        }
    }
};
</script>

<style lang="less">
.card {
    background: #fff;
    box-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
    margin: 10px;
    position: relative;
    border-radius: 5px;
    font-size: 13px;
    color: #333;
    line-height: 22px;
    .card-content-inner {
        padding: 15px;
        position: relative;
    }
    img {
        max-width: 100%;
        border: 0;
    }
}
</style>
