<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称">
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="investment" label="在投金额">
        </el-table-column>
        <el-table-column prop="freeze" label="冻结金额">
        </el-table-column>
        <el-table-column prop="usable" label="可用金额">
        </el-table-column>
        <el-table-column prop="isOpen" label="存管开户">
          <template slot-scope="scope">
            {{scope.row.isOpen ? '已开户' : '未开户'}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules" label-width="100px">
          <el-form-item label="类型" prop="agree">
            <el-radio v-model="dialogBaseForm.agree" label="true" border>同意注销</el-radio>
            <el-radio v-model="dialogBaseForm.agree" label="false" border>撤回注销</el-radio>
          </el-form-item>
          <el-form-item label="原因" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
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
        dialogBaseForm: {
          isDelay: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        changeType: '', // 选中的类型
        typeList: [], // 类型列表
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '名称',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }],
        tableListQuery: {
          applyStatus: 'work_order_status_apply'
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
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAudit':
            if (row.length !== 1) {
              this.$message.info('请选择数据')
              return
            }
            this.dialogBaseForm.id = row[0].Id
            this.dialogTitle = '注销审核'
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
              if (valid) {
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
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


</style>
