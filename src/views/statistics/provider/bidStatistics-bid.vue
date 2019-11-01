<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag type="">当前助贷机构：{{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="dayTime" label="日期">
          <template slot-scope="scope">
            <span>{{getTime(scope.row.dayTime, '{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseNumber" label="发标数量">
        </el-table-column>
        <el-table-column prop="releaseMoney" label="发标金额">
        </el-table-column>
        <el-table-column prop="dealMoney" label="成交金额">
        </el-table-column>
        <el-table-column prop="makeLoanMoney" label="放款金额">
        </el-table-column>
        <el-table-column prop="repaymentMoney" label="已兑付金额">
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="充值金额">
        </el-table-column>
        <el-table-column prop="withdrawalMoney" label="提现金额">
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
  import {
    GetDateStr
  } from '@/utils'

  export default {
    data() {
      return {
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
        searchForm: {
          staTime: GetDateStr(-30),
          endTime: Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)),
          time: [GetDateStr(-30), Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))]
        },
        searchItems: [{
          para: 'time',
          text: '开始时间|结束时间',
          type: 'times',
          clearable: 'false',
          details: {
            type: 'daterange',
            parse: ['staTime', 'endTime']
          }
        }],
        tableListQuery: {
          providerId: this.$route.query.id || '2312'
        }
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
