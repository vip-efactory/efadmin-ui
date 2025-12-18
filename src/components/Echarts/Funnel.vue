<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 1. 替换安全的 ECharts 初始化方法（核心修复）
import { initEcharts } from '@/utils/echartsFix'
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
        this.chart.resize() // 保持原有缩放逻辑
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  // 2. 生命周期兼容 Vue2/Vue3（可选，规范统一）
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 3. 安全初始化：避免 DOM 未挂载或工具函数未导入的报错
      if (!initEcharts || !this.$el) return

      // 替换原始 echarts.init 为安全初始化方法
      this.chart = initEcharts(this.$el, 'macarons')

      // 原有配置完全保留，无任何修改
      this.chart.setOption({
        title: {
          text: '漏斗图',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['展现', '点击', '访问', '咨询', '订单']
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel', // 已自带 type，无需额外补充
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: [
              { value: 60, name: '访问' },
              { value: 40, name: '咨询' },
              { value: 20, name: '订单' },
              { value: 80, name: '点击' },
              { value: 100, name: '展现' }
            ]
          }
        ]
      })
    }
  }
}
</script>
