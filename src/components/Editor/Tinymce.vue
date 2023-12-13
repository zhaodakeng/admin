<!-- tinymc富文本 -->
<template>
  <div>
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>

<script>
import {getToken} from "@/utils/tool";

import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/skins/ui/oxide/skin.css";
// import "public/tinymce/zh_CN.js"; // 本地汉化
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/icons/default"; // 图标 -解决测试环境找不icon问题
// import "tinymce/skins/content/document/content.css"
export default {
  name: "tinymce",
  components: {
    Editor,
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        // ' anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists   noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        "lists image media table  wordcount ",
    },
    toolbar: {
      type: [String, Array],
      default:
        // 'undo redo | searchreplace | bold  italic | underline | strikethrough | alignleft  aligncenter alignright | outdent indent  blockquote  removeformat subscript superscript code codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime  table  forecolor backcolor'
        "undo redo |  formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat hr",
    },
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: "/tinymce/zh_CN.js", // 这里需要单独处理
        language: "zh_CN",
        height: 500,
        width:800,
        content_css: 'tinymce/skins/content/document/content.css',
        skin_url: 'tinymce/skins/ui/oxide', // skin路径
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: true,
        menubar: true,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        // images_upload_handler: (blobInfo, success, failure) => {
        //   const img = "data:image/jpeg;base64," + blobInfo.base64();
        //   success(img);
        // },
        // paste_data_images: true, // 默认是false的，记得要改为true才能粘贴
        resize: true,
        images_upload_handler: (blobInfo, success, failure) => {
        var xhr, formData;
        var file = blobInfo.blob(); //转化为易于理解的file对象
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        // 图片上传路由
        xhr.open("POST", window.servicesUrl.apiUrl + "/file/upload");
        xhr.onload = () => {
          var json;
          if (xhr.status != 200) {
            // failure("上传失败: " + xhr.status);
            return;
          }
          
          json = JSON.parse(xhr.responseText);
          // json是后端返回的数据，其中就包含链接
          if (!json || typeof json.location != "string") {
            // failFun("上传成功：");
            // succFun(json.url);json.data[0].successFile
            // success(window.servicesUrl.apiUrl+'/getFile/' + json.data.successFile[0]);
            // success(window.servicesUrl.apiUrl+'/getFile/' + json.data.presignedUrl);
            success(json.data.url);
            // return;
          }
        };
        formData = new FormData();
        formData.append("file", file, file.name); //此处与源文档不一样
        xhr.setRequestHeader("Token", getToken());
        xhr.send(formData);
      }
      },
      myValue: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
<style scoped></style>
