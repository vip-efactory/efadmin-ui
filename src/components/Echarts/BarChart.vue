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
    legend: {
      // 调整图例位置，减少顶部留白
      top: 5
    },
    color: ['#2ec7c9', '#b6a2de', '#5ab1ef'],
    tooltip: {},
    dataset: {
      source: [
        ['product', '2015', '2016', '2017'],
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1]
      ]
    },
    // 核心：调整grid（绘图区域）边距，大幅减少留白
    grid: {
      left: 10,
      right: 20,
      top: 40,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
        fontSize: 11,
        margin: 10
      }
    },
    yAxis: {
      axisLabel: {
        margin: 10
      }
    },
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }

  myChart.setOption(option)
}

const resizeChart = () => {
  if (myChart) myChart.resize()
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
