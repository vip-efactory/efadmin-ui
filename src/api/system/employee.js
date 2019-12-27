import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/employee',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/employee/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/employee',
    method: 'put',
    data
  })
}
