<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-row>
        <el-col :span="24">
          <el-tag style="width:100%;">当前用户:{{$route.query.name}}</el-tag>
          <el-tag type="warning" style="margin-bottom:20px;">当前岗位:{{currentOrgName}}--{{currentJobName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">组织机构</el-col>
          </el-row>
          <el-row>
            <el-tree ref="orgTree" node-key="Id" :data="orgTree" :props="orgTreeProps" @node-click="orgTreeNodeClick"></el-tree>
          </el-row>
        </el-col>
        <el-col :span="13" :offset="1">
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">岗位信息</el-col>
          </el-row>
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">
              <el-tag type="info">所属机构:{{currentOrg.name}}</el-tag>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">
              <el-radio-group v-model="ownJob" size="mini">
                <el-radio border v-for="job in jobList" :key="job.Id" :label="job.Id">{{job.name}}</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" v-for="action in currentMenuTopRunFuncList" :key="action.Id" @click="top_execute(action)">{{action.name}}</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        ownJob: '',
        jobList: '',
        orgTree: [],
        orgTreeProps: {
          label: 'name',
          id: 'Id'
        },
        currentOrg: {},
        currentOrgName: [], // 当前用户的组织机构
        currentJobName: '' // 当前用户的岗位名
      }
    },
    created() {
      // 获取组织机构树
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_ORG_LIST']
      }).then(data => {
        this.orgTree = data.result
      })
      this.getUserInfo()
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'userInfo'
      ])
    },
    methods: {
      async getUserInfo() {
        await this.$request({
          url: this.currentMenuHiddenRunFuncList['O_USER_INFO'],
          data: this.$route.query.id
        }).then(data => {
          // 获取岗位信息
          this.ownJob = data.result ? data.result.job.Id : ''
          this.findCurrentOrg(this.orgTree, data.result ? data.result.job.organizationId : '')
          this.currentJobName = data.result ? data.result.job.name : ''
        })
      },
      findCurrentOrg(orgTree, orgId) {
        orgTree.forEach(i => {
          if (i.Id === orgId) {
            this.currentOrgName = i.name
            return
          }
          if (i.children && i.children.length > 0) {
            this.findCurrentOrg(i.children, orgId)
          }
        })
      },
      orgTreeNodeClick(e) {
        this.currentOrg = e
        // 获取岗位列表
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_JOB_LIST'],
          data: e.Id
        }).then(data => {
          this.jobList = data.result
        })
      },
      top_execute(action) {
        this[action.funcName](action)
      },
      func_execute(action) {
        this.$request({
          url: action.apiUrl,
          data: {
            jobId: this.ownJob,
            userId: this.$route.query.id
          }
        }).then(() => {
          this.$message.success('操作成功')
          this.$router.go(-1)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/.el-radio.is-bordered+.el-radio.is-bordered{
  margin: 2px 0;
}

</style>
