<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <!-- 核心：重构右侧菜单布局为 flex，解决对齐/尺寸问题 -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="header-search-wrapper" />

        <el-tooltip :content="$t('navbar.github')" effect="dark" placement="bottom">
          <Github class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip :content="$t('navbar.fullScreen')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- 修复语言切换下拉：调整 tooltip 位置 + 给 LangSelect 加定位容器 -->
        <el-tooltip :content="$t('navbar.switchLang')" effect="dark" placement="bottom">
          <div class="lang-select-wrapper right-menu-item hover-effect">
            <lang-select ref="langSelect" />
          </div>
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        @click.stop
      >
        <div class="avatar-wrapper">
          <img :src="user.avatar ? baseApi + '/avatar/' + user.avatar : Avatar" class="user-avatar">
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <a target="_blank" href="http://docs.efactory.vip/">
              <el-dropdown-item>{{ $t('navbar.projectDocs') }}</el-dropdown-item>
            </a>
            <!-- 仅改这里：加.stop阻止冒泡 + 手动触发状态更新，确保生效 -->
            <span style="display:block;" @click.stop="handleLayoutSettings">
              <el-dropdown-item>{{ $t('navbar.layoutSettings') }}</el-dropdown-item>
            </span>
            <router-link to="/user/center">
              <el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
            </router-link>
            <span style="display:block;" @click="open">
              <el-dropdown-item divided>{{ $t('navbar.logOut') }}</el-dropdown-item>
            </span>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// 脚本部分不变（仅新增handleLayoutSettings方法）
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Github from '@/components/Github'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Avatar from '@/assets/images/avatar.png'
import LangSelect from '@/components/LangSelect'
import { CaretBottom } from '@element-plus/icons-vue'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search,
    Github,
    CaretBottom
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'user', 'baseApi']),
    show: {
      get() { return this.$store.state.settings.showSettings },
      set(val) {
        this.$store.dispatch('settings/changeSetting', { key: 'showSettings', value: val })
      }
    }
  },
  methods: {
    toggleSideBar() { this.$store.dispatch('app/toggleSideBar') },
    // 新增：手动处理布局设置，强制更新状态
    handleLayoutSettings() {
      this.show = true
      // 兜底：直接dispatch确保状态更新（避免计算属性拦截）
      this.$store.dispatch('settings/changeSetting', { key: 'showSettings', value: true })
    },
    open() {
      this.$confirm(this.$t('sys.logoutTips'), this.$t('sys.warningTitle'), {
        confirmButtonText: this.$t('crud.confirm'),
        cancelButtonText: this.$t('crud.cancel'),
        type: 'warning'
      }).then(() => this.logout())
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => location.reload())
    }
  }
}
</script>

<style lang="scss" scoped>
// 样式完全不变
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  z-index: 100; // 确保 navbar 层级高于下拉

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
    height: 100%;
    line-height: 50px; // 统一面包屑行高
    margin-left: 16px; // 增加间距，避免挤在一起
  }

  // 核心修改：重构右侧菜单为 flex 布局，解决对齐问题
  .right-menu {
    float: right;
    height: 100%;
    display: flex; // 改用 flex 垂直居中
    align-items: center; // 所有子元素垂直居中
    justify-content: flex-end;
    padding-right: 8px; // 右侧内边距，避免贴边

    &:focus {
      outline: none;
    }

    .right-menu-item {
      // 统一按钮尺寸和间距
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px; // 统一高度（小于 navbar 高度，避免溢出）
      width: 40px; // 统一宽度，布局更整齐
      margin: 0 4px; // 统一间距
      font-size: 18px;
      color: #5a5e66;
      cursor: pointer; // 统一鼠标样式
      border-radius: 4px; // 圆角，视觉更统一

      &.hover-effect {
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }
    }
    .header-search-wrapper {
      display: flex;
      align-items: center;
      height: 40px; // 保持一致
      margin: 0 4px;

      // 关键：允许内部元素自动撑开宽度
      width: auto !important;
    }
    // 语言切换容器：解决下拉定位问题
    .lang-select-wrapper {
      position: relative; // 作为下拉的定位基准
      // 覆盖默认尺寸，适配语言组件
      width: auto;
      padding: 0 8px;
      height: 40px;
    }

    // 头像容器：单独调整尺寸，适配头像
    .avatar-container {
      width: auto;
      padding: 0 8px;
      margin-right: 8px; // 减少右侧间距，避免过远

      .avatar-wrapper {
        display: flex;
        align-items: center;
        gap: 4px; // 头像和下拉箭头的间距

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon {
          font-size: 12px;
          color: #5a5e66;
        }
      }
    }
  }
}

// 关键：穿透样式，修复所有下拉组件的层级和定位
:deep(.el-dropdown-menu) {
  z-index: 9999 !important; // 确保下拉不被遮挡
  margin-top: 8px !important; // 下拉距离触发元素的间距，避免靠上
}

// 修复语言切换组件的下拉（如果是 el-select 实现）
:deep(.el-select-dropdown) {
  z-index: 9999 !important;
  top: 100% !important; // 强制下拉在触发元素下方
  margin-top: 4px !important; // 避免贴边
}

// 修复 tooltip 位置（避免和下拉冲突）
:deep(.el-tooltip__popper) {
  z-index: 10000 !important;
}
</style>
