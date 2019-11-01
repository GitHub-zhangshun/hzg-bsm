<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column prop="regionName" label="城市名称">
        </el-table-column>
        <el-table-column prop="lendNumber" label="出借人数">
        </el-table-column>
        <el-table-column prop="proportion" label="人数占比">
          <template slot-scope="scope">
            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalInvestment" label="出借总金额">
        </el-table-column>
        <el-table-column prop="investmentCount" label="出借总次数">
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
        searchForm: {
          rankKey: 'province',
          sortKey: 'lendNumber'
        },
        searchItems: [{
          para: 'rankKey',
          text: '查看方式',
          type: 'custom_enum',
          clearable: 'false',
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
          clearable: 'false',
          details: {
            parse: [{
              label: '按出借人数排序',
              value: 'lendNumber'
            }, {
              label: '按出借金额排序',
              value: 'totalInvestment'
            }, {
              label: '按出借次数排序',
              value: 'investmentCount'
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
