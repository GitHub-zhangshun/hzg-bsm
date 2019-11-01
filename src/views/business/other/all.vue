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
                    <span>还款日期: {{parseTime(item.time)}}</span>
                  </div>
                  <div class="amount">
                    <span>还款金额: {{numAdd(item.principal, item.interest)}} 元</span>
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
              <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules" size="mini">
                <el-form-item label="日期" prop="date">
                  <el-date-picker v-model="dialogBaseForm.date" type="datetime" default-time="23:59:59" placeholder="请选择日期" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item label="违约金比例 %" prop="damagesProportion">
                  <el-input v-model.number="dialogBaseForm.damagesProportion" placeholder="请输入违约金比例"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>

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
  import BidList from '@/views/components/BidList.vue'
  import {
    parseTime
  } from '@/utils/index'
  import {
    baseFormRules
  } from '@/business/rules'
  export default {
    name: 'bus-other-all',
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
          para: 'realStatus',
          text: '状态',
          type: 'sys_enum',
          details: {
            type: 'statusEnum',
            path: 'bid_product_status_real'
          }
        }],
        tableItems: {
          number: '标识码',
          name: '标的名称',
          group_jx_start: '起息日',
          group_jx_end: '结息日',
          group_periods: '已还期数',
          group_yh_amount: '已还金额',
          group_dh_amount: '待还金额',
          group_bid_time: '标的期限',
          rate: '基础利率',
          format_money: '标的金额',
          group_mj_time: '募集周期',
          multilevelNum_statisticsInfo_investMoney: '已募集金额',
          enum_repayment: '还款方式',
          group_provider: '助贷机构',
          group_user: '借款人',
          enum_realStatus: '标的状态'
        },
        repaymentList: [], // 当前还款计划
        tableListQuery: {
          // realStatus: 'bid_product_real_repayment_finish'
        }
      }
    },
    created() {
      this.getList()
      console.log(this.currentMenuRightRunFuncList)
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
      parseTime,
      // 弹窗事件
      func_dialog(action, row) {
        switch (action.routeUrl) {
          case 'dialogPrepayment':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '设置提前还款'
            this.dialogBaseStatus = true
            this.dialogBaseForm.bidId = row[0].Id
            this.currentDialogUrl = action.apiUrl
            // 获取当前还款计划
            this.$request({
              url: this.currentMenuHiddenRunFuncList['O_REPAYMENT_LIST'],
              data: row[0].Id
            }).then(data => {
              this.repaymentList = data.result
            })
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
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.dialogBaseStatus = false
                  this.getList()
                  this.$message.success('提交成功')
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
      async func_execute(action, row) {
        switch (action.routeUrl) {
          // 签署
          case 'execute_sign':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('是否继续?', '电子合同签署', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.table.loading = true
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                this.table.loading = false
                let res = data.result || []
                let count = res.length
                let successNum = res.filter(item => item === '0').length
                let errorNum = res.filter(item => item !== '0').length
                errorNum === 0 ? this.$notify.success(`应签署${count}份合同，实签署${successNum}份`) : this.$notify.error(`应签署${count}份合同，实签署${successNum}份，${errorNum}份签署失败`)
                this.getList()
              }).catch(() => {
                this.table.loading = false
              })
            })
            break;

            // 放款
          case 'execute_loan':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('确认操作后资金将到达借款人账户, 是否继续?', '标的放款', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.table.loading = true
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                data.result ? this.$message.success('操作成功，请稍后查看') : this.$message.error(data.message || '未获取到失败信息')
                this.table.loading = false
                this.getList()
              }).catch(() => {
                this.table.loading = false
              })
            })
            break

            // 流标
          case 'execute_loss':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('确认操作后资金将退回至出借人账户, 是否继续?', '标的流标', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.table.loading = true
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                data.result ? this.$message.success('操作成功，请稍后查看') : this.$message.error(data.message || '未获取到失败信息')
                this.table.loading = false
                this.getList()
              }).catch(() => {
                this.table.loading = false
              })
            })
            break

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
              const header_key = ['标识码', '标的名称', '起息日', '结息日', '已还期数', '已还金额', '待还金额', '标的期限', '基础利率', '标的金额', '已募集金额', '还款方式', '助贷机构', '借款人', '标的状态']
              const header_value = ['number', 'name', 'jx_time_s', 'jx_time_e', 'yh_periods', 'yh_money', 'dh_money', 'bid_qx', 'rate', 'money', 'ymj_money', 'hk_type', 'enterpriseName', 'borrower', 'status']
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
                        // 起息日
                        i.jx_time_s = i.timeInfo && this.getTime(i.timeInfo.interestBegin, '{y}-{m}-{d}') || '---'
                        // 结息日
                        i.jx_time_e = i.timeInfo && this.getTime(i.timeInfo.interestFinish || i.timeInfo.interestExpectEnd, '{y}-{m}-{d}') || '---'
                        // 已还期数
                        i.yh_periods = `${i.statisticsInfo && i.statisticsInfo.alsoPeriods || 0}/${i.periods} 期`
                        // 已还金额
                        i.yh_money = i.statisticsInfo && this.numAdd(i.statisticsInfo.alsoInterest || 0, i.statisticsInfo.alsoPrincipal || 0, i.statisticsInfo.alsoFee || 0, i.statisticsInfo.alsoDamages || 0) || 0
                        // 待还金额
                        i.dh_money = i.statisticsInfo && this.numAdd(i.statisticsInfo.stayPrincipal || 0, i.statisticsInfo.stayInterest || 0, i.statisticsInfo.stayFee || 0, i.statisticsInfo.stayDamages || 0) || 0
                        // 标的期限
                        i.bid_qx = i.count + (this.getDicObjById(i.interestType) && this.getDicObjById(i.interestType).subhead)
                        // 基础利率
                        i.rate = i.rate + '%'
                        // 已募集金额
                        i.ymj_money = i.statisticsInfo && i.statisticsInfo.investMoney || 0
                        // 还款方式
                        i.hk_type = i.repayment && this.getDicTitleById(i.repayment)
                        // 助贷机构
                        i.enterpriseName = i.providerInfo && i.providerInfo.enterpriseName
                        // 借款人
                        i.borrower = i.userInfo && (i.userInfo.enterpriseName || i.userInfo.realName)
                        // 标的状态
                        i.status = i.realStatus && this.getDicTitleById(i.realStatus)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-所有标的列表`,
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
    font-size: 14px;
    font-weight: 800;
    color: #3794FF;
  }

  .content {
    font-size: 12px;

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
