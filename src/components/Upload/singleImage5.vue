<template>
  <div v-loading="uploadLoading">
    <el-upload list-type="picture-card" :action="uploadUrl" multiple show-file-list :before-upload="beforeUpload" :on-success="handleImageSuccess" :http-request="uploadRequest" :file-list="imgList" :on-remove="rmImage">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
  import {
    _func
  } from '@/business/baseFunc'

  export default {
    name: 'SingleImageUpload5',
    props: {
      value: {
        type: Array,
        default: []
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
        uploadLoading: false,
        currentFileUid: '',
        imgList: []
      }
    },
    created() {
      this.value.map(i => {
        this.imgList.push({
          url: i
        })
      })
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
      rmImage(file) {
        if (this.currentFileUid !== file.uid) {
          this.value.splice(this.value.findIndex(v => v === file.url), 1);
          this.emitInput(this.value)
        }
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageSuccess(res, file) {
        this.uploadLoading = false
        this.value.push(file.raw.pictureKey)
        this.emitInput(this.value)
      },
      // 上传前钩子
      beforeUpload(file) {
        this.currentFileUid = file.uid
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
