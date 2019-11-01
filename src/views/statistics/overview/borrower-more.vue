<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column label="城市" prop="regionName"></el-table-column>
        <el-table-column label="企业借款人数" prop="enterpriseNumber"></el-table-column>
        <el-table-column label="个人借款人数" prop="personalNumber"></el-table-column>
        <el-table-column label="企业人数占比">
          <template slot-scope="scope">
            <span>{{(scope.row.enterpriseProportion * 100).toFixed(2)}} %</span>
          </template>
        </el-table-column>
        <el-table-column label="个人人数占比">
          <template slot-scope="scope">
            <span>{{(scope.row.personalProportion * 100).toFixed(2)}} %</span>
          </template>
        </el-table-column>
        <el-table-column label="企业借款总金额" prop="enterpriseLoanMoney"></el-table-column>
        <el-table-column label="个人借款总金额" prop="personalLoanMoney"></el-table-column>
        <el-table-column label="企业借款次数" prop="enterpriseLoanNumber"></el-table-column>
        <el-table-column label="个人借款次数" prop="personLoanNumber"></el-table-column>
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
        searchForm: {
          rankKey: 'province',
          sortKey: 'number'
        },
        searchItems: [{
          para: 'rankKey',
          text: '查看方式',
          type: 'custom_enum',
          details: {
            parse: [{
              label: '按城市查看',
              value: 'city'
            }, {
              label: '按省份查看',
              value: 'province'
            }]
          }
        }, {
          para: 'sortKey',
          text: '排序',
          type: 'custom_enum',
          details: {
            parse: [{
              label: '按借款次数排序',
              value: 'number'
            }, {
              label: '按借款金额排序',
              value: 'sumMoney'
            }, {
              label: '按借款人数排序',
              value: 'sumLoanNumber'
            }]
          }
        }, {
          para: 'time',
          text: '开始时间|结束时间',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['staTime', 'endTime']
          }
        }, {
          para: 'regionId',
          text: '省份',
          type: 'fuzzy_province'
        }]
      }
    },
    created() {
      this.getList()
    },
    watch: {
      'searchForm.rankKey': function(nd) {
        this.searchForm.regionId = null
        if (nd === 'city') {
          this.searchItems.map(item => {
            if (item.para === 'regionId') {
              item.text = '城市'
              item.type = 'fuzzy_city'
            }
          })
        } else {
          this.searchItems.map(item => {
            if (item.para === 'regionId') {
              item.text = '省份'
              item.type = 'fuzzy_province'
            }
          })
        }
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

    })
  }
</script>

<style lang="scss" scoped>


</style>
