<template>
  <div class="router-list">
    <Search @onSearch="onSearch" @onRes="onRes">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="名称">
          <el-input v-model="searchForm.filterStr" clearable/>
        </el-form-item>
      </el-form>
    </Search>
    <Table ref="table" :columns="columns" :form="searchForm">
      <template #btns>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </template>

    </Table>

    <user-save :visible.sync="dialogVisible" :updatedata="form" @updateList="onSearch"/>
  </div>

</template>

<script>
import UserSave from "@/views/systemConfig/role/save";
import {roleDeleteById} from "@/api/systemConfig/role";

export default {
  name: "user",
  components: {UserSave},
  data() {
    return {
      searchForm: {
        url: '/role/queryPage',
        filterStr: undefined,
      },
      dialogVisible: false,
      test: 0,
      columns: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'roleTypeCn',
          label: '角色类型'
        },
        {
          prop: 'action',
          label: '操作',
          width: '200px',
          list: [{
            text: '删除',
            type: 'danger',//非必填
            title: '请确认是否删除此条信息！',//非必填
            confirm: (data) => {//确认后的回调
              roleDeleteById(data.id).then(res => {
                this.$refs.table.getList()
              })
            }
          }, {
            text: '编辑',
            type: 'warning',//非必填
            confirm: (data) => {//确认后的回调
              this.form = data
              this.dialogVisible = true
            }
          }],
          slotScope: true
        }
      ],
      form: undefined
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form = undefined
      }
    }
  },
  methods: {

    onAdd() {
      this.dialogVisible = true
    },
    onSearch() {
      this.$refs.table.initTable()
    },
    onRes() {
      Object.assign(this.$data.searchForm, this.$options.data().searchForm)
      this.$refs.table.initTable()
    }
  }

}
</script>

<style scoped lang="scss">
.router-list {
  height: 100%;
}
</style>