// 1. 移除 Vue 导入（Vue3 无默认导出的 Vue 构造函数）
// import Vue from 'vue'
// 2. Vuex4 正确导入方式：导入 createStore 而非整个 Vuex
import { createStore } from 'vuex'
import getters from './getters'

// 3. 移除 Vue.use(Vuex)（Vuex4 无需此步骤）
// Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 4. 替换 new Vuex.Store 为 createStore（Vuex4 核心 API）
const store = createStore({
  // 可选：开发阶段开启严格模式，生产阶段自动关闭
  strict: process.env.NODE_ENV !== 'production',
  modules,
  getters
})

export default store
