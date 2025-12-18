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
  // 2. 生命周期兼容 Vue2/Vue3（避免内存泄漏）
  beforeUnmount() {
    if (!this.chart) return
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 3. 安全校验：避免 DOM 未挂载或工具函数缺失
      if (!initEcharts || !this.$el) return

      // 替换原始初始化方式，自动销毁重复实例
      this.chart = initEcharts(this.$el, 'macarons')

      // 原有旭日图配置完全不变！（家族树形数据、样式全保留）
      const data = [{
        name: 'Grandpa',
        children: [{
          name: 'Uncle Leo',
          value: 15,
          children: [{
            name: 'Cousin Jack',
            value: 2
          }, {
            name: 'Cousin Mary',
            value: 5,
            children: [{
              name: 'Jackson',
              value: 2
            }]
          }, {
            name: 'Cousin Ben',
            value: 4
          }]
        }, {
          name: 'Father',
          value: 10,
          children: [{
            name: 'Me',
            value: 5
          }, {
            name: 'Brother Peter',
            value: 1
          }]
        }]
      }, {
        name: 'Nancy',
        children: [{
          name: 'Uncle Nike',
          children: [{
            name: 'Cousin Betty',
            value: 1
          }, {
            name: 'Cousin Jenny',
            value: 2
          }]
        }]
      }]

      this.chart.setOption({
        series: {
          type: 'sunburst', // 明确旭日图类型
          data: data,
          radius: [0, '90%'], // 半径范围保留
          label: { rotate: 'radial' } // 径向标签，保留原有样式
        }
      })
    }
  }
}
</script>
