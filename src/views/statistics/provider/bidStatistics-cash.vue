<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <el-tag type="">当前助贷机构：{{$route.query.name}}</el-tag>
          <!-- 逾期总数据 -->
          <section>
            <div class="content">
              <NumberPanel :countTo="false" :list="generalList" type="error"></NumberPanel>
            </div>
          </section>
          <!-- 截止当前时间逾期数据 -->
          <section>
            <div class="title">

            </div>
            <div class="content">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" size="mini" :clearable="false" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
              </el-date-picker>
              <el-button type="" size="mini" @click="getList">查询</el-button>
              <!-- table list -->
              <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="dayTime" label="还款日期">
                  <template slot-scope="scope">
                    <span>{{getTime(scope.row.dayTime,'{y}-{m}-{d}')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="待还款金额">
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
          </section>
        </div>
      </el-form>
    </div>
    <!-- dialog -->
    <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus">
      <el-table stripe :data="detailData">
        <ElTableColumn label="标的名称" prop="name"></ElTableColumn>
        <ElTableColumn label="待还款金额" prop="money"></ElTableColumn>
        <ElTableColumn label="借款人" prop="userName"></ElTableColumn>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    _func
  } from '@/business/baseFunc'
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import {
    pickerOptions
  } from '@/business/baseConst'
  import NumberPanel from '../components/NumberPanel.vue'
  import {
    GetDateStr
  } from '@/utils'
  export default {
    components: {
      Mallki,
      NumberPanel
    },
    data() {
      return {
        pickerOptions,
        generalList: [],
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
          staTime: GetDateStr(-30),
          endTime: Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)),
          time: [GetDateStr(-30), Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))]
        },
        tableListQuery: {
          providerId: this.$route.query.id || '1'
        },
        dialogBaseStatus: false,
        dialogTitle: '',
        detailData: []
      }
    },
    watch: {
      'searchForm.time': function(nd) {
        if (nd) {
          this.searchForm.staTime = nd[0]
          this.searchForm.endTime = nd[1]
        } else {
          this.searchForm.staTime = GetDateStr(-30)
          this.searchForm.endTime = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1))
        }
      }
    },
    created() {
      this.getGeneralList()
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
      // 获取总览
      getGeneralList() {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_CASH_ALL'],
          data: this.$route.query.id
        }).then(data => {
          data.result.map(item => {
            item.text = item.title
            item.value = item.textvalue
          })
          this.generalList = data.result
        })
      },
      // 弹窗事件
      func_dialog(action, row) {
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogShow':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              this.dialogTitle = this.getTime(row[0].dayTime, '{y}-{m}-{d}')
              this.dialogBaseStatus = true
              this.$request({
                url: action.apiUrl,
                data: {
                  providerId: this.$route.query.id,
                  time: row[0].dayTime
                }
              }).then(data => {
                this.detailData = data.result
              })
            }
            break

          default:
            break
        }
      }
    })
  }
</script>
<style lang="scss" scoped>
  .main-wrapper {
    >section {
      // border: 2px solid transparent;
      // border-image: linear-gradient(to right, #F80, #2ED);
      // border-image-slice: 10;
      // border-top: none;
      // border-right: none;
      // border-left: none;
      padding: 10px;
      margin-bottom: 8px;

      &.top {
        border: none;
        padding: 0;
        margin: 0;

        .search {
          margin-bottom: 8px;
          justify-content: center;
        }
      }

      .title {
        border-bottom: 1px dashed #ccc;
        padding-bottom: 4px;
        margin-bottom: 16px;
      }

      .search {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 16px;
      }

      .content {
        .header-title {
          text-align: center;
        }

        .table-title {
          font-size: 14px;
          color: rgb(64, 158, 255);
        }
      }
    }
  }
</style>
