<template>
  <div class="index-main-tabs" ref="tabs">
    <transition name="el-fade-in-linear" v-for="index in tablist" :key="time+index"
                :duration="150"
                v-on:after-leave="close(index,pathMap[index])">
      <div class=" row-omit"
           :class="{'active':pathMap[index].path == $route.path,'tabs':tablist.length>1,'tab':tablist.length == 1} "
           @click="to(pathMap[index])" v-show="!closeList.includes(index)" :ref="`${index}`">
        <div class="label" @mouseup="none(index,$event)">
          {{ pathMap[index]?.meta?.tabTitle }}
        </div>
        <div class="close" v-show="tablist.length>1" @click.stop="none(index)">
          <i class="el-icon-close"/>
        </div>
      </div>
    </transition>


  </div>
</template>

<script>
export default {
  name: "TabList",
  data() {
    return {
      pathMap: {},
      tablist: [],
      time: Date.now(),
      closeList: []
    }
  },
  watch: {
    '$route': {
      handler(val) {
        this.time = Date.now()
        if (val.meta.type != 'menu') return
        if (!this.pathMap[val.path]) {
          this.pathMap[val.path] = val
          /*if (this.tablist.length >= 20) { //最大数限制
            let key = this.tablist.splice(0, 1)[0]
            delete this.pathMap[key]
          }*/
          this.updateList()
        }
        setTimeout(() => {
          this.scrollTo(val.path)
        }, 50)
      },
      deep: true
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    none(key, e) {
      if (e && e.button != 1) return; //排除非中键
      if (this.tablist.length == 1) return; //最后一条数据
      let t = Date.now() - this.time
      if (t < 50) return //防抖
      this.closeList.push(key)
      if (this.$route.fullPath == key) {//关闭自己
        const i = this.tablist.indexOf(key)
        if (this.tablist.length - 1 == i) {//最后一个
          this.to(this.pathMap[this.tablist[i - 1]])//打开上一个
        } else {
          this.to(this.pathMap[this.tablist[i + 1]])//打开下一个
        }
      }
    },
    to(item) {
      if (this.$route.fullPath == item.fullPath) return
      this.$router.push(item.fullPath)
      this.scrollTo(item.path)
    },
    scrollTo(path) {
      let left = this.$refs[path][0].getBoundingClientRect().left - this.$refs.tabs.getBoundingClientRect().left
      this.$refs.tabs.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    },
    close(key, item) {
      this.time = Date.now()
      this.tablist.splice(this.tablist.indexOf(key), 1)
      delete this.pathMap[key]
      this.closeList.splice(this.closeList.indexOf(key), 1)
    },
    init() {
      this.pathMap[this.$route.path] = this.$route
      this.updateList()
    },
    updateList() {
      Object.keys(this.pathMap).forEach(item => {
        const index = this.tablist.indexOf(item)

        if (index == -1)
          this.tablist.push(item)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.index-main-tabs {
  height: 40px;
  background-color: #fff;
  padding: 6px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;

  ::-webkit-scrollbar {
    height: 6px;
  }

  @mixin tab {
    border: #eee solid 1px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
    transition: all .3s;
    position: relative;
    height: 24px;

    .label {
      white-space: pre;
      font-size: 12px;
    }

    .close {
      height: 100%;
      position: absolute;
      right: 2px;
      background-color: #fff;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 6px;

      i {
        font-size: 14px;

        transition: all .3s;


        &:hover {
          transform: rotate(90deg);
        }
      }
    }
  }

  .tab {
    @include tab;
    padding: 0 10px 0 10px;
  }

  .tabs {
    @include tab;
    padding: 0 26px 0 10px;
  }

  .active {
    border-color: $color-primary;
    color: $color-primary;
  }
}
</style>