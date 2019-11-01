<template>
  <div class="redirect-container">
    <el-progress type="circle" :percentage="progress" :width="300" status="text">
      模式切换中
    </el-progress>
  </div>
</template>

<script>
  export default {
    name: 'page302',
    data() {
      return {
        progress: 0
      }
    },
    mounted() {
      this.goHome()
    },
    methods: {
      goHome() {
        let interId = setInterval(() => {
          this.progress += 20
          if (this.progress === 100) {
            window.clearInterval(interId)
            this.$message.success(`切换成功，当前模式为:${this.$route.query.name}`)
            this.$router.replace('/')
          }
        }, 200)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .redirect-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
