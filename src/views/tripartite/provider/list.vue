<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.enterpriseName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="legalName" label="法人姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.legalName || '---'}}</span>
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
        <el-table-column prop="bankPhone" label="开户手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.bankPhone || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="电子合同">
          <template slot-scope="scope">
            <span>{{scope.row.isContract?'已开户':'未开户'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isOpen" label="存管开户">
          <template slot-scope="scope">
            <span>{{scope.row.isOpen?'已开户':'未开户'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="legalIdcard" label="身份证" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.legalIdcard || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankBranchName" label="开户行" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.bankBranchName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNo" label="卡号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.cardNo || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="freeze" label="冻结金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.freeze) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usable" label="账户余额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.usable) }}</span>
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
          <template v-if="dialogType === 'setType'">
            <ServiceSelect v-model="dialogBaseForm.dataType" placeholder="请选择数据类型" queryArg="platform_data_type" queryType="typeEnum"></ServiceSelect>
          </template>
          <template v-else-if="dialogType === 'setHot'">
            <el-select v-model="dialogBaseForm.isTrue" placeholder="">
              <ElOption label="常用" value="true"></ElOption>
              <ElOption label="不常用" value="false"></ElOption>
            </el-select>
          </template>
          <template v-else-if="dialogType === 'setAccount'">
            <el-form-item label="类型" prop="type">
              <el-select v-model="dialogBaseForm.type" placeholder="请选择类型">
                <el-option label="进账" value="in"></el-option>
                <el-option label="出账" value="out"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <el-input v-model="dialogBaseForm.amount" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dialogBaseForm.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item v-if="!dialogEdit" label="登录手机号" prop="phone">
              <el-input v-model="dialogBaseForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="dialogBaseForm.name" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名" prop="legalName">
              <el-input v-model="dialogBaseForm.legalName" placeholder="请输入法人姓名"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号" prop="legalIdcard">
              <el-input v-model="dialogBaseForm.legalIdcard" placeholder="请输入法人身份证号"></el-input>
            </el-form-item>
          </template>
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
    name: 'tripartite-provider-list',
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
        dialogBaseForm: {
          isTrue: 'false',
          legalIdcard: '',
          legalName: ''
        },
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
          text: '手机',
          type: 'text'
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }, {
          para: 'isHot',
          text: '是否常用',
          type: 'bool_enum',
          details: {
            parse: ['常用', '不常用']
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
            this.dialogTitle = '新增助贷机构'
            this.dialogBaseStatus = true
            break
          case 'dialogEdit':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '修改'
            this.dialogBaseStatus = true
            this.dialogEdit = true
            this.dialogBaseForm.dataId = row[0].Id
            this.dialogBaseForm.name = row[0].enterpriseName
            this.dialogBaseForm.legalIdcard = row[0].legalIdcard
            this.dialogBaseForm.legalName = row[0].legalName
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
          case 'dialogSetHot':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              this.dialogType = 'setHot'
              this.dialogTitle = '设置常用'
              this.dialogBaseStatus = true
              this.dialogBaseForm.dataId = row[0].Id
              this.dialogBaseForm.isTrue = row[0].isHot && row[0].isHot.toString() || 'false'
            }
            break
          case 'dialogSetAccount':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              this.dialogType = 'setAccount'
              this.dialogTitle = '账户上账'
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
        this.dialogBaseForm = {
          isTrue: 'false'
        }
        this.dialogEdit = false
        this.dialogType = ''
        this.$refs.dialogBaseForm.resetFields()
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
                size: 1,
                userId: this.$route.query.id
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
              const header_key = ['企业名称', '法人姓名', '登录手机号', '开户手机号', '电子合同', '存管开户', '身份证', '开户行', '卡号', '冻结金额', '账户余额']
              const header_value = ['enterpriseName', 'legalName', 'phone', 'bankPhone', 'isContract', 'isOpen', 'legalIdcard', 'bankBranchName', 'cardNo', 'freeze', 'usable']
              if (page > 0) {
                for (let index = 0; index < page; index++) {
                  let oData = {
                    num: index + 1,
                    size: parseInt(count),
                    userId: this.$route.query.id
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
                        i.isContract = i.isContract ? '已开户' : '未开户'
                        i.isOpen = i.isOpen ? '已开户' : '未开户'
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-助贷机构列表`,
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
