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

      <!-- dialog 驳回-->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <!-- 驳回 -->
          <el-form-item v-if="dialogType === 'dialogReback'" label-width="0" prop="remark">
            <el-input type="textarea" :rows="5" v-model="dialogBaseForm.remark" placeholder="请输入驳回原因"></el-input>
          </el-form-item>
          <!-- 废弃 -->
          <el-form-item v-if="dialogType === 'dialogDiscard'" label-width="0" prop="remark">
            <el-input type="textarea" :rows="5" v-model="dialogBaseForm.remark" placeholder="请输入废弃原因"></el-input>
          </el-form-item>
          <!-- 定时上标日期 -->
          <el-form-item v-if="dialogType === 'dialogEditTime'" label="定时上标时间" prop="startTime">
            <el-date-picker :picker-options="startTimeOptions" v-model="dialogBaseForm.startTime" type="datetime" default-time="23:59:59" value-format="timestamp" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!-- 募集截止日期 -->
          <el-form-item v-if="dialogType === 'dialogReleaseNow' || dialogType === 'dialogEditTime'" label="募集截止日期" prop="endTime">
            <el-date-picker :picker-options="endTimeOptions" v-model="dialogBaseForm.endTime" type="datetime" default-time="23:59:59" value-format="timestamp" placeholder="选择日期">
            </el-date-picker>
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
  import {
    baseFormRules
  } from '@/business/rules'
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
        dialogBaseStatus: false,
        dialogBaseForm: {
          startTime: new Date(),
          endTime: new Date()
        },
        startTimeOptions: {
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 20 * 24 * 3600 * 1000;
            let threeMonths = curDate + three;
            return time.getTime() < Date.now() - (1 * 24 * 3600 * 1000) || time.getTime() > threeMonths
          }
        },
        endTimeOptions: {
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 20 * 24 * 3600 * 1000;
            let threeMonths = curDate + three;
            return time.getTime() < Date.now() || time.getTime() > threeMonths
          }
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
        }],
        tableItems: {
          name: '标的名称',
          group_bid_time: '标的期限',
          rate: '基础利率',
          format_money: '标的金额',
          enum_repayment: '还款方式',
          group_provider: '助贷机构',
          group_user: '借款人',
          group_userType: '借款人类型',
          enum_productType: '产品类型',
          enum_businessType: '业务类型'
        },
        tableListQuery: {
          realStatus: 'bid_product_real_time_publish' // 标的状态
        },
        dialogType: 'dialogReback', // 弹窗类型
        statusSimplify: ''
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
        this.currentDialogUrl = action.apiUrl
        switch (action.routeUrl) {
          // 修改发布时间
          case 'dialogEditTime':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogBaseForm.startTime = row[0].timeInfo.raiseBegin
            this.dialogBaseForm.endTime = row[0].timeInfo.raiseExpectEnd
            this.dialogType = 'dialogEditTime'
            this.dialogTitle = '修改发布时间'
            this.dialogBaseStatus = true
            this.dialogBaseForm.id = row[0].Id
            break
            // 立即发布
          case 'dialogReleaseNow':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogBaseForm.startTime = null
            this.dialogBaseForm.endTime = row[0].timeInfo.raiseExpectEnd
            this.dialogType = 'dialogReleaseNow'
            this.dialogTitle = '立即发布'
            this.dialogBaseStatus = true
            this.dialogBaseForm.id = row[0].Id
            break
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
                // 验证募集时间>上标时间
                if (this.dialogBaseForm.startTime && this.dialogBaseForm.endTime && this.dialogBaseForm.startTime > this.dialogBaseForm.endTime) {
                  this.$message.error('募集截止时间不能小于定时发布时间')
                  return
                }
                this.$request({
                  url: this.currentDialogUrl,
                  data: {
                    dataId: this.dialogBaseForm.id,
                    remark: this.dialogBaseForm.remark,
                    statusSimplify: this.statusSimplify,
                    endTime: this.dialogBaseForm.endTime,
                    startTime: this.dialogBaseForm.startTime
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
      // 获取标的时间信息
      getBidTimeInfo(bidId) {
        // 获取标的时间信息
        return this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BID_TIME'],
          data: bidId
        })
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
