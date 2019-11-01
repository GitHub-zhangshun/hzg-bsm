<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%" v-if="!this.$route.meta.simplify">所属类型:{{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- tree table list -->
      <tree-table :data="table.list" v-loading="table.loading" border :firstTitle="customText.firstTitle">
        <el-table-column v-if="!$route.meta.simplify" label="简化序列号" prop="simplify">
        </el-table-column>
        <el-table-column v-if="!$route.meta.simplify || $route.meta.simplify === 'platform_risk_level'" prop="subhead" :label="customText.subhead">
        </el-table-column>
        <el-table-column :label="customText.remark" prop="remark" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :label="customText.extend" prop="extend" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" width="80px;">
          <template slot-scope="scope">
            <span>{{scope.row.isUse?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0">
          <template slot="header" slot-scope="scope">
            <el-input v-model="ramSearchForm.query" placeholder="标题或者序列号" :clearable="true">
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
          </template>
        </el-table-column>
      </tree-table>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="{simplify: [{ required: true, trigger: 'blur', message: '简化序列号不能为空' }]}" label-width="100px">
          <el-form-item label="父级">
            <el-treeselect v-model="changeTypeItem" placeholder="请输入搜索内容" :data="table.list" :props="typeItemProps" :isEdit="true" @nodeClick="typeItemClick">
            </el-treeselect>
            <el-button @click="resetTop">置为顶级</el-button>
          </el-form-item>
          <el-form-item :label="customText.firstTitle" prop="title">
            <el-input v-model="dialogBaseForm.title"></el-input>
          </el-form-item>
          <el-form-item :label="customText.remark" prop="remark">
            <el-input type="textarea" v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="简化序列号" prop="simplify">
            <el-input v-model="dialogBaseForm.simplify"></el-input>
          </el-form-item>
          <el-form-item v-if="!$route.meta.simplify || $route.meta.simplify === 'platform_risk_level'" :label="customText.subhead" prop="subhead">
            <el-input v-model="dialogBaseForm.subhead"></el-input>
          </el-form-item>
          <el-form-item :label="customText.extend" prop="extend">
            <el-input v-model="dialogBaseForm.extend"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isUse">
            <el-select v-model="dialogBaseForm.isUse" placeholder="请选择状态">
              <el-option label="启用" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
            </el-select>
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
  import treeTable from '@/components/TreeTable'
  import elTreeselect from 'el-tree-select'
  import {
    baseFormRules
  } from '@/business/rules.js'
  export default {
    data() {
      return {
        baseFormRules,
        table: {
          list: [],
          tempList: [],
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
          sort: '1'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: {
          queryType: '2', // 通过ID查询
          queryValue: this.$route.query.id
        },
        ramSearchForm: {},
        // 树形列表属性配置
        typeItemProps: {
          label: 'title',
          value: 'id'
        },
        // 新增、修改选中的父级类型
        changeTypeItem: '请选择'
      }
    },
    components: {
      elTreeselect,
      treeTable
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList'
      ]),
      customText() {
        let textObj = {}
        switch (this.$route.meta.simplify) {
          case 'bid_template_info':
            // 披露模板信息
            textObj.firstTitle = '名称'
            textObj.remark = '内容'
            textObj.extend = '类型'
            textObj.subhead = '副标题'
            break;

          case 'investor_risk_evaluation':
            // 风险评测信息
            textObj.firstTitle = '问题'
            textObj.remark = '选项'
            textObj.extend = '分值'
            textObj.subhead = '副标题'
            break;

          case 'platform_risk_level':
            // 风险评测信息
            textObj.firstTitle = '等级'
            textObj.remark = '等级说明'
            textObj.extend = '分数(分)'
            textObj.subhead = '在投额度(万)'
            break;

          default:
            // 默认
            textObj.firstTitle = '名称'
            textObj.remark = '备注'
            textObj.extend = '扩展字段'
            textObj.subhead = '副标题'
            break;
        }
        return textObj
      }
    },
    watch: {
      'ramSearchForm.query': function(nd) {
        this.ramSearch()
      },
      'table.list': function(nd) {
        if (this.table.tempList.length === 0) {
          this.table.tempList = JSON.parse(JSON.stringify(this.table.list))
        }
      }
    },
    created() {
      if (this.$route.meta.simplify) {
        this.tableListQuery = {
          queryType: '1', // 通过简化序列号
          queryValue: this.$route.meta.simplify
        }
      }
      this.getList()
    },
    methods: Object.assign(_func(), {
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAdd':
            this.dialogTitle = '新增类型子集'
            this.dialogBaseStatus = true
            this.dialogBaseForm.sort = this.table.list.length + 1
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
                this.dialogBaseStatus = true
                this.dialogTitle = '修改状态子集'
                this.changeTypeItem = row[0].parentId === '0' ? '请选择' : '保持当前父级'
              })
            }
            break

          default:
            break
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base': // 新增或者修改弹窗提交
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                // 添加归属状态
                this.dialogBaseForm.typeId = this.$route.query.id || this.$route.meta.simplify
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

          case 'relate': // 分配状态字典关联弹窗提交
            // 构建数据
            const data = {
              currentId: this.currentRow.Id,
              correlations: this.ownRelatedStatus
            }
            this.$request({
              url: this.currentDialogUrl,
              data
            }).then(() => {
              this.dialogRelateStatus = false
            })
            break

          default:
            break
        }
      },
      // 树形下拉点击事件
      typeItemClick(e) {
        // 将ID 添加到表单父ID
        this.dialogBaseForm.parentId = e.Id
        this.dialogBaseForm.sort = e.sort + 1
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          isUse: 'true',
          sort: '1'
        }
        this.changeTypeItem = '请选择'
        this.$refs.dialogBaseForm.resetFields()
      },
      // 内存搜索
      ramSearch() {
        if (this.ramSearchForm.query) {
          this.table.list = []
          this.treeQuery(this.table.tempList)
        } else {
          this.getList()
        }
      },
      // 递归检索
      treeQuery(obj) {
        JSON.parse(JSON.stringify(obj)).map(i => {
          if (i.title.indexOf(this.ramSearchForm.query) > -1 || i.simplify.indexOf(this.ramSearchForm.query) > -1 || (i.remark && i.remark.indexOf(this.ramSearchForm.query) > -1)) {
            this.table.list.push(JSON.parse(JSON.stringify(i)))
            this.table.list.find(j => j.Id === i.Id).children = []
          }
          // 递归子集
          if (i.children && i.children.length > 0) {
            this.treeQuery(i.children)
          }
        })
      },
      // 修改-将父级ID重置为顶级
      resetTop() {
        console.log('1')
        this.dialogBaseForm.parentId = '0'
        this.changeTypeItem = '请选择'
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
