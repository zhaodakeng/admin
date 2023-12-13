<template>
  <Dialog
      :title="`${form.id?'编辑':'添加'}用户`"
      v-bind="$attrs"
      width="35%"
      top="8vh"
      :center="false"
      :destroy-on-close="true"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="save-form">
      <el-form-item label="账号：" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号" clearable/>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入真实姓名" clearable/>
      </el-form-item>
      <el-form-item label="用户标识：" prop="userFlag" v-if="updatedata!=null && (updatedata.userFlag == 1 || updatedata.userFlag == 2)">
        <el-select  v-model="form.userFlag" clearable placeholder="请选择用户标识" style="width: 100%;">
          <el-option
            v-for="item in userFlag"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
      <el-form-item label="用户地址：" prop="address">
        <el-input v-model="form.address" placeholder="用户地址" clearable />
      </el-form-item>
      <el-form-item label="擅长项：" prop="beGoodAt">
        <el-input v-model="form.beGoodAt" placeholder="擅长项" clearable />
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
import UploadImg from "@/components/UploadImg";
export default {
  name: "userSave",
  components: { UploadImg },
  props: {
    updatedata: {
      type: Object,
      default: () => {
        return undefined
      }
    },
  },
  data() {
    return {
      sexOption:[{
        label: '男',
        value: 1
      },{
        label:'女',
        value: 2
      },],
      userFlag:[
        {
          label: '普通用户',
          value: 1
        },{
          label:'专家用户',
          value: 2
        }
      ],
      title: '',
      form: {
        username: undefined,
        realName: undefined,
        phone: undefined,
        email: undefined,
        sex: 1,
        status: 1,
        userFlag: 0,
        address: undefined,
        beGoodAt: undefined,
        headImgList: [],
        roles: []
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        userFlag: [
          { required: true, message: '请选择用户标识', trigger: 'blur' },
        ]
      },
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