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

      <!-- dialog 废弃-->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <!-- 废弃 -->
          <el-form-item label-width="0" prop="remark">
            <el-input type="textarea" :rows="5" v-model="dialogBaseForm.remark" placeholder="请输入废弃原因"></el-input>
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
    baseFormRules
  } from '@/business/rules'
  import BidList from '@/views/components/BidList.vue'
  export default {
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
          name: '标的名称',
          group_bid_time: '标的期限',
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
        clickCount: 0,
        dialogBaseStatus: false,
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
      }
    },
    created() {
      this.getList()
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
      // 通用执行
      func_execute(action, row) {
        switch (action.routeUrl) {
          case 'commit_first_audit': // 提交初审
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              if (this.clickCount > 2) {
                this.$message.error('鸭鸭鸭鸭~~别点啦')
                this.clickCount = 0
                return
              }
              if (this.getDicObjById(row[0].realStatus).simplify !== 'bid_product_real_edit') {
                this.$message.error('请重新编辑后再提交审核')
                this.clickCount++
                return
              }
              this.$confirm('是否提交初审?', '提交初审', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$request({
                  url: action.apiUrl,
                  data: {
                    dataId: row[0].Id,
                    statusSimplify: 'bid_product_real_audit_first'
                  }
                }).then(() => {
                  this.getList()
                  this.$message.success('提交成功')
                })
              })
              break
            }

          default:
            break
        }
      },
      // 弹窗事件
      func_dialog(action, row) {
        this.currentDialogUrl = action.apiUrl
        switch (action.routeUrl) {
          // 废弃
          case 'dialogDiscard':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogType = 'dialogDiscard'
            this.dialogTitle = '废弃'
            this.dialogBaseStatus = true
            this.dialogBaseForm.id = row[0].Id
            this.statusSimplify = 'bid_product_real_discard'
            break
          default:
            break
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
                  data: {
                    dataId: this.dialogBaseForm.id,
                    remark: this.dialogBaseForm.remark,
                    statusSimplify: this.statusSimplify
                  }
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
        this.dialogBaseForm = {
          startTime: new Date(),
          endTime: new Date()
        }
        this.$refs.dialogBaseForm.resetFields()
      },
    })
  }
</script>
