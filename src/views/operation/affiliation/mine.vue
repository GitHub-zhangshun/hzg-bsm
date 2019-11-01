<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="email" label="账户总额">
          <template slot-scope="scope">
            <span>{{numAdd(scope.row.usable || 0,scope.row.investment || 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usable" label="账户余额">
        </el-table-column>
        <el-table-column prop="investment" label="在投金额">
        </el-table-column>
        <el-table-column prop="freeze" label="冻结金额">
        </el-table-column>
        <el-table-column prop="firstMoney" label="首投金额">
        </el-table-column>
        <el-table-column label="运营归属">
          <template slot-scope="scope">
            {{scope.row.organizationName}} {{scope.row.staffName}}
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
          <el-form-item label="选择人员" prop="name">
            <el-select v-model="dialogBaseForm.correlationId" placeholder="请选择人员">
              <el-option v-for="user in userList" :key="user.Id" :label="user.name" :value="user.Id">
                <span style="float: left">{{ user.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ user.organizationName }}-{{ user.jobName }}</span>
              </el-option>
            </el-select>
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
  import auth from '@/utils/auth.js'
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
          staff: true
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机号',
          type: 'text'
        }],
        userList: []
      }
    },
    created() {
      this.getList()
      // 获取当前登录者所属机构下的人员
      let id = null
      if (auth.getUserInfo() && auth.getUserInfo().job && auth.getUserInfo().job.organizationId) {
        id = auth.getUserInfo().job.organizationId
      }
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_ORG_USER_LIST'],
        data: {
          num: '1',
          size: '10000',
          organizationId: id
        }
      }).then(data => {
        this.userList = data.result
      })
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
          case 'dialogAllot':
            if (row.length === 0) {
              this.$message.info('请选择数据')
              return
            }
            this.dialogTitle = '分配'
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
            let ids = []
            this.table.tableChangeList.map(i => {
              ids.push(i.Id)
            })
            this.dialogBaseForm.userIds = ids
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
          staff: true
        }
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
