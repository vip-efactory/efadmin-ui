<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 🔥 清理多余导入：只保留安全初始化方法 initEcharts，删除无用的 echarts 导入
import { initEcharts } from '@/utils/echartsFix'
require('echarts/theme/macarons') // 保留原有主题
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
    // 确保DOM完全加载后再初始化图表（保留原有逻辑）
    this.$nextTick(() => {
      this.initChart()
    })
    // 窗口resize防抖自适应（保留原有逻辑）
    this.__resizeHandler = debounce(() => {
      this.chart?.resize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  // Vue3 规范生命周期：beforeDestroy → beforeUnmount（保留原有优化）
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose() // 销毁图表释放资源
    this.chart = null
  },
  methods: {
    initChart() {
      // 🔥 改为判断安全初始化方法是否存在（替代原 echarts 判断）
      if (!initEcharts || !this.$el) return

      // 🔥 用安全初始化方法 initEcharts 替代 echarts.init
      this.chart = initEcharts(this.$el, 'macarons')

      // 保留原有饼图（玫瑰图）完整配置，无任何修改
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        calculable: true,
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie', // 保留原有 type 配置
            roseType: 'radius', // 玫瑰图样式不变
            radius: [15, 95], // 内外半径不变
            center: ['50%', '38%'], // 居中位置不变
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut', // 动画曲线不变
            animationDuration: 2600 // 动画时长不变
          }
        ]
      })
    }
  }
}
</script>
