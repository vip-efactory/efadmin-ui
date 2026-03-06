<template>
  <div ref="chartRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils'
import { getChartData } from '@/api/monitor/visits'

const props = defineProps({
  className: { type: String, default: 'chart' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '350px' },
  autoResize: { type: Boolean, default: true }
})

const chartRef = ref(null)
let chartInstance = null
const chartData = ref({ visitsData: [], ipData: [] })
const weekDays = ref([])
let sidebarElm = null
let __resizeHandler = null

const sidebarResizeHandler = (e) => {
  if (e.propertyName === 'width' && __resizeHandler) {
    __resizeHandler()
  }
}

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value, 'macarons')
  const option = {
    xAxis: {
      data: weekDays.value,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#3888fa',
          width: 1
        }
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 40,
      containLabel: true,
      backgroundColor: '#ffffff'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#3888fa',
          width: 1
        }
      }
    },
    legend: {
      data: ['pv', 'ip'],
      top: 5,
      left: 'center',
      orient: 'horizontal',
      textStyle: { fontSize: 12 }
    },
    series: [{
      name: 'pv',
      itemStyle: { color: '#FF005A' },
      lineStyle: { color: '#FF005A', width: 2 },
      smooth: true,
      type: 'line',
      data: chartData.value.visitsData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: 'ip',
      smooth: true,
      type: 'line',
      itemStyle: { color: '#3888fa' },
      lineStyle: { color: '#3888fa', width: 2 },
      areaStyle: { color: '#f3f8ff' },
      data: chartData.value.ipData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }]
  }

  chartInstance.setOption(option)
}

const loadChartData = () => {
  getChartData().then(res => {
    if (res.code === 0) {
      chartData.value.visitsData = res.data.visitsData
      chartData.value.ipData = res.data.ipData
      weekDays.value = res.data.weekDays
      initChart()
    } else {
      console.error('数据加载失败：', res.msg || '未知错误')
    }
  })
}

onMounted(() => {
  loadChartData()
  if (props.autoResize) {
    __resizeHandler = debounce(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }, 100)
    window.addEventListener('resize', __resizeHandler)
  }
  sidebarElm = document.getElementsByClassName('sidebar-container')[0]
  if (sidebarElm) {
    sidebarElm.addEventListener('transitionend', sidebarResizeHandler)
  }
})

onUnmounted(() => {
  if (props.autoResize && __resizeHandler) {
    window.removeEventListener('resize', __resizeHandler)
  }
  if (sidebarElm) {
    sidebarElm.removeEventListener('transitionend', sidebarResizeHandler)
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch([() => props.width, () => props.height], () => {
  if (chartInstance) {
    chartInstance.resize()
  }
})
</script>
