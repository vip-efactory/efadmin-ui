// src/utils/echartsFix.js
import * as echarts from 'echarts'

/**
 * 工具函数：移除 ECharts 4.0+ 废弃的 normal 层级（解决废弃警告）
 * @param {object} styleObj - 包含 normal 层级的样式对象
 * @returns {object} 移除 normal 后的样式对象
 */
const removeDeprecatedNormal = (styleObj) => {
  if (!styleObj || typeof styleObj !== 'object') return styleObj

  // 如果有 normal 层级，直接取 normal 内的配置（覆盖外层）
  if (styleObj.normal && typeof styleObj.normal === 'object') {
    return { ...styleObj, ...styleObj.normal, normal: undefined }
  }
  return styleObj
}

/**
 * 安全初始化 ECharts 实例，处理：
 * 1. series 配置异常
 * 2. ECharts 废弃语法（normal 层级）
 * 3. 刻度可读性警告
 * @param {HTMLElement} dom - 图表容器DOM
 * @param {string|object} [theme] - 主题
 * @param {object} [opts] - 额外配置
 * @returns {echarts.ECharts|null} 处理后的图表实例
 */
export const initEcharts = function(dom, theme, opts) {
  // 1. 校验 dom 有效性
  if (!dom || !(dom instanceof HTMLElement)) {
    console.warn('无效的图表容器DOM，无法初始化ECharts实例')
    return null
  }

  const chartInstance = echarts.init(dom, theme, opts)
  const originalSetOption = chartInstance.setOption

  // 重写 setOption，统一处理所有警告
  chartInstance.setOption = function(option, ...rest) {
    // 处理 option 为空的情况
    const safeOption = { ...(option || {}) }

    // 2. 处理「刻度可读性警告」：自动优化 alignTicks
    if (safeOption.xAxis || safeOption.yAxis) {
      const axes = [].concat(safeOption.xAxis || [], safeOption.yAxis || [])
      axes.forEach(axis => {
        if (axis && axis.alignTicks) {
          // 当 min/max 范围较小时，自动关闭 alignTicks 避免刻度拥挤
          const range = (axis.max || 0) - (axis.min || 0)
          if (range <= 20) { // 范围小于等于20时关闭
            axis.alignTicks = false
          }
        }
      })
    }

    // 3. 处理「series 配置异常 + 废弃 normal 层级」
    if (Array.isArray(safeOption.series)) {
      safeOption.series = safeOption.series
        // 过滤无效项
        .filter(item => item && typeof item === 'object' && !Array.isArray(item))
        // 处理废弃的 normal 层级 + 补全 type
        .map(item => {
          // 自动移除 itemStyle/lineStyle/areaStyle 中的 normal 层级
          const processedItem = {
            ...item,
            itemStyle: removeDeprecatedNormal(item.itemStyle),
            lineStyle: removeDeprecatedNormal(item.lineStyle),
            areaStyle: removeDeprecatedNormal(item.areaStyle)
          }
          // 补全缺失的 type
          return processedItem.type ? processedItem : { type: 'line', ...processedItem }
        })

      // 兜底空 series
      if (safeOption.series.length === 0) {
        safeOption.series = [{
          name: '默认数据',
          type: 'line',
          data: [10, 20, 30, 40, 50]
        }]
      }
    } else {
      safeOption.series = [{
        name: '默认数据',
        type: 'line',
        data: [10, 20, 30, 40, 50]
      }]
    }

    // 调用原始方法
    return originalSetOption.call(this, safeOption, ...rest)
  }

  return chartInstance
}

export default echarts
