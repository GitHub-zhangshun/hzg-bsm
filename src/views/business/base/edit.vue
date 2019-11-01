<template>
  <div class="post-container" style="margin-bottom: 100px;">
    <sticky class-name="sub-navbar published" :zIndex="999">
      <el-button :type="action.cssClass" v-for="action in currentMenuTopRunFuncList" :key="action.Id" @click="top_execute(action)">{{action.name}}
      </el-button>
    </sticky>
    <div class="post-main-container">
      <!-- 表单 -->
      <el-form :model="baseForm" :hide-required-asterisk="false" ref="baseForm" status-icon :rules="rules" :inline="true" size="mini" label-width="100px">
        <el-tabs v-model="tabsName" id="custom_tabs" stretch>
          <el-tab-pane label="基本信息" name="baseInfo">
            <!-- 产品类型选择 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="产品类型选择"></mallki><span class="tipText">{{tipText}}</span>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="factoringId">
                  <template slot="label">
                    <span class="el-form-item_custom_label">保理机构</span>
                  </template>
                  <el-select class="custom" v-model="baseForm.factoringId_n" filterable remote :placeholder="baseForm.factoringInfo && baseForm.factoringInfo.enterpriseName" :remote-method="queryFactoringAsync" :clearable="true" popper-class="search-select">
                    <el-option v-for="item in factoringList" :key="item.Id" :label="item.enterpriseName" :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">助贷机构</span>
                  </template>
                  <el-select class="custom" v-model="baseForm.providerId_n" filterable remote :placeholder="baseForm.providerInfo && baseForm.providerInfo.enterpriseName" :remote-method="queryProviderAsync" :clearable="true" popper-class="search-select" :loading="selectLoading">
                    <el-option v-for="item in providerList" :key="item.Id" :label="item.enterpriseName" :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="userId">
                  <template slot="label">
                    <span class="el-form-item_custom_label">借款人</span>
                  </template>
                  <div class="searchItem">
                    <div class="searchBox" v-if="showBorrowerSearchType">
                      <div>
                        <span>搜索类型：</span>
                        <el-radio size="mini" v-model="borrowerSearchType" label="1">所有借款人</el-radio>
                        <el-radio size="mini" v-model="borrowerSearchType" label="2">当前提供商下的借款人</el-radio>
                      </div>
                      <div>
                        <span>如果此借款人非当前所选提供商下的，此提供商将作为担保方上报</span>
                      </div>
                    </div>
                    <el-select class="custom" @focus="showBorrowerSearchType = true" v-model="baseForm.userId_n" filterable remote :placeholder="baseForm.userInfo && (baseForm.userInfo.enterpriseName || baseForm.userInfo.realName)" :remote-method="queryBorrowerAsync" :clearable="true" popper-class="search-select">
                      <el-option v-for="item in borrowerList" :key="item.Id" :label="item.enterpriseName || item.realName" :value="item.Id">
                        <span style="float: left">{{item.enterpriseName?`${item.enterpriseName}-`:''}}{{ item.realName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phone }}</span>
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item prop="businessType">
                  <template slot="label">
                    <span class="el-form-item_custom_label">业务类型</span>
                  </template>
                  <ServiceSelect v-model="baseForm.businessType" placeholder="请选择业务类型" queryArg="bid_business_type"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="productType">
                  <template slot="label">
                    <span class="el-form-item_custom_label">产品类型</span>
                  </template>
                  <ServiceSelect v-model="baseForm.productType" placeholder="请选择产品类型" queryArg="bid_info_type"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="contractTemplateId">
                  <template slot="label">
                    <span class="el-form-item_custom_label">合同模板</span>
                  </template>
                  <el-select v-model="baseForm.contractTemplateId" placeholder="请选择合同模板">
                    <el-option v-for="item in contractTemplateList" :key="item.Id" :label="item.title" :value="item.Id"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="riskLevel">
                  <template slot="label">
                    <span class="el-form-item_custom_label">风险等级</span>
                  </template>
                  <ServiceSelect v-model="baseForm.riskLevel" placeholder="请选择风险等级" queryArg="platform_risk_level"></ServiceSelect>
                </el-form-item> -->
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">产品模板</span>
                  </template>
                  <ServiceSelect v-model="baseForm.seriesType" placeholder="请选择产品模板" queryArg="bid_template_info" @change="seriesTypeChange"></ServiceSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 模板参数 -->
            <template v-if="baseForm.extendList && baseForm.extendList.length > 0">
              <el-row>
                <el-col :span="24">
                  <h3 class="title">
                    <mallki className="mallki-text" text="模板参数"></mallki>
                  </h3>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <template v-if="baseForm.extendList && baseForm.extendList.length > 0">
                    <el-form-item v-for="(item, index) in baseForm.extendList" :key="item.keyId" :prop="'extendList.'+ index + '.replaceTxt'" :rules="{ required: true, message: `请输入${item.title}`, trigger: 'blur' }">
                      <template slot="label">
                        <span class="el-form-item_custom_label">{{item.title}}</span>
                      </template>
                      <el-input :key="item.keyId" v-model="item.replaceTxt" :placeholder="`${item.remark || `请输入${item.title}`}`"></el-input>
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
            </template>
            <!-- 资金流确认 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="资金流确认"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="allowRefund">
                  <template slot="label">
                    <span class="el-form-item_custom_label">还款对象</span>
                  </template>
                  <ServiceSelect v-model="baseForm.allowRefund" placeholder="请选择还款对象" queryArg="allow_refund_type"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="loanMoneyFlow">
                  <template slot="label">
                    <span class="el-form-item_custom_label">放款资金流</span>
                  </template>
                  <ServiceSelect v-model="baseForm.loanMoneyFlow" placeholder="请选择放款方式" queryArg="money_flow_type"></ServiceSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 产品基本信息 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="产品基本信息"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="name">
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的名称</span>
                  </template>
                  <el-input v-model="baseForm.name" placeholder="请输入标的名称"></el-input>
                </el-form-item>
                <el-form-item prop="money">
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的金额</span>
                  </template>
                  <el-tooltip :content="showFormatMoney" placement="top-start" effect="light">
                    <el-input v-model="baseForm.money" placeholder="请输入标的金额">
                      <template slot="suffix">元</template>
                    </el-input>
                  </el-tooltip>
                </el-form-item>
                <el-form-item prop="count">
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的期限</span>
                  </template>
                  <el-input v-model="baseForm.count" placeholder="请输入标的期限" :disabled="disabledCount"></el-input>
                </el-form-item>
                <el-form-item prop="rateId">
                  <template slot="label">
                    <span class="el-form-item_custom_label">基础利率</span>
                  </template>
                  <ServiceSelect v-model="baseForm.rateId" placeholder="请选择利率" queryArg="bid_product_rate"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="repayment">
                  <template slot="label">
                    <span class="el-form-item_custom_label">还款方式</span>
                  </template>
                  <ServiceSelect v-model="baseForm.repayment" placeholder="请选择还款方式" queryArg="bid_repay_type"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="interestType">
                  <template slot="label">
                    <span class="el-form-item_custom_label">计息方式</span>
                  </template>
                  <ServiceSelect v-model="baseForm.interestType" :disabled="disableInterestType" placeholder="请选择计息方式" queryArg="bid_interest_rate_type"></ServiceSelect>
                </el-form-item>
                <el-form-item prop="periods">
                  <template slot="label">
                    <span class="el-form-item_custom_label">分期期数</span>
                  </template>
                  <el-input v-model="baseForm.periods" type="number" placeholder="请输入期数" :disabled="disablePeriods">
                    <template slot="suffix">期</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="contractNum">
                  <template slot="label">
                    <span class="el-form-item_custom_label">合同编号</span>
                  </template>
                  <el-input v-model="baseForm.contractNum" placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item prop="feeRateId">
                  <template slot="label">
                    <span class="el-form-item_custom_label">管理费率</span>
                  </template>
                  <ServiceSelect v-model="baseForm.feeRateId" placeholder="请选择管理费率" queryArg="bid_product_fee_rate"></ServiceSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">起投金额</span>
                  </template>
                  <el-input v-model="productTypeAttachInfo.limitMin" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">递增金额</span>
                  </template>
                  <el-input v-model="productTypeAttachInfo.increase" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">单笔限额</span>
                  </template>
                  <el-input v-model="productTypeAttachInfo.limitMax" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 产品描述信息 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="产品描述信息"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="borrowCause">
                  <!-- y -->
                  <el-input type="textarea" v-model="baseForm.borrowCause" :rows="5" placeholder="请输入借款用途"></el-input>
                </el-form-item>
                <el-form-item prop="pledgeDetail">
                  <el-input type="textarea" v-model="baseForm.pledgeDetail" :rows="5" placeholder="请输入借款人描述"></el-input>
                </el-form-item>
                <el-form-item prop="repaymentSource">
                  <el-input type="textarea" v-model="baseForm.repaymentSource" :rows="5" placeholder="请输入保障方式"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 产品详细信息 -->
            <el-row>
              <el-tooltip content="此栏信息尽可能的全面,便于其他同事审核" placement="bottom">
                <el-col :span="24">
                  <h3 class="title">
                    <mallki className="mallki-text" text="产品详细信息"></mallki>
                  </h3>
                </el-col>
              </el-tooltip>
            </el-row>
            <el-row>
              <el-col :span="24">
                <Tinymce ref="editor" :height="400" v-model="baseForm.introduce" />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="信息披露" name="fkInfo">
            <section class="info_action">
              <el-button round type="primary" size="mini" @click="addGroup('text')">新增文字组别</el-button>
              <el-button round type="success" size="mini" @click="addGroup('img')">新增图片组别</el-button>
              <el-button round type="warning" size="mini" @click="addGroup('text_img')">新增图文组别</el-button>
            </section>
            <section :id="`section-${index}`" v-for="(section, index) in this.baseForm.discloseGroupList" :key="index" class="info_section shadow" :style="section.showType === 'text' ? 'border-top: 2px solid #1D93F5;' : (section.showType === 'img' ? 'border-top: 2px solid #5CBA33;' : 'border-top: 2px solid #E29735;')">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="1">
                  <div @click="addItem(index)">
                    <svg-icon icon-class="add" className="icon_class add" />
                  </div>
                  <div @click="delGroup(index)">
                    <svg-icon icon-class="delete" className="icon_class del" />
                  </div>
                  <div :id="`section-up-${index}`" @click="foldUp(index)">
                    <svg-icon icon-class="up" className="icon_class up" />
                  </div>
                  <div :id="`section-down-${index}`" style="display: none" @click="foldDown(index)">
                    <svg-icon icon-class="down" className="icon_class up" />
                  </div>
                </el-col>
                <el-col :span="23">
                  <el-row>
                    <el-col :span="24">
                      <el-input placeholder="请输入组别名称" v-model="section.name" size="mini">
                        <template slot="prepend">
                          <svg-icon icon-class="gather"></svg-icon>
                        </template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <div class="group_item" v-for="(item, indexItem) in section.itemList" :key="indexItem">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="8">
                        <el-input placeholder="请输入标题" v-model="item.title" size="mini">
                          <template slot="prepend">
                            <svg-icon icon-class="list"></svg-icon>
                          </template>
                        </el-input>
                      </el-col>
                      <div class="" style="display: flex;">
                        <div v-if="item.Id" @click="recoverItem(index, indexItem, item)" style="margin-right:10px;">
                          <svg-icon icon-class="recover" className="icon_class add" />
                        </div>
                        <div @click="delItem(index, indexItem)">
                          <svg-icon icon-class="delete" className="icon_class del" />
                        </div>
                      </div>
                    </el-row>
                    <el-row v-if="section.showType && (section.showType === 'text' || section.showType === 'text_img')">
                      <el-col :span="24">
                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="item.content">
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row v-if="section.showType && (section.showType === 'img' || section.showType === 'text_img')" style="margin-top:1px;">
                      <el-col :span="24">
                        <Upload5 v-model="item.imgLinkList"></Upload5>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </section>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import {
    _func
  } from '@/business/baseFunc'
  import Tinymce from '@/components/Tinymce'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import MDinput from '@/components/MDinput'
  import {
    baseFormRules
  } from '@/business/rules'
  export default {
    components: {
      Mallki,
      Tinymce,
      Sticky,
      MDinput
    },
    created() {
      // 获取标的详情
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_BID_INFO'],
        data: this.$route.query.id
      }).then(data => {
        this.baseForm = data.result
        // 必须重新选择的字段
        // this.baseForm.rateId = ''
        // this.baseForm.feeRateId = ''
        // 获取披露模板信息 用于恢复匹配
        this.baseForm.seriesType && this.getSeriesTemplate(this.baseForm.seriesType).then(data => {
          this.productTypeAttachInfoByRecover = data
        })
        // 获取信息披露模板KEY
        this.baseForm.seriesType && this.getSeriesTemplateKey(this.baseForm.seriesType).then(data => {
          // 匹配显示在页面的key kid匹配
          let extendList = []
          data.result.map(i => {
            this.baseForm.extendList.map(j => {
              if (i.Id === j.keyId && i.isShow) {
                extendList.push(j)
              }
            })
          })
          this.baseForm.extendList = extendList
        })
        // 获取风险等级
        this.baseForm.riskLevel = data.result.attachInfo && data.result.attachInfo.riskLevel
        //
        this.baseForm.loanMoneyFlow = data.result.attachInfo.loanMoneyFlow
        this.baseForm.allowRefund = data.result.attachInfo.allowRefund

      })
      // 添加滚动监听事件
      window.addEventListener('scroll', this.winScroll)
      // 获取合同模板列表
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_CONTRACT_TEMPLATE']
      }).then(data => {
        this.contractTemplateList = data.result
      })
    },
    // 组件销毁
    destroyed() {
      window.removeEventListener('scroll', this.winScroll)
    },
    data() {
      return {
        rules: baseFormRules.bidRules,
        baseForm: {
          cast: '暂无数据',
          increasing: '暂无数据',
          singleLimit: '暂无数据',
          discloseGroupList: [], // 披露信息
          extendList: [], // 披露模板显示key
        },
        borrowerList: [], // 借款人查询列表
        providerList: [], // 助贷机构查询列表
        factoringList: [], // 保理机构查询列表
        tipText: '', // 借款人详细信息提示
        selectLoading: false,
        tabsName: 'baseInfo', // 当前选项卡
        contractTemplateList: [],
        disablePeriods: false, // 期数框状态
        disableInterestType: false, // 计息框状态
        disabledCount: false, // 期限框状态
        productTypeAttachInfo: {}, // 披露信息
        productTypeAttachInfoByRecover: [], // 已选择的披露信息 用于复原
        borrowerSearchType: '1',
        showBorrowerSearchType: false
      }
    },
    computed: {
      ...mapGetters([
        'baseRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ]),
      uploadUrl() {
        return this.baseRunFuncList['O_UPLOAD_IMG']
      },
      typeEnumUrl() {
        return this.baseRunFuncList['O_TYPE_ENUM_LIST']
      },
      // 标的金额显示的格式化
      showFormatMoney() {
        return `${this.baseForm.money/10000 || 0} 万`
      }
    },
    watch: {
      // 标的类型下拉数据改变 获取此标类型的起投、递增、单笔限额
      'baseForm.productType': async function(nd) {
        if (nd) {
          await this.$request({
            url: this.currentMenuHiddenRunFuncList['O_BID_TYPE_INFO'],
            data: nd
          }).then(data => {
            if (data.result) {
              this.productTypeAttachInfo = data.result
            }
          })
        } else {
          this.productTypeAttachInfo = {}
        }
      },
      // 标的还款方式监听
      'baseForm.repayment': function(nd, od) {
        if (!od) {
          // 如果第一次加载 不做改变
          return
        }
        const repayment = this.getDicSimplifyById(nd)
        if (repayment === 'bid_repay_equal') {
          // 等额本息
          this.baseForm.interestType = this.getDicIdBySimplify('interest_rate_month')
          this.disableInterestType = true
        } else {
          this.disableInterestType = false
        }
      },
      // 监听标的期数
      'baseForm.periods': function(nd, od) {
        if (!od) {
          // 如果第一次加载 不做改变
          return
        }
        // 如果还款方式为等额本息
        if (this.getDicSimplifyById(this.baseForm.repayment) === 'bid_repay_equal') {
          // 期数必须等于期限
          this.baseForm.count = nd
        }
      },
      // 监听借款人是否授权 收取手续费
      'baseForm.userId': function(nd) {
        if (nd) {
          this.$request({
            url: this.currentMenuHiddenRunFuncList['O_VERIFY'],
            data: nd
          }).then(data => {
            if (!data.result) {
              this.$confirm(`<strong>此借款人未进行<span style="color:red">放还款手续费签约</span>，必须进行签约后才能进行上标操作，请知晓！</strong><br/>
          <img src="${this.img}" style="width:100%" alt=""/>
          `, '放还款手续费签约', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '去借款人平台签约',
                cancelButtonText: '放弃,换个借款人',
                closeOnClickModal: false
              }).then(() => {
                window.open('https://borrower.cd-rzt.com/', '_blank')
                setTimeout(() => {
                  this.$confirm(`<strong>确定已经成功<span style="color:red">放还款手续费签约</span></strong>`, '签约确定', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    closeOnClickModal: false
                  }).then(() => {})
                }, 3000)
              })
            }
          })
        }
      }
    },
    methods: Object.assign(_func(), {
      // 产品录入提交
      func_execute(action) {
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            // 处理 placeholder 值
            this.baseForm.providerId = this.baseForm.providerId_n || this.baseForm.providerId
            this.baseForm.factoringId = this.baseForm.factoringId_n || this.baseForm.factoringId
            this.baseForm.userId = this.baseForm.userId_n || this.baseForm.userId

            const repayment = this.getDicSimplifyById(this.baseForm.repayment)
            // 一次性还本付息
            if (repayment === 'bid_repay_one' && parseInt(this.baseForm.periods) !== 1) {
              this.$message.error('一次性还本付息 分期期数必须为 一期')
              return
            }
            // 等额本息
            if (repayment === 'bid_repay_equal' && this.baseForm.periods !== this.baseForm.count) {
              this.$message.error('等额本息 分期期数必须等于标的期限')
              return
            }
            // 标的期限必须大于等于分期期数
            if (parseInt(this.baseForm.count) % parseInt(this.baseForm.periods) !== 0) {
              this.$message.error('期限必须大于期数且能整除')
              return
            }
            // 风险等级默认为稳健型
            this.baseForm.riskLevel = '95673ecf-21bb-42e1-97e1-0a436234c5cc'

            this.$request({
              url: action.apiUrl,
              data: this.baseForm
            }).then(() => {
              this.$refs.baseForm.resetFields()
              this.baseForm = {
                cast: '暂无数据',
                increasing: '暂无数据',
                singleLimit: '暂无数据'
              }
              this.$message.success('录入成功')
              this.$router.push('/bus/audit/wait')
            })
          }
        })
      },
      winScroll(e) {
        let element = document.getElementById('custom_tabs')
        let tabsViewTop = this.getElementViewTop(element.childNodes[0])
        if (tabsViewTop < 75) {
          element.className = 'sticky'
        } else {
          element.className = 'el-tabs el-tabs--top'
          // element.className = element.className.replace(new RegExp("(\\s|^)" + 'sticky' + "(\\s|$)"), " ")
        }
      },
      // 获取元素的相对顶部高度
      getElementViewTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
          actualTop += current.offsetTop;
          current = current.offsetParent;
        }

        if (document.compatMode == "BackCompat") {
          var elementScrollTop = document.body.scrollTop;
        } else {
          var elementScrollTop = document.documentElement.scrollTop;
        }

        return actualTop - elementScrollTop;
      },
      // 新增组别
      addGroup(e) {
        this.baseForm.discloseGroupList.push({
          name: '',
          sort: this.baseForm.discloseGroupList.length + 1,
          itemList: [{
            title: '',
            content: '',
            imgLinkList: [],
            sort: '1'
          }],
          showType: e
        })
        this.$message.success('组别新增成功')
      },
      // 删除组别
      delGroup(e) {
        this.$confirm('此操作将删除该组别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.baseForm.discloseGroupList.splice(e, 1)
        })
      },
      // 新增子集
      addItem(e) {
        this.baseForm.discloseGroupList[e].itemList.push({
          title: '',
          content: '',
          imgLinkList: [],
          sort: this.baseForm.discloseGroupList[e].itemList.length + 1
        })
        this.$message.success('子集新增成功')
      },
      // 删除子集
      delItem(ge, ie) {
        this.$confirm('此操作将删除该子集, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.baseForm.discloseGroupList[ge].itemList.splice(ie, 1)
        })
      },
      // 恢复子集
      recoverItem(ge, ie, item) {
        this.$confirm('此操作将把内容替换为模板内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = null
          // 匹配模板内容
          let children = []
          this.productTypeAttachInfoByRecover.map(i => {
            if (i.children) {
              children.push(...i.children)
            }
          })
          let template = children.filter(i => i.Id === item.typeId)
          if (template && template.length > 0) {
            let item = this.baseForm.discloseGroupList[ge].itemList[ie]
            item.title = template[0].title
            item.content = template[0].remark
          } else {
            this.$message.info('没有找到恢复数据，请联系管理员，或者自行填入')
          }
        })
      },
      foldUp(index) {
        const element = document.getElementById(`section-${index}`)
        if (element.className === 'info_section shadow') {
          element.className = 'info_section shadow fold'
        } else {
          element.className = 'info_section shadow'
        }
        document.getElementById(`section-up-${index}`).style.display = 'none'
        document.getElementById(`section-down-${index}`).style.display = 'block'
      },
      foldDown(index) {
        const element = document.getElementById(`section-${index}`)
        if (element.className === 'info_section shadow') {
          element.className = 'info_section shadow fold'
        } else {
          element.className = 'info_section shadow'
        }
        document.getElementById(`section-up-${index}`).style.display = 'block'
        document.getElementById(`section-down-${index}`).style.display = 'none'
      },
      seriesTypeChange(e) {
        const oldValue = this.baseForm.seriesType
        if (!oldValue) {
          // 首次选择 直接构造模板
          this.constructionSeriesTemplate(e).then(() => {}).catch(() => {
            this.baseForm.seriesType = oldValue
          })
        }
        if (oldValue && oldValue !== e) {
          this.$confirm('此操作将替换信息披露模板并且更改你所填写的模板内容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (e) {
              this.constructionSeriesTemplate(e).then(() => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              }).catch(() => {
                this.baseForm.seriesType = oldValue
              })
            } else {
              this.baseForm.discloseGroupList = []
              this.baseForm.extendList = []
            }
          }).catch(() => {
            this.baseForm.seriesType = oldValue
            this.$message({
              type: 'info',
              message: '已取消'
            });
          })
        }
      },
      // 构造信息披露模板
      async constructionSeriesTemplate(seriesType) {
        // 获取信息披露模板
        await this.getSeriesTemplate(seriesType).then(data => {
          if (data.length === 0) {
            return
          }
          // 获取模板key
          this.getSeriesTemplateKey(seriesType).then(data => {
            this.baseForm.extendList = []
            if (data.result) {
              // 获取显示key
              data.result.map(i => {
                i.isShow && this.baseForm.extendList.push({
                  key: i.replaceKey,
                  keyId: i.Id,
                  title: i.title,
                  replaceTxt: '',
                })
              })
            }
          })
          // 构造披露模板
          this.baseForm.discloseGroupList = []
          data.map((i, index) => {
            this.baseForm.discloseGroupList.push({
              id: i.Id,
              name: i.title,
              sort: i.sort || '1',
              itemList: [],
              showType: i.extend
            })
            if (i.children && i.children.length > 0) {
              i.children.map(j => {
                this.baseForm.discloseGroupList[index].itemList.push({
                  groupId: i.Id,
                  title: j.title,
                  content: j.remark,
                  imgLinkList: [],
                  sort: j.sort || '1'
                })
              })
            }
          })
        })
      },
      // 获取信息披露模板
      getSeriesTemplate(seriesType) {
        return this.getTypeEnum(this.typeEnumUrl, 'bid_template_info', seriesType)
      },
      // 获取信息披露模板key
      getSeriesTemplateKey(seriesType) {
        return this.$request({
          url: this.currentMenuHiddenRunFuncList['O_TEMPLATE_KEY'],
          data: seriesType
        })
      }
    })
  }
</script>

<style lang="scss" scoped>
  .title {
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    color: #2273FF;
    font-weight: 400;
    font-size: 16px;
  }

  .tipText {
    color: rgb(241, 46, 12);
    margin-left: 5px;
    font-size: 14px;
  }

  .icon_class {
    width: 1.5em;
    height: 1.5em;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .icon_class.add {
    fill: #87CC67;
  }

  .icon_class.del {
    fill: #F36D6F;
  }

  .icon_class.up {
    position: absolute;
    top: 10px;
    left: 5px;
  }

  .info_section {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #1D93F5;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 8px;
    position: relative;
    max-height: 2000px;
    transition: all .5s ease;
    opacity: 1;
  }

  .info_section.fold {
    max-height: 70px;
    overflow: hidden;
    opacity: .4;
  }

  .group_item {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #909399;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px 5px 15px 25px;
  }

  .info_action {
    margin-bottom: 5px;
  }

  /deep/.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: none;
  }

  /deep/.custom {
    input {
      &::placeholder {
        color: #606266;
      }
    }
  }

  .searchItem {
    position: relative;

    .searchBox {
      position: absolute;
      top: -50px;
      left: 0;
      width: 400px;
      display: flex;
      flex-direction: column;

      span {
        font-size: 12px;
        color: red;
      }
    }
  }
</style>
