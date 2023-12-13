<template>
  <Dialog
      :title="`${form.id?'编辑':'添加'}菜单`"
      v-bind="$attrs"
      width="30%"
      :center="false"
      :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px" class="save-form">
      <el-form-item label="菜单名称：">
        <el-input v-model="form.title" clearable/>
      </el-form-item>
      <el-form-item label="路由地址：">
        <el-input v-model="form.path" clearable/>
      </el-form-item>
      <el-form-item label="路由name：">
        <el-input v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="文件路径：">
        <el-input v-model="form.component" clearable/>
      </el-form-item>
      <el-form-item label="ICON：">
        <el-input v-model="form.icon" clearable placeholder="菜单左侧图标"/>
      </el-form-item>
      <el-form-item label="父菜单：">
        <el-select v-model="form.pid" clearable placeholder="请选择">
          <el-option
              label="一级菜单"
              value="-1">
          </el-option>
          <el-option
              v-for="item in menuOption"
              :key="item.id"
              :label="item.title"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number :min="0" v-model="form.sort" clearable/>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select v-model="form.type" clearable placeholder="请选择">
          <el-option
              v-for="item in typeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>

<script>
import {menuQueryAll, menuSave} from "@/api/systemConfig/menu";
import Dialog from "@/components/Dialog";

export default {
  name: "routerSave",
  components: {Dialog},
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
      menuOption: [],
      typeOption: [
        {
          label: '菜单',
          value: 'menu'
        }, {
          label: '路由',
          value: 'router'
        }],
      title: '',
      form: {
        id: undefined,
        name: undefined,
        title: undefined,
        path: undefined,
        icon: undefined,
        component: undefined,
        pid: undefined,
        sort: 0,
        type: 'menu',
      }
    }
  },
  watch: {
    updatedata: {
      handler(val) {
        if (val) {
          for (const valKey in val) {
            this.form[valKey] = val[valKey]
          }
        }
      },
      deep: true
    },
    '$attrs.visible': {
      handler(val) {
        if(val){
          this.menuQueryAll()
        }
      },
      deep: true
    }
  },
  mounted() {

  },
  methods: {
    menuQueryAll() {
      menuQueryAll().then(({data}) => {
        this.menuOption = data.filter(item => item.pid == -1 && item.type == 'menu')
      })
    },
    save() {
      menuSave(this.form).then(res => {
        this.close()
        this.$emit('updateList')
      })
    },
    close() {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data().form)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.close();
          })
          .catch(_ => {
          });
    }
  }
}
</script>

<style scoped lang="scss">

</style>