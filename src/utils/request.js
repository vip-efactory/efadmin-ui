import axios from 'axios'
import router from '@/router/routers'
import { Notification, MessageBox } from 'element-ui'
import { getToken, getTenant4Dev } from '@/utils/auth'
import Config from '@/settings'
import store from '@/store'
import i18n from '../lang'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    // 携带国际化区域环境参数
    config.headers['locale'] = store.getters.locale
    // 若是开发环境此处可以写死，如果不想使用多租户此处默认为0就可以了。若是线上部署，此处可以不写，由nginx转发时处理是最好的方式！
    config.headers['TENANT_ID'] = getTenant4Dev()
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
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
        Notification.error({
          title: i18n.t('sys.networkRequestTimeout'),
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      if (code === 401) {
        MessageBox.confirm(
          i18n.t('sys.reloginTips') + '',
          i18n.t('sys.systemHint') + '',
          {
            confirmButtonText: i18n.t('sys.reloginBtn'),
            cancelButtonText: i18n.t('crud.cancel'),
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else if (code === 403) {
        router.push({ path: '/401' })
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          })
        }
      }
    } else {
      Notification.error({
        title: i18n.t('sys.interfaceRequestFailed'),
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)
export default service
