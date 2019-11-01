<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag size="medium">当前标的: {{$route.query.name}}</el-tag>
      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template slot-scope="scope">
            <span>{{ numberFormat(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponType" label="优惠券">
          <template slot-scope="scope">
            <span>{{ scope.row.couponType && ( scope.row.couponType == 1 ? '返利券' : '加息券' ) || '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponVal" label="面值">
          <template slot-scope="scope">
            <span>{{ scope.row.couponVal || '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="txnSsn" label="订单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createAt" label="时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.createAt)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
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
        tableListQuery: {
          bidId: this.$route.query.id
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
      func_execute(action, row) {
        switch (action.routeUrl) {
          // 签署
          case 'execute_sign':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('是否继续?', '电子合同签署', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                let res = data.result || []
                let count = res.length
                let successNum = res.filter(item => item === '0').length
                let errorNum = res.filter(item => item !== '0').length
                errorNum === 0 ? this.$notify.success(`应签署${count}份合同，实签署${successNum}份`) : this.$notify.error(`应签署${count}份合同，实签署${successNum}份，${errorNum}份签署失败`)
                this.getList()
              })
            })
            break;

          default:
            break;
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
