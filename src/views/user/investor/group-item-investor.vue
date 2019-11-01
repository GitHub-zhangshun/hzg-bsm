<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag type="">当前分组：{{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" row-key="Id" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" reserve-selection>
        </el-table-column>
        <el-table-column prop="phone" label="登录名">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="address" label="地址">
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
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose" width="70%">
        <!-- search -->
        <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="investorSearchForm" :searchItems="investorSearchItems" @change="queryInvestor()">
        </TableListHeader>
        <!-- table list -->
        <el-table stripe @row-dblclick="pitchRow" ref="table" row-key="Id" :data="investorTable.list" border style="width: 100%;margin-top:5px;" v-loading="investorTable.loading" @selection-change="investorTableChange">
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="idcardCode" label="身份证号">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="investorSizeChange" @current-change="investorCurrentChange" :current-page="investorPageForm.num" :page-sizes="[1,5,10,15,20]" :page-size="investorPageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="investorPageForm.total">
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
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }],
        tableListQuery: {
          groupId: this.$route.query.id
        },
        investorPageForm: { // 出借人分页数据
          total: 0,
          num: 1,
          size: 10
        },
        investorTable: { // 出借人列表
          list: [],
          loading: false,
          tableChangeList: []
        },
        investorSearchForm: {}, // 出借人列表查询条件
        investorSearchItems: [{
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
            this.dialogTitle = '添加出借人'
            this.getInvestorList()
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
                this.dialogTitle = '修改用户'
                this.dialogBaseStatus = true
              })
            }
            break

          default:
            break
        }
      },
      // 出借人 table 获取
      getInvestorList() {
        this.investorTable.loading = true
        // 获取未分组出借人列表
        const data = Object.assign(this.investorSearchForm, this.investorPageForm)
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_INVESTOR_LIST'],
          data
        }).then(data => {
          this.investorTable.loading = false
          this.investorTable.list = data.result
          this.investorPageForm.total = data.total
        })
      },
      // 出借人 table 选项变化
      investorTableChange(val) {
        this.investorTable.tableChangeList = val
      },
      // 出借人 table 查询
      queryInvestor() {
        this.getInvestorList()
      },
      // 出借人 page 改变每页数量
      investorSizeChange(val) {
        this.investorPageForm.size = val
        this.getInvestorList()
      },
      // 出借人 page 改变当前页数
      investorCurrentChange(val) {
        this.investorPageForm.num = val
        this.getInvestorList()
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            // 是否存在已分组人员
            let isGroup = false
            const userIdList = []
            this.investorTable.tableChangeList.map(item => {
              if (item.groupId) {
                isGroup = true
              }
              userIdList.push(item.Id)
            })
            const data = {
              groupId: this.$route.query.id,
              userIdList
            }
            this.$confirm('有出借人属于其他分组，是否转移到该分组下？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: this.currentDialogUrl,
                data
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
        this.investorTable = {
          list: [],
          loading: false,
          tableChangeList: []
        }
        this.investorPageForm = {
          total: 0,
          num: 1,
          size: 10
        }
      },
      // 通用执行
      func_execute(action, row) {
        if (row.length === 0) {
          this.$message.info('请选择数据')
        } else {
          this.$confirm('此操作将移除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = []
            row.map(i => {
              ids.push(i.Id)
            })
            this.$request({
              url: action.apiUrl,
              data: ids
            }).then(() => {
              this.getList()
            })
          })
        }
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
