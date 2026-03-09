<template>
  <div ref="chartRef" class="echarts-container" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let myChart = null

const initChart = () => {
  const chartDom = chartRef.value
  if (!chartDom) return

  myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // 关键1：删除图例中的 Step End 选项
      data: ['Step Start', 'Step Middle']
    },
    grid: {
      left: 10,
      right: 20,
      top: 40,
      bottom: 50,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Step Start',
        type: 'line',
        smooth: true,
        color: '#5ab1ef',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Step Middle',
        type: 'line',
        smooth: true,
        color: '#d87a80',
        data: [220, 282, 201, 234, 290, 430, 410]
      }
      // 关键2：删除 Step End 对应的系列配置（整段移除）
    ]
  }

  myChart.setOption(option)
}

const resizeChart = () => {
  if (myChart) {
    myChart.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>
