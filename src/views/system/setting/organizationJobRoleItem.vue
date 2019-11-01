<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%;margin-bottom:10px;">所属岗位:{{$route.query.name}}</el-tag>
      <el-row style="margin-bottom:10px;">
        <el-col :span="24">
          <el-checkbox-group v-model="ownRoleList" size="mini">
            <el-checkbox border v-for="role in roleList" :key="role.Id" :label="role.Id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button :type="action.cssClass" size="mini" v-for="action in currentMenuTopRunFuncList" :key="action.Id" @click="top_execute(action)">{{action.name}}
          </el-button>
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
        roleList: [],
        ownRoleList: []
      }
    },
    created() {
      // 获取角色列表
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_ROLE_LIST']
      }).then(data => {
        this.roleList = data.result
      })
      // 获取已拥有角色列表
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_JOB_ROLE_LIST'],
        data: this.$route.query.id
      }).then(data => {
        // 构建数组
        data.result.map(item => {
          this.ownRoleList.push(item.roleId)
        })
      })
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList'
      ])
    },
    methods: {
      top_execute(action) {
        this[action.funcName](action)
      },
      func_execute(action) {
        // 构建数据
        let jobRoleList = []
        this.ownRoleList.map(item => {
          jobRoleList.push({
            roleId: item
          })
        })
        // 去除不存在的角色
        jobRoleList = jobRoleList.filter(item => {
          return this.roleList.find(i => {return i.Id === item.roleId})
        })
        this.$request({
          url: action.apiUrl,
          data: {
            jobId: this.$route.query.id,
            jobRoleList
          }
        }).then(() => {
          this.$router.go(-1)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
