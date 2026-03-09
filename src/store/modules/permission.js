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

// 创建视图上下文，让Webpack静态分析所有.vue组件
const viewContext = require.context('@/views', true, /\.vue$/)

export const filterAsyncRouter = (routers) => {
  return routers.map(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        router.component = Layout
      } else {
        router.component = loadView(router.component)
      }
    }

    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }

    return router // 🚀 不过滤，全部保留
  })
}
// 过滤掉隐藏的菜单
export function filterMenuRouters(routes) {
  return routes
    .filter(route => route.hidden !== true)
    .map(route => {
      const r = { ...route }
      if (r.children && r.children.length) {
        r.children = filterMenuRouters(r.children)
      }
      return r
    })
}

// 🌟 核心修复：去掉多余的views层级
export const loadView = (view) => {
  try {
    // 正确路径：view = "system/user/index" → "./system/user/index.vue"（相对于@/views）
    const componentPath = `./${view}.vue`

    // 前置校验：组件路径是否存在
    if (!viewContext.keys().includes(componentPath)) {
      throw new Error(`组件文件不存在：${componentPath}`)
    }

    const matchedComponent = viewContext(componentPath)
    // 返回Vue3异步组件格式
    return () => Promise.resolve(matchedComponent.default || matchedComponent)
  } catch (err) {
    return () => Promise.resolve(NotFound)
  }
}

export default permission
