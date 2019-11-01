<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>
      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" border ref="table" :data="table.list" style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="applicationNo" label="流水号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="lenderRealName" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="lenderPhone" label="电话" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="number" label="标的标识" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bidName" label="标的名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="productType" label="标的类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.productType)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="repayment" label="还款方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.repayment)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总额">
          <template slot-scope="scope">
            <span>{{numAdd(scope.row.principal, scope.row.interest, scope.row.damages, scope.row.increaseInterest)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="本金">
        </el-table-column>
        <el-table-column prop="interest" label="利息">
        </el-table-column>
        <el-table-column label="加息">
          <template slot-scope="scope">
            <span>{{ scope.row.increaseInterest || 0 }}</span>
            <span v-if="scope.row.increaseInterest">({{ scope.row.increaseRate }} %)</span>
          </template>
        </el-table-column>
        <el-table-column prop="damages" label="违约金">
          <template slot-scope="scope">
            <span>{{scope.row.damages || 0}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="serviceCharge" label="管理费">
          <template slot-scope="scope">
            <span>{{scope.row.serviceCharge || 0}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="currentNum" label="当前期数">
        </el-table-column>
        <el-table-column prop="time" label="回款日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.time, '{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="providerName" label="助贷机构" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="借款人" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.borrowerEnterpriseName || scope.row.borrowerName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.type)}}</span>
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
    name: 'statistics-user-paymentPlan',
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
          para: 'phone',
          text: '手机',
          type: 'text'
        }, {
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'bidName',
          text: '标的名称',
          type: 'text'
        }, {
          para: 'operationTime',
          text: '操作开始时间|操作结束时间',
          type: 'times',
          details: {
            type: 'datetimerange',
            parse: ['operationStarTime', 'operationEndTime']
          }
        }, {
          para: 'productType',
          text: '标的类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'bid_info_type'
          }
        }, {
          para: 'status',
          text: '状态',
          type: 'sys_enum',
          details: {
            type: 'statusEnum',
            path: 'fin_repayment_plan_status'
          }
        }],
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
                size: 1,
                userId: this.$route.query.id
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
              const header_key = ['流水号', '姓名', '电话', '标的标识', '标的名称', '标的类型', '还款方式', '总额', '本金', '利息', '加息','违约金', '当前期数', '回款日期', '助贷机构', '借款人', '状态', '类型']
              const header_value = ['applicationNo', 'lenderRealName', 'lenderPhone', 'number', 'bidName', 'productType', 'repayment', 'ze', 'principal', 'interest', 'increaseInterest', 'damages', 'currentNum', 'time', 'providerName', 'borrowerName', 'status', 'type']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count),
                    userId: this.$route.query.id
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
                        i.productType = i.productType && this.getDicTitleById(i.productType)
                        i.repayment = i.repayment && this.getDicTitleById(i.repayment)
                        i.ze = this.numAdd(i.principal, i.interest, i.damages, i.increaseInterest)
                        i.time = i.time && this.getTime(i.time, '{y}-{m}-{d}')
                        i.borrowerName = i.borrowerEnterpriseName || i.borrowerName || '---'
                        i.type = i.type && this.getDicTitleById(i.type)
                        i.status = i.status && this.getDicTitleById(i.status)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-出借人回款计划`,
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


          default:
            break;
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
