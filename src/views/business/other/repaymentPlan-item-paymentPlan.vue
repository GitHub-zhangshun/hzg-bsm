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
        <el-table-column label="总额">
          <template slot-scope="scope">
            <span>{{numAdd(scope.row.principal, scope.row.interest, scope.row.damages, scope.row.increaseInterest)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="本金">
        </el-table-column>
        <el-table-column prop="interest" label="利息">
        </el-table-column>
        <el-table-column label="加息">
          <template slot-scope="scope">
            <span>{{ scope.row.increaseInterest || 0 }}</span>
            <span v-if="scope.row.increaseInterest">({{ scope.row.increaseRate }} %)</span>
          </template>
        </el-table-column>
        <el-table-column prop="damages" label="违约金金额">
          <template slot-scope="scope">
            <span>{{scope.row.damages || 0}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="serviceCharge" label="管理费">
          <template slot-scope="scope">
            <span>{{scope.row.serviceCharge || 0}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="currentNum" label="当前期数">
        </el-table-column>
        <el-table-column prop="time" label="回款日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.time, '{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{getDicTitleById(scope.row.type)}}</span>
          </template>
        </el-table-column>
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
          tableChangeList: []
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
