<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-button type="danger" style="position: fixed;right:30px;z-index: 10001;" icon="el-icon-info" circle @click="showDialog = true"></el-button>
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <section class="top">
            <div class="search">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getData" size="mini" v-model="searchForm.time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
              </el-date-picker>
            </div>
          </section>
          <!-- 流标数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="流标数据"></mallki>
            </div>
            <div class="content">
              <NumberPanel :countTo="false" :list="bidLossData" type="warning"></NumberPanel>
            </div>
          </section>
          <!-- 标的数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="标的数据"></mallki>
            </div>
            <div class="content">
              <el-row>
                <el-col :span="12">
                  <el-container>
                    <el-header class="header-title">标的期限分布占比</el-header>
                    <el-container>
                      <el-main>
                        <ve-pie :data="chartBidTimeData" :settings="bidChartSettings"></ve-pie>
                      </el-main>
                      <el-aside width="200px">
                        <el-table stripe :data="chartBidTimeData.rows" class="table">
                          <el-table-column label="标的期限" prop="title" show-overflow-tooltip></el-table-column>
                          <el-table-column label="占比" prop="textvalue">
                            <template slot-scope="scope">
                              <span>{{(scope.row['textvalue'] * 100).toFixed(2)}} %</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-aside>
                    </el-container>
                  </el-container>
                </el-col>
                <el-col :span="12">
                  <el-container>
                    <el-header class="header-title">标的利率分布占比</el-header>
                    <el-container>
                      <el-main>
                        <ve-pie :data="chartBidRateData" :settings="bidChartSettings"></ve-pie>
                      </el-main>
                      <el-aside width="200px">
                        <el-table stripe :data="chartBidRateData.rows" class="table">
                          <el-table-column label="标的利率" prop="title" show-overflow-tooltip></el-table-column>
                          <el-table-column label="占比" prop="textvalue">
                            <template slot-scope="scope">
                              <span>{{(scope.row['textvalue'] * 100).toFixed(2)}} %</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-aside>
                    </el-container>
                  </el-container>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-container>
                    <el-header class="header-title">标的金额分布占比</el-header>
                    <el-container>
                      <el-main>
                        <ve-pie :data="chartBidMoneyData" :settings="bidChartSettings"></ve-pie>
                      </el-main>
                      <el-aside width="200px">
                        <el-table stripe :data="chartBidMoneyData.rows" class="table">
                          <el-table-column label="标的金额" prop="title" show-overflow-tooltip></el-table-column>
                          <el-table-column label="占比" prop="textvalue">
                            <template slot-scope="scope">
                              <span>{{(scope.row['textvalue'] * 100).toFixed(2)}} %</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-aside>
                    </el-container>
                  </el-container>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-container>
                    <el-header class="header-title">标的募集时间分布占比</el-header>
                    <el-main>
                      <el-row>
                        <el-col :span="6">
                          <span class="table-title">按标的期限分</span>
                          <el-table stripe :data="timeDateList" class="table">
                            <el-table-column label="标的期限" prop="title" show-overflow-tooltip></el-table-column>
                            <el-table-column label="平均募集时间" prop="textvalue">
                              <template slot-scope="scope">
                                <span>{{minuteFormat(scope.row['textvalue']) || '无此类型标的'}}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                        <el-col :span="5" :offset="1">
                          <span class="table-title">按标的利率分</span>
                          <el-table stripe :data="rateDateList" class="table">
                            <el-table-column label="标的利率" prop="title" show-overflow-tooltip></el-table-column>
                            <el-table-column label="平均募集时间" prop="textvalue">
                              <template slot-scope="scope">
                                <span>{{minuteFormat(scope.row['textvalue']) || '无此类型标的'}}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                        <el-col :span="5" :offset="1">
                          <span class="table-title">按标的金额分</span>
                          <el-table stripe :data="moneyDateList" class="table">
                            <el-table-column label="标的金额" prop="title" show-overflow-tooltip></el-table-column>
                            <el-table-column label="平均募集时间" prop="textvalue">
                              <template slot-scope="scope">
                                <span>{{minuteFormat(scope.row['textvalue']) || '无此类型标的'}}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                        <el-col :span="5" :offset="1">
                          <span class="table-title">按标的类型分</span>
                          <el-table stripe :data="typeDateList" class="table">
                            <el-table-column label="标的类型" prop="title" show-overflow-tooltip></el-table-column>
                            <el-table-column label="平均募集时间" prop="textvalue">
                              <template slot-scope="scope">
                                <span>{{minuteFormat(scope.row['textvalue']) || '无此类型标的'}}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-main>
                  </el-container>
                </el-col>
              </el-row>
            </div>
          </section>
        </div>
      </el-form>
    </div>
    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="showDialog">
      <span>
        <h2>流标数据（某段时间内的统计）：</h2>
        <p>1.累计流标标的金额：截至统计时点，平台历史进行流标的本金总合。（流标成功后计入）

          2.累计金额流标率：总流标金额与平台所有借款人的本金总金额之比。

          3.累计流标标的笔数：截至统计时点，平台历史进行流标的借款笔数总合。（流标成功后计入）

          4.累计笔数流标率：累计的流标笔数与平台所有借款人借款总笔数之比。</p>

        <h2>标的数据（某段时间内的统计）：</h2>

        <p>1.标的期限分布占比：0-1（含）个月，1-2（含）个月，2-3（含）个月、3-6个月、6个月，6-12（含）个月、12个月以上（放款成功后计入）

          2.标的平均期限：标的期限总天数/标的总数量（放款后计入）



          3.标的金额分布占比：10万及以下，10万-20万（含），20万-50万（含），50万以上（放款成功后计入）

          4.标的平均金额：标的总金额/标的总数量（放款成功后计入）



          5.标的利率分布占比：6.0%以下，6.0%（含）-7.0%（不含），7.0%（含）-8.0%（不含），8.0%（含）-9.0%（不含），8.0%（含）-9.0%（不含），9.0%，9.0%以上

          6.标的平均利率：标的利率之和/标的总数量（放款成功后计入）



          7.标的平均募集时间（按标的类型）：标的募集周期/标的总数量（放款成功后计入）（募集周期是指发布成功时间至募集完成时间，精确到分钟）

          8.标的平均募集时间（按标的期限）：标的募集周期/标的总数量（放款成功后计入）

          9.标的平均募集时间（按标的金额）：标的募集周期/标的总数量（放款成功后计入）

          10.标的平均募集时间（按标的利率）：标的募集周期/标的总数量（放款成功后计入）</p>



      </span>
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
    minuteFormat
  } from '@/utils'
  export default {
    components: {
      Mallki,
      NumberPanel
    },
    data() {
      return {
        pickerOptions,
        searchForm: {
          time: null
        },
        bidLossData: [],
        bidChartSettings: {
          dataType: 'percent',
          radius: 50,

        },
        // 期限分布占比
        chartBidTimeData: {
          columns: ['title', 'textvalue'],
          rows: []
        },
        // 利率分布占比
        chartBidRateData: {
          columns: ['title', 'textvalue'],
          rows: []
        },
        // 金额分布占比
        chartBidMoneyData: {
          columns: ['title', 'textvalue'],
          rows: []
        },
        // 募集时间
        timeDateList: [],
        moneyDateList: [],
        rateDateList: [],
        typeDateList: [],
        showDialog: false
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
      minuteFormat,
      // 获取所有
      getData() {
        // 获取流标数据
        this.getLossBidData()
        // 获取期限分布占比
        this.getBidProportionData('bid_data_termproportion')
        // 获取利率分布占比
        this.getBidProportionData('bid_data_interestproportion')
        // 获取金额分布占比
        this.getBidProportionData('bid_data_moneyproportion')
        // 募集时间-期限-分布占比
        this.getBidProportionData('bid_data_termduration')
        // 募集时间-利率分布占比
        this.getBidProportionData('bid_data_rateduration')
        // 募集时间-金额-分布占比
        this.getBidProportionData('bid_data_moneyduration')
        // 募集时间-类型-分布占比
        this.getBidProportionData('bid_data_typeduration')

      },
      // 获取流标数据
      getLossBidData() {
        let data = {
          staTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[0] || null,
          endTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[1] || null,
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BID_LOSS'],
          data
        }).then(data => {
          this.bidLossData = [{
            text: '累计流标标的金额（元）',
            value: data.result.sumAmount
          }, {
            text: '累计金额流标率',
            value: data.result.flowRate * 100,
            suffix: '%'
          }, {
            text: '累计流标标的笔数',
            value: data.result.lossNumber,
            decimals: 0
          }, {
            text: '累计笔数流标率',
            value: data.result.lossRate * 100,
            suffix: '%'
          }]
        })
      },
      // 获取分布占比
      getBidProportionData(type) {
        let data = {
          staTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[0] || null,
          endTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[1] || null,
          keyString: type
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BID_PROPORTION'],
          data
        }).then(data => {
          switch (type) {
            case 'bid_data_termproportion':
              this.chartBidTimeData.rows = data.result
              break;
            case 'bid_data_interestproportion':
              this.chartBidRateData.rows = data.result
              break;
            case 'bid_data_moneyproportion':
              this.chartBidMoneyData.rows = data.result
              break;
            case 'bid_data_termduration':
              this.timeDateList = data.result
              break;
            case 'bid_data_rateduration':
              this.rateDateList = data.result
              break;
            case 'bid_data_moneyduration':
              this.moneyDateList = data.result
              break;
            case 'bid_data_typeduration':
              this.typeDateList = data.result
              break;

            default:
              break;
          }
        })
      }
    })
  }
</script>
<style lang="scss" scoped>
  .main-wrapper {
    >section {
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
