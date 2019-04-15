<template>
  <!-- 投保页 -->
  <div class="life-insure-wrapper">
    <div class="content-box insure-header-info">
      <div class="content">
        <div class="insurance-company-name mb6">{{ companyName }}</div>
        <h2 class="insurance-name">{{ goodsName }}</h2>
        <p class="insurance-detail">保障计划：<span class="val">{{ protectName }}</span></p>
        <div class="bg-img"></div>
      </div>
    </div>
    <!--产品信息-->
    <div class="content-box insure-info" v-if="inputRule.startTimeShow">
      <div class="header van-hairline--bottom">产品信息</div>
      <div class="content">
        <div class="input-item">
          <span class="content-label">起保时间</span>
          <div class="content-val-box">
            <div class="select-box" @click="startTimeShow = true">
              <span>
                {{ startTime.getTime() | dataFormat('yyyy-MM-dd') }}
              </span>
              <i class="icon-date"></i>
            </div>
          </div>
        </div>
        <div class="input-item">
          <span class="content-label">终止时间</span>
          <div class="content-val-box">
            <div class="select-box">
                <span>
                  {{ endTime.getTime() | dataFormat('yyyy-MM-dd') }}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--投保人信息-->
    <div class="content-box insure-info">
      <div class="header van-hairline--bottom">投保人信息</div>
      <div class="content">
        <div class="input-item" v-if="inputRule.nameShow">
          <span class="content-label">投保人姓名</span>
          <div class="content-val-box">
            <input v-model="name"
                   placeholder="请输入用户名"
                   @blur="checkName(name, inputRule.nameEmpty)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.idTypeShow">
          <span class="content-label">证件类型</span>
          <div class="content-val-box">
            <popup-radio title="证件类型"
                         cancel-text="取消"
                         value-key="value"
                         name-key="content"
                         :cur-column.sync="idType"
                         :columns="idTypes"
                         @click-item-change="idTypeChange"
            >
              <div class="select-box" :class="{'not-chosen': !idType.content}">
                <span>
                  {{ idType.content ? idType.content : '请选择证件类型' }}
                </span>
                <van-icon name="arrow" color="#cbcbcb"/>
              </div>
            </popup-radio>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.idNumberShow">
          <span class="content-label">证件号码</span>
          <div class="content-val-box">
            <input v-model="idNumber"
                   placeholder="请输入证件号码"
                   @blur="checkCredential(idNumber, inputRule.idNumberEmpty, idType.content, inputRule.idTypeEmpty)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.phoneShow">
          <span class="content-label">手机号码</span>
          <div class="content-val-box">
            <input v-model="phone"
                   type="tel"
                   placeholder="请输入手机号码"
                   @blur="checkPhone(phone, inputRule.phoneEmpty)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.emailShow">
          <span class="content-label">邮箱</span>
          <div class="content-val-box">
            <input v-model="email"
                   placeholder="请输入邮箱"
                   @blur="checkEmail(email, inputRule.emailEmpty)"/>
          </div>
        </div>
      </div>
    </div>
    <!--被保人信息-->
    <div class="content-box insure-info" :style="{ marginBottom:  inputRule.legalBeneficiary ? '' : (footerMargin+'px') }">
      <div class="header van-hairline--bottom">被保人信息</div>
      <div class="content">
        <div class="input-item" v-if="inputRule.insuredRelationShow">
          <span class="content-label">和投保人关系</span>
          <div class="content-val-box">
            <popup-radio title="和投保人关系"
                         cancel-text="取消"
                         value-key="value"
                         name-key="content"
                         :cur-column.sync="insuredRelation"
                         :columns="insuredRelations"
                         @click-item-change="insuredRelationChange"
            >
              <div class="select-box" :class="{'not-chosen': !insuredRelation.content}">
                <span>
                  {{ insuredRelation.content ? insuredRelation.content : '请选择和投保人关系' }}
                </span>
                <van-icon name="arrow" color="#cbcbcb"/>
              </div>
            </popup-radio>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredNameShow">
          <span class="content-label">被保人姓名</span>
          <div class="content-val-box">
            <input v-model="insuredName"
                   placeholder="请输入用户名"
                   @blur="checkName(insuredName, inputRule.insuredNameEmpty, true)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredIDTypeShow">
          <span class="content-label">证件类型</span>
          <div class="content-val-box">
            <popup-radio title="证件类型"
                         cancel-text="取消"
                         value-key="value"
                         name-key="content"
                         :cur-column.sync="insuredIDType"
                         :columns="insuredIDTypes"
                         @click-item-change="insuredIDTypeChange"
            >
              <div class="select-box" :class="{'not-chosen': !insuredIDType.content}">
                <span>
                  {{ insuredIDType.content ? insuredIDType.content : '请选择证件类型' }}
                </span>
                <van-icon name="arrow" color="#cbcbcb"/>
              </div>
            </popup-radio>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredIDNumberShow">
          <span class="content-label">证件号码</span>
          <div class="content-val-box">
            <input v-model="insuredIDNumber"
                   placeholder="请输入证件号码"
                   @blur="checkCredential(insuredIDNumber, inputRule.insuredIDNumberEmpty, insuredIDType.content, inputRule.insuredIDTypeEmpty, true)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredPhoneShow">
          <span class="content-label">手机号码</span>
          <div class="content-val-box">
            <input v-model="insuredPhone"
                   type="tel"
                   placeholder="请输入手机号码"
                   @blur="checkPhone(insuredPhone, inputRule.insuredPhoneEmpty, true)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredEmailShow">
          <span class="content-label">邮箱</span>
          <div class="content-val-box">
            <input v-model="insuredEmail"
                   placeholder="请输入邮箱"
                   @blur="checkEmail(insuredEmail, inputRule.insuredEmailEmpty, true)"/>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredSocialInsuranceShow">
          <span class="content-label">有无社保</span>
          <div class="content-val-box">
            <div class="btns">
              <button :class="{'curr': insuredSocialInsurance}" @click="changeSocialSecurity(1)">有社保</button>
              <button :class="{'curr': !insuredSocialInsurance}" @click="changeSocialSecurity(0)">无社保</button>
            </div>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredJobShow">
          <span class="content-label">职业选择</span>
          <div class="content-val-box">
            <div class="select-box"
                 :class="{'not-chosen': !showCareer}"
                 @click="occPopShow = true">
                <span>
                  {{ showCareer ? showCareer : '请选择职业' }}
                </span>
              <van-icon name="arrow" color="#cbcbcb"/>
            </div>
          </div>
        </div>
        <div class="input-item" v-if="inputRule.insuredBirthdayShow">
          <span class="content-label">出生日期</span>
          <div class="content-val-box">
            <div class="select-box" @click="insuredBirthdayShow = true">
              <span>
                {{ insuredBirthday.getTime() | dataFormat('yyyy-MM-dd') }}
              </span>
              <i class="icon-date"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--受益人信息-->
    <div class="content-box insure-info" v-if="inputRule.legalBeneficiary" :style="{ marginBottom: footerMargin+'px' }">
      <div class="header van-hairline--bottom">受益人信息</div>
      <div class="content">
        <p class="fixed">受益人为法定受益人</p>
      </div>
    </div>
    <div class="insure-footer-info" ref="footer">
      <div class="content van-hairline--bottom">
        <div class="check-box">
          <i class="not-checked" v-if="!isCheckAgreement" @click="isCheckAgreement = 1"></i>
          <van-icon class="checked" name="checked" v-if="isCheckAgreement" color="#1989FA"
                    @click="isCheckAgreement = 0"/>
          <div class="check-desc">
            我已认真阅读<span class="agreement" @click="goToTellCustomer">《客户告知书》</span><span v-for="(aItem, aIndex) in attachmentList" :key="aIndex" @click="getAgreements(aItem.fileUrl)" class="agreement">《{{ aItem.fileName }}》</span>并同意上述协议约定的内容。
          </div>
        </div>
      </div>
      <div class="btn-box">
        <p class="total-cost">{{ computedPrice | currency2('￥', 2) }}</p>
        <button class="btn-insure" @click="doInsure">立即投保</button>
      </div>
    </div>
    <!--起保时间选择弹窗-->
    <van-popup v-if="inputRule.startTimeShow" v-model="startTimeShow" position="bottom" :overlay="true">
      <van-datetime-picker v-model="startTime"
                           type="date"
                           :minDate="currDate"
                           @confirm="confirmStartTime"
                           @cancel="startTimeShow = false"/>
    </van-popup>
    <!--被保人生日选择弹窗-->
    <van-popup v-if="inputRule.insuredBirthdayShow" v-model="insuredBirthdayShow" position="bottom" :overlay="true">
      <van-datetime-picker v-model="insuredBirthday"
                           type="date"
                           :minDate="minBirthday"
                           :max-date="currDate"
                           @confirm="confirmInsuredBirthDay"
                           @cancel="insuredBirthdayShow = false"/>
    </van-popup>
    <!--职业选择弹窗-->
    <van-popup v-model="occPopShow" position="right" :overlay="true" class="grade h-100">
      <occ v-on:getOcc="getOcc"
           v-on:hide="occPopShow = false"
           :compare="compareOcc"
           :companyId="companyId"/>
    </van-popup>
  </div>
</template>

<script>
import lifeService from '@/api/lifeService';
import PopupRadio from '@/components/PopupRadio.vue';
import occ from '@/components/occupation';

export default {
  name: 'lifeInsure',
  components: { PopupRadio, occ },
  data() {
    return {
      currDate: new Date(),
      minBirthday: new Date('1900/1/1'),

      id: null,
      uid: null,
      inputRule: {},  // 客户投保资料必填项规则
      idTypes: [],
      insuredRelations: [],
      insuredIDTypes: [],
      // 商品信息 --------------------
      companyName: null,
      companyId: null,
      goodsName: null,
      count: null, // 购买份数
      protectName: null, // 保障计划
      protectRangeTime: 0,
      protectRangeContent: null,

      // 投保人信息 --------------------
      name: null,
      idType: { content: null, value: null },
      idNumber: null, // 证件号码
      phone: null,
      email: null,

      // 被保人信息 --------------------
      insuredRelation: { content: null, value: null },
      insuredName: null,
      insuredIDType: { content: null, value: null },
      insuredIDNumber: null,
      insuredPhone: null,
      insuredEmail: null,
      insuredSocialInsurance: 1,
      startTimeShow: false,
      startTime: this.getStartTime(),
      endTime: new Date(),
      insuredBirthdayShow: false,
      insuredBirthday: new Date(),
      insuredCareer: {
        level1: {},
        level2: {},
        level3: {},
      },

      price: null,
      rebateAmount: null,

      isCheckAgreement: 1,
      attachmentList: [
        // {fileName: '产品条款', fileUrl: 'http://www.test.com/pdf/1.pdf'},
        // {fileName: '职业分类', fileUrl: 'http://www.test.com/pdf/2.pdf'},
      ],
      errConfirmShow: false,
      occPopShow: false,
      ruleItemList: [], // 给计价接口的内容，直接从session获取
      plan: [], // 给提交接口的数据，从计价接口整理
      compareOcc: false,
      footerMargin: 0,
      isComputed: false // 是否计算过价格
    };
  },
  computed: {
    showCareer() {
      if (this.insuredCareer.level3.name) {
        return `${this.insuredCareer.level3.name}`;
      }
      return null;
    },
    computedPrice() {
      return this.isComputed ? this.price : this.price * this.count;
    }
  },
  created() {
    this.id = this.$route.query.id; // 商品ID
    const uid = this.$route.query.uid;
    this.uid = uid && uid !== 'undefined' && uid !== 'null' ? uid : null; // 分享的页面上会带
    this.getRuleConfig();
    this.getCustomerInfoRule();
  },
  mounted() {
    setPageTitle('投保页');

    // 初始化最后一个模块的下外边距
    let footerHeight = getComputedStyle(this.$refs.footer, null).getPropertyValue('height');
    this.footerMargin = parseFloat(footerHeight) + 10;
  },
  beforeDestroy() {
    // 离开前保存一下数据
    this.saveInputData();
  },
  methods: {
    // 获取商品详情页选定的内容
    getRuleConfig() {
      let getData = Util.getSessionData('ruleConfig') || {};

      let selectList = getData.selecList || [];
      this.goodsName = getData.title;
      this.price = getData.price;
      this.count = getData.count;

      let protectName = selectList.find((item) => item.title.includes('投保计划')) || {};
      this.protectName = protectName.select ? protectName.select.ruleItemContent : null;
      let insuredBirthday = selectList.find((item) => item.title.includes('出生日期')) || null;
      this.insuredBirthday = insuredBirthday ? new Date(insuredBirthday.select) : new Date();
      // 获取保障期限用于计算终止时间
      let protectRange = selectList.find((item) => item.title.trim().includes('保障期限')) || null;
      this.getProtectRangeTime(protectRange);
      // 获取上次填写的数据
      this.getSavedInputData();
      // 初始化终止时间
      this.confirmStartTime(false);
      // let occData = selectList.filter((item) => item.title === '职业类别')[0] || null;
      // this.getOccData(occData);

      this.companyName = getData.companyName;
      this.companyId = getData.companyId;
      this.ruleItemList = getData.paramList;
      this.attachmentList = getData.attachmentList || [];
      // this.doComputePrice();
    },
    getSavedInputData() {
      let savedData = Util.getSessionData('__p_input_data__');
      if (savedData) {
        Util.removeSessionData('__p_input_data__');
        if (savedData.id !== this.id) return;
        Object.assign(this, {
          id: savedData.id,
          name: savedData.name,
          idType: savedData.idType,
          idNumber: savedData.idNumber,
          phone: savedData.phone,
          email: savedData.email,
          insuredRelation: savedData.insuredRelation,
          insuredName: savedData.insuredName,
          insuredIDType: savedData.insuredIDType,
          insuredIDNumber: savedData.insuredIDNumber,
          insuredPhone: savedData.insuredPhone,
          insuredEmail: savedData.insuredEmail,
          insuredSocialInsurance: savedData.insuredSocialInsurance,
          startTime: savedData.startTime ? new Date(savedData.startTime) : this.getStartTime(),
          endTime: savedData.endTime ? new Date(savedData.endTime) : null,
          insuredBirthday: savedData.insuredBirthday ? new Date(savedData.insuredBirthday) : null,
          insuredCareer: savedData.insuredCareer
        })
      }
    },
    // 获取客户投保资料必填项
    getCustomerInfoRule() {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      lifeService.getCustomerInfo({
        goodsId: this.id,
      }).then((data) => {
        Toast.clear();
        if (data.code == 1) {
          this.inputRule = data.object;
          this.initData();
          this.doComputePrice();
        } else {
          Toast(data.message);
        }
      });
    },
    // 获取投保时间：第二日凌晨
    getStartTime() {
      const today = new Date();
      const tYear = today.getFullYear();
      const tMon = today.getMonth();
      const tDay = today.getDate();
      // const nextDay = new Date( new Date(`${tYear}/${tMon + 1}/${tDay}`).getTime() + 24*60*60*1000 );
      // console.log(`${tYear}/${tMon + 1}/${tDay}`, nextDay);
      return new Date( new Date(`${tYear}/${tMon + 1}/${tDay}`).getTime() + 24*60*60*1000 );
    },
    initData() {
      // 初始化证件类型
      lifeService.getIdType({}).then((data) => {
        if (data.code == 1) {
          let idTypeList = data.object;

          if (this.inputRule.idTypeShow) {
            let types = this.inputRule.idTypeSelection.split(',');
            this.idTypes = [...idTypeList].filter((item) => {
              return types.includes(item.value + '');
            });
          }

          if (this.inputRule.insuredIDTypeShow) {
            let types = this.inputRule.insuredIDTypeSelection.split(',');
            this.insuredIDTypes = [...idTypeList].filter((item) => {
              return types.includes(item.value + '');
            });
          }
        } else {
          Toast(data.message);
        }
      });

      // 初始化关系
      lifeService.getRelationship({}).then((data) => {
        if (data.code == 1) {
          let relationList = data.object;

          if (this.inputRule.insuredRelationShow) {
            let relations = this.inputRule.insuredRelationSelection.split(',');
            this.insuredRelations = [...relationList].filter((item) => {
              return relations.includes(item.value + '');
            });
          }
        } else {
          Toast(data.message);
        }
      });
    },
    // 修改有无社保
    changeSocialSecurity(val) {
      if (this.insuredSocialInsurance === val) return;
      this.insuredSocialInsurance = val;
      this.doComputePrice();
    },
    // 选定职业
    getOcc(obj) {
      this.insuredCareer = obj;
      this.occPopShow = false;
      this.doComputePrice();
    },
    checkName(val, allowEmpty, isInsured = false) {
      if (!allowEmpty && !val) {
        const ERR_MSG = isInsured ? '请输入被保人姓名' : '请输入投保人姓名';
        Toast(ERR_MSG);
        return false;
      }
      return true;
    },
    // 检查证件号码
    checkCredential(val, allowEmpty, idType, allowTypeEmpty, isInsured = false, doCalculate = true) {
      const MSG_INSERT = isInsured ? '被保人' : '投保人';
      if (!allowTypeEmpty && !idType) {
        Toast(`请选择${MSG_INSERT}证件类型`);
        return false;
      }
      if (!allowEmpty && !val) {
        Toast(`请输入${MSG_INSERT}证件号码`);
        return false;
      }
      if (idType === '身份证' && val && !Util.REGEXP.IDCARD.test(val)) {
        Toast(`请输入正确的${MSG_INSERT}身份证号码`);
        return false;
      }

      if (idType === '身份证' && isInsured && doCalculate) { // 提交前不需要自动修改
        this.getInsuredBirthdayFromIDNumber(val);
      }
      isInsured && doCalculate && this.doComputePrice();
      return true;
    },
    // 从身份证中获取生日
    getInsuredBirthdayFromIDNumber(sIDNumber) {
      let sBirthday = '';
      if (sIDNumber.length === 15) {
        // 15位身份证，取7~12位为出生年月，补19，不考虑1900年以前出生的
        sBirthday = '19' + sIDNumber.substr(6, 6);
      } else if (sIDNumber.length === 18) {
        sBirthday = sIDNumber.substr(6, 8);
      }
      let year = sBirthday.substr(0, 4);
      let mon = sBirthday.substr(4, 2);
      let day = sBirthday.substr(-2);
      let birthday = new Date(`${year}/${mon}/${day}`);
      // 获取的生日有问题，出生在未来？？？
      if (birthday.toString() === 'Invalid Date' || birthday.getTime() > new Date().getTime()) return;
      // if (birthday.getTime())
      const tYear = birthday.getFullYear();
      const tMon = birthday.getMonth();
      const tDay = birthday.getDate();
      // 输入生日与输出生日不符
      if (tYear != year || tMon + 1 != mon || tDay != day) {
        Toast('请输入正确的被保人身份证号码');
        return;
      }
      this.insuredBirthday = birthday;
    },
    // 检查手机号码
    checkPhone(val, allowEmpty, isInsured = false) {
      const MSG_INSERT = isInsured ? '被保人' : '投保人';
      if (!allowEmpty && !val) {
        Toast(`请输入${MSG_INSERT}手机号码`);
        return false;
      }
      if (val && !Util.REGEXP.PHONE.test(val)) {
        Toast(`请输入正确的${MSG_INSERT}手机号码`);
        return false;
      }
      return true;
    },
    checkEmail(val, allowEmpty, isInsured = false) {
      const MSG_INSERT = isInsured ? '被保人' : '投保人';
      if (!allowEmpty && !val) {
        Toast(`请输入${MSG_INSERT}邮箱`);
        return false;
      }
      if (val && !Util.REGEXP.EMAIL.test(val)) {
        Toast(`请输入正确的${MSG_INSERT}邮箱`);
        return false;
      }
      return true;
    },
    checkRelation(val, allowEmpty) {
      if (!allowEmpty && !val) {
        Toast('请选择和被保人关系');
        return false;
      }
      return true;
    },
    checkCareer() {
      if (!this.showCareer) {
        Toast('请选择被保人职业');
        return false;
      }
      return true;
    },
    // 立即投保
    doInsure() {
      let sendData = {
        goodsId: this.id,
      };
      let rule = this.inputRule;

      // 只有权限中允许出现的输入量放入sendData
      if (rule.startTimeShow) {
        sendData.startTime = this.startTime.getTime();
        sendData.endTime = this.endTime.getTime();
      }
      if (rule.nameShow) {
        if (!this.checkName(this.name, rule.nameEmpty)) return;
        sendData.name = this.name;
      }
      if (rule.idTypeShow) {
        sendData.idType = this.idType;
      }
      if (rule.idNumberShow) {
        if (!this.checkCredential(this.idNumber, rule.idNumberEmpty, this.idType.content, rule.idTypeEmpty)) return;
        sendData.idNumber = this.idNumber;
      }
      if (rule.phoneShow) {
        if (!this.checkPhone(this.phone, rule.phoneEmpty)) return;
        sendData.phone = this.phone;
      }
      if (rule.emailShow) {
        if (!this.checkEmail(this.email, rule.emailEmpty)) return;
        sendData.email = this.email;
      }
      if (rule.insuredRelationShow) {
        if (!this.checkRelation(this.insuredRelation.content, rule.insuredRelationEmpty)) return;
        sendData.insuredRelation = this.insuredRelation;
      }
      if (rule.insuredNameShow) {
        if (!this.checkName(this.insuredName, rule.insuredNameEmpty, true)) return;
        sendData.insuredName = this.insuredName;
      }
      if (rule.insuredIDTypeShow) {
        sendData.insuredIDType = this.insuredIDType;
      }
      if (rule.insuredIDNumberShow) {
        if (!this.checkCredential(this.insuredIDNumber, rule.insuredIDNumberEmpty, this.insuredIDType.content, rule.insuredIDTypeEmpty, true, false)) return;
        sendData.insuredIDNumber = this.insuredIDNumber;
      }
      if (rule.insuredPhoneShow) {
        if (!this.checkPhone(this.insuredPhone, rule.insuredPhoneEmpty, true)) return;
        sendData.insuredPhone = this.insuredPhone;
      }
      if (rule.insuredEmailShow) {
        if (!this.checkEmail(this.insuredEmail, rule.insuredEmailEmpty)) return;
        sendData.insuredEmail = this.insuredEmail;
      }
      if (rule.insuredSocialInsuranceShow) {
        sendData.insuredSocialInsurance = this.insuredSocialInsurance;
      }
      if (rule.insuredBirthdayShow) {
        sendData.insuredBirthday = this.insuredBirthday.getTime();
      }
      if (rule.insuredJobShow) {
        if (!this.checkCareer()) return;
        sendData.insuredCareer = this.insuredCareer.level3;
      }
      sendData.legalBeneficiary = rule.legalBeneficiary;
      sendData.promotionFee = this.rebateAmount;
      sendData.goodsName = this.goodsName;
      sendData.count = this.count || 1;
      sendData.protectName = this.protectName;
      sendData.protectRangeContent = this.protectRangeContent;
      sendData.goodsId = this.id;

      if (!this.isCheckAgreement) {
        Toast(`请确认已认真阅读协议`);
        return;
      }
      // this.errConfirmShow = true;
      // console.log(sendData);
      this.doComputePrice(() => {
        sendData.plan = this.plan;
        sendData.price = this.price;
        Util.setSessionData('__p_insure__', sendData);

        // this.saveInputData();
        let path = '/life/life_confirm_order' + (this.uid ? `?uid=${this.uid}` : '');
        btPage.open({
          url: path,
          container_style: 1
        });
      }, true);
    },
    // 保存已输入的数据
    saveInputData() {
      const saveData = {
        id: this.id,
        name: this.name,
        idType: this.idType,
        idNumber: this.idNumber,
        phone: this.phone,
        email: this.email,
        insuredRelation: this.insuredRelation,
        insuredName: this.insuredName,
        insuredIDType: this.insuredIDType,
        insuredIDNumber: this.insuredIDNumber,
        insuredPhone: this.insuredPhone,
        insuredEmail: this.insuredEmail,
        insuredSocialInsurance: this.insuredSocialInsurance,
        startTime: this.startTime.getTime(),
        endTime: this.endTime.getTime(),
        insuredBirthday: this.insuredBirthday.getTime(),
        insuredCareer: this.insuredCareer
      };

      Util.setSessionData('__p_input_data__', saveData);
    },
    getPluralYearDays(nYears) {
      let endTime = this.getStartTime();
      endTime.setFullYear(endTime.getFullYear() + nYears);
      // let nday = (endTime - this.getStartTime()) / (24 * 60 * 60 * 1000);
      // console.log(nday);
      return (endTime - this.getStartTime()) / (24 * 60 * 60 * 1000);
    },
    // 设置职业选择
    // getOccData(occData) {
    //   if (occData) {
    //     this.compareOcc = true;
    //     if (occData.select.unit && occData.select.value) {
    //       let val = parseInt(occData.select.value);
    //       this.occMax = val;
    //       this.occMin = val;
    //     } else {
    //       this.occMax = parseInt(occData.select.endValue);
    //       this.occMin = parseInt(occData.select.startValue);
    //     }
    //   } else {
    //     this.compareOcc = false;
    //   }
    // },
    // 获取保障期间
    getProtectRangeTime(oRange) {
      let timeRange = 0;
      const timeUnit = 60*60*1000;
      if (oRange) {
        this.protectRangeContent = oRange.select.ruleItemContent;
        let rangeMax = '';
        let rangeMaxUnit = '';
        if (oRange.select.unit && oRange.select.value) {
          rangeMax = oRange.select.value;
          rangeMaxUnit = oRange.select.unit;
        } else {
          rangeMax = oRange.select.endValue;
          rangeMaxUnit = oRange.select.endUnit;
        }
        if (rangeMaxUnit.includes('年')) {
          // timeRange = timeUnit * (rangeMax * nday * 24);
          timeRange = timeUnit * (this.getPluralYearDays(parseInt(rangeMax)) * 24);
        } else {
          timeRange = timeUnit * (rangeMax * 24);
        }
      } else {
        // console.log(nday);
        // 默认一年
        timeRange = timeUnit * 24 * this.getPluralYearDays(1);
      }

      this.protectRangeTime = timeRange - 1000;
    },
    // 改变起保时间
    confirmStartTime(isComputePrice = true) {
      this.startTimeShow = false;
      // 计算终止时间
      this.endTime = new Date(this.startTime.getTime() + this.protectRangeTime);
      // 更新价格
      isComputePrice && this.doComputePrice();
    },
    // 被保人生日变动
    confirmInsuredBirthDay() {
      this.insuredBirthdayShow = false;
      this.doComputePrice();
    },
    // 投保人证件类型改变
    idTypeChange() {
      this.idNumber = null;
    },
    // 被保人证件类型改变
    insuredIDTypeChange() {
      this.insuredIDNumber = null;
    },
    // 被保人关系变动
    insuredRelationChange() {
      if (this.insuredRelation.content === '本人') {
        // 将已填的投保人信息复制到被保人信息中
        this.insuredName = this.name;
        this.insuredIDType = this.idType;
        this.insuredIDNumber = this.idNumber;
        this.insuredPhone = this.phone;
        this.insuredEmail = this.email;

        if(this.insuredIDNumber) {
          this.getInsuredBirthdayFromIDNumber(this.insuredIDNumber);
        }
      }
      this.doComputePrice();
    },
    // 整理plan格式
    getPlan(rules) {
      let plan = [];
      for (let [index, item] of rules.entries()) {
        plan.push({
          ruleId: item.ruleId,
          value: item.value
        })
      }
      return plan;
    },
    // 计算价格
    doComputePrice(successCallback, isShowLoading = false) {
      const rule = this.inputRule;
      // 计价必填项 && 权限要求显示的必需不为空
      if (
        (!rule.insuredIDTypeShow || this.insuredIDType.value) &&
        (!rule.insuredIDNumberShow || this.insuredIDNumber) &&
        (!rule.insuredRelationShow || this.insuredRelation.value) &&
        (!rule.startTimeShow || this.startTime) &&
        (!rule.insuredBirthdayShow || this.insuredBirthday) &&
        (!rule.insuredJobShow || this.insuredCareer.level3.id)
      ) {
        let sendData = {
          count: this.count,
          customerInfo: {
            name: this.insuredName,
            sex: null,
            idType: rule.insuredIDTypeShow ? this.insuredIDType.value : null,
            idNumber: rule.insuredIDNumberShow ? this.insuredIDNumber : null,
            birthday: rule.insuredBirthdayShow ? this.insuredBirthday.getTime() : null,
            phone: this.insuredPhone,
            email: this.insuredEmail,
            relation: this.insuredRelation.value,
            haveSocialInsurance: rule.insuredSocialInsuranceShow ? this.insuredSocialInsurance : null,
            job: rule.insuredJobShow ? this.insuredCareer.level3.id : null,
            startTime: rule.startTimeShow ? this.startTime.getTime() : null,
          },
          queryPlanList: this.ruleItemList,
        };

        if (isShowLoading) {
          Toast.loading({
            mask: true,
            message: '加载中...',
            duration: 0,
          });
        }
        lifeService.computePrice({
          jsonString: JSON.stringify(sendData),
        }).then((data) => {
          if (data.code == 1) {
            isShowLoading && Toast.clear();
            this.isComputed = true;
            this.price = data.object.price;
            this.rebateAmount = data.object.rebateAmount;
            this.plan = this.getPlan(data.object.rules);
            successCallback && successCallback();
          } else {
            Toast(data.message);
          }
        });
      }
    },
    goToTellCustomer() {
      btPage.open({
        url: '/life/tell_customer',
        container_style: 1,
      });
    },
    // 获取协议PDF
    getAgreements(fileUrl) {
      this.saveInputData();
      location.href = fileUrl;
    }
  },
};
</script>

<style lang="less">
  @import "../../assets/less/global";

  @orange: rgba(252, 107, 71, 1);
  .life-insure-wrapper {
    position: relative;
    &:after{
      content: '';
      display: table;
    }

    .content-box {
      width: 100%;
      margin-bottom: 10px;
      background: white;

      .header {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 500;
        color: #464646;
        padding-left: 27px;
        position: relative;

        &:before {
          content: '';
          display: block;
          width: 4px;
          height: 16px;
          background: rgba(255, 164, 25, 1);
          position: absolute;
          top: 12px;
          left: 15px;
        }
      }
      .content {
        padding: 0 15px;
      }
    }
    .insure-header-info {
      padding: 13px 0;
      position: relative;

      .content {
        .insurance-company-name {
          /*display: flex;*/
          /*justify-content: center;*/
          /*align-items: center;*/
          /*width: 94px;*/
          display: inline-block;
          padding: 0 10px;
          height: 21px;
          border-radius: 11px;
          border: 1px solid @orange;
          color: @orange;
          font-size: 12px;
          line-height: 19px;
        }
        .insurance-name {
          width: calc(100% - 60px);
          min-height: 25px;
          font-size: 18px;
          font-weight: 500;
          color: #333;
          line-height: 25px;
          margin-bottom: 10px;
        }
        .insurance-detail {
          min-height: 18px;
          .font-core(14px, #909090);
          font-weight: 400;
          line-height: 18px;

          .val {
            display: inline-block;
            width: calc(100% - 133px);
            vertical-align: top;
          }
        }
      }
      .bg-img {
        .wh(90px, 110px);
        .bg-img-set('~@/assets/images/life/icon_toubao@2x.png', '~@/assets/images/life/icon_toubao@3x.png');
        .position2(absolute, right, 0, bottom, 0);
      }
    }
    .insure-info {
      .content {
        .input-item {
          display: flex;
          align-items: center;
          height: 50px;
          &:not(:last-child) {
            .half-border(bottom, #ddd);
          }

          .content-label {
            width: 120px;
            flex-grow: 0;
            .font-core(15px, #333);
            padding-left: 12px;
          }
          .content-val-box {
            flex-grow: 1;
            .font-core(15px, #333);

            input {
              width: 100%;
              flex-grow: 1;
              .font-core(15px, #333);
            }
            .select-box {
              display: flex;
              align-items: center;
              justify-content: space-between;

              &.not-chosen {
                color: #999;
              }
              .icon-date {
                display: inline-block;
                .wh(18px, 18px);
                .bg-img-set('~@/assets/images/life/icon_calendar@2x.png', '~@/assets/images/life/icon_calendar@3x.png', 100%, 100%);
              }
            }
            .btns {
              button {
                .wh(80px, 30px);
                border-radius: 3px;
                border: 1px solid #a9a9a9;
                .font-core(13px, #666);
                background: white;

                &.curr {
                  color: #fc6b47;
                  border-color: #fc6b47;
                }
              }
            }
          }
        }
        .fixed {
          height: 50px;
          .font(15px, #333, left, 50px);
          padding-left: 12px;
        }
      }
    }
    /*.last-content-box {*/
      /*margin-bottom: 115px;*/
    /*}*/
    .insure-footer-info {
      background: white;
      .position2(fixed, bottom, 0, left, 0);
      width: 100%;

      .content {
        padding: 0 15px;
        .check-box {
          display: flex;
          align-items: flex-start;
          padding: 10px 0;

          .not-checked {
            display: block;
            .square(16px);
            flex-shrink: 0;
            flex-grow: 0;
            border-radius: 50%;
            border: 1px solid #d9d9d9;
            margin-right: 8px;
            margin-top: 2px;
          }
          .checked {
            flex-shrink: 0;
            flex-grow: 0;
            margin-right: 8px;
            margin-top: 2px;
            font-size: 16px;
          }
          .check-desc {
            .font(13px, #909090, justify, 18px);

            .agreement {
              color: #fc6b47;
            }
          }
        }
      }
      .btn-box {
        display: flex;

        .total-cost {
          flex-grow: 1;
          .font(24px, #fc6b47, left, 46px);
          padding-left: 15px;

          &:first-letter {
            font-size: 20px;
          }
        }
        .btn-insure {
          .wh(150px, 50px);
          flex-shrink: 0;
          flex-grow: 0;
          background: linear-gradient(90deg, rgba(255, 133, 38, 1) 0%, rgba(252, 107, 71, 1) 100%);
          .font-core(17px, white);
        }
      }
    }
    .grade {
      width: calc(100% - 50px);
    }
  }
  .van-popup {
    .popup-radio {
      span {
        font-size: 16px;
      }
    }
    div.ta-c {
      font-size: 16px;
    }
  }

</style>
