<template>
  <div class="router-list">
    <search @onSearch="onSearch" @onRes="onRes">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="名称">
          <el-input v-model="searchForm.filterStr" clearable placeholder="名称"/>
        </el-form-item>
      </el-form>
    </search>
    <Table ref="table" :columns="columns" :form="searchForm" row-key="id" pid="pid" :paginationShow="false">
      <template #btns>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </template>
      <template #pid="{ data }">
        {{ data.pid == '-1' ? '一级菜单' : '二级菜单' }}
      </template>
    </Table>

    <RouterSave :visible.sync="dialogVisible" :updatedata="form" @updateList="onSearch"/>
  </div>

</template>

<script>
import {menuDeleteById} from "@/api/systemConfig/menu";
import RouterSave from "@/views/systemConfig/router/save";

export default {
  name: "router",
  components: { RouterSave},
  data() {
    return {
      searchForm: {
        url: '/menu/queryAll',
        filterStr: undefined,
      },
      dialogVisible: false,
      test: 0,
      columns: [
        {
          prop: 'title',
          label: '名称'
        },
        {
          prop: 'path',
          label: '地址'
        },
        {
          prop: 'name',
          label: '路由name'
        },
        {
          prop: 'component',
          label: '目录'
        },
        {
          prop: 'type',
          label: 'type'
        },
        {
          prop: 'pid',
          label: '父菜单id',
          slotScope: true
        },
        {
          prop: 'sort',
          label: '排序'
        },
        {
          prop: 'action',
          label: '操作',
          list: [{
            text: '删除',
            type: 'danger',//非必填
            title: '请确认是否删除此条信息！',//非必填
            confirm: (data) => {//确认后的回调
              menuDeleteById(data.id).then(res => {
                this.$refs.table.getList()
              })
            }
          }, {
            text: '编辑',
            type: 'warning',//非必填
            confirm: (data) => {//确认后的回调
              this.form = data
              console.log(this.form = data)
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