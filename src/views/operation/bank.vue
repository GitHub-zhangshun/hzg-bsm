<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="operationId" label="所属机构">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.operationId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column label="ICON">
          <template slot-scope="scope">
            <img :src="scope.row.icoLink" alt="" width="30" height="30">
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码">
        </el-table-column>
        <el-table-column prop="dayQuota" label="单日限额">
        </el-table-column>
        <el-table-column prop="monthQuota" label="单月限额">
        </el-table-column>
        <el-table-column prop="singleQuota" label="单笔限额">
        </el-table-column>
        <el-table-column prop="dayAmount" label="单日笔数">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
        </el-table-column>
        <el-table-column prop="updateName" label="更新人">
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示">
          <template slot-scope="scope">
            <span>{{scope.row.isShow?'显示':'隐藏'}}</span>
          </template>
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogBaseForm.name"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="dialogBaseForm.code"></el-input>
          </el-form-item>
          <el-form-item label="ICON">
            <Upload4 v-model="dialogBaseForm.icoLink"></Upload4>
          </el-form-item>
          <el-form-item label="图片">
            <Upload4 v-model="dialogBaseForm.imgLink" :width="400"></Upload4>
          </el-form-item>
          <el-form-item label="单日限额" prop="dayQuota">
            <el-input v-model="dialogBaseForm.dayQuota"></el-input>
          </el-form-item>
          <el-form-item label="单月限额" prop="monthQuota">
            <el-input v-model="dialogBaseForm.monthQuota"></el-input>
          </el-form-item>
          <el-form-item label="单笔限额" prop="singleQuota">
            <el-input v-model="dialogBaseForm.singleQuota"></el-input>
          </el-form-item>
          <el-form-item label="单日笔数" prop="dayAmount">
            <el-input v-model="dialogBaseForm.dayAmount"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-select v-model="dialogBaseForm.isShow" placeholder="请选择是否显示">
              <el-option label="显示" value="true"></el-option>
              <el-option label="隐藏" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构">
            <ServiceSelect v-model="dialogBaseForm.operationId" placeholder="请选择所属机构" queryArg="cms_bank_operation"></ServiceSelect>
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
        pageForm: {
          total: 0,
          num: 1,
          size: 10
        },
        dialogBaseStatus: false,
        dialogBaseForm: {
          isShow: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'operationId',
          text: '机构',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'cms_bank_operation'
          }
        }, {
          para: 'name',
          text: '名称',
          type: 'text'
        }, {
          para: 'code',
          text: '编码',
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
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAdd':
            this.dialogTitle = '新增银行信息'
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
                this.dialogBaseForm.isShow = data.result.isShow.toString()
                this.dialogTitle = '修改银行信息'
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
          isShow: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
        this.icoUrl = ''
        this.imgUrl = ''
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
