<template>
  <el-select v-model="currentValue" :placeholder="placeholder" :clearable="clear" :disabled="disabled" @change="handelChange">
    <el-option :disabled="!item.isUse" v-for="item in dataList" :key="item[propVal]" :label="item.title" :value="item[propVal]"></el-option>
  </el-select>
</template>
<script>
  import {
    _func
  } from '@/business/baseFunc'
  export default {
    name: 'service-select',
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '请输入内容'
      },
      propVal: {
        type: String,
        default: 'Id'
      },
      queryArg: {
        type: String,
        default: ''
      },
      queryParArg: { // 父级简化序列号或者ID
        type: String,
        default: ''
      },
      queryType: {
        type: String,
        default: 'typeEnum'
      },
      showArg: { // 自定义显示项
        type: Array
      },
      hiddenArg: { // 自定义隐藏项
        type: Array
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clear: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dataList: [],
        currentValue: this.value
      }
    },
    watch: {
      value(nd) {
        this.currentValue = nd
      }
    },
    created() {
      if (this.queryType === 'typeEnum') {
        // 获取类型枚举集合 根据扩展字段显示
        this.getTypeEnum(this.$store.getters.baseRunFuncList['O_TYPE_ENUM_LIST'], this.queryArg, this.queryParArg).then(data => {
          if (this.showArg && this.showArg.length > 0) {
            let showData = []
            this.showArg.map(i => {
              let filetData = data.filter(j => j.extend === i)
              if (filetData.length > 0) {
                filetData.forEach(item => {
                  showData.push(item)
                })
              }
            })
            this.dataList = showData
          } else {
            this.dataList = data
          }
        })
      } else if (this.queryType === 'statusEnum') {
        // 获取状态枚举集合
        this.getStatusEnum(this.$store.getters.baseRunFuncList['O_STATUS_ENUM_LIST'], this.queryArg).then(data => {
          let showData = []
          if (this.showArg && this.showArg.length > 0) {
            this.showArg.map(i => {
              let filetData = data.filter(j => j.extend === i)
              if (filetData.length > 0) {
                filetData.forEach(item => {
                  showData.push(item)
                })
              }
            })
            this.dataList = showData
          } else {
            this.dataList = data
          }
        })
      }
    },
    methods: Object.assign(_func(), {
      handelChange(val) {
        this.$emit('change', val)
        this.$emit('input', val)
      }
    })
  }
</script>
<style lang="scss" scoped>
</style>
