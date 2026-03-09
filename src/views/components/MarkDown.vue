<template>
  <div class="app-container">
    <p class="warn-content">
      Markdown基于 <el-link type="primary" href="https://github.com/code-farmer-i/v-md-editor" target="_blank">@kangc/v-md-editor</el-link>（Vue3适配版），图片上传使用 <el-link type="primary" href="https://sm.ms/" target="_blank">SM.MS</el-link>
    </p>
    <v-md-editor
      ref="md"
      v-model="markdownContent"
      :height="height"
      :default-mode="mode"
      :toolbar-config="toolbarConfig"
      left-toolbar="undo redo | bold italic underline strikethrough | h1 h2 h3 h4 h5 h6 | align left center right | list ol ul task-list | quote | link image code table | hr footnote emoji toc | sub sup br | clear"
      right-toolbar="preview toc fullscreen | export html pdf"
      :code-highlight="true"
      :drag-image="true"
      :paste-image="true"
      :code-line-number="true"
      :code-fold="true"
      :code-language-select="true"
      :task-list="true"
      :autofocus="true"
      :placeholder="$t('editor.placeholder')"
      @image-add="imgAdd"
      @image-del="imgDel"
      @save="handleSave"
      @mode-change="handleModeChange"
    />
  </div>
</template>

<script>
import { upload } from '@/utils/upload'
import { mapGetters } from 'vuex'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs
})

export default {
  name: 'Markdown',
  components: {
    VMdEditor
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 200 + 'px',
      markdownContent: '',
      mode: 'edit',
      toolbarConfig: {
        tooltip: true,
        tooltipDelay: 100,
        direction: 'bottom'
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    this.resizeHandler = () => {
      this.height = document.documentElement.clientHeight - 200 + 'px'
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  created() {
    const cacheContent = localStorage.getItem('markdown_content') || ''
    if (cacheContent) {
      this.markdownContent = cacheContent
    }
  },
  methods: {
    async imgAdd(file, insertImage) {
      // eslint-disable-next-line no-unused-expressions
      this.$message.info('图片上传中...')
      try {
        const data = await upload(this.imagesUploadApi, file.file)
        insertImage({ url: data.data.url, alt: file.name, title: file.name })
        // eslint-disable-next-line no-unused-expressions
        this.$message.success('图片上传成功！')
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        this.$message.error('图片上传失败：' + (err.message || '未知错误'))
      }
    },
    imgDel(url) {
      console.log('删除图片：', url)
      // eslint-disable-next-line no-unused-expressions
      this.$message.info(`已删除图片：${url.split('/').pop()}`)
    },
    handleSave(value, html) {
      console.log('Markdown内容：', value)
      console.log('HTML内容：', html)
      localStorage.setItem('markdown_content', value)
      // eslint-disable-next-line no-unused-expressions
      this.$message.success('内容已保存！')
    },
    handleModeChange(mode) {
      this.mode = mode
      console.log('编辑器模式切换为：', mode)
    }
  }
}
</script>

<style scoped>
.warn-content {
  margin-bottom: 10px;
  color: #666;
}
:deep(.v-md-editor) {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-size: 14px;
}
:deep(.v-md-editor-toolbar) {
  background: #f5f5f5;
  border-bottom: 1px solid #e6e6e6;
}
:deep(.v-md-editor-code-line-number) {
  color: #999;
  background: #f8f8f8;
}
:deep(.v-md-editor-tooltip) {
  background: rgba(0,0,0,0.7);
  color: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
}
/* 任务列表样式优化 */
:deep(.v-md-editor-task-list-item) {
  list-style: none;
  padding-left: 20px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 14px;
    height: 14px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  &.is-checked::before {
    background: #409eff;
    border-color: #409eff;
    content: '✓';
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
  }
}
</style>
