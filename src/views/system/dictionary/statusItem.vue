<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%">所属状态:{{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- tree table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="名称" prop="title">
        </el-table-column>
        <el-table-column label="状态" width="80px;">
          <template slot-scope="scope">
            <span>{{scope.row.isUse?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subhead" label="副标题">
        </el-table-column>
        <el-table-column label="简化序列号" prop="simplify">
        </el-table-column>
        <el-table-column label="描述" prop="remark">
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
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,20,30]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose" center>
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="名称" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="简化序列号" prop="simplify">
            <el-input v-model="dialogBaseForm.simplify"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="simplify">
            <el-input v-model="dialogBaseForm.subhead"></el-input>
          </el-form-item>
          <el-form-item label="扩展字段" prop="simplify">
            <el-input v-model="dialogBaseForm.extend"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isUse">
            <el-select v-model="dialogBaseForm.isUse" placeholder="请选择状态">
              <el-option label="启用" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
            </el-select>
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

      <!-- relate status dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogRelateStatus" @close="dialogRelateClose">
        <el-checkbox-group v-model="ownRelatedStatus" size="mini">
          <el-checkbox v-for="statusItem in statusItemList" :key="statusItem.Id" :label="statusItem.Id" border>{{statusItem.title}}</el-checkbox>
        </el-checkbox-group>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRelateStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('relate')">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  import treeTable from '@/components/TreeTable'
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
          isUse: 'true',
          sort: '1'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: {
          queryType: '2', // 通过ID查询
          queryValue: this.$route.query.id
        },
        dialogRelateStatus: false, // 分配状态关联弹窗状态
        dialogRelateForm: {}, // 分配状态关联弹窗表单
        ownRelatedStatus: [], // 已分配的状态关联列表
        statusItemList: [], // 当前状态下所有的子集
        currentRow: {} // 当前选择的行数据
      }
    },
    components: {
      treeTable
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList'
      ]),
    },
    created() {
      this.getList()
    },
    methods: Object.assign(_func(), {
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAdd': // 新增弹窗
            this.dialogTitle = '新增状态字典'
            this.dialogBaseStatus = true
            this.dialogBaseForm.sort = this.pageForm.total + 1
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
                this.dialogBaseStatus = true
                this.dialogTitle = '修改状态字典'
                this.currentRow = row[0]
              })
            }
            break

          case 'dialogRelate': // 分配状态关联弹窗
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              this.dialogTitle = '分配状态关联'
              this.dialogRelateStatus = true
              this.currentRow = row[0]
              // 获取所有状态字典 根据状态获取
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_STATUS_ITEM_LIST'],
                data: this.$route.query.id
              }).then(data => {
                this.statusItemList = data.result
              })
              // 获取已分配的状态关联数据
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_STATUS_ITEM_RELATE_LIST'],
                data: row[0].Id
              }).then(data => {
                // 构建需要的数据
                let ids = []
                data.result.forEach(item => {
                  ids.push(item.correlationId)
                })
                this.ownRelatedStatus = ids
              })
            }
            break

          default:
            break
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base': // 新增或者修改弹窗提交
            // 添加归属状态
            this.dialogBaseForm.typeId = this.$route.query.id
            this.$request({
              url: this.currentDialogUrl,
              data: this.dialogBaseForm
            }).then(() => {
              this.dialogBaseStatus = false
              this.getList()
            })
            break;

          case 'relate': // 分配状态字典关联弹窗提交
            // 构建数据
            const data = {
              currentId: this.currentRow.Id,
              correlations: this.ownRelatedStatus
            }
            this.$request({
              url: this.currentDialogUrl,
              data
            }).then(() => {
              this.dialogRelateStatus = false
            })
            break

          default:
            break
        }
      },
      // 分配状态关联弹窗关闭事件
      dialogRelateClose() {
        this.ownRelatedStatus = []
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          isUse: 'true',
          sort: '1'
        }
        this.$refs.dialogBaseForm.resetFields()
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
