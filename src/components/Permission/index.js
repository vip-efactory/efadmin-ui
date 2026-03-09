// 导入权限指令的核心逻辑（你的权限判断逻辑在 ./permission.js 中，无需改动）
import permission from './permission'

// 🔥 Vue3 适配：install 函数参数改为 app（Vue3 应用实例）
const install = function(app) {
  // 用 Vue3 的 app.directive 注册全局指令（替代 Vue2 的 Vue.directive）
  app.directive('permission', permission)
}

// 🔥 移除 Vue2 兼容代码（window.Vue 不存在于 Vue3）
// 保留插件导出格式，适配 Vue3 的 app.use()
export default { install }
