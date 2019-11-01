<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange" height="600px">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="keyName" label="名称">
        </el-table-column>
        <el-table-column prop="keyValue" label="keyValue">
        </el-table-column>
        <el-table-column prop="keyType" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.keyType === 1 ? '签名关键字' : '填充关键字'}}</span>
          </template>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="keyName">
            <el-input v-model="dialogBaseForm.keyName"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="keyType">
            <el-select v-model="dialogBaseForm.keyType" placeholder="请选择类型">
              <el-option label="签名关键字" value="1"></el-option>
              <el-option label="填充关键字" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="keyValue" prop="keyValue">
            <template v-if="dialogBaseForm.keyType === '1'">
              <el-select v-model="dialogBaseForm.keyValue" placeholder="">
                <ElOption label="出借人" value="INVEST"></ElOption>
                <ElOption label="借款人" value="BORROWER"></ElOption>
                <ElOption label="助贷机构" value="PROVIDER"></ElOption>
                <ElOption label="保理机构" value="FACTOR"></ElOption>
              </el-select>
            </template>
            <template v-else>
              <el-input v-model="dialogBaseForm.keyValue"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
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
  export default {
    data() {
      return {
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        dialogBaseStatus: false,
        dialogBaseForm: {
          keyValue: ''
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: this.$route.query.id
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
            this.dialogTitle = '新增KEY'
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
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改KEY'
                this.dialogBaseStatus = true
                this.dialogBaseForm.keyType = `${this.dialogBaseForm.keyType}`
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
            this.dialogBaseForm.templateId = this.$route.query.id
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
        this.dialogBaseForm = {
          keyValue: ''
        }
        this.$refs.dialogBaseForm.resetFields()
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
