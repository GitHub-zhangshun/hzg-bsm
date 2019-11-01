<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-button type="danger" style="position: fixed;right:30px;z-index: 10001;" icon="el-icon-info" circle @click="showDialog = true"></el-button>
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <!-- 经营数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="经营数据"></mallki>
            </div>
            <div class="search">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getPlatOverview" size="mini" v-model="searchForm.moneyTime" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
              </el-date-picker>
            </div>
            <div class="content">
              <NumberPanel formatNumber :countTo="false" :list="moneyPanelList"></NumberPanel>
            </div>
          </section>
          <!-- 平台综合数据指标 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="平台综合数据指标"></mallki>
            </div>
            <div class="content">
              <NumberPanel :countTo="false" :list="platKpiPanelList"></NumberPanel>
            </div>
          </section>
          <!-- 平台交易趋势图 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="平台交易趋势图"></mallki>
            </div>
            <div class="search">
              <el-date-picker @change="getPlatTradingTrendsYear" v-model="searchForm.year" type="year" placeholder="选择年" size="mini" value-format="yyyy">
              </el-date-picker>
            </div>
            <div class="content">
              <ve-histogram :data="chartYearData" :settings="mouthMoneyChartSettings"></ve-histogram>
            </div>
            <div class="search">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getPlatTradingTrendsDay" size="mini" v-model="searchForm.day" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp">
              </el-date-picker>
            </div>
            <div class="content">
              <ve-histogram :data="chartDayData" :settings="dayMoneyChartSettings"></ve-histogram>
            </div>
          </section>
          <!-- test -->
          <!-- <section>
            <ve-line :data="chartData" :settings="chartSettings"></ve-line>
          </section> -->
        </div>
      </el-form>
    </div>
    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="showDialog">
      <span>
        <h2>经营数据（某段时间内的统计，精确到分钟）：</h2>
        <p>1.累计交易金额：截至统计时点，经平台撮合完成的借款项目的本金总合。（放款后计入，）

          2.借贷余额：截至统计时点，平台所有借款人尚未偿还的本金总金额（不包括利息部分）

          3.累计赚取利息：截至统计时点，平台所有借款人已偿还的借款利息总金额（不包括本金部分，还款成功后计入统计）

          4.利息余额：指截至统计时点，经平台撮合完成且借款人尚未偿还的预期借款利息总金额（不包括本金部分）

          5.累计充值金额：指截至统计时点，该时间段所有出借人累计在平台进行充值成功的金额之和。（出借人充值成功后计入）

          6.累计提现金额：指截至统计时点，该时间段所有出借人累计在平台进行提现成功的金额之和。（出借人提现成功后计入）</p>

        <h2>平台综合数据指标：</h2>

        <p>平台上线时间：2015年5月6日

          1.运营指数：上线至今总成交额(单位：万元)/上线时长(单位：天)

          2.出借指数：出借人总数/借款人总数

          3.借款指数：过去90天借款总额/过去90天借款总人数

          4.偿兑指数：近90天日还款额累加和/近360天日还款额累加和（还款成功后计入统计）</p>

        <h2>平台交易趋势图：</h2>

        <p>1.按年查询：默认展示当年每月的交易数据；筛选条件：年份和金额类型

          2.按天查询：默认展示仅15天的交易数据；筛选条件：日期（最多间隔15天查询，）和金额类型</p>



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
        searchForm: {
          moneyTime: [],
          year: '2019',
          day: [GetDateStr(-15), Date.parse(new Date())]
        },
        moneyPanelList: [],
        platKpiPanelList: [],
        mouthMoneyChartSettings: {
          yAxisType: ['normal'],
          yAxisName: ['金额(万元)'],
          labelMap: {
            'monthNum': '月份',
            'cashPaymentMoney': '兑付金额',
            'lendingMoney': '出借金额',
            'rechargeMoney': '充值金额',
            'withdrawalMoney': '提现金额',
          },
        },
        chartYearData: {
          columns: ['monthNum', 'cashPaymentMoney', 'lendingMoney', 'rechargeMoney', 'withdrawalMoney'],
          rows: []
        },
        dayMoneyChartSettings: {
          yAxisType: ['normal'],
          yAxisName: ['金额(万元)'],
          labelMap: {
            'dayTime': '天',
            'cashPaymentMoney': '兑付金额',
            'lendingMoney': '出借金额',
            'rechargeMoney': '充值金额',
            'withdrawalMoney': '提现金额',
          },
        },
        chartDayData: {
          columns: ['dayTime', 'cashPaymentMoney', 'lendingMoney', 'rechargeMoney', 'withdrawalMoney'],
          rows: []
        },
        showDialog: false,
        // chartSettings: {
        //   // axisSite: {
        //   //   right: ['下单率']
        //   // },
        //   // yAxisType: ['percent'],
        //   yAxisName: ['Mbps'],
        // },
        // chartData: {
        //   columns: ['日期', '入流量带宽', '出流量带宽'],
        //   rows: [
        //     { '日期': '12:00', '入流量带宽': 100, '出流量带宽': 200 },
        //     { '日期': '13:00', '入流量带宽': 321, '出流量带宽': 300 },
        //     { '日期': '14:00', '入流量带宽': 2111, '出流量带宽': 700 },
        //     { '日期': '15:00', '入流量带宽': 900, '出流量带宽': 690 },
        //     { '日期': '16:00', '入流量带宽': 3792, '出流量带宽': 32 },
        //     { '日期': '17:00', '入流量带宽': 4593, '出流量带宽': 293 },
        //     { '日期': '18:00', '入流量带宽': 4490, '出流量带宽': 333 },
        //     { '日期': '18:30', '入流量带宽': 4490, '出流量带宽': 4500 },
        //     { '日期': '19:00', '入流量带宽': 4000, '出流量带宽': 4800 },
        //     // { '日期': '20:00', '入流量带宽': 70, '出流量带宽': 88 },
        //   ]
        // }
      }
    },
    created() {
      // 经营数据
      this.getPlatOverview()
      // 获取综合数据指标
      this.getPlatKpi()
      // 获取交易趋势图-年
      this.getPlatTradingTrendsYear()
      // 获取交易趋势图-天
      this.getPlatTradingTrendsDay()
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
      getPlatOverview() {
        let data = {
          staTime: this.searchForm.moneyTime && this.searchForm.moneyTime.length > 0 && this.searchForm.moneyTime[0] || null,
          endTime: this.searchForm.moneyTime && this.searchForm.moneyTime.length > 0 && this.searchForm.moneyTime[1] || null,
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_PLAT_OVERVIEW_LIST'],
          data
        }).then(data => {
          this.moneyPanelList = [{
            text: '累计交易金额',
            value: data.result.sumTransactionMoney
          }, {
            text: '借贷余额（元）',
            value: data.result.loanBalance
          }, {
            text: '累计赚取利息（元）',
            value: data.result.sumInterest
          }, {
            text: '利息余额（元）',
            value: data.result.interestBalance
          }, {
            text: '累计充值金额（元）',
            value: data.result.sumRechargeMoney
          }, {
            text: '累计提现金额（元）',
            value: data.result.sumExtractMoney
          }]
        })
      },
      // 获取综合数据指标
      getPlatKpi() {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_PLAT_KPI']
        }).then(data => {
          this.platKpiPanelList = [{
            text: '运营指数',
            value: data.result.management
          }, {
            text: '投资指数',
            value: data.result.investment
          }, {
            text: '借款指数',
            value: data.result.loan
          }, {
            text: '偿兑指数',
            value: data.result.repayment
          }]
        })
      },
      // 获取交易趋势数据-年
      getPlatTradingTrendsYear() {
        let data = {
          year: this.searchForm.year
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_PLAT_TRADING_TREND_YEAR'],
          data
        }).then(data => {
          data.result.map(i => {
            i.monthNum = `${i.monthNum}月`
          })
          this.chartYearData.rows = data.result
        })
      },
      // 获取交易趋势数据-天
      getPlatTradingTrendsDay() {
        let data = {
          staTime: this.searchForm.day && this.searchForm.day.length > 0 && this.searchForm.day[0] || GetDateStr(-15),
          endTime: this.searchForm.day && this.searchForm.day.length > 0 && this.searchForm.day[1] || Date.parse(new Date()),
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_PLAT_TRADING_TREND_DAY'],
          data
        }).then(data => {
          data.result.map(i => {
            i.dayTime = this.getTime(i.dayTime, '{m}-{d}')
          })
          this.chartDayData.rows = data.result
        })
      }
    })
  }
</script>
<style lang="scss" scoped>
  .main-wrapper {
    section {
      // border: 2px solid transparent;
      // border-image: linear-gradient(to right, #F80, #2ED);
      // border-image-slice: 10;
      // border-top: none;
      // border-right: none;
      // border-left: none;
      padding: 10px;
      margin-bottom: 8px;

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
    }
  }
</style>
