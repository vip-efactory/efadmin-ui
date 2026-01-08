<template>
  <!-- 仅保留容器，不添加任何额外样式，宽高适配原生展示效果 -->
  <div ref="chartRef" style="width: 800px; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 1. 仅替换原生 getElementById 为 Vue3 的 ref 引用
const chartRef = ref(null)
let myChart = null

// 2. 完全复用原生代码的初始化逻辑，一行不改
const initChart = () => {
  if (!chartRef.value) return

  // 初始化 ECharts 实例（和原生一致）
  myChart = echarts.init(chartRef.value)

  // 完全复用原生的数据生成逻辑
  const axisData = ['Mon', 'Tue', 'Wed', 'Very Loooong Thu', 'Fri', 'Sat', 'Sun']
  const data = axisData.map(function(item, i) {
    return Math.round(Math.random() * 1000 * (i + 1))
  })
  const links = data.map(function(item, i) {
    return {
      source: i,
      target: i + 1
    }
  })
  links.pop()

  // 完全复用原生的 option，无任何修改
  const option = {
    title: {
      text: 'Graph on Cartesian'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: axisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        symbolSize: 40,
        label: {
          show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: data,
        links: links,
        lineStyle: {
          color: '#2f4554'
        }
      }
    ]
  }

  // 和原生一致的渲染逻辑
  option && myChart.setOption(option)
}

// 3. 仅添加必要的生命周期管理（避免内存泄漏，不影响展示效果）
onMounted(() => {
  nextTick(() => {
    initChart()
    // 保留窗口自适应（原生代码未处理，但不影响展示，仅为组件健壮性）
    window.addEventListener('resize', () => myChart?.resize())
  })
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', () => myChart?.resize())
})
</script>

<!-- 不添加任何额外样式，完全和原生一致 -->
<style scoped></style>
