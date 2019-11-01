<template>
  <div class="post-container">
    <div class="post-main-container">
      <div class="coupon">
        <div class="tip">
          <span>优惠券添加</span>
        </div>
        <!-- 优惠券 table list -->
        <el-button type="" @click="showCouponDic">添加</el-button>
        <el-table stripe :data="coupon.table.list" border row-key="Id" style="width: 100%;margin-top:5px;">
          <el-table-column label="类型" fixed>
            <template slot-scope="scope">
              <span>{{scope.row.couponType === 1 ? '返利券' : '加息券'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="showName" label="名称" width="200px" fixed>
            <template slot-scope="scope">
              <el-input v-model="scope.row.showName" placeholder="请输入名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="couponVal" label="面值" fixed>
          </el-table-column>
          <el-table-column prop="minMoney" label="起投金额" width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.minMoney" placeholder="请输入起投金额"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="validDay" label="有效期" width="150px">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.validTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
              <!-- <el-input v-model="scope.row.validDay" placeholder="请输入有效期"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="limitTime" label="限制期限(天)" width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitTime" placeholder="请输入限制期限"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="bidType" label="标的限制类型" width="400px">
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.bidType">
                <el-checkbox v-for="item in coupon.bidTypeList" :key="item.Id" :label="item.Id">{{ item.title }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delCoupon(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 用户 table list -->
      <div class="user">
        <div class="tip">
          <span>出借人添加</span>
        </div>
        <el-button type="">按分组勾选</el-button>
        <div class="group">
          <el-checkbox-group v-model="user.checkedGroup">
            <el-checkbox v-for="item in user.groupList" :key="item.Id" :label="item.Id">{{ item.title }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="" @click="showUserList">按出借人勾选添加</el-button>
        <el-table stripe :data="user.table.list" border row-key="Id">
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="idcardCode" label="身份证号">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="" @click="showConditionUserList">按出借人搜索添加添加所有</el-button>
        <el-table stripe :data="conditionUser.table.list" border row-key="Id">
          <el-table-column prop="condition" label="条件">
          </el-table-column>
          <el-table-column prop="count" label="人数">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delConditionUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="other">
        <el-select v-model="other.isSendSms" placeholder="">
          <el-option label="发送短信" value="true"></el-option>
          <el-option label="不发短信" value="false"></el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="other.name">
          <template slot="prepend">标题</template>
        </el-input>
      </div>
      <el-button type="primary" @click="submit" :loading="subLoading">确定发放</el-button>
      <!-- 优惠券字典 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="coupon.dialog.title" :visible.sync="coupon.dialog.status">
        <!-- table list -->
        <el-table stripe :data="coupon.dialog.dic" border style="width: 100%;margin-top:5px;" v-loading="coupon.dialog.loading">
          <el-table-column label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.couponType === 1 ? '返利券' : '加息券'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="showName" label="名称">
          </el-table-column>
          <el-table-column prop="couponVal" label="面值">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="addCoupon(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
          </el-pagination>
        </div> -->
      </el-dialog>
      <!-- 出借人勾选添加 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogInvestStatus" width="80%">
        <TableListHeader @updateData="getList()" @topAction="top_execute" v-model="investorSearchForm" :searchItems="investorSearchItems" @change="queryInvestor()">
        </TableListHeader>
        <!-- table list -->
        <el-table stripe @row-dblclick="pitchRow" ref="table" row-key="Id" :data="investorTable.list" border style="width: 100%;margin-top:5px;" v-loading="investorTable.loading" @selection-change="investorTableChange">
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="idcardCode" label="身份证号">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="investorSizeChange" @current-change="investorCurrentChange" :current-page="investorPageForm.num" :page-sizes="[1,5,10,15,20]" :page-size="investorPageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="investorPageForm.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInvestStatus = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 出借人条件勾选添加 dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogConditionInvestStatus" width="70%">
        <TableListHeader @updateData="getList()" @topAction="top_execute" v-model="conditionInvestorSearchForm" :searchItems="conditionInvestorSearchItems" @change="queryConditionInvestor()">
        </TableListHeader>
        <!-- table list -->
        <el-table stripe :data="conditionInvestorTable.list" border style="width: 100%;margin-top:5px;" v-loading="conditionInvestorTable.loading" @selection-change="conditionInvestorTableChange">
          <!-- <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column> -->
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="idcardCode" label="身份证号">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="conditionInvestorSizeChange" @current-change="conditionInvestorCurrentChange" :current-page="conditionInvestorPageForm.num" :page-sizes="[1,5,10,15,20]" :page-size="conditionInvestorPageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="conditionInvestorPageForm.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogConditionInvestStatus = false">取 消</el-button>
          <el-button type="primary" @click="addConditionUser">确 定</el-button>
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
  export default {
    data() {
      return {
        subLoading: false,
        coupon: {
          table: {
            list: []
          },
          dialog: {
            title: '添加优惠券',
            status: false,
            loading: false,
            dic: []
          },
          bidTypeList: []
        },
        user: {
          table: {
            list: []
          },
          groupList: [],
          checkedGroup: []
        },
        dialogTitle: '', // 当前弹窗标题
        investorPageForm: { // 出借人分页数据
          total: 0,
          num: 1,
          size: 10
        },
        investorTable: { // 出借人列表
          list: [],
          loading: false,
          tableChangeList: []
        },
        investorSearchForm: {}, // 出借人列表查询条件
        investorSearchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }, {
          para: 'openTime',
          text: '开户时间起|开户时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['openStartTime', 'openEndTime']
          }
        }, {
          para: 'registerTime',
          text: '注册时间起|注册时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['registerStartTime', 'registerEndTime']
          }
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }],
        dialogInvestStatus: false,

        conditionUser: {
          table: {
            list: []
          }
        },
        conditionInvestorPageForm: { // 出借人分页数据
          total: 0,
          num: 1,
          size: 10
        },
        conditionInvestorTable: { // 出借人列表
          list: [],
          loading: false,
          tableChangeList: []
        },
        conditionInvestorSearchForm: {}, // 出借人列表查询条件
        conditionInvestorSearchItems: [{
          para: 'name',
          text: '姓名',
          type: 'text'
        }, {
          para: 'phone',
          text: '手机',
          type: 'text'
        }, {
          para: 'openTime',
          text: '开户时间起|开户时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['openStartTime', 'openEndTime']
          }
        }, {
          para: 'registerTime',
          text: '注册时间起|注册时间止',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['registerStartTime', 'registerEndTime']
          }
        }, {
          para: 'isOpen',
          text: '存管开户',
          type: 'bool_enum',
          details: {
            parse: ['已开户', '未开户']
          }
        }],
        dialogConditionInvestStatus: false,
        other: {
          isSendSms: 'false',
          name: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    created() {
      // 获取优惠券字典
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_COUPON_DIC'],
        data: {
          num: 1,
          size: 10000
        }
      }).then(data => {
        this.coupon.dialog.dic = data.result
      })
      // 获取产品类型
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_TYPE_DIC'],
        data: {
          queryType: '1',
          queryValue: 'bid_info_type'
        }
      }).then(data => {
        this.coupon.bidTypeList = data.result
      })
      // 获取用户分组
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_TYPE_DIC'],
        data: {
          queryType: '1',
          queryValue: 'uc_user_group'
        }
      }).then(data => {
        this.user.groupList = data.result
      })
    },
    methods: Object.assign(_func(), {
      showCouponDic() {
        this.coupon.dialog.status = true
      },
      createRandomId() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
      },
      addCoupon(dic) {
        let _dic = JSON.parse(JSON.stringify(dic))
        _dic.Id = this.createRandomId()
        _dic.bidType = []
        this.coupon.table.list.push(_dic)
      },
      delCoupon(dic) {
        this.coupon.table.list.splice(this.coupon.table.list.findIndex(item => item.Id === dic.Id), 1)
      },
      addUser() {
        const _user = JSON.parse(JSON.stringify(this.investorTable.tableChangeList))
        this.user.table.list = Object.assign(_user, this.user.table.list)
        this.dialogInvestStatus = false
      },
      delUser(user) {
        this.user.table.list.splice(this.user.table.list.findIndex(item => item.Id === user.Id), 1)
      },
      showUserList() {
        this.dialogTitle = '按个人添加'
        this.dialogInvestStatus = true
        this.getInvestorList()
      },
      // 出借人 table 获取
      getInvestorList() {
        this.investorTable.loading = true
        const data = Object.assign(this.investorSearchForm, this.investorPageForm)
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_USER_LIST'],
          data
        }).then(data => {
          this.investorTable.loading = false
          this.investorTable.list = data.result
          this.investorPageForm.total = data.total
        })
      },
      // 出借人 table 选项变化
      investorTableChange(val) {
        this.investorTable.tableChangeList = val
      },
      // 出借人 table 查询
      queryInvestor() {
        this.getInvestorList()
      },
      // 出借人 page 改变每页数量
      investorSizeChange(val) {
        this.investorPageForm.size = val
        this.getInvestorList()
      },
      // 出借人 page 改变当前页数
      investorCurrentChange(val) {
        this.investorPageForm.num = val
        this.getInvestorList()
      },
      /**  条件添加 */
      showConditionUserList() {
        this.dialogTitle = '按搜索添加添加所有'
        this.dialogConditionInvestStatus = true
        this.getConditionInvestorList()
      },
      // 出借人 table 获取
      getConditionInvestorList() {
        this.conditionInvestorTable.loading = true
        const data = Object.assign(this.conditionInvestorSearchForm, this.conditionInvestorPageForm)
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_USER_LIST'],
          data
        }).then(data => {
          this.conditionInvestorTable.loading = false
          this.conditionInvestorTable.list = data.result
          this.conditionInvestorPageForm.total = data.total
        })
      },
      // 出借人 table 选项变化
      conditionInvestorTableChange(val) {
        this.conditionInvestorTable.tableChangeList = val
      },
      // 出借人 table 查询
      queryConditionInvestor() {
        this.getConditionInvestorList()
      },
      // 出借人 page 改变每页数量
      conditionInvestorSizeChange(val) {
        this.conditionInvestorPageForm.size = val
        this.getConditionInvestorList()
      },
      // 出借人 page 改变当前页数
      conditionInvestorCurrentChange(val) {
        this.conditionInvestorPageForm.num = val
        this.getConditionInvestorList()
      },
      addConditionUser() {
        if (this.conditionInvestorPageForm.total === 0) {
          this.dialogConditionInvestStatus = false
          return
        }
        // 先清空上次选择
        this.conditionUser.table.list = []
        let keys = Object.keys(this.conditionInvestorSearchForm)
        let conditionStr = ''
        keys.forEach(key => {
          if (!!this.conditionInvestorSearchForm[key] && key !== 'size' && key !== 'num' && key !== 'total' && key !== 'closeSecrecy') {
            if (key === 'openTime') {
              conditionStr += `开户时间: ${this.conditionInvestorSearchForm['openStartTime'] && this.getTime(this.conditionInvestorSearchForm['openStartTime'], '{y}-{m}-{d}') || '---'}
              至 ${this.conditionInvestorSearchForm['openEndTime'] && this.getTime(this.conditionInvestorSearchForm['openEndTime'], '{y}-{m}-{d}') || '---'} /`
            } else if (key === 'registerTime') {
              conditionStr += `注册时间: ${this.conditionInvestorSearchForm['registerStartTime'] && this.getTime(this.conditionInvestorSearchForm['registerStartTime'], '{y}-{m}-{d}') || '---'}
              至 ${this.conditionInvestorSearchForm['registerEndTime'] && this.getTime(this.conditionInvestorSearchForm['registerEndTime'], '{y}-{m}-{d}') || '---'} /`
            } else if (key === 'isOpen') {
              conditionStr += this.conditionInvestorSearchForm['isOpen'] ? '已开户 /' : '未开户 /'
            } else {
              if (key !== 'openStartTime' && key !== 'openEndTime' && key !== 'registerStartTime' && key !== 'registerEndTime') {
                const searItem = this.conditionInvestorSearchItems.find(item => item.para === key)
                conditionStr += `${searItem && searItem.text}:${this.conditionInvestorSearchForm[key]} / `
              }
            }
          }
        })
        const count = this.conditionInvestorPageForm.total
        this.conditionUser.table.list.push({
          Id: this.createRandomId(),
          condition: conditionStr || '所有出借人',
          form: JSON.parse(JSON.stringify(this.conditionInvestorSearchForm)),
          count
        })
        this.dialogConditionInvestStatus = false
      },
      delConditionUser(user) {
        this.conditionUser.table.list.splice(this.conditionUser.table.list.findIndex(item => item.Id === user.Id), 1)
      },
      submit() {
        let userIds = []
        this.user.table.list.forEach(item => {
          userIds.push(item.Id)
        })
        let couponList = JSON.parse(JSON.stringify(this.coupon.table.list))
        couponList.map(item => {
          item.bidType = item.bidType && item.bidType.toString() || ''
        })
        let data = {
          couponList,
          userList: userIds,
          groupList: this.user.checkedGroup,
          isSendSms: this.other.isSendSms,
          name: this.other.name,
          investorQuery: this.conditionUser.table.list && this.conditionUser.table.list.length > 0 ? this.conditionUser.table.list[0].form : null
        }
        this.$confirm('请确定需要发送的优惠券明细跟出借人明细, 确定后优惠券将发送至用户手中, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subLoading = true
          this.$request({
            url: this.currentMenuHiddenRunFuncList['F_EXECUTE'],
            data
          }).then(data => {
            this.subLoading = false
            data.result ? this.$message.success('发放成功') : this.$message.error(data.message || '未获取到错误信息')
            if (data.result) {
              this.$router.push('/operation/coupons/grant')
            }
          }).catch(() => {
            this.subLoading = false
          })
        })
      }
    })
  }
</script>

<style lang="scss" scoped>
  .search-form-item {
    padding: 0;
    margin: 0;
  }

  .coupon {
    border: 1px dashed #ccc;
    padding: 16px;
    margin: 8px 0;
    position: relative;

    .tip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      // background: rgba($color: #000000, $alpha: .1);
      color: #1E9EFA;
    }
  }

  .user {
    position: relative;

    .tip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      // background: rgba($color: #000000, $alpha: .1);
      color: #1E9EFA;
    }

    margin-top: 16px;
    border: 1px dashed #ccc;
    padding: 16px;
    margin: 8px 0;

    .group {
      border: 1px dashed #ccc;
      padding: 16px;
      margin: 8px 0;
    }
  }

  .other {
    position: relative;

    .tip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      // background: rgba($color: #000000, $alpha: .1);
      color: #1E9EFA;
    }

    border: 1px dashed #ccc;
    padding: 16px;
    margin: 8px 0;
  }
</style>
