<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh_CN'" command="zh_CN">
        简体中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en_US'" command="en_US">
        English(US)
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ja_JP'" command="ja_JP">
        日本語
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { switchLocale } from '@/utils/locale'

export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
    // this.$i18n.locale = lang
    // this.$store.dispatch('app/setLanguage', lang)
    // 设定Cookie里的locale的值
      switchLocale(lang)
      this.$message({
        message: 'Switch Language Success',
        type: 'success'
      })
    }
  }
}
</script>
