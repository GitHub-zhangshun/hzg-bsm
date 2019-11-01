<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <section class="top">
            <div class="search">
              <el-date-picker @change="getData" v-model="searchForm.time" type="date" placeholder="选择时间" size="mini" value-format="timestamp">
              </el-date-picker>
            </div>
          </section>
          <!-- 综合分析 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="标的到期期限分布占比"></mallki>
            </div>
            <div class="content">
              <div class="content-wrapper">
                <el-row>
                  <el-col :span="12">
                    <ve-pie :data="chartBidTimeData" :settings="bidChartSettings"></ve-pie>
                  </el-col>
                  <el-col :span="12">
                    <el-table stripe :data="chartBidTimeData.rows" class="table">
                      <el-table-column label="标的到期期限" prop="title" show-overflow-tooltip></el-table-column>
                      <el-table-column label="数量占比" prop="proportion" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{((scope.row.proportion || 0) * 100).toFixed(2)}} %</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="待还本金" prop="money" show-overflow-tooltip></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
            </div>
          </section>
        </div>
      </el-form>
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
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import {
    pickerOptions
  } from '@/business/baseConst'
  import NumberPanel from '../components/NumberPanel.vue'
  export default {
    components: {
      Mallki,
      NumberPanel
    },
    data() {
      return {
        searchForm: {
          time: new Date()
        },
        bidChartSettings: {
          dataType: 'percent',
          // radius: 50,
          labelMap: {
            // 'money': '月份',
            'proportion': '占比',
            'title': '名称'
          },
        },
        chartBidTimeData: {
          columns: ['title', 'proportion'],
          rows: []
        }
      }
    },
    created() {
      this.getData()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 获取经营数据
      getData() {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BID_TERM_PROPORTION'],
          data: this.searchForm.time
        }).then(data => {
          this.chartBidTimeData.rows = data.result
        })
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
        .content-wrapper {
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
      }
    }
  }
</style>
