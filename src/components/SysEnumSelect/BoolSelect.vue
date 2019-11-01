<template>
  <el-select v-model="currentValue" :placeholder="placeholder" :clearable="true" @change="handelChange">
    <el-option :label="`已${describe}`" value="true"></el-option>
    <el-option :label="`未${describe}`" value="false"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'local-select',
    props: {
      value: {
        type: String,
        default: ''
      },
      describe: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '请输入内容'
      }
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    methods: {
      handelChange(val) {
        this.$emit('input', val)
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
