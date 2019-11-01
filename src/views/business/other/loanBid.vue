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
        <el-row>
          <el-col :span="12">
            <div class="title">
              <span>当前还款计划表</span>
            </div>
            <div class="content">
              <ul>
                <li v-for="item in repaymentList" :key="item.Id">
                  <div class="num">
                    <span>{{item.currentNum}}/{{item.totalNum}} 期</span>
                    <span>{{getDicTitleById(item.status)}}</span>
                  </div>
                  <div class="time">
                    <span>还款日期: {{getTime(item.time)}}</span>
                  </div>
                  <div class="amount">
                    <span>还款金额: {{numAdd(item.principal || 0, item.interest || 0)}} 元</span>
                    <span>(本金: {{item.principal}} 利息: {{item.interest}})</span>
                  </div>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="title">
              <span>设置提前还款</span>
            </div>
            <div style="padding:16px;">
              <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" size="mini">
                <el-form-item label="日期" prop="time">
                  <el-date-picker :picker-options="pickerOptions" type="datetime" default-time="23:59:59" v-model="dialogBaseForm.time" placeholder="请选择日期" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-form-item label="违约金比例">
                  <el-input v-model.number="dialogBaseForm.money" placeholder="请输入违约金比例">
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')" :loading="dialogLoading">确 定</el-button>
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
    baseFormRules
  } from '@/business/rules.js'
  import BidList from '@/views/components/BidList.vue'
  export default {
    name: 'bus-other-loanBid',
    components: {
      BidList
    },
    data() {
      return {
        baseFormRules,
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
        pickerOptions: {
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 20 * 24 * 3600 * 1000;
            let threeMonths = curDate + three;
            return time.getTime() < Date.now() - (1 * 24 * 3600 * 1000) //|| time.getTime() > threeMonths
          }
        },
        dialogLoading: false,
        dialogBaseForm: {},
        dialogBaseStatus: false,
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '标的名称',
          type: 'text'
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
        }],
        tableItems: {
          number: '标识码',
          name: '标的名称',
          group_jx_start: '起息日',
          group_jx_end: '结息日',
          group_hk_time: '还款周期',
          group_periods: '已还期数',
          group_yh_amount: '已还金额',
          group_dh_amount: '待还金额',
          bool_isPrepayment: '是否提前还款',
          format_money: '标的金额',
          multilevel_moneyInfo_makeLoan: '放款金额',
          group_provider: '助贷机构',
          group_user: '借款人',
        },
        repaymentList: [],
        tableListQuery: {
          realStatus: 'bid_product_real_repayment_underway'
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
          case 'dialogPrepayment':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            // 获取当前还款计划
            this.$request({
              url: this.currentMenuHiddenRunFuncList['O_REPAYMENT_LIST'],
              data: row[0].Id
            }).then(data => {
              this.repaymentList = data.result
            })
            this.dialogTitle = '设置提前还款'
            this.dialogBaseForm.dataId = row[0].Id
            this.currentDialogUrl = action.apiUrl
            this.dialogBaseStatus = true
            break;

          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                this.dialogBaseForm.money = this.dialogBaseForm.money || '0'
                this.$confirm(`提前时间：${this.getTime(this.dialogBaseForm.time)}
                违约金比例：${this.dialogBaseForm.money || '0'} %, 是否继续?`, '设置提前还款', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.dialogLoading = true
                  this.$request({
                    url: this.currentDialogUrl,
                    data: this.dialogBaseForm
                  }).then(() => {
                    this.dialogBaseStatus = false
                    this.dialogLoading = false
                    this.getList()
                    this.$message.success('提交成功')
                  }).catch(() => {
                    this.dialogLoading = false
                  })
                })
              }
            })
            break;

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {}
        this.$refs.dialogBaseForm.resetFields()
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
                realStatus: 'bid_product_real_repayment_underway'
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
              const header_key = ['标识码', '标的名称', '起息日', '结息日', '还款周期', '已还期数', '已还金额', '待还金额', '是否提前还款', '标的金额', '放款金额', '助贷机构', '借款人']
              const header_value = ['number', 'name', 'jx_time_s', 'jx_time_e', 'hk_time', 'yh_periods', 'yh_money', 'dh_money', 'isPrepayment', 'money', 'fk_money', 'providerName', 'borrowerName']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count),
                    realStatus: 'bid_product_real_repayment_underway'
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
                        // 起息日
                        i.jx_time_s = i.timeInfo && this.getTime(i.timeInfo.interestBegin, '{y}-{m}-{d}') || '---'
                        // 结息日
                        i.jx_time_e = i.timeInfo && this.getTime(i.timeInfo.interestFinish || i.timeInfo.interestExpectEnd, '{y}-{m}-{d}') || '---'
                        i.hk_time = i.timeInfo && `${this.getTime(i.timeInfo.refundBegin)}-${this.getTime(i.timeInfo.refundFinish || i.timeInfo.refundExpectEnd)}`
                        i.yh_periods = `${i.statisticsInfo && i.statisticsInfo.alsoPeriods || 0}/${i.periods} 期`
                        i.yh_money = i.statisticsInfo && this.numAdd(i.statisticsInfo.alsoInterest || 0, i.statisticsInfo.alsoPrincipal || 0, i.statisticsInfo.alsoFee || 0, i.statisticsInfo.alsoDamages || 0) || 0
                        i.dh_money = i.statisticsInfo && this.numAdd(i.statisticsInfo.stayPrincipal || 0, i.statisticsInfo.stayInterest || 0, i.statisticsInfo.stayFee || 0, i.statisticsInfo.stayDamages || 0) || 0
                        i.isPrepayment = i.isPrepayment ? '提前还款' : '正常还款'
                        i.fk_money = i.moneyInfo && i.moneyInfo.makeLoan
                        i.providerName = i.providerInfo && i.providerInfo.enterpriseName
                        i.borrowerName = i.userInfo && (i.userInfo.enterpriseName || i.userInfo.realName)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-还款中标的列表`,
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

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .title {
    font-size: 16px;
    font-weight: 800;
    color: #3794FF;
  }

  .content {
    font-size: 16px;

    li {
      padding: 5px;
    }

    .num {
      span:last-child {
        color: #3794FF;
        margin-left: 150px;
      }
    }

    .amount {
      border-bottom: 1px solid #ccc;
    }
  }
</style>
