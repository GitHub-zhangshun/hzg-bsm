<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-button type="danger" style="position: fixed;right:30px;z-index: 10001;" icon="el-icon-info" circle @click="showDialog = true"></el-button>
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <!-- 逾期总数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="逾期数据"></mallki>
            </div>
            <div class="loading" v-loading="loading_one">
              <div class="search">
                <el-date-picker @change="getOverdue" size="mini" v-model="searchForm.time" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
                </el-date-picker>
              </div>
              <div class="content">
                <NumberPanel :countTo="false" :list="overdueList" type="error"></NumberPanel>
              </div>
            </div>
          </section>
          <!-- 截止当前时间逾期数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="截止当前时间逾期数据"></mallki>
            </div>
            <div class="loading" v-loading="loading_two">
              <div class="content">
                <el-tag type="">当前时间：{{(new Date).toLocaleString()}}</el-tag>
                <el-button size="mini" type="success" @click="getOverdueNow" icon="el-icon-refresh" circle></el-button>
                <NumberPanel :countTo="false" :list="overdueListNow" type="error"></NumberPanel>
              </div>
            </div>
          </section>
        </div>
      </el-form>
    </div>
    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="showDialog">
      <span>
        <h2>累计数据（某段时间内的统计）：</h2>
        <p>1.累计逾期金额：截至统计时点，平台历史发生过逾期的本金总合。（达到还款日期后次日计入）

          2.累计逾期笔数：截至统计时点，平台历史发生过逾期的借款的笔数。（达到还款日期后次日计入）

          3.累计金额逾期率：截至统计时点，总逾期金额与平台所有借款人应还的本金总金额之比。

          4.收回违约金：截至统计时点，平台收回的逾期违约金金额。</p>

        <h2>截止到当前数据</h2>

        <p>1.当前逾期中金额：截至统计时点，按合同约定，出借人到期未收到本金总合。

          2.当前金额逾期率：截至统计时点，当前的逾期金额与平台所有借款人应还的本金总金额之比。

          3.当前逾期中笔数：截至统计时点，按合同约定，出借人到期未收到本金的借款的笔数。

          4.当前标的逾期率：截至统计时点，当前的逾期笔数与平台所有借款人应还的借款交易总笔数之比。

          5.当前逾期90天（不含）以上借款金额：截至统计时点，借款本金（或利息）发生逾90天（不含）以上且未偿还部分的借款本金之和

          6.当前借款逾期90天（不含）以上占比：截至统计时点，当前逾期90天（不含）以上借款金额与平台所有借款人应还的本金总金额之和

          7.当前逾期90天（不含）以上笔数：截至统计时点，按合同约定，借款本金（或利息）发生逾期90天（不含）以上且未偿还部分的借款笔数。

          8.逾期已还金额：截至统计时点，平台发生过逾期且已偿还的本金总合。

          9.逾期已还金额占比：截至统计时点，逾期已还金额与平台所有借款人应还的本金总金额之比。</p>



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
        pickerOptions,
        searchForm: {
          time: null
        },
        overdueList: [],
        overdueListNow: [],
        showDialog: false,
        loading_one: false,
        loading_two: false,
      }
    },
    created() {
      this.getOverdue()
      this.getOverdueNow()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 获取逾期累计数据
      getOverdue() {
        let data = {
          staTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[0] || null,
          endTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[1] || null,
        }
        this.loading_one = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_CUMULATIVE_DATE'],
          data
        }).then(data => {
          this.loading_one = false
          data.result.map(item => {
            item.value = item.textvalue
            item.text = item.title
          })
          this.overdueList = data.result
        }).catch(() => {
          this.loading_one = false
        })
      },
      // 获取逾期数据-截止当前时间
      getOverdueNow() {
        this.loading_two = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_OVERDUE_NOW'],
          data: Date.parse(new Date())
        }).then(data => {
          this.loading_two = false
          data.result.map(item => {
            item.value = item.textvalue
            item.text = item.title
          })
          this.overdueListNow = data.result
        }).catch(() => {
          this.loading_two = false
        })
      },
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
