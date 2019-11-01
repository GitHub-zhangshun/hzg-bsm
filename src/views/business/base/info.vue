<template>
  <div class="post-container" style="margin-bottom: 100px;">
    <div class="post-main-container">
      <!-- 表单 -->
      <el-form :model="baseForm" ref="baseForm" :inline="true" size="mini" label-width="70px">
        <el-tabs v-model="tabsName" id="custom_tabs" stretch>
          <el-tab-pane label="基本信息" name="baseInfo">
            <el-tag type="">产品编号: {{baseForm.number}}</el-tag>
            <!-- 产品类型选择 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="产品类型"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">保理机构</span>
                  </template>
                  <el-input :value="baseForm.factoringInfo && baseForm.factoringInfo.enterpriseName" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">助贷机构</span>
                  </template>
                  <el-input :value="baseForm.providerInfo && baseForm.providerInfo.enterpriseName" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">借款人</span>
                  </template>
                  <el-input :value="baseForm.userInfo && (baseForm.userInfo.enterpriseName || baseForm.userInfo.realName)" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">业务类型</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.businessType)" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">产品类型</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.productType)" disabled></el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">风险等级</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.attachInfo && baseForm.attachInfo.riskLevel || '')" disabled></el-input>
                </el-form-item> -->
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">合同模板</span>
                  </template>
                  <el-input v-model="baseForm.contractTemplateName" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="baseForm.treasureCode">
                  <template slot="label">
                    <span class="el-form-item_custom_label">和宝码</span>
                  </template>
                  <el-input v-model="baseForm.treasureCode" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 资金流信息 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="资金流信息"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">还款对象</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.attachInfo && baseForm.attachInfo.allowRefund)" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">放款资金流走向</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.attachInfo && baseForm.attachInfo.loanMoneyFlow)" disabled></el-input>
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
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的名称</span>
                  </template>
                  <el-input v-model="baseForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的金额</span>
                  </template>
                  <el-input v-model="baseForm.money" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">标的期限</span>
                  </template>
                  <el-input v-model="baseForm.count" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">基础利率</span>
                  </template>
                  <el-input v-model="baseForm.rate" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">还款方式</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.repayment)" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">计息方式</span>
                  </template>
                  <el-input :value="getDicTitleById(baseForm.interestType)" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">期数</span>
                  </template>
                  <el-input v-model="baseForm.periods" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">合同编号</span>
                  </template>
                  <el-input v-model="baseForm.contractNum" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">管理费率</span>
                  </template>
                  <el-input :value="baseForm.feeRate+'%'" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">起投金额</span>
                  </template>
                  <el-input v-model="baseForm.limitMin" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">递增金额</span>
                  </template>
                  <el-input v-model="baseForm.increaseMoney" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <span class="el-form-item_custom_label">单笔限额</span>
                  </template>
                  <el-input v-model="baseForm.limitMax" disabled></el-input>
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
                <el-input type="textarea" v-model="baseForm.borrowCause" disabled></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-input type="textarea" v-model="baseForm.pledgeDetail" disabled></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-input type="textarea" v-model="baseForm.repaymentSource" disabled></el-input>
              </el-col>
            </el-row>
            <!-- 产品详细信息 -->
            <el-row>
              <el-col :span="24">
                <h3 class="title">
                  <mallki className="mallki-text" text="产品详细信息"></mallki>
                </h3>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div v-html="baseForm.introduce"></div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="信息披露" name="fkInfo">
            <section class="info_section shadow" :style="section.extend === 'text' ? 'border-top: 2px solid #1D93F5;' : (section.extend === 'img' ? 'border-top: 2px solid #5CBA33;' : 'border-top: 2px solid #E29735;')" v-for="(section, index) in this.baseForm.discloseGroupList" :key="index">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="24">
                  <el-row>
                    <el-col :span="24">
                      <el-input v-model="section.name" size="mini" disabled>
                      </el-input>
                    </el-col>
                  </el-row>
                  <div class="group_item" v-for="(item, indexItem) in section.itemList" :key="indexItem">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="6">
                        <el-input v-model="item.title" size="mini" disabled>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row v-if="item.content">
                      <el-col :span="24">
                        <el-input type="textarea" :rows="3" v-model="item.content" disabled>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row v-if="item.imgLinkList" style="margin-top:1px;">
                      <img @click="showImg(img)" v-for="(img, index) in item.imgLinkList" :key="index" :src="img" width="150px" height="150px;" style="margin:5px 5px 0 0;border-radius:5px;">
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </section>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <el-dialog title="查看图片" :visible.sync="imgDialog" fullscreen>
      <img :src="imgSrc" style="width:100%" alt="" @click="imgDialog = false">
    </el-dialog>
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
  export default {
    components: {
      Mallki,
      Tinymce,
      Sticky,
      MDinput
    },
    async created() {
      // 获取标的详情
      await this.$request({
        url: this.currentMenuHiddenRunFuncList['F_INFO'],
        data: this.$route.query.id
      }).then(data => {
        this.baseForm = data.result
      })
      // 添加滚动监听事件
      window.addEventListener('scroll', this.winScroll)
    },
    destroyed() {
      window.removeEventListener('scroll', this.winScroll)
    },
    data() {
      return {
        baseForm: {
          cast: '暂无数据',
          increasing: '暂无数据',
          singleLimit: '暂无数据',
          parameterList: [{
            name: '',
            sort: '1',
            itemList: [{
              title: '',
              content: '',
              imgContent: '',
              imgContentList: [],
              sort: '1'
            }]
          }]
        },
        tabsName: 'baseInfo',
        imgSrc: '',
        imgDialog: false
      }
    },
    computed: {
      ...mapGetters([
        'baseRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      showImg(img) {
        this.imgDialog = true
        this.imgSrc = img
      },
      // 滚动监听 将tabs的头部固定
      winScroll(e) {
        let element = document.getElementById('custom_tabs')
        let tabsViewTop = this.getElementViewTop(element.childNodes[0])
        if (tabsViewTop < 75) {
          element.className = 'sticky'
        } else {
          element.className = element.className.replace(new RegExp("(\\s|^)" + 'sticky' + "(\\s|$)"), " ")
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
  }

  .icon_class.add {
    fill: #87CC67;
  }

  .icon_class.del {
    fill: #F36D6F;
  }

  .info_section {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #1D93F5;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 8px;
  }

  .group_item {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #909399;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px 5px 15px 25px;
  }

  .shadow {
    -moz-box-shadow: 1px 1px 2px #86838A;
    -webkit-box-shadow: 1px 1px 2px #86838A;
    box-shadow: 1px 1px 2px #86838A;
  }

  .info_action {
    margin-bottom: 5px;
  }
</style>
