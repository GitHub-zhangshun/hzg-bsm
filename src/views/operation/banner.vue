<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="title" label="名称">
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgLink" alt="" width="300" height="60" style="width:100%" @click="showImg(scope.row.imgLink)">
          </template>
        </el-table-column>
        <el-table-column prop="portId" label="客户端">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.portId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="showType" label="显示位置">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.showType)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="跳转链接">
        </el-table-column>
        <el-table-column prop="sort" label="排序">
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
        <div style="height:500px;overflow:auto;">
          <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="100px">
            <el-form-item label="名称" prop="title">
              <el-input v-model="dialogBaseForm.title"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imgLink">
              <Upload2 v-model="dialogBaseForm.imgLink" :size="2"></Upload2>
            </el-form-item>
            <el-form-item label="客户端">
              <template v-if="dialogType === 'add'">
                <el-select v-model="dialogBaseForm.portIds" multiple placeholder="客户端">
                  <el-option v-for="item in portEnumList" :key="item.Id" :disabled="!item.isUse" :label="item.title" :value="item.Id">
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                <ServiceSelect :key="dialogBaseForm.portId" v-model="dialogBaseForm.portId" placeholder="客户端" queryArg="banner_show_port"></ServiceSelect>
              </template>
            </el-form-item>
            <el-form-item label="显示位置" prop="showType">
              <ServiceSelect :key="dialogBaseForm.showType" v-model="dialogBaseForm.showType" placeholder="显示位置" queryArg="banner_show_position"></ServiceSelect>
            </el-form-item>
            <el-form-item label="生效时间">
              <el-date-picker v-model="time" type="daterange" align="right" unlink-panels :default-time="['00:00:00', '23:59:59']" range-separator="至" start-placeholder="生效时间" end-placeholder="生效时间" :picker-options="pickerOptions" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跳转链接" prop="link">
              <el-input v-model="dialogBaseForm.link"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="isUse">
              <el-select v-model="dialogBaseForm.isUse" placeholder="是否启用">
                <el-option label="启用" value="true"></el-option>
                <el-option label="禁用" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="dialogBaseForm.sort"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')" :loading="btnLoading">确 定</el-button>
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
    pickerOptions
  } from '@/business/baseConst'
  import {
    baseFormRules
  } from '@/business/rules.js'
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
          isUse: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'title',
          text: '名称',
          type: 'text'
        }, {
          para: 'showType',
          text: '位置',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'banner_show_position'
          }
        }, {
          para: 'portId',
          text: '客服端',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'banner_show_port'
          }
        }, {
          para: 'isUse',
          text: '状态',
          type: 'bool_enum',
          details: {
            parse: ['启用', '禁用']
          }
        }],
        time: null,
        pickerOptions, // 时间组件 右侧快捷选项设置
        portEnumList: [],
        dialogType: 'add',
        btnLoading: false
      }
    },
    watch: {
      time(newTime) {
        if (newTime) {
          this.dialogBaseForm.startTime = newTime[0]
          this.dialogBaseForm.endTime = newTime[1]
        } else {
          this.dialogBaseForm.startTime = null
          this.dialogBaseForm.endTime = null
        }
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
      getProtEnum() {
        this.getTypeEnum(this.$store.getters.baseRunFuncList['O_TYPE_ENUM_LIST'], 'banner_show_port', '').then(data => {
          this.portEnumList = data
        })
      },
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogAdd':
            // 获取客服端枚举
            this.getProtEnum()
            this.dialogTitle = '新增banner'
            this.dialogType = 'add'
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
                // console.log(data.result.isUse.toString())
                data.result.isUse = data.result.isUse.toString()
                this.dialogBaseForm = data.result
                this.dialogTitle = '修改banner'
                this.dialogType = 'edit'
                this.dialogBaseStatus = true
                this.time = [data.result.startTime, data.result.endTime]
              })
            }
            break

          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        console.log(this.dialogBaseForm)
        switch (name) {
          case 'base':
            this.$refs.dialogBaseForm.validate(valid => {
              if (valid) {
                this.btnLoading = true
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.btnLoading = false
                  this.dialogBaseStatus = false
                  this.getList()
                }).catch(() => {
                  this.btnLoading = false
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
          isUse: 'true'
        }
        this.$refs.dialogBaseForm.resetFields()
        this.time = null
      },
      showImg(imgLink) {
        this.$alert(`<img src="${imgLink}" alt="" style="width:100%" >`, {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          closeOnClickModal: true,
          closeOnPressEscape: true
        });
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
