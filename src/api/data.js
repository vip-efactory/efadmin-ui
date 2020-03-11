import request from '@/utils/request'
import qs from 'qs'

export function initData(url, params, method) {
  if (method === 'post' || method === 'POST') { // 高级搜索默认实现
    const conditions = params.conditions
    params.conditions = null // url上不带此参数防止太长有效的数据反而被截掉了！！
    return request({
      url: url + '?' + qs.stringify(params, { indices: false }),
      method: 'post',
      data: { conditions: conditions }
    })
  } else { // 默认抓取分页数据的接口
    return request({
      url: url + '?' + qs.stringify(params, { indices: false }),
      method: 'get'
    })
  }
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
