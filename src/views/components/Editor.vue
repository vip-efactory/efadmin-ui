<template>
  <div class="app-container">
    <p class="warn-content">
      {{ $t('editor.baseOn') }}
      <el-link type="primary" href="https://www.wangeditor.com/doc/" target="_blank">wangEditor4</el-link>
      ，{{ $t('editor.imgUpUse') }} <el-link type="primary" href="https://sm.ms/" target="_blank">SM.MS</el-link>
    </p>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
        <div ref="editor" class="text" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
        <div v-html="editorContent" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import E from 'wangeditor'
import i18n from '../../lang'

export default {
  name: 'Editor',
  data() {
    return {
      editorContent:
        `
        <ul>
          <li>` + i18n.t('editor.contentLi1') + `<a style="color: #42b983" target="_blank" href="https://sm.ms/">sm.ms</a></li>
          <li>` + i18n.t('editor.contentLi2') + `<a style="color: #42b983" target="_blank" href="https://www.wangeditor.com/doc/">wangEditor4</a></li>
        </ul>
        `
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    const _this = this
    const editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.config.zIndex = 10
    // 文件上传
    editor.config.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        upload(_this.imagesUploadApi, image).then(data => {
          insert(data.data.url)
        })
      })
    }
    editor.config.onchange = (html) => {
      this.editorContent = html
    }
    editor.create()
    // 初始化数据
    editor.txt.html(this.editorContent)
  }
}
</script>

<style scoped>
  .text {
    text-align:left;
  }
  /deep/ .w-e-text-container {
    height: 420px !important;
  }
</style>
