<template>
  <!-- ECharts 容器，设置明确宽高保证图表正常渲染，兼容你现有父组件布局 -->
  <div id="basic-radar-chart" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 声明持久化变量：存储ECharts实例，用于组件销毁时释放内存
let myChart = null

onMounted(() => {
  // 1. 初始化ECharts实例：DOM挂载完成后获取容器元素，避免DOM获取失败
  const chartDom = document.getElementById('basic-radar-chart')
  myChart = echarts.init(chartDom)

  // 2. 构建ECharts配置项（与原代码option完全一致，保证图表样式、数据不变）
  const option = {
    title: {
      text: 'Basic Radar Chart'
    },
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
      // shape: 'circle', // 注释保留，如需圆形雷达图可取消注释
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
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
/* 补充容器样式，兼容你现有父组件的.chart-wrapper布局，无样式冲突 */
#basic-radar-chart {
  margin: 0 auto;
  width: 100%;
  height: 600px;
}
</style>
