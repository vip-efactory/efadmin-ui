import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'admin/logs/error/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'admin/logs/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'admin/logs/del/info',
    method: 'delete'
  })
}
