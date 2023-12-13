<template>
  <div class="router-list">
    <Search @onSearch="onSearch" @onRes="onRes">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="真实姓名">
          <el-input v-model="searchForm.filterStr" clearable/>
        </el-form-item>
      </el-form>
    </Search>
    <Table ref="table" :columns="columns" :form="searchForm">
      <template #btns>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </template>
      <template #status="{ data }">
        <!-- {{ data.status == '1' ? '启用' : '禁用' }} -->
        <el-switch v-model="data.status" :active-value="1" :inactive-value="2" @change="changeSwitch(data)"></el-switch>
      </template>
      <template #roles="{ data }">
        {{ handleRoles(data.roles) }}
      </template>

    </Table>

    <RouterSave :visible.sync="dialogVisible" :updatedata="form" @updateList="onSearch" :companyList="companyList"/>
    <resetPass :visible.sync="dialogResetPassVisible" :updatedata="form" @updateList="onSearch"/>
  </div>

</template>

<script>
import {userDeleteById, updateUserStatus} from "@/api/systemConfig/user";
import RouterSave from "@/views/systemConfig/user/save";
import resetPass from "@/views/systemConfig/user/resetPass.vue";
import {pxToPx} from "@/utils/tool";

export default {
  name: "user",
  components: {RouterSave, resetPass},
  data() {
    return {
      searchForm: {
        url: '/user/queryPage',
        filterStr: undefined,
      },
      dialogVisible: false,
      dialogResetPassVisible: false,
      test: 0,
      columns: [
        // {
        //   prop: 'id',
        //   label: 'id'
        // },
        {
          prop: 'username',
          label: '账号'
        },
        {
          prop: 'realName',
          label: '真实姓名'
        },
        {
          prop: 'roles',
          label: '角色',
          slotScope: true
        },
        {
          prop: 'phone',
          label: '手机号码'
        },
        {
          prop: 'email',
          label: '邮箱'
        },
        {
          prop: 'sexCn',
          label: '性别'
        },
        {
          prop: 'status',
          label: '状态',
          slotScope: true
        },
        {
          prop: 'action',
          label: '操作',
          width: pxToPx(280),
          list: [
            {
              text: '删除',
              type: 'danger',//非必填
              title: '请确认是否删除此条信息！',//非必填
              confirm: (data) => {//确认后的回调
                userDeleteById(data.id).then(res => {
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
            }, {
              text: '重置密码',
              type: 'warning',//非必填
              confirm: (data) => {//确认后的回调
                this.form = data
                this.dialogResetPassVisible = true
              }
            }
          ],
          slotScope: true
        }
      ],
      form: undefined,
      //基地企业集合
      companyList: []
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form = undefined
      }
    }
  },
  mounted() {

  },
  methods: {
    onAdd() {
      this.form = undefined
      this.dialogVisible = true
    },
    onSearch() {
      this.$refs.table.initTable()
    },
    onRes() {
      Object.assign(this.$data.searchForm, this.$options.data().searchForm)
      this.$refs.table.initTable()
    },
    //处理角色
    handleRoles(roles) {
      let names = roles.map(item => {
        return item.name
      })
      return names.join("、")
    },
    //用户状态操作
    changeSwitch(rows) {
      let currStatus = rows.status
      rows.status = rows.status == 1 ? 2 : 1
      //更新用户状态
      updateUserStatus({id: rows.id, status: currStatus}).then(res => {
        if (res != undefined && res.success) {
          this.$refs.table.getList()
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.router-list {
  height: 100%;
}
</style>