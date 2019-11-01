<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="applicationNo" label="订单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="amt" label="金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.amt) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="outCustNo" label="出账用户名"></el-table-column>
        <el-table-column label="出账用户名称">
          <template slot-scope="scope">
            <span>{{ scope.row.outEnterpriseName || scope.row.outName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inCustNo" label="入账用户名"></el-table-column>
        <el-table-column label="入账用户名称">
          <template slot-scope="scope">
            <span>{{ scope.row.inEnterpriseName || scope.row.inName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="操作时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ getDicTitleById(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
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
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <el-form-item label="划拨金额" prop="amt">
            <el-input v-model="dialogBaseForm.amt" placeholder="请输入划拨金额"></el-input>
          </el-form-item>
          <el-form-item label="出账手机号" prop="outAccount">
            <el-input v-model="dialogBaseForm.outAccount" placeholder="请输入平台注册手机号"></el-input>
          </el-form-item>
          <el-form-item label="入账手机号" prop="inAccount">
            <el-input v-model="dialogBaseForm.inAccount" placeholder="请输入平台注册手机号"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="dialogBaseForm.remarks" placeholder="请输入备注"></el-input>
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
  export default {
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
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'phone',
          text: '手机号',
          type: 'text'
        }, {
          para: 'operaTime',
          text: '开始时间|结束时间',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['operationStarTime', 'operationEndTime']
          }
        }, {
          para: 'status',
          text: '状态',
          type: 'sys_enum',
          details: {
            type: 'statusEnum',
            path: 'fin_order_transfer_status'
          }
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
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'transfer':
            this.dialogTitle = '资金划拨'
            this.dialogBaseStatus = true
            break
          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$refs['dialogBaseForm'].validate((valid) => {
              console.log(valid)
              if (valid) {
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(data => {
                  data.result ? this.$message.success('划拨成功') : this.$message.error(data.message || '未获取到失败信息')
                  this.dialogBaseStatus = false
                  this.getList()
                })
              }
            })
            break

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
</style>
