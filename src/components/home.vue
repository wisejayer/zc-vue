<template>
<el-container class="home-container">
  <!-- 头部 -->
  <el-header style="text-align: right; font-size: 15px">
      <el-row :gutter="10">
        <el-col :span="3">
          <i class="el-icon-news" style="font-size: 30px;color:white"></i>
          <span style="font-size: 30px;color:white">综测系统</span>
        </el-col>
        <el-col :span="21">
          <el-dropdown @command="handleCommand">  
            <span class="el-icon-user-solid" style="margin-right: 15px;font-size: 22px;color:white">{{username}}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="system">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
        
  </el-header>
  <el-container>
    <!-- 左侧 -->
    <el-aside width="200px">
      <el-menu router unique-opened style="background: #ececec;">
         <!--一级菜单-->
        <!-- <template  v-for="(item,index) in $router.options.routes"> -->
        <template  v-for="(item,index) in this.routes">
          <el-submenu :key="item.id" :index="index+''" v-if="!item.hidden">
            <template slot="title"><i class="el-icon-menu" ></i>
            <span>{{item.name}}</span></template>
            <!--二级菜单-->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{subItem.name}}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>

    </el-aside>
    <!--主体-->
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
      </el-breadcrumb>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
  export default {
    data() {
      return{
        username:JSON.parse(window.localStorage.getItem('user')).username,
        activeName: '1'
      }
    },
    //mounted: {  
    //},
    methods: {
       handleCommand(cmd){
         var _this = this;
          if (cmd == 'logout') {
            this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.getRequest("/logout");
            _this.$store.commit('logout');
            _this.$router.replace({path: '/'});
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }
        if(cmd == 'system'){
          _this.$router.push({ path:'/system'});
        }
      },
    },
    computed:{
      routes(){
        return this.$store.state.routes
      }
    }
  };

</script>

<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
  .el-header{
    background-color: #409EFF;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>