<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="功能名称">
        </el-table-column>
        <el-table-column prop="cssClass" label="样式">
          <template slot-scope="scope">
            <el-tag :type="scope.row.cssClass">{{scope.row.cssClass}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="funcName" label="函数名称">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示">
          <template slot-scope="scope">
            <span>{{scope.row.isShow?'显示':'隐藏'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isUse" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isUse?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序">
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
          <el-form-item label="功能样式" style="width:1000px" size="mini">
            <el-radio-group v-model="dialogBaseForm.cssClass" :fill="radioFill" @change="radioChange">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="primary">主要</el-radio-button>
              <el-radio-button label="success">成功</el-radio-button>
              <el-radio-button label="info">信息</el-radio-button>
              <el-radio-button label="warning">警告</el-radio-button>
              <el-radio-button label="danger">危险</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="函数名称">
            <el-input v-model="dialogBaseForm.funcName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="功能名称">
            <el-input v-model="dialogBaseForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="功能描述">
            <el-input v-model="dialogBaseForm.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-select v-model="dialogBaseForm.isShow" placeholder="请选择">
              <el-option label="显示" value="true">
              </el-option>
              <el-option label="隐藏" value="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dialogBaseForm.isUse" placeholder="请选择">
              <el-option label="启用" value="true">
              </el-option>
              <el-option label="禁用" value="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="dialogBaseForm.sort" auto-complete="off"></el-input>
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
          cssClass: 'primary',
          isShow: 'true',
          isUse: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        /** 单选按钮激活填充颜色 */
        radioFill: ''
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList'
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
            this.dialogTitle = '新增功能'
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
                data.result.isUse = data.result.isUse.toString()
                data.result.isShow = data.result.isShow.toString()
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改功能'
                this.dialogBaseStatus = true
                this.radioChange(data.result.cssClass)
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
            // 添加状态枚举字段
            this.dialogBaseForm.affiliationType = this.affiliationType
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
      /** dialog 关闭初始化数据 */
      dialogClose() {
        // 重置表单
        this.$refs.dialogBaseForm.resetFields()
        this.dialogBaseForm = {
          cssClass: 'primary'
        }
      },
      /** dialog样式单选按钮改变事件 */
      radioChange(e) {
        switch (e) {
          case 'primary':
            this.radioFill = '#4BA2F9'
            break
          case 'success':
            this.radioFill = '#6DBE4C'
            break
          case 'info':
            this.radioFill = '#909399'
            break
          case 'warning':
            this.radioFill = '#E2A04F'
            break
          case 'danger':
            this.radioFill = '#F16E72'
            break
          default:
            this.radioFill = '#D8CCB3'
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          cssClass: 'primary',
          isShow: 'true',
          isUse: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      }
    })
  }
</script>
