<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="富文本的内容" prop="content">
        <vue-ueditor-wrap v-model="form.content" :config="uEditorConfig" editor-id="editor-demo-01" @before-init="handleBeforeInit" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { VueUeditorWrap } from 'vue-ueditor-wrap'

// 控制台调试信息
console.log('VueUeditorWrap 类型:', typeof VueUeditorWrap)
console.log('VueUeditorWrap 内容:', VueUeditorWrap)
console.log('是否具有 render 函数:', typeof VueUeditorWrap.render)

const form = reactive({
  content: '演示环境，请不要上传太多文件，以免占用服务器存储，谢谢!<BR/> Demo environment, please do not upload too many files, so as not to occupy server storage, thank you!'
})

const rules = ref({})

const uEditorConfig = reactive({
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 540,
  // 初始容器宽度
  initialFrameWidth: '90%',
  // 上传文件接口
  serverUrl: process.env.VUE_APP_BASE_API + '/editor/config',
  // UEditor 资源文件的存放路径
  UEDITOR_HOME_URL: '/static/UEditor/'
})

// 方法
const handleBeforeInit = (editorId) => {
  console.log(`编辑器 ${editorId} 即将初始化`)
}

// 生命周期钩子
onMounted(() => {
  console.log(form.content)
  console.log('界面初始化', uEditorConfig.UEDITOR_HOME_URL)
})
</script>
