<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="title" label="名称">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="createName" label="创建人">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules" label-width="100px">
          <el-form-item label="名称" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="简化序列号" prop="simplify">
            <el-input v-model="dialogBaseForm.simplify"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="dialogBaseForm.sort"></el-input>
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
    name: 'user-investor-group',
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
          isUse: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: {
          queryType: '1',
          queryValue: 'uc_user_group'
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
          case 'dialogAdd':
            this.dialogTitle = '新增类型'
            this.dialogBaseStatus = true
            break

          case 'dialogEdit':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              // 获取已有的数据
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
                data: row[0].Id
              }).then(data => {
                data.result.isUse = data.result.isUse.toString()
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改类型'
                this.dialogBaseStatus = true
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
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                // 默认启用
                this.dialogBaseForm.isUse = true
                // 默认归属的简化序列号
                this.dialogBaseForm.typeId = 'uc_user_group'
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
      },
      // 重写需要条件的删除功能
      func_del(action, row) {
        if (row.length === 0) {
          this.$message.info('请选择数据')
          return
        }
        this.$confirm('是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 查询此分组下是否有出借人
          this.$request({
            url: this.currentMenuHiddenRunFuncList['O_GROUP_INVESTOR_COUNT'],
            data: row[0].Id
          }).then(data => {
            if (data.result > 0) {
              this.$message.error('此分组下存在出借人,请移除后再进行删除')
              return
            }
            const ids = []
            row.map(item => {
              ids.push(item.Id)
            })
            this.$request({
              url: action.apiUrl,
              data: ids
            }).then(() => {
              this.getList()
            })
          })
        })
      },
    })
  }
</script>

<style lang="scss" scoped>


</style>
