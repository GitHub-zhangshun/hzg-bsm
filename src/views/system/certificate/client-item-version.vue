<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%">当前所属: {{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="isForce" label="是否强制更新">
          <template slot-scope="scope">
            <span>{{scope.row.isForce ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="current" label="是否当前">
          <template slot-scope="scope">
            <span>{{scope.row.current ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="newLink" label="新版地址">
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

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="是否强制更新" prop="isForce">
            <el-select v-model="dialogBaseForm.isForce" placeholder="">
              <ElOption label="是" value="true"></ElOption>
              <ElOption label="否" value="false"></ElOption>
            </el-select>
          </el-form-item>
          <el-form-item label="是否当前" prop="current">
            <el-select v-model="dialogBaseForm.current" placeholder="">
              <ElOption label="是" value="true"></ElOption>
              <ElOption label="否" value="false"></ElOption>
            </el-select>
          </el-form-item>
          <el-form-item label="新版地址" prop="newLink">
            <el-input v-model="dialogBaseForm.newLink"></el-input>
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
        dialogBaseForm: {
          isForce: 'false',
          current: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'keyword',
          text: '标题',
          type: 'text'
        }],
        tableListQuery: {
          clientId: this.$route.query.id
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
            this.dialogTitle = '新增版本'
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
                this.dialogTitle = '修改'
                this.dialogBaseStatus = true
                this.dialogBaseForm.isForce = data.result.isForce.toString()
                this.dialogBaseForm.current = data.result.current.toString()
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
            this.dialogBaseForm.clientId = this.$route.query.id
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
          isForce: 'false',
          current: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
