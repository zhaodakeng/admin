<template>
  <Dialog
      :title="`${form.id?'编辑':'添加'}角色`"
      v-bind="$attrs"
      width="30%"
      :center="false"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="save-form">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" clearable/>
      </el-form-item>
      <el-form-item label="角色类型：" prop="roleType">
        <el-select v-model="form.roleType">
          <el-option
            v-for="item in roleTypeList"
            :key="item.codeId"
            :label="item.codeValue"
            :value="item.codeId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单：" prop="menu">
        <el-tree ref="menuTree" :data="menuTreeList" :props="menuDefaultProps" node-key="id" :default-checked-keys="form.router" show-checkbox/>
      </el-form-item>
      <el-form-item label="路由" prop="route">
        <el-tree ref="routeTree" :data="routeList" :props="menuDefaultProps" node-key="id" :default-checked-keys="form.router" show-checkbox/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">关 闭</el-button>
    <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>

<script>
import {roleSave} from "@/api/systemConfig/role";
import { menuQueryAll } from '@/api/systemConfig/menu'
import { findSysCodeByUrl } from '@/api/systemConfig/dictionaries'

export default {
  name: "userSave",
  props: {
    updatedata: {
      type: Object,
      default: () => {
        return undefined
      }
    }
  },
  data() {
    return {
      roleOption: [],
      title: '',
      form: {
        id: undefined,
        name: undefined,
        menu: undefined,
        route: undefined,
        router: [],
        roleType: undefined
      },
      rules: {
        "name": [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleType: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ],
        "menu": [
          { required: true, message: '请选择菜单', trigger: 'blur' }
        ]
      },
      menuTreeList: [],
      menuDefaultProps: {
        children: 'children',
        label: 'title'
      },
      routeList: [],
      //角色类型
      roleTypeList: []
    }
  },
  watch: {
    updatedata: {
      handler(val) {
        if (val == undefined) {
          this.form = this.$options.data().form
          this.$refs.menuTree.setCheckedKeys([])
          this.$refs.routeTree.setCheckedKeys([])
        }else if (val) {
          for (const valKey in val) {
            this.form[valKey] = val[valKey]
          }
          let menus = val.menus || []
          this.form.router = menus.map(item=>{
            return item.id
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.roleTypeList = findSysCodeByUrl("/codeDict/getSysCodeByCodeType?codeType=108")
    //获取菜单
    menuQueryAll({url: '/menu/queryAll'}).then((res=>{
      let tempMenu = res.data || []
      let menuTree = [],routeList = []
      tempMenu.forEach(item=>{
        //获取菜单列表
        if(item.pid == -1 && item.type == "menu"){
          item.children = []
          //二级菜单
          tempMenu.forEach(submenu=>{
            if(item.id == submenu.pid){
              item.children.push(submenu)
            }
          })
          menuTree.push(item)
        }
        //获取路由列表
        if(item.type == "router"){
          routeList.push(item)
        }
      })
      this.menuTreeList = menuTree
      this.routeList = routeList
    }))
  },
  methods: {
    save() {
      // this.form.router = this.$refs.tree.getCheckedKeys()
      this.form.menu = this.$refs.menuTree.getCheckedKeys()
      this.form.route = this.$refs.routeTree.getCheckedKeys()
      this.form.router = [...this.form.menu,...this.form.route]
      this.$refs['form'].validate((valid) => {
        if (valid) {
          roleSave(this.form).then(res => {
            if(res != undefined && (res.code == 201 || res.code == 202)){
              this.close()
              this.$emit('updateList')
            }
          })
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data().form)
    },
    handleClose(done) {
      this.close();
    },
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__body){
  height: 500px;
  overflow: hidden;
  overflow-y: auto;
}
</style>