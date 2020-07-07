import request from '@/utils/request'

export function getCodeImg() {
  return request({
    url: '/admin/auth/code',
    method: 'get'
  })
}

const scope = 'server'
// 登录获取Token
export const login = (username, password, code, uuid) => {
  const grant_type = 'password'
  const randomStr = uuid
  // aWRjOmlkYw==    idc:idc
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'Authorization': 'Basic aWRjOmlkYw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}
// 获取刷新Token
export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}
// 获取用户所有的信息
export const getInfo = () => {
  return request({
    url: '/admin/auth/info',
    method: 'get'
  })
}
// 退出系统
export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
