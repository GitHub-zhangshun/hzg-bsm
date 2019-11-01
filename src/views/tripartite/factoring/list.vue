<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="名称">
        </el-table-column>
        <el-table-column prop="license" label="营业执照">
        </el-table-column>
        <el-table-column prop="legalName" label="法人姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="legalIdcard" label="身份证">
        </el-table-column>
        <el-table-column prop="registeredPlace" label="注册地址">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="" label="电子合同">
          <template slot-scope="scope">
            <span>{{scope.row.isContract?'已开户':'未开户'}}</span>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogBaseForm.name"></el-input>
          </el-form-item>
          <el-form-item label="营业执照号" prop="license">
            <el-input v-model="dialogBaseForm.license"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="legalName">
            <el-input v-model="dialogBaseForm.legalName"></el-input>
          </el-form-item>
          <el-form-item label="法人身份证号" prop="legalIdcard">
            <el-input v-model="dialogBaseForm.legalIdcard"></el-input>
          </el-form-item>
          <el-form-item label="注册地址" prop="registeredPlace">
            <el-input v-model="dialogBaseForm.registeredPlace"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="dialogBaseForm.phone" :disabled="dialogType === 'edit'"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')" :loading="dialogBaseButtonDisabled">确 定</el-button>
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
        dialogBaseForm: {},
        dialogBaseButtonDisabled: false,
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        dialogEdit: false,
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '名称',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机号',
          type: 'text'
        }, {
          para: 'isContract',
          text: '电子合同',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }],
        dialogType: ''
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
            this.dialogTitle = '新增保理机构'
            this.dialogBaseStatus = true
            break
          case 'dialogEdit':
            this.dialogType = 'edit'
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              // 获取已有的数据
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
                data: row[0].Id
              }).then(data => {
                this.dialogBaseForm = data.result
                this.dialogBaseForm.dataId = data.result.Id
                this.dialogBaseForm.name = data.result.enterpriseName
                this.dialogBaseForm.legalIdcard = data.result.legalIdcard // 大小写
                this.dialogTitle = '修改保理机构'
                this.dialogBaseStatus = true
              })
            }
            break

          case 'dialogSetType':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              this.dialogType = 'setType'
              this.dialogTitle = '设置数据类型'
              this.dialogBaseStatus = true
              this.dialogBaseForm.userId = row[0].Id
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
              console.log(valid)
              if (valid) {
                this.dialogBaseButtonDisabled = true
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.$message.success('操作成功')
                  this.dialogBaseStatus = false
                  this.dialogBaseButtonDisabled = false
                  this.getList()
                }).catch(() => {
                  this.dialogBaseButtonDisabled = false
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
        this.dialogEdit = false
        this.dialogType = ''
        this.$refs.dialogBaseForm.resetFields()
      },
      func_execute(action, row) {
        switch (action.routeUrl) {
          // 电子合同开户
          case 'execute_contract_open_account':
            if (row.length === 0) {
              this.$message.info('请选择数据')
              return
            }
            this.$confirm('是否继续?', '电子合同账户开户', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data = []
              row.map(i => {
                data.push(i.Id)
              })
              this.$request({
                url: action.apiUrl,
                data
              }).then(data => {
                console.log(data)
                if (data.result.length > 0) {
                  let nameList = []
                  data.result.map(j => {
                    row.map(i => {
                      if (j === i.Id) {
                        nameList.push(`${i.enterpriseName}-${i.legalName}`)
                      }
                    })
                  })

                  this.$notify({
                    title: '以下用户开户失败',
                    dangerouslyUseHTMLString: true,
                    message: `<span style="color:red">${nameList.toString()}</span>`,
                    type: 'warning'
                  });
                } else {
                  this.$message.success('操作成功')
                  this.getList()
                }
              })
            })
            break

          default:
            break;
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
