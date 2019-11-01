<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="借款人">
          <template slot-scope="scope">
            <span>{{scope.row.name || scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="类型">
        </el-table-column>
        <!-- <el-table-column prop="content" label="状态---">
        </el-table-column> -->
        <el-table-column prop="phone" label="开户手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="idcardCode" label="证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="providerName" label="提供商" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sumLoanMoney" label="借款总额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.sumLoanMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="waitPrincipal" label="待还本金">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.waitPrincipal)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="waitInterest" label="待还利息">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.waitInterest)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alsoInterest" label="已还利息">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.alsoInterest)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="waitServiceCharge" label="待还管理费">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.waitServiceCharge)}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="alsoServiceCharge" label="已还管理费">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.alsoServiceCharge)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="waitDamages" label="待还违约金">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.waitDamages)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alsoDamages" label="已还违约金">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.alsoDamages)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bidCount" label="在贷笔数">
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
    name: 'statistics-user-borrower',
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
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }, {
          para: 'providerId',
          text: '助贷机构',
          type: 'fuzzy_provider'
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }],
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

    })
  }
</script>

<style lang="scss" scoped>


</style>
