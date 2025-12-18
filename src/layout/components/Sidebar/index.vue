<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="$store.state.settings.uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
      >
        <sidebar-item
          v-for="route in permission_routers.filter(route => !route.hidden && route.path && (route.meta?.title || route.children?.length))"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
/* 折叠态菜单固定宽度 + 图标居中 */
:deep(.el-menu--collapse) {
  width: 64px !important; /* 固定宽度，适配图标 */
  text-align: center !important;
}
/* 折叠态隐藏文字，仅显示图标 + 图标固定显示 */
:deep(.el-menu--collapse .el-sub-menu__title span),
:deep(.el-menu--collapse .el-menu-item span) {
  display: none !important;
}
:deep(.el-menu--collapse .svg-icon) {
  display: inline-block !important; /* 强制显示图标 */
  margin: 0 auto !important; /* 图标位置固定居中 */
}

/* 1. 未展开的子菜单标题 + 所有菜单项（默认状态） */
:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  background-color: #304156 !important;
  color: #fff !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}

/* 2. 展开后的子菜单标题（单独改背景/文字色） */
:deep(.el-sub-menu.is-opened .el-sub-menu__title) {
  background-color: #1f2d3d !important; /* 展开后标题背景色（与默认区分） */
  color: #409EFF !important; /* 展开后标题文字色（可选） */
}

/* 3. 展开后的子菜单项（单独改背景/文字色） */
:deep(.el-sub-menu.is-opened .el-menu-item) {
  background-color: #1f2d3d !important; /* 展开后子菜单项背景色（与默认区分） */
  color: #bfcbd9 !important; /* 展开后子菜单项文字色（可选） */
}

/* 可选：展开后子菜单项 hover/选中 样式（增强区分度） */
:deep(.el-sub-menu.is-opened .el-menu-item:hover) {
  background-color: #263445 !important;
}
:deep(.el-sub-menu.is-opened .el-menu-item.is-active) {

  color: #409EFF !important;
}
</style>
