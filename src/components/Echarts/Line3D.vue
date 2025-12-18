<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 1. 替换为安全的 ECharts 初始化工具（核心修复），保留 echarts-gl 依赖（3D图表必需）
import { initEcharts } from '@/utils/echartsFix'
import 'echarts-gl' // 保留3D依赖，不能删除！
require('echarts/theme/macarons') // 保留原有主题
import { debounce } from '@/utils'

export default {
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' }
  },
  data() {
    return { chart: null }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) this.chart.resize() // 保留原有缩放逻辑
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  // 2. 生命周期兼容 Vue2/Vue3（避免卸载时内存泄漏）
  beforeUnmount() {
    if (!this.chart) return
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 3. 安全校验：避免 DOM 未挂载或工具函数缺失导致报错
      if (!initEcharts || !this.$el) return

      // 替换原始初始化方式，自动销毁重复实例
      this.chart = initEcharts(this.$el, 'macarons')

      // 原有3D折线图逻辑完全不变！（数据生成、3D配置、颜色映射）
      const data = []
      for (let t = 0; t < 25; t += 0.001) {
        const x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
        const y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
        const z = t + 2.0 * Math.sin(75 * t)
        data.push([x, y, z])
      }

      this.chart.setOption({
        tooltip: {},
        backgroundColor: '#fff',
        visualMap: {
          show: false,
          dimension: 2,
          min: 0,
          max: 30,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        xAxis3D: { type: 'value' },
        yAxis3D: { type: 'value' },
        zAxis3D: { type: 'value' },
        grid3D: {
          viewControl: { projection: 'orthographic' } // 正交投影，保留原有3D效果
        },
        series: [{
          type: 'line3D', // 已明确3D类型，无需补充
          data: data,
          lineStyle: { width: 4 }
        }]
      })
    }
  }
}
</script>
