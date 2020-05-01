import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取开发环境的租户信息，注意:开发环境指定租户可以方便测试及开发，正式环境通过nginx全局配置并覆盖此配置。
export function getTenant4Dev() {
  // return Cookies.get(TenantKey)
  return 1 // 此处可以手动指定租户的id,此处为１
}
