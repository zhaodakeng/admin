<template>
  <div class="table-list" id="table-list">
    <div class="title">
      <div class="text">
        <div class="i"/>
        <span>{{ title }}</span>
      </div>
      <div class="btn">
        <slot name="btns"></slot>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading" height="100%" header-cell-class-name="header-class"
              cell-class-name="cell-class-name"
              :border="tableBorder" v-bind="$attrs" v-on="$listeners" ref="table">
      <el-table-column
          align="center"
          v-if="selection"
          type="selection"
          :width="$pxToPx(50)"/>
      <el-table-column
          align="center"
          label="序号"
          v-if="tableIndex"
          type="index"
          :width="$pxToPx(50)"/>
      <template v-for="list in columns">
        <el-table-column :key="list.prop" :show-overflow-tooltip="true" v-bind="list"
                         align="center" :width="list.width">
          <template slot-scope="scope">
            <template v-if="list.slotScope">
              <slot :name="list.prop" :data="scope.row"></slot>
              <template v-if="list.prop === 'action' && list.list "> <!--操作按钮-->
                <template v-for="item in list.list">
                  <el-popconfirm v-if="item.title" @confirm="item.confirm(scope.row)" :title="item.title">
                    <el-button size="mini" plain slot="reference" :type="item.type" v-text="item.text"
                               :style="`margin-right:${$pxToRem(10)}`"/>
                  </el-popconfirm>
                  <el-button v-else size="mini" plain slot="reference" :type="item.type" v-text="item.text"
                             @click="item.confirm(scope.row)"/>
                </template>
              </template>
            </template>
            <template v-else>{{ scope.row[list.prop] }}</template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination v-if="paginationShow" layout="total,prev, pager, next,sizes" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" :page-size="paginList.pageSize"
                   :current-page="paginList.pageNum"
                   :total="total"/>
  </div>
</template>
<script>
import request from "@/api/request";

/**
 * props:{
 *   row-key:是否为树行菜单
 *   pid:父级id字段名
 *    paginationShow:是否分页
 * }
 */
export default {
  name: 'Table',
  props: {
    selection: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    //序号
    tableIndex: {
      type: Boolean,
      default: true,
    },
    form: {
      type: Object,
      default: () => {
      }
    },
    tableBorder: {
      type: Boolean,
      default: false
    },
    isInit: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: '580px'
    },
    maxHeight: {
      type: String,
      default: ''
    },
    paginationShow: {
      type: Boolean,
      default: true
    },
    tableTitle: String,
    //获取列表总条数
    getTotal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeEnum: {
        del: '删除',
      },
      loading: false,
      total: 0,
      paginList: {
        pageSize: 10,
        pageNum: 1
      },
      copyData: [],
      tableData: []
    }
  },
  computed: {
    title() {
      if (this.tableTitle) {
        return this.tableTitle
      }
      let menuList = []
      for (let menu of this.$store.getters.menu) {
        menuList.push(...menu.children)
      }
      let menu = menuList.find((item) => {
        return this.$route.path == item.path
      })
      return menu.title
    }
  },
  created() {
    if (this.isInit) return
    this.initTable()
  },
  methods: {
    initTable() {
      if (!this.form.url) return
      Object.assign(this.$data.paginList, this.$options.data().paginList)
      this.getList()
    },
    getList() {
      this.loading = true
      request({
        url: this.form.url,
        method: 'get',
        params: {...this.form, ...this.paginList}
      }).then(({data, success}) => {
        this.total = data.total
        if (this.$attrs['row-key']) {
          let list = data.filter(item => item[this.$attrs['pid']] == -1 || item[this.$attrs['pid']] == undefined)
          list.forEach(menu => {
            menu.children = data.filter(item => {
              return item[this.$attrs['pid']] == menu.id //获取二级菜单
            })
          })
          this.tableData = list
        } else {
          this.tableData = data.list ? data.list : []
        }
        //返回数据总条数
        if (this.getTotal) {
          this.$emit('changeTotal', this.total)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(size) {
      console.log(size)
      this.paginList.pageSize = size
      this.$emit('size', size)
      this.paginList.pageNum = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.paginList.pageNum = page
      this.$emit('pageNum', page)
      this.getList()
    },

  }
}
</script>
<style lang="scss" scoped>
.table-list {
  flex: 1;
  width: 100%;
  padding: 15px 24px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;;

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
    font-size: 16px;
    color: #142338;
    font-weight: bold;

    .text {
      display: flex;
      align-items: center;
      font-family: Alibaba-PuHuiTi-Bold;

      .i {
        width: 3px;
        height: 14px;
        background: #009946;
        margin-right: 4px;
      }

      span {
        font-size: 16px;
        color: #142338;
      }
    }
  }

  ::v-deep .header-class {
    background-color: #F8F8F8;
    color: #73767A;
    font-size: 14px;
    font-weight: normal;
  }

  ::v-deep .cell-class-name {
    font-size: 14px;
    color: #142338;
  }

  .el-pagination {
    margin-top: 10px;
    text-align: center;

    .el-pager li {
      color: #909399;
      font-size: 12px;
      font-weight: normal;
      min-width: 28px;
    }

    .el-pager li.active {
      color: #409eff;
      background: #ecf5ff;
    }
  }
}

</style>
