<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" class="loginContainer" :rules="rule" v-loading="loading"
      element-loading-text="正在登陆" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <h3 class="loginTitle">登陆系统</h3>

      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码" />
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="loginForm.code" placeholder="点击图片更换验证码" type="text" auto-complete="false"
          style="width: 235px; margin-right: 5px; margin-top: 0px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha" />
      </el-form-item>

      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import {postRequest,getRequest} from "@/utils/api.js"
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "456",
        code: "",
      },
      checked: true,
      loading: false,
      captchaUrl: "/captcha?time=" + new Date(),
      rule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", this.loginForm).then((resp) => {
            console.log(resp);
            if (resp) {
              this.loading = false;
              const tokenstr = resp.obj.tokenHead + " " + resp.obj.token;
              //将token存到session
              window.sessionStorage.setItem("tokenStr", tokenstr);
              let path = this.$route.query.redirect;
              this.$router.replace(
                path == "/" || path == undefined ? "/home" : path
              );
            } else {
              this.loading = false;
            }
          });
        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });
    },
    updateCaptcha() {
      this.captchaUrl = "/captcha?time=" + new Date();
    },
  },
};
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
  /* background-color: red; */
}
</style>