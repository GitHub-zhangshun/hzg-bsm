<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()" :showReset="false">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span>{{getTime(scope.row.daytime, '{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dayTimeStr" label="星期">
        </el-table-column>
        <el-table-column prop="total_assets" label="总资产">
        </el-table-column>
        <el-table-column prop="usable_sum" label="出借人账户余额">
        </el-table-column>
        <el-table-column prop="investment_money" label="在投本金">
        </el-table-column>
        <el-table-column prop="expect_profit" label="预期收益">
        </el-table-column>
        <el-table-column prop="recharge_amount" label="充值金额">
        </el-table-column>
        <el-table-column prop="withdraw_amount" label="提现金额">
        </el-table-column>
        <el-table-column prop="deal_money" label="成交金额">
        </el-table-column>
        <el-table-column prop="loan_money" label="放款金额">
          <template slot-scope="scope">
            <span>{{(scope.row.loan_money === -1 || scope.row.loan_money === null) ? '---' : scope.row.loan_money}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="repayment_money" label="兑付金额">
        </el-table-column>
        <el-table-column prop="repayment_number" label="出借人数">
          <template slot-scope="scope">
            <span>{{(scope.row.repayment_number === -1 || scope.row.repayment_number === null) ? '---' : scope.row.repayment_number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="add_repayment_number" label="新增出借人数">
          <template slot-scope="scope">
            <span>{{(scope.row.add_repayment_number === -1 || scope.row.add_repayment_number === null) ? '---' : scope.row.add_repayment_number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="add_register_number" label="新增注册人数">
        </el-table-column>
        <el-table-column prop="add_open_number" label="新增开户人数">
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
    pickerOptions
  } from '@/business/baseConst'
  import {
    GetDateStr
  } from '@/utils'

  export default {
    name: 'statistics-manage-kpi',
    data() {
      return {
        pickerOptions,
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
          time: [GetDateStr(-15), Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))],
          endTime: Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)),
          staTime: GetDateStr(-15)
        },
        searchItems: [{
          para: 'time',
          text: '开始日期|结束日期',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['staTime', 'endTime']
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
      async func_execute(action, row) {
        switch (action.routeUrl) {
          case 'execute_export':
            // let days = this.diffTime(this.searchForm.staTime, this.searchForm.endTime)
            // if (days > 90) {
            //   this.$message.error('请先选择起止时间并进行搜索，时间周期不能超过90天')
            //   return
            // }
            let count = 0
            await this.$prompt('请输入每份文件的数据量', '每份数据量', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^[1-9]\d*$/,
              inputErrorMessage: '请输入正整数'
            }).then(({
              value
            }) => {
              count = value
            })
            // 获取总条数
            // 拷贝搜索对象
            let searchForm = JSON.parse(JSON.stringify(this.searchForm))
            let total = 0
            this.table.loading = true
            await this.$request({
              url: action.apiUrl,
              data: Object.assign(searchForm || {}, {
                num: 1,
                size: 1
              })
            }).then(data => {
              total = data.total
              this.table.loading = false
            }).catch(() => {
              this.table.loading = false
            })
            // 计算文件数
            const page = Math.ceil(total / count)
            let sure = false
            await this.$confirm(`总共${total}条数据，将按每份文件${count}条数据总共${page}份文件导出，是否继续?`, '导出数据', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              sure = true
            })
            if (sure) {
              this.$message.success('导出中，请稍后......')
              const header_key = ['日期', '星期', '总资产', '出借人账户余额', '在投本金', '预期收益', '充值金额', '提现金额', '成交金额', '放款金额', '兑付金额', '出借人数', '新增出借人数', '新增注册人数', '新增开户人数']
              const header_value = ['daytime', 'dayTimeStr', 'total_assets', 'usable_sum', 'investment_money', 'expect_profit', 'recharge_amount', 'withdraw_amount', 'deal_money', 'loan_money', 'repayment_money', 'repayment_number', 'add_repayment_number', 'add_register_number', 'add_open_number']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count)
                  }
                  let searchData = JSON.parse(JSON.stringify(Object.assign(searchForm || {}, oData)))
                  await this.getExportData({
                    searchData,
                    action,
                    total: this.pageForm.total
                  }).then(data => {
                    try {
                      // 数据格式化
                      data.result.map(i => {
                        i.daytime = i.daytime && this.getTime(i.daytime)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-平台经营KPI`,
                      header_key,
                      header_value,
                      data: data.result,
                      num: index,
                      total: page
                    })
                  }).catch(() => {
                    this.$store.dispatch('setDownProgress', 100)
                    this.$message.error('导出出错或取消，如若数据量过大！请筛选所需导出!')
                  })
                }
              }
            }
            break

          case 'execute_export_service':
            // this.$message.success('导出中，请稍后')
            // this.downloadURI(action.apiUrl)
            window.open(action.apiUrl, '_blank')
            break

          default:
            break;
        }
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
