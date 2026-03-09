<template>
  <div ref="chartRef" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let myChart = null

onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value)

    const option = {
      legend: {
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [20, 90],
          // ✅ 核心修改：垂直位置从50%改为40%（数值越小越往上，可微调）
          center: ['50%', '40%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 36, name: 'rose 1', itemStyle: { color: '#2ec7c9' }},
            { value: 33, name: 'rose 2', itemStyle: { color: '#b6a2de' }},
            { value: 30, name: 'rose 3', itemStyle: { color: '#5ab1ef' }},
            { value: 27, name: 'rose 4', itemStyle: { color: '#ffb980' }},
            { value: 24, name: 'rose 5', itemStyle: { color: '#d87a80' }},
            { value: 21, name: 'rose 6', itemStyle: { color: '#8d98b3' }}
          ]
        }
      ]
    }

    option && myChart.setOption(option)
  }
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<style scoped>
div[ref="chartRef"] {
  margin: 0 auto;
}
</style>
