<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

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
                  <el-date-picker type="datetime" default-time="23:59:59" v-model="dialogBaseForm.date" placeholder="请选择日期"></el-date-picker>
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
    name: 'bus-other-repaymentFull',
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
        },{
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
          group_periods: '已还期数',
          group_yh_amount: '已还金额',
          group_dh_amount: '待还金额',
          group_bid_time: '标的期限',
          rate: '基础利率',
          format_money: '标的金额',
          enum_repayment: '还款方式',
          group_provider: '助贷机构',
          group_user: '借款人'
        },
        repaymentList: [], // 当前还款计划
        tableListQuery: {
          realStatus: 'bid_product_real_repayment_finish'
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
