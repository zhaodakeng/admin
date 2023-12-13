<template>
  <el-container class="index">
    <el-header class="index-header" :height="$pxToRem(60)">
      <el-row class="row">
        <el-col :span="16" class="logo">
          <el-image :src="require('@/assets/logo.png')"/>
          <span>后台管理系统</span>
        </el-col>
        <el-col :span="8">

          <el-dropdown @command="menuClick" class="btn" style="float:right">
            <div class="user">
              <el-avatar :size="40" v-if="user.sex != 0" :src="manImg" fit="contain"/>
              <el-avatar :size="40" v-if="user.sex && user.sex != 1" :src="girlImg" fit="contain"/>
              <span class="hello">{{ user.username }}</span> <span class="bg-username">{{ user.realName }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in router" :key="index" :command="item.path">{{
                  item.title
                }}
              </el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <changePassword :visible.sync="passDialogVisible"></changePassword>
    </el-header>
    <el-container class="container-main">
      <el-aside :width="$pxToRem(208)" class="index-aside">
        <AdminMenu/>
      </el-aside>
      <el-main class="index-main">
        <TabList/>
        <div class="index-main-box">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import {mapGetters} from "vuex";
import manImg from '../assets/images/menu/man.png'
import girlImg from '../assets/images/menu/girl.png'
import changePassword from "@/views/systemConfig/user/changePassword.vue";
import TabList from "@/components/TabList";

export default {
  name: "index",
  components: {TabList, changePassword},
  data() {
    return {
      manImg: manImg,
      girlImg: girlImg,
      passDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    router() {
      //获取显示的路由
      let router = this.$store.getters.router || []
      // let displayUrl = ["screen/county/index","screen/homeBase/index"]
      let currRouter = router.filter(item => {
        // return item.type == 'router' && displayUrl.indexOf(item.component) != -1
        return item.type == 'router'
      })
      //若存在全县大屏，隐藏不显示基地大屏
      let urlList = currRouter.map(item => {
        return item.component
      })
      if (urlList.indexOf("screen/county/index") != -1) {
        currRouter = currRouter.filter(item => {
          return item.component != "screen/homeBase/index"
        })
      }
      return currRouter
    }
  },
  methods: {
    menuClick(val) {
      if (val == 'loginOut') {
        this.$router.push('/login')
      } else if (val == 'changePassword') {
        this.passDialogVisible = true
      } else {
        //点击菜单，路由跳转
        let routeData = this.$router.resolve({
          path: val
        })
        window.open(routeData.href, '_blank')
      }
    },
  }
}
</script>

<style scoped lang="scss">
.el-dropdown-menu--small .el-dropdown-menu__item {
  font-size: 14px;
  padding: 5px 20px;
  line-height: 30px;
}

.el-avatar {
  background: white;
}

.bg-username {
  margin-left: 10px;
  padding: 5px 10px;
  background: #EBFCF3;
  color: #009946;
}

.index {
  height: 100vh;

  .index-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-image: url('@/assets/images/menu/dao.png');
    border-bottom: 1px solid #eff1f4;

    .row {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        font-size: 26px;
        font-weight: bold;
        color: #009946;

        span {
          margin-left: 16px;
          transform: skew(159deg, 0);
        }

        .el-image {
          height: 50px;
        }
      }

      .user {
        display: flex;
        align-items: center;

        .hello {
          font-size: 16px;
          margin-left: 6px;
        }
      }
    }

  }

  .container-main {
    height: calc(100% - 60px);;

    .el-main {
      padding: 0;
    }

    .index-main {
      background-color: #F2F4F6;
      display: flex;
      flex-direction: column;


      .index-main-box {
        flex: 1;
        padding: 15px;

        div:first-child {
          display: flex;
          flex-direction: column;
        }
      }
    }

    .index-aside {
      //background-color: #009946;
      overflow: hidden;
    }
  }


}
</style>