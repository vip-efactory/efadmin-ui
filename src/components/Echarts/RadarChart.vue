<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        // 修正 tooltip：适配雷达图的触发方式
        tooltip: {
          trigger: 'item', // 雷达图用item触发（替代axis）
          // 移除无用的axisPointer（雷达图不需要）
          formatter: '{b}: {c}' // 可选：优化提示框显示格式
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 4, // 进一步减少刻度数量（从5→4，更稀疏）
          alignTicks: false,
          // 新增：缩小刻度文字，避免拥挤
          axisName: {
            fontSize: 10 // 刻度名称文字大小
          },
          splitLine: {
            lineStyle: {
              fontSize: 8 // 刻度线文字大小
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
            { name: 'Sales', max: 20000 },
            { name: 'Administration', max: 20000 },
            { name: 'Information Techology', max: 20000 },
            { name: 'Customer Support', max: 20000 },
            { name: 'Development', max: 20000 },
            { name: 'Marketing', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          textStyle: { fontSize: 10 }, // 缩小图例文字
          data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 13,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
          },
          data: [
            { value: [5000, 7000, 12000, 11000, 15000, 14000], name: 'Allocated Budget' },
            { value: [4000, 9000, 15000, 15000, 13000, 11000], name: 'Expected Spending' },
            { value: [5500, 11000, 12000, 15000, 12000, 12000], name: 'Actual Spending' }
          ],
          animationDuration: 3000
        }]
      })
    }
  }
}
</script>
