<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu unique-opened mode="vertical" :collapse-transition="false" :show-timeout="200" :default-active="likePath" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item v-for="menu in menus" :key="menu.title" :item="menu" :base-path="menu.url"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: {
      SidebarItem
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar',
        'menus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      // 隐藏路由匹配到父级
      likePath() {
        let url = this.$route.path && this.$route.path.replace(/\//g, '-')
        let pUrl = this.$route.meta.parent && this.$route.meta.parent.replace(/\//g, '-')
        return this.$route.meta.parent ? pUrl.replace('-', '') : url.replace('-', '')
      }
    }
  }
</script>
