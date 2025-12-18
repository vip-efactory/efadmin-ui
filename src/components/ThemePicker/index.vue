<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    teleport="body"
    @mousedown.stop
    @click.stop
    @touchstart.stop
  />
</template>

<script>
const ORIGINAL_THEME = '#409EFF' // default color

export default {
  name: 'ThemePicker',
  data() {
    return {
      theme: ORIGINAL_THEME
    }
  },
  computed: {
    // 从Vuex获取已保存的主题色
    defaultTheme() {
      return this.$store.state.settings.theme || ORIGINAL_THEME
    }
  },
  watch: {
    // 初始化/同步Vuex中的主题色到组件
    defaultTheme: {
      handler(val) {
        this.theme = val
        // 初始化时同步CSS变量
        this.setCssVariable(val)
      },
      immediate: true
    },
    // 监听主题色变化，更新全局样式（Element Plus 核心逻辑）
    theme(val) {
      if (!val || typeof val !== 'string') return

      // 显示加载提示
      const loadingMsg = this.$message({
        message: '正在切换主题色...',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        icon: 'el-icon-loading' // Element Plus 图标属性调整
      })

      try {
        // 核心：更新Element Plus的CSS变量
        this.setCssVariable(val)
        // 通知父组件更新Vuex
        this.$emit('change', val)
      } catch (e) {
        this.$message.error('主题色切换失败')
        console.error(e)
      } finally {
        // 关闭加载提示
        loadingMsg.close()
      }
    }
  },
  methods: {
    // 设置Element Plus CSS变量（核心方法）
    setCssVariable(primaryColor) {
      const docEl = document.documentElement
      // 主色
      docEl.style.setProperty('--el-color-primary', primaryColor)
      // 主色浅3度
      docEl.style.setProperty('--el-color-primary-light-3', this.tintColor(primaryColor.replace('#', ''), 0.3))
      // 主色浅5度
      docEl.style.setProperty('--el-color-primary-light-5', this.tintColor(primaryColor.replace('#', ''), 0.5))
      // 主色浅7度
      docEl.style.setProperty('--el-color-primary-light-7', this.tintColor(primaryColor.replace('#', ''), 0.7))
      // 主色深2度
      docEl.style.setProperty('--el-color-primary-dark-2', this.shadeColor(primaryColor.replace('#', ''), 0.2))
    },
    // 计算浅色（辅助方法）
    tintColor(color, tint) {
      let r = parseInt(color.slice(0, 2), 16)
      let g = parseInt(color.slice(2, 4), 16)
      let b = parseInt(color.slice(4, 6), 16)

      r += Math.round(tint * (255 - r))
      g += Math.round(tint * (255 - g))
      b += Math.round(tint * (255 - b))

      r = r.toString(16).padStart(2, '0')
      g = g.toString(16).padStart(2, '0')
      b = b.toString(16).padStart(2, '0')

      return `#${r}${g}${b}`
    },
    // 计算深色（辅助方法）
    shadeColor(color, shade) {
      let r = parseInt(color.slice(0, 2), 16)
      let g = parseInt(color.slice(2, 4), 16)
      let b = parseInt(color.slice(4, 6), 16)

      r = Math.round((1 - shade) * r)
      g = Math.round((1 - shade) * g)
      b = Math.round((1 - shade) * b)

      r = r.toString(16).padStart(2, '0')
      g = g.toString(16).padStart(2, '0')
      b = b.toString(16).padStart(2, '0')

      return `#${r}${g}${b}`
    }
  }
}
</script>

<style>
/* 确保颜色选择器下拉层层级最高，显示在所有弹窗上方 */
.theme-picker-dropdown {
  z-index: 999999 !important;
  overflow: visible !important;
}

.theme-message {
  z-index: 999999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

/* 隐藏Element Plus颜色选择器的无用链接按钮 */
.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
