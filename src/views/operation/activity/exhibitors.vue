<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="activityName" label="活动名称">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机">
        </el-table-column>
        <el-table-column prop="prizeCode" label="兑换码">
        </el-table-column>
        <el-table-column prop="prizeGradeName" label="奖品等级">
        </el-table-column>
        <el-table-column prop="prizeName" label="奖品名称">
        </el-table-column>
        <el-table-column prop="prizeType" label="奖品类型">
          <template slot-scope="scope">
            <span>{{ scope.row.prizeType && getDicTitleById(scope.row.prizeType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="takeTime" label="领取时间">
          <template slot-scope="scope">
            <span>{{ scope.row.takeTime && getTime(scope.row.takeTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量">
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作" width="200px">
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
  import {
    baseFormRules
  } from '@/business/rules'

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
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '名称',
          type: 'text'
        }]
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
          // 设置领取
          case 'setUc':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('是否继续?', '设置领取', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                data.result ? this.$message.success('操作成功') : this.$message.error(data.message || '未获取到失败信息')
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


</style>
