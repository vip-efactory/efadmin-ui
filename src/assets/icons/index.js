// 1. 移除 Vue2 的 Vue 导入（Vue3 中 Vue 是 undefined，会导致 component 报错）
// import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // 保留 SVG 组件导入

// 2. 导出 Vue3 组件注册函数（接收 app 实例作为参数）
export function registerSvgIcon(app) {
  // Vue3：通过 app 实例注册全局组件（替代 Vue2 的 Vue.component）
  app.component('svg-icon', SvgIcon)
}

// 3. 保留原有自动导入 SVG 图标的逻辑（无需修改）
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
