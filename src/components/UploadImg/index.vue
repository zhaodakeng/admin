<template>
  <div class="upload-components">
    <el-upload
        :headers="headers"
        ref="upload"
        :action="action"
        v-bind="$attrs"
        list-type="picture-card"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove" >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/tool";
import * as imageConversion from 'image-conversion'

export default {
  name: "UploadImg",
  props: {
    imgList: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    zip:Boolean
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
      // console.log('watch',val)
      this.imgListToFileList()
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
    };
  },
  mounted() {
    this.imgListToFileList()
  },
  methods: {
// 上传之前的钩子函数
    beforeUpload(file) {
      // 判断是图片
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        console.log('上传图片只能是 JPG 或 PNG 格式!');
        return false;
      }

      if(!this.zip) return true //不压缩

      return new Promise((resolve) => {
        imageConversion.compressAccurately(file, {size:10}).then(res => {
          resolve(res);
        });
      })
    },
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
    },
  }
}
</script>

<style scoped lang="scss">
.upload-components {

}
</style>