<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="applicationNo" label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.applicationNo || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="用户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="title" label="类型">
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.amount)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.balance)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investment" label="在投金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.investment)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectIncome" label="预期收益">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.expectIncome)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionAt" label="操作时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.transactionAt && getTime(scope.row.transactionAt, '{y}-{m}-{d} {h}:{i}:{s}') || '---'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="content" label="状态---">
        </el-table-column>
        <el-table-column prop="content" label="备注---">
        </el-table-column> -->
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
    name: 'statistics-user-capital',
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
        searchForm: {},
        searchItems: [{
          para: 'openTime',
          text: '操作时间起|操作时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['operationStartTime', 'operationEndTime']
          }
        }, {
          para: 'typeId',
          text: '类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'fin_capital_type',
            show: this.$route.meta.type === 'borrower' ? ['borrower', 'share'] : ['lender', 'share']
          }
        }, {
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
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
            let days = this.diffTime(this.searchForm.operationStartTime, this.searchForm.operationEndTime)
            if (days > 90) {
              this.$message.error(`请先选择起止时间并进行搜索，时间周期不能超过90天`)
              return
            }
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
              const header_key = ['订单号', '用户姓名', '手机号', '类型', '金额', '账户余额', '在投金额', '预期收益', '操作时间']
              const header_value = ['applicationNo', 'realName', 'phone', 'title', 'amount', 'balance', 'investment', 'expectIncome', 'transactionAt']
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
                        i.transactionAt = i.transactionAt && this.getTime(i.transactionAt)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-出借人资金分析`,
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
