<template>
       <el-container class="container">
  <el-header class="header">
      <el-row>
  <el-col :span="3"><div class="grid-content bg-purple">
      <img src="@/assets/logo.png" alt="">
      </div></el-col>
  <el-col :span="19" class="middle">
      <h2>电商后台管理系统</h2></el-col>
  <el-col :span="1" class="loginout"><a @click="handleLoginout()" href="#">退出</a></el-col>
</el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">
          <el-menu
      default-active="2"
      router
      unique-opened>
      <el-submenu :index="''+item1.order" v-for="(item1) in menu" :key="item1.id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item1.authName}}</span>
        </template>
          <el-menu-item :index="item2.path" v-for="(item2) in item1.children" :key="item2.id"><i class="el-icon-menu"></i>{{item2.authName}}</el-menu-item>
      </el-submenu>

    </el-menu>
    </el-aside>
    <el-main class="main">
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  created () {
    this.getMenu()
  },
  data () {
    return {
      menu: []
    }
  },
  methods: {
    handleLoginout () {
      localStorage.clear()
      this.$router.push({
        path: 'login'
      })
    },
    async getMenu () {
      const res = await this.$http.get(`menus`)
      this.menu = res.data.data
    }
  }
}
</script>

<style>
.container{
    height: 100%;
    width: 100%;
}
.header{
    background: #B3C0D1;
}
.middle{
    text-align: center;
    color: #fff;
    line-height: 60px;
}
.loginout a{
    line-height: 60px;
    text-decoration: none;
}
</style>
