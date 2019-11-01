<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" >

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="imgUrl" label="签章">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" alt="" width="300" height="60" style="width:100%">
          </template>
        </el-table-column>
        <el-table-column prop="resId" label="第三方标识">
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="自定义上传">
            <Upload2 v-model="dialogBaseForm.imgUrl" :size="0.1"></Upload2>
          </el-form-item>
          <el-form-item label="默认签章">
            <div ref="canImg">
              <i style="border:1px solid #B8BCC5; color: red;line-height:24px;display:inline-block;padding: 2px 6px;border-radius:10%;font-weight:bolder;">{{this.$route.query.name}}</i>
            </div>
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
  import html2canvas from 'html2canvas'
  export default {
    data() {
      return {
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        dialogBaseStatus: false,
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        tableListQuery: this.$route.query.id,
        contractAccountList: [], // 电子合同账户列表
        defImgUrl: ''
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
            this.dialogTitle = '新增签章'
            this.dialogBaseStatus = true
            setTimeout(() => {
              this.createImg()
            }, 500)
            break

          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.dialogBaseForm.accountId = this.$route.query.id
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
        this.dialogBaseForm = {}
        this.$refs.dialogBaseForm.resetFields()
        this.contractAccountList = []
      },
      // 电子合同账户下拉选择事件
      contractChange(e) {
        this.dialogBaseForm.accountName = e.name
        this.dialogBaseForm.accountId = e.Id
        this.dialogBaseForm.accountResId = e.resId
        this.dialogBaseForm.templateId = this.$route.query.id
      },
      createImg() {
        html2canvas(this.$refs.canImg, {
          background: '#000000'
        }).then((canvas) => {
          console.log(canvas.toDataURL('image/png'))
          this.defImgUrl = canvas.toDataURL('image/png')
        })
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
