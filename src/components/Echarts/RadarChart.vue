<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 🔥 只导入安全初始化方法 initEcharts，删除多余的 echarts 导入（解决未使用变量报错）
import { initEcharts } from '@/utils/echartsFix'
require('echarts/theme/macarons')
import { debounce } from '@/utils'

const animationDuration = 3000

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
    this.$nextTick(() => this.initChart())
    this.__resizeHandler = debounce(() => this.chart?.resize(), 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart?.dispose()
  },
  methods: {
    initChart() {
      // 🔥 改为判断 initEcharts 是否存在（替代原 echarts 判断）
      if (!initEcharts || !this.$el) return

      // 🔥 用 initEcharts 替代 echarts.init 初始化图表
      this.chart = initEcharts(this.$el, 'macarons')

      const series = [
        {
          type: 'radar', // 保留原有 type 配置
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 13,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
          },
          data: [
            { value: [5, 7, 12, 11, 15, 14], name: 'Allocated Budget' },
            { value: [4, 9, 15, 15, 13, 11], name: 'Expected Spending' },
            { value: [5.5, 11, 12, 15, 12, 12], name: 'Actual Spending' }
          ],
          animationDuration
        }
      ]

      // 保留原有过滤逻辑（双重保障，与 echartsFix 不冲突）
      const safeSeries = series.filter(item => !!item && !!item.type)

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const originValue = params?.value * 1000 || 0
            return `${params?.seriesName || ''}<br/>${params?.name || ''}：${originValue}`
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 3, // 最少刻度（0、10、20）
          alignTicks: false, // 强制关闭
          axisLabel: {
            formatter: (value) => {
              // 只显示3个关键刻度，彻底不拥挤
              return value === 0 || value === 10 || value === 20 ? value : ''
            }
          },
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: 'Sales', max: 20 },
            { name: 'Administration', max: 20 },
            { name: 'Information Techology', max: 20 },
            { name: 'Customer Support', max: 20 },
            { name: 'Development', max: 20 },
            { name: 'Marketing', max: 20 }
          ]
        },
        legend: { left: 'center', bottom: '10', data: ['Allocated Budget', 'Expected Spending', 'Actual Spending'] },
        series: safeSeries
      })
    }
  }
}
</script>
