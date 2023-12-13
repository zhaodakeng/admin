<template>
  <Dialog
      :title="`${form.id?'编辑':'添加'}用户`"
      v-bind="$attrs"
      width="35%"
      top="8vh"
      :center="false"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="save-form">
      <el-form-item label="账号：" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号" clearable/>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入真实姓名" clearable/>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="form.id == undefined">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable/>
      </el-form-item>
      <el-form-item label="角色：" prop="roles">
        <el-select  v-model="form.roles" multiple clearable placeholder="请选择角色" style="width: 100%;">
          <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像：" prop="headImgList">
        <UploadImg @success="fileSuccess" @remove="fileRemove" :imgList="form.headImgList" :limit="1"/>
      </el-form-item>
      <el-form-item label="手机号码：">
        <el-input v-model="form.phone" placeholder="请输入手机号码" clearable />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select  v-model="form.sex" clearable placeholder="请选择性别" style="width: 100%;">
          <el-option
              v-for="item in sexOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="form.status" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="2"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">关 闭</el-button>
    <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>

<script>
import { userSave } from "@/api/systemConfig/user";
import { roleQueryAll } from '@/api/systemConfig/role'
import UploadImg from "@/components/UploadImg";

export default {
  name: "userSave",
  components: {
    UploadImg
  },
  props: {
    updatedata: {
      type: Object,
      default: () => {
        return undefined
      }
    },
    //基地企业数据
    companyList: {
      type: Array,
      default: ()=>{
        return []
      }
    }
  },
  data() {
    const checkPassword = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if(value?.length < 6){
        callback(new Error('新密码不能少于6个字符'));
      }else if(reg.test(value) == false){
        callback(new Error('新密码必须包含数字、字母'));
      }
      callback();
    }
    return {
      sexOption:[{
        label: '男',
        value: 1
      },{
        label:'女',
        value: 2
      },],
      title: '',
      form: {
        username: undefined,
        realName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: 1,
        status: 1,
        roles: [],
        companyId: undefined,
        headImgList: []
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: ['change','blur'] }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择所属基地企业', trigger: 'blur' },
        ]
      },
      rolesList: []
    }
  },
  watch: {
    updatedata: {
      handler(val) {
        this.form = this.$options.data().form
        if (val) {
          for (const valKey in val) {
            this.form[valKey] = val[valKey]
          }
          this.form.roles = val["roles"].map(item=>{
            return item.id
          })
          this.form.headImgList = val.headImgList || []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted(){
    //获取角色
    roleQueryAll().then(res=>{
      this.rolesList = res.data || []
    })
  },
  methods: {
    //头像上传成功
    fileSuccess(file, fileList) {
      let currFileData = file.data
      this.form.headImgList.push(currFileData)
    },
    //删除头像
    fileRemove(file, fileList) {
      this.form.headImgList = []
    },
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          //编辑删除密码
          if(this.form.id){
            delete this.form.password
          }
          userSave(this.form).then(res=>{
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
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__body){
  height: 600px;
  overflow: hidden;
  overflow-y: auto;
}
</style>