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

      // 原有 Graph 配置完全不变！（节点、链接、样式、交互全保留）
      this.chart.setOption({
        title: { text: 'Graph 简单示例' },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph', // 已明确指定类型，无需补充
            layout: 'none', // 固定布局，保留节点坐标
            symbolSize: 50,
            roam: true, // 支持漫游交互，保留
            label: { normal: { show: true }},
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: { textStyle: { fontSize: 20 }}
            },
            data: [
              { name: '节点1', x: 100, y: 300 },
              { name: '节点2', x: 1000, y: 300 },
              { name: '节点3', x: 550, y: 100 },
              { name: '节点4', x: 550, y: 500 }
            ],
            links: [
              {
                source: 0,
                target: 1,
                symbolSize: [5, 20],
                label: { normal: { show: true }},
                lineStyle: { normal: { width: 5, curveness: 0.2 }}
              },
              {
                source: '节点2',
                target: '节点1',
                label: { normal: { show: true }},
                lineStyle: { normal: { curveness: 0.2 }}
              },
              { source: '节点1', target: '节点3' },
              { source: '节点2', target: '节点3' },
              { source: '节点2', target: '节点4' },
              { source: '节点1', target: '节点4' }
            ],
            lineStyle: {
              normal: { opacity: 0.9, width: 2, curveness: 0 }
            }
          }
        ]
      })
    }
  }
}
</script>
