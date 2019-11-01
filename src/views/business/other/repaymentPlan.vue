<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <BidList v-model="table.tableChangeList" :list="table.list" :loading="table.loading" :actionList="currentMenuRightRunFuncList" :tableItems="tableItems"></BidList>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="审核结果" prop="status">
            <el-select v-model="dialogBaseForm.status" placeholder="">
              <el-option label="同意" value="true"></el-option>
              <el-option label="拒绝" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark">
            <el-input type="textarea" :rows="5" v-model="dialogBaseForm.remark" placeholder="请输入审核意见"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
        </div>
      </el-dialog>
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
    parseTime
  } from '@/utils/index'
  import BidList from '@/views/components/BidList.vue'
  export default {
    name: 'bus-other-repaymentPlan',
    components: {
      BidList
    },
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
        dialogBaseStatus: false,
        dialogBaseForm: {
          status: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '标的名称',
          type: 'text'
        }, {
          para: 'repayStatus',
          text: '还款状态',
          type: 'sys_enum',
          details: {
            type: 'statusEnum',
            path: 'fin_repay_plan_status'
          }
        }, {
          para: 'businessType',
          text: '业务类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'bid_business_type'
          }
        }, {
          para: 'productType',
          text: '产品类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'bid_info_type'
          }
        }, {
          para: 'providerId',
          text: '助贷机构',
          type: 'fuzzy_provider'
        }, {
          para: 'userId',
          text: '借款人',
          type: 'fuzzy_borrower'
        }, {
          para: 'repayTime',
          text: '还款时间起|还款时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['repayStartTime', 'repayEndTime']
          }
        }],
        tableItems: {
          number: '标识码',
          name: '标的名称',
          multilevelTime_repayPlan_actualTime: '实际还款时间',
          multilevelEnum_repayPlan_status: '还款状态',
          group_jx_repay_start: '起息日',
          group_jx_repay_end: '结息日',
          multilevelTime_repayPlan_time_format: '还款日期',
          multilevel_repayPlan_currentNum: '当前期数',
          group_yh_money: '应还金额',
          bool_isPrepayment: '是否提前还款',
          format_money: '标的金额',
          multilevel_moneyInfo_makeLoan: '放款金额',
          group_provider: '助贷机构',
          group_user: '借款人',
        },
        tableListQuery: {
          // repayStatus: 'repay_plan_waiting'
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
      // 弹窗事件
      func_dialog(action, row) {
        switch (action.routeUrl) {
          case 'dialogRecheck':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '审核'
            this.dialogBaseStatus = true
            this.dialogBaseForm.id = row[0].Id
            break;

          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            let url = this.dialogBaseForm.status === 'true' ? this.currentMenuHiddenRunFuncList['O_RECHECK_SUCCESS'] : this.currentMenuHiddenRunFuncList['O_RECHECK_FAIL']
            this.$request({
              url,
              data: this.dialogBaseForm
            }).then(() => {
              this.dialogBaseStatus = false
              this.getList()
            })
            break;

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          status: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      // 带参数基础路由跳转事件 ==> 重置公共方法
      func_jump(action, row) {
        if (row.length !== 1) {
          this.$message.info('请选择一条数据')
          return
        }
        // 构建跳转参数
        let id = action.routeUrl === 'bus-other-repaymentPlan-item-paymentPlan' ? row[0].Id : row[0].bidId
        const query = {
          id,
          name: row[0].title || row[0].name || row[0].bidName || row[0].enterpriseName || row[0].realName
        }
        this.$router.push({
          name: action.routeUrl,
          query
        })
      },
      // 通用执行
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
                repayStatus: "repay_plan_waiting"
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
              const header_key = ['标识码', '标的名称', '还款状态', '起息日', '结息日', '还款时间', '当前期数', '应还金额', '是否提前还款', '标的金额', '放款金额', '助贷机构', '借款人']
              const header_value = ['number', 'name', 'repayStatus', 'jx_time_s', 'jx_time_e', 'hk_time', 'currentNum', 'yh_money', 'isPrepayment', 'money', 'fk_money', 'providerName', 'borrowerName']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count),
                    repayStatus: "repay_plan_waiting"
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
                        i.repayStatus = i.repayPlan && this.getDicTitleById(i.repayPlan.status)
                        // 起息日
                        i.jx_time_s = i.repayPlan && this.getTime(i.repayPlan.interestStart, '{y}-{m}-{d}') || '---'
                        // 结息日
                        i.jx_time_e = i.repayPlan && this.getTime(i.repayPlan.interestEnd, '{y}-{m}-{d}') || '---'
                        i.hk_time = i.repayPlan && this.getTime(i.repayPlan.time)
                        i.currentNum = i.repayPlan && i.repayPlan.currentNum
                        i.yh_money = i.repayPlan && this.numAdd(i.repayPlan.principal || 0, i.repayPlan.interest || 0, i.repayPlan.damages || 0)
                        i.isPrepayment = i.isPrepayment ? '提前还款' : '正常还款'
                        i.fk_money = i.moneyInfo && i.moneyInfo.makeLoan
                        i.providerName = i.providerInfo && i.providerInfo.enterpriseName
                        i.borrowerName = i.userInfo && (i.userInfo.enterpriseName || i.userInfo.realName)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-还款计划列表`,
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
  .search-form-item {
    padding: 0;
    margin: 0;
  }
</style>
