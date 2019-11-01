<template>
  <el-form class="form-container" :model="form" :inline="true" ref="form" label-width="100px" size="mini">
    <el-card class="box-card" :body-style="{ padding: '5px 20px' }">
      <div class="card-header">
        <slot></slot>
        <el-button-group style="margin-right:5px;">
          <el-button type="success" icon="el-icon-refresh" size="mini" :disabled="disabledSearch" @click="$emit('updateData')">刷新</el-button>
        </el-button-group>
        <el-button-group style="margin-right:5px;" v-if="currentMenuTopRunFuncList.filter(item => item.funcName === 'func_dialog').length > 0">
          <el-button :type="action.cssClass" size="mini" v-for="action in currentMenuTopRunFuncList.filter(item => item.funcName === 'func_dialog')" :key="action.Id" @click="$emit('topAction', action)">{{action.name}}
          </el-button>
        </el-button-group>
        <el-button-group style="margin-right:5px;" v-if="currentMenuTopRunFuncList.filter(item => item.funcName === 'func_execute').length > 0">
          <el-button :type="action.cssClass" size="mini" v-for="action in currentMenuTopRunFuncList.filter(item => item.funcName === 'func_execute')" :key="action.Id" @click="$emit('topAction', action)">{{action.name}}
          </el-button>
        </el-button-group>
        <el-button-group style="margin-right:5px;" v-if="currentMenuTopRunFuncList.filter(item => item.funcName === 'func_jump' || item.funcName === 'func_jump_no_arg').length > 0">
          <el-button :type="action.cssClass" size="mini" v-for="action in currentMenuTopRunFuncList.filter(item => item.funcName === 'func_jump' || item.funcName === 'func_jump_no_arg')" :key="action.Id" @click="$emit('topAction', action)">{{action.name}}
          </el-button>
        </el-button-group>
        <el-button-group v-if="currentMenuTopRunFuncList.filter(item => item.funcName === 'func_del').length > 0">
          <el-button :type="action.cssClass" size="mini" v-for="action in currentMenuTopRunFuncList.filter(item => item.funcName === 'func_del')" :key="action.Id" @click="$emit('topAction', action)">{{action.name}}
          </el-button>
        </el-button-group>
      </div>
      <div class="card-content" v-if="searchItems.length > 0">
        <el-form-item class="search-form-item" v-for="item in searchItems" :key="item.para" :prop="item.para">
          <!-- 文本类型 -->
          <template v-if="item.type === 'text'">
            <el-input :disabled="disabledSearch" v-model="form[item.para]" :clearable="item.clearable === 'false' ? false : true" :key="item.para">
              <template slot="suffix" class="slotClass">{{item.text}}</template>
            </el-input>
          </template>
          <!-- 时间范围类型 -->
          <template v-if="item.type === 'times'">
            <el-date-picker :default-time="['00:00:00', '23:59:59']" :disabled="disabledSearch" v-model="form[item.para]" :clearable="item.clearable === 'false' ? false : true" :type="item.details.type" :key="item.para" align="right" unlink-panels range-separator="至" :start-placeholder="item.text.split('|')[0]" :end-placeholder="item.text.split('|')[1]" :picker-options="pickerOptions" value-format="timestamp">
            </el-date-picker>
          </template>
          <!-- 系统枚举类型 -->
          <template v-if="item.type === 'sys_enum'">
            <ServiceSelect :disabled="disabledSearch" v-model="form[item.para]" :clear="item.clearable === 'false' ? false : true" :placeholder="item.text" :key="item.para" :queryArg="item.details.path" :queryParArg="item.details.parPath" :queryType="item.details.type" :showArg="item.details.show"></ServiceSelect>
          </template>
          <!-- bool枚举类型 -->
          <template v-if="item.type === 'bool_enum'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" :placeholder="item.text" :key="item.para" :clearable="item.clearable === 'false' ? false : true">
              <ElOption :label="item.details.parse[0]" value="true"></ElOption>
              <ElOption :label="item.details.parse[1]" value="false"></ElOption>
            </el-select>
          </template>
          <!-- 自定义枚举类型 -->
          <template v-if="item.type === 'custom_enum'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" :placeholder="item.text" :key="item.para" :clearable="item.clearable === 'false' ? false : true">
              <ElOption v-for="(j, i) in item.details.parse" :key="i" :label="j.label" :value="j.value"></ElOption>
            </el-select>
          </template>
          <!-- 助贷机构模糊查询 -->
          <template v-if="item.type === 'fuzzy_provider'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" filterable remote :placeholder="item.text" :key="item.para" :remote-method="queryProviderAsync" :clearable="item.clearable === 'false' ? false : true" popper-class="search-select">
              <el-option v-for="j in providerList" :key="j.Id" :label="j.enterpriseName" :value="j.Id">
              </el-option>
            </el-select>
          </template>
          <!-- 借款人模糊查询 -->
          <template v-if="item.type === 'fuzzy_borrower'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" filterable remote :placeholder="item.text" :remote-method="queryBorrowerAsync" :clearable="item.clearable === 'false' ? false : true" popper-class="search-select">
              <el-option v-for="j in borrowerList" :key="j.Id" :label="j.enterpriseAttestation?j.enterpriseName:j.realName" :value="j.Id">
                <span style="float: left">{{ j.realName }} {{j.enterpriseName}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ j.enterpriseAttestation ? '企业' : '个人'}}</span>
              </el-option>
            </el-select>
          </template>
          <!-- 省份模糊查询 -->
          <template v-if="item.type === 'fuzzy_province'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" filterable remote :placeholder="item.text" :remote-method="queryProvinceAsync" :clearable="item.clearable === 'false' ? false : true" popper-class="search-select">
              <el-option v-for="j in provinceList" :key="j.Id" :label="`${j.title}${j.suffix}`" :value="j.Id">
              </el-option>
            </el-select>
          </template>
          <!-- 城市模糊查询 -->
          <template v-if="item.type === 'fuzzy_city'">
            <el-select :disabled="disabledSearch" v-model="form[item.para]" filterable remote :placeholder="item.text" :remote-method="queryCityAsync" :clearable="item.clearable === 'false' ? false : true" popper-class="search-select">
              <el-option v-for="j in cityList" :key="j.Id" :label="`${j.title}${j.suffix}`" :value="j.Id">
                <span style="float: left">{{ j.fullName}}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button :disabled="disabledSearch" type="success" size="mini" @click="subSearch">确定</el-button>
        </el-form-item>
        <el-form-item class="search-form-item" v-if="showReset">
          <el-button :disabled="disabledSearch" type="" size="mini" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </div>
    </el-card>
  </el-form>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    _func
  } from '@/business/baseFunc'
  import {
    pickerOptions
  } from '@/business/baseConst'
  export default {
    props: {
      value: {
        type: Object,
        default: function() {
          return {}
        }
      },
      searchItems: {
        type: Array,
        default: function() {
          return []
        }
      },
      showReset: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        pickerOptions,
        form: {},
        initForm: {},
        borrowerList: [], // 借款人列表
        providerList: [], // 助贷机构列表
        provinceList: [], // 省份列表
        cityList: [], // 城市列表
      }
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.value))
      // 保存初始表单
      if (Object.keys(this.initForm).length === 0) {
        this.initForm = JSON.parse(JSON.stringify(this.value))
      }
    },
    watch: {
      form: {
        handler: function(nd) {
          // 解析范围类型时间 item.details.parse[0] 为开始时间 [1]为结束时间
          this.searchItems.forEach(item => {
            if (item.type === 'times') {
              if (nd[item.para] && nd[item.para].length > 0) {
                this.form[item.details.parse[0]] = nd[item.para][0]
                this.form[item.details.parse[1]] = nd[item.para][1]
              } else {
                this.form[item.details.parse[0]] = null
                this.form[item.details.parse[1]] = null
              }
            }
          })
          // this.$emit('input', nd)
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'baseRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList',
        'disabledSearch'
      ])
    },
    methods: Object.assign(_func(), {
      resetForm(formName) {
        // // 重置分页状态
        // window.localStorage.setItem('ResetTablePage', true)
        this.$refs[formName].resetFields()
        this.form = JSON.parse(JSON.stringify(this.initForm))
        // this.$emit('input', this.form)
        // this.$emit('change')
      },
      subSearch() {
        // 重置分页状态
        window.localStorage.setItem('ResetTablePage', true)
        this.$emit('input', JSON.parse(JSON.stringify(this.form)))
        this.$emit('change')
      }
    })
  }
</script>
<style lang="scss" scoped>
</style>
