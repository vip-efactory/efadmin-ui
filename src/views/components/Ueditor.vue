<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="富文本的内容" prop="content">
        <vue-ueditor-wrap v-model="form.content" :config="uEditorConfig" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  name: 'UeditorDemo',
  components: { VueUeditorWrap },
  data() {
    return {
      saving: false,
      uploadedFile: [],
      form: {
        content: '演示环境，请不要上传太多文件，以免占用服务器存储，谢谢!'
      },
      rules: {
      },
      uEditorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,

        // 初始容器高度
        initialFrameHeight: 540,
        // 初始容器宽度
        initialFrameWidth: '90%',
        // 上传文件接口
        serverUrl: process.env.VUE_APP_BASE_API + '/editor/config',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/static/UEditor/'
      }
    }
  },
  methods: {
  }
}
</script>
