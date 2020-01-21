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

export default {
  computed: {
    language() {
      return this.$store.getters.locale
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLocale', lang)
      // this.$message({
      //   message: 'Switch Language Success',
      //   type: 'success'
      // })
      // 刷新当前页面,否则后台的菜单信息不会变,
      window.location.reload()
    }
  }
}
</script>
