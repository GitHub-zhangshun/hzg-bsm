<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>


      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="providerName" label="助贷机构" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="releaseNumber" label="发标总数量">
        </el-table-column>
        <el-table-column prop="releaseMoney" label="发标总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.releaseMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dealMoney" label="成交总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.dealMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="makeLoanMoney" label="放款总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.makeLoanMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="waitRepaymentMoney" label="待兑付总额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.waitRepaymentMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="repaymentMoney" label="已兑付总额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.repaymentMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="充值总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.rechargeMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawalMoney" label="提现总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.withdrawalMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    _func
  } from '@/business/baseFunc'

  export default {
    name: 'statistics-provider-bidStatistics',
    data() {
      return {
        providerList: [], // 助贷机构列表
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        pageForm: {
          total: 0,
          num: 1,
          size: 10
        },
        dialogBaseStatus: false,
        dialogBaseForm: {
          isDelay: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'providerId',
          text: '助贷机构',
          type: 'fuzzy_provider'
        }, {
          para: 'time',
          text: '开始时间|结束时间',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['staTime', 'endTime']
          }
        }, {
          para: 'isHot',
          text: '类型',
          type: 'custom_enum',
          details: {
            parse: [{
              label: '常用',
              value: 'true'
            }, {
              label: '所有',
              value: 'false'
            }]
          }
        }]
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {

    })
  }
</script>

<style lang="scss" scoped>


</style>
