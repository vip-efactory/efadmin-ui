<template>
  <!-- ECharts 容器，设置明确宽高保证图表正常渲染，兼容你现有布局 -->
  <div id="dynamic-data-chart" style="width: 100%; height: 600px;" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 1. 声明持久化变量（用于初始化、更新、清理资源）
let myChart = null // ECharts实例
let timer = null // 存储setInterval定时器ID，用于组件销毁时清理
let count = 11 // 对应原代码的app.count，用于动态更新x轴数据

// 2. 复制原代码的初始数据生成逻辑（完全复用，保证初始数据一致）
const categories = (function() {
  let now = new Date()
  const res = []
  let len = 10
  while (len--) {
    res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
    now = new Date(+now - 2000)
  }
  return res
})()

const categories2 = (function() {
  const res = []
  let len = 10
  while (len--) {
    res.push(10 - len - 1)
  }
  return res
})()

const data = (function() {
  const res = []
  let len = 10
  while (len--) {
    res.push(Math.round(Math.random() * 1000))
  }
  return res
})()

const data2 = (function() {
  const res = []
  let len = 0
  while (len < 10) {
    res.push(+(Math.random() * 10 + 5).toFixed(1))
    len++
  }
  return res
})()

onMounted(() => {
  // 3. 初始化ECharts实例（DOM挂载完成后执行，获取容器元素）
  const chartDom = document.getElementById('dynamic-data-chart')
  myChart = echarts.init(chartDom)

  // 4. 构建ECharts配置项（与原代码option完全一致，保证图表样式不变）
  const option = {
    title: {
      text: 'Dynamic Data'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      }
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: categories
      },
      {
        type: 'category',
        boundaryGap: true,
        data: categories2
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: 'Price',
        max: 30,
        min: 0,
        boundaryGap: [0.2, 0.2]
      },
      {
        type: 'value',
        scale: true,
        name: 'Order',
        max: 1200,
        min: 0,
        boundaryGap: [0.2, 0.2]
      }
    ],
    series: [
      {
        name: 'Dynamic Bar',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data
      },
      {
        name: 'Dynamic Line',
        type: 'line',
        data: data2
      }
    ]
  }

  // 5. 渲染初始图表
  myChart.setOption(option)

  // 6. 替换原代码的setInterval，实现动态数据更新（逻辑完全一致）
  timer = setInterval(() => {
    const axisData = new Date().toLocaleTimeString().replace(/^\D*/, '')

    // 更新数据数组（删除头部元素，添加新随机数据）
    data.shift()
    data.push(Math.round(Math.random() * 1000))
    data2.shift()
    data2.push(+(Math.random() * 10 + 5).toFixed(1))

    // 更新x轴分类数据
    categories.shift()
    categories.push(axisData)
    categories2.shift()
    categories2.push(count++)

    // 只更新变化的数据（性能更优，无需重新渲染整个option）
    myChart.setOption({
      xAxis: [
        { data: categories },
        { data: categories2 }
      ],
      series: [
        { data: data },
        { data: data2 }
      ]
    })
  }, 2100)
})

onUnmounted(() => {
  // 7. 组件销毁时清理资源，避免内存泄漏（关键！）
  // 清除setInterval定时器，防止组件销毁后继续执行
  if (timer) clearInterval(timer)
  // 销毁ECharts实例，释放内存
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<style scoped>
/* 补充容器样式，兼容你现有父组件的.chart-wrapper布局 */
#dynamic-data-chart {
  margin: 0 auto;
  width: 100%;
  height: 600px;
}
</style>
