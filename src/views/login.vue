<template>
  <div class="login_box">
    <div class="top_box">
      <div class="name">
        <div class="layout">
          <img src="@/assets/logo.png"/>
          <div class="title">后台管理系统</div>
        </div>
      </div>
    </div>
    <div class="login_left">
      <img src="@/assets/images/Login/leftImg.png"/>
    </div>
    <div class="login_cont">
      <div class="login_cont_layout">
        <div class="title_box">
          <div class="layout">
            <img src="@/assets/logo.png"/>
            <div class="title">你好，欢迎登录后台系统</div>
          </div>
          
        </div>
        <div class="form_box">
          <el-form
            autoComplete="on"
            :model="from"
            ref="from"
            label-position="left"
            :rules="loginRules"
          >
            <el-form-item prop="username">
              <el-input v-model="from.username" placeholder="请输入用户名">
                <template #prefix>
                  <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="from.password" type="password" placeholder="请输入密码">
                <template #prefix>
                  <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" :loading="btnloading">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bottom_box">
      Copyright © 2023 ZJF All rights reserved v2023.12.05
    </div>
  </div>
</template>

<script>

export default {
  name: "login",
  data() {
    return {
      btnloading: false,
      from: {
        username: undefined,
        password: undefined,
        platformId: 1001,
      },
      loginRules: {
        username: [{required: true, trigger: "blur", message: '用户名不能为空'}],
        password: [
          {required: true, message: '密码不能为空', trigger: "blur"},
          {min: 6, message: '密码不能小于6位', trigger: 'blur'}
        ],
      },
    }
  },
  mounted() {

  },
  methods: {
    login() {
      this.$refs.from.validate((valid) => {
        if (valid) {
          this.btnloading = true
          this.$store.dispatch('login', this.from).then(() => {
            return this.$store.dispatch('GetUserInfo')
          }).then((res) => {
            if (!res)
              this.btnloading = false;
            else this.$router.push({path: "/index"})
          }).finally(() => {
            this.btnloading = false;
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login_box{
  height: 100vh;
  background: url("@/assets/images/Login/bj.png") ;
  background-size: 100%;
  display: flex;
  justify-content: center;
  .login_left{
    width: 55%;
    display: flex;
    justify-content: right;
    align-items: center;
    img{
      width: 92%;
      margin: 8% 0 0 0;
    }
  }
  .login_cont{
    width: 45%;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .login_cont_layout{
    width: 516px;
    background-color: #FFFFFF;
    border-radius: 15px;
    padding: 60px 0px;
    box-sizing: border-box;
  }
  .title_box{
    text-align: center;
    font-size: 28px;
    line-height: 60px;
    color: #192B20;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 48px;
    .layout{
      display: flex;
    }
    img{
      width: 70px;
      margin-right: 10px;
    }
  }
  .form_box{
    width: 100%;
    padding: 0px 55px;
    box-sizing: border-box;
    
  }
}
.el-input{
  font-size: 20px;
  :deep(.el-input__inner){
    border: 0px;
    background-color: rgba(247, 248, 250, 1);
    border-radius: 8px;
    height: 52px;
    padding-left: 50px;
  }
  .el-input__icon{
    font-size: 24px;
    color: rgba(153, 160, 166, 1);
  }
}
.el-button--primary{
  font-size: 20px;
  line-height: 35px;
  width: 100%;
  letter-spacing: 10px;
  border-radius: 8px;
}
.el-form-item--small.el-form-item{
  margin-bottom: 40px;
}
:deep(.el-input__prefix){
  padding: 0px 8px;
}
:deep(.el-form-item__error){
  font-size: 14px;
  line-height: 1.2;
}
.top_box{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: #FFFFFF;
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.04);
  
  .name{
    width: 55%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    line-height: 50px;
    font-size: 26px;
    font-weight: bold;
    color: #009946;
    font-style: italic;
    .layout{
      display: flex;
    }
    img{
      height: 50px;
      margin-right: 10px;
    }
  }
}
.bottom_box{
  width: 100%;
  height: 55px;
  line-height: 55px;
  background: #FFFFFF;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  color: #999999;
  font-size: 14px;
}
</style>