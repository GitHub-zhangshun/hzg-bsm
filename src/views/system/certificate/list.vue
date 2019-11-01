<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="clientTitle" label="客户端">
        </el-table-column>
        <el-table-column prop="versionsTitle" label="版本标题">
        </el-table-column>
        <el-table-column prop="newVersions" label="最新版本">
        </el-table-column>
        <el-table-column prop="mid" label="开发者编号">
        </el-table-column>
        <el-table-column prop="publicKey" label="公钥">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="isSso" label="单点登录">
          <template slot-scope="scope">
            <span>{{scope.row.isSso?'是':'否'}}</span>
          </template>
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
          <el-form-item label="客户端" prop="source">
            <el-select v-model="dialogBaseForm.clientId" placeholder="请选择客户端" @change="clientChange">
              <el-option v-for="item in clientList" :key="item.Id" :label="item.title" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本" prop="versionsId">
            <el-select v-model="dialogBaseForm.versionsId" placeholder="请选择版本">
              <el-option v-for="item in clientVerList" :key="item.Id" :label="item.title" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogBaseForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isUse">
            <el-select v-model="dialogBaseForm.isUse" placeholder="请选择状态">
              <el-option label="启用" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
            </el-select>
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
        clientList: [],
        clientVerList: []
      }
    },
    created() {
      this.getList()
      // 获取客户端
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_CLIENT_LIST'],
        data: {
          num: '1',
          size: '1000'
        }
      }).then(data => {
        this.clientList = data.result
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
            this.dialogTitle = '新增证书'
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
                data.result.isUse = data.result.isUse && data.result.isUse.toString()
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改证书'
                this.dialogBaseStatus = true
                // 获取版本列表
                this.clientChange(data.result.clientId)
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
          isUse: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      // 通用执行
      func_execute(action, row) {
        if (row.length !== 1) {
          this.$message.info('请选择一条数据')
        } else {
          switch (action.routeUrl) {
            case 'execute_cz': // 重置
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(() => {
                this.$message.success('重置成功')
                this.getList()
              })
              break;

            case 'execute_cksy': // 查看私钥
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                this.$notify({
                  title: `来源:${data.result.clientTitle}`,
                  message: data.result.privateKey,
                  offset: 100
                })
              })
              break

            default:
              break;
          }
        }
      },
      // 客户端选项触发
      clientChange(e) {
        // 获取版本
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_CLIENT_VER_LIST'],
          data: {
            clientId: e,
            num: '1',
            size: '10000'
          }
        }).then(data => {
          this.clientVerList = data.result
          // this.dialogBaseForm.versionsId = ''
        })
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
