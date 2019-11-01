<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <BidList v-model="table.tableChangeList" :list="table.list" :loading="table.loading" :actionList="currentMenuRightRunFuncList" :tableItems="tableItems"></BidList>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" :rules="baseFormRules.dialogRules" label-width="120px">
          <el-form-item label="设置权限类型" prop="typeId">
            <ServiceSelect v-model="dialogBaseForm.typeId" placeholder="请选权限类型" queryArg="bid_product_show_type" :clear="false"></ServiceSelect>
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
  import {
    baseFormRules
  } from '@/business/rules'
  import BidList from '@/views/components/BidList.vue'
  export default {
    name: 'bus-other-permission',
    components: {
      BidList
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
        dialogBaseForm: {},
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '标的名称',
          type: 'text'
        },{
          para: 'businessType',
          text: '业务类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'bid_business_type'
          }
        }, {
          para: 'productType',
          text: '产品类型',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'bid_info_type'
          }
        }, {
          para: 'providerId',
          text: '助贷机构',
          type: 'fuzzy_provider'
        }, {
          para: 'userId',
          text: '借款人',
          type: 'fuzzy_borrower'
        }],
        tableItems: {
          number: '标识码',
          name: '标的名称',
          enum_showType: '权限类型',
          group_bid_time: '标的期限',
          rate: '基础利率',
          format_money: '标的金额',
          enum_repayment: '还款方式',
          group_provider: '助贷机构',
          group_user: '借款人',
          group_userType: '借款人类型',
          enum_productType: '产品类型',
          enum_businessType: '业务类型',
          enum_realStatus: '标的状态'
        },
        currentShowType: '' // 标的的当前显示状态
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
        switch (action.routeUrl) {
          case 'bus-other-permission-setting':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '设置出借人权限'
            this.dialogBaseStatus = true
            this.currentShowType = row[0].showType
            this.dialogBaseForm.typeId = row[0].showType
            this.dialogBaseForm.dataId = row[0].Id
            this.dialogBaseForm.bidName = row[0].name
            this.currentDialogUrl = action.apiUrl
            break;

          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                let showType = this.getDicObjById(this.dialogBaseForm.typeId).simplify
                // 如果未做改变
                if (this.currentShowType === this.dialogBaseForm.typeId) {
                  // 如果为 公开
                  if (showType === 'bid_product_show_masses') {
                    this.dialogBaseStatus = false
                    return
                  } else {
                    this.dialogBaseStatus = false
                    // 不为公开 跳转路由
                    this.$router.push({
                      name: 'bus-other-permission-setting',
                      query: {
                        id: this.dialogBaseForm.dataId,
                        name: this.dialogBaseForm.bidName
                      }
                    })
                  }
                } else {
                  // 类型改变
                  this.$confirm('是否改变标的权限类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$request({
                      url: this.currentDialogUrl,
                      data: this.dialogBaseForm
                    }).then(() => {
                      // 如果为 公开
                      if (showType === 'bid_product_show_masses') {
                        this.dialogBaseStatus = false
                        this.$message.success('操作成功')
                        this.getList()
                        return
                      } else {
                        this.dialogBaseStatus = false
                        // 不为公开 跳转路由
                        this.$router.push({
                          name: 'bus-other-permission-setting',
                          query: {
                            id: this.dialogBaseForm.dataId,
                            name: this.dialogBaseForm.bidName
                          }
                        })
                      }
                    })
                  })
                }
              }
            })
            break;

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {}
        this.$refs.dialogBaseForm.resetFields()
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
