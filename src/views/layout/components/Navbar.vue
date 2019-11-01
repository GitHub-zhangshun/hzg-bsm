<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container guide-hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!-- <el-tooltip :content="jobInfo" placement="bottom"> -->
      <i class="wel">欢迎您:{{userInfo.name}}</i>
      <span class="model" v-if="haveModelChange">({{model === 'platform_data_type_normal' ? '生产模式' : (model === 'platform_data_type_test' ? '测试模式' : (model === 'platform_data_type_normal_no_secret' ? '无保密模式' : '演示模式'))}})</span>
      <!-- </el-tooltip> -->

      <error-log class="errLog-container right-menu-item"></error-log>

      <template v-if="haveModelChange">
        <el-dropdown class="right-menu-item" placement="top-start" trigger="click">
          <!-- <el-tooltip effect="dark" content="模式切换" placement="bottom"> -->
          <div class="right-menu-item screenfull">
            <svg-icon icon-class="switching" class="iconClassCustom" />
          </div>
          <!-- </el-tooltip> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided>
              <span @click="modelChange('platform_data_type_normal_no_secret', '无保密模式')" style="display:block;">无保密模式</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="modelChange('platform_data_type_normal', '生产模式')" style="display:block;">生产模式</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="modelChange('platform_data_type_test', '测试模式')" style="display:block;">测试模式</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="modelChange('platform_data_type_demo', '演示模式')" style="display:block;">演示模式</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <el-tooltip effect="dark" content="使用指南" placement="bottom">
        <Guide class="right-menu-item screenfull guide-guide"></Guide>
      </el-tooltip>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="right-menu-item screenfull guide-screenfull"></screenfull>
      </el-tooltip>

      <el-tooltip content="查看我的二维码" placement="bottom" effect="dark">
        <qr-code class="right-menu-item screenfull guide-qr-code"></qr-code>
      </el-tooltip>

      <lang-select class="right-menu-item guide-lang"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item guide-theme"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item guide-dropdown" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"> -->
          <img class="user-avatar" :src="currentAvatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="updateCache" style="display:block;">更新缓存</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="updatePwd" style="display:block;">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="修改密码" :visible.sync="dialogStatus">
      <el-form :model="dialogForm" ref="dialogForm" :rules="baseFormRules">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="dialogForm.oldPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="dialogForm.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import QrCode from '@/components/QrCode'
  import Guide from '@/components/Guide'
  import md5 from 'blueimp-md5'
  import auth from '@/utils/auth.js'
  import Avatar1 from '@/assets/Avatar1.gif'
  import Avatar2 from '@/assets/Avatar2.gif'
  import {
    baseFormRules
  } from '@/business/rules.js'
  // import Avatar3 from '@/assets/Avatar3.gif'
  // import Avatar4 from '@/assets/Avatar4.gif'
  // import Avatar5 from '@/assets/Avatar5.gif'
  // import Avatar6 from '@/assets/Avatar6.gif'
  // import Avatar7 from '@/assets/Avatar7.gif'
  // import Avatar8 from '@/assets/Avatar8.gif'
  // import Avatar9 from '@/assets/Avatar9.gif'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker,
      QrCode,
      Guide
    },
    data() {
      return {
        baseFormRules,
        dialogForm: {},
        dialogStatus: false,
        currentAvatar: Avatar1,
        // rules: {
        //   oldPwd: [{
        //     validator: validateNull,
        //     trigger: 'blur',
        //     message: '内容不能为空'
        //   }, {
        //     min: 1,
        //     max: 200,
        //     message: '长度在不能超过200个字符',
        //     trigger: 'blur'
        //   }],
        // }
      }
    },
    created() {
      setInterval(() => {
        if (this.currentAvatar.indexOf('Avatar1') !== -1) {
          this.currentAvatar = Avatar2
        }
        // else if(this.currentAvatar.indexOf('Avatar2') !== -1){
        //   this.currentAvatar = Avatar3
        // }else if(this.currentAvatar.indexOf('Avatar3') !== -1){
        //   this.currentAvatar = Avatar4
        // }else if(this.currentAvatar.indexOf('Avatar4') !== -1){
        //   this.currentAvatar = Avatar5
        // }else if(this.currentAvatar.indexOf('Avatar5') !== -1){
        //   this.currentAvatar = Avatar6
        // }else if(this.currentAvatar.indexOf('Avatar6') !== -1){
        //   this.currentAvatar = Avatar7
        // }else if(this.currentAvatar.indexOf('Avatar7') !== -1){
        //   this.currentAvatar = Avatar8
        // }else if(this.currentAvatar.indexOf('Avatar8') !== -1){
        //   this.currentAvatar = Avatar9
        // }
        else if (this.currentAvatar.indexOf('Avatar9') !== -1) {
          this.currentAvatar = Avatar1
        }
      }, 1000 * 60 * 1)
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'baseRunFuncList'
      ]),
      userInfo() {
        return auth.getUserInfo()
      },
      jobInfo() {
        return !this.userInfo.job ? '无岗位信息' : JSON.stringify(this.userInfo.job)
      },
      // 是否拥有切换模式权限
      haveModelChange() {
        return this.baseRunFuncList['O_MODEL_CHANGE']
      },
      // 当前模式
      model() {
        return localStorage.getItem('model') || 'platform_data_type_normal'
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        auth.logOut()
        location.reload()
      },
      updateCache() {
        this.$request({
          url: '/v1/sys/set/refreshRunCache'
        }).then(() => {
          this.$message.success('缓存更新成功')
        })
      },
      updatePwd() {
        this.dialogStatus = true
      },
      dialogSubmit() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.$request({
              url: '/v1/sys/set/userEditPwd',
              data: {
                newPwd: md5(md5(md5(this.dialogForm.newPwd))),
                oldPwd: md5(md5(md5(this.dialogForm.oldPwd)))
              }
            }).then(() => {
              this.dialogStatus = false
              auth.logOut()
              location.reload()
            })
          }
        })
      },
      // 模式切换
      modelChange(model, text) {
        this.$confirm(`切换为${text}, 是否继续?`, '切换模式', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.setItem('model', model)
          this.$router.replace(`/302?name=${text}`)
        }).catch(() => {
          this.$message.info('取消切换')
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .wel,
      .model {
        vertical-align: top;
        color: #2F89FF;
        font-size: 14px;
      }

      .model {
        color: red;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          text-align: center;


          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }

  /deep/.iconClassCustom {
    display: inline-block;
    cursor: pointer;
    fill: #F91700 !important;
    width: 20px !important;
    height: 20px !important;
    vertical-align: 10px !important;
  }

  /deep/.el-popper[x-placement^=bottom] {
    margin-top: 0px;
  }
</style>
