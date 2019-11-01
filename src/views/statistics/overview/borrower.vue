<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-button type="danger" style="position: fixed;right:30px;z-index: 10001;" icon="el-icon-info" circle @click="showDialog = true"></el-button>
      <el-form :model="searchForm" size="mini">
        <div class="main-wrapper">
          <!-- 借款人数据 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="借款人数据"></mallki>
            </div>
            <div class="loading" v-loading="loading_one">
              <div class="search">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getBorrowerData" size="mini" v-model="searchForm.time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
                </el-date-picker>
              </div>
              <div class="content">
                <NumberPanel :countTo="false" :list="borrowerList" type="success"></NumberPanel>
                <div class="detail">
                  <div class="item" v-for="(item, index) in borrowerList" :key="index">
                    <span>个人：{{item.personal}}</span>
                    <span>企业：{{item.enterprise}}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- 关联关系借款人信息 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="关联关系借款人信息"></mallki>
            </div>
            <div class="loading" v-loading="loading_two">
              <div class="content">
                <el-table stripe :data="table_relate" show-summary>
                  <el-table-column label="关联关系借款人" prop="name"></el-table-column>
                  <el-table-column label="关联关系借款余额（元）" prop="money"></el-table-column>
                  <el-table-column label="关联关系借贷余额笔数" prop="frequency"></el-table-column>
                </el-table>
              </div>
            </div>
          </section>
          <!-- 前十大借款人待还金额及待还金额占比 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="前十大借款人待还金额及待还金额占比"></mallki>
            </div>
            <div class="loading" v-loading="loading_three">
              <el-table stripe :data="table_top" show-summary>
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column label="借款人" prop="realName"></el-table-column>
                <el-table-column label="待还金额（元）" prop="loanMoney"></el-table-column>
                <el-table-column label="占比" prop="proportion">
                  <template slot-scope="scope">
                    <span>{{(scope.row.proportion * 100).toFixed(2)}} %</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </section>
          <!-- 借款人地区统计 -->
          <section>
            <div class="title">
              <mallki className="mallki-text" text="借款人地区统计"></mallki>
            </div>
            <div class="loading" v-loading="loading_four">
              <div class="content">
                <div class="chart">
                  <ve-map :data="chartData" :legend-visible="false" :settings="chartSettings"></ve-map>
                </div>
                <div class="table">
                  <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="getBorrowerArea" size="mini" v-model="searchForm.areaTime" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" value-format="timestamp">
                  </el-date-picker>
                  <el-select @change="getBorrowerArea" size="mini" v-model="search_table.rankKey" placeholder="">
                    <el-option label="按省份统计" value="province"></el-option>
                    <el-option label="按城市统计" value="city"></el-option>
                  </el-select>
                  <el-select @change="getBorrowerArea" size="mini" v-model="search_table.sortType" placeholder="">
                    <el-option label="按借款人数排序" value="number"></el-option>
                    <el-option label="按借款金额排序" value="sumMoney "></el-option>
                    <el-option label="按借款次数排序" value="sumLoanNumber"></el-option>
                  </el-select>
                  <el-table stripe :data="table_area">
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column label="城市" prop="regionName"></el-table-column>
                    <el-table-column label="企业借款人数" prop="enterpriseNumber"></el-table-column>
                    <el-table-column label="个人借款人数" prop="personalNumber"></el-table-column>
                    <el-table-column label="企业人数占比">
                      <template slot-scope="scope">
                        <span>{{(scope.row.enterpriseProportion * 100).toFixed(2)}} %</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="个人人数占比">
                      <template slot-scope="scope">
                        <span>{{(scope.row.personalProportion * 100).toFixed(2)}} %</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="企业借款总金额" prop="enterpriseLoanMoney"></el-table-column>
                    <el-table-column label="个人借款总金额" prop="personalLoanMoney"></el-table-column>
                    <el-table-column label="企业借款次数" prop="enterpriseLoanNumber"></el-table-column>
                    <el-table-column label="个人借款次数" prop="personLoanNumber"></el-table-column>
                  </el-table>
                  <router-link to="/statistics/overview/borrower/more">
                    <el-button type="">查看更多</el-button>
                  </router-link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </el-form>
    </div>
    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="showDialog">
      <span>
        <h2>借款人数据（某段时间内的统计）：</h2>
        <p>1.累计借款人数量：截至统计时点，借款人通过平台成功借款的借款人总数。同一借款人多次借款的，按实际借款人计算。（例如：张三借款3次，累计借款人数量为1，放款成功后计入）。

          2.累计借款笔数：截至统计时点，经平台撮合完成且放款成功的标的数量总和。（放款后计入）</p>

        <h2>借款人数据（当前时间点的统计，不受时间条件筛选影响）：

        </h2>

        <p>1.当前借款人数量：截至统计时点，平台仍存在待还借款的借款人总数。同一借款人多次借款的按实际借款人计算。

          2.当前借款笔数：截至统计时点，平台所有借款人尚未还清的的借款人数量总和。</p>
        <h2>前十大借款人待还金额及待还金额占比</h2>
        <p>列表按照占比大小倒序排序

          1.前十大借款人待还金额占比(%)：在平台撮合的项目中，借款最多的前十户借款人的借款余额占总借款余额的比例。

          2.最大单一借款人待还金额占比(%)：指在平台撮合的项目中，借款最多一户借款人的借款余额占总借款余额的比例。

        </p>
        <h2>关联关系借款人信息</h2>
        <p>系统中将借款人设置为关系户的都作为关联关系借款人统计

          1.关联关系借款余额:指截至统计时点，与平台具有关联关系的借款人通过平台撮合完成的借款总余额。关联关系指网络借贷信息中介机构主要股东、实际控制人、董事、监事、高级管理人员与其直接或间接控制、有重大影响的企业、自然人之间的关系，以及可能导致网络借贷信息中介机构利益转移的其他关系（主要股东，指持有或控制网络信息借贷中介机构5%以上股份或表决权的自然人、法人或其他组织；直接或间接控制企业，指直接或间接持有企业5%以上股份或表决权）。

          2.关联关系借贷余额笔数：截至统计时点，与平台具有关联关系的借款人通过平台撮合完成的借款余额总笔数

        </p>
        <h2>借款人地区统计（个人和企业）</h2>
        <p>1.人数占比：某城市的企业/个人借款人数量占总企业/个人借款人数量

          2.借款次数：放款后计入

          3.借款总金额：借款人借款成功的本金金额（放款后计入）</p>

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
      this.chartSettings = {
        position: 'china',
        selectData: true,
        dataType: {
          '人数占比': 'percent'
        },
        zoom: 1.2
      }
      return {
        search_table: {
          rankKey: 'province',
          sortType: 'number'
        },
        chartData: {
          columns: ['位置', '借款人数', '借款总金额', '借款次数', '人数占比'],
          rows: []
        },
        pickerOptions,
        searchForm: {
          time: null,
          areaTime: null
        },
        table_relate: [],
        table_top: [],
        table_area: [],
        borrowerList: [],
        showDialog: false,
        loading_one: false,
        loading_two: false,
        loading_three: false,
        loading_four: false,
      }
    },
    created() {
      // 获取借款人数据
      this.getBorrowerData()
      // 关联关系借款人信息
      this.getBorrowerRelation()
      // 前十大借款人
      this.getBorrowerTop()
      // 地区统计
      this.getBorrowerArea()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 获取借款人数据
      getBorrowerData() {
        let data = {
          staTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[0] || null,
          endTime: this.searchForm.time && this.searchForm.time.length > 0 && this.searchForm.time[1] || null,
        }
        this.loading_one = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BORROWER_ALL'],
          data
        }).then(data => {
          this.loading_one = false
          data.result.map(item => {
            item.text = item.title
            item.value = this.numAdd(item.personal, item.enterprise)
            item.decimals = 0
          })
          this.borrowerList = data.result
        })
      },
      // 关联关系借款人信息
      getBorrowerRelation() {
        this.loading_two = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BORROWER_RELATION']
        }).then(data => {
          this.loading_two = false
          this.table_relate = data.result
        })
      },
      // 前十大借款人
      getBorrowerTop() {
        this.loading_three = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BORROWER_TOP']
        }).then(data => {
          this.loading_three = false
          this.table_top = data.result
        })
      },
      // 地区统计
      getBorrowerArea() {
        let data = {
          staTime: this.searchForm.areaTime && this.searchForm.areaTime.length > 0 && this.searchForm.areaTime[0] || null,
          endTime: this.searchForm.areaTime && this.searchForm.areaTime.length > 0 && this.searchForm.areaTime[1] || null,
          num: 1,
          size: 10,
          sortKey: this.search_table.sortType,
          rankKey: this.search_table.rankKey
        }
        this.loading_four = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BORROWER_AREA'],
          data,
        }).then(data => {
          this.loading_four = false
          this.table_area = data.result
          if (this.search_table.rankKey === 'province') {
            let _data = JSON.parse(JSON.stringify(data.result))
            _data.map(item => {
              item['位置'] = item.regionName && item.regionName.replace('省', '')
              item['借款人数'] = item.number
              item['借款总金额'] = item.sumMoney
              item['借款次数'] = item.sumLoanNumber
              item['人数占比'] = item.sumProportion
            })
            this.chartData.rows = _data
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
        >.detail {
          display: flex;
          font-size: 12px;
          color: #ccc;
          margin-top: -20px;

          >.item {
            min-width: 100px;
            display: flex;
            flex-direction: column;
            margin-right: 52px;

            &:nth-child(2) {
              margin-right: 38px;
            }
          }
        }
      }
    }
  }
</style>
