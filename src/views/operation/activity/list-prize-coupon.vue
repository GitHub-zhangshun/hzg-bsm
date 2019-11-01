<template>
  <div class="post-container">
    <div class="post-main-container">
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0" v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.couponType === 1 ? '返利券' : '加息券'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="showName" label="名称">
        </el-table-column>
        <el-table-column prop="couponVal" label="面值">
          <template slot-scope="scope">
            <span>{{scope.row.couponVal || 0}} {{ scope.row.couponType == 1 ? '元' : '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitTime" label="限制期限">
          <template slot-scope="scope">
            <span>{{scope.row.limitTime || 0}} 天</span>
          </template>
        </el-table-column>
        <el-table-column prop="validDay" label="有效时间">
          <template slot-scope="scope">
            <span>{{scope.row.validDay || 0}} 天</span>
          </template>
        </el-table-column>
        <el-table-column prop="minMoney" label="起投金额">
          <template slot-scope="scope">
            <span>{{scope.row.minMoney || 0}} 元</span>
          </template>
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

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus" @close="dialogBaseClose">
        <el-form :model="dialogBaseForm" ref="dialogBaseForm" status-icon :rules="baseFormRules.dialogRules" label-width="100px">
          <el-form-item label="优惠券" prop="couponId">
            <el-select v-model="dialogBaseForm.couponId" placeholder="请选择优惠券" @change="couponDicChange">
              <el-option v-for="item in couponDic" :key="item.Id" :label="item.showName" :value="item.Id">
                <span style="float: left">{{ item.couponType === 1 ? '返利券' : '加息券' }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.showName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="dialogBaseForm.couponId">
            <el-form-item label="名称" prop="showName">
              <el-input v-model="dialogBaseForm.showName"></el-input>
            </el-form-item>
            <el-form-item label="面值" prop="couponVal">
              <el-input disabled v-model="dialogBaseForm.couponVal">
                <span slot="suffix">{{ dialogBaseForm.couponType == 1 ? '元' : '%' }}</span>
              </el-input>
            </el-form-item>
            <el-form-item label="起投金额" prop="minMoney">
              <el-input v-model="dialogBaseForm.minMoney">
                <span slot="suffix">元</span>
              </el-input>
            </el-form-item>
            <el-form-item label="限制期限" prop="limitTime">
              <el-input v-model="dialogBaseForm.limitTime">
                <span slot="suffix">天</span>
              </el-input>
            </el-form-item>
            <el-form-item label="有效时间" prop="validDay">
              <el-input v-model="dialogBaseForm.validDay">
                <span slot="suffix">天</span>
              </el-input>
            </el-form-item>
            <el-form-item label="标的限制类型" prop="bidType">
              <el-checkbox-group v-model="dialogBaseForm.bidType">
                <el-checkbox v-for="item in bidTypeList" :key="item.Id" :label="item.Id">{{ item.title }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBaseStatus = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit('base')">确 定</el-button>
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
        dialogBaseStatus: false,
        dialogBaseForm: {
          bidType: []
        },
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'name',
          text: '名称',
          type: 'text'
        }, {
          para: 'couponType',
          text: '券类型',
          type: 'custom_enum',
          details: {
            parse: [{
              label: '满减',
              value: '1'
            }, {
              label: '加息',
              value: '2'
            }]
          }
        }],
        tableListQuery: {
          dataId: this.$route.query.id
        },
        couponDic: {},
        bidTypeList: {}
      }
    },
    created() {
      this.getList()
      // 获取优惠券字典
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_COUPON_DIC'],
        data: {
          num: 1,
          size: 10000
        }
      }).then(data => {
        this.couponDic = data.result
      })
      // 获取产品类型
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_TYPE_DIC'],
        data: {
          queryType: '1',
          queryValue: 'bid_info_type'
        }
      }).then(data => {
        this.bidTypeList = data.result
      })
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
          case 'add':
            this.dialogTitle = '新增优惠券'
            this.dialogBaseStatus = true
            break

          // case 'dialogEdit':
          //   if (row.length !== 1) {
          //     this.$message.info('请选择一条数据')
          //   } else {
          //     // 获取已有的数据
          //     this.$request({
          //       url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
          //       data: row[0].Id
          //     }).then(data => {
          //       this.dialogBaseForm = data.result
          //       this.dialogTitle = '修改优惠券'
          //       this.dialogBaseStatus = true
          //       this.dialogBaseForm.couponType = data.result.couponType.toString()
          //     })
          //   }
          //   break

          default:
            break
        }
      },
      // dialog 提交事件
      dialogSubmit(name) {
        switch (name) {
          case 'base':
            this.$refs['dialogBaseForm'].validate((valid) => {
              if (valid) {
                this.dialogBaseForm.sourceType = '1'
                this.dialogBaseForm.sourceId = this.$route.query.activeId // 活动标识
                this.dialogBaseForm.prizeId = this.$route.query.id // 奖品标识
                this.dialogBaseForm.bidType = this.dialogBaseForm.bidType && this.dialogBaseForm.bidType.toString() || ''
                this.$request({
                  url: this.currentDialogUrl,
                  data: this.dialogBaseForm
                }).then(() => {
                  this.dialogBaseStatus = false
                  this.getList()
                })
              }
            })
            break

          default:
            break
        }
      },
      // 基础弹窗关闭事件
      dialogBaseClose() {
        this.dialogBaseForm = {
          bidType: []
        }
        this.$refs.dialogBaseForm.resetFields()
      },
      couponDicChange(e) {
        this.dialogBaseForm = this.couponDic.find(i => i.Id === e)
        this.dialogBaseForm.couponId = e
        this.dialogBaseForm.bidType = []
      }
    })
  }
</script>

<style lang="scss" scoped>


</style>
