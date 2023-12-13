<template>
  <el-menu
      :default-active="$route.path"
      unique-opened
      router
      class="el-menu-vertical-demo"
      background-color="#009946"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose">
    <el-submenu :index="item.path" v-for="item in menu">
      <template slot="title">
        <i class="iconfont" :class="item.icon"/>
        <span v-text="item.title"/>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="childrenItem in item.children" :index="childrenItem.path" v-text="childrenItem.title"/>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'AdminMenu',
  computed: {
    ...mapGetters(['menu'])
  },
  mounted() {
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu {
  height: 100%;

  ::v-deep .el-menu-item-group__title {
    padding: 0;
  }

  ::v-deep .el-submenu__title {
    text-align: left;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0) !important;
  }

  ::v-deep .el-menu-item {
    text-align: left;
  }

  .iconfont {
    margin-right: 4px;
  }


}

.el-menu-vertical-demo {
  background-image: url("@/assets/images/menu/bg.png");
  background-size: 100%;

  ::v-deep .el-menu-item.is-active {
    background-color: rgb(0 0 0 / 20%) !important;
    color: #fff !important;
  }

  ::v-deep i {
    color: #fff !important;
  }
}
</style>