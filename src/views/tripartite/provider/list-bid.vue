<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag type="" style="width:100%">当前助贷机构: {{this.$route.query.name}}</el-tag>
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
  import BidList from '@/views/components/BidList.vue'
  export default {
    name: 'tripartite-provider-list-item-bid',
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
          name: '标的名称',
          group_bid_time: '标的期限',
          multilevelTime_timeInfo_publish: '发布时间',
          rate: '基础利率',
          format_money: '标的金额',
          enum_repayment: '还款方式',
          enum_businessType: '业务类型',
          group_provider: '助贷机构',
          group_user: '借款人',
          group_userType: '借款人类型',
          enum_productType: '产品类型',
          enum_realStatus: '标的状态'
        },
        tableListQuery: {
          providerId: this.$route.query.id
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
          case 'dialogAudit':
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
            let url = this.dialogBaseForm.status === 'true' ? this.currentMenuHiddenRunFuncList['O_AUDIT_SUCCESS'] : this.currentMenuHiddenRunFuncList['O_AUDIT_FAIL']
            this.$request({
              url,
              data: this.dialogBaseForm
            }).then(() => {
              this.dialogBaseStatus = false
              this.getList()
              this.$message.success('提交成功')
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
                providerId: this.$route.query.id
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
                    size: parseInt(count),
                    providerId: this.$route.query.id
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
                        i.jx_time_s = this.getTime(i.timeInfo.interestBegin, '{y}-{m}-{d}') || '---'
                        // 结息日
                        i.jx_time_e = this.getTime(i.timeInfo.interestFinish || i.timeInfo.interestExpectEnd, '{y}-{m}-{d}') || '---'
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
                      title: `${index+1}-和掌柜-${this.$route.query.name}标的列表`,
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
