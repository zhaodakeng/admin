<template>
  <el-dialog class="dialog" v-bind="$attrs" destroy-on-close>
    <template #title>
      <div class="dialog-title-bg">
        {{ $attrs.title }}
      </div>
    </template>
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <slot name="footer"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "Dialog"
}
</script>

<style lang="scss" scoped>
.dialog {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }

  ::v-deep .el-dialog__header {
    padding: 18px 23px;
    border-radius: 10px 10px 0 0;
    background: linear-gradient(90deg, #009946, #95D456);
    color: #fff;

    font-size: 20px;
    line-height: 20px;
  }

  ::v-deep .el-dialog__close {
    color: #fff !important;
  }
}

</style>