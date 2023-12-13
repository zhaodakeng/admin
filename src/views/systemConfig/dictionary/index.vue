<template>
  <div class="router-list">
    <Search @onSearch="onSearch" @onRes="onRes">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.codeTypeName" clearable/>
        </el-form-item>
      </el-form>
    </Search>
    <Table ref="table" :columns="columns" :form="searchForm" @selection-change="selectionChange">
      <template #btns>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </template>
    </Table>

    <DictSave :visible.sync="dialogVisible" :updatedata="form" @updateList="onSearch"/>
  </div>

</template>

<script>
import DictSave from "@/views/systemConfig/dictionary/save";
import { deleteBatch } from "@/api/systemConfig/dictionaries";

export default {
  name: "user",
  components: {DictSave},
  data() {
    return {
      searchForm: {
        url: '/codeDict/list',
        codeTypeName: undefined,
      },
      dialogVisible: false,
      test: 0,
      columns: [
        {
          prop: 'codeType',
          label: '字典类型'
        },
        {
          prop: 'codeTypeName',
          label: '字典类型名称'
        },
        {
          prop: 'codeId',
          label: '字典值'
        },
        {
          prop: 'codeValue',
          label: '字典文本'
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
              this.onDel(data)
              // roleDeleteById(data.id).then(res => {
              //   this.$refs.table.getList()
              // })
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
      form: undefined,
      selectionData: []
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
    //删除单条字典
    onDel(rows){
      this.handleBatchDel([rows])
    },
    //批量删除处理
    handleBatchDel(data){
      deleteBatch(data).then(res => {
        if(res != undefined && res.code == 203){
          this.$refs.table.getList()
        }
      })
    },
    //批量删除
    onBatchDel(){
      if(this.selectionData.length == 0){
        this.$message({
          message: '请选择要删除的字典',
          type: 'error'
        });
        return
      }
      this.$confirm('确定要批量删除选中数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleBatchDel(this.selectionData)
      })
    },
    selectionChange(params){
      this.selectionData = params
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