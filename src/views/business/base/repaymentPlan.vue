<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag size="medium">当前标的: {{$route.query.name}}</el-tag>
      <!-- table list -->
      <div style="margin: 20px 0;">
        <el-tag size="medium" type="success" v-if="table.oldList && table.oldList.length > 0">当前还款计划</el-tag>
        <el-table stripe ref="table" :data="table.list" style="width: 100%;margin-top:5px;" v-loading="table.loading">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="status" label="还款状态">
            <template slot-scope="scope">
              <span>{{getDicTitleById(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currentNum" label="当前期数">
          </el-table-column>
          <el-table-column prop="totalNum" label="总期数">
          </el-table-column>
          <el-table-column label="总额">
            <template slot-scope="scope">
              <span>{{numAdd(scope.row.principal, scope.row.interest, scope.row.damages)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="principal" label="本金">
          </el-table-column>
          <el-table-column prop="interest" label="利息">
          </el-table-column>
          <el-table-column prop="time" label="还款日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.time, '{y}-{m}-{d}')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="还款类型">
            <template slot-scope="scope">
              <span>{{getDicTitleById(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="damages" label="违约金金额">
            <template slot-scope="scope">
              <span>{{scope.row.damages || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="damagesProportion" label="违约金比例">
            <template slot-scope="scope">
              <span>{{scope.row.damagesProportion ? `${scope.row.damagesProportion} %` : '0 %'}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="serviceCharge" label="管理费金额">
            <template slot-scope="scope">
              <span>{{scope.row.serviceCharge || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="serviceChargeProportion" label="管理费比例">
            <template slot-scope="scope">
              <span>{{scope.row.serviceChargeProportion ? `${scope.row.serviceChargeProportion} %` : '0 %'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- old table list -->
      <el-tag size="medium" type="danger" v-if="table.oldList && table.oldList.length > 0">原还款计划</el-tag>
      <el-table stripe v-if="table.oldList && table.oldList.length > 0" ref="table" :data="table.oldList" style="width: 100%;margin-top:5px;" v-loading="table.loading">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="status" label="还款状态">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentNum" label="当前期数">
        </el-table-column>
        <el-table-column prop="totalNum" label="总期数">
        </el-table-column>
        <el-table-column label="总额">
            <template slot-scope="scope">
              <span>{{numAdd(scope.row.principal, scope.row.interest, scope.row.damages)}}</span>
            </template>
          </el-table-column>
        <el-table-column prop="principal" label="本金">
        </el-table-column>
        <el-table-column prop="interest" label="利息">
        </el-table-column>
        <el-table-column prop="time" label="还款日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.time, '{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="还款类型">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="damages" label="违约金金额">
          <template slot-scope="scope">
            <span>{{scope.row.damages || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="damagesProportion" label="违约金比例">
          <template slot-scope="scope">
            <span>{{scope.row.damagesProportion ? `${scope.row.damagesProportion} %` : '0 %'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="serviceCharge" label="管理费金额">
          <template slot-scope="scope">
            <span>{{scope.row.serviceCharge || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceChargeProportion" label="管理费比例">
          <template slot-scope="scope">
            <span>{{scope.row.serviceChargeProportion ? `${scope.row.serviceChargeProportion} %` : '0 %'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
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

  export default {
    data() {
      return {
        table: {
          list: [],
          loading: false,
          tableChangeList: [],
          oldList: []
        }
      }
    },
    created() {
      this.table.loading = true
      this.$request({
        url: this.currentMenuHiddenRunFuncList['F_TABLE_LIST'],
        data: this.$route.query.id
      }).then(data => {
        this.table.list = data.result
        this.table.loading = false
      })
      // 提前还款 获取老还款计划
      if (this.$route.query.isPrepayment) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['OLD_PLAN_LIST'],
          data: this.$route.query.id
        }).then(data => {
          this.table.oldList = data.result
          this.table.loading = false
        })
      }
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
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
