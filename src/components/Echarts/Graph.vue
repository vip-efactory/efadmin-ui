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

      // 原有业务逻辑（随机数据、Graph配置）完全不变！
      const axisData = ['周一', '周二', '周三', '很长很长的周四', '周五', '周六', '周日']
      const data = axisData.map(function(item, i) {
        return Math.round(Math.random() * 1000 * (i + 1))
      })
      const links = data.map(function(item, i) {
        return { source: i, target: i + 1 }
      })
      links.pop()

      this.chart.setOption({
        title: { text: '笛卡尔坐标系上的 Graph' },
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: axisData
        },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'graph', // 已明确指定type，无需补充
            layout: 'none',
            coordinateSystem: 'cartesian2d',
            symbolSize: 40,
            label: { normal: { show: true }},
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            data: data,
            links: links,
            lineStyle: { normal: { color: '#2f4554' }}
          }
        ]
      })
    }
  }
}
</script>
