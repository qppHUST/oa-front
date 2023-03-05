<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">OA-system</div>
        <div>
          <el-button type="text" icon="el-icon-bell" style="color: black;margin-right:8px;" @click="goChat"></el-button>
          <el-dropdown class="userInfo" @command="commandHandler">
            <span class="el-dropdown-link">
              <span>
                {{ user.name }}
              </span>
              <i><img :src="user.userFace" /></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="height:80vh">
          <el-menu router unique-opened style="height:max-content">
            <el-submenu :index="index + ''" v-for="(item, index) in routes" :key="index">
              <template v-if="!item.hidden">
                <template slot="title">
                  <i :class="item.iconCls" style="color: #eaccff; margin-right: 5px"></i>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item :index="children.path" v-for="(children, indexj) in item.children" :key="indexj">
                  {{ children.name }}
                </el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path != '/home'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"> 首页 </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ this.$router.currentRoute.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path == '/home'">
            欢迎来到 OA-system
          </div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import store from '@/store/'
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
  methods: {
    goChat(){
      this.$router.push('/chat')
    },
    commandHandler(command) {
      if (command == "logout") {
        this.$confirm("此操作将退出登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.postRequest("/logout");
            window.sessionStorage.removeItem("tokenStr");
            window.sessionStorage.removeItem("user");
            //清空菜单
            this.$store.commit("initRoutes", []);
            //跳转到登录
            this.$router.replace("/");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }else if(command == 'setting'){
        alert('setting')
      }else if(command == 'userInfo'){
        alert('userInfo')
      }
    },
  },
};
</script>

<style>
.homeHeader {
  background-color: #4091ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  color: white;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  color: #409eff;
  padding-top: 5px;
}

.homeRouterView {
  margin-top: 10px;
}
</style>