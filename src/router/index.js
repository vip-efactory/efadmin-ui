// 1. 第一步：替换导入 —— 把 createWebHashHistory 换成 createWebHistory
import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap } from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenus } from '@/api/system/menu'

const router = createRouter({
  // 2. 第二步：替换 history 模式 —— 去掉 Hash 模式的 #
  history: createWebHistory(process.env.BASE_URL), // 仅改这行！从 createWebHashHistory 换成 createWebHistory
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 👇 以下所有代码完全不变，无需修改
NProgress.configure({ showSpinner: false })
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(() => {
          loadMenus(router, next, to)
        }).catch(() => {
          store.dispatch('LogOut').then(() => location.reload())
        })
      } else if (store.getters.loadMenus) {
        store.dispatch('updateLoadMenus').then(() => {})
        loadMenus(router, next, to)
      } else {
        next()
      }
    }
  } else {
    whiteList.includes(to.path) ? next() : next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})

export const loadMenus = async(router, next, to) => {
  try {
    const permissionModule = await import('@/store/modules/permission')
    const filterAsyncRouter = permissionModule.filterAsyncRouter || (() => [])

    const res = await buildMenus()
    const menuData = res?.data || []
    console.log('🚨 接口原始菜单数据：', menuData)
    const asyncRouter = filterAsyncRouter(menuData)

    // 404路由最后添加（避免优先匹配）
    asyncRouter.push({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true,
      name: 'NotFound'
    })

    // 优化路由注册：先父后子，增加校验
    asyncRouter.forEach(route => {
      if (!route.name) {
        console.warn('🚨 路由缺少name，无法注册：', route.path)
        return
      }
      // 注册父路由
      if (route.component && !router.hasRoute(route.name)) {
        router.addRoute(route)
        console.log('✅ 注册父路由：', route.name, '路径：', route.path)
      }
      // 注册子路由（挂载到父路由下）
      if (route.children && Array.isArray(route.children)) {
        route.children.forEach(child => {
          if (!child.name) {
            console.warn('🚨 子路由缺少name，无法注册：', child.path)
            return
          }
          if (!router.hasRoute(child.name)) {
            router.addRoute(route.name, child) // 父路由name作为挂载标识
            console.log('✅ 注册子路由：', child.name, '完整路径：', route.path + '/' + child.path)
          }
        })
      }
    })

    // 打印所有已注册路由（排查用）
    console.log('🚨 所有已注册路由：', router.getRoutes().map(item => ({
      name: item.name,
      path: item.path,
      parentName: item.parentName, // 检查子路由的父路由是否正确
      component: item.component?.name || '未知组件'
    })))

    await store.dispatch('GenerateRoutes', asyncRouter)
    next({ ...to, replace: true })
  } catch (err) {
    console.error('加载菜单失败：', err)
    next('/login')
  }
}

router.afterEach(() => NProgress.done())
export default router
