import request from '@/utils/request'

export function getMenusTree() {
  return request({
    url: 'admin/menus/tree',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: 'admin/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/menus',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/menus',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'admin/menus',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree }
