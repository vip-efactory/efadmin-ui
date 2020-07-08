import request from '@/utils/request'

export function count() {
  return request({
    url: 'admin/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'admin/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'admin/visits/chartData',
    method: 'get'
  })
}
