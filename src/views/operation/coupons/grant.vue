<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="标题">
        </el-table-column>
        <el-table-column prop="totalCount" label="发放数量">
        </el-table-column>
        <el-table-column prop="takeCount" label="成功数量">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createAt && getTime(scope.row.createAt) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否发送短信">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column> -->
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

      <!-- 发放详情 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="coupon.dialog.title" :visible.sync="coupon.dialog.status">
        <el-table stripe :data="coupon.table.list" border v-loading="coupon.table.loading">
          <el-table-column label="类型" fixed>
            <template slot-scope="scope">
              <span>{{scope.row.couponType === 1 ? '返利券' : '加息券'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="showName" label="名称" fixed>
          </el-table-column>
          <el-table-column prop="couponVal" label="面值" fixed>
            <template slot-scope="scope">
              <span>{{scope.row.couponVal || 0}} {{ scope.row.couponType == 1 ? '元' : '%' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="minMoney" label="起投金额">
            <template slot-scope="scope">
              <span>{{scope.row.minMoney || 0}} 元</span>
            </template>
          </el-table-column>
          <el-table-column prop="validDay" label="有效期(天)" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.validDay || 0}} 天</span>
            </template>
          </el-table-column>
          <el-table-column prop="limitTime" label="限制期限(天)" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.limitTime || 0}} 天</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="bidType" label="限制类型" width="400px">
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.bidType">
                <el-checkbox v-for="item in coupon.bidTypeList" :key="item.Id" :label="item.Id">{{ item.title }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange_coupon" @current-change="handleCurrentChange_coupon" :current-page="coupon.pageForm.num" :page-sizes="[5,10,15,20]" :page-size="coupon.pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="coupon.pageForm.total">
          </el-pagination>
        </div>
      </el-dialog>
      <!-- 领取记录 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="take.dialog.title" :visible.sync="take.dialog.status">
        <el-table stripe :data="take.table.list" border v-loading="take.table.loading">
          <el-table-column prop="name" label="姓名" fixed>
          </el-table-column>
          <el-table-column prop="phone" label="手机" fixed>
          </el-table-column>
          <el-table-column prop="prize" label="名称" fixed>
          </el-table-column>
          <el-table-column prop="isTake" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.isTake ? '领取成功' : '领取失败'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange_take" @current-change="handleCurrentChange_take" :current-page="take.pageForm.num" :page-sizes="[5,10,15,20]" :page-size="take.pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="take.pageForm.total">
          </el-pagination>
        </div>
      </el-dialog>
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
  import {
    baseFormRules
  } from '@/business/rules'

  export default {
    data() {
      return {
        baseFormRules,
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
          para: 'name',
          text: '名称',
          type: 'text'
        }],
        // 发放详情
        coupon: {
          dialog: {
            title: '优惠券发放详情',
            status: false,
            url: '',
            row: {}
          },
          table: {
            list: [],
            loading: false
          },
          pageForm: {
            total: 0,
            num: 1,
            size: 10
          },
        },
        // 领取记录
        take: {
          dialog: {
            title: '优惠券发放详情',
            status: false,
            url: '',
            row: {}
          },
          table: {
            list: [],
            loading: false
          },
          pageForm: {
            total: 0,
            num: 1,
            size: 10
          },
        }
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
      // 弹窗事件
      func_dialog(action, row) {
        // 获取当前的弹窗提交地址
        this.currentDialogUrl = action.apiUrl
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          // 显示优惠券发放详情
          case 'showCouponList':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.coupon.dialog.status = true
            this.coupon.dialog.row = row[0]
            this.coupon.dialog.url = action.apiUrl
            this.getCouponList()
            break

          case 'showTake':
            // 领取记录
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.take.dialog.status = true
            this.take.dialog.row = row[0]
            this.take.dialog.url = action.apiUrl
            this.getTakeList()
            break

          default:
            break
        }
      },
      // 通用执行
      func_execute(action, row) {
        switch (action.routeUrl) {
          // 继续发送
          case 'give':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
              return
            }
            this.$confirm('继续发送优惠券, 是否继续?', '继续发送优惠券', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                data.result ? this.$message.success('发放成功') : this.$message.error(data.message || '未获取到错误信息')
                this.getList()
              })
            })
            break;

          default:
            break;
        }
      },
      // 获取发放优惠券详情
      getCouponList() {
        this.coupon.table.loading = true
        const data = Object.assign({
          dataId: this.coupon.dialog.row.Id
        }, this.coupon.pageForm)
        this.$request({
          url: this.coupon.dialog.url,
          data,
        }).then(data => {
          this.coupon.table.loading = false
          this.coupon.table.list = data.result
          this.coupon.pageForm.total = data.total
        })
      },
      // 改变每页数量
      handleSizeChange_coupon(val) {
        this.coupon.pageForm.size = val
        this.getCouponList()
      },
      // 改变页数
      handleCurrentChange_coupon(val) {
        this.coupon.pageForm.num = val
        this.getCouponList()
      },
      // 获取领取记录
      getTakeList() {
        this.take.table.loading = true
        const data = Object.assign({
          dataId: this.take.dialog.row.Id
        }, this.take.pageForm)
        this.$request({
          url: this.take.dialog.url,
          data,
        }).then(data => {
          this.take.table.loading = false
          this.take.table.list = data.result
          this.take.pageForm.total = data.total
        })
      },
      // 改变每页数量
      handleSizeChange_take(val) {
        this.take.pageForm.size = val
        this.getTakeList()
      },
      // 改变页数
      handleCurrentChange_take(val) {
        this.take.pageForm.num = val
        this.getTakeList()
      },
    })
  }
</script>

<style lang="scss" scoped>


</style>
