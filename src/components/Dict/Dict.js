// 只导入 Vue3 的 reactive（移除不需要的 set）
import { reactive } from 'vue'
import { get as getDictDetail } from '@/api/system/dictDetail'
import CRUD from '@crud/crud'

export default class Dict {
  constructor(initialDict = {}) {
    // 用 reactive 包装为 Vue3 响应式对象
    this.dict = reactive({
      dict: {},
      label: {},
      list: {},
      ...initialDict // 兼容传入的初始数据
    })
  }

  async init(names, completeCallback, crud) {
    // 校验参数
    if (!names || names.length === 0) {
      throw new Error('字典初始化必须传入字典名称列表（names）')
    }

    const requestPromises = []

    names.forEach(dictName => {
      // 1. 直接初始化响应式属性（无需 set，reactive 对象自动响应）
      this.dict.dict[dictName] = {}
      this.dict.label[dictName] = {}
      this.dict.list[dictName] = []
      this.dict[dictName] = []

      // 2. 发起字典请求
      const request = getDictDetail(dictName)
        .then(response => {
          if (response.code === 0) {
            const dictItems = response.data.content || []

            // 2.1 同步字典数组（直接操作数组，reactive 自动响应）
            this.dict[dictName].length = 0 // 清空原有数据
            this.dict[dictName].push(...dictItems)
            this.dict.list[dictName] = [...dictItems] // 同步到 list 容器

            // 2.2 构建键值/值-标签映射（直接赋值，reactive 自动响应）
            dictItems.forEach(item => {
              this.dict.dict[dictName][item.value] = item
              this.dict.label[dictName][item.value] = item.label // value -> 标签文本
            })
          } else {
            // 错误提示（兼容 crud 实例）
            if (crud) {
              crud.notify(response.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            } else {
              console.error(`字典${dictName}初始化失败：`, response.msg)
            }
          }
        })
        .catch(error => {
          console.error(`字典${dictName}请求失败：`, error)
        })

      requestPromises.push(request)
    })

    // 3. 等待所有请求完成后执行回调
    await Promise.all(requestPromises)
    completeCallback?.() // 可选链避免回调不存在的报错
  }
}
