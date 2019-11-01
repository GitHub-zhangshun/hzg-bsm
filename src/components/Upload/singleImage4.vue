<template>
  <div v-loading="uploadLoading">
    <el-upload
      :action="uploadUrl"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleImageSuccess"
      :http-request="uploadRequest">
      <img v-if="imageUrl" :src="imageUrl" :style="`max-width:${width}px;max-height:${width}px;`">
      <i v-else class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
  import { _func } from '@/business/baseFunc'

  export default {
    name: 'SingleImageUpload3',
    props: {
      value: {
        type: String,
        default: ''
      },
      size: {
        type: Number,
        default: 2
      },
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        uploadLoading: false
      }
    },
    computed: {
      imageUrl() {
        return this.value
      },
      uploadUrl() {
        return this.$store.getters.baseRunFuncList['O_UPLOAD_IMG']
      }
    },
    methods: Object.assign(_func(), {
      rmImage() {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageSuccess(res, file) {
        this.uploadLoading = false
        this.emitInput(file.raw.pictureKey)
      },
      // 上传前钩子
      beforeUpload(file) {
        this.uploadLoading = true
        const sizeMB = file.size / 1024 / 1024 < this.size
        if (!sizeMB) {
          this.uploadLoading = false
          this.$message.error(`上传图片大小不能超过 ${this.size}MB!`)
        }
        return sizeMB
      }
    })
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
