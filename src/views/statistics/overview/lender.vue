<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-button type="danger" style="position: fixed;right:30px;z-index: 10001;" icon="el-icon-info" circle @click="showDialog = true"></el-button>
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <!-- 出借人统计 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="出借人统计"></mallki>
            </div>
            <div class="loading" v-loading="loading_one">
              <div class="search">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getLendData" size="mini" v-model="searchForm.time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
                </el-date-picker>
              </div>
              <div class="content">
                <NumberPanel :countTo="false" :list="lendList" type="success"></NumberPanel>
              </div>
            </div>
          </section>
          <!-- 前十大出借人出借余额及出借余额占比 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="前十大出借人出借余额及出借余额占比"></mallki>
            </div>
            <div class="loading" v-loading="loading_two">
              <div class="content">
                <div class="table">
                  <el-table stripe :data="table_top">
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column label="出借人" prop="name"></el-table-column>
                    <el-table-column label="手机号" prop="phone"></el-table-column>
                    <el-table-column label="出借余额（元）" prop="totalInvestment"></el-table-column>
                    <el-table-column label="占比" prop="proportion">
                      <template slot-scope="scope">
                        <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </section>
          <!-- 综合分析 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="综合分析"></mallki>
            </div>
            <div class="loading" v-loading="loading_four">
              <div class="content">
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人性别分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzeSex"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzeSex.rows" class="table">
                        <el-table-column label="性别" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人年龄分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzeAge"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzeAge.rows" class="table">
                        <el-table-column label="年龄" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人注册渠道分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzeChannel"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzeChannel.rows" class="table">
                        <el-table-column label="渠道" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人出借金额分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzeMoney"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzeMoney.rows" class="table">
                        <el-table-column label="金额" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人出借时间分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzeTime"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzeTime.rows" class="table">
                        <el-table-column label="时间" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-wrapper">
                  <div class="name">
                    <el-tag style="width:100%">出借人出借端口分析</el-tag>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <ve-pie :data="chartAnalyzePort"></ve-pie>
                    </el-col>
                    <el-col :span="12">
                      <el-table stripe :data="chartAnalyzePort.rows" class="table">
                        <el-table-column label="端口" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column label="人数" prop="number" show-overflow-tooltip></el-table-column>
                        <el-table-column label="占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总次数" prop="investmentCount" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
              </div>

              <div class="content-wrapper">
                <div class="name">
                  <el-tag style="width:100%">出借人地区分析</el-tag>
                </div>
                <div class="loading" v-loading="loading_three">
                  <el-row>
                    <el-col :span="12">
                      <ve-map :data="chartAreaData" :legend-visible="false" :settings="chartAreaSettings"></ve-map>
                    </el-col>
                    <el-col :span="12">
                      <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getLendArea" size="mini" v-model="searchForm.areaTime" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
                      </el-date-picker>
                      <el-select @change="getLendArea" size="mini" v-model="search_table.rankKey" placeholder="">
                        <el-option label="按省份统计" value="province"></el-option>
                        <el-option label="按城市统计" value="city"></el-option>
                      </el-select>
                      <el-select @change="getLendArea" size="mini" v-model="search_table.sortType" placeholder="">
                        <el-option label="按出借人数排序" value="lendNumber"></el-option>
                        <el-option label="按出借金额排序" value="totalInvestment "></el-option>
                        <el-option label="按出借次数排序" value="investmentCount"></el-option>
                      </el-select>
                      <el-table stripe :data="table_area">
                        <el-table-column type="index" width="50">
                        </el-table-column>
                        <el-table-column label="城市" prop="regionName"></el-table-column>
                        <el-table-column label="出借人数" prop="lendNumber"></el-table-column>
                        <el-table-column label="人数占比" prop="proportion">
                          <template slot-scope="scope">
                            <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="出借总金额" prop="totalInvestment"></el-table-column>
                        <el-table-column label="出借次数" prop="investmentCount"></el-table-column>
                      </el-table>
                      <router-link to="/statistics/overview/lender/more">
                        <el-button type="">查看更多</el-button>
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </section>
        </div>
      </el-form>
    </div>
    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="showDialog">
      <span>
        <h2>出借人统计（某段时间内的统计）：</h2>
        <p>1.累计注册人数：指截至统计时点，该时间段平台通过手机号注册成功的用户总数（未选中统计时点，默认展示平台总注册人数）

          2.开通存管开户人数：指截至统计时点，该时间段平台开通存管开户账户成功的用户总数（未选中统计时点，默认展示平台开通存管开户总人数）

          3.累计出借人数量：出借人通过平台成功出借资金的出借人总数。同一出借人多次出借的，按实际出借人计算。（例如：张三出借3次，累计出借人数量为1）。

          4.首投人数：指截至统计时点，该时间段平台进行第一次出借成功的用户总数。

          5.复投人数：指截至统计时点，该时间段平台进行第二次出借成功的用户总数。

          6.单笔出借最高金额：指截至统计时点，该时间段经平台撮合完成交易的单笔最高出借金额。

          7.累计出借笔数：截至统计时点，经平台撮合完成的出借订单数量总和。（放款后计入）

          8.单人出借最高次数：指截至统计时点，该时间段经平台撮合完成交易的单个出借人出借的最高次数。

          9.人均出借金额：指截至统计时点，该时间段经平台撮合完成交易的出借金额/出借人数（未选中统计时点，默认展示平台总出借金额/总出借人数）（出借人数：进行过出借并且出借成功的用户）。</p>

        <h2>出借人统计（当前时间点的统计）：
        </h2>

        <p>1.当前出借人数量：截至统计时点仍存在待收借款的出借人总数。同一出借人多次出借的，按实际出借人计算。

          2.当前出借笔数：截至统计时点，平台所有出借人尚未收到还款的出借订单数量总和。</p>
        <h2>前十大出借人出借余额及出借余额占比（某段时间内的统计）：</h2>
        <p>列表按照出借人占比大小倒序排序

          1.最大十户出借余额占比(%)：截至统计时间点，出借金额最大的前十名出借人的出借余额总和与平台总出借余额之比。（展示明细）
        </p>
        <h2>出借人饼状图+表格说明分析（某段时间内的统计）：

        </h2>
        <p>1.出借人性别分析：截至统计时间点，每种性别类型（男、女）的人数占比、人数数量、出借总金额、出借总次数

          2.出借人年龄分析：截至统计时间点，每个年龄段（30岁及以下、31-35岁、36-40岁、40-45岁、45-60岁、60岁以上）的人数占比、人数数量、出借总金额、出借总次数

          3.出借人注册渠道分析：截至统计时间点，每个注册渠道（安卓、苹果、公众号、小程序、其他）的人数占比、人数数量、出借总金额、出借总次数

          4.出借人出借金额分析：截至统计时间点，每个出借金额区间（10000及以下、10001-30000、30001-50000、50000以上）的人数占比、人数数量、出借总金额、出借总次数

          5.出借人出借时间偏好分析：截至统计时间点，每个出借时间段（00:00-09:00、09:01-12:00、12:01-14:00、14:01-18:00、18:01-23:59）的人数占比、人数数量、出借总金额、出借总次数

          6.出借人出借端口分析：截至统计时间点，每个出借端口（安卓、苹果、公众号、小程序、其他）的人数占比、人数数量、出借总金额、出借总次数

          10.出借人地区分析：统计各个省市的出借人数量、借款总金额、借款次数、人数占比

        </p>

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
  export default {
    components: {
      Mallki,
      NumberPanel
    },
    data() {
      return {
        search_table: {
          rankKey: 'province',
          sortType: 'lendNumber'
        },
        pickerOptions,
        searchForm: {
          time: null
        },
        // 地图图表设置
        chartAreaSettings: {
          position: 'china',
          selectData: true,
          dataType: {
            '人数占比': 'percent'
          },
          zoom: 1.2
        },
        // 地图图表数据
        chartAreaData: {
          columns: ['位置', '出借人数', '出借总金额', '出借次数', '人数占比'],
          rows: []
        },
        table_area: [],
        // 分析图表数据
        chartAnalyzeSex: {
          columns: ['性别', '人数'],
          rows: []
        },
        chartAnalyzeAge: {
          columns: ['年龄', '人数'],
          rows: []
        },
        chartAnalyzeChannel: {
          columns: ['渠道', '人数'],
          rows: []
        },
        chartAnalyzeMoney: {
          columns: ['金额', '人数'],
          rows: []
        },
        chartAnalyzeTime: {
          columns: ['时间', '人数'],
          rows: []
        },
        chartAnalyzePort: {
          columns: ['端口', '人数'],
          rows: []
        },
        lendList: [],
        table_top: [],
        showDialog: false,
        loading_one: false,
        loading_two: false,
        loading_three: false,
        loading_four: false,
      }
    },
    created() {
      // 获取出借人数据
      this.getLendData()
      // 前十大借款人
      this.getLendTop()
      // 地区统计
      this.getLendArea()
      // 综合分析
      this.getLendZh('Sex')
      this.getLendZh('Age')
      this.getLendZh('Channel')
      this.getLendZh('Money')
      this.getLendZh('Time')
      this.getLendZh('Port')
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 获取出借人数据
      getLendData() {
        let data = {
          staTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[0] || null,
          endTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[1] || null,
        }
        this.loading_one = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LEND_ALL'],
          data
        }).then(data => {
          this.loading_one = false
          data.result.map(item => {
            item.text = item.title
            item.value = item.textvalue
            item.decimals = 0
          })
          this.lendList = data.result
        })
      },
      // 前十大借款人
      getLendTop() {
        this.loading_two = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LEND_TOP']
        }).then(data => {
          this.loading_two = false
          this.table_top = data.result
        })
      },
      // 地区统计
      getLendArea() {
        let data = {
          staTime: this.searchForm.areaTime && this.searchForm.areaTime.length > 0 && this.searchForm.areaTime[0] || null,
          endTime: this.searchForm.areaTime && this.searchForm.areaTime.length > 0 && this.searchForm.areaTime[1] || null,
          num: 1,
          size: 10,
          sortKey: this.search_table.sortType,
          rankKey: this.search_table.rankKey
        }
        this.loading_three = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LEND_AREA'],
          data,
        }).then(data => {
          this.loading_three = false
          this.table_area = data.result
          if (this.search_table.rankKey === 'province') {
            let _data = JSON.parse(JSON.stringify(data.result))
            _data.map(item => {
              item['位置'] = item.regionName && item.regionName.replace('省', '')
              item['出借人数'] = item.lendNumber
              item['出借总金额'] = item.totalInvestment
              item['出借次数'] = item.investmentCount
              item['人数占比'] = item.proportion
            })
            this.chartAreaData.rows = _data
          }
        })
      },
      // 综合分析
      getLendZh(type) {
        this.loading_four = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LEND_ZH'],
          data: type
        }).then(data => {
          this.loading_four = false
          switch (type) {
            case 'Sex':
              data.result.map(item => {
                item['性别'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzeSex.rows = data.result
              break;
            case 'Age':
              data.result.map(item => {
                item['年龄'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzeAge.rows = data.result
              break;
            case 'Channel':
              data.result.map(item => {
                item['渠道'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzeChannel.rows = data.result
              break;
            case 'Money':
              data.result.map(item => {
                item['金额'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzeMoney.rows = data.result
              break;
            case 'Time':
              data.result.map(item => {
                item['时间'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzeTime.rows = data.result
              break;
            case 'Port':
              data.result.map(item => {
                item.number = item.number || 0
                item['端口'] = item.title
                item['人数'] = item.number
              })
              this.chartAnalyzePort.rows = data.result
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
