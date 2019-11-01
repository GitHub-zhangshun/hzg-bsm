<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="realName" label="用户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
          <template slot-scope="scope">
            <span v-if="scope.row.phone.indexOf('LOGOUT') > -1">
              <el-tooltip class="item" effect="dark" content="已注销" placement="top-start">
              <span  style="color:red">{{ (scope.row.phone || '').substr(6) }}</span>
            </el-tooltip>
            </span>
            <span v-else>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regionName" label="地区">
          <template slot-scope="scope">
            <span>{{scope.row.regionName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" show-overflow-tooltip >
          <template slot-scope="scope">
            <span>{{getTime(scope.row.registerTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerCorrelation" label="注册渠道">
        </el-table-column>
        <el-table-column prop="openTime" label="开户时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.openTime && getTime(scope.row.openTime, '{y}-{m}-{d} {h}:{i}:{s}') || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄">
        </el-table-column>
        <el-table-column prop="timeSlot" label="出借时间偏好">
        </el-table-column>
        <el-table-column prop="totalInvestment" label="出借总金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.totalInvestment)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usable" label="账户余额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.usable)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investment" label="在投金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.investment)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investmentCount" label="出借次数">
        </el-table-column>
        <el-table-column prop="firstMoney" label="首投金额">
          <template slot-scope="scope">
            <span>{{numberFormat(scope.row.firstMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firsTime" label="首投时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.firsTime && getTime(scope.row.firsTime, '{y}-{m}-{d} {h}:{i}:{s}') || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="首投标的" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="content" label="开户状态">
          <template slot-scope="scope">
            <span :style="!scope.row.openTime && 'color:red'">{{scope.row.openTime ? '已开户' : '未开户'}}</span>
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
    name: 'statistics-user-lender',
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
          text: '手机号',
          type: 'text'
        }, {
          para: 'registerTime',
          text: '注册时间起|注册时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['registerStartTime', 'registerEndTime']
          }
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }, {
          para: 'firstInvestmentTime',
          text: '首投时间起|首投时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['firstInvestmentStartTime', 'firstInvestmentEndTime']
          }
        }, {
          para: 'lendMinMoney',
          text: '总金额起',
          type: 'text'
        }, {
          para: 'lendMaxMoney',
          text: '总金额止',
          type: 'text'
        }, {
          para: 'investmentMinMoney',
          text: '在投金额起',
          type: 'text'
        }, {
          para: 'investmentMaxMoney',
          text: '在投金额止',
          type: 'text'
        }, {
          para: 'withdrawalMinMoney',
          text: '账户余额起',
          type: 'text'
        }, {
          para: 'withdrawalMaxMoney',
          text: '账户余额止',
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
    methods: Object.assign(_func(), {})
  }
</script>

<style lang="scss" scoped>


</style>
