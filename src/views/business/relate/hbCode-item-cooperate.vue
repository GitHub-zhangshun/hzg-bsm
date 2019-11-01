<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="合作单位名称">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="dialogSearchForm" :searchItems="dialogSearchItems" @change="queryCooperate()">
        </TableListHeader>
        <!-- table list -->
        <el-table stripe @row-dblclick="pitchRow" ref="table" :data="dialogTable.list" border style="width: 100%;margin-top:5px;" v-loading="dialogTable.loading" @selection-change="dialogHandleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="合作单位名称">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="dialogHandleSizeChange" @current-change="dialogHandleCurrentChange" :current-page="dialogPageForm.num" :page-sizes="[5,10,15,20]" :page-size="dialogPageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="dialogPageForm.total">
          </el-pagination>
        </div>
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
  export default {
    data() {
      return {
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        dialogBaseStatus: false,
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: this.$route.query.id,
        dialogTable: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        dialogPageForm: {
          total: 0,
          num: 1,
          size: 10
        },
        dialogSearchForm: {},
        dialogSearchItems: [{
          para: 'keyword',
          text: '名称',
          type: 'text'
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
      // 获取所有合作单位列表
      getCooperateList() {
        this.dialogTable.loading = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_COOPERATE_LIST'],
          data: Object.assign(this.dialogSearchForm, this.dialogPageForm, {
            treasureId: this.$route.query.id
          })
        }).then(data => {
          this.dialogTable.list = data.result
          this.dialogPageForm.total = data.total
          this.dialogTable.loading = false
        })
      },
      // 弹窗-查询合作单位
      queryCooperate() {
        this.getCooperateList()
      },
      // 弹窗-合作单位列表选中事件
      dialogHandleSelectionChange(val) {
        this.dialogTable.tableChangeList = val
      },
      // 弹窗-改变每页数量
      dialogHandleSizeChange(val) {
        this.dialogPageForm.size = val
        this.getCooperateList()
      },
      // 弹窗-改变页数
      dialogHandleCurrentChange(val) {
        this.dialogPageForm.num = val
        this.getCooperateList()
      },
      func_execute(action, row) {
        if (row.length === 0) {
          this.$message.info('请选择数据')
          return
        }
        const data = {
          treasureId: this.$route.query.id,
          organizationIdList: []
        }
        this.table.tableChangeList.map(item => {
          data.organizationIdList.push(item.Id)
        })
        this.$request({
          url: action.apiUrl,
          data
        }).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      },
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAdd':
            this.getCooperateList()
            this.dialogTitle = '新增合作单位'
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
            if (this.dialogTable.tableChangeList.length === 0) {
              this.$message.info('请选择数据')
              return
            }
            const data = {
              treasureId: this.$route.query.id,
              organizationIdList: []
            }
            this.dialogTable.tableChangeList.map(item => {
              data.organizationIdList.push(item.Id)
            })
            this.$request({
              url: this.currentDialogUrl,
              data
            }).then(() => {
              this.$message.success('操作成功')
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
        this.dialogSearchForm = {}
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
