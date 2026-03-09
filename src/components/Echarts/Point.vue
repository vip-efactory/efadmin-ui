<template>
  <!-- 仅设置容器宽高（匹配原生示例默认尺寸，保证节点位置一致），无其他样式 -->
  <div ref="chartRef" style="width: 900px; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 1. 仅替换原生 getElementById 为 Vue3 的 ref 引用（唯一必要适配）
const chartRef = ref(null)
let myChart = null

// 2. 完全复制原生代码的初始化逻辑，一行不改（包括注释、配置、数据）
const initChart = () => {
  if (!chartRef.value) return

  // 初始化 ECharts 实例（和原生一致）
  myChart = echarts.init(chartRef.value)

  // 完全复用原生的 option，包括注释、格式、配置
  const option = {
    title: {
      text: 'Basic Graph'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: {
          show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: [
          {
            name: 'Node 1',
            x: 300,
            y: 300
          },
          {
            name: 'Node 2',
            x: 800,
            y: 300
          },
          {
            name: 'Node 3',
            x: 550,
            y: 100
          },
          {
            name: 'Node 4',
            x: 550,
            y: 500
          }
        ],
        // links: [],
        links: [
          {
            source: 0,
            target: 1,
            symbolSize: [5, 20],
            label: {
              show: true
            },
            lineStyle: {
              width: 5,
              curveness: 0.2
            }
          },
          {
            source: 'Node 2',
            target: 'Node 1',
            label: {
              show: true
            },
            lineStyle: {
              curveness: 0.2
            }
          },
          {
            source: 'Node 1',
            target: 'Node 3'
          },
          {
            source: 'Node 2',
            target: 'Node 3'
          },
          {
            source: 'Node 2',
            target: 'Node 4'
          },
          {
            source: 'Node 1',
            target: 'Node 4'
          }
        ],
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    ]
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
