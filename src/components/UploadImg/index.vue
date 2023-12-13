<template>
  <div class="upload-components">
    <el-upload
        :headers="headers"
        ref="upload"
        :action="action"
        v-bind="$attrs"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/tool";

export default {
  name: "UploadImg",
  props: {
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    action() {
      return window.servicesUrl.apiUrl + '/file/upload'
    },
    headers() {
      return {
        token: getToken()
      }
    }
  },
  watch: {
    imgList(val) {
      if (!this.initStatus) {
        this.initStatus = true
        this.imgListToFileList()
      }
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      initStatus: false
    };
  },
  mounted() {
    this.imgListToFileList()
  },
  methods: {
    /**
     * @description: 检查文件长度, 若与限制长度相同则隐藏上传按钮
     * @param {*} filelist 上传文件列表
     * @return {*}
     */
    checkLimit(filelist) {
      const limit = this.$attrs['limit']
      if (!limit) return
      const uploadDom = this.$refs.upload
      if (filelist.length === limit) {
        uploadDom.$children[1].$el.style.display = 'none'
      } else {
        uploadDom.$children[1].$el.style.display = ''
      }
    },
    imgListToFileList() {
      this.fileList = this.imgList.filter(item => item).map(item => {
        return {
          url: item.presignedUrl || item.url || item
        }
      })
      this.checkLimit(this.fileList)
    },
    handleRemove(file, fileList) {
      this.$emit('remove', file.url, fileList.map(file => {
        return file.url
      }))
      this.checkLimit(fileList)
    },
    handleSuccess(file, fileList) {
      this.$emit('success', file, fileList)
      this.checkLimit(this.$refs.upload.uploadFiles)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style scoped lang="scss">
.upload-components {

}
</style>