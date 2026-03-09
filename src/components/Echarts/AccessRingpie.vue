<template>
  <!-- ECharts 容器，设置明确宽高保证图表正常渲染，兼容你现有父组件布局 -->
  <div id="access-ring-pie-chart" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 声明持久化变量：存储ECharts实例，用于后续销毁释放内存
let myChart = null

onMounted(() => {
  // 1. 初始化ECharts实例：DOM挂载完成后获取容器元素，避免获取不到DOM
  const chartDom = document.getElementById('access-ring-pie-chart')
  myChart = echarts.init(chartDom)

  // 2. 构建ECharts配置项（与原代码option完全一致，保证图形样式、交互不变）
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'], // 内外半径，实现环形效果（原代码核心配置）
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10, // 圆角效果，原代码核心样式
          borderColor: '#fff', // 区块边框白色
          borderWidth: 2 // 区块边框宽度
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  }

  // 3. 渲染图表：将配置项设置到ECharts实例中
  myChart.setOption(option)
})

onUnmounted(() => {
  // 4. 组件销毁时清理资源，避免内存泄漏（关键！）
  if (myChart) {
    myChart.dispose() // 销毁ECharts实例，释放内存
    myChart = null // 清空变量，避免残留引用
  }
})
</script>

<style scoped>
/* 补充容器样式，兼容你现有父组件的.chart-wrapper布局，保证无样式冲突 */
#access-ring-pie-chart {
  margin: 0 auto;
  width: 100%;
  height: 600px;
}
</style>
