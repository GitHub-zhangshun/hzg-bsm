<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="名称" fixed>
        </el-table-column>
        <el-table-column prop="gradeName" label="等级">
        </el-table-column>
        <el-table-column prop="pic" label="图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.pic" alt="" width="100px">
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.type && getDicTitleById(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="joinType" label="获取条件">
          <template slot-scope="scope">
            <span>{{scope.row.joinType && getDicTitleById(scope.row.joinType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量">
        </el-table-column>
        <el-table-column prop="surplusCount" label="剩余数量">
        </el-table-column>
        <el-table-column label="权重">
          <template slot-scope="scope">
            <span>{{(scope.row.weightVal || '无') + '/' + (scope.row.weight || '无') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效时间">
          <template slot-scope="scope">
            <span>{{scope.row.validDay || 0 }} 天</span>
          </template>
        </el-table-column>
        <el-table-column label="起止时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.startTime && getTime(scope.row.startTime) }} - {{scope.row.endTime && getTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isUse ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作" width="150px" fixed="right">
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
        <div class="wrapper" style="max-height: 500px;overflow:auto;">
          <el-form :model="dialogBaseForm" ref="dialogBaseForm" status-icon :rules="baseFormRules.dialogRules" label-width="100px">
            <el-form-item label="奖品字典匹配">
              <el-select v-model="dialogBaseForm.prizeId" placeholder="请选择优惠券" @change="prizeDicChange">
                <el-option v-for="item in prizeDic" :key="item.Id" :label="item.name" :value="item.Id">
                  <span style="float: left">{{  getDicTitleById(item.type)  }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="等级" prop="gradeName">
              <el-input v-model="dialogBaseForm.gradeName"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <ServiceSelect v-model="dialogBaseForm.type" placeholder="请选奖品类型" queryArg="prize_type"></ServiceSelect>
            </el-form-item>
            <el-form-item label="图片" prop="pic">
              <Upload4 v-model="dialogBaseForm.pic" :width="100"></Upload4>
            </el-form-item>
            <el-form-item label="获取条件" prop="joinType">
              <ServiceSelect v-model="dialogBaseForm.joinType" placeholder="请选获取条件" queryArg="activity_type"></ServiceSelect>
            </el-form-item>
            <el-form-item label="数量" prop="count">
              <el-input v-model="dialogBaseForm.count"></el-input>
            </el-form-item>
            <el-form-item label="权重" prop="weight">
              <el-input v-model="dialogBaseForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="权重值" prop="weightVal">
              <el-input v-model="dialogBaseForm.weightVal"></el-input>
            </el-form-item>
            <el-form-item label="奖品有效时间" prop="validDay">
              <el-input v-model="dialogBaseForm.validDay">
                <span slot="suffix">天</span>
              </el-input>
            </el-form-item>
            <el-form-item label="可参与时间段" prop="time">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" clearable v-model="dialogBaseForm.time" type="datetimerange" range-separator="至" start-placeholder="启用日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="描述" prop="describe">
              <el-input v-model="dialogBaseForm.describe"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="isUse">
              <el-select v-model="dialogBaseForm.isUse" placeholder="请选择">
                <el-option label="启用" value="true"></el-option>
                <el-option label="禁用" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 兑奖码上传 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="code.dialog.title" :visible.sync="code.dialog.status">
        <div class="wrapper" style="max-height: 500px;overflow:auto;">
          <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"></upload-excel-component>
          <el-card style="margin-top:3px;">
            <div class="text item">
              <el-table stripe @row-dblclick="pitchRow" ref="table" :data="tableData" height="400" border highlight-current-row style="width: 100%;margin-bottom:2px;">
                <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="code.dialog.status = false">取 消</el-button>
          <el-button type="primary" @click="codeSub" :loading="code.dialog.loading">确 定</el-button>
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
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    components: {
      UploadExcelComponent
    },
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
          isUse: 'true',
          time: []
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'keyword',
          text: '名称',
          type: 'text'
        }],
        tableListQuery: {
          dataId: this.$route.query.id
        },
        couponDic: [],
        bidTypeList: [],
        code: {
          dialog: {
            title: '上传兑奖码',
            status: false,
            row: {},
            loading: false
          }
        },
        tableData: [],
        tableHeader: [],
        prizeDic: []
      }
    },
    created() {
      this.getList()
      // 获取奖品字典
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_PRIZE_DIC'],
        data: {
          num: 1,
          size: 10000
        }
      }).then(data => {
        this.prizeDic = data.result
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
          case 'add':
            this.dialogTitle = '新增奖品'
            this.dialogBaseStatus = true
            break

          case 'edit':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              // 获取已有的数据
              this.$request({
                url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
                data: row[0].Id
              }).then(data => {
                data.result.time = [data.result.startTime, data.result.endTime]
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改奖品'
                this.dialogBaseForm.isUse = data.result.isUse.toString()
                this.dialogBaseStatus = true
              })
            }
            break
          case 'uploadCode':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.tableData = []
            this.tableHeader = []
            this.code.dialog.row = row[0]
            this.code.dialog.status = true
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
                // 获取时间
                this.dialogBaseForm.startTime = this.dialogBaseForm.time && this.dialogBaseForm.time[0]
                this.dialogBaseForm.endTime = this.dialogBaseForm.time && this.dialogBaseForm.time[1]
                this.dialogBaseForm.activityId = this.$route.query.id
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
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
        this.dialogBaseForm = {
          isUse: 'true',
          time: []
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      // 带参数基础路由跳转事件
      func_jump(action, row) {
        if (row.length !== 1) {
          this.$message.info('请选择一条数据')
          return
        }
        // 构建跳转参数
        const query = {
          id: row[0].Id || row[0].id,
          name: row[0].title || row[0].name || row[0].bidName || row[0].enterpriseName || row[0].realName || this.$route.query.name || row[0].providerName,
          activeId: this.$route.query.id
        }
        this.$router.push({
          name: action.routeUrl,
          query
        })
      },
      // 通用执行
      func_execute(action, row) {
        switch (action.routeUrl) {
          // 库存初始化
          case 'init':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('初始化兑奖码, 是否继续?', '兑奖码初始化', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                data.result ? this.$message.success('初始化成功') : this.$message.error(data.message || '未获取到失败信息')
                this.getList()
              })
            })
            break;

          default:
            break;
        }
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },
      handleSuccess({
        results,
        header
      }) {
        this.tableData = results
        this.tableHeader = header
        console.log('con', results)
        console.log('hea', header)
      },
      codeSub() {
        let codeList = []
        this.tableData.forEach(item => {
          this.tableHeader.forEach(j => {
            codeList.push(item[j])
          })
        })
        this.code.dialog.loading = true
        this.$request({
          url: this.currentDialogUrl,
          data: {
            dataId: this.code.dialog.row.Id,
            itemList: codeList
          }
        }).then(data => {
          data.result ? this.$message.success('初始化成功') : this.$message.error(data.message || '未获取到失败信息')
          this.code.dialog.loading = false
          this.code.dialog.status = !data.result
          this.getList()
        })
      },
      prizeDicChange(e) {
        this.dialogBaseForm = JSON.parse(JSON.stringify(this.prizeDic.find(i => i.Id === e)))
        this.dialogBaseForm.prizeId = e
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
