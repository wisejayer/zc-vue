<template>
  <el-form :rules="rules" class="login-container" label-position="left" :model="loginForm"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="id">
      <el-input  v-model="loginForm.userid"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"
                @keydown.enter.native="submitClick"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default{
    data(){
      return {
        rules: {
          userid: [{required: true, message: '请输入账号', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        loginForm: {
          userid: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      submitClick(){
      var _this = this;
      this.loading = true;
      this.postRequest('/login', {
          userid: this.loginForm.userid,
          password: this.loginForm.password
      }).then(resp=> {
          _this.loading = false;
          if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$store.commit('login', data.obj);
          var path = _this.$route.query.redirect;//重定向
          _this.$router.replace({path: path == '/' || path == undefined ? '/home' : path});
          }
      });        
      }
    },
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
