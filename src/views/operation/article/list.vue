<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="articleType" label="类型">
          <template slot-scope="scope">
            {{getDicTitleById(scope.row.articleType)}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="sketch" show-overflow-tooltip label="摘要">
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间">
        </el-table-column>
        <el-table-column prop="createName" label="发布人">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <span>{{props.row.Id}}</span>
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dialogBaseForm.name"></el-input>
          </el-form-item>
          <el-form-item label="登录名" prop="userName">
            <el-input v-model="dialogBaseForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogBaseForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialogBaseForm.email"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="dialogBaseForm.address"></el-input>
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
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
            para: 'title',
            text: '标题',
            type: 'text'
          },
          {
            para: 'articleTypeItemId',
            text: this.$route.meta.name,
            type: 'sys_enum',
            details: {
              type: 'typeEnum',
              path: 'platform_article',
              parPath: this.$route.meta.simplify
            }
          }
        ],
        tableListQuery: {
          articleType: this.$route.meta.simplify
        }
      }
    },
    created() {
      this.getList()
    },
    watch: {
      'searchForm.articleTypeItemId': function(nd) {
        if (nd) {
          this.tableListQuery.articleType = nd
        } else {
          this.tableListQuery.articleType = this.$route.meta.simplify
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList',
        'baseRunFuncList'
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
            this.dialogTitle = '新增用户'
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
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改用户'
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
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          isUse: 'true',
          isShow: 'true',
          isDelay: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      // 重置公共跳转方法
      func_jump(action, row) {
        // 修改
        if (action.keyName === 'edit' && row.length !== 1) {
          this.$message.info('请选择一条数据')
          return
        }
        console.log(row)
        // 构建跳转参数
        const query = {
          simplify: this.$route.meta.simplify,
          name: this.$route.meta.name,
          id: row.length > 0 && row[0].Id || ''
        }
        this.$router.push({
          name: action.routeUrl,
          query
        })
      },
    })
  }
</script>

<style lang="scss" scoped>
  .search-form-item {
    padding: 0;
    margin: 0;
  }

  .typeSelect {
    width: 20%;
    margin-top: 1px;
  }
</style>
