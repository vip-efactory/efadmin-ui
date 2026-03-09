<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language==='zh_CN'" command="zh_CN">
          简体中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language==='en_US'" command="en_US">
          English(US)
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
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
      // 仅新增这一行兼容Vue3的i18n（核心功能不失效），其余不动
      this.$i18n.global ? (this.$i18n.global.locale = lang) : (this.$i18n.locale = lang)
      this.$store.dispatch('app/setLocale', lang)
      window.location.reload()
    }
  }
}
</script>
