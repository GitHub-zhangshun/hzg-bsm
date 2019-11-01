<template>
  <div class="post-container">
    <div class="post-main-container">
      <!-- <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader> -->

      <el-card class="box-card" :body-style="{ padding: '5px 20px' }">
        <div class="card-header">
        </div>
        <div class="card-content">
          <el-date-picker size="mini" :default-time="['00:00:00', '23:59:59']" v-model="searchForm.time" :clearable="false" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions" value-format="timestamp">
          </el-date-picker>
          <el-button type="success" size="mini" @click="init">确定</el-button>
        </div>
      </el-card>


      <!-- recharge table list -->
      <div class="header">
        <el-button size="mini" type="warning" @click="exportData('充值数据', showTable.recharge_header, showTable.recharge_list)">导出充值数据</el-button>
        <el-button type="success" size="mini" @click="init">刷新</el-button>
      </div>
      <el-table stripe :data="showTable.recharge_list" border style="width: 100%;margin-top:5px;" v-loading="showTable.recharge_loading" height="300px">
        <el-table-column :label="item" v-for="item in showTable.recharge_header" :key="item">
          <template slot-scope="scope">
            <span v-if="item === '日期'">{{scope.row[item]}}</span>
            <span v-else>{{numberFormat(scope.row[item])}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- withdrawal table list -->
      <div class="header">
        <el-button size="mini" type="warning" @click="exportData('提现数据', showTable.withdrawal_header, showTable.withdrawal_list)">导出提现数据</el-button>
        <el-button type="success" size="mini" @click="init">刷新</el-button>
      </div>
      <el-table stripe :data="showTable.withdrawal_list" border style="width: 100%;margin-top:5px;" v-loading="showTable.withdrawal_loading" height="300px">
        <el-table-column :label="item" v-for="item in showTable.withdrawal_header" :key="item">
          <template slot-scope="scope">
            <span v-if="item === '日期'">{{scope.row[item]}}</span>
            <span v-else>{{numberFormat(scope.row[item])}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- transaction table list -->
      <div class="header">
        <el-button size="mini" type="warning" @click="exportData('交易数据', showTable.transaction_header, showTable.transaction_list)">导出交易数据</el-button>
        <el-button type="success" size="mini" @click="init">刷新</el-button>
      </div>
      <el-table stripe :data="showTable.transaction_list" border style="width: 100%;margin-top:5px;" v-loading="showTable.transaction_loading" height="300px">
        <el-table-column :label="item" v-for="item in showTable.transaction_header" :key="item">
          <template slot-scope="scope">
            <span v-if="item === '日期'">{{scope.row[item]}}</span>
            <span v-else>{{numberFormat(scope.row[item])}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- cash table list -->
      <div class="header">
        <el-button size="mini" type="warning" @click="exportData('兑付数据', showTable.cash_header, showTable.cash_list)">导出兑付数据</el-button>
        <el-button type="success" size="mini" @click="init">刷新</el-button>
      </div>
      <el-table stripe :data="showTable.cash_list" border style="width: 100%;margin-top:5px;" v-loading="showTable.cash_loading" height="300px">
        <el-table-column :label="item" v-for="item in showTable.cash_header" :key="item">
          <template slot-scope="scope">
            <span v-if="item === '日期'">{{scope.row[item]}}</span>
            <span v-else>{{numberFormat(scope.row[item])}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- stayCash table list -->
      <div class="header">
        <el-button size="mini" type="warning" @click="exportData('待兑付数据', showTable.stayCash_header, showTable.stayCash_list)">导出待兑付数据</el-button>
        <el-button type="success" size="mini" @click="init">刷新</el-button>
      </div>
      <el-table stripe :data="showTable.stayCash_list" border style="width: 100%;margin-top:5px;" v-loading="showTable.stayCash_loading" height="300px">
        <el-table-column :label="item" v-for="item in showTable.stayCash_header" :key="item">
          <template slot-scope="scope">
            <span v-if="item === '日期'">{{scope.row[item]}}</span>
            <span v-else>{{numberFormat(scope.row[item])}}</span>
          </template>
        </el-table-column>
      </el-table>
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
    GetDateStr
  } from '@/utils'
  import {
    pickerOptions
  } from '@/business/baseConst'

  export default {
    name: 'statistics-provider-rechargeStatistics',
    data() {
      return {
        pickerOptions,
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        dialogBaseStatus: false,
        dialogBaseForm: {
          isDelay: 'true'
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {
          time: [GetDateStr(-30), Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))],
          startTime: GetDateStr(-30),
          endTime: Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)),
        },
        tableListQuery: {
          typeStr: 'recharge'
        },
        showTable: {
          // 充值
          recharge_list: [],
          recharge_header: [],
          recharge_loading: false,
          // 交易
          transaction_list: [],
          transaction_header: [],
          transaction_loading: false,
          // 兑付
          cash_list: [],
          cash_header: [],
          cash_loading: false,
          // 待兑付
          stayCash_list: [],
          stayCash_header: [],
          stayCash_loading: false,
          // 提现
          withdrawal_list: [],
          withdrawal_header: [],
          withdrawal_loading: false
        }
      }
    },
    created() {
      this.init()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      init() {
        this.showTable = {
          // 充值
          recharge_list: [],
          recharge_header: [],
          recharge_loading: false,
          // 交易
          transaction_list: [],
          transaction_header: [],
          transaction_loading: false,
          // 兑付
          cash_list: [],
          cash_header: [],
          cash_loading: false,
          // 待兑付
          stayCash_list: [],
          stayCash_header: [],
          stayCash_loading: false,
          // 提现
          withdrawal_list: [],
          withdrawal_header: [],
          withdrawal_loading: false
        }
        this.getData('recharge')
        this.getData('transaction')
        this.getData('cash')
        this.getData('stayCash')
        this.getData('withdrawal')
      },
      getData(type) {
        let data = {
          startTime: this.searchForm.time[0] || null,
          endTime: this.searchForm.time[1] || null,
          typeStr: type
        }
        let list_key = ''
        let header_key = ''
        let loading_key = ''
        switch (type) {
          case 'recharge':
            list_key = 'recharge_list'
            header_key = 'recharge_header'
            loading_key = 'recharge_loading'
            break;
          case 'transaction':
            list_key = 'transaction_list'
            header_key = 'transaction_header'
            loading_key = 'transaction_loading'
            break;
          case 'cash':
            list_key = 'cash_list'
            header_key = 'cash_header'
            loading_key = 'cash_loading'
            break;
          case 'stayCash':
            list_key = 'stayCash_list'
            header_key = 'stayCash_header'
            loading_key = 'stayCash_loading'
            break;
          case 'withdrawal':
            list_key = 'withdrawal_list'
            header_key = 'withdrawal_header'
            loading_key = 'withdrawal_loading'
            break;

          default:
            break;
        }
        this.showTable[loading_key] = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['F_INFO'],
          data
        }).then(data => {
          this.constructionData(data.result, type, list_key, header_key)
          this.showTable[loading_key] = false
        })
      },
      constructionData(data, type, list_key, header_key) {
        if (data.headData.length === 0) {
          this.showTable[list_key] = []
          this.showTable[header_key] = []
          return
        }
        this.showTable[header_key].push('日期')
        data.headData.forEach(item => {
          this.showTable[header_key].push(item.name)
        })
        data.timeData.map(item => {
          data.headData.forEach(head => {
            const val = data.valueData.find(j => j.timeId === item.id && j.headId === head.id)
            item[head.name] = parseFloat(val && val.textValue || 0)
            item['日期'] = item.time
          })
        })
        this.showTable[list_key] = data.timeData
      },
      exportData(title, header, list) {
        let a = ['time', 'time', 'time']
        this.exportExcel({
          title,
          header_key: header,
          header_value: header,
          data: list
        })
      }
    })
  }
</script>

<style lang="scss" scoped>
  /deep/.header {
    .el-button--mini,
    .el-button--mini.is-round {
      // width: 100%;
      flex: 1;
    }
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
