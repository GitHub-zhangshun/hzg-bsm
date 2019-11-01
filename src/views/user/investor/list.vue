<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">
      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.nickName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idcardCode" label="身份证" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.idcardCode || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.age || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.nativePlace || '---'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="charge" label="管理费">
          <template slot-scope="scope">
            <span>{{`${scope.row.charge || 0} %`}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="phone" label="手机号">
          <template slot-scope="scope">
            <span v-if="scope.row.phone.indexOf('LOGOUT') > -1">
              <el-tooltip class="item" effect="dark" content="已注销" placement="top-start">
                <span style="color:red">{{ (scope.row.phone || '').substr(6) }}</span>
              </el-tooltip>
            </span>
            <span v-else>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户总额">
          <template slot-scope="scope">
            <span>{{ numberFormat(numAdd(scope.row.usable || 0,scope.row.investment || 0))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usable" label="账户余额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.usable)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investment" label="在投金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.investment)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预期收益">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.lendStatistics && scope.row.lendStatistics.expectIncome)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="freeze" label="冻结金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.freeze)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstMoney" label="首投金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.firstMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstTime" label="首投时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.firstTime && getTime(scope.row.firstTime) || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="电子合同">
          <template slot-scope="scope">
            <span :style="!scope.row.isContract && 'color:red'">{{scope.row.isContract?'已开户':'未开户'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="存管开户" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="!scope.row.isOpen && 'color:red'">{{scope.row.isOpen?'已开户':'未开户'}}</span>
            <span>(<i :style="!scope.row.signFlag ? 'color: red;': ''">{{scope.row.signFlag ? '已签约':'未签约'}}</i>/<i :style="!scope.row.withdrawAuthFlag ? 'color: red;': ''">{{scope.row.withdrawAuthFlag ? '已提现授权':'未提现授权'}}</i>/<i :style="!scope.row.rechargeAuthFlag ? 'color: red;': ''">{{scope.row.rechargeAuthFlag ? '已充值授权':'未充值授权'}}</i>)</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" show-overflow-tooltip>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="rules" label-width="120px">
          <template v-if="dialogType === 'setType'">
            <ServiceSelect v-model="dialogBaseForm.dataType" placeholder="请选择数据类型" queryArg="platform_data_type" queryType="typeEnum"></ServiceSelect>
          </template>
          <template v-if="dialogType === 'changeBank'">
            <!-- <el-form-item label="开户行省份" prop="province">
              <el-select v-model="dialogBaseForm.province" filterable placeholder="请选择省份" @change="provinceChange">
                <el-option v-for="item in province" :key="item.parRegionId" :label="item.parRegionName" :value="item.parRegionId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户行城市" prop="cityId">
              <el-select v-model="dialogBaseForm.cityId" filterable placeholder="请选择城市" :disabled="!dialogBaseForm.province">
                <el-option v-for="item in city" :key="item.regionCode" :label="item.regionName" :value="item.regionCode">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="开户行行别" prop="bankId">
              <el-select v-model="dialogBaseForm.bankId" filterable placeholder="请选择银行">
                <el-option v-for="item in bank" :key="item.code" :label="item.name" :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新银行卡号" prop="bankNum">
              <el-input v-model="dialogBaseForm.bankNum">
                <span slot="suffix"></span>
              </el-input>
            </el-form-item>
            <el-form-item label="预留手机号" prop="phone">
              <el-input v-model="dialogBaseForm.phone">
                <span slot="suffix"></span>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="新银行卡号人照片(jpg格式)" prop="newPicture">
              <Upload4 v-model="dialogBaseForm.newPicture" :width="100" :size="3"></Upload4>
            </el-form-item>
            <el-form-item label="老银行卡号人照片(jpg格式)" prop="oldPicture">
              <Upload4 v-model="dialogBaseForm.oldPicture" :width="100" :size="3"></Upload4>
            </el-form-item> -->
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
            <el-form-item label="管理费比例" prop="charge">
              <el-input v-model="dialogBaseForm.charge" type="number">
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </template>
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
  import Header from '../../components/TableListHeader.vue'
  import {
    baseFormRules
  } from '@/business/rules'

  export default {
    name: 'user-investor-list',
    components: {
      Header
    },
    data() {
      return {
        rules: baseFormRules.dialogRules,
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
          text: '注册手机',
          type: 'text'
        }, {
          para: 'openTime',
          text: '开户时间起|开户时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['openStartTime', 'openEndTime']
          }
        }, {
          para: 'registerTime',
          text: '注册时间起|注册时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['registerStartTime', 'registerEndTime']
          }
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }],
        dialogType: '',
        province: [],
        city: [],
        bank: [],
      }
    },
    created() {
      this.getList()
      // 获取省份
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_REGION']
      }).then(data => {
        this.province = data.result
      })
      // 获取银行
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_BANK']
      }).then(data => {
        this.bank = data.result
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
      // 省份选择改变事件
      provinceChange() {
        this.dialogBaseForm.cityId = ''
        // 获取城市列表
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_CITY'],
          data: this.dialogBaseForm.province
        }).then(data => {
          this.city = data.result
        })
      },
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogSetManagerAmount':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '设置账户管理费'
            this.dialogBaseStatus = true
            this.dialogBaseForm.userId = row[0].Id
            this.dialogBaseForm.charge = row[0].charge || 0
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
          case 'dialogChangeBank':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogType = 'changeBank'
            this.dialogTitle = '更换银行卡'
            this.dialogBaseStatus = true
            this.dialogBaseForm.userId = row[0].Id
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
              if (valid) {
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.$message.success('操作成功')
                  this.dialogBaseStatus = false
                  this.getList()
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
        this.$refs.dialogBaseForm.resetFields()
        this.dialogType = ''
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
              this.table.loading = true
              this.$request({
                url: action.apiUrl,
                data
              }).then(data => {
                this.table.loading = false
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
                  })
                } else {
                  this.$message.success('操作成功')
                  this.getList()
                }
              }).catch(() => {
                this.table.loading = false
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
              const header_key = ['昵称', '姓名', '身份证', '年龄', '籍贯', '管理费比例', '手机号', '账户总额', '账户余额', '在投金额', '首投金额', '首投时间', '电子合同', '开户状态', '注册时间','开户时间','预期收益']
              const header_value = ['nickName', 'realName', 'idcardCode', 'age', 'nativePlace', 'charge', 'phone', 'accountAllMoney', 'usable', 'investment', 'firstMoney', 'firstTime', 'isContract', 'isOpen', 'createTime','openTime','expectIncome']
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
                        i.accountAllMoney = this.numAdd(i.usable || 0, i.investment || 0)
                        i.expectIncome = this.numAdd(i.lendStatistics && i.lendStatistics.expectIncome || 0)
                        i.firstTime = i.firstTime && this.getTime(i.firstTime)
                        i.openTime = i.openTime && this.getTime(i.openTime)
                        i.isContract = i.isContract ? '已开户' : '未开户'
                        i.isOpen = i.isOpen ? '已开户' : '未开户'
                      })
                    } catch (error) {
                      console.error(error)
                    }
                    this.exportExcel({
                      title: `${index+1}-和掌柜-出借人列表`,
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

            // 重置评测记录
          case 'execute_risk_reset':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('是否继续?', '重置用户的评测次数', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: {
                  dataId: row[0].Id,
                  count: 1
                }
              }).then(data => {
                this.$message.success('操作成功')
                this.getList()
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
                      用户: <span>${row[0].realName}</span> <span ${ (data.result['账户状态'] == '禁用')?'style="color:red"':''}></span> (状态: ${data.result['账户状态']})<br />
                      可用余额(平台/存管): <span ${ yl?'style="color:red"':''}>${this.numberFormat(row[0].usable)}/${data.result && this.numberFormat(data.result['可用余额'])}</span> <span ${ yl?'style="color:red"':''}>差值: ${yl_c}</span><br/>
                      冻结金额(平台/存管): <span ${ dj?'style="color:red"':''}>${this.numberFormat(row[0].freeze)}/${data.result && this.numberFormat((data.result['冻结余额']))}</span> <span ${ dj?'style="color:red"':''}>差值: ${dj_c}</span><br/>
                  </div>`,
                duration: 0,
                type: 'info',
                offset: 50
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
