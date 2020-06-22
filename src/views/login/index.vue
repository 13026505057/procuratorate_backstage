<template>
  <div class="login-container">
    <div>
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/login/emblem.png" alt="">青岛市检察机关档案管理系统
        </h3>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <el-form-item prop="username">
          <span class="svg-container"><svg-icon icon-class="user" /></span>
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名"
            name="username" type="text" tabindex="1" autocomplete="on" />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container"><svg-icon icon-class="password" /></span>
            <el-input :key="passwordType" autocomplete="on"
              ref="password" v-model="loginForm.password" :type="passwordType"
              placeholder="密码" name="password" tabindex="2"
              @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-button :loading="loading" type="loginBtn" style="width:100%" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) callback(new Error('请输入正确的用户名'))
        else callback()
    }
    const validatePassword = (rule, value, callback) => {
      callback()
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) this.redirect = query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    ...mapActions({'setTokenData':'user/setTokenData'}),
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') this.passwordType = ''
        else this.passwordType = 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          let passwordmd5 = md5.hex(this.loginForm.password);

          const resultData = await this.$api.login({
            username: this.loginForm.username,
            password: passwordmd5
          })
          if(resultData && resultData.code == '0') {
            this.setTokenData(resultData.data.token)
            console.log(this.redirect)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          } else this.loading = false
        } else false
      })
    },
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:rgb(100,100,100);
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../../assets/login/loginBg.png');
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
      caret-color: $cursor;
      &::-webkit-input-placeholder {
        color: $light_gray;
      }
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #cce6fd inset !important;
        -webkit-text-fill-color: #646464 !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid rgb(153, 153, 153);
    // background: rgba(0, 0, 0, 0.1);
    // border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$login_btn:rgb(86,167,255);

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 327px;
    max-width: 100%;
    // padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background: #cce6fd;
    border-radius: 5px;
    padding: 30px;
    .el-button--loginBtn{
      background-color: $login_btn;
      border-color: $login_btn;
      color: #fff;
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
  }

  .title-container {
    position: relative;
    
    .title {
      font-size: 26px;
      // color: $light_gray;
      color: #fff;
      font-family: 'MicrosoftYaHei';
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 600;
      text-shadow: 3px 0 5px #0080ff;
      img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        margin-right: 10px;
      }
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
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
