<template>
  <!-- 多子菜单（>=2）：渲染父菜单 -->
  <el-sub-menu
    v-if="item.children && item.children.length >= 2"
    :index="resolvePath(item.path)"
  >
    <template #title>
      <svg-icon :icon-class="item.meta?.icon || 'menu'" />
      <span>{{ item.meta?.title || item.name }}</span>
    </template>

    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(item.path)"
    />
  </el-sub-menu>

  <!-- 单子菜单（==1）：直接渲染子项（不能用 <template>） -->
  <sidebar-item
    v-else-if="item.children && item.children.length === 1"
    :item="item.children[0]"
    :base-path="resolvePath(item.path)"
  />

  <!-- 无子菜单：普通项 -->
  <el-menu-item v-else :index="resolvePath(item.path)">
    <svg-icon :icon-class="item.meta?.icon || 'menu'" />
    <span>{{ item.meta?.title || item.name }}</span>
  </el-menu-item>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon'
import path from 'path' // 新增：引入path模块解析路径
// 只接收item，去掉所有冗余props
const props = defineProps({ // 改动4：修改props接收方式，新增basePath
  item: {
    type: Object,
    required: true
  },
  basePath: { // 新增：接收主组件传递的basePath
    type: String,
    default: ''
  }
})

// 新增：路径解析方法（兼容相对路径/绝对路径）
const resolvePath = (routePath) => {
  if (!routePath) return ''
  // 简单拼接路径（和旧版逻辑一致）
  return path.resolve(props.basePath, routePath)
}
</script>
