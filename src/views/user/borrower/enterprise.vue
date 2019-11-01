<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">
      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="已还本金">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.alsoPrincipal)}}</span>
              </el-form-item>
              <el-form-item label="待还本金">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.waitPrincipal)}}</span>
              </el-form-item>
              <el-form-item label="已还利息">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.alsoInterest)}}</span>
              </el-form-item>
              <el-form-item label="待还利息">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.waitInterest)}}</span>
              </el-form-item>
              <el-form-item label="已还违约金 ">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.alsoDamages)}}</span>
              </el-form-item>
              <el-form-item label="待还违约金">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.waitDamages)}}</span>
              </el-form-item>
              <el-form-item label="已收管理费">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.alsoServiceCharge)}}</span>
              </el-form-item>
              <!-- <el-form-item label="待还管理费 ">
                <span>{{numberFormat(props.row.loanStatistics && props.row.loanStatistics.waitServiceCharge)}}</span>
              </el-form-item> -->
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="登录手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.phone.indexOf('LOGOUT') > -1">
              <el-tooltip class="item" effect="dark" content="已注销" placement="top-start">
                <span style="color:red">{{ (scope.row.phone || '').substr(6) }}</span>
              </el-tooltip>
            </span>
            <span v-else>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="license" label="营业执照" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="legalName" label="法人姓名">
        </el-table-column>
        <el-table-column label="是否关系户">
          <template slot-scope="scope">
            <span>{{scope.row.isRelation ? `是(${scope.row.remark})` : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="legalPhone" label="法人手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="legalIdcard" label="身份证号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="" label="电子合同">
          <template slot-scope="scope">
            <span :style="!scope.row.isContract && 'color:red'">{{scope.row.isContract?'已开户':'未开户'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="存管开户">
          <template slot-scope="scope">
            <span :style="!scope.row.isOpen && 'color:red'">{{scope.row.isOpen ? '已开户' : '未开户'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.openTime && getTime(scope.row.openTime) || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡信息" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.bankBranchName}}</span>
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="providerName" label="助贷机构" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="借款金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.loanStatistics && scope.row.loanStatistics.totalLoan)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="待还金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.loanStatistics && numAdd(scope.row.loanStatistics.waitPrincipal || 0, scope.row.loanStatistics.waitInterest || 0, scope.row.loanStatistics.waitDamages || 0)  || 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已还金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.loanStatistics && numAdd(scope.row.loanStatistics.alsoPrincipal || 0, scope.row.loanStatistics.alsoInterest || 0, scope.row.loanStatistics.alsoDamages || 0)  || 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usable" label="账户余额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.usable)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作" fixed="right">
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
          <el-form-item label="是否关系户" prop="name">
            <el-select v-model="dialogBaseForm.isRelation" placeholder="">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogBaseForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogAddStatus" @close="dialogAddClose">
        <el-form :model="dialogAddForm" ref="dialogAddForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogAddForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="dialogAddForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="legalName">
              <el-input v-model="dialogAddForm.legalName" placeholder="请输入法人姓名"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号" prop="legalIdcard">
              <el-input v-model="dialogAddForm.legalIdcard" placeholder="请输入法人身份证号"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('add')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogSetAccountStatus" @close="dialogSetAccountClose">
        <el-form :model="dialogSetAccountForm" ref="dialogSetAccountForm" :rules="baseFormRules.dialogRules" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="dialogSetAccountForm.type" placeholder="请选择类型">
              <el-option label="进账" value="in"></el-option>
              <el-option label="出账" value="out"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input v-model="dialogSetAccountForm.amount" placeholder="请输入金额"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="dialogSetAccountForm.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSetAccountStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('setAccount')" :loading="dialogBaseButtonDisabled">确 定</el-button>
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
  } from '@/business/rules.js'

  export default {
    name: 'user-borrower-enterprise',
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
        searchForm: {},
        searchItems: [{
          para: 'enterpriseName',
          text: '企业名称',
          type: 'text'
        }, {
          para: 'legalName',
          text: '法人姓名',
          type: 'text'
        }, {
          para: 'legalPhone',
          text: '手机',
          type: 'text'
        }, {
          para: 'legalIdcard',
          text: '身份证',
          type: 'text'
        }, {
          para: 'providerId',
          text: '助贷机构',
          type: 'fuzzy_provider'
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }, {
          para: 'openTime',
          text: '开户时间起|开户时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['startOpenTime', 'endOpenTime']
          }
        }],
        dialogBaseStatus: false,
        dialogBaseForm: {
          isRelation: 'true'
        },
        dialogAddStatus: false,
        dialogAddForm: {},
        dialogSetAccountStatus: false,
        dialogSetAccountForm: {
          type: 'in'
        },
        dialogBaseButtonDisabled: false,
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
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
        this.currentDialogUrl = action.apiUrl
        switch (action.routeUrl) {
          case 'dialogRelate':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '设置关联'
            this.dialogBaseStatus = true
            this.dialogBaseForm.userId = row[0].Id
            break;
          case 'dialogAdd':
            this.dialogTitle = '新增借款人'
            this.dialogAddStatus = true
            this.dialogAddForm.isEnterprise = true
            break;
          case 'dialogSetAccount':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '上账'
            this.dialogSetAccountStatus = true
            this.dialogSetAccountForm.userId = row[0].Id
            break;
          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                this.dialogBaseButtonDisabled = true
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.dialogBaseStatus = false
                  this.dialogBaseButtonDisabled = false
                  this.getList()
                  this.$message.success('提交成功')
                }).catch(() => {
                  this.dialogBaseButtonDisabled = false
                })
              }
            })
            break;
          case 'add':
            this.$refs['dialogAddForm'].validate((valid) => {
              if (valid) {
                this.dialogBaseButtonDisabled = true
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogAddForm
                }).then(() => {
                  this.dialogAddStatus = false
                  this.dialogBaseButtonDisabled = false
                  this.getList()
                  this.$message.success('提交成功')
                }).catch(() => {
                  this.dialogBaseButtonDisabled = false
                })
              }
            })
            break;
          case 'setAccount':
            this.$refs['dialogSetAccountForm'].validate((valid) => {
              if (valid) {
                this.dialogBaseButtonDisabled = true
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogSetAccountForm
                }).then(() => {
                  this.dialogSetAccountStatus = false
                  this.dialogBaseButtonDisabled = false
                  this.getList()
                  this.$message.success('提交成功')
                }).catch(() => {
                  this.dialogBaseButtonDisabled = false
                })
              }
            })
            break;

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          isRelation: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      dialogAddClose() {
        this.dialogAddForm = {}
        this.$refs.dialogAddForm.resetFields()
      },

      dialogSetAccountClose() {
        this.dialogSetAccountForm = {
          type: 'in'
        }
        this.$refs.dialogSetAccountForm.resetFields()
      },
      async func_execute(action, row) {
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
                        nameList.push(i.realName)
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

            // 清空用户名
          case 'execute_clear_username':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('是否继续?', '清空此用户的用户名', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: {
                  userId: row[0].Id,
                  account: ''
                }
              }).then(data => {
                this.$message.success('操作成功')
                this.getList()
              })
            })
            break
            // 查询陕坝余额
          case 'execute_ref_cg':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            if (!row[0].isOpen) {
              this.$message.error('未开户，请开户后查询')
              return
            }
            this.$message.success('查询中，请稍后')
            this.$request({
              url: action.apiUrl,
              data: row[0].Id
            }).then(data => {
              let yl = (row[0].usable || 0) != (data.result && data.result['可用余额'] || 0)
              let yl_c = this.numberFormat(this.numAdd(row[0].usable || 0, -data.result['可用余额'] || 0))
              let dj = (row[0].freeze || 0) != (data.result && data.result['冻结余额'] || 0)
              let dj_c = this.numberFormat(this.numAdd(row[0].freeze || 0, -data.result['冻结余额'] || 0))
              this.$notify({
                dangerouslyUseHTMLString: true,
                message: `
                  <div>
                      用户: <span>${row[0].enterpriseName}</span> <span ${ (data.result['账户状态'] == '禁用')?'style="color:red"':''}></span> (状态: ${data.result['账户状态']})<br />
                      可用余额(平台/存管): <span ${ yl?'style="color:red"':''}>${this.numberFormat(row[0].usable)}/${data.result && this.numberFormat(data.result['可用余额'])}</span> <span ${ yl?'style="color:red"':''}>差值: ${yl_c}</span><br/>
                      冻结金额(平台/存管): <span ${ dj?'style="color:red"':''}>${this.numberFormat(row[0].freeze)}/${data.result && this.numberFormat(data.result['冻结余额'])}</span> <span ${ dj?'style="color:red"':''}>差值: ${dj_c}</span><br/>
                  </div>`,
                duration: 0,
                type: 'info',
                offset: 50
              })
            })
            break
            // 导出
          case 'execute_export':
            let count = 0
            await this.$prompt('请输入每份文件的数据量', '每份数据量', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^[1-9]\d*$/,
              inputErrorMessage: '请输入正整数'
            }).then(({
              value
            }) => {
              count = value
            })
            // 获取总条数
            // 拷贝搜索对象
            let searchForm = JSON.parse(JSON.stringify(this.searchForm))
            let total = 0
            this.table.loading = true
            await this.$request({
              url: action.apiUrl,
              data: Object.assign(searchForm || {}, {
                num: 1,
                size: 1
              })
            }).then(data => {
              total = data.total
              this.table.loading = false
            }).catch(() => {
              this.table.loading = false
            })
            // 计算文件数
            const page = Math.ceil(total / count)
            let sure = false
            await this.$confirm(`总共${total}条数据，将按每份文件${count}条数据总共${page}份文件导出，是否继续?`, '导出数据', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              sure = true
            })
            if (sure) {
              this.$message.success('导出中，请稍后......')
              const header_key = ['企业名称', '法人姓名', '是否关系户', '手机号', '身份证', '电子合同', '存管开户', '开户时间', '银行卡', '助贷机构', '借款金额', '待还金额', '已还金额', '账户余额']
              const header_value = ['enterpriseName', 'legalName', 'isRelation', 'legalPhone', 'legalIdcard', 'isContract', 'isOpen', 'openTime', 'bankBranchName', 'providerName', 'totalLoan', 'waitMoney', 'alsoMoney', 'usable']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count)
                  }
                  let searchData = JSON.parse(JSON.stringify(Object.assign(searchForm || {}, oData)))
                  await this.getExportData({
                    searchData,
                    action,
                    total: this.pageForm.total
                  }).then(data => {
                    try {
                      // 数据格式化
                      data.result.map(i => {
                        i.isRelation = i.isRelation ? `是(${i.remark})` : '否'
                        i.isContract = i.isContract ? '已开户' : '未开户'
                        i.isOpen = i.isOpen ? '已开户' : '未开户'
                        i.openTime = i.openTime && this.getTime(i.openTime)
                        i.totalLoan = i.loanStatistics && i.loanStatistics.totalLoan || 0
                        i.waitMoney = i.loanStatistics && this.numAdd(i.loanStatistics.waitPrincipal || 0, i.loanStatistics.waitInterest || 0, i.loanStatistics.waitDamages || 0) || 0
                        i.alsoMoney = i.loanStatistics && this.numAdd(i.loanStatistics.alsoPrincipal || 0, i.loanStatistics.alsoInterest || 0, i.loanStatistics.alsoDamages || 0) || 0
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-企业借款人`,
                      header_key,
                      header_value,
                      data: data.result,
                      num: index,
                      total: page
                    })
                  }).catch(() => {
                    this.$store.dispatch('setDownProgress', 100)
                    this.$message.error('导出出错或取消，如若数据量过大！请筛选所需导出!')
                  })
                }
              }
            }
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
