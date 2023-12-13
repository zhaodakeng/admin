<template>
  <Dialog
      :title="`重置密码`"
      v-bind="$attrs"
      width="30%"
      :center="false"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="save-form">
      <el-form-item label="新密码：" prop="password">
        <el-input v-model="form.password" type="password" placeholder="6-16位，包含字母、数字" clearable/>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" show-password size="small" placeholder="请输入确认新密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">关 闭</el-button>
    <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>

<script>
import { userRestPassword } from "@/api/systemConfig/user";

export default {
  name: "userRestPassword",
  props: {
    updatedata: {
      type: Object,
      default: () => {
        return undefined
      }
    }
  },
  data() {
    var checkPassword = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if(value.length < 6){
        callback(new Error('新密码不能少于6个字符'));
      }else if(reg.test(value) == false){
        callback(new Error('新密码必须包含数字、字母'));
      }
      callback();
    }
    var checkConfirmPassword = (rule, value, callback) => {
      if(value.length < 6){
        callback(new Error('确认新密码不能少于6个字符'));
      }else if(value != this.form.password){
        callback(new Error('新密码与确认密码不一致'));
      }
      callback();
    }
    return {
      title: '',
      form: {
        id: undefined,
        password: undefined,
        confirmPassword: undefined
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: ['change','blur'] }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认新密码', trigger: 'blur' },
          { validator: checkConfirmPassword, trigger: ['change','blur'] }
        ]
      },
    }
  },
  watch: {
    updatedata: {
      handler(val) {
        this.form = this.$options.data().form
        if (val) {
          this.form.id = val.id
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted(){
  },
  methods: {
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          //编辑删除密码
          if(this.form.id){
            delete this.form.confirmPassword
          }
          userRestPassword(this.form).then(res=>{
            if(res != undefined && res.success){
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

</style>