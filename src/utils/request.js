import axios from 'axios'
import router from '@/router/routers'
// 1. 替换 Element UI 为 Element Plus 组件
import { ElNotification, ElMessageBox } from 'element-plus'
import { getToken, getTenant4Dev } from '@/utils/auth'
import Config from '@/settings'
import store from '@/store'
import i18n from '../lang' // 导入修改后的 vue-i18n@9.x 实例

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 保留原有token逻辑
    }
    config.headers['Content-Type'] = 'application/json'
    // 携带国际化区域环境参数（Vuex4的getters使用正常，无需修改）
    config.headers['locale'] = store.getters.locale
    // 多租户ID逻辑保留
    config.headers['TENANT_ID'] = getTenant4Dev()
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error) // 补充return，避免Promise链断裂
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      // 2. 替换 Notification 为 ElNotification
      ElNotification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        // 3. Vue3 的 i18n 使用 global.t() 替代原有的 t()
        ElNotification.error({
          title: i18n.global.t('sys.networkRequestTimeout'),
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      if (code === 401) {
        // 4. 替换 MessageBox 为 ElMessageBox，i18n 改用 global.t()
        ElMessageBox.confirm(
          i18n.global.t('sys.reloginTips'),
          i18n.global.t('sys.systemHint'),
          {
            confirmButtonText: i18n.global.t('sys.reloginBtn'),
            cancelButtonText: i18n.global.t('crud.cancel'),
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 保留原有逻辑（Vue3中reload仍有效）
          })
        })
      } else if (code === 403) {
        router.push({ path: '/401' }) // Vue Router4 跳转逻辑正常
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          ElNotification.error({
            title: errorMsg,
            duration: 5000
          })
        }
      }
    } else {
      // 5. 接口请求失败的国际化提示
      ElNotification.error({
        title: i18n.global.t('sys.interfaceRequestFailed'),
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)

export default service
