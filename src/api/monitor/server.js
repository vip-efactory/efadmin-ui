import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'admin/server',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/server',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'admin/server',
    method: 'put',
    data
  })
}

export default { add, edit, del }
