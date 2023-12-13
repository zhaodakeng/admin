<template>
  <div class="router-list">
    <Search @onSearch="onSearch" @onRes="onRes">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="内容">
          <el-input v-model="searchForm.filterStr" placeholder="操作用户或内容" clearable/>
        </el-form-item>
      </el-form>
    </Search>
    <Table ref="table" :columns="columns" :form="searchForm" @selection-change="selectionChange"/>
  </div>

</template>

<script>
import { logDeleteById, logDeleteBatch } from "@/api/systemConfig/log";

export default {
  name: "user",
  components: {},
  data() {
    return {
      searchForm: {
        url: '/log/queryPage',
        filterStr: undefined,
      },
      columns: [
        // {
        //   prop: 'id',
        //   label: 'id'
        // },
        {
          prop: 'userName',
          label: '操作用户',
        },
        {
          prop: 'platformName',
          label: '平台',
        },
        {
          prop: 'content',
          label: '内容',
        },
        {
          prop: 'ipAddr',
          label: 'IP',
        },
        {
          prop: 'recordTime',
          label: '操作时间',
        },
        {
          prop: 'action',
          label: '操作',
          width: '100px',
          list: [{
            text: '删除',
            type: 'danger',//非必填
            title: '请确认是否删除此条信息！',//非必填
            confirm: (data) => {//确认后的回调
              logDeleteById(data.id).then(res => {
                if(res != undefined && res.success){
                  this.$refs.table.getList()
                }
              })
            }
          }],
          slotScope: true
        }
      ],
      selectionData: []
    }
  },
  methods: {
    onSearch() {
      this.$refs.table.initTable()
    },
    onRes() {
      Object.assign(this.$data.searchForm, this.$options.data().searchForm)
      this.$refs.table.initTable()
    },
    selectionChange(params){
      this.selectionData = params
    },
    //批量删除
    onBatchDel(){
      if(this.selectionData.length == 0){
        this.$message({
          message: '请选择要删除的日志',
          type: 'error'
        });
        return
      }
      let logIds = this.selectionData.map(item=>{
        return item.id
      })
      this.$confirm('确定要批量删除选中数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logDeleteBatch({logIds: logIds}).then(res => {
          if(res != undefined && res.success){
            this.$refs.table.getList()
          }
        })
      })
    }
  }

}
</script>

<style scoped lang="scss">
.router-list {
  height: 100%;
}
</style>