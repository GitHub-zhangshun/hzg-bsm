<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="simplify" label="简化序列号">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="isUse" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isUse?'启用':'禁用'}}</span>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="简化序列号" prop="simplify">
            <el-input v-model="dialogBaseForm.simplify"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="dialogBaseForm.typeId" placeholder="请选择类型" @change="typeSelectChange">
              <el-option v-for="type in typeList" :key="type.Id" :label="type.title" :value="type.Id"></el-option>
            </el-select>
          </el-form-item>
          <div style="max-height: 200px;overflow:auto;">
            <el-form-item v-if="dialogBaseForm.typeId">
              <el-row style="border:1px solid #D1D5DE;padding:10px;border-radius:5px;">
                <el-input :placeholder="`请输入${key.remark}`" size="mini" v-for="key in keyList" :key="key.Id" v-model="key.keyValue">
                  <template slot="prepend">{{key.remark}}({{key.keyName}})</template>
                </el-input>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item label="状态" prop="isUse">
            <el-select v-model="dialogBaseForm.isUse" placeholder="请选择状态">
              <el-option label="启用" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="dialogBaseForm.sort"></el-input>
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
          isUse: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        typeList: [], // 类型列表
        keyList: [] // key列表
      }
    },
    created() {
      this.getList()
      // 获取所有的类型列表
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_TYPE_LIST']
      }).then(data => {
        this.typeList = data.result
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
          case 'dialogAdd':
            this.dialogTitle = '新增配置'
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
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改配置'
                this.dialogBaseStatus = true
                // 将content数据绑定到 keyList
                this.keyList = this.typeList.find(item => item.Id === data.result.typeId).keyList
                const contentObj = JSON.parse(data.result.content)
                this.keyList.map(item => {
                  item['keyValue'] = contentObj[item.keyName]
                })
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
            // 构建content数据
            const content = {}
            this.keyList.map(item => {
              content[item.keyName] = item.keyValue
            })
            // 将content 加入到form
            this.dialogBaseForm.content = JSON.stringify(content)
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
      // 新增修改弹窗关闭事件 ===>  这里有keyList 使用页面的 不适用公共的
      dialogBaseClose() {
        this.dialogBaseForm = {
          isUse: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
        this.keyList = []
      },
      // 类型下拉框点击事件
      typeSelectChange(e) {
        // 获取对应的keyList
        this.keyList = this.typeList.find(item => item.Id === e).keyList
        // 在keyList 添加一个kev_v 保存输入的对应key-value
        this.keyList.map(item => {
          item.keyValue = ''
        })
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
