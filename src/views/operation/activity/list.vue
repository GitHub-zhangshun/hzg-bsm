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
        <el-table-column prop="banner" label="图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.banner" alt="" width="100px">
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isUse ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="活动类型">
          <template slot-scope="scope">
            <span>{{scope.row.type && getDicTitleById(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖励类型">
          <template slot-scope="scope">
            <span>{{scope.row.rewardType && getDicTitleById(scope.row.rewardType)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{(scope.row.startTime || scope.row.endTime) && `${getTime(scope.row.startTime)} - ${getTime(scope.row.endTime)}`}}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示类型">
          <template slot-scope="scope">
            <span>{{scope.row.showType === 1 ? '长期显示' : (scope.row.showType === 2 ? '结束前显示' : '开始后显示')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="key">
        </el-table-column>
        <el-table-column prop="link" label="PC链接" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="h5Link" label="H5链接" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="describe" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip>
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
        <div class="wrapper" style="height:600px;overflow:auto;">
          <el-form :model="dialogBaseForm" ref="dialogBaseForm" status-icon :rules="baseFormRules.dialogRules" label-width="100px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="banner">
              <Upload4 v-model="dialogBaseForm.banner" :width="100"></Upload4>
            </el-form-item>
            <!-- <el-form-item label="活动类型" prop="type">
            <ServiceSelect v-model="dialogBaseForm.type" placeholder="请选择活动类型" queryArg="activity_type"></ServiceSelect>
          </el-form-item>
          <el-form-item label="奖励类型" prop="rewardType">
            <ServiceSelect v-model="dialogBaseForm.rewardType" placeholder="请选择奖励类型" queryArg="activity_reward_type"></ServiceSelect>
          </el-form-item> -->
            <el-form-item label="时间" prop="time">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="dialogBaseForm.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="isUse">
              <el-select v-model="dialogBaseForm.isUse" placeholder="请选择">
                <el-option label="启用" value="true"></el-option>
                <el-option label="禁用" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示类型" prop="showType">
              <el-select v-model="dialogBaseForm.showType" placeholder="请选择">
                <el-option label="长期显示" value="1"></el-option>
                <el-option label="结束前显示" value="2"></el-option>
                <el-option label="开始后显示" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="key" prop="key">
              <el-input v-model="dialogBaseForm.key"></el-input>
            </el-form-item>
            <el-form-item label="PC链接" prop="link">
              <el-input v-model="dialogBaseForm.link"></el-input>
            </el-form-item>
            <el-form-item label="H5链接" prop="h5Link">
              <el-input v-model="dialogBaseForm.h5Link"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="describe">
              <el-input type="textarea" :rows="2" placeholder="请输入描述" v-model="dialogBaseForm.describe">
              </el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="dialogBaseForm.remark"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="dialogBaseForm.sort"></el-input>
            </el-form-item>
          </el-form>
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
        dialogBaseForm: {
          isUse: 'true',
          showType: '1',
          time: []
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '名称',
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
            this.dialogTitle = '新增活动'
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
                data.result.time = [data.result.startTime, data.result.endTime]
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改活动'
                this.dialogBaseForm.isUse = data.result.isUse.toString()
                this.dialogBaseForm.showType = data.result.showType.toString()
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
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                // 获取时间
                this.dialogBaseForm.startTime = this.dialogBaseForm.time && this.dialogBaseForm.time[0]
                this.dialogBaseForm.endTime = this.dialogBaseForm.time && this.dialogBaseForm.time[1]
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
          showType: '1',
          time: []
        }
        this.$refs.dialogBaseForm.resetFields()
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
