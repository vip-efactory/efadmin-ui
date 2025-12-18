<template>
  <div class="drawer-container">
    <!-- 关闭按钮：绝对定位到弹窗右上角（保留新功能） -->
    <el-button
      class="close-btn"
      type="default"
      @click="handleClose"
    >
      ×
    </el-button>

    <div>
      <!-- 标题栏 -->
      <div style="margin-bottom: 12px;">
        <h3 class="drawer-title">{{ $t('settings.title') }}</h3>
      </div>

      <!-- 主题色选择器：调小至20px（保留新功能） -->
      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker style="float: right;height: 20px;margin: -1px 8px 0 0;" @change="themeChange" />
      </div>

      <!-- 开关项：完全恢复旧版原生样式（无自定义） -->
      <div class="drawer-item">
        <span>{{ $t('settings.tagsView') }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.menuUniqueOpened') }}</span>
        <el-switch v-model="uniqueOpened" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'Settings',
  components: {
    ThemePicker
  },
  data() {
    return {}
  },
  computed: {
    // 保留弹窗显示/隐藏逻辑（新功能）
    showSettings: {
      get() { return this.$store.state.settings.showSettings },
      set(val) {
        this.$store.dispatch('settings/changeSetting', { key: 'showSettings', value: val })
      }
    },
    // 开关逻辑和旧版完全一致
    fixedHeader: {
      get() { return this.$store.state.settings.fixedHeader },
      set(val) { this.$store.dispatch('settings/changeSetting', { key: 'fixedHeader', value: val }) }
    },
    tagsView: {
      get() { return this.$store.state.settings.tagsView },
      set(val) { this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: val }) }
    },
    sidebarLogo: {
      get() { return this.$store.state.settings.sidebarLogo },
      set(val) { this.$store.dispatch('settings/changeSetting', { key: 'sidebarLogo', value: val }) }
    },
    uniqueOpened: {
      get() { return this.$store.state.settings.uniqueOpened },
      set(val) { this.$store.dispatch('settings/changeSetting', { key: 'uniqueOpened', value: val }) }
    }
  },
  methods: {
    // 主题色切换逻辑（保留）
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', { key: 'theme', value: val })
    },
    // 关闭弹窗逻辑（新功能）
    handleClose() {
      this.showSettings = false
      this.$store.dispatch('settings/changeSetting', { key: 'showSettings', value: false })
    }
  }
}
</script>

<style lang="scss" scoped>
// 容器基础样式：保留旧版+关闭按钮的相对定位
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right; // 仅保留旧版的右浮动，无其他自定义
    transform: scale(1.2);
  }
}

// 关闭按钮样式（保留新功能，不影响开关）
:deep(.close-btn) {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
  color: #666 !important;
  background: #f5f5f5 !important;
  border: none !important;
  border-radius: 50% !important;
  line-height: 24px !important;
  text-align: center !important;
  cursor: pointer !important;
  box-shadow: none !important;
  transition: background 0.2s ease !important;
  z-index: 10 !important;

  &:hover {
    background: #e0e0e0 !important;
    color: #333 !important;
    border: none !important;
  }
}
</style>
