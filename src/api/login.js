import request from '@/utils/request'
// 登录
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken:false,
      'Authorization': 'Basic aWRjOmlkYw=='
    },
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: '/auth/code',
    method: 'get'
  })
}

// export function logout() {
//   return request({
//     url: 'admin/auth/logout',
//     method: 'delete'
//   })
// }

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  const grant_type = 'password'
  // aWRjOmlkYw==    idc:idc
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken:false,
      'Authorization': 'Basic aWRjOmlkYw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'Authorization': 'Basic cGlnOnBpZw==',
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
