import request from '@/utils/request'

// 高级搜索
export function search(data) {
  return request({
    url: 'api/logs/advanced/query',
    method: 'post',
    data
  })
}

export function getErrDetail(id) {
  return request({
    url: 'api/logs/error/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'api/logs/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'api/logs/del/info',
    method: 'delete'
  })
}

export default { search }
