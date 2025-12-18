<template>
  <!-- 修复：ref 属性放在 :style 前面（符合 vue/attributes-order 规范） -->
  <div
    ref="chartRef"
    :class="className"
    :style="{ height, width }"
  />
</template>

<script>
import { initEcharts } from '@/utils/echartsFix'
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' }
  },
  data() {
    return {
      chart: null,
      // 修复：去掉变量名前的下划线（避免 vue/no-reserved-keys 错误）
      resizeHandler: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      // 同步更新变量名
      this.resizeHandler = debounce(this.handleResize, 200)
      window.addEventListener('resize', this.resizeHandler)
    })
  },
  beforeUnmount() {
    // 同步更新变量名
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
    if (this.$refs.chartRef) {
      const instance = echarts.getInstanceByDom(this.$refs.chartRef)
      if (instance) instance.dispose()
    }
    this.chart = null
  },
  methods: {
    initChart() {
      try {
        if (!initEcharts || !this.$refs.chartRef) return

        const oldInstance = echarts.getInstanceByDom(this.$refs.chartRef)
        if (oldInstance) oldInstance.dispose()

        this.chart = initEcharts(this.$refs.chartRef, 'macarons')

        const series = [
          {
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration,
            coordinateSystem: 'cartesian2d'
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration,
            coordinateSystem: 'cartesian2d'
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration,
            coordinateSystem: 'cartesian2d'
          }
        ]

        // 修复：对象闭合括号前无空格（符合 object-curly-spacing 规范）
        const safeSeries = series.filter(item =>
          item && typeof item === 'object' && typeof item.type === 'string'
        )

        this.chart.setOption({
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
          xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: { alignWithLabel: true }
          }],
          yAxis: [{ type: 'value', axisTick: { show: false }}],
          grid: { top: 10, left: '2%', right: '2%', bottom: '3%', containLabel: true },
          series: safeSeries
        })
      } catch (err) {
        console.error('柱状图初始化失败：', err)
      }
    },
    handleResize() {
      if (!this.chart) return
      const validInstance = echarts.getInstanceByDom(this.$refs.chartRef)
      if (validInstance && validInstance === this.chart) {
        this.$nextTick(() => {
          try {
            validInstance.resize()
          } catch (err) {
            console.error('柱状图缩放失败：', err)
          }
        })
      }
    }
  }
}
</script>
