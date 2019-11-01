<template>
  <div>
    <svg t="1538213154024" @click="guide" class="guide-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3285" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">
      <path d="M413.866667 259.413333l301.226666 229.12a32 32 0 0 1 0 46.933334L413.866667 764.586667c-13.226667 9.813333-29.866667-2.986667-29.866667-23.466667V282.88c0-20.48 16.64-33.706667 29.866667-23.466667zM512 42.666667A469.333333 469.333333 0 0 0 42.666667 512 469.333333 469.333333 0 1 0 512 42.666667z m0 878.506666A409.173333 409.173333 0 0 1 102.826667 512a409.173333 409.173333 0 0 1 818.346666 0A409.173333 409.173333 0 0 1 512 921.173333z" p-id="3286"></path>
    </svg>
  </div>
</template>

<script>
  import * as Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import steps from './defineSteps'
  export default {
    name: 'Guide',
    data() {
      return {
        driver: null
      }
    },
    mounted() {
      this.driver = new Driver({
        doneBtnText: '欢迎下次光临',
        closeBtnText: '关闭',
        nextBtnText: '下一步',
        prevBtnText: '上一步',
        allowClose: false
      })
      const preLoading = window.localStorage.getItem('pre-loading')
      if (preLoading === 'true' || preLoading === null) {
        this.guide()
        // 执行完再设置为false
        window.localStorage.setItem('pre-loading', 'false')
      }
    },
    methods: {
      guide() {
        this.driver.defineSteps(steps)
        this.driver.start()
      }
    }
  }
</script>

<style scoped>
  .guide-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
</style>
