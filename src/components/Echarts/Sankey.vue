<template>
  <!-- 仅设置容器宽高（匹配原生桑基图默认展示尺寸），无任何额外样式 -->
  <div ref="chartRef" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 1. 仅替换原生 getElementById 为 Vue3 的 ref 引用（唯一必要适配）
const chartRef = ref(null)
let myChart = null

// 2. 完全复制原生代码的初始化逻辑，一行不改（包括数据、配置、注释）
const initChart = () => {
  if (!chartRef.value) return

  // 初始化 ECharts 实例（和原生一致）
  myChart = echarts.init(chartRef.value)

  // 完全复用原生的 option，无任何增删改
  const option = {
    series: {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      data: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'a1'
        },
        {
          name: 'a2'
        },
        {
          name: 'b1'
        },
        {
          name: 'c'
        }
      ],
      links: [
        {
          source: 'a',
          target: 'a1',
          value: 5
        },
        {
          source: 'a',
          target: 'a2',
          value: 3
        },
        {
          source: 'b',
          target: 'b1',
          value: 8
        },
        {
          source: 'a',
          target: 'b1',
          value: 3
        },
        {
          source: 'b1',
          target: 'a1',
          value: 1
        },
        {
          source: 'b1',
          target: 'c',
          value: 2
        }
      ]
    }
  }

  // 和原生一致的渲染逻辑
  option && myChart.setOption(option)
}

// 3. 仅添加必要的生命周期（不影响展示，仅避免内存泄漏）
onMounted(() => {
  nextTick(() => {
    initChart()
    // 保留窗口自适应（原生未处理，但不影响展示，仅为组件健壮性）
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

<!-- 无任何自定义样式，完全和原生一致 -->
<style scoped></style>
