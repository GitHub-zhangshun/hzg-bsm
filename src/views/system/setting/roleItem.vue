<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-row>
        <el-col :span="24">
          <el-tag style="width:100%;margin-bottom:20px;">当前角色:{{$route.query.name}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">菜单</el-col>
          </el-row>
          <el-row>
            <div style="height:600px;overflow:auto;">
              <el-tree v-if="isData" ref="menuTree" node-key="Id" :default-expanded-keys="haveActionMenuIds" highlight-current :accordion="false" :data="menuTree" :props="menuTreeProps" @node-click="orgTreeNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span v-if="data.haveAction" style="color:red;font-size:12px;">
                    (已分配)
                  </span>
                </span>
              </el-tree>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" :offset="2">
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">功能信息</el-col>
          </el-row>
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">
              <el-tag type="info">所属菜单:{{currentMenu.title}}</el-tag>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:20px;">
            <el-col :span="24">
              <el-checkbox-group v-model="ownActionList" size="mini">
                <el-checkbox border style="margin-bottom:3px;" v-for="action in menuActionList" :key="action.Id" :label="action.Id">{{action.name}}</el-checkbox>
              </el-checkbox-group>
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
        ownActionList: [],
        menuActionList: [],
        menuActionAllList: [],
        menuTree: [],
        menuTreeProps: {
          label: 'title',
          id: 'Id'
        },
        currentMenu: {},
        isData: false,
        haveActionMenuIds: []
      }
    },
    async created() {
      // 获取树形菜单
      await this.$request({
        url: this.currentMenuHiddenRunFuncList['O_MENU_LIST']
      }).then(data => {
        this.menuTree = data.result
      })
      // 获取所有菜单的允许是功能
      await this.$request({
        url: this.currentMenuHiddenRunFuncList['O_MENU_ACTION_ALL_LIST']
      }).then(data => {
        this.menuActionAllList = data.result
      })
      // 获取角色已拥有的功能列表
      await this.$request({
        url: this.currentMenuHiddenRunFuncList['O_ROLE_PERMISSION_LIST'],
        data: this.$route.query.id
      }).then(data => {
        // 构建已拥有的功能数组数据
        data.result.map(item => {
          this.ownActionList.push(item.rfuncId)
        })
      })
      // 匹配已经分配过权限的菜单
      await this.matchingHaveActionMenus()
      this.isData = true
    },
    computed: {
      ...mapGetters([
        'currentMenuHiddenRunFuncList',
        'currentMenuTopRunFuncList',
        'userInfo'
      ])
    },
    methods: {
      test(node, data) {
        console.log('node', node)
        console.log('data', data)
      },
      orgTreeNodeClick(e) {
        this.currentMenu = e
        // 获取菜单功能列表
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_MENU_ACTION_LIST'],
          data: e.Id
        }).then(data => {
          // 不显示隐藏功能 排除查询 F_TABLE_LIST & F_INFO
          this.menuActionList = data.result.filter(item => item.isShow || item.keyName === 'F_TABLE_LIST' || item.keyName === 'F_INFO' || item.keyName === 'F_EXECUTE')
        })
      },
      top_execute(action) {
        this[action.funcName](action)
      },
      func_execute(action) {
        let roleFuncList = []
        // 构造请求数据
        this.ownActionList.map(item => {
          roleFuncList.push({
            rfuncId: item
          })
        })
        this.$request({
          url: action.apiUrl,
          data: {
            roleFuncList,
            roleId: this.$route.query.id
          }
        }).then(() => {
          this.$message.success('操作成功')
          this.$router.go(-1)
        })
      },
      // 匹配已经分配过功能的菜单集合
      matchingHaveActionMenus() {
        if (this.menuActionAllList && this.menuActionAllList.length > 0 && this.menuTree && this.menuTree.length > 0) {
          // 遍历菜单 匹配已经分配过功能的菜单
          this.ownActionList.forEach(ownActionId => {
            let actionObj = this.menuActionAllList.filter(menuAction => menuAction.Id === ownActionId)
            if (actionObj && actionObj.length > 0) {
              this.haveActionMenuIds.push(actionObj[0].menuId)
            }
          })
          // 给菜单树加标识
          if (this.haveActionMenuIds.length > 0) {
            this.menuTree
          }
          this.addMenuTreeLogo(this.menuTree, this.haveActionMenuIds)
        }
      },
      // 给有功能的菜单加标识
      addMenuTreeLogo(menuTree, haveActionMenuIds) {
        menuTree.map(i => {
          if (haveActionMenuIds.includes(i.Id)) {
            i.haveAction = true
          } else {
            i.haveAction = false
          }
          if (i.children && i.children.length > 0) {
            this.addMenuTreeLogo(i.children, haveActionMenuIds)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
