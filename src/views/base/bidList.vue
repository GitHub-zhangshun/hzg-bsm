<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%">所属助贷机构:{{$route.query.name}}</el-tag>
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
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" label-width="100px">
          <el-form-item label="审核结果" prop="status">
            <el-select v-model="dialogBaseForm.status" placeholder="">
              <el-option label="同意" value="true"></el-option>
              <el-option label="拒绝" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark">
            <el-input type="textarea" :rows="5" v-model="dialogBaseForm.remark" placeholder="请输入审核意见"></el-input>
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
  import BidList from '@/views/components/BidList.vue'
  export default {
    components: {
      BidList
    },
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
          status: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
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
        tableListQuery: {
          providerId: this.$route.query.id
        },
        tableItems: {
          bidName: '标的名称',
          group_bid_time: '标的期限',
          rate: '基础利率',
          bidAmount: '标的金额',
          enum_repayment: '还款方式',
          enum_bussisType: '业务类型',
          providerName: '助贷机构',
          borrowName: '借款人',
          enum_borrowType: '借款人类型',
          enum_instType: '标的类型',
          enum_bidStatus: '标的状态'
        },
      }
    },
    created() {
      this.getList()
      console.log(this.$route)
      switch (this.$route.name) {
        case 'provider-list-item-bid':
          // 助贷机构标的列表
          this.items = ['bidType', 'borrower', 'borrowType',
            'busType', 'repayment', 'rate', 'amount', 'name', 'limit',
            'auditStatus', 'moneyStatus', 'releaseDate'
          ]

          break;

        default:
          break;
      }
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
          case 'dialogRecheck':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.dialogTitle = '审核'
            this.dialogBaseStatus = true
            this.dialogBaseForm.id = row[0].Id
            break;

          default:
            break;
        }
      },
      // 弹窗提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            let url = this.dialogBaseForm.status === 'true' ? this.currentMenuHiddenRunFuncList['O_RECHECK_SUCCESS'] : this.currentMenuHiddenRunFuncList['O_RECHECK_FAIL']
            this.$request({
              url,
              data: this.dialogBaseForm
            }).then(() => {
              this.dialogBaseStatus = false
              this.getList()
              this.$message.success('提交成功')
            })
            break;

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          status: 'true'
        }
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
