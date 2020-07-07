import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore } from '@/utils/store'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    accessToken: '', // 访问token
    refreshToken: '', // 刷新token
    expiresIn: '' // 超时时间
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken
      setStore({
        name: 'access_token',
        content: state.accessToken,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
      setStore({
        name: 'refresh_token',
        content: state.refreshToken,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expiresIn) => {
      state.expiresIn = expiresIn
      setStore({
        name: 'expires_in',
        content: state.expiresIn,
        type: 'session'
      })
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.access_token, rememberMe)
          commit('SET_TOKEN', res.access_token)
          commit('SET_ACCESS_TOKEN', res.access_token)
          commit('SET_REFRESH_TOKEN', res.refresh_token)
          commit('SET_EXPIRES_IN', res.expires_in)
          setUserInfo(res.idcUser, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          if (res.code === 0) {
            setUserInfo(res.data, commit)
            resolve(res.data)
          } else {
            this.$notify(res.msg, 'error')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.code === 0) {
            logOut(commit)
            resolve()
          } else {
            this.$notify(res.msg, 'error')
          }
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res)
}

export default user
