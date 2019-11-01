<template>
  <div class="createPost-container">
    <el-form ref="baseForm" :model="baseForm" :rules="rules" class="form-container">
      <sticky class-name="sub-navbar published">
        <el-row>
          <el-col :span="4">
            <span style="color: #fff">新增{{$route.query.name}}文章</span>
          </el-col>
          <el-col :span="6" :offset="14">
            <SourceUrlDropdown v-model="baseForm.link" />
            <el-button v-loading="loading" style="margin-left: 10px;" :type="action.cssClass" v-for="action in currentMenuTopRunFuncList" :key="action.Id" @click="top_execute(action)">{{action.name}}
            </el-button>
          </el-col>
        </el-row>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="baseForm.title" :maxlength="100" name="title" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input :rows="1" v-model="baseForm.sketch" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item v-if="articleTypeItemList.length > 0" prop="articleTypeItemId" :rules="[{ required: true, message: articleTypeItemName, trigger: 'change' }]">
          <el-select v-model="baseForm.articleTypeItemId" :placeholder="articleTypeItemName" @change="articleTypeItemChange">
            <el-option v-for="item in articleTypeItemList" :key="item.Id" :value="item.Id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>

        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="baseForm.content" />
        </div>

        <div style="margin-bottom: 20px;">
          <Upload3 v-model="baseForm.imgLink" :size="2" />
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {
    validateURL
  } from '@/utils/validate'
  import {
    SourceUrlDropdown
  } from './Dropdown'
  import {
    _func
  } from '@/business/baseFunc'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'ArticleDetail',
    components: {
      Tinymce,
      MDinput,
      Sticky,
      SourceUrlDropdown
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      uploadUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(new Error('外链url填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        baseForm: {
          sketch: '',
          title: '',
          articleTypeItemId: ''
        },
        loading: false,
        rules: {
          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }],
          link: [{
            validator: validateSourceUri,
            trigger: 'blur'
          }]
        },
        articleTypeItemList: [], // 文章子集类型
        articleTypeItemName: '此类型无下级' // 文章子集提示语
      }
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList',
        'baseRunFuncList'
      ]),
      contentShortLength() {
        return this.baseForm.sketch.length
      }
    },
    created() {
      // 获取文章子集类型
      this.getTypeEnum(this.baseRunFuncList['O_TYPE_ENUM_LIST'], 'platform_article', this.$route.query.simplify, '1').then(data => {
        if (data.length > 0) {
          this.articleTypeItemList = data
          this.articleTypeItemName = `请选择${this.$route.query.name}`
        } else {
          this.baseForm.articleType = this.getDicIdBySimplify(this.$route.query.simplify)
        }
      })
      if (this.isEdit) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
          data: this.$route.query.id
        }).then(data => {
          this.baseForm = data.result
          this.baseForm.articleTypeItemId = data.result.articleType
        })
      }
    },
    methods: Object.assign(_func(), {
      func_execute(action, row) {
        this.$refs.baseForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$request({
              url: action.apiUrl,
              data: this.baseForm
            }).then(data => {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.go(-1)
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      // 文章类型选择
      articleTypeItemChange(e) {
        this.baseForm.articleType = e
      }
    })
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }

      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;

        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;

          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
