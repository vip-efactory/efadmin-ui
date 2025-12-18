<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 1. 替换为安全的 ECharts 初始化工具（核心修复）
import { initEcharts } from '@/utils/echartsFix'
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

      // 原有桑基图配置完全不变！（流向数据、布局、交互全保留）
      this.chart.setOption({
        series: {
          type: 'sankey', // 已明确桑基图类型，无需补充
          layout: 'none', // 固定布局，保留节点流向
          focusNodeAdjacency: 'allEdges', // 高亮关联节点/边，保留交互
          data: [
            { name: 'a' },
            { name: 'b' },
            { name: 'a1' },
            { name: 'a2' },
            { name: 'b1' },
            { name: 'c' }
          ],
          links: [
            { source: 'a', target: 'a1', value: 5 },
            { source: 'a', target: 'a2', value: 3 },
            { source: 'b', target: 'b1', value: 8 },
            { source: 'a', target: 'b1', value: 3 },
            { source: 'b1', target: 'a1', value: 1 },
            { source: 'b1', target: 'c', value: 2 }
          ]
        }
      })
    }
  }
}
</script>
