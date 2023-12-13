<template>
  <Dialog
      :title="`${updatedata?'编辑':'添加'}字典`"
      v-bind="$attrs"
      width="40%"
      :center="false"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <div class="top_box">
        <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="110px">
          <el-form-item label="字典类型名称" prop="codeTypeName">
            <el-input v-model="form.codeTypeName" placeholder="字典类型名称"></el-input>
          </el-form-item>
        </el-form>
        <div class="operate_box">
          <el-button type="primary"  @click="addRows()">新增</el-button>
        </div>
      </div>
    <el-table
      :data="values"
      border
      style="width: 100%">
      <el-table-column v-for="item in columnData" :key="item.prop" :label="item.label" :prop="item.prop" :width="item.width">
        <template v-slot="scope">
        <span v-if="scope.row[item.prop] !== null">
          <el-input-number :min="0" v-model="scope.row[item.prop]" v-if="item.type=='number'"/>
          <el-input v-model="scope.row[item.prop]" v-else></el-input>
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80">
        <template v-slot:header="scope">
        </template>
        <template v-slot="scope">
          <el-button size="small" type="danger" @click="deleteColumns(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">关 闭</el-button>
    <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </Dialog>
</template>

<script>
import { batchInsert, getSysCodeByCodeType, updateData } from "@/api/systemConfig/dictionaries";
import { number } from 'echarts';

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
      title: '',
      form: {
        codeTypeName: undefined,
      },
      rules: {
        codeTypeName: [
          { required: true, message: '请输入字典类型名称', trigger: 'blur' }
        ]
      },
      values: [{orderNum: 0}],
      columnData:[
        {
          label: '字典值',
          prop: 'codeId',
          type: "number",
          width: ''
        },
        {
          label: '字典文本',
          prop: 'codeValue',
          width: ''
        },
        {
          label: '排序值',
          prop: 'orderNum',
          type: "number",
          width: ''
        }
      ],
    }
  },
  watch: {
    updatedata: {
      handler(val) {
        if (val) {
          this.form.codeTypeName = val.codeTypeName
          this.form.codeType = val.codeType
          this.getDataByCodeType(val.codeType)
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          for (const value of this.values) {
            value.codeTypeName = this.form.codeTypeName
            if(this.form.codeType){
              value.codeType = this.form.codeType
            }
            if(!value.codeId || !value.codeValue){
              this.$message({
                showClose: true,
                message: '有字典值或字典文本未填',
                type: 'warning'
              });
              return false
            }
          }
          if(this.form.codeType){
            updateData(this.values).then(res => {
              if(res != undefined && (res.code == 201 || res.code == 202)){
                this.close()
                this.$emit('updateList')
              }
            })
          }else{
            batchInsert(this.values).then(res => {
              if(res != undefined && (res.code == 201 || res.code == 202)){
                this.close()
                this.$emit('updateList')
              }
            })
          }
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data().form)
      this.values = [{orderNum: 0}]
    },
    handleClose(done) {
      this.close();
    },
    addRows() {
      this.values.push({orderNum: 0})
    },
    deleteColumns(index) {
      this.values.splice(index, 1);
    },
    //根据字典类型获取字典
    getDataByCodeType(codeType){
      getSysCodeByCodeType({codeType: codeType}).then(res=>{
        this.values = res.data || []
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top_box{
  display: flex;
  justify-content: space-between;
}
</style>