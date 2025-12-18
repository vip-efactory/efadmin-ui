import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/index'
// 导入404组件（用于组件不存在时兜底）
import NotFound from '@/views/features/404.vue'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

// 🌟 核心修复：创建视图上下文，让Webpack静态分析所有.vue组件
const viewContext = require.context('@/views', true, /\.vue$/)

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

// 🌟 核心修复：去掉多余的views层级
export const loadView = (view) => {
  try {
    // 正确路径：view = "system/user/index" → "./system/user/index.vue"（相对于@/views）
    const componentPath = `./${view}.vue`
    console.log('🚀 加载组件路径：', componentPath, '所有可用组件：', viewContext.keys())

    // 前置校验：组件路径是否存在
    if (!viewContext.keys().includes(componentPath)) {
      throw new Error(`组件文件不存在：${componentPath}`)
    }

    const matchedComponent = viewContext(componentPath)
    // 返回Vue3异步组件格式
    return () => Promise.resolve(matchedComponent.default || matchedComponent)
  } catch (err) {
    console.warn(`🚨 视图组件 ${view} 加载失败`, err)
    return () => Promise.resolve(NotFound)
  }
}

export default permission
