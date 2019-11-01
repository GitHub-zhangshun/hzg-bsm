<template>
  <el-table stripe @row-dblclick="pitchRow" ref="table" :data="list" border style="width: 100%;margin-top:5px;" v-loading="loading" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" fixed="left">
    </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="table-expand">
          <el-form-item label="已还本金">
            <span>{{ props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.alsoPrincipal) || '---'}}</span>
          </el-form-item>
          <el-form-item label="待还本金">
            <span>{{ (props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.stayPrincipal)) || (props.row.repayPlan && numberFormat(props.row.repayPlan.principal)) || '---'}}</span>
          </el-form-item>
          <el-form-item label="已还利息">
            <span>{{ props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.alsoInterest) || '---'}}</span>
          </el-form-item>
          <el-form-item label="待还利息">
            <span>{{ (props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.stayInterest)) || (props.row.repayPlan && numberFormat(props.row.repayPlan.interest)) || '---'}}</span>
          </el-form-item>
          <el-form-item label="已还违约金 ">
            <span>{{ props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.alsoDamages) || '---'}}</span>
          </el-form-item>
          <el-form-item label="待还违约金">
            <span>{{ (props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.stayDamages)) || (props.row.repayPlan && numberFormat(props.row.repayPlan.damages)) || '---'}}</span>
          </el-form-item>
          <el-form-item label="已收管理费">
            <span>{{ props.row.moneyInfo && numberFormat(props.row.moneyInfo.feeAmt) || '---'}}</span>
          </el-form-item>
          <!-- <el-form-item label="待还管理费 ">
            <span>{{ (props.row.statisticsInfo && numberFormat(props.row.statisticsInfo.stayFee)) || (props.row.repayPlan && numberFormat(props.row.repayPlan.serviceCharge)) || '---'}}</span>
          </el-form-item> -->
        </el-form>
      </template>
    </el-table-column>
    <el-table-column v-for="(key, index) in Object.keys(tableItems)" :key="index" :label="tableItems[key]" :prop="key" show-overflow-tooltip>
      <template slot-scope="scope">
        <!-- 枚举类型 -->
        <span v-if="key.indexOf('enum_') > -1">
          {{ scope.row[key.split('_')[1]] && getDicTitleById(scope.row[key.split('_')[1]]) || '---' }}
        </span>

        <!-- bool类型 -->
        <span v-else-if="key.indexOf('bool_') > -1">
          {{scope.row[key.split('_')[1]] ? '是' : '否'}}
        </span>

        <!-- 多级取值类型 -->
        <span v-else-if="key.indexOf('multilevel_') > -1">
          {{scope.row[key.split('_')[1]] && scope.row[key.split('_')[1]][key.split('_')[2]] || '---'}}
        </span>

        <!-- 多级取值&金额格式化 -->
        <span v-else-if="key.indexOf('multilevelNum_') > -1">
          {{scope.row[key.split('_')[1]] && numberFormat(scope.row[key.split('_')[1]][key.split('_')[2]]) || '---'}}
        </span>

        <!-- 多级取值&时间转换 -->
        <span v-else-if="key.indexOf('multilevelTime_') > -1">
          {{scope.row[key.split('_')[1]] && scope.row[key.split('_')[1]][key.split('_')[2]] && getTime(scope.row[key.split('_')[1]][key.split('_')[2]], key.split('_')[3]  === 'format' ? '{y}-{m}-{d}' : '') || '---'}}
        </span>

        <!-- 多级取值&枚举转换 -->
        <span v-else-if="key.indexOf('multilevelEnum_') > -1">
          {{scope.row[key.split('_')[1]] && scope.row[key.split('_')[1]][key.split('_')[2]] && getDicTitleById(scope.row[key.split('_')[1]][key.split('_')[2]]) || '---'}}
        </span>

        <!-- 外层时间转换 -->
        <span v-else-if="key.indexOf('time_') > -1">
          {{scope.row[key.split('_')[1]] && getTime(scope.row[key.split('_')[1]]) || '---'}}
        </span>

        <!-- 组合类型 -->
        <!-- 助贷机构 -->
        <span v-else-if="key === 'group_provider'">
          {{scope.row.providerInfo && scope.row.providerInfo.enterpriseName || '---'}}
        </span>
        <!-- 借款人 -->
        <span v-else-if="key === 'group_user'">
          {{scope.row.userInfo && (scope.row.userInfo.enterpriseName || scope.row.userInfo.realName) || '---'}}
        </span>
        <!-- 借款人类型 -->
        <span v-else-if="key === 'group_userType'">
          {{scope.row.isEnterprise ? '企业' : '个人'}}
        </span>
        <!-- 标的期限 -->
        <span v-else-if="key === 'group_bid_time'">
          {{scope.row.count && `${scope.row.count} ${scope.row.interestType && getDicObjById(scope.row.interestType) && getDicObjById(scope.row.interestType).subhead || '---'}` || '---'}}
        </span>
        <!-- 募集周期 -->
        <span v-else-if="key === 'group_mj_time'">
          {{getTime(scope.row.timeInfo && scope.row.timeInfo.raiseBegin) || '---'}} 至 {{getTime(scope.row.timeInfo && (scope.row.timeInfo.raiseComplete || scope.row.timeInfo.raiseExpectEnd)) || '---'}}
        </span>
        <!-- 计息周期 -->
        <span v-else-if="key === 'group_jx_time'">
          {{getTime(scope.row.timeInfo && scope.row.timeInfo.interestBegin)}} 至 {{getTime(scope.row.timeInfo && (scope.row.timeInfo.interestFinish || scope.row.timeInfo.interestExpectEnd))}}
        </span>
        <!-- 起息日 -->
        <span v-else-if="key === 'group_jx_start'">
          {{getTime(scope.row.timeInfo && scope.row.timeInfo.interestBegin, '{y}-{m}-{d}') || '---'}}
        </span>
        <!-- 结息日 -->
        <span v-else-if="key === 'group_jx_end'">
          {{getTime(scope.row.timeInfo && (scope.row.timeInfo.interestFinish || scope.row.timeInfo.interestExpectEnd), '{y}-{m}-{d}') || '---'}}
        </span>
        <!-- 计息周期  还款计划专用-->
        <span v-else-if="key === 'group_jx_repay_time'">
          {{getTime(scope.row.repayPlan && scope.row.repayPlan.interestStart)}} 至 {{getTime(scope.row.repayPlan && scope.row.repayPlan.interestEnd)}}
        </span>
        <!-- 起息日  还款计划专用-->
        <span v-else-if="key === 'group_jx_repay_start'">
          {{getTime(scope.row.repayPlan && scope.row.repayPlan.interestStart, '{y}-{m}-{d}') || '---'}}
        </span>
        <!-- 结息日  还款计划专用-->
        <span v-else-if="key === 'group_jx_repay_end'">
          {{getTime(scope.row.repayPlan && scope.row.repayPlan.interestEnd, '{y}-{m}-{d}') || '---'}}
        </span>
        <!-- 应还金额  还款计划专用-->
        <span v-else-if="key === 'group_yh_money'">
          {{scope.row.repayPlan && numberFormat(numAdd(scope.row.repayPlan.principal || 0,scope.row.repayPlan.interest || 0,scope.row.repayPlan.damages || 0)) || '---'}}
        </span>
        <!-- 还款周期 -->
        <span v-else-if="key === 'group_hk_time'">
          {{scope.row.timeInfo && getTime(scope.row.timeInfo.refundBegin, '{y}-{m}-{d}') || '---'}} 至 {{scope.row.timeInfo && getTime(scope.row.timeInfo.refundFinish || scope.row.timeInfo.refundExpectEnd, '{y}-{m}-{d}') || '---'}}
        </span>
        <!-- 已还期数 -->
        <span v-else-if="key === 'group_periods'">
          {{scope.row.statisticsInfo && scope.row.statisticsInfo.alsoPeriods || 0}}/{{scope.row.statisticsInfo && scope.row.statisticsInfo.totalPeriods || scope.row.periods || 0}} 期
        </span>
        <!-- 已还金额 -->
        <span v-else-if="key === 'group_yh_amount'">
          {{scope.row.statisticsInfo && numberFormat(numAdd(scope.row.statisticsInfo.alsoInterest || 0, scope.row.statisticsInfo.alsoPrincipal || 0, scope.row.statisticsInfo.alsoFee || 0, scope.row.statisticsInfo.alsoDamages || 0)) || '---'}} 元
        </span>
        <!-- 待还金额 -->
        <span v-else-if="key === 'group_dh_amount'">
          {{scope.row.statisticsInfo && numberFormat(numAdd(scope.row.statisticsInfo.stayPrincipal || 0, scope.row.statisticsInfo.stayInterest || 0, scope.row.statisticsInfo.stayFee || 0, scope.row.statisticsInfo.stayDamages || 0)) || '---'}} 元
        </span>
        <!-- 标的 格式化金额 -->
        <span v-else-if="key.indexOf('format_') > -1">
          {{ numberFormat(scope.row[key.split('_')[1]]) }}
        </span>
        <!-- 标的利率 -->
        <span v-else-if="key === 'rate'">
          {{numAdd(scope.row.rate || 0)}} %
        </span>
        <!-- 其他 -->
        <span v-else>
          {{scope.row[key] || '---'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="actionList.length > 0" label="操作">
      <template slot-scope="scope">
        <el-button type="text" v-for="action in actionList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import {
    _func
  } from '@/business/baseFunc'
  import {
    parseTime
  } from '@/utils/index'
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      },
      actionList: {
        type: [Array, Object],
        default: []
      },
      tableItems: {
        type: Object
      }
    },
    data() {
      return {

      }
    },
    methods: Object.assign(_func(), {
      handleSelectionChange(e) {
        this.$emit('input', e)
      }
    })
  }
</script>
<style lang="scss" scoped>
  .table-expand {
    font-size: 12px;
  }
</style>
