<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils'
import { getChartData } from '@/api/monitor/visits'

export default {
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '350px' },
    autoResize: { type: Boolean, default: true }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      chartData: { visitsData: [], ipData: [] },
      weekDays: []
    }
  },
  mounted() {
    getChartData().then(res => {
      if (res.code === 0) {
        this.chartData.visitsData = res.data.visitsData
        this.chartData.ipData = res.data.ipData
        this.weekDays = res.data.weekDays
        this.initChart()
      } else {
        // 替换掉不存在的 crud.notify，避免报错
        console.error('数据加载失败：', res.msg || '未知错误')
      }
    })
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) return
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }
    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ visitsData, ipData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.weekDays,
          boundaryGap: false,
          axisTick: { show: false }
        },
        // 关键改动1：增大grid的top，给上方图例留空间
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 40, // 从30→40，避免图例和图表重叠
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          padding: [5, 10]
        },
        yAxis: { axisTick: { show: false }},
        // 关键改动2：指定图例在上方居中
        legend: {
          data: ['pv', 'ip'],
          top: 5,
          left: 'center',
          orient: 'horizontal',
          textStyle: { fontSize: 12 }
        },
        series: [{
          name: 'pv',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: { color: '#FF005A', width: 2 }
            }
          },
          smooth: true,
          type: 'line',
          data: visitsData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'ip',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: { color: '#3888fa', width: 2 },
              areaStyle: { color: '#f3f8ff' }
            }
          },
          data: ipData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
