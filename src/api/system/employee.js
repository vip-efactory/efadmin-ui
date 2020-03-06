import request from '@/utils/request'

// 高级搜索用的方法！
export function search(data) {
  return request({
    url: 'api/employee/advanced/query',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/employee',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/employee/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/employee',
    method: 'put',
    data
  })
}

export default { search, add, edit, del }
