<template>
  <div class="login-container">
    <div id="canvascontainer" ref='can'></div>

    <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">

      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" ref="username" v-model="loginForm.username" autoComplete="off" :placeholder="$t('login.username')" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container ">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" :placeholder="$t('login.password')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item class="code-form" prop="code">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <!-- <div class="code"> -->
        <el-input name="code" type="text" v-model="loginForm.code" autoComplete="off" :placeholder="$t('login.code')" />
        <el-button size="mini" type="primary" :disabled="codeButton.disabled || codeButton.loading" @click="sendCode" :loading="codeButton.loading">{{codeButton.text}}</el-button>
        <!-- </div> -->
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

      <div class="tips">
        <span>建议使用<a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">谷歌浏览器</a>登录</span>
      </div>
      <div class="tips">
        <span>或者其他浏览器的<a href="http://se.360.cn/v6/help/help5.html" target="_blank">极速模式</a>登录/ <span style="color: red">不兼容IE内核的浏览器</span></span>
      </div>
      <!-- <div class="tips">
        <span>{{$t('login.username')}} : admin</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div> -->
      <!-- <div class="tips">
        <span style="margin-right:18px;">{{$t('login.username')}} : editor</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div> -->

      <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{$t('login.thirdparty')}}</el-button> -->
    </el-form>

    <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './socialsignin'
  import auth from '@/utils/auth.js'
  import md5 from 'blueimp-md5'
  import 'three.js'

  export default {
    components: {
      LangSelect,
      SocialSign
    },
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{
              required: true,
              trigger: 'blur',
              message: '用户名不能为空'
            },
            {
              min: 5,
              max: 20,
              message: '请输入5-20位用户名'
            }
          ],
          password: [{
              required: true,
              trigger: 'blur',
              message: '密码不能为空'
            },
            {
              min: 6,
              max: 30,
              message: '密码不能小于6位'
            }
          ],
          code: [{
            required: true,
            trigger: 'blur',
            message: '短信验证码不能为空'
          }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        errorCount: 0,
        codeButton: {
          text: '获取验证码',
          disabled: false,
          loading: false
        },
      }
    },
    methods: {
      sendCode() {
        if (!this.loginForm.username) {
          this.$refs.username.focus()
          return
        }
        this.codeButton.loading = true
        this.$request({
          url: '/v1/sys/set/smsCodeSend',
          data: {
            loginName: this.loginForm.username.trim(),
            simplify: 'login_sms_code'
          }
        }).then(data => {
          this.codeButton.loading = false
          if (data.result) {
            this.codeButton.disabled = true
            let num = 60
            this.interId = setInterval(() => {
              if (num === 0) {
                this.codeButton.text = '重新获取'
                this.codeButton.disabled = false
                window.clearInterval(this.interId)
                return
              }
              this.codeButton.text = `${num}s后获取`
              num--
            }, 1000);
          }
        }).catch(() => {
          this.codeButton.loading = false
        })
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loginSubmit()
          } else {
            console.log('error submit!!')
            this.errorCount++
            if (this.errorCount > 3 && !this.loginForm.username && !this.loginForm.password) {
              this.$message.error('啊啊啊...别点拉....点得人家好不舒服, 快点输入账号密码进来啊~~~')
            }
            return false
          }
        })
      },
      async loginSubmit() {
        this.loading = true
        let success = false
        let loginData = {}
        // 登录
        await this.$request({
          url: '/v1/sys/set/userLogin',
          data: {
            loginName: this.loginForm.username.trim(),
            loginPwd: md5(md5(md5(this.loginForm.password))),
            code: this.loginForm.code.trim(),
            smsSimplify: 'login_sms_code'
          }
        }).then(data => {
          // 首先设置token 后面接口需要token
          auth.setToken(data.result.token)
          loginData.userInfo = data.result.user
          success = true
        }).catch(() => {
          success = false
        })
        // 获取系统枚举信息 对象模式
        success && await this.$request({
          url: '/v1/cms/core/dictionaryListByAll'
        }).then(data => {
          loginData.dicList = data.result
          success = true
        }).catch(() => {
          auth.logOut()
          success = false
        })
        // 获取所有运行时功能
        success && await this.$request({
          url: '/v1/sys/set/menuFuncListByAll'
        }).then(data => {
          let funcList = {}
          data.result.forEach(item => {
            if (!funcList[item.menuId]) {
              funcList[item.menuId] = [item]
            } else {
              funcList[item.menuId].push(item)
            }
          })
          loginData.funcList = funcList
          success = true
        }).catch(() => {
          auth.logOut()
          success = false
        })
        // 登录成功 跳转
        this.loading = false
        if (success) {
          // 保存登录信息
          auth.logIn(loginData)
          this.$router.push({
            path: '/'
          })
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  #canvascontainer {
    position: absolute;
    top: 0px;
  }

  /deep/.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #151B47;

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;

      .code-form {
        .el-form-item__content {
          display: flex;
          flex-direction: row;
          border: 1px solid;
          flex-wrap: nowrap;
        }
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }

    .tips {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;

      span {
        width: 100%;
        margin: 0 !important;
        text-align: center;
      }

      a {
        margin: 0 4px;
        color: #409EFF;
      }
    }
  }
</style>
