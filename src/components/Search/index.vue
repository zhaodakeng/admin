<template>
  <div class="search-components">
    <div class="title">
      <div class="text">
        <div class="i"/>
        <span>筛选条件</span>
      </div>
      <div class="btn">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" plain @click="onRes">重置</el-button>
      </div>
    </div>
    <el-row class="row">
      <slot></slot>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Search",
  methods: {
    onSearch() {
      this.$emit('onSearch')
    },
    onRes() {
      this.$emit('onRes')
    },
  }
}
</script>

<style scoped lang="scss">
.search-components {
  padding: 15px 24px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    justify-content: space-between;
    font-size: 16px;
    color: #142338;
    font-weight: bold;

    .text {
      display: flex;
      align-items: center;
      font-family: Alibaba-PuHuiTi-Bold;

      .i {
        width: 3px;
        height: 14px;
        background: #009946;
        margin-right: 4px;
      }

      span {
        font-size: 16px;
        color: #142338;
      }
    }


  }

  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    ::v-deep .el-col {
      margin-bottom: 10px;
    }
  }
}

</style>