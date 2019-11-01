<template>
  <div class="post-container">
    <div class="post-main-container">
      <!-- 用户信息 -->
      <section>
        <div class="title">
          <h4>注册信息</h4>
        </div>
        <div class="content">
          <el-row class="row">
            <el-col :span="5">
              <span>注册手机号:</span>
              <span>{{userInfo.phone}}</span>
            </el-col>
            <el-col :span="5">
              <span>注册时间:</span>
              <span>{{getTime(userInfo.createAt)}}</span>
            </el-col>
            <el-col :span="4">
              <span>渠道来源:</span>
              <span>{{getDicTitleById(userInfo.correlationId) || '无'}}</span>
            </el-col>
            <el-col :span="5">
              <span>运营归属:</span>
              <span>{{userInfo.operationInfo && `${userInfo.operationInfo.organizationName || '无'} ${userInfo.operationInfo.staffName || ''}` || '无'}}</span>
            </el-col>
            <el-col :span="5">
              <span>邀请人:</span>
              <span>{{userInfo.inviteInfo && `${userInfo.inviteInfo.realName} ${userInfo.inviteInfo.phone}` || '无'}}</span>
            </el-col>
          </el-row>
        </div>
      </section>
      <section>
        <div class="title">
          <h4>用户信息</h4>
        </div>
        <div class="content">
          <el-row class="row">
            <el-col :span="5">
              <span>用户昵称:</span>
              <span>{{userInfo.nickName}}</span>
            </el-col>
            <el-col :span="5">
              <span>用户姓名:</span>
              <span>{{userInfo.realName}}</span>
            </el-col>
            <el-col :span="8">
              <span>身份证号:</span>
              <span>{{userInfo.idcardCode}}</span>
            </el-col>
            <el-col :span="5">
              <span>性别:</span>
              <span>{{userInfo.sex === 0 ? '女' : (userInfo.sex === 1 ? '男' : '保密')}}</span>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="5">
              <span>用户名:</span>
              <span>{{userInfo.accountInfo && userInfo.accountInfo.account}}</span>
            </el-col>
            <el-col :span="5">
              <span>籍贯:</span>
              <span>{{userInfo.nativePlace}}</span>
            </el-col>
            <el-col :span="4">
              <span>剩余测评次数:</span>
              <span>{{userInfo.attachInfo && userInfo.attachInfo.riskEvaluateCount || 0}}</span>
            </el-col>
            <el-col :span="5">
              <span>年龄:</span>
              <span>{{userInfo.age}}</span>
            </el-col>
          </el-row>
        </div>
      </section>
      <section>
        <div class="title">
          <h4>银行卡信息</h4>
        </div>
        <div class="content">
          <el-row class="row">
            <el-col :span="5">
              <span>开户状态:</span>
              <span>{{userInfo.isOpen ? '已开户' : '未开户'}}</span>
            </el-col>
            <el-col :span="5">
              <span>开户时间:</span>
              <span>{{getTime(userInfo.openTime || '')}}</span>
            </el-col>
            <!-- <el-col :span="5">
              <span>签约状态:</span>
              <span>{{userInfo.signFlag ? '已签约' : '未签约'}}</span>
            </el-col>
            <el-col :span="5">
              <span>授权状态:</span>
              <span>{{userInfo.withdrawAuthFlag ? '已授权' : '未授权' }}</span>
            </el-col> -->
            <el-col :span="4">
              <span>预留手机:</span>
              <span>{{userInfo.bankCardInfo && userInfo.bankCardInfo.bankPhone}}</span>
            </el-col>
            <el-col :span="5">
              <span>银行名称:</span>
              <span>{{userInfo.bankCardInfo && userInfo.bankCardInfo.name}}</span>
            </el-col>
            <el-col :span="5">
              <span>银行卡号:</span>
              <span>{{userInfo.bankCardInfo && userInfo.bankCardInfo.cardNo}}</span>
            </el-col>
          </el-row>
        </div>
      </section>
      <section>
        <div class="title">
          <h4>账户资金信息</h4>
        </div>
        <div class="content">
          <el-row class="row">
            <el-col :span="5">
              <span>账户管理费比例:</span>
              <span>{{userInfo.assetInfo && userInfo.assetInfo.feeRate || '0.00'}} %</span>
            </el-col>
            <el-col :span="5">
              <span>存管余额:</span>
              <span>{{userInfo.assetInfo && numberFormat(userInfo.assetInfo.tubeBalance)}}</span>
            </el-col>
            <el-col :span="4">
              <span>账户总额:</span>
              <span>{{userInfo && userInfo.assetInfo && numberFormat(numAdd(userInfo.assetInfo.investment || 0, userInfo.assetInfo.usable || 0))}}</span>
            </el-col>
            <el-col :span="5">
              <span>账户余额:</span>
              <span>{{userInfo.assetInfo && numberFormat(userInfo.assetInfo.usable)}}</span>
            </el-col>
            <el-col :span="5">
              <span>冻结金额:</span>
              <span>{{userInfo.assetInfo && numberFormat(userInfo.assetInfo.freeze)}}</span>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="5">
              <span>待收总额:</span>
              <span>{{userInfo && userInfo.assetInfo && numberFormat(numAdd(userInfo.lendStatistics && userInfo.lendStatistics.expectIncome || 0, userInfo.assetInfo.investment || 0))}}</span>
            </el-col>
            <el-col :span="4">
              <span>待收利息:</span>
              <span>{{userInfo.lendStatistics && numberFormat(userInfo.lendStatistics.expectIncome)}}</span>
            </el-col>
            <el-col :span="5">
              <span>在投金额:</span>
              <span>{{userInfo.assetInfo && numberFormat(userInfo.assetInfo.investment)}}</span>
            </el-col>
          </el-row>
        </div>
      </section>
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
    created() {
      this.$request({
        url: this.currentMenuHiddenRunFuncList['F_TABLE_LIST'],
        data: {
          dataId: this.$route.query.id,
          isTrue: true
        }
      }).then(data => {
        this.userInfo = data.result
      })
    },
    data() {
      return {
        userInfo: {}
      }
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {

    })
  }
</script>
<style lang="scss" scoped>
  .post-main-container {
    section {
      margin-bottom: 10px;

      .title {
        border: 1px solid #ccc;
        padding: 5px;
        -webkit-box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
        -moz-box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
        box-shadow: 1px 2px 2px 0px rgba(138, 133, 138, 1);
        border-radius: 4px;

        h4 {
          color: #3794FF;
          margin: 0;
        }
      }

      .content {
        border: 1px dashed #ccc;
        border-top: none;
        padding: 30px 10px 10px 10px;
        font-size: 14px;
        color: #909399;

        .row {
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
