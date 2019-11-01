<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" @cell-click="openErrorDialog" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isSolve?'已解决' : '未解决'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ip" label="IP">
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="状态" prop="isSolve">
            <el-select v-model="dialogBaseForm.isSolve" placeholder="请选择">
              <el-option label="已解决" value="true"></el-option>
              <el-option label="未解决" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- error log -->
      <el-dialog :close-on-click-modal="false" title="Error Log" :visible.sync="dialogErrorStatus" @close="currentErrorInfo = []" width="80%">
        <el-table stripe :data="currentErrorInfo" border>
          <el-table-column label="Message">
            <template slot-scope="scope">
              <div>
                <span class="message-title">Msg:</span>
                <el-tag type="danger">{{ scope.row.msg }}</el-tag>
              </div>
              <br />
              <div>
                <span class="message-title" style="padding-right: 16px;">Url: </span>
                <el-tag type="success">{{scope.row.url}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="info">
            <template slot-scope="scope">
              {{ scope.row.info}}
            </template>
          </el-table-column>
        </el-table>
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
          para: 'isSolve',
          text: '状态',
          type: 'bool_enum',
          details: {
            parse: ['已解决', '未解决']
          }
        }],
        dialogErrorStatus: false,
        currentErrorInfo: []
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
          case 'dialogProcess':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              // 获取已有的数据
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
                data: row[0].Id
              }).then(data => {
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改异常信息'
                this.dialogBaseStatus = true
                this.dialogBaseForm.isSolve = data.result.isSolve.toString()
              })
            }
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
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {}
        this.$refs.dialogBaseForm.resetFields()
      },
      // 通用执行
      func_execute(action, row) {
        if (row.length === 0) {
          this.$message.info('请选择数据')
          return
        }
        this.$confirm('是否批量标记为已解决, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = []
          row.map(i => {
            data.push(i.Id)
          })
          this.$request({
            url: action.apiUrl,
            data
          }).then(() => {
            this.getList()
          })
        })
      },
      // 打开错误信息弹窗
      openErrorDialog(e, column, cell) {
        if (column.property === 'content') {
          this.dialogErrorStatus = true
          this.currentErrorInfo.push(JSON.parse(e.content))
        }
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
