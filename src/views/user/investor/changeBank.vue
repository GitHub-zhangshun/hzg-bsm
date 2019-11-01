<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">
      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="applicationNo" label="流水" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.applicationNo || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName || '---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column label="新卡号">
          <template slot-scope="scope">
            <span>{{ scope.row.cardNo || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="新卡银行">
          <template slot-scope="scope">
            <span>{{ scope.row.newBankName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="新卡省份">
          <template slot-scope="scope">
            <span>{{ scope.row.newParRegionName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="新卡地区">
          <template slot-scope="scope">
            <span>{{ scope.row.newRegionName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="新卡图片">
          <template slot-scope="scope">
            <img :src="scope.row.newFile" alt="">
          </template>
        </el-table-column>
        <el-table-column label="老卡号">
          <template slot-scope="scope">
            <span>{{ scope.row.oldCardNo || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老卡银行">
          <template slot-scope="scope">
            <span>{{ scope.row.oldBankName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老卡省份">
          <template slot-scope="scope">
            <span>{{ scope.row.oldParRegionName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老卡地区">
          <template slot-scope="scope">
            <span>{{ scope.row.oldRegionName || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老卡图片">
          <template slot-scope="scope">
            <img :src="scope.row.oldFile" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ getDicTitleById(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作" fixed="right">
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
  import Header from '../../components/TableListHeader.vue'

  export default {
    name: 'user-investor-changeBank',
    components: {
      Header
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
        searchForm: {},
        searchItems: [{
          para: 'userName',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '注册手机',
          type: 'text'
        }, {
          para: 'status',
          text: '状态',
          type: 'sys_enum',
          details: {
            type: 'statusEnum',
            path: 'fin_change_card_status'
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
  .search-form-item {
    padding: 0;
    margin: 0;
  }
</style>
