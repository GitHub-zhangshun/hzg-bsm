<!-- sidebar 递归组件 -->
<template>
  <div v-if="item.isShow" class="menu-wrapper">
    <!-- 只有一个娃儿 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)">
      <app-link :to="resolvePath(onlyOneChild.url)">
        <el-menu-item :index="item.url || ''" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild" :icon="onlyOneChild.ico||(item&&item.ico)" :title="generateTitle(onlyOneChild.title)" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 不了一个娃儿估计还有孙儿 把娃儿生了 继续递归出孙儿 -->
    <template v-else>
      <template v-if="hasOne(item)">
        <el-menu-item-group ref="subMenu" :index="item.url" popper-append-to-body>
          <template slot="title">
            <item v-if="item" :icon="item && item.ico" :title="generateTitle(item.title)" />
          </template>
          <!-- 递归组件 -->
          <sidebar-item v-for="child in item.children" :key="child.id" :is-nest="true" :item="child" class="nest-menu" />
        </el-menu-item-group>
      </template>
      <template v-else>
        <el-submenu ref="subMenu" :index="item.url" popper-append-to-body>
          <template slot="title">
            <item v-if="item" :icon="item && item.ico" :title="generateTitle(item.title)" />
          </template>
          <!-- 递归组件 -->
          <sidebar-item v-for="child in item.children" :key="child.id" :is-nest="true" :item="child" class="nest-menu" />
        </el-submenu>
      </template>
    </template>
  </div>
</template>

<script>
  import path from 'path'
  import {
    generateTitle
  } from '@/utils/i18n'
  import AppLink from './Link'
  import Item from './Item'

  export default {
    name: 'SidebarItem',
    components: {
      AppLink,
      Item
    },
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      // TODO: refactor with render function
      this.onlyOneChild = null
      return {}
    },
    // created() {
    //   console.log(this.item)
    //   this.onlyOneChild = this.item
    // },
    methods: {
      hasOneShowingChild(children = [], parent) {
        const showingChildren = children.filter(item => {
          if (!item.isShow) {
            return false
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item
            return true
          }
        })

        // When there is only one child router, the child router is displayed by default
        // if (showingChildren.length === 1) {
        //   return true
        // }

        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          this.onlyOneChild = {
            ...parent,
            noShowingChildren: true
          }
          return true
        }

        return false
      },
      hasOne(item) {
        if(item.remark === 'show-group-item') {
          return true
        }
        return false
      },
      resolvePath(routePath) {
        // 转换绝对路径
        routePath = routePath.replace(/\-/g, '/')
        return path.resolve("", routePath || "")
      },
      generateTitle
    }
  }
</script>
