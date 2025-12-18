/**
 * Vue3 适配：仅导出路由数组，不创建Router实例（实例创建移到index.js）
 * 保留所有原有业务路由规则，仅移除Vue2的Router相关代码
 */
import Layout from '../layout/index'
import i18n from '../lang/index'

// 静态路由数组（完全保留你的业务规则，仅适配i18n调用方式）
export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home'),
        name: 'Dashboard',
        meta: {
          title: i18n.global.t('navbar.dashboard'), // Vue3 i18n 适配：global.t
          icon: 'index',
          affix: true,
          noCache: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  }
]
