<template>
  <Dialog 
    title="修改密码"
    v-bind="$attrs"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="450px">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="save-form">
      <el-form-item label="原密码：" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" show-password placeholder="请输入原密码" clearable/>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" clearable/>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="confirmNewPassword">
        <el-input v-model="form.confirmNewPassword" type="password" show-password placeholder="请输入确认新密码" clearable/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>
<script>
import { updateUserPassword } from "@/api/systemConfig/user"
export default {
  name: 'changePassword',
  data(){
    var checkPassword = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if(value.length < 6){
        callback(new Error('新密码不能少于6个字符'));
      }else if(reg.test(value) == false){
        callback(new Error('新密码必须包含数字、字母'));
      }else if(value == this.form.oldPassword){
        callback(new Error('新密码与旧密码一致'));
      }
      callback();
    }
    var checkConfirmPassword = (rule, value, callback) => {
      if(value.length < 6){
        callback(new Error('确认新密码不能少于6个字符'));
      }else if(value != this.form.newPassword){
        callback(new Error('新密码与确认密码不一致'));
      }
      callback();
    }
    return{
      form: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmNewPassword: undefined
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: ['change','blur'] }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: ['change','blur'] },
          { validator: checkPassword, trigger: ['change','blur'] }
        ],
        confirmNewPassword: [
          { required: true, message: '请输入确认新密码', trigger: ['change','blur'] },
          { validator: checkConfirmPassword, trigger: ['change','blur'] }
        ]
      }
    }
  },
  methods:{
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateUserPassword(this.form).then(res=>{
            if(res != undefined && (res.code == 201 || res.code == 202)){
              this.close()
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