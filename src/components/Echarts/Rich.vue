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
    height: { type: String, default: '500px' } // 保留原有默认高度500px
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

      // 原有双层环形饼图配置完全不变！（样式、数据、交互全保留）
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie', // 内层饼图，类型明确
            selectedMode: 'single', // 单选选中模式，保留
            radius: [0, '30%'], // 内层半径，保留
            label: { normal: { position: 'inner' }},
            labelLine: { normal: { show: false }},
            data: [
              { value: 335, name: '直达', selected: true },
              { value: 679, name: '营销广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          },
          {
            name: '访问来源',
            type: 'pie', // 外层饼图，类型明确
            radius: ['40%', '55%'], // 外层半径，保留
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                shadowBlur: 3,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowColor: '#999',
                padding: [0, 7],
                rich: {
                  a: { color: '#999', lineHeight: 22, align: 'center' },
                  abg: { backgroundColor: '#333', width: '100%', align: 'right', height: 22, borderRadius: [4, 4, 0, 0] },
                  hr: { borderColor: '#aaa', width: '100%', borderWidth: 0.5, height: 0 },
                  b: { fontSize: 16, lineHeight: 33 },
                  per: { color: '#eee', backgroundColor: '#334455', padding: [2, 4], borderRadius: 2 }
                }
              }
            },
            data: [
              { value: 335, name: '直达' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]
          }
        ]
      })
    }
  }
}
</script>
