<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%">标的名称:{{this.$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border row-key="Id" style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" reserve-selection>
        </el-table-column>

        <el-table-column prop="realName" label="用户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="idcardCode" label="身份证">
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

      <!-- 分组 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-row>
          <el-checkbox-group v-model="dialogBaseForm.ids">
            <el-checkbox v-for="userGroup in userGroupList" :key="userGroup.Id" :label="userGroup.Id">{{userGroup.title}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 出借人 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogInvestStatus" @close="dialogInvestClose" width="70%">
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
          <el-button @click="dialogInvestStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('invest')">确 定</el-button>
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
          ids: []
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: {
          bidId: this.$route.query.id,
          exist: true
        },
        userGroupList: [],
        searchForm: {},
        searchItems: [{
          para: 'realName',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机号',
          type: 'text'
        }],
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
        investorSearchForm: {
          bidId: this.$route.query.id,
          type: '0'
        }, // 出借人列表查询条件
        investorSearchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }],
        dialogInvestStatus: false
      }
    },
    created() {
      this.getList()
      // 获取用户分组
      this.getTypeEnum(this.baseRunFuncList['O_TYPE_ENUM_LIST'], 'uc_user_group').then(data => {
        this.userGroupList = data
      })
    },
    watch: {
      currentBidPerType(nd) {
        this.currentBidPerType = nd
        if (this.bidPerType !== nd) {
          this.table.list = []
        } else {
          this.getList()
        }
      }
    },
    computed: {
      ...mapGetters([
        'baseRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 弹窗事件
      func_dialog(action, row) {
        this.currentDialogUrl = action.apiUrl
        switch (action.routeUrl) {
          case 'dialogAddGroup':
            this.dialogTitle = '按分组添加'
            this.dialogBaseStatus = true
            break;

          case 'dialogAddInvest':
            this.dialogTitle = '按个人添加'
            this.dialogInvestStatus = true
            // 获取非该标关系出借人列表
            this.getInvestorList()
            break;

          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            // 分组添加
            this.$request({
              url: this.currentDialogUrl,
              data: {
                dataId: this.$route.query.id,
                idList: this.dialogBaseForm.ids,
                isTrue: true
              }
            }).then(() => {
              this.dialogBaseStatus = false
              this.$message.success('操作成功')
              this.getList()
            })
            break;
          case 'invest':
            // 个人添加
            if (this.investorTable.tableChangeList.length === 0) {
              this.$message.info('请选择数据')
              return
            }
            let ids = []
            this.investorTable.tableChangeList.map(i => {
              ids.push(i.Id)
            })
            this.$request({
              url: this.currentDialogUrl,
              data: {
                dataId: this.$route.query.id,
                idList: ids,
                isTrue: false
              }
            }).then(() => {
              this.dialogInvestStatus = false
              this.$message.success('操作成功')
              this.getList()
            })
            break;


          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          ids: [],
          bidId: this.$route.query.id
        }
        // this.$refs.dialogBaseForm.resetFields()
      },
      dialogInvestClose() {
        this.dialogBaseForm = {
          ids: [],
          bidId: this.$route.query.id
        }
      },
      // 通用执行
      func_execute(action, row) {
        if (row.length === 0) {
          this.$message.info('请选择数据')
          return
        }
        let ids = []
        row.map(i => {
          ids.push(i.Id)
        })
        this.$request({
          url: action.apiUrl,
          data: {
            isTrue: false,
            dataId: this.$route.query.id,
            idList: ids
          }
        }).then(data => {
          this.$message.success('操作成功')
          this.getList()
        })
      },
      // 出借人 table 获取
      getInvestorList() {
        this.investorTable.loading = true
        // 获取非该标关系出借人列表
        const data = Object.assign(this.investorSearchForm, this.investorPageForm)
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_INVEST_LIST'],
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
    })
  }
</script>

<style lang="scss" scoped>
  .search-form-item {
    padding: 0;
    margin: 0;
  }
</style>
