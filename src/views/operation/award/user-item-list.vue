<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%">当前用户: {{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机">
        </el-table-column>
        <el-table-column prop="recommendCount" label="邀请人数">
        </el-table-column>
        <el-table-column prop="awardClear" label="已结算奖励">
        </el-table-column>
        <el-table-column prop="awardTotal" label="奖励总额">
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
      <el-dialog :close-on-click-modal="false" width="80%" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="userSearchForm" :searchItems="userSearchItems" @change="queryUserList()">
        </TableListHeader>

        <!-- table list -->
        <el-table stripe @row-dblclick="pitchRow" ref="table" row-key="Id" :data="userTable.list" border style="width: 100%;margin-top:5px;" v-loading="userTable.loading" @selection-change="userSelectionChange">
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机">
          </el-table-column>
          <el-table-column prop="recommendCount" label="邀请人数">
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
          <el-pagination background @size-change="userSizeChange" @current-change="userCurrentChange" :current-page="userPageForm.num" :page-sizes="[5,10,15,20]" :page-size="userPageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="userPageForm.total">
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
  import {
    axios
  } from '@/utils/request'

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
          recommendAllow: true
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题\
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }],
        tableListQuery: {
          recommendUser: this.$route.query.id
        },
        userTable: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        userPageForm: {
          total: 0,
          num: 1,
          size: 10
        },
        userSearchForm: {},
        userSearchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
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
            this.dialogTitle = '添加邀请人'
            this.dialogBaseForm.recommendUser = this.$route.query.id
            this.dialogBaseStatus = true
            this.queryUserList()
            break

          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$confirm('此操作将重新绑定,若选中的用户存在推荐人将会被替换, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let userId = []
              this.userTable.tableChangeList.map(i => {
                userId.push(i.Id)
              })
              this.dialogBaseForm.userId = userId
              this.$request({
                url: this.currentDialogUrl,
                data: this.dialogBaseForm
              }).then(() => {
                this.dialogBaseStatus = false
                this.getList()
              })
            })
            break

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.userTable = {
          list: [],
          loading: false,
          tableChangeList: []
        }
        this.userPageForm = {
          total: 0,
          num: 1,
          size: 10
        }
        this.userSearchForm = {}
      },
      // 获取没有被邀请的用户列表
      queryUserList() {
        this.userTable.loading = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_USER_LIST'],
          data: Object.assign(this.userSearchForm, this.userPageForm)
        }).then(data => {
          if (this.userPageForm) {
            this.userPageForm.total = data.total
          }
          this.userTable.list = data.result
          this.userTable.loading = false
        })
      },
      // table 选中行
      userSelectionChange(val) {
        this.userTable.tableChangeList = val
      },
      // 改变每页数量
      userSizeChange(val) {
        this.userPageForm.size = val
        this.queryUserList()
      },
      // 改变页数
      userCurrentChange(val) {
        this.userPageForm.num = val
        this.queryUserList()
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
