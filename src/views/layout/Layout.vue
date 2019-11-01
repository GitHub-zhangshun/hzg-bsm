<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <Sticky :zIndex="999">
        <navbar></navbar>
        <el-progress v-if="downProgress !== 100 && downProgress !== 0" :text-inside="true" :stroke-width="18" :percentage="downProgress"></el-progress>
        <tags-view class="guide-tabs"></tags-view>
      </Sticky>
      <app-main></app-main>
      <BackToTop></BackToTop>
    </div>
  </div>
</template>

<script>
  import {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import Sticky from '@/components/Sticky'
  import BackToTop from '@/components/BackToTop'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView,
      Sticky,
      BackToTop
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      },
      downProgress(){
        let progress = this.$store.state.app.downProgress
        if(progress > 99){
          progress = 100
        }
        return progress
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', {
          withoutAnimation: false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }

    .sidebar-container{
      border: 1px solid;
      height: 80%;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
