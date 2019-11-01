<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%;">当前所属: {{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="txnSsn" label="订单号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.txnSsn || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{ getDicTitleById(scope.row.type) || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template slot-scope="scope">
            <span>{{ scope.row.flowType === 'out' ? '-' : '+' }} {{ numberFormat(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operationAt" label="操作时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ getDicTitleById(scope.row.status) || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.remarks || '---' }}</span>
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

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" width="80%">
        <div class="dialogWrapper">
          <div class="order">
            <section>
              <div class="title">
                <h4>订单信息</h4>
              </div>
              <div class="content">
                <div class="item"><span>订单号: {{info.txnSsn}}</span></div>
                <div class="item"><span>类型: {{getDicTitleById(currentRow.type)}}</span></div>
                <div class="item"><span>金额: {{numberFormat(info.amount)}}</span></div>
                <div class="item"><span>手续费: {{numberFormat(info.serviceCharge)}}</span></div>
                <div class="item"><span>可用余额: {{numberFormat(info.balance)}}</span></div>
                <div class="item"><span>操作时间: {{currentRow.operationAt}}</span></div>
                <div class="item"><span>状态: {{getDicTitleById(info.status)}}</span></div>
                <div class="item"><span>备注: {{info.remarks}}</span></div>
              </div>
            </section>
            <section v-if="getDicSimplifyById(currentRow.type) ==='capital_repayment'">
              <div class="title">
                <h4>兑付信息</h4>
              </div>
              <div class="content">
                <!-- <div class="item"><span>出借人手机号: {{info.phone}}</span></div>
                <div class="item"><span>出借人姓名: {{info.lenderName}}</span></div> -->
                <div class="item"><span>标的名称: {{info.bidName}}</span></div>
              </div>
            </section>
            <section v-if="getDicSimplifyById(currentRow.type) ==='capital_repay' || getDicSimplifyById(currentRow.type) ==='capital_transaction'">
              <div class="title">
                <h4>出借信息</h4>
              </div>
              <div class="content">
                <div class="item"><span>出借金额: {{numberFormat(info.amount)}}</span></div>
                <div class="item"><span>标的名称: {{info.bidName}}</span></div>
              </div>
            </section>
            <section v-if="getDicSimplifyById(currentRow.type) ==='capital_recharge' || getDicSimplifyById(currentRow.type) ==='capital_withdraw'">
              <div class="title">
                <h4>银行卡信息</h4>
              </div>
              <div class="content">
                <div class="item"><span>银行名称: {{info.bankName}}</span></div>
                <div class="item"><span>银行卡号: {{info.cardNo}}</span></div>
                <div class="item" v-if="getDicSimplifyById(currentRow.type) ==='capital_withdraw'"><span>提现类型: {{getDicTitleById(info.withdrawType)}}</span></div>
              </div>
            </section>
            <section v-if="getDicSimplifyById(currentRow.type) ==='capital_loan'">
              <div class="title">
                <h4>借款信息</h4>
              </div>
              <div class="content">
                <div class="item"><span>标的名称: {{info.bidName}}</span></div>
                <!-- <div class="item"><span>出借人姓名: {{info.lenderName}}</span></div>
                <div class="item"><span>出借人账号: API无字段</span></div>
                <div class="item"><span>出借时间: {{info.operationAt}}</span></div> -->
              </div>
            </section>
            <section v-if="getDicSimplifyById(currentRow.type) ==='capital_charge'">
              <div class="title">
                <h4>详细信息</h4>
              </div>
              <div class="content">
                <div class="item"><span>标的名称: {{info.bidName}}</span></div>
                <div class="item"><span>出借人姓名: {{info.lenderName}}</span></div>
                <div class="item"><span>时间放款金额: API无此字段</span></div>
              </div>
            </section>
          </div>
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
    parseTime
  } from '@/utils/index'
  import {
    _func
  } from '@/business/baseFunc'
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
        dialogBaseStatus: false,
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
            para: 'operationTime',
            text: '操作开始时间|操作结束时间',
            type: 'times',
            details: {
              type: 'datetimerange',
              parse: ['operationStarTime', 'operationEndTime']
            }
          },
          {
            para: 'type',
            text: '资金类型',
            type: 'sys_enum',
            details: {
              type: 'typeEnum',
              path: 'fin_capital_type',
              show: this.$route.meta.type === 'borrower' ? ['borrower', 'share'] : ['lender', 'share']
            }
          }
        ],
        currentRow: {},
        info: {},
        tableListQuery: {
          userId: this.$route.query.id
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
    watch: {
      'table.list': function(nd) {
        nd.map(i => {
          i.operationAt = i.operationAt && parseTime(i.operationAt)
        })
        this.table.list = nd
      },
      'info': function(nd) {
        nd.operationAt = nd.operationAt && parseTime(nd.operationAt)
        this.info = nd
      },
    },
    methods: Object.assign(_func(), {
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogInfo':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '资金详情'
            this.dialogBaseStatus = true
            this.currentRow = row[0]
            // 获取资金详情
            this.$request({
              url: action.apiUrl,
              data: {
                closeSecrecy: true,
                id: row[0].Id
              }
            }).then(data => {
              this.info = data.result || []
            })
            break

          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$request({
              url: this.currentDialogUrl,
              data: this.dialogBaseForm
            }).then(() => {
              this.dialogBaseStatus = false
              this.getList()
            })
            break

          default:
            break
        }
      },
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
              const header_key = ['订单号', '类型', '金额', '余额', '操作时间', '状态', '备注']
              const header_value = ['txnSsn', 'type', 'amount', 'balance', 'operationAt', 'status', 'remarks']
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
                        i.type = i.type && this.getDicTitleById(i.type)
                        i.status = i.status && this.getDicTitleById(i.status)
                        i.operationAt = i.operationAt && this.getTime(i.operationAt)
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-出借人资金记录`,
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

  section {
    margin-bottom: 10px;

    .title {
      border: 1px solid #ccc;
      padding: 5px;
      -webkit-box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
      -moz-box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
      box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
      border-radius: 4px;

      h4 {
        color: #3794FF;
        margin: 0;
      }
    }

    .content {
      border: 1px dashed #ccc;
      border-top: none;
      padding: 30px 10px 10px 10px;
      font-size: 14px;
      color: #909399;
      display: flex;
      flex-wrap: wrap;

      .row {
        margin-bottom: 5px;
      }

      .item {
        margin: 0 0 10px 20px;
      }
    }
  }
</style>
